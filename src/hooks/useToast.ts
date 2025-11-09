import { useState, useCallback, useRef } from 'react';
import { ToastProps } from '../components/ui/Toast';

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((
    title: string,
    description?: string,
    type: ToastProps['type'] = 'info',
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${toastCounter++}`;
    const newToast: ToastProps = {
      id,
      title,
      description,
      type,
      duration,
      onClose: (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      },
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = {
    success: (title: string, description?: string, duration?: number) => 
      addToast(title, description, 'success', duration),
    error: (title: string, description?: string, duration?: number) => 
      addToast(title, description, 'error', duration),
    info: (title: string, description?: string, duration?: number) => 
      addToast(title, description, 'info', duration),
    warning: (title: string, description?: string, duration?: number) => 
      addToast(title, description, 'warning', duration),
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    toast,
  };
}