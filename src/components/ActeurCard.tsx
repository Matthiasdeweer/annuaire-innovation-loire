import React from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Programme } from "../hooks/useActeursFilter";

interface ActeurCardProps {
  programme: Programme;
  onViewDetails: (programme: Programme) => void;
}

const resolveLogoUrl = (logoPath: string) => {
  if (!logoPath) return "";
  if (logoPath.startsWith("http")) return logoPath;
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${cleanBase}${logoPath}`;
};

export const ActeurCard: React.FC<ActeurCardProps> = ({ programme, onViewDetails }) => {
  // Raccourcir la finalité pour l'affichage de la carte
  const shortFinalite =
    programme.finalite.length > 130
      ? programme.finalite.substring(0, 127) + "..."
      : programme.finalite;

  // Obtenir les initiales si le logo est absent
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col justify-between p-6 bg-white border border-stone-200 hover:border-stone-400 transition-all duration-200 bg-[#ffffff] h-full">
      <div>
        {/* En-tête de la carte */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium block mb-1">
              {programme.structureOperante}
            </span>
            <h3 className="font-serif text-xl font-normal text-stone-900 leading-snug group-hover:text-stone-700">
              {programme.nomProgramme}
            </h3>
          </div>

          {/* Logo ou Placeholder d'initiales */}
          <div className="w-12 h-12 flex-shrink-0 border border-stone-100 flex items-center justify-center bg-stone-50 text-stone-600 text-sm font-semibold">
            {programme.logo ? (
              <img
                src={resolveLogoUrl(programme.logo)}
                alt={`Logo ${programme.structureOperante}`}
                className="w-full h-full object-contain p-1"
                style={
                  programme.logo && programme.logo.includes("logo_MEP")
                    ? { filter: "brightness(0)", opacity: 0.7 }
                    : undefined
                }
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span>{getInitials(programme.structureOperante || "A")}</span>
            )}
          </div>
        </div>

        {/* Description courte (Finalité) */}
        <p className="text-stone-600 text-sm font-light leading-relaxed mb-6">
          {shortFinalite || "Aucune description fournie."}
        </p>
      </div>

      <div>
        {/* Badges / Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {programme.adherentFrenchTech && (
            <span className="px-2 py-0.5 border border-stone-900 text-stone-900 text-[10px] font-semibold uppercase tracking-wider bg-stone-50">
              FT Member
            </span>
          )}
          {programme.typeAccompagnement && (
            <span className="px-2 py-0.5 border border-stone-200 text-stone-600 text-[10px] font-medium bg-stone-50">
              {programme.typeAccompagnement}
            </span>
          )}
          {programme.codePostal && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-stone-200 text-stone-600 text-[10px] font-medium bg-stone-50">
              <MapPin className="h-2.5 w-2.5" />
              {programme.codePostal.startsWith("42") ? "Loire (42)" : "Rhône (69)"}
            </span>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => onViewDetails(programme)}
          className="w-full flex items-center justify-between py-2.5 px-4 border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-xs font-semibold text-stone-850 uppercase tracking-wider transition-colors"
        >
          Voir le programme
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
