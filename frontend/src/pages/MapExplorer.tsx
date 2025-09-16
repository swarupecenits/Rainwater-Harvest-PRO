import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MainLayout from '../layouts/MainLayout';
import { useMap } from '../hooks/useMap';
import { useTranslation } from "react-i18next";
import L from 'leaflet';

const { BaseLayer } = LayersControl;

const MapExplorer: React.FC = () => {
  const { t } = useTranslation();
  const { position } = useMap();
  const mapRef = useRef<L.Map | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);

  // Measurement state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<L.LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0); // meters

  // Refs to Leaflet objects for cleanup
  const measureMarkersRef = useRef<L.Marker[]>([]);
  const measureLineRef = useRef<L.Polyline | null>(null);

  const clearMeasurementLayers = () => {
    measureMarkersRef.current.forEach(m => m.remove());
    measureMarkersRef.current = [];
    if (measureLineRef.current) {
      measureLineRef.current.remove();
      measureLineRef.current = null;
    }
  };

  const resetMeasurement = () => {
    clearMeasurementLayers();
    setMeasurePoints([]);
    setTotalDistance(0);
    setIsMeasuring(false);
  };

  const startMeasurement = () => {
    resetMeasurement();
    setIsMeasuring(true);
  };

  const finishMeasurement = () => {
    setIsMeasuring(false);
  };

  // Recalculate distance whenever points change
  useEffect(() => {
    if (measurePoints.length < 2) {
      setTotalDistance(0);
      return;
    }
    let d = 0;
    for (let i = 0; i < measurePoints.length - 1; i++) {
      d += measurePoints[i].distanceTo(measurePoints[i + 1]);
    }
    setTotalDistance(d);
  }, [measurePoints]);

  // Handle map click while measuring
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!isMeasuring) return;
      const latlng = e.latlng;
      // Add marker
      const marker = L.marker(latlng, { draggable: false });
      marker.addTo(map);
      measureMarkersRef.current.push(marker);
      // Update points state
      setMeasurePoints(prev => [...prev, latlng]);
      // Draw or update polyline
      if (!measureLineRef.current) {
        measureLineRef.current = L.polyline([latlng], { color: '#ff2d55', weight: 3 });
        measureLineRef.current.addTo(map);
      } else {
        measureLineRef.current.addLatLng(latlng);
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [isMeasuring]);

  // Zoom to user location
  const handleZoomToUser = () => {
    if (mapRef.current) {
      mapRef.current.setView([position.lat, position.lng], 30, { animate: true }); 
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
          zoom={20} 
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          {/* Measurement Controls (overlay) */}
          <div className="absolute top-2 left-2 z-[1200] flex flex-col gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded shadow pointer-events-auto text-xs sm:text-sm">
            {!isMeasuring && (
              <button onClick={startMeasurement} className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500">Start Measure</button>
            )}
            {isMeasuring && (
              <>
                <div className="font-medium text-gray-800">Click map to add points</div>
                <button onClick={finishMeasurement} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500">Finish</button>
                <button onClick={resetMeasurement} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-400">Reset</button>
              </>
            )}
            {!isMeasuring && measurePoints.length > 1 && (
              <button onClick={resetMeasurement} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-400">Clear</button>
            )}
            <div className="mt-1 text-gray-700">
              Distance: { (totalDistance/1000).toFixed(3) } km
            </div>
            {measurePoints.length > 1 && isMeasuring && (
              <div className="text-[10px] text-gray-500">(Click Finish to lock)</div>
            )}
          </div>
          <LayersControl position="topright">
            <BaseLayer checked name="Default View">
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer name="Satellite View">
              <TileLayer
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3dhcnVwMDMiLCJhIjoiY21mbW5iM3RrMDN0aDJqc2YzN3RuZnprNyJ9.ZaCqfiOSesJzbwsVF-I6FQ"
              />
            </BaseLayer>
          </LayersControl>
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