import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Hammer,
  PackageOpen,
  RefreshCw,
  ShoppingBasket,
  X,
} from 'lucide-react';

interface UpcycleSectionProps {
  onSelectDropOff?: (objectIdea: string) => void;
}

const PRESET_VALUES = [10, 20, 30, 50];

export const UpcycleSection: React.FC<UpcycleSectionProps> = ({
  onSelectDropOff,
}) => {
  const [salePrice, setSalePrice] = useState<number>(20);
  const [customNote, setCustomNote] = useState('');

  const userShare = salePrice * 0.5;
  const fullCrates = Math.floor(userShare / 5);
  const remainder = userShare % 5;

  const formatEuro = (val: number) =>
    Number.isInteger(val) ? `${val} €` : val.toFixed(2).replace('.', ',') + ' €';

  const handleBookObject = () => {
    if (onSelectDropOff) {
      onSelectDropOff(customNote.trim());
    }
    const target = document.getElementById('prenota');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="non-lo-buttare"
      className="py-20 bg-[#F1F8F5] border-t border-[#1B4332]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold text-[#D97706] mb-2">
            Recupero Creativo &amp; Scambio Solidale 50 / 50
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
            Non lo buttare, portalo da Massimo!
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1B4332]/85 leading-relaxed">
            Hai in casa, in cantina o in garage un oggetto che non usi più e stai per buttare via?
            Portalo all’orto da me: lo pulisco, lo riparo o lo trasformo per dargli una{' '}
            <strong className="font-semibold text-[#1B4332]">nuova vita</strong>. E se riesco a
            venderlo,{' '}
            <strong className="font-semibold text-[#1B4332]">
              la metà esatta dell’introito torna a te in valore di prodotti freschi
            </strong>{' '}
            della nostra terra.
          </p>
        </div>

        {/* 4-Step Editorial Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <article className="p-6 rounded-2xl bg-white border border-[#1B4332]/12 flex flex-col justify-between gap-3">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                <PackageOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#D97706] tabular-nums mb-1">
                Passo 01
              </p>
              <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                Porti ciò che vuoi buttare
              </h3>
              <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                Prima di andare in discarica, porti da Massimo mobili, attrezzi, vasi, oggetti in
                legno, ferro o piccoli articoli di casa ancora recuperabili.
              </p>
            </div>
          </article>

          <article className="p-6 rounded-2xl bg-white border border-[#1B4332]/12 flex flex-col justify-between gap-3">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-4">
                <Hammer className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#D97706] tabular-nums mb-1">
                Passo 02
              </p>
              <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                Massimo gli dà nuova vita
              </h3>
              <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                Con cura artigianale l’oggetto viene sistemato, levigato, riparato oppure
                reinventato in un pezzo unico utile per la casa o il giardino.
              </p>
            </div>
          </article>

          <article className="p-6 rounded-2xl bg-white border border-[#1B4332]/12 flex flex-col justify-between gap-3">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#D97706] tabular-nums mb-1">
                Passo 03
              </p>
              <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
                Vendita solidale al borgo
              </h3>
              <p className="text-sm text-[#1B4332]/80 leading-relaxed">
                L’oggetto rigenerato trova una nuova famiglia nel mercatino dell’orto a un prezzo
                onesto, evitando rifiuti inutili nell’ambiente.
              </p>
            </div>
          </article>

          <article className="p-6 rounded-2xl bg-[#1B4332] text-white border border-[#1B4332] flex flex-col justify-between gap-3">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#F59E0B] text-[#1B4332] flex items-center justify-center mb-4">
                <ShoppingBasket className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#F59E0B] tabular-nums mb-1">
                Passo 04 · 50% a te
              </p>
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                Metà dell’introito in prodotti
              </h3>
              <p className="text-sm text-[#D8F3DC]/90 leading-relaxed">
                Quando l’oggetto viene venduto, ricevi subito il{' '}
                <strong className="text-white">50% del valore in prodotti dell’orto</strong>:
                cassette da 5 €, uova fresche, ortaggi, erbe aromatiche e compost.
              </p>
            </div>
          </article>
        </div>

        {/* Interactive 50/50 Calculator + Acceptable Items Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive 50% Value Simulator */}
          <div className="lg:col-span-6 bg-white border border-[#1B4332]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#D97706] mb-1">
                  Esempio Pratico · Calcola il tuo 50%
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                  Quanto cibo porti a casa se vendiamo il tuo oggetto?
                </h3>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="upcycle-price-range" className="font-medium text-[#1B4332]/85">
                    Valore di vendita dell’oggetto rigenerato:
                  </label>
                  <span className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">
                    {formatEuro(salePrice)}
                  </span>
                </div>

                <input
                  id="upcycle-price-range"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  {PRESET_VALUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSalePrice(val)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                        salePrice === val
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-[#F1F8F5] text-[#1B4332] hover:bg-[#D8F3DC]'
                      }`}
                    >
                      Venduto a {val} €
                    </button>
                  ))}
                </div>
              </div>

              {/* 50 / 50 Split Visual Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FEF3C7]/60 border border-[#D97706]/30">
                  <p className="text-xs font-semibold text-[#92400E]">
                    Il tuo 50% in prodotti dell’orto
                  </p>
                  <p className="font-display text-3xl font-bold text-[#D97706] tabular-nums mt-1">
                    {formatEuro(userShare)}
                  </p>
                  <p className="text-xs text-[#1B4332]/85 mt-1.5 leading-snug">
                    {fullCrates > 0 ? (
                      <>
                        Equivale a{' '}
                        <strong className="text-[#1B4332]">
                          {fullCrates} {fullCrates === 1 ? 'Cassetta da 5 €' : 'Cassette da 5 €'}
                        </strong>
                        {remainder > 0 && (
                          <> + {formatEuro(remainder)} in vasetto aromatico o uova</>
                        )}
                      </>
                    ) : (
                      <>Equivale a 1 vasetto aromatico vivo (2,50 €)</>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F1F8F5] border border-[#2D6A4F]/20">
                  <p className="text-xs font-semibold text-[#2D6A4F]">
                    50% per il lavoro e l’Orto Solidale
                  </p>
                  <p className="font-display text-3xl font-bold text-[#1B4332] tabular-nums mt-1">
                    {formatEuro(userShare)}
                  </p>
                  <p className="text-xs text-[#1B4332]/80 mt-1.5 leading-snug">
                    Copre il restauro di Massimo, i materiali di recupero e i laboratori per
                    bambini.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick drop-off form hook */}
            <div className="pt-4 border-t border-[#1B4332]/12 space-y-3">
              <label
                htmlFor="upcycle-object-input"
                className="block text-xs font-semibold text-[#1B4332]"
              >
                Hai già qualcosa da portare? Scrivilo qui e prenota su WhatsApp:
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="upcycle-object-input"
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Es. vecchia sedia in legno, vasi in coccio, rastrello..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#1B4332]/20 text-sm text-[#1B4332] placeholder:text-[#1B4332]/45 focus:outline-none focus:border-[#1B4332]"
                />
                <button
                  type="button"
                  onClick={handleBookObject}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Portalo da Massimo
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: What to bring / Not accepted + Transparency note */}
          <div className="lg:col-span-6 bg-white border border-[#1B4332]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-[#2D6A4F] mb-1">
                  Guida Pratica al Ritiro
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#1B4332]">
                  Che cosa puoi portare all’orto?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-[#F1F8F5] border border-[#2D6A4F]/20">
                  <h4 className="font-display text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                    Sì, gli diamo nuova vita
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#1B4332]/85">
                    <li>• Sedie, tavolini, mensole e cassette in legno</li>
                    <li>• Attrezzi da orto, giardino e piccolo bricolage</li>
                    <li>• Vasi in terracotta, ceramica o fioriere robuste</li>
                    <li>• Biciclette, carrelli, lampade e oggetti vintage</li>
                    <li>• Pentole, barattoli grandi in vetro, ceste in vimini</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#1B4332]/15">
                  <h4 className="font-display text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
                    No, non possiamo ritirarli
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#1B4332]/75">
                    <li>• Plastica rotta, sbriciolata o imballaggi sporchi</li>
                    <li>• Elettrodomestici bruciati o rifiuti elettronici</li>
                    <li>• Vernici chimiche, solventi o materiali tossici</li>
                    <li>• Oggetti ammuffiti o strutturalmente irrecuperabili</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FEF3C7]/45 border border-[#D97706]/25 space-y-1.5">
              <h4 className="font-display text-base font-semibold text-[#1B4332]">
                Patto chiaro e trasparente tra vicini
              </h4>
              <p className="text-xs sm:text-sm text-[#1B4332]/85 leading-relaxed">
                Quando consegni l’oggetto, Massimo annota il tuo nome sul registro del borgo. Se
                l’oggetto non dovesse trovare un acquirente o preferissi riprenderlo indietro prima
                che venga trasformato, resta sempre tutto chiaro fin dal primo giorno. Quando viene
                venduto, passi a ritirare la tua metà in prodotti freschi della terra!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
