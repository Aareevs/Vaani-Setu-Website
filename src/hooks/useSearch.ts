import { useState, useCallback, useMemo } from 'react';
import { SearchFilters } from '../components/ui/SearchBar';

export interface SearchableItem {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  duration?: string;
  tags?: string[];
  createdAt?: Date;
  popularity?: number;
  [key: string]: any;
}

export interface UseSearchOptions<T extends SearchableItem> {
  items: T[];
  searchFields?: (keyof T)[];
  filterableFields?: (keyof T)[];
  initialFilters?: SearchFilters;
}

export function useSearch<T extends SearchableItem>({
  items,
  searchFields = ['title', 'description'],
  filterableFields = ['category', 'difficulty', 'duration', 'tags'],
  initialFilters = { sortBy: 'relevance' }
}: UseSearchOptions<T>) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const search = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm);
        })
      );
    }

    // Category filter
    if (filters.category && filterableFields.includes('category' as keyof T)) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty && filterableFields.includes('difficulty' as keyof T)) {
      filtered = filtered.filter(item => item.difficulty === filters.difficulty);
    }

    // Duration filter
    if (filters.duration && filterableFields.includes('duration' as keyof T)) {
      filtered = filtered.filter(item => item.duration === filters.duration);
    }

    // Tags filter
    if (filters.tags?.length && filterableFields.includes('tags' as keyof T)) {
      filtered = filtered.filter(item =>
        filters.tags!.some(tag => item.tags?.includes(tag))
      );
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        
        case 'oldest':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        
        case 'relevance':
        default:
          // For relevance, prioritize items where the query appears in title
          if (query.trim()) {
            const aInTitle = a.title.toLowerCase().includes(query.toLowerCase());
            const bInTitle = b.title.toLowerCase().includes(query.toLowerCase());
            if (aInTitle && !bInTitle) return -1;
            if (!aInTitle && bInTitle) return 1;
          }
          return 0;
      }
    });

    return sorted;
  }, [items, query, filters, searchFields, filterableFields]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    query,
    filters,
    search,
    clearSearch,
    results: filteredAndSortedItems,
    totalResults: items.length,
    filteredResults: filteredAndSortedItems.length,
    hasActiveFilters: query.trim() || 
      filters.category || 
      filters.difficulty || 
      filters.duration || 
      filters.tags?.length ||
      filters.sortBy !== 'relevance'
  };
}

// Hook for managing search with pagination
export function useSearchWithPagination<T extends SearchableItem>(
  options: UseSearchOptions<T> & {
    itemsPerPage?: number;
  }
) {
  const { itemsPerPage = 10, ...searchOptions } = options;
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchResult = useSearch(searchOptions);
  
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResult.results.slice(startIndex, endIndex);
  }, [searchResult.results, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(searchResult.results.length / itemsPerPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Reset pagination when search changes
  useState(() => {
    resetPagination();
  });

  return {
    ...searchResult,
    paginatedResults,
    currentPage,
    totalPages,
    goToPage,
    resetPagination,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages
  };
}