import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DownloadIcon,
  ShareIcon,
  CheckCircleIcon,
  CloudRainIcon,
  HomeIcon,
  DropletIcon,
  BarChart2Icon,
  ZapIcon,
  BeakerIcon,
  ArrowBigRightDashIcon,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface AssessmentData {
  feasibility: string;
  feasibilityDescription: string;
  roofArea: number;
  rainfall: number;
  potentialHarvest: number;
  tankVolume: number;
  efficiency: number;
  inertia: number;
  recommendedStructures: { name: string; description: string }[];
  rainfallDistribution: number[]; // [12 months]
  groundwaterLevel: number;
  costEstimation: {
    storageTank: number;
    rechargePit: number;
    guttersPipes: number;
    filtrationSystem: number;
    installation: number;
    total: number;
  };
  roi: {
    annualSavings: number;
    paybackPeriod: string;
    waterSaved: number;
    runoffReduction: string;
  };
}

const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/assessments/latest", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch assessment data");
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading assessment results...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600">{error || "No data available"}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assessment Results</h1>
          <p className="text-gray-600">
            My Home Assessment • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<ShareIcon size={16} />}>
            {t('common.share')}
          </Button>
          <Button variant="outline" icon={<DownloadIcon size={16} />}>
            {t('results.savePdf')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT SECTION ===== */}
        <div className="lg:col-span-2">
          <Card className="mb-6 p-6">
            {/* Feasibility */}
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  Feasibility: {data?.feasibility || "N/A"}
                </h2>
                <p className="text-gray-600">
                  {data?.feasibilityDescription || "No description available"}
                </p>
              </div>
            </div>

            {/* Roof, Rainfall, Harvest */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <HomeIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Roof Area</h3>
                <p className="text-2xl font-bold text-blue-700">
                  {data?.roofArea || 0} m²
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CloudRainIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Annual Rainfall</h3>
                <p className="text-2xl font-bold text-green-700">
                  {data?.rainfall || 0} mm
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4 text-center">
                <DropletIcon className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold">Potential Harvest</h3>
                <p className="text-2xl font-bold text-cyan-700">
                  {(data?.potentialHarvest || 0).toLocaleString()} L
                </p>
              </div>
                <div className="bg-cyan-200 rounded-lg p-4 text-center">
                <BeakerIcon className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold">Recommended tank volume</h3>
                <p className="text-2xl font-bold text-cyan-700">
                  {(data?.tankVolume || 0).toLocaleString()} L
                </p>
              </div>
              <div className="bg-cyan-200 rounded-lg p-4 text-center">
                <ZapIcon className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold">Efficiency</h3>
                <p className="text-2xl font-bold text-cyan-700">
                  {(data?.efficiency || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-cyan-200 rounded-lg p-4 text-center">
                <ArrowBigRightDashIcon className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold">Inertia</h3>
                <p className="text-2xl font-bold text-cyan-700">
                  {(data?.inertia || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Structures */}
            <h3 className="font-semibold text-lg mb-3">Recommended Structures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {data?.recommendedStructures?.length ? (
                data.recommendedStructures.map((s, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 flex">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <DropletIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{s.name}</h4>
                      <p className="text-gray-600 text-sm">{s.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No structures recommended.</p>
              )}
            </div>

            {/* Rainfall chart */}
            <h3 className="font-semibold text-lg mb-3">Rainfall Distribution</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-64 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{t('results.monthlyPrecipitation')}</h4>
                <span className="text-sm text-gray-500">{t('results.mmPerMonth')}</span>
              </div>
              <div className="relative h-48">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-40">
                  {data?.rainfallDistribution?.length ? (
                    data.rainfallDistribution.map((value, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-6 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                          style={{ height: `${(value / 180) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-600">
                          {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No rainfall data</p>
                  )}
                </div>
              </div>
            </div>

            {/* Groundwater */}
            <h3 className="font-semibold text-lg mb-3">Groundwater Level</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{t('results.surface')}</span>
                <span className="text-sm text-gray-500">{t('results.depth')}</span>
              </div>
              <div className="relative h-16 bg-gradient-to-b from-blue-100 to-blue-300 rounded-md">
                <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-blue-600"></div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {data?.groundwaterLevel || 0}m
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                The groundwater level in your area is at {data?.groundwaterLevel || 0}m
                depth, which is suitable for recharge structures.
              </p>
            </div>
          </Card>
        </div>

        {/* ===== RIGHT SECTION ===== */}
        <div>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">{t('results.costEstimation')}</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Storage Tank</span>
                <span className="font-medium">${data?.costEstimation?.storageTank || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Recharge Pit</span>
                <span className="font-medium">${data?.costEstimation?.rechargePit || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Gutters & Pipes</span>
                <span className="font-medium">${data?.costEstimation?.guttersPipes || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Filtration System</span>
                <span className="font-medium">${data?.costEstimation?.filtrationSystem || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Installation</span>
                <span className="font-medium">${data?.costEstimation?.installation || 0}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <span className="font-semibold">Total Estimated Cost</span>
                <span className="font-bold text-blue-700">
                  ${data?.costEstimation?.total || 0}
                </span>
              </div>
            </div>

            {/* ROI */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">{t('results.returnOnInvestment')}</h4>
              <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Estimated Annual Savings</p>
                <p className="text-2xl font-bold text-green-700">
                  ${data?.roi?.annualSavings || 0}
                </p>
                <p className="text-sm text-gray-500">
                  Payback period: ~{data?.roi?.paybackPeriod || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{t('results.environmentalImpact')}</h4>
                <div className="flex items-center mb-2">
                  <DropletIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">
                    {data?.roi?.waterSaved
                      ? data.roi.waterSaved.toLocaleString()
                      : "0"}{" "}
                    L water saved annually
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChart2Icon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">
                    Reduced runoff by {data?.roi?.runoffReduction || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next steps */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">{t('results.nextSteps')}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    1
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Contact local contractors for detailed quotes and implementation plans.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    2
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Check for available government subsidies or rebates in your area.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    3
                  </span>
                </div>
                <p className="text-sm text-gray-600">{t('results.step3')}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate("/knowledge")}
              >
                Explore Knowledge Hub
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssessmentResults;
