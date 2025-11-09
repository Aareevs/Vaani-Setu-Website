import { useState } from 'react';
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
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { EnhancedBreadcrumb } from './components/ui/breadcrumb';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { BackToTop } from './components/ui/BackToTop';

type Page = 'landing' | 'about' | 'pricing' | 'login' | 'signup' | 'dashboard' | 'interpreter' | 'community' | 'tutorials' | 'settings' | 'profile' | '404';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    setCurrentPage('dashboard');
    toast.success('Login Successful!', `Welcome back, ${name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setCurrentPage('landing');
    toast.info('Logged Out', 'You have been successfully logged out.');
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
        return <PricingPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} isLoggedIn={isLoggedIn} />;
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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <OfflineIndicator />
      
      {/* Header */}
      {currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== '404' && (
        <Header 
          currentPage={currentPage} 
          onNavigate={navigateTo} 
          darkMode={darkMode} 
          user={userName}
          onLogout={handleLogout}
        />
      )}

      {/* Breadcrumb Navigation */}
      {currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== '404' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <EnhancedBreadcrumb 
              items={[
                { label: 'Home', onClick: () => navigateTo('dashboard') },
                { label: currentPage.charAt(0).toUpperCase() + currentPage.slice(1), onClick: () => {} }
              ]}
              darkMode={darkMode}
              separator="chevron"
            />
          </div>
        </div>
      )}
      
      <main className={isLoggedIn ? '' : ''}>
        {renderPage()}
      </main>
      {currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== '404' && <Footer darkMode={darkMode} onNavigate={navigateTo} />}
      
      {/* Chatbot - Available on all pages */}
      <Chatbot darkMode={darkMode} />
      
      {/* Back to Top Button */}
      <BackToTop darkMode={darkMode} />
    </div>
  );
}

export default App;