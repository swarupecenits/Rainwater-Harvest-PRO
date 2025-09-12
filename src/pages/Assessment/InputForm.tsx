import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, CloudRainIcon, MapPinIcon, UsersIcon, UploadCloudIcon, CheckCircleIcon } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Dropdown from '../../components/ui/Dropdown';
import Button from '../../components/ui/Button';
const AssessmentInput: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const roofTypes = [{
    value: 'metal',
    label: 'Metal Roof'
  }, {
    value: 'tile',
    label: 'Tile Roof'
  }, {
    value: 'concrete',
    label: 'Concrete Roof'
  }, {
    value: 'asphalt',
    label: 'Asphalt Shingles'
  }, {
    value: 'thatch',
    label: 'Thatch Roof'
  }];
  const soilTypes = [{
    value: 'sandy',
    label: 'Sandy'
  }, {
    value: 'loamy',
    label: 'Loamy'
  }, {
    value: 'clay',
    label: 'Clay'
  }, {
    value: 'silt',
    label: 'Silt'
  }, {
    value: 'peaty',
    label: 'Peaty'
  }, {
    value: 'chalky',
    label: 'Chalky'
  }];
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/results');
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Rainwater Harvesting Assessment
        </h1>
        <p className="text-gray-600">
          Fill in the details to get a personalized assessment
        </p>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map(step => <div key={step} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === step ? 'bg-blue-600 text-white' : currentStep > step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > step ? <CheckCircleIcon size={20} /> : <span>{step}</span>}
              </div>
              <span className="text-sm mt-2 text-gray-600">
                {step === 1 ? 'Basic Info' : step === 2 ? 'Property Details' : 'Location'}
              </span>
            </div>)}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
          <div className="bg-blue-600 h-1 rounded-full transition-all" style={{
          width: `${currentStep / 3 * 100}%`
        }}></div>
        </div>
      </div>
      <Card className="p-6">
        {currentStep === 1 && <div>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <Input label="Assessment Name" placeholder="e.g. My Home Assessment" required />
            <Input label="Number of Dwellers" type="number" placeholder="e.g. 4" icon={<UsersIcon size={18} />} required />
            <Input label="Phone Number" type="tel" placeholder="e.g. +1 234 567 8900" required />
            <Input label="Email" type="email" placeholder="your@email.com" required />
          </div>}
        {currentStep === 2 && <div>
            <h2 className="text-xl font-semibold mb-6">Property Details</h2>
            <Input label="Roof Area (sq. meters)" type="number" placeholder="e.g. 100" icon={<HomeIcon size={18} />} required />
            <Input label="Open Space Area (sq. meters)" type="number" placeholder="e.g. 50" required />
            <Dropdown label="Roof Type" options={roofTypes} placeholder="Select roof type" required />
            <Dropdown label="Soil Type" options={soilTypes} placeholder="Select soil type" required />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Roof Photo (Optional)
              </label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                  <UploadCloudIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag and drop a photo of your roof
                  </p>
                  <p className="text-xs text-gray-500">
                    or <span className="text-blue-600">browse files</span>
                  </p>
                </div>
              </div>
            </div>
          </div>}
        {currentStep === 3 && <div>
            <h2 className="text-xl font-semibold mb-6">Location Details</h2>
            <Input label="Address" placeholder="Enter your full address" icon={<MapPinIcon size={18} />} required />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Pin Location on Map
              </label>
              <div className="mt-1 bg-gray-100 rounded-lg h-64 relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
            }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-2 bg-white rounded-full shadow-lg">
                    <MapPinIcon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Latitude" placeholder="e.g. 40.7128" required />
              <Input label="Longitude" placeholder="e.g. -74.0060" required />
            </div>
            <Input label="Annual Rainfall (mm)" type="number" placeholder="e.g. 1200" icon={<CloudRainIcon size={18} />} required />
          </div>}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? <Button variant="outline" onClick={handlePrevStep}>
              Previous
            </Button> : <div></div>}
          <Button variant="primary" onClick={handleNextStep}>
            {currentStep === 3 ? 'Submit Assessment' : 'Next'}
          </Button>
        </div>
      </Card>
    </MainLayout>;
};
export default AssessmentInput;