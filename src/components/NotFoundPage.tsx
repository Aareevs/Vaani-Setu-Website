import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundPageProps {
  onNavigate: (page: any) => void;
}

export default function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated Confused Hand Gesture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-9xl mb-4"
          >
            🤷
          </motion.div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-8xl mb-4 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl mb-4 text-gray-800">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! It seems like this page got lost in translation. 
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-blue-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-300"
        >
          <p className="text-sm text-gray-600 mb-4">Need help? Try these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('interpreter')}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm hover:underline"
            >
              Interpreter
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => onNavigate('tutorials')}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm hover:underline"
            >
              Tutorials
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => onNavigate('community')}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm hover:underline"
            >
              Community
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => onNavigate('about')}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm hover:underline"
            >
              About Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
