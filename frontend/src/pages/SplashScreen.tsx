import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropletIcon } from 'lucide-react';
const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-green-500 p-6 text-white">
      <div className="animate-pulse">
        <DropletIcon className="h-24 w-24 mb-4" />
      </div>
      <h1 className="text-4xl font-bold mb-2 animate-fade-in">
        RainWise
      </h1>
      <p className="text-lg opacity-90 text-center">
        Smart way to manage rainwater.
      </p>
      <div className="mt-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>;
};
export default SplashScreen;