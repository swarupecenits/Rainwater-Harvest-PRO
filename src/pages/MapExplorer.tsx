import React, { useState } from 'react';
import { SearchIcon, LayersIcon, InfoIcon, MapPinIcon, DropletIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
const MapExplorer: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    rainfall: true,
    aquifers: false,
    rechargeStructures: true
  });
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers({
      ...activeLayers,
      [layer]: !activeLayers[layer]
    });
  };
  return <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">GIS Map Explorer</h1>
          <p className="text-gray-600">
            Explore rainwater harvesting data in your area
          </p>
        </div>
      </div>
      <div className="relative h-[calc(100vh-200px)] min-h-[500px] rounded-xl overflow-hidden">
        {/* Map container */}
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
      }}></div>
        {/* Search bar */}
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80">
          <div className="bg-white rounded-lg shadow-md p-2 flex items-center">
            <SearchIcon className="h-5 w-5 text-gray-400 ml-2 mr-1" />
            <input type="text" placeholder="Search for a location..." className="flex-1 py-2 px-2 text-sm focus:outline-none" />
          </div>
        </div>
        {/* Layer controls */}
        <div className="absolute top-4 right-4">
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Map Layers</h3>
              <LayersIcon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="rainfall" checked={activeLayers.rainfall} onChange={() => toggleLayer('rainfall')} className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2" />
                <label htmlFor="rainfall" className="text-sm">
                  Rainfall Overlay
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="aquifers" checked={activeLayers.aquifers} onChange={() => toggleLayer('aquifers')} className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2" />
                <label htmlFor="aquifers" className="text-sm">
                  Aquifer Boundaries
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="recharge" checked={activeLayers.rechargeStructures} onChange={() => toggleLayer('rechargeStructures')} className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2" />
                <label htmlFor="recharge" className="text-sm">
                  Recharge Structures
                </label>
              </div>
            </div>
          </Card>
        </div>
        {/* Info panel */}
        {showInfo && <div className="absolute bottom-4 left-4 w-80">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Location Details</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowInfo(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <MapPinIcon className="h-4 w-4 text-gray-600 mr-1" />
                  <span className="text-sm font-medium">
                    Green Valley District
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Lat: 40.7128, Long: -74.0060
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-50 rounded-md p-2">
                  <p className="text-xs text-gray-600">Annual Rainfall</p>
                  <p className="font-semibold">1,250 mm</p>
                </div>
                <div className="bg-green-50 rounded-md p-2">
                  <p className="text-xs text-gray-600">Groundwater Depth</p>
                  <p className="font-semibold">8.5 m</p>
                </div>
              </div>
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-1">
                  Aquifer Information
                </h4>
                <p className="text-xs text-gray-600">
                  Unconfined aquifer with moderate to high permeability.
                  Suitable for artificial recharge through percolation pits and
                  trenches.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Nearby Structures</h4>
                <div className="flex items-center text-xs text-gray-600">
                  <DropletIcon className="h-3 w-3 mr-1" />
                  <span>3 recharge pits within 500m radius</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                View Detailed Report
              </Button>
            </Card>
          </div>}
        {/* Map pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPinIcon className="h-10 w-10 text-red-500" />
            <button className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md" onClick={() => setShowInfo(!showInfo)}>
              <InfoIcon className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        </div>
        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button className="p-2 hover:bg-gray-100 border-b border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>;
};
export default MapExplorer;