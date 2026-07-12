import { useMemo } from "react";
import acteursData from "../data/acteurs.json";

export interface Programme {
  id: string;
  nomProgramme: string;
  structureOperante: string;
  adherentFrenchTech: boolean;
  logo: string;
  finalite: string;
  descriptionAccompagnement: string;
  periodicite: string;
  duree: string;
  typeAccompagnement: string;
  mentoringPropose: boolean;
  posteTravailPropose: boolean;
  lieuAccueil: string;
  codePostal: string;
  modalitesContractuelles: string;
  aidesFinancieres: string;
  contactMail: string;
  siteWeb: string;
  lienRdvFT: string;
  criteresEntrepreneur: string[];
  niveauDeveloppement: string[];
  typeEntreprise: string[];
  criteresEntreprise: string;
  phasesProjet: string[];
  latitude: number;
  longitude: number;
}

export interface FilterOptions {
  searchText: string;
  selectedPhase: string; // "ALL" ou l'une des 5 phases
  selectedAvancements: string[]; // Liste des niveaux de développement cochés
  selectedTypesAccompagnement: string[];
  adherentOnly: boolean;
  mentoringOnly: boolean;
  hebergementOnly: boolean;
  selectedLocation: string; // "ALL", "42" (Loire), "69" (Rhône), "OTHER"
}

// Fonction de normalisation des chaînes pour la recherche textuelle (retrait des accents)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const MEP_BACKUP: Programme = {
  id: "mep-junior-enterprise",
  nomProgramme: "Prestations d'études et de développement informatique",
  structureOperante: "Mines Études et Projets (MEP)",
  adherentFrenchTech: false,
  logo: "/logo_MEP_blanc_vec.svg",
  finalite: "Accompagner les créateurs d'entreprise et les structures dans leurs développements techniques, informatiques et stratégiques.",
  descriptionAccompagnement: "MEP, la Junior-Entreprise des Mines de Saint-Étienne, réalise des prestations sur mesure : développement d'applications mobiles et sites web, études d'ingénierie, et études de marché. Idéal pour matérialiser vos idées et tester votre marché.",
  periodicite: "Disponible toute l'année",
  duree: "Sur mesure (selon le cahier des charges)",
  typeAccompagnement: "Accompagnement individuel",
  mentoringPropose: false,
  posteTravailPropose: false,
  lieuAccueil: "158 Cours Fauriel, 42100 Saint-Étienne",
  codePostal: "42100",
  modalitesContractuelles: "Prestation de services sur devis (tarifs Junior-Entreprise avantageux).",
  aidesFinancieres: "non concerné",
  contactMail: "contact@mep-je.fr",
  siteWeb: "https://mep-je.fr",
  lienRdvFT: "",
  criteresEntrepreneur: ["Tous publics", "Créateurs", "PME", "Start-ups"],
  niveauDeveloppement: ["Amorçage", "Création", "Développement", "Accélération"],
  typeEntreprise: ["Tous types"],
  criteresEntreprise: "non concerné",
  phasesProjet: ["ETRE ACCOMPAGNE(E)", "SE DEVELOPPER"],
  latitude: 45.4309,
  longitude: 4.4003
};

