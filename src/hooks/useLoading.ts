import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  wrapLoading: <T>(promise: Promise<T>) => Promise<T>;
}

export function useLoading(): LoadingState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setErrorState(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setError = useCallback((error: string) => {
    setErrorState(error);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const wrapLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await promise;
      stopLoading();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  }, [startLoading, stopLoading, setError]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    clearError,
    wrapLoading,
  };
}

// Hook for managing multiple loading states
export function useLoadingStates<T extends string>(keys: T[]): Record<T, LoadingState> {
  const [loadingStates, setLoadingStates] = useState<Record<T, boolean>>(
    () => Object.fromEntries(keys.map(key => [key, false])) as Record<T, boolean>
  );
  
  const [errorStates, setErrorStates] = useState<Record<T, string | null>>(
    () => Object.fromEntries(keys.map(key => [key, null])) as Record<T, string | null>
  );

  const startLoading = useCallback((key: T) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setErrorStates(prev => ({ ...prev, [key]: null }));
  }, []);

  const stopLoading = useCallback((key: T) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const setError = useCallback((key: T, error: string) => {
    setErrorStates(prev => ({ ...prev, [key]: error }));
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const clearError = useCallback((key: T) => {
    setErrorStates(prev => ({ ...prev, [key]: null }));
  }, []);

  const wrapLoading = useCallback(async <R,>(key: T, promise: Promise<R>): Promise<R> => {
    startLoading(key);
    try {
      const result = await promise;
      stopLoading(key);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(key, errorMessage);
      throw error;
    }
  }, [startLoading, stopLoading, setError]);

  return Object.fromEntries(
    keys.map(key => [
      key,
      {
        isLoading: loadingStates[key],
        error: errorStates[key],
        startLoading: () => startLoading(key),
        stopLoading: () => stopLoading(key),
        setError: (error: string) => setError(key, error),
        clearError: () => clearError(key),
        wrapLoading: <R,>(promise: Promise<R>) => wrapLoading(key, promise),
      }
    ])
  ) as Record<T, LoadingState>;
}