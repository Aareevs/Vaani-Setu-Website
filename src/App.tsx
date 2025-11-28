import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import InterpreterPage from './components/InterpreterPage';
import CommunityPage from './components/CommunityPage';
import CommunityAllPage from './components/CommunityAllPage';
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
import { useAuth } from './context/AuthContext';
import { supabase } from './utils/supabase';

type Page = 'landing' | 'about' | 'pricing' | 'login' | 'signup' | 'dashboard' | 'interpreter' | 'community' | 'community-all' | 'tutorials' | 'settings' | 'profile' | '404';

function App() {
  const { user, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const isLoggedIn = !!user;
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // Initialize dark mode from localStorage, default to light mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('vaani:darkMode');
      if (stored !== null) return stored === 'true';
    } catch (e) {
      // ignore
    }
    // Default to light mode (false)
    return false;
  });
  const { toasts, toast, removeToast } = useToast();

  const handleLogin = () => {
    setCurrentPage('dashboard');
    toast.success('Login Successful!', `Welcome back!`);
  };

  const handleProfileImageUpdate = (image: string | null) => {
    setProfileImage(image);
    try {
      if (image) {
        localStorage.setItem('vaani:profileImage', image);
      } else {
        localStorage.removeItem('vaani:profileImage');
      }
    } catch (e) {
      // ignore localStorage errors
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserName('');
    setProfileImage(null);
    setCurrentPage('landing');
    toast.info('Logged Out', 'You have been successfully logged out.');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vaani:darkMode', String(next));
      } catch (e) {
        // ignore
      }
      // keep document class in sync
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  // Ensure the `dark` class is present on load and whenever darkMode state changes
  useEffect(() => {
    // Remove dark class on initial load to ensure light mode default
    document.documentElement.classList.remove('dark');
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Clear dark mode preference on first load if not explicitly set
  useEffect(() => {
    try {
      const hasExplicitPreference = localStorage.getItem('vaani:darkMode') !== null;
      if (!hasExplicitPreference) {
        // Ensure light mode is the default
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Load profile image and user data from Supabase
  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      
      const fetchProfile = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('avatar_url, username')
            .eq('id', user.id)
            .single();
            
          if (data) {
            if (data.username) setUserName(data.username);
            if (data.avatar_url) setProfileImage(data.avatar_url);
          }
        } catch (e) {
          console.error('Error fetching profile:', e);
        }
      };
      
      fetchProfile();
    } else {
      setUserName('');
      setProfileImage(null);
    }
  }, [user]);

  const handleProfileNameUpdate = (name: string) => {
    setUserName(name);
  };

  // Handle Auth State Changes for Navigation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setCurrentPage('dashboard');
        toast.success('Welcome back!');
      } else if (event === 'SIGNED_OUT') {
        setCurrentPage('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} isLoggedIn={isLoggedIn} />;
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
        return <CommunityPage onNavigate={navigateTo} />;
      case 'community-all':
        return <CommunityAllPage onNavigate={navigateTo} />;
      case 'tutorials':
        return <TutorialsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'profile':
        return <ProfilePage userName={userName} onNavigate={navigateTo} profileImage={profileImage} onProfileImageUpdate={handleProfileImageUpdate} onProfileNameUpdate={handleProfileNameUpdate} onLogout={handleLogout} />;
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
           profileImage={profileImage}
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
      {currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== '404' && <Footer darkMode={darkMode} onNavigate={navigateTo} isLoggedIn={isLoggedIn} />}
      
      {/* Chatbot - Available on all pages */}
      <Chatbot darkMode={darkMode} />
      
      {/* Back to Top Button */}
      <BackToTop darkMode={darkMode} />
    </div>
  );
}

export default App;