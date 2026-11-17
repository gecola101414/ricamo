import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Minus, Plus, Send } from 'lucide-react';

const PICKUP_DAYS = [
  'Martedì (16:00 – 19:00)',
  'Giovedì (16:00 – 19:00)',
  'Sabato mattina (09:00 – 13:00)',
  'Domenica mattina (09:30 – 12:30)',
];

const HERB_OPTIONS = [
  'Misto a scelta di Massimo',
  'Rosmarino',
  'Salvia',
  'Menta',
  'Alloro',
];

interface BookingSectionProps {
  prefilledUpcycleNote?: { text: string; version: number };
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  prefilledUpcycleNote,
}) => {
  const [fullName, setFullName] = useState('');
  const [crateQty, setCrateQty] = useState(1);
  const [herbPotQty, setHerbPotQty] = useState(0);
  const [herbChoice, setHerbChoice] = useState(HERB_OPTIONS[0]);
  const [compostQty, setCompostQty] = useState(0);
  const [kidsWorkshop, setKidsWorkshop] = useState(false);
  const [timeBankJoin, setTimeBankJoin] = useState(false);
  const [upcycleDropOff, setUpcycleDropOff] = useState(false);
  const [upcycleItem, setUpcycleItem] = useState('');
  const [pickupDay, setPickupDay] = useState(PICKUP_DAYS[2]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefilledUpcycleNote && prefilledUpcycleNote.version > 0) {
      setUpcycleDropOff(true);
      if (prefilledUpcycleNote.text) {
        setUpcycleItem(prefilledUpcycleNote.text);
      }
    }
  }, [prefilledUpcycleNote]);

  const totalEuro = useMemo(() => {
    return crateQty * 5 + herbPotQty * 2.5 + compostQty * 4;
  }, [crateQty, herbPotQty, compostQty]);

  const formatEuro = (value: number) =>
    Number.isInteger(value)
      ? `${value} €`
      : value.toFixed(2).replace('.', ',') + ' €';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCopied(false);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Inserisci il tuo Nome e Cognome per preparare la prenotazione.');
      return;
    }

    if (
      crateQty === 0 &&
      herbPotQty === 0 &&
      compostQty === 0 &&
      !kidsWorkshop &&
      !timeBankJoin &&
      !upcycleDropOff
    ) {
      setErrorMsg(
        'Seleziona almeno una Cassetta da 5€, un prodotto dell’orto, un oggetto da portare o un’attività.'
      );
      return;
    }

    setErrorMsg('');

    const lines: string[] = [
      `Ciao Massimo! Vorrei prenotare tramite "Il Massimo della Terra":`,
      ``,
      `Nome e Cognome: ${fullName.trim()}`,
      `Giorno preferito per il ritiro: ${pickupDay}`,
      ``,
      `Dettaglio richiesta:`,
    ];

    if (crateQty > 0) {
      lines.push(
        `- ${crateQty}x Cassetta Antispreco in legno riciclato da 5 € (${formatEuro(crateQty * 5)})`
      );
    }
    if (herbPotQty > 0) {
      lines.push(
        `- ${herbPotQty}x Vasetto Erbe Aromatiche (${herbChoice}) — ${formatEuro(
          herbPotQty * 2.5
        )}`
      );
    }
    if (compostQty > 0) {
      lines.push(
        `- ${compostQty}x Sacchetto Compost "Oro Nero" 5L — ${formatEuro(
          compostQty * 4
        )}`
      );
    }
    if (kidsWorkshop) {
      lines.push(
        `- Adesione Laboratorio Bambini & Show Cooking (contributo libero)`
      );
    }
    if (timeBankJoin) {
      lines.push(
        `- Richiesta adesione Banca delle Ore Solidale (scambio lavoro/prodotti)`
      );
    }
    if (upcycleDropOff) {
      const desc = upcycleItem.trim() ? `: ${upcycleItem.trim()}` : '';
      lines.push(
        `- Consegna oggetto per "Non lo buttare, portalo da Massimo"${desc} (50% dell’eventuale vendita in prodotti dell’orto)`
      );
    }

    lines.push(``);
    lines.push(`Totale stimato al ritiro: ${formatEuro(totalEuro)}`);

    if (crateQty >= 5) {
      const freePlants = Math.floor(crateQty / 5);
      lines.push(
        `Omaggio Fedeltà (Regola delle 5 Cassette): ${freePlants} piantina aromatica GRATIS!`
      );
    }

    if (notes.trim()) {
      lines.push(`Note: ${notes.trim()}`);
    }

    lines.push(``);
    lines.push(`Grazie! "Dove la cura diventa raccolto: cibo vero, 5 euro, zero sprechi."`);

    setGeneratedSummary(lines.join('\n'));
  };

  const handleCopy = async () => {
    if (!generatedSummary) return;
    try {
      await navigator.clipboard.writeText(generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const whatsappUrl = generatedSummary
    ? `https://wa.me/393330000000?text=${encodeURIComponent(generatedSummary)}`
    : '#prenota';

  return (
    <section id="prenota" className="py-20 bg-[#1B4332] text-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left column: Intro & pickup summary */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-semibold text-[#F59E0B] mb-2">
                Prenotazione Rapida &amp; WhatsApp
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-balance">
                Prenota la tua Cassetta da 5 € direttamente con Massimo
              </h2>
              <p className="mt-4 text-base text-[#D8F3DC]/90 leading-relaxed">
                Compila i campi qui accanto: calcoliamo subito il totale esatto e prepariamo
                il messaggio pronto da inviare su WhatsApp senza attese né costi aggiuntivi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#2D6A4F]/45 border border-[#D8F3DC]/20 space-y-4">
              <h3 className="font-display text-lg font-semibold text-white">
                Come funziona il ritiro all’orto
              </h3>
              <ul className="space-y-3 text-sm text-[#D8F3DC]/90">
                <li className="flex items-start gap-3">
                  <span className="tabular-nums font-bold text-[#F59E0B]">01.</span>
                  <span>
                    Scegli il numero di cassette, eventuali vasetti aromatici o compost e il giorno
                    di ritiro più comodo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="tabular-nums font-bold text-[#F59E0B]">02.</span>
                  <span>
                    Invia il riepilogo su WhatsApp: Massimo raccoglie gli ortaggi freschi in
                    mattinata per evitare ogni spreco.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="tabular-nums font-bold text-[#F59E0B]">03.</span>
                  <span>
                    Ritiri la cassetta in legno riciclato (vuoto a rendere da restituire la volta
                    successiva), con accesso senza barriere e timbro sulla tessera fedeltà.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-[#FAF9F6] text-[#1B4332] rounded-2xl p-6 sm:p-8 border border-[#D8F3DC]/30">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-sm font-semibold text-[#1B4332] mb-1.5"
                >
                  Nome e Cognome *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Es. Giulia Rossi"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#1B4332]/20 text-sm text-[#1B4332] placeholder:text-[#1B4332]/45 focus:outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* Quantity selectors */}
              <div className="space-y-3">
                <span className="block text-sm font-semibold text-[#1B4332]">
                  Cosa desideri prenotare?
                </span>

                {/* Cassetta 5€ */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#1B4332]/15">
                  <div>
                    <p className="text-sm font-semibold text-[#1B4332]">
                      Cassetta Antispreco in Legno Riciclato
                    </p>
                    <p className="text-xs text-[#2D6A4F] tabular-nums">
                      5 € · 2 pasti completi x 2 persone (vuoto a rendere)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCrateQty((q) => Math.max(0, q - 1))}
                      aria-label="Riduci numero cassette"
                      className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center font-semibold tabular-nums">
                      {crateQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCrateQty((q) => q + 1)}
                      aria-label="Aumenta numero cassette"
                      className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Vasetto Erbe Aromatiche */}
                <div className="p-4 rounded-xl bg-white border border-[#1B4332]/15 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1B4332]">
                        Vasetto Erbe Aromatiche Vive
                      </p>
                      <p className="text-xs text-[#2D6A4F] tabular-nums">
                        2,50 € · Rosmarino, Salvia, Menta o Alloro
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setHerbPotQty((q) => Math.max(0, q - 1))}
                        aria-label="Riduci numero vasetti aromatici"
                        className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                      >
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-semibold tabular-nums">
                        {herbPotQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setHerbPotQty((q) => q + 1)}
                        aria-label="Aumenta numero vasetti aromatici"
                        className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {herbPotQty > 0 && (
                    <div>
                      <label
                        htmlFor="herb-choice"
                        className="block text-xs font-medium text-[#2D6A4F] mb-1"
                      >
                        Preferenza piantina:
                      </label>
                      <select
                        id="herb-choice"
                        value={herbChoice}
                        onChange={(e) => setHerbChoice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#1B4332]/20 text-xs text-[#1B4332]"
                      >
                        {HERB_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Sacchetto Compost */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#1B4332]/15">
                  <div>
                    <p className="text-sm font-semibold text-[#1B4332]">
                      Sacchetto Compost Naturale (“Oro Nero” 5 L)
                    </p>
                    <p className="text-xs text-[#2D6A4F] tabular-nums">
                      4,00 € · Vagliato e pronto per vasi e orto
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCompostQty((q) => Math.max(0, q - 1))}
                      aria-label="Riduci sacchetti compost"
                      className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center font-semibold tabular-nums">
                      {compostQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCompostQty((q) => q + 1)}
                      aria-label="Aumenta sacchetti compost"
                      className="w-10 h-10 rounded-lg border border-[#1B4332]/20 flex items-center justify-center hover:bg-[#F1F8F5] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Workshops & Time Bank checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#1B4332]/15 cursor-pointer hover:border-[#2D6A4F]/40">
                    <input
                      type="checkbox"
                      checked={kidsWorkshop}
                      onChange={(e) => setKidsWorkshop(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#1B4332]"
                    />
                    <span className="text-xs leading-relaxed">
                      <strong className="block text-sm text-[#1B4332]">
                        Laboratorio Bambini
                      </strong>
                      Vasetti riciclati &amp; Show Cooking (contributo libero)
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#1B4332]/15 cursor-pointer hover:border-[#2D6A4F]/40">
                    <input
                      type="checkbox"
                      checked={timeBankJoin}
                      onChange={(e) => setTimeBankJoin(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#1B4332]"
                    />
                    <span className="text-xs leading-relaxed">
                      <strong className="block text-sm text-[#1B4332]">
                        Banca delle Ore Solidale
                      </strong>
                      Partecipa aiutando nell’orto (scambio 0,00 €)
                    </span>
                  </label>
                </div>

                {/* Non lo buttare drop-off */}
                <div className="p-3.5 rounded-xl bg-white border border-[#1B4332]/15 space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upcycleDropOff}
                      onChange={(e) => setUpcycleDropOff(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#D97706]"
                    />
                    <span className="text-xs leading-relaxed">
                      <strong className="block text-sm text-[#1B4332]">
                        Non lo buttare, portalo da Massimo
                      </strong>
                      Porto un oggetto da rigenerare (50% della vendita in prodotti dell’orto)
                    </span>
                  </label>
                  {upcycleDropOff && (
                    <input
                      type="text"
                      value={upcycleItem}
                      onChange={(e) => setUpcycleItem(e.target.value)}
                      placeholder="Descrivi l’oggetto (es. sedia in legno, attrezzi, vasi...)"
                      aria-label="Descrizione oggetto da portare a Massimo"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#FAF9F6] border border-[#1B4332]/20 text-xs sm:text-sm text-[#1B4332] placeholder:text-[#1B4332]/45 focus:outline-none focus:border-[#1B4332]"
                    />
                  )}
                </div>
              </div>

              {/* Day & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pickup-day"
                    className="block text-sm font-semibold text-[#1B4332] mb-1.5"
                  >
                    Giorno preferito per il ritiro
                  </label>
                  <select
                    id="pickup-day"
                    value={pickupDay}
                    onChange={(e) => setPickupDay(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#1B4332]/20 text-sm text-[#1B4332] focus:outline-none focus:border-[#1B4332]"
                  >
                    {PICKUP_DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-sm font-semibold text-[#1B4332] mb-1.5"
                  >
                    Note (opzionale)
                  </label>
                  <input
                    id="booking-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Es. accesso facilitato, cassetta sospesa..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#1B4332]/20 text-sm text-[#1B4332] placeholder:text-[#1B4332]/45 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              {/* Total bar & Submit */}
              <div className="pt-4 border-t border-[#1B4332]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-[#2D6A4F] block">
                    Totale stimato al ritiro
                  </span>
                  <span className="font-display text-3xl font-bold text-[#1B4332] tabular-nums">
                    {formatEuro(totalEuro)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Genera Prenotazione / Invia su WhatsApp
                </button>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-amber-50 border border-[#D97706]/40 text-sm text-[#92400E] font-medium"
                >
                  {errorMsg}
                </div>
              )}

              {generatedSummary && (
                <div className="p-5 rounded-2xl bg-[#F1F8F5] border border-[#2D6A4F]/30 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-semibold text-[#1B4332]">
                      Riepilogo Pronto per Massimo
                    </h4>
                    <span className="text-xs font-semibold text-[#2D6A4F]">
                      Pronto all’invio
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#1B4332]/90 bg-white p-4 rounded-xl border border-[#1B4332]/12 leading-relaxed">
                    {generatedSummary}
                  </pre>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Apri e Invia su WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#1B4332]/20 hover:bg-[#D8F3DC]/50 text-[#1B4332] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-[#2D6A4F]" aria-hidden="true" />
                          Messaggio Copiato
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" aria-hidden="true" />
                          Copia Messaggio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
