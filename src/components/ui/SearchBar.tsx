import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  duration?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'popular';
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  darkMode?: boolean;
  showFilters?: boolean;
  categories?: string[];
  difficulties?: string[];
  durations?: string[];
  tags?: string[];
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search...", 
  darkMode = false, 
  showFilters = true,
  categories = [],
  difficulties = [],
  durations = [],
  tags = []
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance'
  });

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, onSearch]);

  const handleClear = () => {
    setQuery('');
    setFilters({ sortBy: 'relevance' });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 w-full",
            darkMode 
              ? "bg-gray-800 border-gray-600 focus-within:border-blue-500" 
              : "bg-white border-gray-300 focus-within:border-blue-500",
            "shadow-sm hover:shadow-md"
          )}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
              <Search className="w-4 h-4 text-white" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none text-sm",
                darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
              )}
              aria-label="Search input"
            />

            <button
              type="submit"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
              aria-label="Search"
            >
              Search
            </button>

            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClear}
                type="button"
                className={cn(
                  "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-500" />
              </motion.button>
            )}

            {showFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                type="button"
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showFilterPanel
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                aria-label="Toggle filters"
                aria-expanded={showFilterPanel}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {showFilterPanel && showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "mt-2 p-4 rounded-xl border shadow-lg",
                darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                {categories.length > 0 && (
                  <div>
                    <label className={cn("block text-sm font-medium mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                      Category
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                      className={cn(
                        "w-full p-2 rounded-lg border text-sm",
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                      )}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Difficulty Filter */}
                {difficulties.length > 0 && (
                  <div>
                    <label className={cn("block text-sm font-medium mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                      Difficulty
                    </label>
                    <select
                      value={filters.difficulty || ''}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                      className={cn(
                        "w-full p-2 rounded-lg border text-sm",
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                      )}
                    >
                      <option value="">All Levels</option>
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Duration Filter */}
                {durations.length > 0 && (
                  <div>
                    <label className={cn("block text-sm font-medium mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                      Duration
                    </label>
                    <select
                      value={filters.duration || ''}
                      onChange={(e) => handleFilterChange('duration', e.target.value || undefined)}
                      className={cn(
                        "w-full p-2 rounded-lg border text-sm",
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                      )}
                    >
                      <option value="">Any Duration</option>
                      {durations.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort By */}
                <div>
                  <label className={cn("block text-sm font-medium mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value as SearchFilters['sortBy'])}
                    className={cn(
                      "w-full p-2 rounded-lg border text-sm",
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Tags Filter */}
              {tags.length > 0 && (
                <div className="mt-4">
                  <label className={cn("block text-sm font-medium mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          filters.tags?.includes(tag)
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : darkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                        aria-pressed={filters.tags?.includes(tag)}
                        aria-label={`Filter by ${tag} tag`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(filters.category || filters.difficulty || filters.duration || filters.tags?.length) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                      Active Filters
                    </span>
                    <button
                      onClick={() => setFilters({ sortBy: 'relevance' })}
                      className={cn(
                        "text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
                        "focus:outline-none focus:underline"
                      )}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Search results counter component
interface SearchResultsCounterProps {
  total: number;
  filtered: number;
  query: string;
  darkMode?: boolean;
}

export function SearchResultsCounter({ total, filtered, query, darkMode }: SearchResultsCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "text-sm text-center py-2",
        darkMode ? "text-gray-400" : "text-gray-600"
      )}
    >
      {query ? (
        <>
          Found <span className="font-semibold">{filtered}</span> results for "{query}"
          {filtered !== total && <span> (out of {total} total)</span>}
        </>
      ) : (
        <>
          Showing <span className="font-semibold">{filtered}</span> of {total} items
        </>
      )}
    </motion.div>
  );
}