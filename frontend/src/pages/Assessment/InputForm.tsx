import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, CloudRainIcon, MapPinIcon, UsersIcon, UploadCloudIcon, CheckCircleIcon } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Dropdown from '../../components/ui/Dropdown';
import Button from '../../components/ui/Button';
import { useTranslation } from "react-i18next";


const AssessmentInput: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const roofTypes = [{ value: 'metal', label: t("assessment.roofTypes.metal") },
  { value: 'tile', label: t("assessment.roofTypes.tile") },
  { value: 'concrete', label: t("assessment.roofTypes.concrete") },
  { value: 'asphalt', label: t("assessment.roofTypes.asphalt") },
  { value: 'thatch', label: t("assessment.roofTypes.thatch") }];
  const soilTypes = [
    { value: 'sandy', label: t("assessment.soilTypes.sandy") },
    { value: 'loamy', label: t("assessment.soilTypes.loamy") },
    { value: 'clay', label: t("assessment.soilTypes.clay") },
    { value: 'silt', label: t("assessment.soilTypes.silt") },
    { value: 'peaty', label: t("assessment.soilTypes.peaty") },
    { value: 'chalky', label: t("assessment.soilTypes.chalky") }
  ];
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
        {t("assessment.title")}
      </h1>
      <p className="text-gray-600">
        {t("assessment.subtitle")}
      </p>
    </div>
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map(step => <div key={step} className="flex flex-col items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === step ? 'bg-blue-600 text-white' : currentStep > step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {currentStep > step ? <CheckCircleIcon size={20} /> : <span>{step}</span>}
          </div>
          <span className="text-sm mt-2 text-gray-600">
            {step === 1
              ? t("assessment.steps.basicInfo")
              : step === 2
                ? t("assessment.steps.propertyDetails")
                : t("assessment.steps.location")}
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
        <h2 className="text-xl font-semibold mb-6">{t("assessment.basicInfo.heading")}</h2>
        <Input
          label={t("assessment.basicInfo.name")}
          placeholder={t("assessment.basicInfo.namePlaceholder")}
          required
        />

        <Input
          label={t("assessment.basicInfo.dwellers")}
          type="number"
          placeholder={t("assessment.basicInfo.dwellersPlaceholder")}
          icon={<UsersIcon size={18} />}
          required
        />

        <Input
          label={t("assessment.basicInfo.phone")}
          type="tel"
          placeholder={t("assessment.basicInfo.phonePlaceholder")}
          required
        />

        <Input
          label={t("assessment.basicInfo.email")}
          type="email"
          placeholder={t("assessment.basicInfo.emailPlaceholder")}
          required
        />
      </div>}
      {currentStep === 2 && <div>
        <h2 className="text-xl font-semibold mb-6">{t("assessment.propertyDetails.heading")}</h2>
        <Input
          label={t("assessment.propertyDetails.roofArea")}
          type="number"
          placeholder={t("assessment.propertyDetails.roofAreaPlaceholder")}
          icon={<HomeIcon size={18} />}
          required
        />

        <Input
          label={t("assessment.propertyDetails.openSpace")}
          type="number"
          placeholder={t("assessment.propertyDetails.openSpacePlaceholder")}
          required
        />

        <Dropdown
          label={t("assessment.propertyDetails.roofType")}
          options={roofTypes}
          placeholder={t("assessment.propertyDetails.roofType")}
          required
        />

        <Dropdown
          label={t("assessment.propertyDetails.soilType")}
          options={soilTypes}
          placeholder={t("assessment.propertyDetails.soilType")}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {t("assessment.propertyDetails.roofPhoto")}
          </label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              <UploadCloudIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {t("assessment.propertyDetails.dragDrop")}
              </p>
              <p className="text-xs text-gray-500">
                {t("assessment.propertyDetails.orBrowse")}
              </p>
            </div>
          </div>
        </div>
      </div>}
      {currentStep === 3 && <div>
        <h2 className="text-xl font-semibold mb-6">{t("assessment.locationDetails.heading")}</h2>
        <Input
      label={t("assessment.locationDetails.address")}
      placeholder={t("assessment.locationDetails.addressPlaceholder")}
      icon={<MapPinIcon size={18} />}
      required
    />

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {t("assessment.locationDetails.mapPin")}
      </label>
      <div className="mt-1 bg-gray-100 rounded-lg h-64 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-2 bg-white rounded-full shadow-lg">
            <MapPinIcon className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Input
        label={t("assessment.locationDetails.latitude")}
        placeholder={t("assessment.locationDetails.latitudePlaceholder")}
        required
      />
      <Input
        label={t("assessment.locationDetails.longitude")}
        placeholder={t("assessment.locationDetails.longitudePlaceholder")}
        required
      />
    </div>

    <Input
      label={t("assessment.locationDetails.rainfall")}
      type="number"
      placeholder={t("assessment.locationDetails.rainfallPlaceholder")}
      icon={<CloudRainIcon size={18} />}
      required
    />
      </div>}
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? <Button variant="outline" onClick={handlePrevStep}>
          {t("assessment.buttons.previous")}
        </Button> : <div></div>}
        <Button variant="primary" onClick={handleNextStep}>
          {currentStep === 3 ? t("assessment.buttons.submit") : t("assessment.buttons.next")}
        </Button>
      </div>
    </Card>
  </MainLayout>;
};
export default AssessmentInput;