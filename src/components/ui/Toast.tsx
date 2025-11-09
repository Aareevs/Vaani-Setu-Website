import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
};

export function Toast({ id, title, description, type, duration = 5000, onClose }: ToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isHovered) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining === 0) {
        onClose(id);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [id, duration, onClose, isHovered]);

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`w-80 p-4 rounded-lg shadow-lg border ${config.bgColor} ${config.borderColor} ${
        type === 'error' ? 'dark:bg-red-900/20 dark:border-red-800' :
        type === 'success' ? 'dark:bg-green-900/20 dark:border-green-800' :
        type === 'warning' ? 'dark:bg-yellow-900/20 dark:border-yellow-800' :
        'dark:bg-blue-900/20 dark:border-blue-800'
      } backdrop-blur-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.color} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${config.color} dark:text-white`}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${config.color.replace('text', 'bg')} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}