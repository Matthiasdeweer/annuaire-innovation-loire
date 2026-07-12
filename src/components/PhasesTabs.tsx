import React from "react";

interface PhasesTabsProps {
  activePhase: string;
  onChangePhase: (phase: string) => void;
}

export const PHASES = [
  { id: "ALL", label: "Toutes les étapes" },
  { id: "FAIRE EMERGER SON PROJET", label: "Faire émerger son projet" },
  { id: "ETRE ACCOMPAGNE(E)", label: "Être accompagné(e)" },
  { id: "FINANCER SON PROJET", label: "Financer son projet" },
  { id: "ETRE ACCELERE", label: "Être accéléré(e)" },
  { id: "SE DEVELOPPER", label: "Se développer" },
];

export const PhasesTabs: React.FC<PhasesTabsProps> = ({ activePhase, onChangePhase }) => {
  return (
    <div className="w-full border-b border-stone-200 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-1 md:space-x-4 overflow-x-auto scrollbar-none py-3" aria-label="Phases du projet">
          {PHASES.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => onChangePhase(phase.id)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-150 border-b-2 flex-shrink-0 ${
                  isActive
                    ? "border-stone-900 text-stone-900 font-semibold"
                    : "border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-200"
                }`}
              >
                {phase.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
