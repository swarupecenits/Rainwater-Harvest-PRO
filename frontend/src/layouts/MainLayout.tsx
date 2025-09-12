import React from 'react';
import NavBar from '../components/ui/NavBar';
interface MainLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideNavbar = false
}) => {
  return <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <NavBar />}
      <main className={`${!hideNavbar ? 'md:ml-64 pt-16 md:pt-0' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          {children}
        </div>
      </main>
    </div>;
};
export default MainLayout;