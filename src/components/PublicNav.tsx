import { Menu, X, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from 'figma:asset/bd00bd3a9f16cf036d031e12858b5516cf661d7f.png';

interface PublicNavProps {
  onNavigate: (page: any) => void;
  currentPage?: string;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  onSearch?: (query: string) => void;
}

export default function PublicNav({ onNavigate, currentPage, darkMode = false, toggleDarkMode, onSearch }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    onSearch?.(q);
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex min-w-0 items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Vaani Setu Logo" className="w-10 h-10 object-contain" />
            <span className="truncate text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Vaani Setu
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex min-w-0 flex-1 items-center justify-end gap-2 lg:gap-4 xl:gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2 py-1 text-sm transition-colors lg:text-base ${
                  currentPage === item.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="relative hidden lg:block w-44 xl:w-56 rounded-full border border-gray-300/60 bg-white/70 shadow-sm hover:shadow-md focus-within:border-gray-400 focus-within:shadow-md dark:bg-gray-800 dark:border-gray-700" role="search">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitSearch();
                }}
                placeholder="Search..."
                className="w-full h-10 pl-7 pr-3 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-300 dark:placeholder-gray-400"
                aria-label="Search site"
              />
            </div>
            {toggleDarkMode && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            )}
            <button
              onClick={() => onNavigate('signup')}
              className="shrink-0 px-3 lg:px-5 py-2 text-sm lg:text-base bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span className="hidden lg:inline">Register/Login</span>
              <span className="lg:hidden">Login</span>
            </button>
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {toggleDarkMode && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative w-full rounded-full border border-gray-300/60 bg-white/70 shadow-sm focus-within:border-gray-400 focus-within:shadow-md dark:bg-gray-800 dark:border-gray-700 mb-3" role="search">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { submitSearch(); setMobileMenuOpen(false); }
                    }}
                    placeholder="Search..."
                    className="w-full h-10 pl-9 pr-3 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-300 dark:placeholder-gray-400"
                    aria-label="Search site"
                  />
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
                >
                  Register/Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
