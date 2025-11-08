import { useState } from 'react';
import { Home, Video, Users, BookOpen, Settings, User, Menu, X } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import InterpreterPage from './components/InterpreterPage';
import CommunityPage from './components/CommunityPage';
import TutorialsPage from './components/TutorialsPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

type Page = 'landing' | 'about' | 'pricing' | 'login' | 'signup' | 'dashboard' | 'interpreter' | 'community' | 'tutorials' | 'settings' | 'profile' | '404';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'pricing':
        return <PricingPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} isSignup={false} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'signup':
        return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} isSignup={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'dashboard':
        return <Dashboard userName={userName} onNavigate={navigateTo} />;
      case 'interpreter':
        return <InterpreterPage />;
      case 'community':
        return <CommunityPage />;
      case 'tutorials':
        return <TutorialsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'profile':
        return <ProfilePage userName={userName} onNavigate={navigateTo} />;
      case '404':
        return <NotFoundPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {isLoggedIn && <Header currentPage={currentPage} onNavigate={navigateTo} onLogout={handleLogout} darkMode={darkMode} />}
      <main className={isLoggedIn ? '' : ''}>
        {renderPage()}
      </main>
      {currentPage !== 'landing' && currentPage !== 'about' && currentPage !== 'pricing' && currentPage !== 'login' && currentPage !== 'signup' && <Footer darkMode={darkMode} onNavigate={navigateTo} />}
      
      {/* Chatbot - Available on all pages */}
      <Chatbot darkMode={darkMode} />
    </div>
  );
}

export default App;