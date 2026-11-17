import React from 'react';
import { BookOpen, MapPin, ShoppingBag, Sprout, Utensils } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Barra di navigazione mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#1B4332]/15 px-3 py-2 flex items-center justify-around no-print shadow-lg"
    >
      <a
        href="#storia"
        className="flex flex-col items-center gap-1 text-[#1B4332]/80 hover:text-[#1B4332] p-1.5 rounded-lg transition-colors"
      >
        <Sprout className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
        <span className="text-[10px] font-semibold">Storia</span>
      </a>

      <a
        href="#cassetta"
        className="flex flex-col items-center gap-1 text-[#1B4332]/80 hover:text-[#1B4332] p-1.5 rounded-lg transition-colors"
      >
        <ShoppingBag className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
        <span className="text-[10px] font-semibold">Cassetta 5€</span>
      </a>

      <a
        href="#ricettario"
        className="flex flex-col items-center gap-1 text-[#1B4332]/80 hover:text-[#1B4332] p-1.5 rounded-lg transition-colors"
      >
        <Utensils className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
        <span className="text-[10px] font-semibold">Ricette</span>
      </a>

      <a
        href="#il-borgo"
        className="flex flex-col items-center gap-1 text-[#1B4332]/80 hover:text-[#1B4332] p-1.5 rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
        <span className="text-[10px] font-semibold">Borgo</span>
      </a>

      <a
        href="#prenota"
        className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D97706] text-white shadow-xs"
      >
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        <span className="text-[10px] font-bold">Prenota</span>
      </a>
    </nav>
  );
};
