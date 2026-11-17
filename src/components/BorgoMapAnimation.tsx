import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Coffee,
  Pause,
  Play,
  ShoppingBasket,
  Sprout,
  Users,
} from 'lucide-react';

interface BorgoStage {
  id: number;
  title: string;
  shortLabel: string;
  location: string;
  description: string;
  metric: string;
  x: number;
  y: number;
  icon: 'sprout' | 'coffee' | 'basket' | 'users';
}

const BORGO_STAGES: BorgoStage[] = [
  {
    id: 1,
    title: '01. L’Orto Solidale e i Cassoni Accessibili',
    shortLabel: 'Orto Solidale',
    location: 'Terreni agricoli tra Via Principale e Via Pardesca',
    description:
      'Qui nascono gli ortaggi non trattati, le erbette spontanee e le uova a ciclo chiuso nei cassoni rialzati accessibili anche in sedia a rotelle.',
    metric: 'Raccolto fresco a Km 0',
    x: 368,
    y: 286,
    icon: 'sprout',
  },
  {
    id: 2,
    title: '02. Raccolta Circolare nel Borgo',
    shortLabel: 'Compost dal Borgo',
    location: 'Via Pardesca · Zona Bar e Botteghe',
    description:
      'I fondi di caffè dei bar e gli scarti vegetali puliti del quartiere tornano all’orto per trasformarsi nell’“Oro Nero” di Massimo.',
    metric: '100% scarti rigenerati',
    x: 292,
    y: 174,
    icon: 'coffee',
  },
  {
    id: 3,
    title: '03. Distribuzione della Cassetta da 5 €',
    shortLabel: 'Cassetta 5€',
    location: 'Via Messina / Piazza centrale del Borgo',
    description:
      'Le cassette complete in legno riciclato (da restituire al ritiro successivo) arrivano alle famiglie del borgo con il foglietto menù zero-sprechi.',
    metric: '5 € · 2 pasti x 2 persone',
    x: 238,
    y: 196,
    icon: 'basket',
  },
  {
    id: 4,
    title: '04. Laboratori per Bambini e Comunità',
    shortLabel: 'Scuole & Famiglie',
    location: 'Area Chiesa Santa Maria Del Soccorso · Via Novara',
    description:
      'Bambini, anziani e famiglie si ritrovano per i vasetti auto-irriganti riciclati, lo Show Cooking e la Banca delle Ore Solidale.',
    metric: 'Partecipazione aperta a tutti',
    x: 186,
    y: 78,
    icon: 'users',
  },
];

// Closed loop SVG path connecting the 4 stations along the borgo roads
const LOOP_PATH =
  'M 368 286 C 350 226, 336 152, 292 174 C 266 188, 254 198, 238 196 C 216 156, 204 114, 186 78 C 244 74, 344 104, 384 148 C 406 186, 396 246, 368 286 Z';

