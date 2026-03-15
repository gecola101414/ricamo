import React, { useState, useEffect, useMemo } from 'react';
import { Eraser, Trash2, Download, Plus, Minus, X, SquareDashed, Copy, ClipboardPaste, FlipHorizontal, FlipVertical, Ruler, Move, Upload } from 'lucide-react';
import { TEMPLATES } from './templates';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
  '#800000', '#808000', '#008000', '#800080', '#008080',
  '#000080', '#FFA500', '#A52A2A', '#FFC0CB', '#FFD700',
  '#4B0082', '#EE82EE', '#F5F5DC', '#F5DEB3', '#D2B48C',
  '#A0522D', '#8B4513', '#2F4F4F', '#708090', '#778899'
];

type Tool = 'line' | 'eraser' | 'select' | 'symmetry' | 'move' | 'duplicate';

type LineSegment = {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  color: string;
};

type ClipboardData = {
  grid: string[][];
  lines: LineSegment[];
  width: number;
  height: number;
};

export default function App() {
  const [gridSize, setGridSize] = useState({ width: 40, height: 40 });
  const [grid, setGrid] = useState<string[][]>(Array(40).fill(Array(40).fill('')));
  const [lines, setLines] = useState<LineSegment[]>([]);
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLORS[0]);
  const [currentTool, setCurrentTool] = useState<Tool>('line');
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{r: number, c: number} | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{r: number, c: number} | null>(null);
  const [selectionStart, setSelectionStart] = useState<{r: number, c: number} | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{r: number, c: number} | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(-1);
  const [showRealistic, setShowRealistic] = useState(false);
  const [watermark, setWatermark] = useState<string | null>(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkScale, setWatermarkScale] = useState(1);
  const [watermarkOffset, setWatermarkOffset] = useState({ x: 0, y: 0 });

  // Clear line preview when tool changes
  useEffect(() => {
    setDragStart(null);
    setDragCurrent(null);
  }, [currentTool]);

  // Handle Escape key to cancel line drawing and Shift key for snapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (currentTool === 'line' || currentTool === 'symmetry' || currentTool === 'move' || currentTool === 'duplicate')) {
        setDragStart(null);
        setDragCurrent(null);
      }
      if (e.key === 'Shift') setIsShiftDown(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftDown(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentTool]);

  // Initialize grid when size changes
  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = Array(gridSize.height).fill(null).map(() => Array(gridSize.width).fill(''));
      // Copy existing drawing if possible
      for (let r = 0; r < Math.min(prevGrid.length, gridSize.height); r++) {
        for (let c = 0; c < Math.min(prevGrid[r].length, gridSize.width); c++) {
          newGrid[r][c] = prevGrid[r][c];
        }
      }
      return newGrid;
    });
    // Remove lines that are out of bounds
    setLines(prev => prev.filter(line => 
      line.r1 < gridSize.height && line.c1 < gridSize.width &&
      line.r2 < gridSize.height && line.c2 < gridSize.width
    ));
  }, [gridSize]);

  const isPointNearLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) {
        param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
  };

  const handleCellDown = (row: number, col: number) => {
    if (currentTool !== 'select' && currentTool !== 'symmetry' && currentTool !== 'move' && currentTool !== 'duplicate') {
      setSelectionStart(null);
      setSelectionEnd(null);
    }

    if (currentTool === 'symmetry' || currentTool === 'move' || currentTool === 'duplicate') {
      if (!selectionStart || !selectionEnd) {
        alert("Please select an area first using the Select tool.");
        return;
      }
      setDragStart({ r: row, c: col });
      setDragCurrent({ r: row, c: col });
      setIsDrawing(true);
    } else if (currentTool === 'select') {
      setSelectionStart({ r: row, c: col });
      setSelectionEnd({ r: row, c: col });
      setIsDrawing(true);
    } else if (currentTool === 'line') {
      setDragStart({ r: row, c: col });
      setDragCurrent({ r: row, c: col });
      setIsDrawing(true);
    } else {
      setIsDrawing(true);
      applyTool(row, col);
    }
  };

  const handleCellEnter = (row: number, col: number) => {
    if (currentTool === 'select' && isDrawing) {
      setSelectionEnd({ r: row, c: col });
    } else if (currentTool === 'line' && isDrawing && dragStart) {
      setDragCurrent({ r: row, c: col });
    } else if (currentTool === 'symmetry' && dragStart) {
      let targetR = row;
      let targetC = col;
      if (isShiftDown) {
        const dr = Math.abs(row - dragStart.r);
        const dc = Math.abs(col - dragStart.c);
        if (dr > dc * 2) {
          targetC = dragStart.c;
        } else if (dc > dr * 2) {
          targetR = dragStart.r;
        } else {
          const dist = Math.max(dr, dc);
          targetR = dragStart.r + Math.sign(row - dragStart.r) * dist;
          targetC = dragStart.c + Math.sign(col - dragStart.c) * dist;
        }
      }
      setDragCurrent({ r: targetR, c: targetC });
    } else if ((currentTool === 'move' || currentTool === 'duplicate') && dragStart) {
      setDragCurrent({ r: row, c: col });
    } else if (isDrawing) {
      applyTool(row, col);
    }
  };

  const reflectPoint = (r: number, c: number, axisR1: number, axisC1: number, axisR2: number, axisC2: number) => {
    const dx = axisC2 - axisC1;
    const dy = axisR2 - axisR1;
    if (dx === 0 && dy === 0) return { r, c };
    
    const a = dy;
    const b = -dx;
    const c_eq = dx * axisR1 - dy * axisC1;
    
    const denominator = a * a + b * b;
    const distanceFactor = (a * c + b * r + c_eq) / denominator;
    
    const refC = c - 2 * a * distanceFactor;
    const refR = r - 2 * b * distanceFactor;
    
    return { r: Math.round(refR), c: Math.round(refC) };
  };

  const handleCellUp = () => {
    if (currentTool === 'line' && isDrawing && dragStart && dragCurrent) {
      if (dragStart.r !== dragCurrent.r || dragStart.c !== dragCurrent.c) {
        setLines(prev => [...prev, {
          r1: dragStart.r,
          c1: dragStart.c,
          r2: dragCurrent.r,
          c2: dragCurrent.c,
          color: currentColor
        }]);
      }
      setDragStart(null);
      setDragCurrent(null);
      setIsDrawing(false);
    } else if (currentTool === 'symmetry' && dragStart && dragCurrent) {
      const bounds = getSelectionBounds();
      if (bounds) {
        const { minR, maxR, minC, maxC } = bounds;
        const axisR1 = dragStart.r;
        const axisC1 = dragStart.c;
        const axisR2 = dragCurrent.r;
        const axisC2 = dragCurrent.c;
        
        if (axisR1 !== axisR2 || axisC1 !== axisC2) {
          setGrid(prev => {
            const next = prev.map(row => [...row]);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                if (prev[r][c]) {
                  const ref = reflectPoint(r, c, axisR1, axisC1, axisR2, axisC2);
                  if (ref.r >= 0 && ref.r < gridSize.height && ref.c >= 0 && ref.c < gridSize.width) {
                    next[ref.r][ref.c] = prev[r][c];
                  }
                }
              }
            }
            return next;
          });
          
          setLines(prev => {
            const newLines = [...prev];
            prev.forEach(l => {
              if (l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
                  l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC) {
                const ref1 = reflectPoint(l.r1, l.c1, axisR1, axisC1, axisR2, axisC2);
                const ref2 = reflectPoint(l.r2, l.c2, axisR1, axisC1, axisR2, axisC2);
                if (ref1.r >= 0 && ref1.r < gridSize.height && ref1.c >= 0 && ref1.c < gridSize.width &&
                    ref2.r >= 0 && ref2.r < gridSize.height && ref2.c >= 0 && ref2.c < gridSize.width) {
                  newLines.push({
                    r1: ref1.r,
                    c1: ref1.c,
                    r2: ref2.r,
                    c2: ref2.c,
                    color: l.color
                  });
                }
              }
            });
            return newLines;
          });
        }
      }
      setDragStart(null);
      setDragCurrent(null);
      setIsDrawing(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    } else if ((currentTool === 'move' || currentTool === 'duplicate') && dragStart && dragCurrent) {
      const bounds = getSelectionBounds();
      if (bounds) {
        const { minR, maxR, minC, maxC } = bounds;
        const deltaR = dragCurrent.r - dragStart.r;
        const deltaC = dragCurrent.c - dragStart.c;
        
        if (deltaR !== 0 || deltaC !== 0) {
          setGrid(prev => {
            const next = prev.map(row => [...row]);
            
            // Extract and clear
            const extracted: {r: number, c: number, color: string}[] = [];
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                if (prev[r][c]) {
                  extracted.push({r, c, color: prev[r][c]});
                  if (currentTool === 'move') {
                    next[r][c] = ''; // clear original only if moving
                  }
                }
              }
            }
            
            // Paste at new location
            extracted.forEach(item => {
              const newR = item.r + deltaR;
              const newC = item.c + deltaC;
              if (newR >= 0 && newR < gridSize.height && newC >= 0 && newC < gridSize.width) {
                next[newR][newC] = item.color;
              }
            });
            
            return next;
          });
          
          setLines(prev => {
            const newLines: LineSegment[] = [];
            prev.forEach(l => {
              if (l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
                  l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC) {
                // Move line
                const newR1 = l.r1 + deltaR;
                const newC1 = l.c1 + deltaC;
                const newR2 = l.r2 + deltaR;
                const newC2 = l.c2 + deltaC;
                
                if (currentTool === 'duplicate') {
                  newLines.push(l); // keep original if duplicating
                }
                
                if (newR1 >= 0 && newR1 < gridSize.height && newC1 >= 0 && newC1 < gridSize.width &&
                    newR2 >= 0 && newR2 < gridSize.height && newC2 >= 0 && newC2 < gridSize.width) {
                  newLines.push({
                    r1: newR1,
                    c1: newC1,
                    r2: newR2,
                    c2: newC2,
                    color: l.color
                  });
                }
              } else {
                newLines.push(l);
              }
            });
            return newLines;
          });
          
          // Update selection bounds
          setSelectionStart(null);
          setSelectionEnd(null);
        }
      }
      setDragStart(null);
      setDragCurrent(null);
      setIsDrawing(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    } else {
      setIsDrawing(false);
    }
  };

  const applyTool = (row: number, col: number) => {
    if (currentTool === 'eraser') {
      // Erase cross stitch
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = '';
        return newGrid;
      });
      // Erase lines that intersect this cell
      setLines(prev => prev.filter(line => {
        return !isPointNearLine(col + 0.5, row + 0.5, line.c1 + 0.5, line.r1 + 0.5, line.c2 + 0.5, line.r2 + 0.5, 0.4);
      }));
    }
  };

  const confirmClearGrid = () => {
    setGrid(Array(gridSize.height).fill(null).map(() => Array(gridSize.width).fill('')));
    setLines([]);
    setSelectionStart(null);
    setSelectionEnd(null);
    setShowClearModal(false);
  };

  const getSelectionBounds = () => {
    if (!selectionStart || !selectionEnd) return null;
    return {
      minR: Math.min(selectionStart.r, selectionEnd.r),
      maxR: Math.max(selectionStart.r, selectionEnd.r),
      minC: Math.min(selectionStart.c, selectionEnd.c),
      maxC: Math.max(selectionStart.c, selectionEnd.c)
    };
  };

  const handleCopy = () => {
    const bounds = getSelectionBounds();
    if (!bounds) return;
    const { minR, maxR, minC, maxC } = bounds;
    
    const clipGrid = [];
    for (let r = minR; r <= maxR; r++) {
      clipGrid.push(grid[r].slice(minC, maxC + 1));
    }
    
    const clipLines = lines.filter(l => 
      l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
      l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC
    ).map(l => ({
      ...l,
      r1: l.r1 - minR,
      c1: l.c1 - minC,
      r2: l.r2 - minR,
      c2: l.c2 - minC
    }));
    
    setClipboard({ grid: clipGrid, lines: clipLines, width: maxC - minC + 1, height: maxR - minR + 1 });
  };

  const handlePaste = () => {
    if (!clipboard) return;
    const targetR = selectionStart ? Math.min(selectionStart.r, selectionEnd!.r) : 0;
    const targetC = selectionStart ? Math.min(selectionStart.c, selectionEnd!.c) : 0;
    
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      for (let r = 0; r < clipboard.height; r++) {
        for (let c = 0; c < clipboard.width; c++) {
          if (targetR + r < gridSize.height && targetC + c < gridSize.width) {
            if (clipboard.grid[r][c]) {
              next[targetR + r][targetC + c] = clipboard.grid[r][c];
            }
          }
        }
      }
      return next;
    });
    
    setLines(prev => [
      ...prev,
      ...clipboard.lines.map(l => ({
        ...l,
        r1: l.r1 + targetR,
        c1: l.c1 + targetC,
        r2: l.r2 + targetR,
        c2: l.c2 + targetC
      })).filter(l => 
        l.r1 < gridSize.height && l.c1 < gridSize.width &&
        l.r2 < gridSize.height && l.c2 < gridSize.width
      )
    ]);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleFlipH = () => {
    const bounds = getSelectionBounds();
    if (!bounds) return;
    const { minR, maxR, minC, maxC } = bounds;
    
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      for (let r = minR; r <= maxR; r++) {
        const rowCopy = [...prev[r]];
        for (let c = minC; c <= maxC; c++) {
          next[r][c] = rowCopy[maxC - (c - minC)];
        }
      }
      return next;
    });
    
    setLines(prev => prev.map(l => {
      if (l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
          l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC) {
        return {
          ...l,
          c1: maxC - (l.c1 - minC),
          c2: maxC - (l.c2 - minC)
        };
      }
      return l;
    }));
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleFlipV = () => {
    const bounds = getSelectionBounds();
    if (!bounds) return;
    const { minR, maxR, minC, maxC } = bounds;
    
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          next[r][c] = prev[maxR - (r - minR)][c];
        }
      }
      return next;
    });
    
    setLines(prev => prev.map(l => {
      if (l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
          l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC) {
        return {
          ...l,
          r1: maxR - (l.r1 - minR),
          r2: maxR - (l.r2 - minR)
        };
      }
      return l;
    }));
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const exportImage = () => {
    const canvas = document.createElement('canvas');
    const cellSize = 20; // Higher resolution for export
    canvas.width = gridSize.width * cellSize;
    canvas.height = gridSize.height * cellSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let r = 0; r < gridSize.height; r++) {
      for (let c = 0; c < gridSize.width; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c];
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          
          // Draw cross stitch pattern
          ctx.beginPath();
          ctx.moveTo(c * cellSize + 2, r * cellSize + 2);
          ctx.lineTo(c * cellSize + cellSize - 2, r * cellSize + cellSize - 2);
          ctx.moveTo(c * cellSize + cellSize - 2, r * cellSize + 2);
          ctx.lineTo(c * cellSize + 2, r * cellSize + cellSize - 2);
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Draw grid lines if enabled
    if (showGridLines) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize.width; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.strokeStyle = i % 10 === 0 ? '#9ca3af' : '#e5e7eb';
        ctx.lineWidth = i % 10 === 0 ? 2 : 1;
        ctx.stroke();
      }
      for (let i = 0; i <= gridSize.height; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.strokeStyle = i % 10 === 0 ? '#9ca3af' : '#e5e7eb';
        ctx.lineWidth = i % 10 === 0 ? 2 : 1;
        ctx.stroke();
      }
    }

    // Draw lines
    lines.forEach(line => {
      // Draw holes
      ctx.fillStyle = 'rgba(41, 37, 36, 0.4)';
      ctx.beginPath();
      ctx.arc((line.c1 + 0.5) * cellSize, (line.r1 + 0.5) * cellSize, cellSize * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc((line.c2 + 0.5) * cellSize, (line.r2 + 0.5) * cellSize, cellSize * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Draw line
      ctx.beginPath();
      ctx.moveTo((line.c1 + 0.5) * cellSize, (line.r1 + 0.5) * cellSize);
      ctx.lineTo((line.c2 + 0.5) * cellSize, (line.r2 + 0.5) * cellSize);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = cellSize * 0.15;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    const link = document.createElement('a');
    link.download = 'cross-stitch-pattern.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        setWatermark(canvas.toDataURL('image/png'));
        // Reset watermark settings
        setWatermarkScale(1);
        setWatermarkOffset({ x: 0, y: 0 });
      } catch (err) {
        console.error("Error loading PDF:", err);
        alert("Failed to load PDF. Please try an image instead.");
      }
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWatermark(event.target?.result as string);
        setWatermarkScale(1);
        setWatermarkOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image or PDF file.");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-stone-100 text-stone-900 flex flex-col font-sans" onMouseUp={handleCellUp} onMouseLeave={handleCellUp}>
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
            CS
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Cross Stitch Designer</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowClearModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <Trash2 size={16} /> Clear
          </button>
          <button onClick={exportImage} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 flex flex-col overflow-y-auto z-10 shadow-sm shrink-0">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Background / Watermark</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-stone-200 rounded-md text-sm text-stone-600 hover:bg-stone-50 cursor-pointer transition-colors">
                <Upload size={16} />
                <span>Upload Image / PDF</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
              </label>
              
              {watermark && (
                <div className="space-y-3 bg-stone-50 p-3 rounded-md border border-stone-100">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-stone-500">Opacity</label>
                      <span className="text-[10px] text-stone-400">{Math.round(watermarkOpacity * 100)}%</span>
                    </div>
                    <input type="range" min="0.1" max="1" step="0.1" value={watermarkOpacity} onChange={e => setWatermarkOpacity(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-stone-500">Scale</label>
                      <span className="text-[10px] text-stone-400">{watermarkScale.toFixed(1)}x</span>
                    </div>
                    <input type="range" min="0.1" max="3" step="0.1" value={watermarkScale} onChange={e => setWatermarkScale(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-stone-500 mb-1 block">Offset X</label>
                      <input type="range" min="-500" max="500" value={watermarkOffset.x} onChange={e => setWatermarkOffset(prev => ({...prev, x: parseInt(e.target.value)}))} className="w-full accent-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-stone-500 mb-1 block">Offset Y</label>
                      <input type="range" min="-500" max="500" value={watermarkOffset.y} onChange={e => setWatermarkOffset(prev => ({...prev, y: parseInt(e.target.value)}))} className="w-full accent-indigo-500" />
                    </div>
                  </div>
                  <button onClick={() => setWatermark(null)} className="w-full py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">
                    Remove Watermark
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Templates</h2>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(Number(e.target.value))}
              className="w-full text-sm border border-stone-200 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value={-1}>None</option>
              {TEMPLATES.map((tpl, idx) => (
                <option key={idx} value={idx}>{tpl.name}</option>
              ))}
            </select>
          </div>

          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Tools</h2>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setCurrentTool('line')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'line' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              >
                <Minus size={18} className="rotate-45" />
                <span className="text-[10px] font-medium">Line</span>
              </button>
              <button
                onClick={() => setCurrentTool('eraser')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'eraser' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              >
                <Eraser size={18} />
                <span className="text-[10px] font-medium">Erase</span>
              </button>
              <button
                onClick={() => setCurrentTool('select')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'select' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              >
                <SquareDashed size={18} />
                <span className="text-[10px] font-medium">Select</span>
              </button>
              <button
                onClick={() => setCurrentTool('symmetry')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'symmetry' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                title="Mirror Axis (Select area first)"
              >
                <Ruler size={18} />
                <span className="text-[10px] font-medium">Mirror</span>
              </button>
              <button
                onClick={() => setCurrentTool('move')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'move' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                title="Move (Select area first)"
              >
                <Move size={18} />
                <span className="text-[10px] font-medium">Move</span>
              </button>
              <button
                onClick={() => setCurrentTool('duplicate')}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${currentTool === 'duplicate' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                title="Duplicate (Select area first)"
              >
                <Copy size={18} />
                <span className="text-[10px] font-medium">Copy</span>
              </button>
            </div>
          </div>

          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Actions</h2>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleCopy}
                disabled={!selectionStart}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy Selection"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={handlePaste}
                disabled={!clipboard}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Paste"
              >
                <ClipboardPaste size={16} />
              </button>
              <button
                onClick={handleFlipH}
                disabled={!selectionStart}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Flip Horizontal"
              >
                <FlipHorizontal size={16} />
              </button>
              <button
                onClick={handleFlipV}
                disabled={!selectionStart}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Flip Vertical"
              >
                <FlipVertical size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 border-b border-stone-100">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Colors</h2>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color);
                    if (currentTool === 'eraser') setCurrentTool('line');
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${currentColor === color && currentTool !== 'eraser' ? 'border-indigo-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color, boxShadow: currentColor === color && currentTool !== 'eraser' ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none' }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-stone-500 mb-1 block">Custom Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    setCurrentColor(e.target.value);
                    if (currentTool === 'eraser') setCurrentTool('line');
                  }}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm font-mono text-stone-600 uppercase">{currentColor}</span>
              </div>
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Grid Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Show Lines</span>
                <button
                  onClick={() => setShowGridLines(!showGridLines)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showGridLines ? 'bg-indigo-500' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showGridLines ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Realistic View</span>
                <button
                  onClick={() => setShowRealistic(!showRealistic)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showRealistic ? 'bg-indigo-500' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showRealistic ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div>
                <span className="text-sm text-stone-600 block mb-2">Grid Size ({gridSize.width}x{gridSize.height})</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setGridSize(s => ({ width: Math.max(10, s.width - 10), height: Math.max(10, s.height - 10) }))}
                    className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="range" 
                    min="10" max="60" step="10"
                    value={gridSize.width}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setGridSize({ width: val, height: val });
                    }}
                    className="flex-1 accent-indigo-600"
                  />
                  <button 
                    onClick={() => setGridSize(s => ({ width: Math.min(60, s.width + 10), height: Math.min(60, s.height + 10) }))}
                    className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 overflow-auto bg-stone-200/50 p-8 flex items-center justify-center relative" id="canvas-container">
          <div className="relative" style={{ width: 'fit-content' }}>
            <div 
              className="bg-white shadow-xl transition-all duration-200 ease-in-out relative z-10"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
                width: 'fit-content',
                borderTop: (showGridLines && !showRealistic) ? '1px solid #e5e7eb' : 'none',
                borderLeft: (showGridLines && !showRealistic) ? '1px solid #e5e7eb' : 'none',
                backgroundImage: showRealistic ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 20 0 L 0 20 M 0 0 L 20 20\' fill=\'none\' stroke=\'%23e7e5e4\' stroke-width=\'1\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1.5\' fill=\'%23d6d3d1\'/%3E%3C/svg%3E")' : 'none',
                backgroundColor: showRealistic ? '#f5f5f4' : 'white',
              }}
              onMouseLeave={handleCellUp}
            >
              {grid.map((row, rIndex) => (
                row.map((cellColor, cIndex) => {
                  const isThickRight = (cIndex + 1) % 10 === 0;
                  const isThickBottom = (rIndex + 1) % 10 === 0;
                  
                  return (
                    <div
                      key={`${rIndex}-${cIndex}`}
                      onMouseDown={() => handleCellDown(rIndex, cIndex)}
                      onMouseEnter={() => handleCellEnter(rIndex, cIndex)}
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-crosshair select-none relative group"
                      style={{
                        backgroundColor: (!showRealistic && cellColor) ? cellColor : 'transparent',
                        borderRight: (showGridLines && !showRealistic) ? (isThickRight ? '2px solid #9ca3af' : '1px solid #e5e7eb') : 'none',
                        borderBottom: (showGridLines && !showRealistic) ? (isThickBottom ? '2px solid #9ca3af' : '1px solid #e5e7eb') : 'none',
                      }}
                      draggable={false}
                    >
                      {/* Hover indicator */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                      
                      {/* Cross stitch pattern overlay */}
                      {!showRealistic && cellColor && (
                        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 10 10">
                          <line x1="2" y1="2" x2="8" y2="8" stroke="black" strokeWidth="0.5" />
                          <line x1="8" y1="2" x2="2" y2="8" stroke="black" strokeWidth="0.5" />
                        </svg>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
            
            {/* SVG Overlay for Lines */}
            <svg 
              className="absolute inset-0 pointer-events-none z-10" 
              viewBox={`0 0 ${gridSize.width} ${gridSize.height}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <filter id="thread-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0.1" dy="0.1" stdDeviation="0.1" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Template Overlay */}
              {!showRealistic && selectedTemplate !== -1 && TEMPLATES[selectedTemplate].pattern.map((row, r) =>
                row.split('').map((char, c) => char !== '.' ? (
                  <rect key={`tpl-${r}-${c}`} x={c + Math.floor(gridSize.width/2) - 5} y={r + Math.floor(gridSize.height/2) - 5} width={1} height={1} fill="rgba(99, 102, 241, 0.15)" />
                ) : null)
              )}

              {lines.map((line, i) => (
                <React.Fragment key={i}>
                  {!showRealistic && <circle cx={line.c1 + 0.5} cy={line.r1 + 0.5} r="0.12" fill="#292524" opacity="0.4" />}
                  {!showRealistic && <circle cx={line.c2 + 0.5} cy={line.r2 + 0.5} r="0.12" fill="#292524" opacity="0.4" />}
                  <line 
                    x1={line.c1 + 0.5} 
                    y1={line.r1 + 0.5} 
                    x2={line.c2 + 0.5} 
                    y2={line.r2 + 0.5} 
                    stroke={line.color} 
                    strokeWidth={showRealistic ? "0.35" : "0.15"} 
                    strokeLinecap="round"
                    filter={showRealistic ? "url(#thread-shadow)" : undefined}
                  />
                  {showRealistic && (
                    <line
                      x1={line.c1 + 0.5} y1={line.r1 + 0.5}
                      x2={line.c2 + 0.5} y2={line.r2 + 0.5}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.1"
                      strokeDasharray="0.1 0.2"
                      strokeLinecap="round"
                    />
                  )}
                </React.Fragment>
              ))}
              {currentTool === 'line' && dragStart && dragCurrent && (
                <React.Fragment>
                  <circle cx={dragStart.c + 0.5} cy={dragStart.r + 0.5} r="0.12" fill="#292524" opacity="0.4" />
                  <line 
                    x1={dragStart.c + 0.5} 
                    y1={dragStart.r + 0.5} 
                    x2={dragCurrent.c + 0.5} 
                    y2={dragCurrent.r + 0.5} 
                    stroke={currentColor} 
                    strokeWidth="0.15" 
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  {/* Needle */}
                  <g transform={`translate(${dragCurrent.c + 0.5}, ${dragCurrent.r + 0.5}) rotate(-45)`}>
                    {/* Thread from hole to eye */}
                    <path d="M 0 0 Q 1.5 1.0 2.6 0" fill="none" stroke={currentColor} strokeWidth="0.08" opacity="0.8" strokeLinecap="round" />
                    
                    {/* Drop shadow for needle */}
                    <line x1="0.1" y1="0.2" x2="3.1" y2="0.2" stroke="rgba(0,0,0,0.2)" strokeWidth="0.12" strokeLinecap="round" />
                    
                    {/* Needle body */}
                    <line x1="0" y1="0" x2="3" y2="0" stroke="#cbd5e1" strokeWidth="0.14" strokeLinecap="round" />
                    
                    {/* Needle tip */}
                    <polygon points="0,0 0.4,-0.07 0.4,0.07" fill="#cbd5e1" />
                    
                    {/* Needle eye (asola) */}
                    <ellipse cx="2.6" cy="0" rx="0.2" ry="0.04" fill="#334155" />
                    <ellipse cx="2.6" cy="0" rx="0.1" ry="0.02" fill="#f1f5f9" />
                    
                    {/* Thread tail out of the eye */}
                    <path d="M 2.6 0 Q 3.0 -0.5 3.3 -0.1" fill="none" stroke={currentColor} strokeWidth="0.08" opacity="0.8" strokeLinecap="round" />
                  </g>
                </React.Fragment>
              )}
              {currentTool === 'symmetry' && dragStart && dragCurrent && (
                <line 
                  x1={dragStart.c + 0.5} 
                  y1={dragStart.r + 0.5} 
                  x2={dragCurrent.c + 0.5} 
                  y2={dragCurrent.r + 0.5} 
                  stroke="#ef4444" 
                  strokeWidth="0.2" 
                  strokeDasharray="0.5 0.5"
                  strokeLinecap="round"
                />
              )}
              {(currentTool === 'move' || currentTool === 'duplicate') && dragStart && dragCurrent && selectionStart && selectionEnd && (() => {
                const bounds = getSelectionBounds();
                if (!bounds) return null;
                const { minR, maxR, minC, maxC } = bounds;
                const deltaR = dragCurrent.r - dragStart.r;
                const deltaC = dragCurrent.c - dragStart.c;
                
                const previewCells = [];
                for (let r = minR; r <= maxR; r++) {
                  for (let c = minC; c <= maxC; c++) {
                    if (grid[r][c]) {
                      previewCells.push(
                        <g key={`preview-${r}-${c}`} transform={`translate(${c + deltaC}, ${r + deltaR})`} opacity="0.5">
                          <line x1="0.1" y1="0.1" x2="0.9" y2="0.9" stroke={grid[r][c]} strokeWidth="0.15" strokeLinecap="round" />
                          <line x1="0.9" y1="0.1" x2="0.1" y2="0.9" stroke={grid[r][c]} strokeWidth="0.15" strokeLinecap="round" />
                        </g>
                      );
                    }
                  }
                }
                
                const previewLines = lines.filter(l => 
                  l.r1 >= minR && l.r1 <= maxR && l.c1 >= minC && l.c1 <= maxC &&
                  l.r2 >= minR && l.r2 <= maxR && l.c2 >= minC && l.c2 <= maxC
                ).map((l, i) => (
                  <g key={`preview-line-${i}`} opacity="0.5">
                    <circle cx={l.c1 + deltaC + 0.5} cy={l.r1 + deltaR + 0.5} r="0.12" fill="rgba(41, 37, 36, 0.4)" />
                    <circle cx={l.c2 + deltaC + 0.5} cy={l.r2 + deltaR + 0.5} r="0.12" fill="rgba(41, 37, 36, 0.4)" />
                    <line 
                      x1={l.c1 + deltaC + 0.5} 
                      y1={l.r1 + deltaR + 0.5} 
                      x2={l.c2 + deltaC + 0.5} 
                      y2={l.r2 + deltaR + 0.5} 
                      stroke={l.color} 
                      strokeWidth="0.15" 
                      strokeLinecap="round" 
                    />
                  </g>
                ));

                return (
                  <React.Fragment>
                    {previewCells}
                    {previewLines}
                    <rect 
                      x={Math.min(selectionStart.c, selectionEnd.c) + deltaC}
                      y={Math.min(selectionStart.r, selectionEnd.r) + deltaR}
                      width={Math.abs(selectionEnd.c - selectionStart.c) + 1}
                      height={Math.abs(selectionEnd.r - selectionStart.r) + 1}
                      fill="rgba(79, 70, 229, 0.1)"
                      stroke="#4f46e5"
                      strokeWidth="0.1"
                      strokeDasharray="0.4 0.4"
                    />
                  </React.Fragment>
                );
              })()}
              {selectionStart && selectionEnd && (
                <rect 
                  x={Math.min(selectionStart.c, selectionEnd.c)}
                  y={Math.min(selectionStart.r, selectionEnd.r)}
                  width={Math.abs(selectionEnd.c - selectionStart.c) + 1}
                  height={Math.abs(selectionEnd.r - selectionStart.r) + 1}
                  fill="rgba(79, 70, 229, 0.1)"
                  stroke="#4f46e5"
                  strokeWidth="0.1"
                  strokeDasharray="0.4 0.4"
                />
              )}
            </svg>

            {/* Watermark Overlay (On Top) */}
            {watermark && !showRealistic && (
              <div 
                className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-visible"
              >
                <img 
                  src={watermark} 
                  alt="Watermark" 
                  style={{
                    opacity: watermarkOpacity,
                    transform: `scale(${watermarkScale}) translate(${watermarkOffset.x}px, ${watermarkOffset.y}px)`,
                    transformOrigin: 'center',
                    maxWidth: 'none',
                  }} 
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Clear Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900">Clear Grid?</h3>
              <button onClick={() => setShowClearModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-stone-600 mb-6">Are you sure you want to clear the entire grid? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearGrid}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Clear Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
