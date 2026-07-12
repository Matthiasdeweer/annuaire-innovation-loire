import { useState } from "react";
import { Header } from "./components/Header";
import { PhasesTabs } from "./components/PhasesTabs";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { ActeursGrid } from "./components/ActeursGrid";
import { Footer } from "./components/Footer";
import { ActeurModal } from "./components/ActeurModal";
import { ActeursMap } from "./components/ActeursMap";
import { useActeursFilter } from "./hooks/useActeursFilter";
import type { FilterOptions, Programme } from "./hooks/useActeursFilter";
import { Grid, Map } from "lucide-react";

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: "",
    selectedPhase: "ALL",
    selectedAvancements: [],
    selectedTypesAccompagnement: [],
    adherentOnly: false,
    mentoringOnly: false,
    hebergementOnly: false,
    selectedLocation: "ALL",
  });

  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  const {
    filteredProgrammes,
    allAvancementOptions,
    filteredCount,
  } = useActeursFilter(filters);

  const handleChangePhase = (phase: string) => {
    setFilters((prev) => ({ ...prev, selectedPhase: phase }));
  };

  const handleViewDetails = (programme: Programme) => {
    setSelectedProgramme(programme);
  };

  const handleCloseModal = () => {
    setSelectedProgramme(null);
  };

  const isFiltered =
    filters.searchText !== "" ||
    filters.selectedAvancements.length > 0 ||
    filters.selectedTypesAccompagnement.length > 0 ||
    filters.adherentOnly ||
    filters.mentoringOnly ||
    filters.hebergementOnly ||
    filters.selectedLocation !== "ALL";

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      {/* En-tête éditorial */}
      <Header />

      {/* Onglets de phases principaux */}
      <PhasesTabs
        activePhase={filters.selectedPhase}
        onChangePhase={handleChangePhase}
      />

      {/* Barre de recherche et filtres secondaires */}
      <SearchAndFilters
        filters={filters}
        onChangeFilters={setFilters}
        avancementOptions={allAvancementOptions}
        filteredCount={filteredCount}
      />

      {/* Barre de bascule de vue (Grille vs Carte) */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-6 flex justify-end">
        <div className="inline-flex border border-stone-200 bg-white p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            Liste
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              viewMode === "map"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Carte
          </button>
        </div>
      </div>

      {/* Grille des acteurs ou Carte Leaflet */}
      <main className="flex-grow">
        {viewMode === "grid" ? (
          <ActeursGrid
            programmes={filteredProgrammes}
            onViewDetails={handleViewDetails}
            activePhase={filters.selectedPhase}
            onChangePhase={handleChangePhase}
            isFiltered={isFiltered}
          />
        ) : (
          <ActeursMap
            programmes={filteredProgrammes}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      {/* Modal de détail d'un acteur */}
      <ActeurModal
        programme={selectedProgramme}
        onClose={handleCloseModal}
      />

      {/* Footer avec logo MEP et lien MIFE */}
      <Footer />
    </div>
  );
}

export default App;