export const useActeursFilter = (filters: FilterOptions) => {
  const allProgrammes = useMemo(() => {
    const list = (acteursData.programmes || []) as Programme[];
    const hasMep = list.some(
      (p) =>
        p.id === "mep-junior-enterprise" ||
        p.structureOperante.toLowerCase().includes("mep") ||
        p.structureOperante.toLowerCase().includes("mines etudes")
    );
    if (!hasMep) {
      return [...list, MEP_BACKUP];
    }
    return list;
  }, []);

  const filteredProgrammes = useMemo(() => {
    const {
      searchText,
      selectedPhase,
      selectedAvancements,
      selectedTypesAccompagnement,
      adherentOnly,
      mentoringOnly,
      hebergementOnly,
      selectedLocation,
    } = filters;

    const normalizedQuery = normalizeString(searchText);

    const filtered = allProgrammes.filter((prog) => {
      // 1. Filtrage textuel
      if (normalizedQuery) {
        const matchesName = normalizeString(prog.nomProgramme || "").includes(normalizedQuery);
        const matchesStructure = normalizeString(prog.structureOperante || "").includes(normalizedQuery);
        const matchesFinalite = normalizeString(prog.finalite || "").includes(normalizedQuery);
        const matchesDesc = normalizeString(prog.descriptionAccompagnement || "").includes(normalizedQuery);
        const matchesLieu = normalizeString(prog.lieuAccueil || "").includes(normalizedQuery);
        const matchesCP = normalizeString(prog.codePostal || "").includes(normalizedQuery);

        if (!matchesName && !matchesStructure && !matchesFinalite && !matchesDesc && !matchesLieu && !matchesCP) {
          return false;
        }
      }

      // 2. Filtrage par Phase Majeure (Filtre horizontal)
      if (selectedPhase && selectedPhase !== "ALL") {
        if (!prog.phasesProjet || !prog.phasesProjet.includes(selectedPhase)) {
          return false;
        }
      }

      // 3. Filtrage par Avancement (Niveaux de développement)
      if (selectedAvancements && selectedAvancements.length > 0) {
        // L'acteur doit posséder au moins un des niveaux de développement sélectionnés
        const hasMatchingAvancement = prog.niveauDeveloppement.some((level) =>
          selectedAvancements.includes(level)
        );
        if (!hasMatchingAvancement) {
          return false;
        }
      }

      // 4. Filtrage par Type d'accompagnement
      if (selectedTypesAccompagnement && selectedTypesAccompagnement.length > 0) {
        if (!selectedTypesAccompagnement.includes(prog.typeAccompagnement)) {
          return false;
        }
      }

      // 5. Adhérent French Tech
      if (adherentOnly && !prog.adherentFrenchTech) {
        return false;
      }

      // 6. Mentoring
      if (mentoringOnly && !prog.mentoringPropose) {
        return false;
      }

      // 7. Hébergement (Poste de travail)
      if (hebergementOnly && !prog.posteTravailPropose) {
        return false;
      }

      // 8. Géographie (Code postal Loire 42 vs Rhône 69)
      if (selectedLocation && selectedLocation !== "ALL") {
        const cp = prog.codePostal || "";
        if (selectedLocation === "42" && !cp.startsWith("42")) {
          return false;
        }
        if (selectedLocation === "69" && !cp.startsWith("69")) {
          return false;
        }
        if (selectedLocation === "OTHER" && (cp.startsWith("42") || cp.startsWith("69"))) {
          return false;
        }
      }

      return true;
    });

    // Inverser pour que les éléments nouvellement ajoutés (à la fin du JSON) apparaissent en haut
    const reversed = [...filtered].reverse();

    // Priorisation "silencieuse" de MEP : s'il fait partie des résultats filtrés, on le remonte en premier
    const mepIndex = reversed.findIndex(
      (prog) =>
        prog.id === "mep-junior-enterprise" ||
        prog.structureOperante.toLowerCase().includes("mep") ||
        prog.structureOperante.toLowerCase().includes("mines etudes")
    );
    if (mepIndex > -1) {
      const [mepItem] = reversed.splice(mepIndex, 1);
      reversed.unshift(mepItem);
    }

    return reversed;
  }, [allProgrammes, filters]);

  // Extraction dynamique de tous les niveaux de développement distincts pour les options de filtre
  const allAvancementOptions = useMemo(() => {
    const options = new Set<string>();
    allProgrammes.forEach((prog) => {
      if (prog.niveauDeveloppement) {
        prog.niveauDeveloppement.forEach((level) => {
          if (level) options.add(level);
        });
      }
    });
    return Array.from(options).sort();
  }, [allProgrammes]);

  return {
    filteredProgrammes,
    allAvancementOptions,
    totalCount: allProgrammes.length,
    filteredCount: filteredProgrammes.length,
  };
};
