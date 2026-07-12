import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-850 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo MEP à gauche */}
        <div className="flex items-center gap-4">
          <a 
            href="https://mep-je.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:opacity-80 transition-opacity"
            title="Mines Études et Projets (MEP) - Junior-Entreprise"
          >
            <img 
              src="/logo_MEP_blanc_vec.svg" 
              alt="Logo Mines Études et Projets" 
              className="h-10 w-auto object-contain"
            />
          </a>
          <div className="text-left text-xs border-l border-stone-800 pl-4">
            <p className="font-medium text-stone-300">Mines Études & Projets (MEP)</p>
            <p className="font-light text-stone-500">Junior-Entreprise de l'École des Mines de Saint-Étienne</p>
          </div>
        </div>

        {/* Lien discret vers la MIFE à droite */}
        <div className="text-center md:text-right text-xs space-y-1">
          <p className="font-light text-stone-500">
            Projet réalisé en partenariat avec la MIFE Loire Sud.
          </p>
          <a
            href="https://www.mife-loiresud.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-4 decoration-stone-800 hover:decoration-stone-500"
          >
            Aller sur le site de la MIFE
          </a>
        </div>
      </div>
    </footer>
  );
};
