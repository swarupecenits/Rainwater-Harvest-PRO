import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropletIcon, CloudRainIcon, FileTextIcon, BookOpenIcon, MapIcon, BarChart2Icon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const quickActions = [{
    title: 'Start Assessment',
    icon: <DropletIcon className="h-8 w-8 text-blue-600" />,
    description: 'Evaluate your rainwater harvesting potential',
    action: () => navigate('/assessment'),
    color: 'bg-blue-50'
  }, {
    title: 'My Reports',
    icon: <FileTextIcon className="h-8 w-8 text-green-600" />,
    description: 'View your past assessments and reports',
    action: () => navigate('/reports'),
    color: 'bg-green-50'
  }, {
    title: 'Local Rainfall Data',
    icon: <CloudRainIcon className="h-8 w-8 text-cyan-600" />,
    description: 'Check rainfall patterns in your area',
    action: () => {},
    color: 'bg-cyan-50'
  }, {
    title: 'Knowledge Hub',
    icon: <BookOpenIcon className="h-8 w-8 text-purple-600" />,
    description: 'Learn about rainwater harvesting techniques',
    action: () => navigate('/knowledge'),
    color: 'bg-purple-50'
  }];
  return <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Swarup
        </h1>
        <p className="text-gray-600">
          Let's explore your rainwater harvesting potential
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action, index) => <Card key={index} className="flex items-start p-6 hover:shadow-md transition-all cursor-pointer" onClick={action.action}>
            <div className={`p-4 rounded-lg mr-4 ${action.color}`}>
              {action.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
            </div>
          </Card>)}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Map Preview</h2>
        <Card className="overflow-hidden">
          <div className="bg-gray-100 h-64 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
          }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="primary" onClick={() => navigate('/map')} icon={<MapIcon size={16} />}>
                Explore GIS Map
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Rainfall</h2>
          <Card className="h-64 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Monthly Precipitation</h3>
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
            <div className="relative h-48">
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-40">
                {[65, 45, 75, 35, 55, 85].map((value, i) => <div key={i} className="flex flex-col items-center">
                    <div className="w-8 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" style={{
                  height: `${value}%`
                }}></div>
                    <span className="text-xs mt-1 text-gray-600">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                    </span>
                  </div>)}
              </div>
            </div>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Potential Savings</h2>
          <Card className="h-64 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Estimated Water Savings</h3>
              <BarChart2Icon className="text-green-600" />
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-3">
                <DropletIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">14,500</h3>
              <p className="text-gray-600">Liters per year</p>
              <div className="mt-4 text-sm text-gray-600">
                Complete an assessment to get personalized savings estimates.
              </div>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/assessment')}>
                Start Assessment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>;
};
export default Dashboard;