import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, DownloadIcon, EyeIcon, FilterIcon, SearchIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

interface Report {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'suitable' | 'conditional' | 'unsuitable';
  harvestPotential: number;
}

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const reports: Report[] = [
    {
      id: '1',
      name: 'My Home Assessment',
      date: 'June 15, 2023',
      location: '123 Main St, Green Valley',
      status: 'suitable',
      harvestPotential: 112500
    },
    {
      id: '2',
      name: 'Office Building Assessment',
      date: 'May 22, 2023',
      location: '456 Business Park, Downtown',
      status: 'conditional',
      harvestPotential: 87200
    },
    {
      id: '3',
      name: 'Weekend Home',
      date: 'April 10, 2023',
      location: '789 Lake View, Riverside',
      status: 'suitable',
      harvestPotential: 65800
    },
    {
      id: '4',
      name: 'Rental Property',
      date: 'March 5, 2023',
      location: '101 Sunset Ave, Westside',
      status: 'unsuitable',
      harvestPotential: 22400
    }
  ];

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'suitable':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{t('Highly Suitable')}</span>;
      case 'conditional':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{t('Conditionally Suitable')}</span>;
      case 'unsuitable':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{t('Not Recommended')}</span>;
    }
  };

  const formatHarvestPotential = (value: number) => {
    return `${(value / 1000).toFixed(1)}K L/year`;
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('Assessment Reports')}</h1>
          <p className="text-gray-600">{t('View and manage your past assessments')}</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/assessment')}>
          {t('New Assessment')}
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('Search reports...')}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" icon={<FilterIcon size={16} />}>
              {t('Filter')}
           </Button>
            <select className="border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="newest">{t('Newest First')}</option>
              <option value="oldest">{t('Oldest First')}</option>
              <option value="potential">{t('Highest Potential')}</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <FileTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{report.name}</h3>
                  <p className="text-gray-600 text-sm">{report.location}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 mr-3">{report.date}</span>
                    {getStatusBadge(report.status)}
                    <span className="ml-3 text-xs font-medium text-blue-700">
                      {formatHarvestPotential(report.harvestPotential)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" icon={<EyeIcon size={16} />} onClick={() => navigate('/results')}>
                  {t('View')}
                </Button>
                <Button variant="outline" size="sm" icon={<DownloadIcon size={16} />}>
                  {t('Download')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('No reports yet')}</h3>
          <p className="text-gray-600 mb-6">{t('Start your first assessment to generate a report.')}</p>
          <Button variant="primary" onClick={() => navigate('/assessment')}>
            {t('Start Assessment')}
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;