export const BorgoMapAnimation: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % BORGO_STAGES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReducedMotion]);

  const activeStage = BORGO_STAGES[activeStageIndex];

  const renderIcon = (icon: BorgoStage['icon']) => {
    switch (icon) {
      case 'sprout':
        return <Sprout className="w-4 h-4" aria-hidden="true" />;
      case 'coffee':
        return <Coffee className="w-4 h-4" aria-hidden="true" />;
      case 'basket':
        return <ShoppingBasket className="w-4 h-4" aria-hidden="true" />;
      case 'users':
        return <Users className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <div
      id="il-borgo"
      className="bg-white border border-[#1B4332]/15 rounded-2xl p-6 sm:p-8 mb-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#D97706] mb-1.5">
            Mappa Animata del Borgo
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] tracking-tight text-balance">
            Come vive il progetto circolare tra le vie del nostro borgo
          </h3>
          <p className="mt-2 text-sm sm:text-base text-[#1B4332]/80 leading-relaxed">
            Dalla terra coltivata lungo Via Principale fino alle famiglie tra Via Pardesca, Via
            Messina e la Chiesa di Santa Maria del Soccorso: segui il percorso animato o seleziona
            una tappa.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/20 text-[#1B4332] text-xs sm:text-sm font-semibold hover:bg-[#D8F3DC] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isPlaying && !prefersReducedMotion ? (
              <>
                <Pause className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
                Pausa Animazione
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                Avvia Animazione
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Aerial Map with SVG Motion Overlay */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[518/404] rounded-2xl overflow-hidden border border-[#1B4332]/20 bg-[#E8EFEA]">
            <img
              src="/assets/aistudio/image_42dc53d9.png"
              alt="Vista aerea del borgo tra Via Pardesca, Via Messina, Via Principale e Chiesa Santa Maria Del Soccorso"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle contrast veil so animated route & pins stand out crisply */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/35 via-transparent to-[#1B4332]/15 pointer-events-none"
              aria-hidden="true"
            />

            {/* Animated SVG Circuit & Moving Courier Marker */}
            <svg
              viewBox="0 0 518 404"
              className="absolute inset-0 w-full h-full"
              role="img"
              aria-label="Percorso animato dell'economia circolare di Il Massimo della Terra nel borgo"
            >
              {/* Soft base route shadow */}
              <path
                d={LOOP_PATH}
                fill="none"
                stroke="#1B4332"
                strokeWidth="7"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />

              {/* Animated flowing golden route */}
              <motion.path
                d={LOOP_PATH}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3.5"
                strokeDasharray="10 8"
                strokeLinecap="round"
                animate={
                  prefersReducedMotion || !isPlaying
                    ? undefined
                    : { strokeDashoffset: [0, -72] }
                }
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: 'linear',
                }}
              />

              {/* Highlight halo moving to active stage */}
              <motion.g
                animate={{ x: activeStage.x, y: activeStage.y }}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 20,
                }}
              >
                {!prefersReducedMotion && (
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={22}
                    fill="#F59E0B"
                    fillOpacity={0.28}
                    animate={{ scale: [0.85, 1.3, 0.85], opacity: [0.45, 0.12, 0.45] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  />
                )}
                <circle
                  cx={0}
                  cy={0}
                  r={17}
                  fill="none"
                  stroke="#FAF9F6"
                  strokeWidth="2.5"
                />
              </motion.g>

              {/* Clickable numbered station pins */}
              {BORGO_STAGES.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                return (
                  <g
                    key={stage.id}
                    transform={`translate(${stage.x}, ${stage.y})`}
                    onClick={() => {
                      setActiveStageIndex(idx);
                      setIsPlaying(false);
                    }}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Seleziona tappa ${stage.id}: ${stage.shortLabel}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStageIndex(idx);
                        setIsPlaying(false);
                      }
                    }}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={isActive ? 15 : 12.5}
                      fill={isActive ? '#D97706' : '#1B4332'}
                      stroke="#FAF9F6"
                      strokeWidth="2.5"
                    />
                    <text
                      x={0}
                      y={4.5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isActive ? '12' : '11'}
                      fontWeight="700"
                    >
                      {stage.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom-left active location caption */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-[#FAF9F6]/95 backdrop-blur-sm border border-[#1B4332]/20 rounded-xl px-4 py-2.5 shadow-sm">
              <p className="text-[11px] font-semibold text-[#D97706] tabular-nums">
                Tappa {activeStage.id} di {BORGO_STAGES.length} · {activeStage.metric}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#1B4332] truncate">
                {activeStage.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Synchronized Stage Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            {BORGO_STAGES.map((stage, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setActiveStageIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F1F8F5] border-[#1B4332]/35'
                      : 'bg-[#FAF9F6] border-[#1B4332]/12 hover:border-[#2D6A4F]/35'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#D8F3DC] text-[#1B4332]'
                      }`}
                    >
                      {renderIcon(stage.icon)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-base font-semibold text-[#1B4332]">
                          {stage.title}
                        </h4>
                      </div>
                      <p className="text-xs font-medium text-[#2D6A4F] mt-0.5">
                        {stage.location}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 text-xs sm:text-sm text-[#1B4332]/85 leading-relaxed"
                        >
                          {stage.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#FEF3C7]/50 border border-[#D97706]/25 flex items-center justify-between gap-3">
            <p className="text-xs text-[#1B4332]/85">
              <strong className="font-semibold text-[#1B4332]">
                Ciclo continuo a Km 0:
              </strong>{' '}
              ogni tappo della rete collega direttamente terra, famiglie e botteghe del borgo.
            </p>
            <a
              href="#prenota"
              className="px-3.5 py-2 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Unisciti ora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
