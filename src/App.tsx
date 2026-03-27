import { useState, useEffect, useRef } from 'react';
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

import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { BackToTop } from './components/ui/BackToTop';
import { useAuth } from './context/AuthContext';
import { supabase } from './utils/supabase';

type Page = 'landing' | 'about' | 'pricing' | 'login' | 'signup' | 'dashboard' | 'interpreter' | 'community' | 'community-all' | 'tutorials' | 'settings' | 'profile' | '404';

function App() {
  const { user, signOut } = useAuth();
  const welcomedUserRef = useRef<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Try to restore page from localStorage
    try {
      const stored = localStorage.getItem('vaani:currentPage');
      // Validate that stored value is a valid page
      if (stored && ['landing', 'about', 'pricing', 'login', 'signup', 'dashboard', 'interpreter', 'community', 'community-all', 'tutorials', 'settings', 'profile', '404'].includes(stored)) {
        return stored as Page;
      }
    } catch (e) {
      // ignore
    }
    return 'landing';
  });
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

  // Fetch user profile when logged in
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('avatar_url, username')
            .eq('id', user.id)
            .single();

          if (data) {
            setUserName(data.username || user.email?.split('@')[0] || 'User');
            setProfileImage(data.avatar_url);
          } else {
             // Fallback if no profile exists yet
             setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
             setProfileImage(user.user_metadata?.avatar_url || null);
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

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('landing');
      toast.info('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    try {
      localStorage.setItem('vaani:currentPage', page);
    } catch (e) {
      // ignore
    }
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

  const handleProfileNameUpdate = (name: string) => {
    setUserName(name);
  };

  // Handle Auth State Changes for Navigation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Only redirect to dashboard if we are on a public page (landing, login, signup)
        // Otherwise, stay on the current page (e.g. interpreter)
        setCurrentPage((prev) => {
          if (['landing', 'login', 'signup'].includes(prev)) {
            localStorage.setItem('vaani:currentPage', 'dashboard');
            return 'dashboard';
          }
          return prev;
        });
        const userId = session?.user?.id ?? null;
        if (userId && welcomedUserRef.current !== userId) {
          welcomedUserRef.current = userId;
          try {
            const storedWelcomedUser = sessionStorage.getItem('vaani:welcomedUser');
            if (storedWelcomedUser !== userId) {
              sessionStorage.setItem('vaani:welcomedUser', userId);
              toast.success('Welcome back!');
            }
          } catch (e) {
            toast.success('Welcome back!');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentPage('landing');
        localStorage.setItem('vaani:currentPage', 'landing');
        welcomedUserRef.current = null;
        try {
          sessionStorage.removeItem('vaani:welcomedUser');
        } catch (e) {
          // ignore
        }
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
        return <LoginPage onLogin={() => {}} onNavigate={navigateTo} isSignup={false} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'signup':
        return <LoginPage onLogin={() => {}} onNavigate={navigateTo} isSignup={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
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
        return <ProfilePage 
          userName={userName} 
          onNavigate={navigateTo} 
          profileImage={profileImage} 
          onProfileNameUpdate={handleProfileNameUpdate}
          onLogout={handleLogout} 
        />;
      case '404':
        return <NotFoundPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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


      
      <main className="flex-1 min-w-0">
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
