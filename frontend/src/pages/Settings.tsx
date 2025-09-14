import React, { useState } from 'react';
import { UserIcon, BellIcon, GlobeIcon, MoonIcon, ShieldIcon, HelpCircleIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useTranslation } from "react-i18next";

const lngs = [
  { code: "en", native: "English (US)" },
  { code: "hi", native: "Hindi (हिन्दी)" },
];

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || "en");

  const handleSave = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("preferredLanguage", selectedLang);
  };

  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [{
    id: 'profile',
    name: 'Profile',
    icon: <UserIcon size={18} />
  }, {
    id: 'notifications',
    name: 'Notifications',
    icon: <BellIcon size={18} />
  }, {
    id: 'language',
    name: 'Language',
    icon: <GlobeIcon size={18} />
  }, {
    id: 'appearance',
    name: 'Appearance',
    icon: <MoonIcon size={18} />
  }, {
    id: 'privacy',
    name: 'Privacy',
    icon: <ShieldIcon size={18} />
  }, {
    id: 'help',
    name: 'Help & Support',
    icon: <HelpCircleIcon size={18} />
  }];
  return <MainLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-600">Manage your account preferences</p>
    </div>
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-64 shrink-0">
        <Card className="p-2">
          {tabs.map(tab => <button key={tab.id} className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab(tab.id)}>
            <span className="mr-3">{tab.icon}</span>
            {tab.name}
          </button>)}
        </Card>
      </div>
      <div className="flex-1">
        {activeTab === 'profile' && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {t("Profile Information")}
          </h2>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <div>
              <Button variant="outline" size="sm">
                {t("Change Photo")}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                JPG, GIF or PNG. Max size 1MB.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" value="Swarup" />
            <Input label="Last Name" value="Chanda" />
            <Input label="Email" type="email" value="swarupchanda1963@gmail.com" />
            <Input label="Phone Number" type="tel" value="+91 600 314 7277" />
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-4">{t("Default Address")}</h3>
            <Input label="Street Address" value="NIT Silchar" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City" value="Silchar" />
              <Input label="State/Province" value="Assam" />
              <Input label="Zip/Postal Code" value="788010" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary">{t("Save Changes")}</Button>
          </div>
        </Card>}
        {activeTab === 'notifications' && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {t("Notification Preferences")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="font-medium">{t("Assessment Reports")}</h3>
                <p className="text-sm text-gray-600">
                  {t("Receive notifications when your assessments are complete")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="font-medium">{t("Rainfall Alerts")}</h3>
                <p className="text-sm text-gray-600">
                  {t("Get notified about significant rainfall events in your area")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="font-medium">{t("News & Updates")}</h3>
                <p className="text-sm text-gray-600">
                  {t("Stay informed about new features and app updates")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="font-medium">{t("Maintenance Reminders")}</h3>
                <p className="text-sm text-gray-600">
                  {t("Get reminders for maintaining your rainwater harvesting systems")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-4">{t("Notification Channels")}</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input id="email-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  {t("Email")}
                </label>
              </div>
              <div className="flex items-center">
                <input id="sms-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                  {t("SMS")}
                </label>
              </div>
              <div className="flex items-center">
                <input id="push-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                 {t("Push Notifications")} 
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary">{t("Save Preferences")}</Button>
          </div>
        </Card>}
        {activeTab === 'appearance' && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {t("Appearance Settings")}
          </h2>
          <div className="mb-6">
            <h3 className="font-medium mb-4">{t("Theme")}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-blue-600 rounded-lg p-3 cursor-pointer">
                <div className="h-20 bg-white rounded mb-2"></div>
                <div className="flex items-center">
                  <input id="light-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" defaultChecked />
                  <label htmlFor="light-theme" className="ml-2 block text-sm">
                    {t("Light")}
                  </label>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 cursor-pointer">
                <div className="h-20 bg-gray-900 rounded mb-2"></div>
                <div className="flex items-center">
                  <input id="dark-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" />
                  <label htmlFor="dark-theme" className="ml-2 block text-sm">
                   {t("Dark")} 
                  </label>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 cursor-pointer">
                <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2"></div>
                <div className="flex items-center">
                  <input id="system-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" />
                  <label htmlFor="system-theme" className="ml-2 block text-sm">
                    {t("System")}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-4">{t("Text Size")}</h3>
            <div className="flex items-center">
              <span className="text-sm mr-3">A</span>
              <input type="range" min="1" max="5" step="1" defaultValue="3" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-lg ml-3">A</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary">{t("Apply Changes")}</Button>
          </div>
        </Card>}
        {activeTab === 'language' && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">{t("Language Settings")}</h2>
          <div className="mb-6">
            <h3 className="font-medium mb-4">{t("App Language")}</h3>
            <select className="w-full border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {lngs.map((lng) => (
                <option key={lng.code} value={lng.code}>
                  {lng.native}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-4">{t("Region")}</h3>
            <select className="w-full border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="us">United States</option>
              <option value="eu">European Union</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="in">India</option>
            </select>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-4">Date Format</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="mdy" type="radio" name="date-format" className="h-4 w-4 text-blue-600" defaultChecked />
                <label htmlFor="mdy" className="ml-2 block text-sm">
                  MM/DD/YYYY (06/15/2023)
                </label>
              </div>
              <div className="flex items-center">
                <input id="dmy" type="radio" name="date-format" className="h-4 w-4 text-blue-600" />
                <label htmlFor="dmy" className="ml-2 block text-sm">
                  DD/MM/YYYY (15/06/2023)
                </label>
              </div>
              <div className="flex items-center">
                <input id="ymd" type="radio" name="date-format" className="h-4 w-4 text-blue-600" />
                <label htmlFor="ymd" className="ml-2 block text-sm">
                  YYYY/MM/DD (2023/06/15)
                </label>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-4">Measurement Units</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="metric" type="radio" name="units" className="h-4 w-4 text-blue-600" defaultChecked />
                <label htmlFor="metric" className="ml-2 block text-sm">
                  Metric (meters, liters, mm)
                </label>
              </div>
              <div className="flex items-center">
                <input id="imperial" type="radio" name="units" className="h-4 w-4 text-blue-600" />
                <label htmlFor="imperial" className="ml-2 block text-sm">
                  Imperial (feet, gallons, inches)
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} variant="primary">{t("Save Preferences")}</Button>
          </div>
        </Card>}
      </div>
    </div>
  </MainLayout>;
};
export default Settings;