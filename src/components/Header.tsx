import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="py-12 border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left relative">
        <a 
          href="https://mep-je.fr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-0 right-6 flex flex-col items-end gap-1 group"
        >
          <span className="text-[10px] uppercase tracking-widest text-stone-400 group-hover:text-stone-950 font-semibold border-b border-transparent group-hover:border-stone-950 transition-all duration-150 py-0.5">
            Made by MEP
          </span>
          <img 
            src="/logo_MEP_blanc_vec.svg" 
            alt="Logo MEP" 
            className="h-5 w-auto object-contain transition-opacity duration-150 group-hover:opacity-100 opacity-70"
            style={{ filter: "brightness(0)" }}
          />
        </a>
        <div className="inline-block px-3 py-1 border border-stone-200 text-xs font-medium uppercase tracking-wider text-stone-500 mb-4 bg-stone-50">
          Écosystème Loire & Saint-Étienne Lyon
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 font-normal leading-tight tracking-tight">
          L'Annuaire de l'Innovation
        </h1>
        <p className="mt-4 text-stone-600 max-w-2xl text-lg font-light leading-relaxed">
          Découvrez et filtrez en temps réel les programmes d'accompagnement et de financement pour propulser votre projet entrepreneurial dans le département de la Loire.
        </p>
      </div>
    </header>
  );
};
