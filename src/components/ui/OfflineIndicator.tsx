import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">You're offline</span>
            <span className="text-sm opacity-90">Some features may be limited</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const OnlineStatusIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className={`text-sm ${
        isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};