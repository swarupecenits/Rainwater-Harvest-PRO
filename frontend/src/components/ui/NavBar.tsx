import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, DropletIcon, MapIcon, FileTextIcon, BookOpenIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react';
interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}
const NavBar: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.noupe.com/embed/019948a5225c709ba57d3c33d93feda0228c.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems: NavItem[] = [{
    to: '/dashboard',
    icon: <HomeIcon size={20} />,
    label: 'Home'
  }, {
    to: '/assessment',
    icon: <DropletIcon size={20} />,
    label: 'Assessment'
  }, {
    to: '/map',
    icon: <MapIcon size={20} />,
    label: 'Map'
  }, {
    to: '/reports',
    icon: <FileTextIcon size={20} />,
    label: 'Reports'
  }, {
    to: '/knowledge',
    icon: <BookOpenIcon size={20} />,
    label: 'Learn'
  }, {
    to: '/settings',
    icon: <SettingsIcon size={20} />,
    label: 'Settings'
  }];
  const isActive = (path: string) => location.pathname === path;
  return <>
      {/* Mobile Navigation */}
  <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-[1100]">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center">
            <DropletIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-2 font-semibold text-lg text-gray-800">
              RainWise
            </span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 focus:outline-none">
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
        {mobileMenuOpen && <div className="bg-white shadow-md pt-2 pb-4">
            {navItems.map(item => <Link key={item.to} to={item.to} className={`flex items-center py-3 px-4 ${isActive(item.to) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>)}
          </div>}
      </div>
      {/* Desktop Navigation */}
  <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200 md:w-64 md:shadow-sm z-[1100]">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <DropletIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-2 font-semibold text-lg text-gray-800">
              RainWise
            </span>
          </Link>
        </div>
        <nav className="flex-1 pt-4">
          {navItems.map(item => <Link key={item.to} to={item.to} className={`flex items-center py-3 px-6 ${isActive(item.to) ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>)}
        </nav>
      </div>
    </>;
};
export default NavBar;