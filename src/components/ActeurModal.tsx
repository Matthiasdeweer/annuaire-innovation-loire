import React from "react";
import { X, Globe, Mail, Calendar, Clock, MapPin, Briefcase, Award } from "lucide-react";
import type { Programme } from "../hooks/useActeursFilter";

interface ActeurModalProps {
  programme: Programme | null;
  onClose: () => void;
}

export const ActeurModal: React.FC<ActeurModalProps> = ({ programme, onClose }) => {
  if (!programme) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#fcfbf9] border border-stone-300 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 p-6 md:p-10 text-stone-900 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-all duration-150"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header section */}
        <div className="border-b border-stone-200 pb-6 mb-8 pr-10">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
            {programme.structureOperante}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-stone-950 font-normal leading-tight">
            {programme.nomProgramme}
          </h2>
          {programme.adherentFrenchTech && (
            <span className="inline-block mt-3 px-3 py-1 border border-stone-900 text-stone-900 text-[10px] font-bold uppercase tracking-wider bg-white">
              Adhérent French Tech Saint-Étienne Lyon
            </span>
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Columns (2/3) */}
          <div className="md:col-span-2 space-y-8 pr-0 md:pr-4">
            {/* 1. Finalité */}
            <div>
              <h4 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2 mb-3">
                Objectifs & Finalité
              </h4>
              <p className="text-stone-700 text-sm leading-relaxed font-light">
                {programme.finalite || "Non renseigné."}
              </p>
            </div>

            {/* 2. Description de l'accompagnement */}
            {programme.descriptionAccompagnement && (
              <div>
                <h4 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2 mb-3">
                  Description de l'accompagnement
                </h4>
                <div className="text-stone-700 text-sm leading-relaxed font-light whitespace-pre-line">
                  {programme.descriptionAccompagnement}
                </div>
              </div>
            )}

            {/* 3. Modalités & Aides financières */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Modalités contractuelles
                </h5>
                <p className="text-stone-700 text-sm font-light leading-relaxed">
                  {programme.modalitesContractuelles || "Non précisé."}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Aides financières associées
                </h5>
                <p className="text-stone-700 text-sm font-light leading-relaxed">
                  {programme.aidesFinancieres || "Non concerné."}
                </p>
              </div>
            </div>

            {/* 4. Critères d'éligibilité */}
            <div className="border-t border-stone-150 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-stone-400" />
                  Pour l'entrepreneur
                </h5>
                <div className="flex flex-wrap gap-1">
                  {programme.criteresEntrepreneur && programme.criteresEntrepreneur.length > 0 ? (
                    programme.criteresEntrepreneur.map((tag, idx) => (
                      <span key={idx} className="text-xs border border-stone-200 bg-stone-100/50 px-2.5 py-1 text-stone-700">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-500 italic">Tous profils d'entrepreneurs</span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-stone-400" />
                  Pour l'entreprise
                </h5>
                <p className="text-stone-700 text-sm font-light leading-relaxed">
                  {programme.criteresEntreprise && programme.criteresEntreprise !== "non concerné" ? (
                    programme.criteresEntreprise
                  ) : (
                    <span className="text-stone-500 italic">Tous types d'entreprises / Sans CA requis</span>
                  )}
                </p>
                {programme.typeEntreprise && programme.typeEntreprise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {programme.typeEntreprise.map((tag, idx) => (
                      <span key={idx} className="text-[10px] border border-stone-200 bg-stone-100/30 px-2 py-0.5 text-stone-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info Column (1/3) */}
          <div className="bg-white border border-stone-200 p-6 space-y-6">
            <h4 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2">
              Détails Pratiques
            </h4>

            {/* Durée */}
            {programme.duree && (
              <div className="flex gap-3 items-start">
                <Clock className="h-5 w-5 text-stone-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
                    Durée du programme
                  </span>
                  <span className="text-sm text-stone-800 font-medium">{programme.duree}</span>
                </div>
              </div>
            )}

            {/* Périodicité */}
            {programme.periodicite && (
              <div className="flex gap-3 items-start">
                <Calendar className="h-5 w-5 text-stone-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
                    Fréquence / Périodicité
                  </span>
                  <span className="text-sm text-stone-850 font-light">{programme.periodicite}</span>
                </div>
              </div>
            )}

            {/* Lieu */}
            {programme.lieuAccueil && (
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-stone-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
                    Lieu d'accueil
                  </span>
                  <span className="text-sm text-stone-850 font-light leading-relaxed">
                    {programme.lieuAccueil}
                  </span>
                </div>
              </div>
            )}

            {/* Mentoring / Hébergement */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${programme.mentoringPropose ? "bg-green-600" : "bg-stone-300"}`} />
                <span className="text-xs text-stone-700 font-light">
                  {programme.mentoringPropose ? "Mentoring individuel disponible" : "Pas de mentoring individuel"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${programme.posteTravailPropose ? "bg-green-600" : "bg-stone-300"}`} />
                <span className="text-xs text-stone-700 font-light">
                  {programme.posteTravailPropose ? "Postes de travail / Bureaux" : "Sans hébergement physique"}
                </span>
              </div>
            </div>

            {/* Contact & Liens */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              {programme.contactMail && (
                <a
                  href={`mailto:${programme.contactMail}`}
                  className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-xs"
                >
                  <Mail className="h-4 w-4 text-stone-400" />
                  <span className="truncate">{programme.contactMail}</span>
                </a>
              )}

              {programme.siteWeb && (
                <a
                  href={programme.siteWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-xs"
                >
                  <Globe className="h-4 w-4 text-stone-400" />
                  <span>Visiter le site web</span>
                </a>
              )}
            </div>

            {/* Prendre RDV Link */}
            {programme.lienRdvFT && (
              <a
                href={programme.lienRdvFT}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full bg-stone-900 hover:bg-stone-850 text-white text-xs font-semibold uppercase tracking-wider py-3 transition-colors mt-6"
              >
                Prendre rendez-vous
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
