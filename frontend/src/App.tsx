import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import AssessmentInput from './pages/Assessment/InputForm';
import AssessmentResults from './pages/Assessment/Results';
import MapExplorer from './pages/MapExplorer';
import Reports from './pages/Reports';
import KnowledgeHub from './pages/KnowledgeHub';
import Settings from './pages/Settings';
import About from './pages/About';
export function App() {
  return <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<AssessmentInput />} />
        <Route path="/results" element={<AssessmentResults />} />
        <Route path="/map" element={<MapExplorer />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/knowledge" element={<KnowledgeHub />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>;
}