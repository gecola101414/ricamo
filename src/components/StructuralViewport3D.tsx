import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  BeamFemVerification,
  ColumnFemVerification,
  DiagramOverlayType,
  StructuralProjectModel,
  ViewportDisplayMode,
} from "../types/structural";
import {
  Box,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Layers,
  Maximize2,
  RotateCcw,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface StructuralViewport3DProps {
  project: StructuralProjectModel;
  beamVerifications: Record<string, BeamFemVerification>;
  columnVerifications: Record<string, ColumnFemVerification>;
  selectedElementId: string;
  onSelectElement: (id: string, kind: "beam" | "column") => void;
  displayMode: ViewportDisplayMode;
  onChangeDisplayMode: (mode: ViewportDisplayMode) => void;
  diagramOverlay: DiagramOverlayType;
  onChangeDiagramOverlay: (overlay: DiagramOverlayType) => void;
  explodedTarget: number;
  onChangeExplodedTarget: (val: number) => void;
  isDark: boolean;
}

export type CameraPresetId = "iso" | "front_xz" | "side_yz" | "plan_xy" | "node_zoom";

// Reusable module-scope math helpers (zero GC in render loop)
const _vStart = new THREE.Vector3();
const _vEnd = new THREE.Vector3();
const _vDir = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _upX = new THREE.Vector3(1, 0, 0);

function createConcreteTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(0, 0, 256, 256);

  // Procedural aggregate speckles and formwork lines
  for (let i = 0; i < 2400; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    const shade = 130 + ((i * 29) % 45);
    ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 10})`;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.strokeStyle = "rgba(71, 85, 105, 0.22)";
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export const StructuralViewport3D: React.FC<StructuralViewport3DProps> = ({
  project,
  beamVerifications,
  columnVerifications,
  selectedElementId,
  onSelectElement,
  displayMode,
  onChangeDisplayMode,
  diagramOverlay,
  onChangeDiagramOverlay,
  explodedTarget,
  onChangeExplodedTarget,
  isDark,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<{
    id: string;
    label: string;
    summary: string;
  } | null>(null);

  // Mutable refs for WebGL scene interaction without tearing down canvas
  const stateRef = useRef({
    project,
    beamVerifications,
    columnVerifications,
    selectedElementId,
    displayMode,
    diagramOverlay,
    explodedTarget,
    explodedCurrent: 0,
    isDark,
    onSelectElement,
  });

  useEffect(() => {
    stateRef.current.project = project;
    stateRef.current.beamVerifications = beamVerifications;
    stateRef.current.columnVerifications = columnVerifications;
    stateRef.current.selectedElementId = selectedElementId;
    stateRef.current.displayMode = displayMode;
    stateRef.current.diagramOverlay = diagramOverlay;
    stateRef.current.explodedTarget = explodedTarget;
    stateRef.current.isDark = isDark;
    stateRef.current.onSelectElement = onSelectElement;
  }, [
    project,
    beamVerifications,
    columnVerifications,
    selectedElementId,
    displayMode,
    diagramOverlay,
    explodedTarget,
    isDark,
    onSelectElement,
  ]);

  const sceneApiRef = useRef<{
    rebuildModel: () => void;
    requestRender: () => void;
    flyToPreset: (preset: CameraPresetId) => void;
    updateThemeColors: () => void;
  } | null>(null);

  // Trigger scene rebuild when structural data or display modes change
  useEffect(() => {
    if (sceneApiRef.current) {
      sceneApiRef.current.rebuildModel();
      sceneApiRef.current.requestRender();
    }
  }, [project, beamVerifications, columnVerifications, selectedElementId, displayMode, diagramOverlay]);

  useEffect(() => {
    if (sceneApiRef.current) {
      sceneApiRef.current.updateThemeColors();
      sceneApiRef.current.requestRender();
    }
  }, [isDark]);

  useEffect(() => {
    if (sceneApiRef.current) {
      sceneApiRef.current.requestRender();
    }
  }, [explodedTarget]);

  // Keyboard shortcut 'H' for collapsing/expanding the bottom dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === "h") {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection
    const isSoftwareGl = (() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 620;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = stateRef.current.isDark ? 0x0b1120 : 0xf1f5f9;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.018);

    // 2. Studio Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Note: In structural engineering (NTC/JSON), [x, y, z] has z as vertical elevation.
    // We map structural [X, Y, Z] -> Three.js [X, Z_up, -Y_depth] so Y is up in Three.js!
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 250);
    camera.position.set(13.5, 8.2, 11.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(5.0, 1.8, -2.25);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 + 0.18;
    controls.minDistance = 1.5;
    controls.maxDistance = 55;
    controls.update();

    // 3. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.85);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.65);
    keyLight.position.set(14, 22, 16);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.left = -14;
      keyLight.shadow.camera.right = 14;
      keyLight.shadow.camera.top = 14;
      keyLight.shadow.camera.bottom = -14;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 50;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-12, 10, -14);
    scene.add(rimLight);

    // Ground Contact Plane & Engineering Grid
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    const groundPlaneGeo = new THREE.PlaneGeometry(42, 42);
    const groundPlaneMat = new THREE.MeshStandardMaterial({
      color: stateRef.current.isDark ? 0x0f172a : 0xe2e8f0,
      roughness: 0.92,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const groundMesh = new THREE.Mesh(groundPlaneGeo, groundPlaneMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(5, -0.58, -2.25);
    groundMesh.receiveShadow = true;
    groundGroup.add(groundMesh);

    const gridHelper = new THREE.GridHelper(
      30,
      30,
      stateRef.current.isDark ? 0x334155 : 0x94a3b8,
      stateRef.current.isDark ? 0x1e293b : 0xcbd5e1
    );
    gridHelper.position.set(5, -0.56, -2.25);
    groundGroup.add(gridHelper);

    // Procedural textures & shared materials
    const concreteTexture = createConcreteTexture(renderer);

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const clickableMeshes: THREE.Object3D[] = [];
    const explodableParts: Array<{
      obj: THREE.Object3D;
      basePos: THREE.Vector3;
      explodeDelta: THREE.Vector3;
    }> = [];

    // Helper: convert structural coordinates [x, y, z] -> Three.js Vector3(x, z, -y)
    const toWorld = (pt: [number, number, number]): THREE.Vector3 => {
      return new THREE.Vector3(pt[0], pt[2], -pt[1]);
    };

    const rebuildModel = () => {
      // Clean previous children
      while (modelRoot.children.length > 0) {
        const child = modelRoot.children[0];
        modelRoot.remove(child);
      }
      clickableMeshes.length = 0;
      explodableParts.length = 0;

      const {
        project: proj,
        beamVerifications: bVerifs,
        selectedElementId: selId,
        displayMode: mode,
        diagramOverlay: diag,
      } = stateRef.current;

      // Materials calibrated per mode
      const isXray = mode === "xray_rebar";
      const isWire = mode === "wireframe_fem";

      const matConcreteFootings = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        map: concreteTexture,
        roughness: 0.85,
        metalness: 0.08,
        transparent: isXray,
        opacity: isXray ? 0.24 : 1.0,
        depthWrite: !isXray,
      });

      const matTopRebar = new THREE.MeshStandardMaterial({
        color: 0xf97316, // High-visibility structural orange for top tension bars
        roughness: 0.24,
        metalness: 0.88,
      });

      const matBotRebar = new THREE.MeshStandardMaterial({
        color: 0x06b6d4, // Cyan steel for bottom bars
        roughness: 0.24,
        metalness: 0.88,
      });

      const matColRebar = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald steel for vertical column bars
        roughness: 0.26,
        metalness: 0.85,
      });

      const matStirrupEnd = new THREE.MeshStandardMaterial({
        color: 0xfacc15, // Gold/Amber for dissipative zone stirrups
        roughness: 0.3,
        metalness: 0.82,
      });

      const matStirrupMid = new THREE.MeshStandardMaterial({
        color: 0x94a3b8, // Brushed steel for mid-span stirrups
        roughness: 0.32,
        metalness: 0.8,
      });

      // 1. BUILD FOOTINGS (Plinti di Fondazione compositi a 4 parti)
      for (const foot of proj.elements.footings) {
        const footGroup = new THREE.Group();
        const centerW = toWorld(foot.center);
        footGroup.position.copy(centerW);

        if (!isWire) {
          // Base block (65% height)
          const hBase = foot.heightZ * 0.65;
          const baseGeo = new THREE.BoxGeometry(foot.widthX, hBase, foot.lengthY);
          const baseMesh = new THREE.Mesh(baseGeo, matConcreteFootings);
          baseMesh.position.y = -foot.heightZ * 0.175;
          baseMesh.receiveShadow = true;
          baseMesh.castShadow = !isSoftwareGl && !isXray;
          footGroup.add(baseMesh);

          // Top socket collar (Bicchiere/Colletto)
          const collarGeo = new THREE.BoxGeometry(foot.widthX * 0.52, foot.heightZ * 0.45, foot.lengthY * 0.52);
          const collarMesh = new THREE.Mesh(collarGeo, matConcreteFootings);
          collarMesh.position.y = foot.heightZ * 0.22;
          footGroup.add(collarMesh);

          // Edge lines
          const edges = new THREE.EdgesGeometry(baseGeo);
          const lineMat = new THREE.LineBasicMaterial({
            color: isXray ? 0x475569 : 0x334155,
            transparent: true,
            opacity: 0.55,
          });
          const edgeLines = new THREE.LineSegments(edges, lineMat);
          edgeLines.position.copy(baseMesh.position);
          footGroup.add(edgeLines);
        }

        // Bottom rebar grid inside footing (visible in X-Ray or Exploded)
        if (isXray || stateRef.current.explodedCurrent > 0.02) {
          const rebarGridGroup = new THREE.Group();
          const barRad = (foot.rebarDiameter / 1000) * 0.65;
          const stepM = foot.rebarStepCm / 100;
          const countX = Math.floor((foot.widthX - 0.16) / stepM);
          for (let i = 0; i <= countX; i++) {
            const offset = -((foot.widthX - 0.16) / 2) + i * stepM;
            const barGeoX = new THREE.CylinderGeometry(barRad, barRad, foot.lengthY - 0.14, 8);
            barGeoX.rotateX(Math.PI / 2);
            const mX = new THREE.Mesh(barGeoX, matBotRebar);
            mX.position.set(offset, -foot.heightZ * 0.36, 0);
            rebarGridGroup.add(mX);

            const barGeoZ = new THREE.CylinderGeometry(barRad, barRad, foot.widthX - 0.14, 8);
            barGeoZ.rotateZ(Math.PI / 2);
            const mZ = new THREE.Mesh(barGeoZ, matTopRebar);
            mZ.position.set(0, -foot.heightZ * 0.36 + barRad * 2, offset);
            rebarGridGroup.add(mZ);
          }
          footGroup.add(rebarGridGroup);
        }

        modelRoot.add(footGroup);
        explodableParts.push({
          obj: footGroup,
          basePos: centerW.clone(),
          explodeDelta: new THREE.Vector3(0, -0.75, 0),
        });
      }

      // 2. BUILD COLUMNS (Pilastri C.A. + Gabbia Armatura + Staffe Zona Critica)
      for (const col of proj.elements.columns) {
        const isSelected = selId === col.id;
        const verif = stateRef.current.columnVerifications[col.id];
        const baseW = toWorld(col.base_node);
        const topW = toWorld(col.top_node);
        const H = topW.y - baseW.y;
        const midW = new THREE.Vector3().addVectors(baseW, topW).multiplyScalar(0.5);

        const colGroup = new THREE.Group();
        colGroup.position.copy(midW);

        const bM = col.section.b / 100;
        const hM = col.section.h / 100;

        // Concrete shell
        if (!isWire) {
          const shellColor = isSelected
            ? 0xf59e0b
            : verif?.status === "NON_VERIFICATO"
            ? 0xef4444
            : 0x94a3b8;

          const colMat = new THREE.MeshPhysicalMaterial({
            color: shellColor,
            map: isXray ? null : concreteTexture,
            roughness: isXray ? 0.25 : 0.78,
            metalness: 0.08,
            transparent: isXray,
            opacity: isXray ? (isSelected ? 0.32 : 0.18) : 1.0,
            depthWrite: !isXray,
          });

          const colGeo = new THREE.BoxGeometry(bM, H, hM);
          const colMesh = new THREE.Mesh(colGeo, colMat);
          colMesh.castShadow = !isSoftwareGl && !isXray;
          colMesh.receiveShadow = true;
          colMesh.userData = { elementId: col.id, kind: "column", label: col.label };
          colGroup.add(colMesh);
          clickableMeshes.push(colMesh);

          const edges = new THREE.EdgesGeometry(colGeo);
          const edgeMat = new THREE.LineBasicMaterial({
            color: isSelected ? 0xfbbf24 : isXray ? 0x64748b : 0x334155,
            transparent: true,
            opacity: isSelected ? 1.0 : 0.55,
          });
          colGroup.add(new THREE.LineSegments(edges, edgeMat));
        } else {
          // Unifilar FEM axis for column
          const pts = [new THREE.Vector3(0, -H / 2, 0), new THREE.Vector3(0, H / 2, 0)];
          const axisGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const axisMat = new THREE.LineBasicMaterial({
            color: isSelected ? 0xf59e0b : 0x10b981,
          });
          colGroup.add(new THREE.Line(axisGeo, axisMat));

          // Invisible raycast proxy
          const proxyGeo = new THREE.BoxGeometry(bM, H, hM);
          const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
          const proxyMesh = new THREE.Mesh(proxyGeo, proxyMat);
          proxyMesh.userData = { elementId: col.id, kind: "column", label: col.label };
          colGroup.add(proxyMesh);
          clickableMeshes.push(proxyMesh);
        }

        // Column 3D Rebar Cage (Longitudinal vertical bars + starter bars + confinement stirrups)
        if (isXray || mode === "solid") {
          const cageGroup = new THREE.Group();
          const coverM = (col.section.coverCm || 3.5) / 100;
          const halfX = bM / 2 - coverM;
          const halfZ = hM / 2 - coverM;
          const barRadius = Math.max((col.longitudinalBars.diameter / 1000) * 0.55, 0.008);
          const barLen = H + 0.35; // includes starter overlap into node

          const cornerCoords = [
            [-halfX, -halfZ],
            [halfX, -halfZ],
            [halfX, halfZ],
            [-halfX, halfZ],
            [0, -halfZ],
            [0, halfZ],
            [-halfX, 0],
            [halfX, 0],
          ];

          const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, barLen, 10);
          for (const [cx, cz] of cornerCoords) {
            const barMesh = new THREE.Mesh(barGeo, matColRebar);
            barMesh.position.set(cx, 0.08, cz);
            cageGroup.add(barMesh);
          }

          // Column stirrups (dense at ends, wider at mid-height)
          const stRad = 0.0045;
          let yCursor = -H / 2 + 0.06;
          while (yCursor <= H / 2 - 0.05) {
            const distFromEnd = Math.min(yCursor - -H / 2, H / 2 - yCursor);
            const inCritZone = distFromEnd <= col.stirrups.endZoneLengthM;
            const stepM = (inCritZone ? col.stirrups.endStepCm : col.stirrups.midStepCm) / 100;
            const stMat = inCritZone ? matStirrupEnd : matStirrupMid;

            // Rectangular closed loop
            const loopPts = [
              new THREE.Vector3(-halfX, yCursor, -halfZ),
              new THREE.Vector3(halfX, yCursor, -halfZ),
              new THREE.Vector3(halfX, yCursor, halfZ),
              new THREE.Vector3(-halfX, yCursor, halfZ),
              new THREE.Vector3(-halfX, yCursor, -halfZ),
            ];
            const loopCurve = new THREE.CatmullRomCurve3(loopPts, true, "catmullrom", 0.02);
            const loopGeo = new THREE.TubeGeometry(loopCurve, 20, stRad, 6, true);
            cageGroup.add(new THREE.Mesh(loopGeo, stMat));

            yCursor += stepM;
          }

          colGroup.add(cageGroup);
          // Explode column rebar cage slightly outwards when exploded slider > 0
          const radialDir = new THREE.Vector3(midW.x - 5.0, 0, midW.z - -2.25);
          if (radialDir.lengthSq() < 0.01) radialDir.set(0, 0, 1);
          radialDir.normalize().multiplyScalar(0.55);
          explodableParts.push({
            obj: cageGroup,
            basePos: new THREE.Vector3(0, 0, 0),
            explodeDelta: radialDir,
          });
        }

        modelRoot.add(colGroup);
      }

      // 3. BUILD BEAMS (Travi C.A. + Correnti Sagomati 3D + Staffe a Passo Differenziato + Diagrammi FEM)
      for (const beam of proj.elements.beams) {
        const isSelected = selId === beam.id;
        const verif = bVerifs[beam.id];
        _vStart.copy(toWorld(beam.start_node));
        _vEnd.copy(toWorld(beam.end_node));
        _vDir.subVectors(_vEnd, _vStart);
        const L = _vDir.length();
        _vDir.normalize();
        _vMid.addVectors(_vStart, _vEnd).multiplyScalar(0.5);

        const bM = beam.section.b / 100;
        const hM = beam.section.h / 100;
        const coverM = (beam.section.coverCm || 3.5) / 100;

        // Beam local group aligned with X axis = beam span, Y axis = vertical height, Z axis = width b
        const beamGroup = new THREE.Group();
        // Shift vertical center down by hM/2 so top of beam is flush with floor elevation z=3.2m
        beamGroup.position.set(_vMid.x, _vMid.y - hM / 2, _vMid.z);
        _quat.setFromUnitVectors(_upX, _vDir);
        beamGroup.quaternion.copy(_quat);

        // 3A. Concrete Casing Shell
        if (!isWire) {
          const shellGroup = new THREE.Group();
          const shellColor = isSelected
            ? 0xf59e0b
            : verif?.status === "NON_VERIFICATO"
            ? 0xef4444
            : 0xcbd5e1;

          const beamMat = new THREE.MeshPhysicalMaterial({
            color: shellColor,
            map: isXray ? null : concreteTexture,
            roughness: isXray ? 0.2 : 0.72,
            metalness: 0.06,
            transparent: isXray,
            opacity: isXray ? (isSelected ? 0.3 : 0.16) : 1.0,
            depthWrite: !isXray,
          });

          const beamGeo = new THREE.BoxGeometry(L, hM, bM);
          const beamMesh = new THREE.Mesh(beamGeo, beamMat);
          beamMesh.castShadow = !isSoftwareGl && !isXray;
          beamMesh.receiveShadow = true;
          beamMesh.userData = { elementId: beam.id, kind: "beam", label: beam.label };
          shellGroup.add(beamMesh);
          clickableMeshes.push(beamMesh);

          const edges = new THREE.EdgesGeometry(beamGeo);
          const edgeMat = new THREE.LineBasicMaterial({
            color: isSelected ? 0xfbbf24 : isXray ? 0x38bdf8 : 0x475569,
            transparent: true,
            opacity: isSelected ? 1.0 : 0.65,
          });
          shellGroup.add(new THREE.LineSegments(edges, edgeMat));

          beamGroup.add(shellGroup);

          // In exploded mode, lift the concrete casing upward to reveal the internal rebar cage
          explodableParts.push({
            obj: shellGroup,
            basePos: new THREE.Vector3(0, 0, 0),
            explodeDelta: new THREE.Vector3(0, 0.95, 0),
          });
        } else {
          // Wireframe FEM mode: unifilar line + end node spheres + clickable proxy
          const axisPts = [new THREE.Vector3(-L / 2, hM / 2, 0), new THREE.Vector3(L / 2, hM / 2, 0)];
          const axisGeo = new THREE.BufferGeometry().setFromPoints(axisPts);
          const axisMat = new THREE.LineBasicMaterial({
            color: isSelected ? 0xf59e0b : 0x38bdf8,
          });
          beamGroup.add(new THREE.Line(axisGeo, axisMat));

          const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
          const nodeMat = new THREE.MeshStandardMaterial({
            color: isSelected ? 0xf59e0b : 0xe2e8f0,
            roughness: 0.25,
            metalness: 0.7,
          });
          const n1 = new THREE.Mesh(nodeGeo, nodeMat);
          n1.position.set(-L / 2, hM / 2, 0);
          const n2 = new THREE.Mesh(nodeGeo, nodeMat);
          n2.position.set(L / 2, hM / 2, 0);
          beamGroup.add(n1, n2);

          const proxyGeo = new THREE.BoxGeometry(L, hM, bM);
          const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
          const proxyMesh = new THREE.Mesh(proxyGeo, proxyMat);
          proxyMesh.userData = { elementId: beam.id, kind: "beam", label: beam.label };
          beamGroup.add(proxyMesh);
          clickableMeshes.push(proxyMesh);
        }

        // 3B. 3D REBAR ENGINE (Correnti Superiori con pieghe 90°, Correnti Inferiori, Staffe a 3 Zone)
        if (!isWire) {
          const topBarSpec = beam.reinforcement_3d.longitudinal_top[0];
          const botBarSpec = beam.reinforcement_3d.longitudinal_bottom[0];
          const stirrupSpec = beam.reinforcement_3d.stirrups;

          const usableZ = bM - 2 * coverM - 0.02;

          // Top Longitudinal Bars Group (Orange Steel with 90° downward anchorage hooks)
          if (topBarSpec && topBarSpec.quantity > 0) {
            const topBarsGroup = new THREE.Group();
            const rad = Math.max((topBarSpec.diameter / 1000) * 0.6, 0.0085);
            const yTop = hM / 2 + (topBarSpec.z_offset || -0.04);
            const hookLen = Math.min(topBarSpec.hookLengthM || 0.24, hM - 2 * coverM);
            const xStart = -L / 2 + coverM;
            const xEnd = L / 2 - coverM;

            for (let i = 0; i < topBarSpec.quantity; i++) {
              const zPos =
                topBarSpec.quantity === 1
                  ? 0
                  : -usableZ / 2 + (i / (topBarSpec.quantity - 1)) * usableZ;

              const pts = [
                new THREE.Vector3(xStart, yTop - hookLen, zPos),
                new THREE.Vector3(xStart, yTop - 0.02, zPos),
                new THREE.Vector3(xStart + 0.02, yTop, zPos),
                new THREE.Vector3(xEnd - 0.02, yTop, zPos),
                new THREE.Vector3(xEnd, yTop - 0.02, zPos),
                new THREE.Vector3(xEnd, yTop - hookLen, zPos),
              ];
              const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
              const tubeGeo = new THREE.TubeGeometry(curve, 32, rad, 8, false);
              const barMesh = new THREE.Mesh(tubeGeo, matTopRebar);
              topBarsGroup.add(barMesh);
            }

            beamGroup.add(topBarsGroup);
            explodableParts.push({
              obj: topBarsGroup,
              basePos: new THREE.Vector3(0, 0, 0),
              explodeDelta: new THREE.Vector3(0, 0.38, 0),
            });
          }

          // Bottom Longitudinal Bars Group (Cyan Steel with upward anchorage hooks)
          if (botBarSpec && botBarSpec.quantity > 0) {
            const botBarsGroup = new THREE.Group();
            const rad = Math.max((botBarSpec.diameter / 1000) * 0.6, 0.008);
            const yBot = -hM / 2 + (botBarSpec.z_offset || 0.04);
            const hookLen = Math.min(botBarSpec.hookLengthM || 0.18, hM - 2 * coverM);
            const xStart = -L / 2 + coverM + 0.015;
            const xEnd = L / 2 - coverM - 0.015;

            for (let i = 0; i < botBarSpec.quantity; i++) {
              const zPos =
                botBarSpec.quantity === 1
                  ? 0
                  : -usableZ / 2 + (i / (botBarSpec.quantity - 1)) * usableZ;

              const pts = [
                new THREE.Vector3(xStart, yBot + hookLen, zPos),
                new THREE.Vector3(xStart, yBot + 0.02, zPos),
                new THREE.Vector3(xStart + 0.02, yBot, zPos),
                new THREE.Vector3(xEnd - 0.02, yBot, zPos),
                new THREE.Vector3(xEnd, yBot + 0.02, zPos),
                new THREE.Vector3(xEnd, yBot + hookLen, zPos),
              ];
              const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
              const tubeGeo = new THREE.TubeGeometry(curve, 32, rad, 8, false);
              const barMesh = new THREE.Mesh(tubeGeo, matBotRebar);
              botBarsGroup.add(barMesh);
            }

            beamGroup.add(botBarsGroup);
            explodableParts.push({
              obj: botBarsGroup,
              basePos: new THREE.Vector3(0, 0, 0),
              explodeDelta: new THREE.Vector3(0, -0.38, 0),
            });
          }

          // 3-Zone Stirrups Cage (Staffe a passo fitto in zona dissipativa e diradato in campata)
          const stirrupsGroup = new THREE.Group();
          const stRad = Math.max((stirrupSpec.diameter / 1000) * 0.55, 0.0045);
          const halfY = hM / 2 - coverM;
          const halfZ = bM / 2 - coverM;

          let xCursor = -L / 2 + 0.08;
          const z1End = -L / 2 + stirrupSpec.zones[0].length;
          const z2End = z1End + stirrupSpec.zones[1].length;

          while (xCursor <= L / 2 - 0.08) {
            let stepCm = stirrupSpec.zones[2].step_cm;
            let isDissipative = true;
            if (xCursor <= z1End) {
              stepCm = stirrupSpec.zones[0].step_cm;
              isDissipative = true;
            } else if (xCursor <= z2End) {
              stepCm = stirrupSpec.zones[1].step_cm;
              isDissipative = false;
            }

            const loopPts = [
              new THREE.Vector3(xCursor, -halfY, -halfZ),
              new THREE.Vector3(xCursor, halfY, -halfZ),
              new THREE.Vector3(xCursor, halfY, halfZ),
              new THREE.Vector3(xCursor, -halfY, halfZ),
              new THREE.Vector3(xCursor, -halfY, -halfZ),
            ];
            const loopCurve = new THREE.CatmullRomCurve3(loopPts, true, "catmullrom", 0.02);
            const loopGeo = new THREE.TubeGeometry(loopCurve, 20, stRad, 6, true);
            const stMesh = new THREE.Mesh(loopGeo, isDissipative ? matStirrupEnd : matStirrupMid);
            stirrupsGroup.add(stMesh);

            xCursor += Math.max(stepCm / 100, 0.05);
          }

          beamGroup.add(stirrupsGroup);
          explodableParts.push({
            obj: stirrupsGroup,
            basePos: new THREE.Vector3(0, 0, 0),
            explodeDelta: new THREE.Vector3(0, 0, 0.48),
          });

          // 3C. 3D Node Clash Detection Indicator
          if (verif?.clashDetected) {
            const clashGroup = new THREE.Group();
            const ringGeo = new THREE.TorusGeometry(0.18, 0.022, 12, 32);
            const ringMat = new THREE.MeshStandardMaterial({
              color: 0xef4444,
              emissive: 0x991b1b,
              roughness: 0.2,
            });
            const ringLeft = new THREE.Mesh(ringGeo, ringMat);
            ringLeft.position.set(-L / 2 + 0.05, hM / 2 - 0.04, 0);
            ringLeft.rotation.y = Math.PI / 2;
            clashGroup.add(ringLeft);
            beamGroup.add(clashGroup);
          }
        }

        // 3D. FEM DIAGRAMS & LOAD OVERLAYS (Moment M_Ed, Shear V_Ed, Distributed Loads Q, Deformed shape)
        if (verif && (diag !== "none" || isWire)) {
          const activeDiag = diag === "none" && isWire ? "moment_M" : diag;
          const diagGroup = new THREE.Group();
          const topY = hM / 2 + 0.04;

          if (activeDiag === "moment_M") {
            // Render parabolic Bending Moment Diagram M_Ed(x)
            const scaleM = 0.015; // m per kNm
            const curvePts: THREE.Vector3[] = [];
            const positions: number[] = [];

            for (let i = 0; i < verif.diagramPoints.length; i++) {
              const pt = verif.diagramPoints[i];
              const xLocal = -L / 2 + pt.x;
              // Convention: positive moment plotted downward, negative moment upward
              const yLocal = topY - pt.M_slu * scaleM;
              curvePts.push(new THREE.Vector3(xLocal, yLocal, 0));

              if (i < verif.diagramPoints.length - 1) {
                const ptNext = verif.diagramPoints[i + 1];
                const xNext = -L / 2 + ptNext.x;
                const yNext = topY - ptNext.M_slu * scaleM;
                // Two triangles forming quad strip between axis (topY) and curve
                positions.push(
                  xLocal, topY, 0,
                  xLocal, yLocal, 0,
                  xNext, yNext, 0,
                  xLocal, topY, 0,
                  xNext, yNext, 0,
                  xNext, topY, 0
                );
              }
            }

            const ribbonGeo = new THREE.BufferGeometry();
            ribbonGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            ribbonGeo.computeVertexNormals();
            const ribbonMat = new THREE.MeshBasicMaterial({
              color: isSelected ? 0xf59e0b : 0x3b82f6,
              transparent: true,
              opacity: 0.34,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            diagGroup.add(new THREE.Mesh(ribbonGeo, ribbonMat));

            const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
            const lineMat = new THREE.LineBasicMaterial({
              color: isSelected ? 0xfbbf24 : 0x60a5fa,
            });
            diagGroup.add(new THREE.Line(lineGeo, lineMat));
          } else if (activeDiag === "shear_V") {
            // Render Shear Diagram V_Ed(x)
            const scaleV = 0.012;
            const curvePts: THREE.Vector3[] = [];
            const positions: number[] = [];

            for (let i = 0; i < verif.diagramPoints.length; i++) {
              const pt = verif.diagramPoints[i];
              const xLocal = -L / 2 + pt.x;
              const yLocal = topY + pt.V_slu * scaleV;
              curvePts.push(new THREE.Vector3(xLocal, yLocal, 0));

              if (i < verif.diagramPoints.length - 1) {
                const ptNext = verif.diagramPoints[i + 1];
                const xNext = -L / 2 + ptNext.x;
                const yNext = topY + ptNext.V_slu * scaleV;
                positions.push(
                  xLocal, topY, 0,
                  xLocal, yLocal, 0,
                  xNext, yNext, 0,
                  xLocal, topY, 0,
                  xNext, yNext, 0,
                  xNext, topY, 0
                );
              }
            }

            const ribbonGeo = new THREE.BufferGeometry();
            ribbonGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            const ribbonMat = new THREE.MeshBasicMaterial({
              color: 0xec4899,
              transparent: true,
              opacity: 0.34,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            diagGroup.add(new THREE.Mesh(ribbonGeo, ribbonMat));

            const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
            diagGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xf472b6 })));
          } else if (activeDiag === "loads_Q") {
            // Render Distributed Load Arrows above the beam
            const arrowHeight = Math.min(1.1, Math.max(0.45, verif.combinations.q_slu_fundamental * 0.025));
            const topBarPts = [
              new THREE.Vector3(-L / 2, topY + arrowHeight, 0),
              new THREE.Vector3(L / 2, topY + arrowHeight, 0),
            ];
            diagGroup.add(
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(topBarPts),
                new THREE.LineBasicMaterial({ color: 0x22c55e })
              )
            );

            const numArrows = 9;
            const coneGeo = new THREE.ConeGeometry(0.055, 0.14, 8);
            coneGeo.rotateX(Math.PI); // point down
            const coneMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

            for (let i = 0; i <= numArrows; i++) {
              const xA = -L / 2 + (i / numArrows) * L;
              const stemPts = [
                new THREE.Vector3(xA, topY + arrowHeight, 0),
                new THREE.Vector3(xA, topY + 0.08, 0),
              ];
              diagGroup.add(
                new THREE.Line(
                  new THREE.BufferGeometry().setFromPoints(stemPts),
                  new THREE.LineBasicMaterial({ color: 0x22c55e })
                )
              );
              const cone = new THREE.Mesh(coneGeo, coneMat);
              cone.position.set(xA, topY + 0.07, 0);
              diagGroup.add(cone);
            }
          } else if (activeDiag === "deformed") {
            // Render amplified elastic deformed curve
            const curvePts: THREE.Vector3[] = [];
            for (const pt of verif.diagramPoints) {
              const xLocal = -L / 2 + pt.x;
              const yDef = hM / 2 - pt.deflection_mm * 0.12;
              curvePts.push(new THREE.Vector3(xLocal, yDef, 0));
            }
            const defCurve = new THREE.CatmullRomCurve3(curvePts);
            const defGeo = new THREE.TubeGeometry(defCurve, 32, 0.032, 8, false);
            const defMat = new THREE.MeshStandardMaterial({
              color: 0xa855f7,
              roughness: 0.25,
            });
            diagGroup.add(new THREE.Mesh(defGeo, defMat));
          }

          beamGroup.add(diagGroup);
        }

        modelRoot.add(beamGroup);
      }
    };

    // Camera Flight Interpolation State
    let activeFlight: {
      targetPos: THREE.Vector3;
      targetLook: THREE.Vector3;
    } | null = null;

    controls.addEventListener("start", () => {
      activeFlight = null;
    });

    const flyToPreset = (preset: CameraPresetId) => {
      switch (preset) {
        case "iso":
          activeFlight = {
            targetPos: new THREE.Vector3(13.5, 8.2, 11.8),
            targetLook: new THREE.Vector3(5.0, 1.8, -2.25),
          };
          break;
        case "front_xz":
          activeFlight = {
            targetPos: new THREE.Vector3(5.0, 2.2, 12.5),
            targetLook: new THREE.Vector3(5.0, 1.8, 0),
          };
          break;
        case "side_yz":
          activeFlight = {
            targetPos: new THREE.Vector3(-8.5, 2.4, -2.25),
            targetLook: new THREE.Vector3(0, 1.8, -2.25),
          };
          break;
        case "plan_xy":
          activeFlight = {
            targetPos: new THREE.Vector3(5.0, 16.5, -2.2),
            targetLook: new THREE.Vector3(5.0, 0, -2.25),
          };
          break;
        case "node_zoom":
          // Zoom right into the central structural node B1 (5.0, 0, 3.2) to inspect 3D rebar anchorage
          activeFlight = {
            targetPos: new THREE.Vector3(6.6, 3.95, 2.1),
            targetLook: new THREE.Vector3(5.0, 3.0, 0),
          };
          break;
      }
      requestRender();
    };

    const updateThemeColors = () => {
      const dark = stateRef.current.isDark;
      const hex = dark ? 0x0b1120 : 0xf1f5f9;
      scene.background = new THREE.Color(hex);
      scene.fog = new THREE.FogExp2(hex, 0.018);
      groundPlaneMat.color.setHex(dark ? 0x0f172a : 0xe2e8f0);
    };

    // On-Demand Render Loop with Software WebGL Fence Sync Guard & Smooth Damping
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (gl.flush) gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        const dt = Math.min(clock.getDelta(), 0.1) || 0.016;
        let needsMoreFrames = false;

        // 1. Smoothly damp exploded view separation
        const expTarget = stateRef.current.explodedTarget;
        const expCurr = stateRef.current.explodedCurrent;
        if (Math.abs(expTarget - expCurr) > 0.001) {
          const nextExp = isSoftwareGl
            ? expTarget
            : THREE.MathUtils.damp(expCurr, expTarget, 9, dt);
          stateRef.current.explodedCurrent = nextExp;
          for (const item of explodableParts) {
            item.obj.position
              .copy(item.basePos)
              .addScaledVector(item.explodeDelta, nextExp);
          }
          if (!isSoftwareGl) needsMoreFrames = true;
        }

        // 2. Smoothly damp camera flight preset
        if (activeFlight) {
          if (isSoftwareGl) {
            camera.position.copy(activeFlight.targetPos);
            controls.target.copy(activeFlight.targetLook);
            activeFlight = null;
          } else {
            camera.position.x = THREE.MathUtils.damp(camera.position.x, activeFlight.targetPos.x, 7, dt);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, activeFlight.targetPos.y, 7, dt);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, activeFlight.targetPos.z, 7, dt);

            controls.target.x = THREE.MathUtils.damp(controls.target.x, activeFlight.targetLook.x, 7, dt);
            controls.target.y = THREE.MathUtils.damp(controls.target.y, activeFlight.targetLook.y, 7, dt);
            controls.target.z = THREE.MathUtils.damp(controls.target.z, activeFlight.targetLook.z, 7, dt);

            if (
              camera.position.distanceTo(activeFlight.targetPos) < 0.04 &&
              controls.target.distanceTo(activeFlight.targetLook) < 0.04
            ) {
              activeFlight = null;
            } else {
              needsMoreFrames = true;
            }
          }
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMoreFrames) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controls.addEventListener("change", () => {
      requestRender();
    });

    // Raycasting for clicking and hovering beams/columns in 3D
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    const getCanvasRelativePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Was an orbit drag, not a click

      getCanvasRelativePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const { elementId, kind } = hits[0].object.userData;
        if (elementId && kind) {
          stateRef.current.onSelectElement(elementId, kind);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 65) return; // Throttled raycast
      lastHoverTime = now;

      getCanvasRelativePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const { elementId, kind, label } = hits[0].object.userData;
        renderer.domElement.style.cursor = "pointer";
        if (kind === "beam") {
          const bv = stateRef.current.beamVerifications[elementId];
          setHoveredInfo({
            id: elementId,
            label,
            summary: bv
              ? `M_Ed: ${bv.M_Ed_mid} kNm · V_Ed: ${bv.V_Ed_max} kN · DCR: ${(Math.max(bv.dcr_moment_support, bv.dcr_moment_mid) * 100).toFixed(0)}%`
              : "Trave C.A.",
          });
        } else {
          const cv = stateRef.current.columnVerifications[elementId];
          setHoveredInfo({
            id: elementId,
            label,
            summary: cv
              ? `N_Ed: ${cv.N_Ed} kN · M_Ed: ${cv.M_Ed} kNm · DCR M-N: ${(cv.dcr_PM * 100).toFixed(0)}%`
              : "Pilastro C.A.",
          });
        }
      } else {
        renderer.domElement.style.cursor = "grab";
        setHoveredInfo(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // ResizeObserver for responsive container (deferred via requestAnimationFrame to prevent ResizeObserver loop limit errors)
    let resizeRafId = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            requestRender();
          }
        }
      });
    });
    resizeObserver.observe(container);

    // Initial build & pre-warm
    rebuildModel();
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    sceneApiRef.current = {
      rebuildModel,
      requestRender,
      flyToPreset,
      updateThemeColors,
    };

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeRafId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      controls.dispose();
      concreteTexture.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Count any active 3D clashes across the project
  const activeClashes = (Object.values(beamVerifications) as BeamFemVerification[]).filter(
    (v) => v.clashDetected
  );

  return (
    <div className="relative w-full h-full min-h-[540px] overflow-hidden bg-slate-950 select-none">
      {/* Dedicated isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Top-Left Minimal Spec Header Overlay (Zero Center Occlusion) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-lg text-xs text-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-medium text-slate-100">
            <span>{project.project_name}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-amber-400">{project.normative_code.replace("_", " ")}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400">{project.ductility_class.replace("_", " ")}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {project.location_seismic_zone} · Clicca un elemento 3D per ispezionare ferri e sollecitazioni
          </div>
        </div>

        {activeClashes.length > 0 && (
          <div className="bg-red-950/95 border border-red-800/80 px-3 py-1.5 rounded-lg text-xs text-red-200 flex items-center gap-2 pointer-events-auto">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              Clash 3D Nodo rilevato su <strong className="font-mono">{activeClashes[0].elementId}</strong> (quote ferri sup. coincidenti)
            </span>
          </div>
        )}

        {hoveredInfo && (
          <div className="bg-slate-900/95 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs text-slate-200">
            <span className="font-mono font-semibold text-amber-400">{hoveredInfo.id}</span>
            <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
            <span className="font-mono tabular-nums">{hoveredInfo.summary}</span>
          </div>
        )}
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Backdrop-Filter over WebGL) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 w-[min(920px,95%)] transition-transform duration-200 ease-out"
        style={{
          transform: dockCollapsed
            ? "translate(-50%, calc(100% - 32px))"
            : "translate(-50%, 0)",
        }}
      >
        {/* Collapse / Expand Toggle Handle */}
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-t-md hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Scorciatoia tastiera: H"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Mostra Controlli 3D (H)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Nascondi Dock (H)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Horizontal Control Bar */}
        <div className="bg-slate-900 border border-slate-700/90 rounded-xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2.5">
          {/* 1. Viewport Render Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => onChangeDisplayMode("solid")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === "solid"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Vista Solida</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeDisplayMode("wireframe_fem")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === "wireframe_fem"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Unifilare FEM</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeDisplayMode("xray_rebar")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                displayMode === "xray_rebar"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>X-Ray Ferri 3D</span>
            </button>
          </div>

          {/* 2. FEM Diagram Overlay Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0" />
            {(
              [
                { id: "none", label: "Nessun Diag." },
                { id: "moment_M", label: "Momento M" },
                { id: "shear_V", label: "Taglio V" },
                { id: "loads_Q", label: "Carichi Q" },
                { id: "deformed", label: "Deformata" },
              ] as Array<{ id: DiagramOverlayType; label: string }>
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeDiagramOverlay(item.id)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  diagramOverlay === item.id
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 3. Exploded Rebar Cage Slider */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <label htmlFor="exploded-slider" className="text-[11px] font-medium text-slate-300 whitespace-nowrap">
              Esploso 3D
            </label>
            <input
              id="exploded-slider"
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={explodedTarget}
              onChange={(e) => onChangeExplodedTarget(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-amber-400 tabular-nums w-8 text-right">
              {Math.round(explodedTarget * 100)}%
            </span>
          </div>

          {/* 4. Camera Presets */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => sceneApiRef.current?.flyToPreset("iso")}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Vista Assonometrica 3D"
            >
              3D Iso
            </button>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.flyToPreset("front_xz")}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Prospetto Frontale Telaio XZ"
            >
              Prospetto
            </button>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.flyToPreset("plan_xy")}
              className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Pianta Carpenteria XY"
            >
              Pianta
            </button>
            <button
              type="button"
              onClick={() => {
                onChangeDisplayMode("xray_rebar");
                sceneApiRef.current?.flyToPreset("node_zoom");
              }}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-300 hover:bg-amber-500/20 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Zoom ravvicinato sul Nodo B1 in modalità X-Ray"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Nodo Critico</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChangeExplodedTarget(0);
                sceneApiRef.current?.flyToPreset("iso");
              }}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Reset Vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
