import React, { useState } from "react";
import { Search, SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import type { FilterOptions } from "../hooks/useActeursFilter";

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onChangeFilters: (filters: FilterOptions) => void;
  avancementOptions: string[];
  filteredCount: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onChangeFilters,
  avancementOptions,
  filteredCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [avancementOpen, setAvancementOpen] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchText: e.target.value });
  };

  const clearSearch = () => {
    onChangeFilters({ ...filters, searchText: "" });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, selectedLocation: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChangeFilters({
      ...filters,
      selectedTypesAccompagnement: val === "ALL" ? [] : [val],
    });
  };

  const toggleAvancement = (option: string) => {
    const current = [...filters.selectedAvancements];
    const idx = current.indexOf(option);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(option);
    }
    onChangeFilters({ ...filters, selectedAvancements: current });
  };

  const toggleBoolean = (key: keyof FilterOptions) => {
    onChangeFilters({
      ...filters,
      [key]: !filters[key] as any,
    });
  };

  const resetFilters = () => {
    onChangeFilters({
      searchText: "",
      selectedPhase: filters.selectedPhase, // Keep the active phase tab
      selectedAvancements: [],
      selectedTypesAccompagnement: [],
      adherentOnly: false,
      mentoringOnly: false,
      hebergementOnly: false,
      selectedLocation: "ALL",
    });
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
    <div className="bg-white border-b border-stone-200 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Barre principale : Recherche + Bouton filtres avancés */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Rechercher par nom de structure, programme, mots-clés, ville..."
              value={filters.searchText}
              onChange={handleTextChange}
              className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition-colors text-sm"
            />
            {filters.searchText && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-5 py-3 border text-sm font-medium transition-colors ${
                showAdvanced || isFiltered
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 hover:border-stone-400 text-stone-700 bg-white"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres avancés
              {isFiltered && (
                <span className="ml-1 px-1.5 py-0.2 bg-stone-200 text-stone-800 text-xs rounded-full font-bold">
                  !
                </span>
              )}
            </button>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 border border-stone-200 text-sm font-medium hover:border-stone-400 text-stone-600 bg-white transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Panneau des filtres avancés */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* 1. Avancement (Dropdown Popover) */}
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Stade d'avancement
              </label>
              <button
                onClick={() => setAvancementOpen(!avancementOpen)}
                className="w-full flex justify-between items-center px-4 py-2.5 border border-stone-200 text-sm text-stone-700 bg-white hover:border-stone-300 focus:outline-none"
              >
                <span className="truncate">
                  {filters.selectedAvancements.length === 0
                    ? "Tous les stades"
                    : `${filters.selectedAvancements.length} sélectionné(s)`}
                </span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </button>

              {avancementOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setAvancementOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-full bg-white border border-stone-200 z-30 max-h-60 overflow-y-auto">
                    {avancementOptions.map((option) => {
                      const isChecked = filters.selectedAvancements.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleAvancement(option)}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 text-sm flex items-center justify-between text-stone-700"
                        >
                          <span>{option}</span>
                          {isChecked && <Check className="h-4 w-4 text-stone-800" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* 2. Type d'accompagnement */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Type d'accompagnement
              </label>
              <select
                onChange={handleTypeChange}
                value={filters.selectedTypesAccompagnement[0] || "ALL"}
                className="w-full px-3 py-2.5 border border-stone-200 text-sm text-stone-700 bg-white hover:border-stone-300 focus:outline-none"
              >
                <option value="ALL">Tous les formats</option>
                <option value="Accompagnement collectif">Collectif uniquement</option>
                <option value="Accompagnement individuel">Individuel uniquement</option>
                <option value="Accompagnement collectif et individuel">Collectif & Individuel</option>
              </select>
            </div>

            {/* 3. Localisation */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Zone Géographique
              </label>
              <select
                onChange={handleLocationChange}
                value={filters.selectedLocation}
                className="w-full px-3 py-2.5 border border-stone-200 text-sm text-stone-700 bg-white hover:border-stone-300 focus:outline-none"
              >
                <option value="ALL">Toutes zones (42 & 69)</option>
                <option value="42">Loire (42) uniquement</option>
                <option value="69">Métropole de Lyon (69)</option>
                <option value="OTHER">Autres départements / Visio</option>
              </select>
            </div>

            {/* Toggles (Boolean filters) */}
            <div className="md:col-span-3 flex flex-wrap gap-6 pt-4 border-t border-stone-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.adherentOnly}
                  onChange={() => toggleBoolean("adherentOnly")}
                  className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className="text-sm text-stone-700">Adhérents French Tech uniquement</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.mentoringOnly}
                  onChange={() => toggleBoolean("mentoringOnly")}
                  className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className="text-sm text-stone-700">Mentoring proposé</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.hebergementOnly}
                  onChange={() => toggleBoolean("hebergementOnly")}
                  className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className="text-sm text-stone-700">Hébergement / Bureaux disponibles</span>
              </label>
            </div>
          </div>
        )}

        {/* Compteur de résultats */}
        <div className="mt-4 text-xs text-stone-500 font-light text-right">
          {filteredCount} structure{filteredCount > 1 ? "s" : ""} trouvée{filteredCount > 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};
