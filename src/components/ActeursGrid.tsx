import React from "react";
import { ActeurCard } from "./ActeurCard";
import type { Programme } from "../hooks/useActeursFilter";
import { AlertCircle, ArrowRight } from "lucide-react";
import { PHASE_COLORS } from "../utils/phaseColors";

interface ActeursGridProps {
  programmes: Programme[];
  onViewDetails: (programme: Programme) => void;
  activePhase: string;
  onChangePhase: (phase: string) => void;
  isFiltered: boolean;
}

const SECTIONS = [
  { id: "FAIRE EMERGER SON PROJET", label: "Faire émerger son projet", num: "01", desc: "Trouver l'idée, clarifier le projet et structurer les premières étapes." },
  { id: "ETRE ACCOMPAGNE(E)", label: "Être accompagné(e)", num: "02", desc: "Intégrer un incubateur, bénéficier d'un coaching et structurer son lancement." },
  { id: "FINANCER SON PROJET", label: "Financer son projet", num: "03", desc: "Accéder à des prêts d'honneur, des microcrédits ou du crowdfunding." },
  { id: "ETRE ACCELERE", label: "Être accéléré(e)", num: "04", desc: "Propulser sa start-up grâce à un accompagnement intensif de croissance." },
  { id: "SE DEVELOPPER", label: "Se développer", num: "05", desc: "Recruter, développer son CA, initier des démarches de R&D ou s'implanter." },
];

export const ActeursGrid: React.FC<ActeursGridProps> = ({
  programmes,
  onViewDetails,
  activePhase,
  onChangePhase,
  isFiltered,
}) => {
  if (programmes.length === 0) {
    return (
      <div className="py-20 text-center border border-stone-200 bg-white max-w-7xl mx-auto my-8 px-6">
        <AlertCircle className="h-10 w-10 text-stone-400 mx-auto mb-4 font-light" />
        <h4 className="font-serif text-2xl text-stone-900 mb-2 font-normal">
          Aucun programme trouvé
        </h4>
        <p className="text-stone-500 font-light text-sm max-w-md mx-auto">
          Nous n'avons trouvé aucune structure correspondant à vos filtres. Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
        </p>
      </div>
    );
  }

  // Cas 1 : Mode "TOUTES LES ÉTAPES" sans aucun filtre actif
  // On affiche le Dashboard interactif par catégories avec bulles d'accès rapide
  if (activePhase === "ALL" && !isFiltered) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* 1. Les Bulles de Catégories (Accès rapide) */}
        <div className="text-center">
          <h3 className="font-serif text-2xl text-stone-900 font-normal mb-8">
            Explorez par phase de développement
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {SECTIONS.map((section) => {
              const count = programmes.filter((p) => p.phasesProjet.includes(section.id)).length;
              const phaseInfo = PHASE_COLORS[section.id];
              return (
                <button
                  key={section.id}
                  onClick={() => onChangePhase(section.id)}
                  className="flex flex-col items-center pt-6 pb-7 px-6 border border-stone-200 bg-white hover:border-stone-400 transition-all w-40 text-center cursor-pointer group relative overflow-hidden rounded-sm shadow-sm hover:shadow-md duration-200"
                >
                  {/* Bande colorée en bas correspondant à la phase du projet */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5"
                    style={phaseInfo ? { backgroundColor: phaseInfo.color } : {}}
                  />
                  <span 
                    className="font-serif text-2xl mb-1"
                    style={phaseInfo ? { color: phaseInfo.color } : { color: "#d6d3d1" }}
                  >
                    {section.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800 line-clamp-2 h-8 flex items-center justify-center leading-snug">
                    {section.label}
                  </span>
                  <span className="mt-3 text-[9px] text-stone-400 font-semibold tracking-wider uppercase">
                    {count} programme{count > 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Les Sections de Grilles limitées */}
        <div className="space-y-24">
          {SECTIONS.map((section) => {
            const sectionProgrammes = programmes.filter((p) => p.phasesProjet.includes(section.id));
            const previewProgrammes = sectionProgrammes.slice(0, 3); // Top 3 seulement
            const phaseInfo = PHASE_COLORS[section.id];

            if (previewProgrammes.length === 0) return null;

            return (
              <div key={section.id} className="border-t border-stone-200 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                  <div>
                    <span 
                      className="font-serif text-lg block mb-1"
                      style={phaseInfo ? { color: phaseInfo.color } : { color: "#d6d3d1" }}
                    >
                      Phase {section.num}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-stone-950 font-normal">
                      {section.label}
                    </h3>
                    <p className="text-stone-500 text-xs font-light mt-1 max-w-lg">
                      {section.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onChangePhase(section.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-stone-850 uppercase tracking-widest hover:text-stone-900 border-b border-stone-200 hover:border-stone-900 transition-all py-1"
                  >
                    Voir les {sectionProgrammes.length} programmes
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previewProgrammes.map((prog) => (
                    <ActeurCard key={prog.id} programme={prog} onViewDetails={onViewDetails} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Cas 2 : Une phase sélectionnée ou filtres de recherche actifs
  // On affiche la grille simple complète des programmes correspondants
  const activePhaseInfo = PHASE_COLORS[activePhase];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {activePhase !== "ALL" && (
        <div 
          className="mb-8 border-b pb-4"
          style={activePhaseInfo ? { borderBottomColor: activePhaseInfo.color, borderBottomWidth: "2px" } : {}}
        >
          <span className="font-serif text-stone-400 text-sm">Étape sélectionnée</span>
          <h2 
            className="font-serif text-3xl font-normal"
            style={activePhaseInfo ? { color: activePhaseInfo.color } : { color: "#0c0a09" }}
          >
            {SECTIONS.find((s) => s.id === activePhase)?.label || activePhase}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((prog) => (
          <ActeurCard key={prog.id} programme={prog} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
};
