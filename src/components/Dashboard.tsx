import { Video, MessageSquare, TrendingUp, Clock, ArrowRight, BookOpen, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  userName: string;
  onNavigate: (page: any) => void;
}

export default function Dashboard({ userName, onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Signs Interpreted Today', value: '24', icon: Video, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Sessions', value: '156', icon: Clock, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Community Posts', value: '8', icon: MessageSquare, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: 'Learning Progress', value: '67%', icon: TrendingUp, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const recentActivities = [
    { action: 'Completed tutorial', name: 'Basic Greetings in ISL', time: '2 hours ago', icon: '✅' },
    { action: 'Interpreted signs', name: '15 signs detected', time: '5 hours ago', icon: '🎯' },
    { action: 'Posted in community', name: 'Tips for beginners', time: '1 day ago', icon: '💬' },
    { action: 'Earned achievement', name: 'Week Streak Badge', time: '2 days ago', icon: '🏆' },
  ];

  const quickActions = [
    { title: 'Continue Learning', icon: BookOpen, color: 'from-blue-500 to-blue-600', action: () => onNavigate('tutorials') },
    { title: 'Join Community', icon: MessageSquare, color: 'from-purple-500 to-purple-600', action: () => onNavigate('community') },
    { title: 'View Achievements', icon: Award, color: 'from-pink-500 to-pink-600', action: () => onNavigate('profile') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl text-gray-900 dark:text-white">
              Welcome back, {userName}
            </h1>
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl"
            >
              👋
            </motion.span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ready to break down communication barriers today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full blur-3xl -mr-16 -mt-16 opacity-50`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-4xl mb-2 text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Start Interpreting Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 rounded-3xl p-8 shadow-2xl text-white group cursor-pointer"
            onClick={() => onNavigate('interpreter')}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/30 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur group-hover:bg-white/30 transition-colors">
                  <Video className="w-8 h-8" />
                </div>
                <h2 className="text-2xl">Start Interpreting</h2>
              </div>
              <p className="mb-6 text-white/90 leading-relaxed">
                Begin real-time sign language interpretation using your camera. Connect and communicate seamlessly.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all hover:gap-3 shadow-lg">
                Launch Interpreter
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Tutorials Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl text-white group cursor-pointer"
            onClick={() => onNavigate('tutorials')}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-600/30 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur group-hover:bg-white/30 transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl">Continue Learning</h2>
              </div>
              <p className="mb-6 text-white/90 leading-relaxed">
                Master Indian Sign Language with our interactive tutorials. Pick up where you left off.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-all hover:gap-3 shadow-lg">
                Browse Tutorials
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-2xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  onClick={action.action}
                  className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">{action.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{activity.action}:</span> {activity.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
