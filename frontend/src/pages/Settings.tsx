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
    name: t("settings.profile"),
    icon: <UserIcon size={18} />
  }, {
    id: 'notifications',
    name: t("settings.notifications"),
    icon: <BellIcon size={18} />
  }, {
    id: 'language',
    name: t("settings.language"),
    icon: <GlobeIcon size={18} />
  }, {
    id: 'appearance',
    name: t("settings.appearance"),
    icon: <MoonIcon size={18} />
  }, {
    id: 'privacy',
    name: t("settings.privacy"),
    icon: <ShieldIcon size={18} />
  }, {
    id: 'help',
    name: t("settings.help"),
    icon: <HelpCircleIcon size={18} />
  }];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("settings.title")}</h1>
        <p className="text-gray-600">{t("settings.subtitle")}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 shrink-0">
          <Card className="p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${
                  activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </Card>
        </div>
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {t("settings.profileInformation")}
              </h2>
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    {t("settings.changePhoto")}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, GIF or PNG. Max size 1MB.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t("settings.firstName")} value="Swarup" />
                <Input label={t("settings.lastName")} value="Chanda" />
                <Input label={t("settings.email")} type="email" value="swarupchanda1963@gmail.com" />
                <Input label={t("settings.phoneNumber")} type="tel" value="+91 600 314 7277" />
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-4">{t("settings.defaultAddress")}</h3>
                <Input label={t("settings.streetAddress")} value="NIT Silchar" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label={t("settings.city")} value="Silchar" />
                  <Input label={t("settings.state")} value="Assam" />
                  <Input label={t("settings.zipCode")} value="788010" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="primary">{t("settings.saveChanges")}</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {t("settings.notificationPreferences")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">{t("settings.assessmentReports")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("settings.assessmentReportsDesc")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">{t("settings.rainfallAlerts")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("settings.rainfallAlertsDesc")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">{t("settings.newsUpdates")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("settings.newsUpdatesDesc")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">{t("settings.maintenanceReminders")}</h3>
                    <p className="text-sm text-gray-600">
                      {t("settings.maintenanceRemindersDesc")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">{t("settings.notificationChannels")}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input id="email-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                      {t("settings.email")}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="sms-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                      {t("settings.sms")}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="push-notifications" type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                    <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                      {t("settings.push")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="primary">{t("settings.savePreferences")}</Button>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {t("settings.appearanceSettings")}
              </h2>
              <div className="mb-6">
                <h3 className="font-medium mb-4">{t("settings.theme")}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-blue-600 rounded-lg p-3 cursor-pointer">
                    <div className="h-20 bg-white rounded mb-2"></div>
                    <div className="flex items-center">
                      <input id="light-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label htmlFor="light-theme" className="ml-2 block text-sm">
                        {t("settings.light")}
                      </label>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 cursor-pointer">
                    <div className="h-20 bg-gray-900 rounded mb-2"></div>
                    <div className="flex items-center">
                      <input id="dark-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" />
                      <label htmlFor="dark-theme" className="ml-2 block text-sm">
                        {t("settings.dark")}
                      </label>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 cursor-pointer">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2"></div>
                    <div className="flex items-center">
                      <input id="system-theme" type="radio" name="theme" className="h-4 w-4 text-blue-600" />
                      <label htmlFor="system-theme" className="ml-2 block text-sm">
                        {t("settings.system")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">{t("settings.textSize")}</h3>
                <div className="flex items-center">
                  <span className="text-sm mr-3">A</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    defaultValue="3"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg ml-3">A</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="primary">{t("settings.applyChanges")}</Button>
              </div>
            </Card>
          )}

          {activeTab === 'language' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">{t("settings.languageSettings")}</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-4">{t("settings.appLanguage")}</h3>
                <select
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h3 className="font-medium mb-4">{t("settings.region")}</h3>
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
                <Button onClick={handleSave} variant="primary">{t("settings.savePreferences")}</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;


