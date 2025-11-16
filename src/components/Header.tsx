import { Home, Video, Users, BookOpen, Settings, User, Menu, X, LogOut, ChevronDown, CreditCard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKeyboardNavigation, useFocusManagement, useAnnouncer } from '../hooks/useAccessibility';
// unused import removed
import { OnlineStatusIndicator } from './ui/OfflineIndicator';
import logo from 'figma:asset/bd00bd3a9f16cf036d031e12858b5516cf661d7f.png';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  darkMode: boolean;
  user?: string;
  profileImage?: string | null;
}

export default function Header({ currentPage, onNavigate, darkMode, onLogout, profileImage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Accessibility hooks
  const { announce } = useAnnouncer();
  const handleKeyNavigation = useKeyboardNavigation();
  const { trapFocus } = useFocusManagement();

  // Apply focus trap to dropdowns when they open
  useEffect(() => {
    if (profileDropdownOpen && profileDropdownRef.current) {
      trapFocus(profileDropdownRef.current);
    }
    if (mobileMenuOpen && mobileMenuRef.current) {
      trapFocus(mobileMenuRef.current);
    }
  }, [profileDropdownOpen, mobileMenuOpen, trapFocus]);
  
  // Refs for focus management
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'interpreter', label: 'Interpreter', icon: Video },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ];

  // Handle keyboard navigation for navigation items
  const handleNavKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    handleKeyNavigation(e, {
      onEnter: action,
      onSpace: action,
      onArrowRight: () => {
        const current = e.currentTarget;
        const buttons = Array.from(current.parentElement?.querySelectorAll('button') || []);
        const currentIndex = buttons.indexOf(current as HTMLButtonElement);
        const nextIndex = (currentIndex + 1) % buttons.length;
        (buttons[nextIndex] as HTMLElement)?.focus();
      },
      onArrowLeft: () => {
        const current = e.currentTarget;
        const buttons = Array.from(current.parentElement?.querySelectorAll('button') || []);
        const currentIndex = buttons.indexOf(current as HTMLButtonElement);
        const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        (buttons[prevIndex] as HTMLElement)?.focus();
      },
    });
  };

  // Handle keyboard navigation for dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setProfileDropdownOpen(false);
      announce('Profile dropdown closed');
    }
  };

  // Handle keyboard navigation for mobile menu
  const handleMobileMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      announce('Mobile menu closed');
    }
  };

  // Announce navigation changes
  useEffect(() => {
    const currentNavItem = navItems.find(item => item.id === currentPage);
    if (currentNavItem) {
      announce(`Navigated to ${currentNavItem.label}`);
    }
  }, [currentPage]);

  return (
    <>
      <header 
      ref={headerRef}
      className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b shadow-lg`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
            onKeyDown={(e) => handleNavKeyDown(e, () => onNavigate('dashboard'))}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center p-2 shadow-lg">
              <img src={logo} alt="Vaani Setu logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Vaani Setu
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main menu">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    onKeyDown={(e) => handleNavKeyDown(e, () => onNavigate(item.id))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
            
            {/* Online Status & Profile */}
            <div className="flex items-center gap-4">
              {/* Online Status Indicator */}
              <div className="hidden md:flex">
                <OnlineStatusIndicator />
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onKeyDown={handleDropdownKeyDown}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    darkMode
                      ? 'text-gray-300 hover:bg-gray-700/50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage && (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>
              
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    ref={profileDropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    } py-2 z-50`}
                    role="menu"
                    aria-label="Profile menu"
                  >
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setProfileDropdownOpen(false);
                        announce('Profile page opened');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        darkMode
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setProfileDropdownOpen(false);
                        announce('Settings page opened');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        darkMode
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      Settings
                    </button>
                    <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                        announce('Logged out successfully');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      role="menuitem"
                      tabIndex={0}
                      aria-label="Logout from account"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              announce(mobileMenuOpen ? 'Mobile menu closed' : 'Mobile menu opened');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMobileMenuOpen(!mobileMenuOpen);
                announce(mobileMenuOpen ? 'Mobile menu closed' : 'Mobile menu opened');
              }
            }}
            whileTap={{ scale: 0.9 }}
            className={`md:hidden p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} aria-hidden="true" />
            ) : (
              <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} aria-hidden="true" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t mt-2`}
              id="mobile-menu"
              role="menu"
              aria-label="Mobile navigation menu"
              onKeyDown={handleMobileMenuKeyDown}
            >
              <nav className="flex flex-col gap-2 py-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                        announce(`Navigated to ${item.label}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                          announce(`Navigated to ${item.label}`);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg'
                          : darkMode
                          ? 'text-gray-200 hover:bg-gray-700/50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      role="menuitem"
                      tabIndex={0}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
                
                {/* Account Section */}
                <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-300 mb-2" role="heading" aria-level={2}>ACCOUNT</p>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                      announce('Profile page opened');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate('profile');
                        setMobileMenuOpen(false);
                        announce('Profile page opened');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      currentPage === 'profile'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg'
                        : darkMode
                        ? 'text-gray-200 hover:bg-gray-700/50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                    tabIndex={0}
                    aria-current={currentPage === 'profile' ? 'page' : undefined}
                    aria-label="Navigate to Profile"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                      {profileImage && (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span>Profile</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                    onClick={() => {
                      onNavigate('settings');
                      setMobileMenuOpen(false);
                      announce('Settings page opened');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate('settings');
                        setMobileMenuOpen(false);
                        announce('Settings page opened');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      currentPage === 'settings'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg'
                        : darkMode
                        ? 'text-gray-200 hover:bg-gray-700/50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                    tabIndex={0}
                    aria-current={currentPage === 'settings' ? 'page' : undefined}
                    aria-label="Navigate to Settings"
                  >
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    <span>Settings</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 2) * 0.05 }}
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                      announce('Logged out successfully');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onLogout();
                        setMobileMenuOpen(false);
                        announce('Logged out successfully');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    role="menuitem"
                    tabIndex={0}
                    aria-label="Logout from account"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
}
