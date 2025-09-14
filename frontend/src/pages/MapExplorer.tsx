import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MainLayout from '../layouts/MainLayout';
import { useMap } from '../hooks/useMap';
import { useTranslation } from "react-i18next";

const MapExplorer: React.FC = () => {
  const { t } = useTranslation();
  const { position } = useMap();
  const mapRef = useRef<any>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ lat: number; lon: number; display_name: string }[]>([]);

  // Zoom to user location
  const handleZoomToUser = () => {
    if (mapRef.current) {
      mapRef.current.setView([position.lat, position.lng], 13, { animate: true });
    }
  };

  // Search places using Nominatim API
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setSearchResults(data);
    if (data.length > 0 && mapRef.current) {
      mapRef.current.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13, { animate: true });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">RainWise {t("mapExplorer.title")}</h1>
          <p className="text-gray-600">
           {t("mapExplorer.subtitle")}
          </p>
        </div>
      </div>
      <div className="relative h-[calc(100vh-200px)] min-h-[500px] rounded-xl overflow-hidden">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={4.5}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]}>
            <Popup>
              {t("mapExplorer.yourLocation")}<br />
              (Lat: {position.lat}, Lng: {position.lng})
            </Popup>
          </Marker>
          {/* Show search results as markers */}
          {searchResults.map((result, idx) => (
            <Marker key={idx} position={[parseFloat(result.lat), parseFloat(result.lon)]}>
              <Popup>{result.display_name}</Popup>
            </Marker>
          ))}
          {/* Responsive controls at bottom for mobile */}
          <div className="absolute bottom-0 left-0 w-full z-[1200] flex flex-col sm:flex-row sm:justify-between gap-2 p-4 pointer-events-auto">
            <form
              onSubmit={handleSearch}
              className="flex-1 bg-white rounded-lg shadow-md p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("mapExplorer.searchPlaceholder")}
                className="flex-1 py-2 px-2 text-sm focus:outline-none rounded"
              />
              <button type="submit" className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded">{t("mapExplorer.searchButton")}</button>
            </form>
            <button
              onClick={handleZoomToUser}
              className="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded shadow"
            >
              {t("mapExplorer.zoomButton")}
            </button>
          </div>
        </MapContainer>
      </div>
    </MainLayout>
  );
};
export default MapExplorer;