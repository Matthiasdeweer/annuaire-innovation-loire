import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Programme } from "../hooks/useActeursFilter";
import "leaflet/dist/leaflet.css";

// Import des images d'icônes par défaut pour Leaflet (correction bug d'import Vite)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const RedMepIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ActeursMapProps {
  programmes: Programme[];
  onViewDetails: (programme: Programme) => void;
}

export const ActeursMap: React.FC<ActeursMapProps> = ({ programmes, onViewDetails }) => {
  // Centrer sur la Loire (Saint-Étienne) par défaut
  const defaultPosition: [number, number] = [45.4397, 4.3872];

  // Garder seulement les programmes qui ont des coordonnées valides
  const mapActeurs = programmes.filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number"
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="border border-stone-200 bg-white p-2">
        <div className="h-[600px] w-full z-0">
          <MapContainer
            center={defaultPosition}
            zoom={10}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://openstreetmap.fr">OpenStreetMap France</a>'
              url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            />
            {mapActeurs.map((prog) => {
              const isMEP =
                prog.id === "mep-junior-enterprise" ||
                prog.structureOperante.toLowerCase().includes("mep") ||
                prog.structureOperante.toLowerCase().includes("mines etudes");
              return (
                <Marker 
                  key={prog.id} 
                  position={[prog.latitude, prog.longitude]}
                  icon={isMEP ? RedMepIcon : DefaultIcon}
                >
                <Popup>
                  <div className="p-2 text-stone-900 font-sans">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mb-0.5">
                      {prog.structureOperante}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-stone-950 leading-tight mb-1">
                      {prog.nomProgramme}
                    </h4>
                    <p className="text-stone-600 text-xs font-light line-clamp-2 leading-relaxed mb-3">
                      {prog.finalite}
                    </p>
                    <button
                      onClick={() => onViewDetails(prog)}
                      className="w-full text-center py-1.5 px-3 bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-stone-850 transition-colors"
                    >
                      Détails du programme
                    </button>
                  </div>
                </Popup>
              </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
