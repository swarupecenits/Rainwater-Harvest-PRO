import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MainLayout from '../layouts/MainLayout';
import { useMap } from '../hooks/useMap';
const MapExplorer: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-gray-800">GIS Map Explorer</h1>
          <p className="text-gray-600">
            Explore rainwater harvesting data in your area
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
              Your location<br />
              (Lat: {position.lat}, Lng: {position.lng})
            </Popup>
          </Marker>
          {/* Show search results as markers */}
          {searchResults.map((result, idx) => (
            <Marker key={idx} position={[parseFloat(result.lat), parseFloat(result.lon)]}>
              <Popup>{result.display_name}</Popup>
            </Marker>
          ))}
          {/* Overlay controls as last child for stacking */}
          <div className="absolute top-0 left-0 w-full z-[1000] flex justify-between p-4 pointer-events-auto">
            <form
              onSubmit={handleSearch}
              className="w-80 bg-white rounded-lg shadow-md p-2 flex items-center"
            >
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for a place..."
                className="flex-1 py-2 px-2 text-sm focus:outline-none"
              />
              <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Search</button>
            </form>
            <button
              onClick={handleZoomToUser}
              className="px-3 py-1 bg-green-600 text-white rounded shadow"
            >
              Zoom to My Location
            </button>
          </div>
        </MapContainer>
      </div>
    </MainLayout>
  );
};
export default MapExplorer;