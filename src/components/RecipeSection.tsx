import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Clock,
  Printer,
  Recycle,
  Search,
  Utensils,
  X,
} from 'lucide-react';
import {
  COMPLETE_MENUS,
  RICE_RECIPES,
  SECOND_RECIPES,
  type RecipeItem,
} from '../data/recipes';

type ActiveTab = 'menus' | 'primi' | 'secondi';
type SecondiFilter = 'tutti' | 'uova' | 'legumi' | 'verdure';

export const RecipeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('menus');
  const [secondiFilter, setSecondiFilter] = useState<SecondiFilter>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPrimi = useMemo(() => {
    if (!normalizedQuery) return RICE_RECIPES;
    return RICE_RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(normalizedQuery) ||
        r.ingredients.some((i) => i.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  const filteredSecondi = useMemo(() => {
    return SECOND_RECIPES.filter((r) => {
      const matchesCat =
        secondiFilter === 'tutti' ? true : r.category === secondiFilter;
      if (!matchesCat) return false;
      if (!normalizedQuery) return true;
      return (
        r.title.toLowerCase().includes(normalizedQuery) ||
        r.ingredients.some((i) => i.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [secondiFilter, normalizedQuery]);

  const counts = useMemo(
    () => ({
      tutti: SECOND_RECIPES.length,
      uova: SECOND_RECIPES.filter((r) => r.category === 'uova').length,
      legumi: SECOND_RECIPES.filter((r) => r.category === 'legumi').length,
      verdure: SECOND_RECIPES.filter((r) => r.category === 'verdure').length,
    }),
    []
  );

  const renderRecipeCard = (recipe: RecipeItem) => (
    <article
      key={recipe.id}
      className="bg-white border border-[#1B4332]/12 rounded-2xl p-6 flex flex-col justify-between gap-4 transition-colors hover:border-[#2D6A4F]/40"
    >
      <div>
        <div className="flex items-center justify-between gap-3 text-xs text-[#2D6A4F] font-medium mb-2">
          <div className="flex items-center gap-2">
            <span className="tabular-nums font-semibold text-[#D97706]">
              Ricetta {String(recipe.id).padStart(2, '0')}
            </span>
            {recipe.categoryLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{recipe.categoryLabel}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
          </div>
          <span className="inline-flex items-center gap-1 tabular-nums text-[#1B4332]/75">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {recipe.prepTime}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-3">
          {recipe.title}
        </h3>

        <div className="mb-4">
          <p className="text-xs font-semibold text-[#1B4332]/70 mb-1.5">
            Ingredienti dalla cassetta (2 porzioni)
          </p>
          <ul className="space-y-1 text-sm text-[#1B4332]/85">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold leading-5" aria-hidden="true">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#1B4332]/70 mb-1.5">
            Preparazione
          </p>
          <ol className="space-y-1.5 text-sm text-[#1B4332]/85 leading-relaxed">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="tabular-nums font-semibold text-[#2D6A4F] shrink-0">
                  {idx + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="pt-3 border-t border-[#1B4332]/10 flex items-start gap-2 text-xs text-[#2D6A4F]">
        <Recycle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong className="font-semibold text-[#1B4332]">Zero Sprechi:</strong>{' '}
          {recipe.zeroWasteNote}
        </p>
      </div>
    </article>
  );

  return (
    <section id="ricettario" className="py-20 bg-[#F1F8F5] border-y border-[#1B4332]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#D97706] mb-2">
              Ricettario Interattivo Zero Sprechi
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
              1 Cassetta = 3 Menù Completi e 30 Ricette Contadine
            </h2>
            <p className="mt-3 text-base text-[#1B4332]/80 leading-relaxed">
              Tutte le ricette usano solo gli ortaggi, le uova, il riso e le erbe aromatiche
              della cassetta da 5 € più olio, sale e pepe che hai già in dispensa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#1B4332]/20 text-[#1B4332] font-semibold text-sm hover:bg-[#D8F3DC]/60 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <Printer className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
            Stampa Foglietto Menù
          </button>
        </div>

        {/* Interactive Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div
            role="tablist"
            aria-label="Sezioni del ricettario"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#1B4332]/12 rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'menus'}
              onClick={() => setActiveTab('menus')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                activeTab === 'menus'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#1B4332]/75 hover:text-[#1B4332] hover:bg-[#F1F8F5]'
              }`}
            >
              1 Cassetta = 3 Menù Completi
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'primi'}
              onClick={() => setActiveTab('primi')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                activeTab === 'primi'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#1B4332]/75 hover:text-[#1B4332] hover:bg-[#F1F8F5]'
              }`}
            >
              10 Primi con il Riso
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'secondi'}
              onClick={() => setActiveTab('secondi')}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                activeTab === 'secondi'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#1B4332]/75 hover:text-[#1B4332] hover:bg-[#F1F8F5]'
              }`}
            >
              20 Secondi Contadini
            </button>
          </div>

          {activeTab !== 'menus' && (
            <div className="relative w-full md:w-72">
              <Search
                className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca ingrediente o piatto..."
                aria-label="Cerca tra le ricette"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1B4332]/20 rounded-xl text-sm text-[#1B4332] placeholder:text-[#1B4332]/50 focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          )}
        </div>

        {/* TAB 1: 3 Complete Menus */}
        {activeTab === 'menus' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COMPLETE_MENUS.map((menu) => (
              <article
                key={menu.id}
                className="bg-white border border-[#1B4332]/12 rounded-2xl p-6 flex flex-col justify-between gap-6"
              >
                <div>
                  <p className="text-xs font-medium text-[#2D6A4F] mb-1">
                    {menu.servings}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#1B4332] mb-1.5">
                    {menu.title}
                  </h3>
                  <p className="text-sm text-[#1B4332]/75 mb-6">{menu.subtitle}</p>

                  <dl className="space-y-4">
                    {(
                      [
                        ['Antipasto', menu.courses.antipasto],
                        ['Primo', menu.courses.primo],
                        ['Secondo', menu.courses.secondo],
                        ['Contorno', menu.courses.contorno],
                        ['Dolce', menu.courses.dolce],
                      ] as const
                    ).map(([label, item]) => (
                      <div
                        key={label}
                        className="pb-3 border-b border-[#1B4332]/10 last:border-b-0 last:pb-0"
                      >
                        <dt className="text-xs font-semibold text-[#D97706] mb-0.5">
                          {label}
                        </dt>
                        <dd className="text-sm font-semibold text-[#1B4332]">
                          {item.name}
                        </dd>
                        <dd className="text-xs text-[#1B4332]/75 mt-1 leading-relaxed">
                          {item.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="p-4 rounded-xl bg-[#F1F8F5] border border-[#2D6A4F]/15 text-xs text-[#1B4332]/85 leading-relaxed">
                  <strong className="font-semibold text-[#1B4332]">
                    Consiglio di Massimo:
                  </strong>{' '}
                  {menu.zeroWasteTip}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* TAB 2: 10 Primi con il Riso */}
        {activeTab === 'primi' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#1B4332]/80">
                <BookOpen className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                <span>
                  Mostrate{' '}
                  <strong className="tabular-nums text-[#1B4332]">
                    {filteredPrimi.length}
                  </strong>{' '}
                  su <span className="tabular-nums">10</span> ricette di primi con riso italiano
                </span>
              </div>
            </div>

            {filteredPrimi.length === 0 ? (
              <div className="bg-white border border-[#1B4332]/12 rounded-2xl p-8 text-center">
                <p className="text-sm text-[#1B4332]/80 mb-3">
                  Nessuna ricetta trovata per &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-lg bg-[#1B4332] text-white text-sm font-semibold cursor-pointer"
                >
                  Mostra tutte le 10 ricette
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrimi.map(renderRecipeCard)}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: 20 Secondi Contadini */}
        {activeTab === 'secondi' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div
                className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#1B4332]/12 rounded-xl"
                role="group"
                aria-label="Filtra i secondi piatti per ingrediente principale"
              >
                {(
                  [
                    ['tutti', `Tutti (${counts.tutti})`],
                    ['uova', `Uova (${counts.uova})`],
                    ['legumi', `Legumi (${counts.legumi})`],
                    ['verdure', `Verdure (${counts.verdure})`],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSecondiFilter(key)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      secondiFilter === key
                        ? 'bg-[#D97706] text-white'
                        : 'text-[#1B4332]/80 hover:bg-[#F1F8F5]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-[#1B4332]/80">
                <Utensils className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                <span>
                  <strong className="tabular-nums text-[#1B4332]">
                    {filteredSecondi.length}
                  </strong>{' '}
                  ricette visualizzate
                </span>
              </div>
            </div>

            {filteredSecondi.length === 0 ? (
              <div className="bg-white border border-[#1B4332]/12 rounded-2xl p-8 text-center">
                <p className="text-sm text-[#1B4332]/80 mb-3">
                  Nessun secondo piatto corrisponde alla ricerca &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSecondiFilter('tutti');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#1B4332] text-white text-sm font-semibold cursor-pointer"
                >
                  Ripristina filtri
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSecondi.map(renderRecipeCard)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Preview Modal */}
      {isPrintModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4 no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-[#1B4332]/20 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#1B4332]/12 bg-[#F1F8F5]">
              <div>
                <h3 id="print-modal-title" className="font-display text-xl font-semibold text-[#1B4332]">
                  Anteprima Foglietto Menù da Inserire nella Cassetta
                </h3>
                <p className="text-xs text-[#2D6A4F]">
                  Formato ottimizzato A4 per stampa in bianco e nero o a colori
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97706] text-white text-sm font-semibold hover:bg-[#B45309] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  Stampa Ora
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  aria-label="Chiudi anteprima di stampa"
                  className="p-2 rounded-lg text-[#1B4332] hover:bg-[#D8F3DC] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#1B4332]">
              <div className="border-b border-[#1B4332]/20 pb-4 flex flex-wrap justify-between items-baseline gap-2">
                <div>
                  <h4 className="font-display text-2xl font-bold text-[#1B4332]">
                    Il Massimo della Terra — Foglietto della Cassetta da 5 €
                  </h4>
                  <p className="italic text-[#2D6A4F] mt-0.5">
                    &ldquo;Dove la cura diventa raccolto: cibo vero, 5 euro, zero sprechi.&rdquo;
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#1B4332]">
                  2 pasti completi · 2 persone
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F1F8F5] border border-[#1B4332]/15">
                <h5 className="font-display font-semibold text-base mb-1">
                  La Regola d’Oro del Brodo Zero-Sprechi
                </h5>
                <p className="text-xs leading-relaxed">
                  Prima di iniziare a cucinare, lava bene le bucce di patate e zucca, aggiungi i gambi
                  del sedano, la parte verde dei porri/cipolle e una foglia di alloro in 1,5 litri d’acqua
                  fredda. Fai sobbollire 25 minuti con un pizzico di sale: otterrai il brodo vegetale
                  naturale per mantecare i tuoi risotti a costo zero.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COMPLETE_MENUS.map((menu) => (
                  <div
                    key={menu.id}
                    className="p-4 rounded-xl border border-[#1B4332]/15 bg-[#FAF9F6]"
                  >
                    <h5 className="font-display font-semibold text-base text-[#1B4332] mb-2">
                      {menu.title}
                    </h5>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <strong>Antipasto:</strong> {menu.courses.antipasto.name}
                      </li>
                      <li>
                        <strong>Primo:</strong> {menu.courses.primo.name}
                      </li>
                      <li>
                        <strong>Secondo:</strong> {menu.courses.secondo.name}
                      </li>
                      <li>
                        <strong>Contorno:</strong> {menu.courses.contorno.name}
                      </li>
                      <li>
                        <strong>Dolce:</strong> {menu.courses.dolce.name}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-[#D97706]/30 bg-[#FEF3C7]/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong>Tessera Fedeltà — La Regola delle 5 Cassette:</strong> ogni 5 cassette
                  ritirate ricevi GRATIS un vasetto vivo di erbe aromatiche cresciute nel nostro compost.
                </div>
                <div className="font-semibold whitespace-nowrap">
                  Timbri: [ ] [ ] [ ] [ ] [ ]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden A4 Printable Insert (renders only during window.print()) */}
      <div className="hidden print-only p-8 text-[#111827]">
        <div className="border-b-2 border-[#1B4332] pb-4 mb-5 flex justify-between items-end">
          <div>
            <h1 className="font-display text-3xl font-bold">Il Massimo della Terra</h1>
            <p className="text-sm italic mt-1">
              &ldquo;Dove la cura diventa raccolto: cibo vero, 5 euro, zero sprechi.&rdquo;
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Cassetta Antispreco — 5 €</p>
            <p>2 pasti completi per 2 persone</p>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 mb-5">
          <h2 className="font-display text-lg font-bold mb-1">
            La Regola d’Oro del Brodo Zero-Sprechi
          </h2>
          <p className="text-xs leading-relaxed">
            Metti in pentola 1,5 litri di acqua fredda con le bucce ben lavate di patate e zucca,
            i gambi del sedano e le foglie esterne, più una foglia di alloro. Fai sobbollire 25
            minuti: hai pronto un brodo profumato per i risotti e le minestre senza usare dadi
            industriali e senza buttare nulla.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {COMPLETE_MENUS.map((menu) => (
            <div key={menu.id} className="border border-gray-300 rounded-lg p-3">
              <h3 className="font-display text-sm font-bold mb-2">{menu.title}</h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <strong>Antipasto:</strong> {menu.courses.antipasto.name}
                </li>
                <li>
                  <strong>Primo:</strong> {menu.courses.primo.name}
                </li>
                <li>
                  <strong>Secondo:</strong> {menu.courses.secondo.name}
                </li>
                <li>
                  <strong>Contorno:</strong> {menu.courses.contorno.name}
                </li>
                <li>
                  <strong>Dolce:</strong> {menu.courses.dolce.name}
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="border border-gray-400 rounded-lg p-3 flex justify-between items-center text-xs">
          <span>
            <strong>Tessera Fedeltà delle 5 Cassette:</strong> colleziona 5 timbri e ritira GRATIS
            una piantina aromatica viva!
          </span>
          <span className="font-bold tracking-widest">[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]</span>
        </div>
      </div>
    </section>
  );
};
