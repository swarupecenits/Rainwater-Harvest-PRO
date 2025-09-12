import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropletIcon, CloudRainIcon, LeafIcon, ChevronRightIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
interface OnboardingSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides: OnboardingSlide[] = [{
    icon: <DropletIcon className="h-16 w-16 text-blue-600" />,
    title: 'Assess Your Potential',
    description: "Discover your home's rainwater harvesting potential with just a few simple steps."
  }, {
    icon: <CloudRainIcon className="h-16 w-16 text-blue-600" />,
    title: 'Save Water & Money',
    description: 'Reduce your water bills and contribute to water conservation in your community.'
  }, {
    icon: <LeafIcon className="h-16 w-16 text-green-600" />,
    title: 'Environmental Impact',
    description: 'Help recharge groundwater and reduce stormwater runoff in your area.'
  }];
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };
  const skipToLogin = () => {
    navigate('/login');
  };
  return <MainLayout hideNavbar>
      <div className="flex flex-col items-center justify-between min-h-screen p-6 pt-12">
        <div className="flex justify-end w-full">
          <button className="text-gray-500 hover:text-gray-700 text-sm" onClick={skipToLogin}>
            Skip
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
          {slides[currentSlide].icon}
          <h1 className="text-2xl font-bold mt-8 mb-2">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-600 mb-8">
            {slides[currentSlide].description}
          </p>
          <div className="flex space-x-2 my-8">
            {slides.map((_, index) => <div key={index} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}></div>)}
          </div>
        </div>
        <div className="w-full max-w-md">
          <Button variant="primary" fullWidth size="lg" onClick={nextSlide} icon={currentSlide === slides.length - 1 ? undefined : <ChevronRightIcon size={18} />}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </MainLayout>;
};
export default Onboarding;