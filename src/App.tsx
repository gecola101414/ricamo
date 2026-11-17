import React, { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Award,
  CheckCircle2,
  ChefHat,
  Coffee,
  Droplets,
  Egg,
  HeartHandshake,
  Leaf,
  Menu,
  Recycle,
  Scale,
  Sprout,
  UtensilsCrossed,
  Wheat,
  X,
} from 'lucide-react';
import { BookingSection } from './components/BookingSection';
import { BorgoMapAnimation } from './components/BorgoMapAnimation';
import { RecipeSection } from './components/RecipeSection';
import {
  Euro5Banknote,
  RecycledCrateDiagram,
  SelfWateringPotDiagram,
  WheelchairGardenDiagram,
} from './components/TechnicalDiagrams';
import { MobileBottomNav } from './components/MobileBottomNav';
import { UpcycleSection } from './components/UpcycleSection';
import { KIDS_SHOW_COOKING } from './data/recipes';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-[#D8F3DC] via-[#F1F8F5] to-[#FEF3C7] flex flex-col items-center justify-center p-8 text-center border border-[#1B4332]/15 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-10 h-10 text-[#2D6A4F] mb-3" aria-hidden="true" />
        <p className="font-display text-lg font-semibold text-[#1B4332]">
          {fallbackTitle}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stampsCollected, setStampsCollected] = useState(3);
  const [openKidsRecipeId, setOpenKidsRecipeId] = useState<number>(1);
  const [upcyclePrefill, setUpcyclePrefill] = useState<{
    text: string;
    version: number;
  }>({ text: '', version: 0 });

  const navItems = [
    { href: '#storia', label: 'La Storia' },
    { href: '#cassetta', label: 'Cassetta 5€' },
    { href: '#ricettario', label: 'Ricettario' },
    { href: '#orti', label: 'Orti Solidali' },
    { href: '#non-lo-buttare', label: 'Non lo buttare' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1B4332]">
      {/* Sticky Top Bar (3-zone contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#1B4332]/12 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 text-[#1B4332] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] rounded-lg"
          >
            <span className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D8F3DC] flex items-center justify-center shrink-0">
              <Sprout className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight">
              Il Massimo della Terra
            </span>
          </a>

          {/* Zone 2: Concise single-line nav links */}
          <nav
            aria-label="Navigazione principale"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1B4332]/80"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-[#1B4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#prenota"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              Prenota Cassetta 5€
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              className="lg:hidden p-2 rounded-lg border border-[#1B4332]/20 text-[#1B4332] hover:bg-[#F1F8F5] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Menu mobile"
            className="lg:hidden border-t border-[#1B4332]/12 bg-[#FAF9F6] px-4 py-4 space-y-2"
          >
            {[
              { href: '#storia', label: 'La Storia di Massimo' },
              { href: '#cassetta', label: 'La Cassetta 5€' },
              { href: '#ricettario', label: 'Ricettario & Menù' },
              { href: '#orti', label: 'Orti Accessibili' },
              { href: '#non-lo-buttare', label: 'Non lo buttare, portalo da Massimo' },
              { href: '#bambini', label: 'Bambini & Show Cooking' },
              { href: '#listino', label: 'Listino & Banca delle Ore' },
              { href: '#prenota', label: 'Prenota Ora' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1B4332] hover:bg-[#F1F8F5]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top" className="flex-1 no-print">
        {/* HERO SECTION */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-sm font-semibold text-[#D97706] mb-3">
                  Dove la cura diventa raccolto: cibo vero, 5 euro, zero sprechi.
                </p>

                <h1 className="font-display text-[clamp(2.1rem,3.8vw,3.4rem)] font-semibold text-[#1B4332] leading-[1.12] tracking-tight text-balance">
                  Mangiare sano, spendere 5 euro, zero sprechi. Tutto nasce dalla terra di Massimo.
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#1B4332]/82 leading-relaxed max-w-xl">
                  Ortaggi non trattati coltivati con amore, uova fresche, riso italiano di altissima
                  qualità e ricette antispreco per tutta la famiglia. Un progetto agricolo e sociale
                  aperto a tutti, anche in sedia a rotelle.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#cassetta"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                  >
                    Scopri la Cassetta da 5€
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <a
                    href="#orti"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-[#1B4332]/25 hover:bg-[#F1F8F5] text-[#1B4332] font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                  >
                    Esplora gli Orti Solidali
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-[#1B4332]/12 bg-[#F1F8F5]">
                  <ResilientImage
                    src="/src/assets/images/hero_cassetta_orto_1794819239497.jpg"
                    alt="Cassetta di legno con ortaggi freschi non trattati, uova contadine, riso italiano ed erbe aromatiche nell'orto di Massimo"
                    fallbackTitle="La Cassetta di Massimo — Ortaggi, Uova e Riso"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics 4-Pillar Bar */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#F1F8F5] border border-[#1B4332]/12 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#D97706] tabular-nums">
                    5 €
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#1B4332]">
                    2 pasti completi per 2 persone
                  </p>
                </div>
                <Euro5Banknote className="w-24 h-auto shrink-0 shadow-xs rounded" />
              </div>

              <div className="p-5 rounded-2xl bg-[#F1F8F5] border border-[#1B4332]/12">
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1B4332] tabular-nums">
                  100%
                </p>
                <p className="mt-1 text-sm font-medium text-[#1B4332]">
                  Zero sprechi (dalla buccia al gambo)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F1F8F5] border border-[#1B4332]/12">
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1B4332] tabular-nums">
                  Ogni 5 Cassette
                </p>
                <p className="mt-1 text-sm font-medium text-[#1B4332]">
                  1 piantina aromatica in omaggio
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F1F8F5] border border-[#1B4332]/12">
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#2D6A4F] tabular-nums">
                  100% Accessibile
                </p>
                <p className="mt-1 text-sm font-medium text-[#1B4332]">
                  Cassoni ergonomici per carrozzine
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE INIZIALE: LA STORIA DI MASSIMO */}
        <section id="storia" className="py-20 bg-[#F1F8F5] border-t border-[#1B4332]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Narrative Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <p className="text-sm font-semibold text-[#D97706] mb-2">
                    La Storia di Massimo · Dalla Cura alla Terra Condivisa
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
                    Dopo anni dedicati ai miei genitori, ho reinventato il mio lavoro per far
                    fiorire un progetto solidale per tutti.
                  </h2>
                </div>

                <div className="space-y-4 text-base text-[#1B4332]/85 leading-relaxed">
                  <p>
                    Per lunghi anni la mia vita ha avuto una sola priorità: restare accanto ai miei
                    genitori, assisterli ogni giorno con pazienza e amore, mettendo in pausa
                    qualsiasi altro progetto professionale. Chi ha vissuto l’esperienza di accudire
                    una persona cara sa quanto quel tempo sia prezioso e totale.
                  </p>
                  <p>
                    Quando li ho persi, insieme al vuoto lasciato dalla loro assenza è arrivata una
                    sfida concreta: rimettermi in gioco e{' '}
                    <strong className="font-semibold text-[#1B4332]">
                      reinventare da zero un lavoro dignitoso
                    </strong>{' '}
                    alla mia età. Non volevo però un’attività solitaria o distante dalle persone.
                    Volevo che tutto ciò che avevo imparato in quegli anni — la cura quotidiana,
                    l’attenzione a chi ha difficoltà motorie, il rispetto per il cibo e per ogni
                    risorsa — diventasse il seme di qualcosa di nuovo.
                  </p>
                  <p>
                    Così è nato{' '}
                    <strong className="font-semibold text-[#1B4332]">
                      “Il Massimo della Terra”
                    </strong>
                    : un lavoro onesto che sostiene me e allo stesso tempo tende la mano al borgo.
                    Orti con cassoni rialzati per chi si muove in carrozzina, cassette da 5 euro
                    alla portata di tutte le famiglie, ricette per non sprecare nemmeno una buccia
                    e una Banca delle Ore dove nessuno resta escluso.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#1B4332]/15">
                  <blockquote className="font-display text-lg sm:text-xl italic text-[#1B4332] leading-relaxed">
                    &ldquo;Accudire i miei genitori mi ha insegnato che la cura vera non si ferma
                    alla porta di casa. Quando sono rimasto solo ho scelto la terra: un mestiere
                    che mi permette di vivere con dignità e di creare un bene concreto anche per
                    chi fa fatica a fare la spesa o cerca una comunità.&rdquo;
                  </blockquote>
                  <p className="mt-3 text-xs font-semibold text-[#2D6A4F]">
                    Massimo · Fondatore de Il Massimo della Terra
                  </p>
                </div>
              </div>

              {/* Right Milestones Column */}
              <div className="lg:col-span-5 bg-white border border-[#1B4332]/15 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#D97706] mb-1">
                    Il Percorso Umano e Sociale
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                    Tre passi da una storia vera
                  </h3>
                </div>

                <ol className="space-y-5">
                  <li className="pb-5 border-b border-[#1B4332]/10">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="tabular-nums text-xs font-bold text-[#D97706]">01.</span>
                      <h4 className="font-display text-lg font-semibold text-[#1B4332]">
                        Gli anni dedicati ai genitori
                      </h4>
                    </div>
                    <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                      Anni di assistenza familiare quotidiana che hanno insegnato il valore della
                      pazienza, dell’ascolto e dell’abbattimento delle barriere fisiche in casa e
                      fuori.
                    </p>
                  </li>

                  <li className="pb-5 border-b border-[#1B4332]/10">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="tabular-nums text-xs font-bold text-[#D97706]">02.</span>
                      <h4 className="font-display text-lg font-semibold text-[#1B4332]">
                        La perdita e la scelta di ripartire
                      </h4>
                    </div>
                    <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                      Dopo il lutto, la necessità di costruire un nuovo sostentamento trasformando
                      la fatica della ripartenza in energia utile per il territorio.
                    </p>
                  </li>

                  <li>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="tabular-nums text-xs font-bold text-[#D97706]">03.</span>
                      <h4 className="font-display text-lg font-semibold text-[#1B4332]">
                        Un progetto solidale per sé e per gli altri
                      </h4>
                    </div>
                    <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                      Un lavoro agricolo circolare che garantisce auto-sostentamento onesto a
                      Massimo e porta cibo sano a 5 euro, orti accessibili e laboratori alle
                      famiglie del borgo.
                    </p>
                  </li>
                </ol>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="#cassetta"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    Scopri come sosteniamo il progetto
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 1: LA CASSETTA ANTISPRECO DA 5 € */}
        <section id="cassetta" className="py-20 bg-white border-t border-[#1B4332]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
              <div className="lg:col-span-7">
                <p className="text-sm font-semibold text-[#D97706] mb-2">
                  Spesa Sostenibile &amp; Contadina
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
                  La Cassetta Antispreco da 5 €: cosa porti in tavola
                </h2>
                <p className="mt-4 text-base text-[#1B4332]/82 leading-relaxed">
                  Con una sola banconota da{' '}
                  <strong className="font-semibold text-[#1B4332]">5 euro</strong> porti
                  a casa tutto il necessario per cucinare{' '}
                  <strong className="font-semibold text-[#1B4332]">
                    2 pasti completi per 2 persone
                  </strong>{' '}
                  (Antipasto, Primo, Secondo, Contorno e Dolce). Non devi comprare altro al
                  supermercato: ti servono solo{' '}
                  <strong className="font-semibold text-[#1B4332]">
                    olio, sale e pepe
                  </strong>{' '}
                  che hai già in casa.
                </p>

                <div className="mt-5 inline-flex items-center gap-4 p-3.5 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/15">
                  <Euro5Banknote className="w-24 h-auto shrink-0 rounded" />
                  <div className="text-xs sm:text-sm text-[#1B4332]/85 leading-snug">
                    <strong className="block font-semibold text-[#1B4332]">
                      Basta una banconota da 5 €
                    </strong>
                    Cassetta in legno riciclato con vuoto a rendere: la riporti al ritiro successivo.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#1B4332]/12 bg-[#F1F8F5]">
                  <ResilientImage
                    src="/src/assets/images/cassetta_ingredienti_1794819239209.jpg"
                    alt="Ingredienti della cassetta di Massimo disposti su panno di lino: zucca, patate, cipolle, sedano, broccoli, uova fresche, riso Carnaroli, erbe aromatiche e mele"
                    fallbackTitle="Ingredienti della Cassetta da 5€"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4 Cards: Cosa trovi dentro la cassetta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <article className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#1B4332]/12">
                <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                  <Wheat className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium text-[#2D6A4F] mb-1">
                  01 · Base dei Primi Piatti
                </p>
                <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                  Riso Italiano Superfino
                </h3>
                <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                  Bustine monoporzione già dosate di riso Carnaroli o Vialone Nano di altissima
                  qualità, pronte per risotti cremosi o minestre contadine.
                </p>
              </article>

              <article className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#1B4332]/12">
                <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
                  <Egg className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium text-[#2D6A4F] mb-1">
                  02 · Proteine Genuine
                </p>
                <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                  Uova Fresche Contadine
                </h3>
                <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                  Deposte da galline allevate a ciclo chiuso nell’orto, nutrite ogni giorno con gli
                  scarti vegetali sani e le erbe di campo.
                </p>
              </article>

              <article className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#1B4332]/12">
                <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                  <Leaf className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium text-[#2D6A4F] mb-1">
                  03 · Raccolto di Stagione
                </p>
                <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                  Ortaggi &amp; Erbe Non Trattati
                </h3>
                <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                  Zucca, patate, cipolle, sedano, broccoli, erbette spontanee e mazzetto aromatico
                  fresco (alloro, rosmarino, salvia) colti in giornata.
                </p>
              </article>

              <article className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#1B4332]/12">
                <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
                  <Sprout className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium text-[#2D6A4F] mb-1">
                  04 · Fine Pasto Naturale
                </p>
                <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                  Frutta Fresca o Secca
                </h3>
                <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                  Mele, fichi o frutta secca con ricetta per preparare dolci espressi in casa,
                  senza marmellate industriali o zuccheri aggiunti.
                </p>
              </article>
            </div>

            {/* Golden Broth Rule + Loyalty 5-Crates Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#F1F8F5] border border-[#2D6A4F]/20">
                <div className="flex items-center gap-2.5 text-[#1B4332] mb-3">
                  <Recycle className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
                  <h3 className="font-display text-xl font-semibold">
                    La Regola d’Oro del Brodo Zero-Sprechi
                  </h3>
                </div>
                <p className="text-sm text-[#1B4332]/85 leading-relaxed">
                  Prima di iniziare a cucinare, lava bene le{' '}
                  <strong className="font-semibold">bucce di patate e zucca</strong>, unisci i{' '}
                  <strong className="font-semibold">gambi del sedano e delle erbe</strong> in 1,5
                  litri d’acqua fredda e fai sobbollire per 25 minuti. Otterrai{' '}
                  <strong className="font-semibold">
                    1,5 litri di brodo vegetale naturale
                  </strong>{' '}
                  perfetto per mantecare il risotto senza comprare dadi industriali.
                </p>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#FEF3C7]/60 border border-[#D97706]/30 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 text-[#92400E] mb-2">
                    <Award className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
                    <h3 className="font-display text-xl font-semibold text-[#1B4332]">
                      La Regola delle 5 Cassette (Fedeltà)
                    </h3>
                  </div>
                  <p className="text-sm text-[#1B4332]/85 leading-relaxed">
                    Colleziona 5 timbri sulla tua tessera e ricevi{' '}
                    <strong className="font-semibold text-[#1B4332]">GRATIS</strong> un vasetto
                    vivo di erbe aromatiche (rosmarino, salvia, menta o alloro) cresciute nel
                    nostro compost!
                  </p>
                </div>

                {/* Interactive Stamp Preview */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D97706]/20">
                  <div className="flex items-center gap-2" aria-label="Simulatore timbri tessera fedeltà">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const active = num <= stampsCollected;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStampsCollected(num)}
                          aria-label={`Imposta ${num} timbri su 5`}
                          className={`w-9 h-9 rounded-full border text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#D97706] border-[#D97706] text-white'
                              : 'bg-white border-[#D97706]/40 text-[#92400E]'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-[#92400E]">
                    {stampsCollected === 5
                      ? '5/5 timbri: Piantina aromatica GRATIS!'
                      : `${stampsCollected}/5 timbri · clicca per simulare`}
                  </span>
                </div>
              </div>
            </div>

            {/* La Cassetta in Legno Riciclato: Progetto Semplice & Vuoto a Rendere */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10 border-t border-[#1B4332]/12">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-sm font-semibold text-[#D97706]">
                  Vuoto a Rendere &amp; Falegnameria Sociale
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332] tracking-tight text-balance">
                  Cassette in legno riciclato da restituire: un motivo in più per tornare
                </h3>
                <p className="text-sm sm:text-base text-[#1B4332]/82 leading-relaxed">
                  Niente buste di plastica né cartoni usa e getta. La nostra cassetta è costruita a
                  mano in modo semplice con{' '}
                  <strong className="font-semibold text-[#1B4332]">
                    legno riciclato non trattato
                  </strong>{' '}
                  ed è a{' '}
                  <strong className="font-semibold text-[#1B4332]">vuoto a rendere</strong>: quando
                  hai finito di cucinare, la riporti all’orto la volta successiva. È il modo più
                  semplice per azzerare i rifiuti e avere sempre un motivo per tornare a trovarci.
                </p>
                <ul className="space-y-2.5 text-sm text-[#1B4332]/85">
                  <li className="flex items-start gap-2.5">
                    <span className="tabular-nums font-bold text-[#2D6A4F]">01.</span>
                    <span>
                      <strong>Materiale semplice:</strong> assi recuperate da bancali marchiati HT
                      (trattati solo a calore, senza sostanze chimiche), tagliate e levigate.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="tabular-nums font-bold text-[#2D6A4F]">02.</span>
                    <span>
                      <strong>Struttura robusta:</strong> 4 listelli d’angolo, fondo a doghe e due
                      maniglie laterali intagliate per portarla comodamente a mano o sulle ginocchia.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="tabular-nums font-bold text-[#2D6A4F]">03.</span>
                    <span>
                      <strong>Ritorno all’orto:</strong> restituisci la cassetta vuota al ritiro
                      seguente, prendi quella nuova piena e accumuli il timbro fedeltà.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-7">
                <RecycledCrateDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 2: RICETTARIO INTERATTIVO */}
        <RecipeSection />

        {/* SEZIONE 3: ORTI SOLIDALI ACCESSIBILI & ECONOMIA CIRCOLARE */}
        <section id="orti" className="py-20 bg-[#FAF9F6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-[#D97706] mb-2">
                Inclusione Reale &amp; Economia Circolare
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
                Orti Senza Barriere e L’Oro Nero di Massimo
              </h2>
              <p className="mt-3 text-base text-[#1B4332]/80 leading-relaxed">
                Coltivare la terra fa bene al corpo e alla comunità. Per questo ogni cassone è
                progettato per essere raggiunto comodamente anche in sedia a rotelle, in un ciclo
                continuo che trasforma gli scarti del quartiere in fertilità.
              </p>
            </div>

            <BorgoMapAnimation />

            {/* Accessible Beds + Photo + Technical SVG Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#1B4332]/12">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Accessibility className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                      Orti Senza Barriere: Cassoni Ergonomici
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#1B4332]/82 leading-relaxed">
                    I nostri cassoni rialzati hanno un’altezza compresa tra{' '}
                    <strong className="font-semibold text-[#1B4332] tabular-nums">
                      80 e 85 cm
                    </strong>{' '}
                    e presentano un{' '}
                    <strong className="font-semibold text-[#1B4332]">
                      incavo inferiore libero
                    </strong>{' '}
                    per le ginocchia e le pedane. Le persone in sedia a rotelle possono avvicinarsi
                    frontalmente o lateralmente e seminare, raccogliere e potare senza fatica, su
                    camminamenti piani e compatti.
                  </p>
                </div>

                <WheelchairGardenDiagram />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#1B4332]/12 bg-[#F1F8F5]">
                  <ResilientImage
                    src="/src/assets/images/orto_solidale_bambini_1794819239696.jpg"
                    alt="Orto solidale urbano con cassoni accessibili in legno, persona in sedia a rotelle che coltiva e vasetti riciclati per bambini"
                    fallbackTitle="Orto Solidale Accessibile di Massimo"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 rounded-2xl bg-[#F1F8F5] border border-[#2D6A4F]/20">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Coffee className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
                    <h3 className="font-display text-xl font-semibold text-[#1B4332]">
                      Il Ciclo del Compost (“L’Oro Nero di Massimo”)
                    </h3>
                  </div>
                  <p className="text-sm text-[#1B4332]/85 leading-relaxed">
                    Raccogliamo gratuitamente gli scarti vegetali puliti e i{' '}
                    <strong className="font-semibold">fondi di caffè dai bar del quartiere</strong>,
                    unendoli a sfalci secchi e foglie nelle compostiere integrate sotto ai cassoni.
                    In pochi mesi diventano terriccio soffice, scuro e ricchissimo di nutrienti
                    naturali, senza concimi chimici.
                  </p>
                </div>
              </div>
            </div>

            {/* 2 Community Cards: Banca delle Ore + Adotta un Cassone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="p-6 sm:p-7 rounded-2xl bg-white border border-[#1B4332]/12 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <HeartHandshake className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                      Banca delle Ore Solidale
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#1B4332]/82 leading-relaxed">
                    Non hai disponibilità economica ma hai tempo, voglia di stare all’aria aperta o
                    manualità? Chi aiuta nell’orto, nella raccolta o nei laboratori accumula ore
                    che vengono ripagate direttamente in{' '}
                    <strong className="font-semibold text-[#1B4332]">
                      cassette da 5 €, uova fresche, ortaggi e compost
                    </strong>
                    . Scambio alla pari, dignità e comunità.
                  </p>
                </div>
                <div>
                  <a
                    href="#prenota"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] hover:text-[#1B4332] hover:underline underline-offset-4"
                  >
                    Partecipa alla Banca delle Ore
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </article>

              <article className="p-6 sm:p-7 rounded-2xl bg-white border border-[#1B4332]/12 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Sprout className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                      Adotta un Cassone Solidale
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#1B4332]/82 leading-relaxed">
                    Famiglie, cittadini o negozi di quartiere possono adottare un cassone
                    accessibile oppure donare una o più{' '}
                    <strong className="font-semibold text-[#1B4332]">
                      “cassette sospese” da 5 €
                    </strong>{' '}
                    destinate alle famiglie in difficoltà del territorio. Un piccolo gesto che
                    raddoppia il raccolto sociale.
                  </p>
                </div>
                <div>
                  <a
                    href="#prenota"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D97706] hover:text-[#B45309] hover:underline underline-offset-4"
                  >
                    Dona una cassetta sospesa o adotta un cassone
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SEZIONE 4: NON LO BUTTARE, PORTALO DA MASSIMO */}
        <UpcycleSection
          onSelectDropOff={(objectIdea) =>
            setUpcyclePrefill((prev) => ({
              text: objectIdea,
              version: prev.version + 1,
            }))
          }
        />

        {/* SEZIONE 5: LABORATORI PER BAMBINI & SHOW COOKING EDUCATIVO */}
        <section id="bambini" className="py-20 bg-white border-y border-[#1B4332]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#D97706] mb-2">
                Educazione Alimentare &amp; Riciclo Creativo
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
                Laboratori per Bambini &amp; Show Cooking Educativo
              </h2>
              <p className="mt-3 text-base text-[#1B4332]/80 leading-relaxed">
                Imparare da piccoli che nulla si butta e tutto si trasforma: dalla bottiglia di
                plastica riciclata che diventa un vaso auto-irrigante fino ai fornelli con Massimo.
              </p>
            </div>

            {/* Piccoli Giardinieri a Costo Zero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                    Laboratorio “Piccoli Giardinieri a Costo Zero”
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-[#1B4332]/82 leading-relaxed">
                  I bambini costruiscono con le proprie mani vasetti auto-irriganti (sistema SIP con
                  stoppino in cotone) riciclando bottiglie di plastica tagliate a metà e incastrate
                  sul fondo, oppure decorando flaconi del latte e dei detersivi ben lavati.
                </p>

                <ol className="space-y-3 text-sm text-[#1B4332]/85">
                  <li className="p-3.5 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/10 flex items-start gap-3">
                    <span className="tabular-nums font-bold text-[#D97706]">01.</span>
                    <span>
                      <strong>Taglia e incastra:</strong> la parte alta della bottiglia si capovolge
                      nel fondo, che funge da serbatoio d’acqua pulita.
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/10 flex items-start gap-3">
                    <span className="tabular-nums font-bold text-[#D97706]">02.</span>
                    <span>
                      <strong>Inserisci lo stoppino:</strong> un cordino di cotone passa dal tappo
                      forato e pesca l’acqua per capillarità fino alle radici.
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/10 flex items-start gap-3">
                    <span className="tabular-nums font-bold text-[#D97706]">03.</span>
                    <span>
                      <strong>Compost e talea a casa:</strong> ogni bambino riempie il vaso con
                      l’“Oro Nero” di Massimo, pianta una talea aromatica e la porta a casa!
                    </span>
                  </li>
                </ol>
              </div>

              <div className="lg:col-span-7">
                <SelfWateringPotDiagram />
              </div>
            </div>

            {/* Show Cooking: Mani in Pasta (e nel Riso!) */}
            <div className="pt-8 border-t border-[#1B4332]/12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <ChefHat className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1B4332]">
                      Show Cooking “Mani in Pasta (e nel Riso!)”
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#1B4332]/80">
                    4 ricette divertenti per bambini e famiglie: clicca su ciascuna per vedere
                    ingredienti e passaggi pratici.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {KIDS_SHOW_COOKING.map((recipe) => {
                  const isOpen = openKidsRecipeId === recipe.id;
                  return (
                    <article
                      key={recipe.id}
                      className="rounded-2xl bg-[#FAF9F6] border border-[#1B4332]/15 p-6 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-[#2D6A4F] font-medium mb-1.5">
                          <span>{recipe.ageNote}</span>
                          <span className="tabular-nums font-semibold">{recipe.duration}</span>
                        </div>
                        <h4 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                          {recipe.id}. {recipe.title}
                        </h4>
                        <p className="text-sm text-[#1B4332]/80 mb-4">{recipe.funFact}</p>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenKidsRecipeId(isOpen ? 0 : recipe.id)
                          }
                          aria-expanded={isOpen}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D97706] hover:text-[#B45309] cursor-pointer"
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5" aria-hidden="true" />
                          {isOpen ? 'Nascondi ricetta' : 'Leggi ingredienti e preparazione'}
                        </button>

                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-[#1B4332]/12 space-y-3 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-[#1B4332]/70 mb-1">
                                Ingredienti:
                              </p>
                              <ul className="space-y-1 text-[#1B4332]/85">
                                {recipe.ingredients.map((ing, i) => (
                                  <li key={i}>• {ing}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#1B4332]/70 mb-1">
                                Insieme ai bambini:
                              </p>
                              <ol className="space-y-1 text-[#1B4332]/85">
                                {recipe.steps.map((step, i) => (
                                  <li key={i}>
                                    <strong className="tabular-nums text-[#2D6A4F]">
                                      {i + 1}.
                                    </strong>{' '}
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 5: LISTINO TRASPARENTE & SOSTEGNO AL PROGETTO */}
        <section id="listino" className="py-20 bg-[#FAF9F6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-sm font-semibold text-[#D97706] mb-2">
                Prezzi Chiari &amp; Giusti
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
                Listino Trasparente &amp; Sostegno al Progetto
              </h2>
              <p className="mt-3 text-base text-[#1B4332]/80 leading-relaxed">
                Nessuna sorpresa, nessun intermediario: ogni euro sostiene direttamente il lavoro
                dell’orto, i cassoni accessibili e i laboratori gratuiti per le scuole.
              </p>
            </div>

            <div className="bg-white border border-[#1B4332]/15 rounded-2xl overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F1F8F5] border-b border-[#1B4332]/12 text-xs font-semibold text-[#1B4332]/80">
                      <th className="py-4 px-6">Iniziativa / Prodotto</th>
                      <th className="py-4 px-6">Cosa include</th>
                      <th className="py-4 px-6 text-right">Contributo / Prezzo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B4332]/10 text-sm">
                    <tr className="bg-[#FEF3C7]/25">
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Cassetta Antispreco Completa (2 pasti x 2 persone)
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Ortaggi non trattati, uova fresche, riso italiano, frutta e foglietto menù.{' '}
                        <strong className="text-[#92400E]">
                          Ogni 5 cassette: 1 piantina aromatica gratis
                        </strong>
                      </td>
                      <td className="py-4 px-6 text-right font-display text-xl font-bold text-[#D97706] tabular-nums whitespace-nowrap">
                        <div className="inline-flex items-center gap-2.5 justify-end">
                          <Euro5Banknote className="w-14 h-auto rounded shadow-2xs" />
                          <span>5 €</span>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Vasetto di Erbe Aromatiche Vive
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Rosmarino, Salvia, Menta o Alloro cresciuti in terriccio di compost naturale
                      </td>
                      <td className="py-4 px-6 text-right font-display text-lg font-bold text-[#1B4332] tabular-nums whitespace-nowrap">
                        2,50 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Sacchetto di Compost Naturale Vagliato (“Oro Nero” 5 L)
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Terriccio fertile ottenuto da scarti vegetali dell’orto e fondi di caffè
                      </td>
                      <td className="py-4 px-6 text-right font-display text-lg font-bold text-[#1B4332] tabular-nums whitespace-nowrap">
                        4,00 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Laboratori Bambini &amp; Show Cooking
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Attività per scuole, gruppi e famiglie (vasetti SIP riciclati + cucina antispreco)
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[#2D6A4F] whitespace-nowrap">
                        Contributo libero / Convenzioni
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Banca delle Ore Solidale
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Scambio alla pari con ore di aiuto nell’orto ripagate in cassette, uova e ortaggi
                      </td>
                      <td className="py-4 px-6 text-right font-display text-lg font-bold text-[#2D6A4F] tabular-nums whitespace-nowrap">
                        0,00 €
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 px-6 font-semibold text-[#1B4332]">
                        Non lo buttare, portalo da Massimo
                      </td>
                      <td className="py-4 px-6 text-[#1B4332]/80">
                        Dai nuova vita a oggetti inutilizzati: se Massimo riesce a venderli, metà dell’introito torna a te
                      </td>
                      <td className="py-4 px-6 text-right font-display text-lg font-bold text-[#D97706] tabular-nums whitespace-nowrap">
                        50% in prodotti
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trasparenza, Legalità e Km Zero */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#F1F8F5] border border-[#2D6A4F]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2.5 text-[#1B4332]">
                  <Scale className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
                  <h3 className="font-display text-xl font-semibold">
                    Trasparenza, Legalità e Km Zero
                  </h3>
                </div>
                <p className="text-sm text-[#1B4332]/85 leading-relaxed">
                  “Il Massimo della Terra” opera come piccola produzione agricola locale di
                  prossimità: distribuiamo esclusivamente{' '}
                  <strong className="font-semibold">prodotti freschi non trasformati</strong>{' '}
                  raccolti direttamente sul posto, nel pieno rispetto delle normative igienico-sanitarie
                  e fiscali per la vendita diretta agricola, con zero plastica monouso e zero sprechi.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] shrink-0">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Filiera corta · 100% locale</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 6: PRENOTAZIONE RAPIDA & WHATSAPP */}
        <BookingSection prefilledUpcycleNote={upcyclePrefill} />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#122D21] text-[#D8F3DC] py-12 border-t border-[#D8F3DC]/10 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#D8F3DC]/15">
            <div className="md:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-2.5 text-white">
                <Sprout className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <span className="font-display text-xl font-bold">
                  Il Massimo della Terra
                </span>
              </div>
              <p className="text-sm text-[#F59E0B] font-medium italic">
                &ldquo;Dove la cura diventa raccolto: cibo vero, 5 euro, zero sprechi.&rdquo;
              </p>
              <p className="text-sm text-[#D8F3DC]/80 max-w-md leading-relaxed">
                Iniziativa di agricoltura urbana circolare, inclusione sociale e lotta allo spreco
                alimentare. Orti solidali accessibili a tutti, anche in sedia a rotelle.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <h3 className="text-xs font-semibold text-white">Sezioni del Progetto</h3>
              <ul className="space-y-2 text-sm text-[#D8F3DC]/80">
                <li>
                  <a href="#storia" className="hover:text-white transition-colors">
                    La Storia di Massimo
                  </a>
                </li>
                <li>
                  <a href="#cassetta" className="hover:text-white transition-colors">
                    La Cassetta 5€
                  </a>
                </li>
                <li>
                  <a href="#ricettario" className="hover:text-white transition-colors">
                    Ricettario &amp; Menù
                  </a>
                </li>
                <li>
                  <a href="#orti" className="hover:text-white transition-colors">
                    Orti Accessibili
                  </a>
                </li>
                <li>
                  <a href="#non-lo-buttare" className="hover:text-white transition-colors">
                    Non lo buttare, portalo da Massimo
                  </a>
                </li>
                <li>
                  <a href="#bambini" className="hover:text-white transition-colors">
                    Bambini &amp; Show Cooking
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <h3 className="text-xs font-semibold text-white">Partecipa</h3>
              <ul className="space-y-2 text-sm text-[#D8F3DC]/80">
                <li>
                  <a href="#listino" className="hover:text-white transition-colors">
                    Listino &amp; Banca delle Ore
                  </a>
                </li>
                <li>
                  <a href="#prenota" className="hover:text-white transition-colors">
                    Prenota Cassetta 5€
                  </a>
                </li>
                <li>
                  <a href="#orti" className="hover:text-white transition-colors">
                    Adotta un Cassone Solidale
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#D8F3DC]/70">
            <p>© {new Date().getFullYear()} Il Massimo della Terra — Agricoltura Urbana Solidale.</p>
            <p>Accesso senza barriere · Km Zero · Zero Sprechi</p>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
