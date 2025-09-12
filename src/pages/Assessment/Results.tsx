import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, ShareIcon, CheckCircleIcon, CloudRainIcon, HomeIcon, DropletIcon, BarChart2Icon } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  return <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Assessment Results
          </h1>
          <p className="text-gray-600">My Home Assessment • June 15, 2023</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<ShareIcon size={16} />}>
            Share
          </Button>
          <Button variant="outline" icon={<DownloadIcon size={16} />}>
            Download PDF
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  Feasibility: Highly Suitable
                </h2>
                <p className="text-gray-600">
                  Your property is well-suited for rainwater harvesting
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <HomeIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Roof Area</h3>
                <p className="text-2xl font-bold text-blue-700">120 m²</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CloudRainIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Annual Rainfall</h3>
                <p className="text-2xl font-bold text-green-700">1,250 mm</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 text-center">
                <DropletIcon className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold">Potential Harvest</h3>
                <p className="text-2xl font-bold text-cyan-700">112,500 L</p>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-3">
              Recommended Structures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 flex">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <DropletIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Storage Tank</h4>
                  <p className="text-gray-600 text-sm">
                    5,000 L capacity underground tank
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <DropletIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Recharge Pit</h4>
                  <p className="text-gray-600 text-sm">
                    2m x 2m x 2m with filter media
                  </p>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-3">
              Rainfall Distribution
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 h-64 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Monthly Precipitation</h4>
                <span className="text-sm text-gray-500">mm/month</span>
              </div>
              <div className="relative h-48">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-40">
                  {[65, 45, 75, 95, 120, 150, 180, 165, 130, 90, 70, 60].map((value, i) => <div key={i} className="flex flex-col items-center">
                        <div className="w-6 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" style={{
                    height: `${value / 180 * 100}%`
                  }}></div>
                        <span className="text-xs mt-1 text-gray-600">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                        </span>
                      </div>)}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-3">Groundwater Level</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Surface</span>
                <span className="text-sm text-gray-500">Depth (m)</span>
              </div>
              <div className="relative h-16 bg-gradient-to-b from-blue-100 to-blue-300 rounded-md">
                <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-blue-600"></div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  8.5m
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                The groundwater level in your area is at 8.5m depth, which is
                suitable for recharge structures.
              </p>
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Cost Estimation</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Storage Tank</span>
                <span className="font-medium">$1,200</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Recharge Pit</span>
                <span className="font-medium">$800</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Gutters & Pipes</span>
                <span className="font-medium">$400</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Filtration System</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Installation</span>
                <span className="font-medium">$1,100</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <span className="font-semibold">Total Estimated Cost</span>
                <span className="font-bold text-blue-700">$3,800</span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Return on Investment</h4>
              <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Estimated Annual Savings
                </p>
                <p className="text-2xl font-bold text-green-700">$420</p>
                <p className="text-sm text-gray-500">
                  Payback period: ~9 years
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Environmental Impact</h4>
                <div className="flex items-center mb-2">
                  <DropletIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">
                    112,500 L water saved annually
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChart2Icon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">Reduced runoff by 85%</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    1
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Contact local contractors for detailed quotes and
                  implementation plans.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    2
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Check for available government subsidies or rebates in your
                  area.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    3
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Review our knowledge hub for maintenance best practices.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="primary" fullWidth onClick={() => navigate('/knowledge')}>
                Explore Knowledge Hub
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>;
};
export default AssessmentResults;