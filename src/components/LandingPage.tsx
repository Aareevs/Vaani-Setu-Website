import React from 'react';
import { ArrowRight, HelpCircle, Zap, Users, Star, X } from 'lucide-react';
import { motion } from 'motion/react';
import PublicNav from './PublicNav';
import Footer from './Footer';
import logo from 'figma:asset/bd00bd3a9f16cf036d031e12858b5516cf661d7f.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import EmojiPicker from './EmojiPicker';

interface LandingPageProps {
  onNavigate: (page: any) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function LandingPage({ onNavigate, darkMode = false, toggleDarkMode }: LandingPageProps) {
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [reviewForm, setReviewForm] = React.useState({
    name: '',
    rating: 5,
    review: '',
    avatar: '👤'
  });
  const [hoverRating, setHoverRating] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const faqSection = document.getElementById('faq-section');
    faqSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'What is Vaani Setu?',
      a: "Vaani Setu is an AI-powered platform that interprets sign language in real-time through your camera and converts it into text and speech. It's designed to bridge communication gaps between hearing-impaired and non-impaired individuals, making conversations seamless and inclusive."
    },
    {
      q: 'How accurate is the sign language detection?',
      a: 'Our AI models are trained on extensive datasets and achieve high accuracy rates for American Sign Language (ASL). Accuracy improves with good lighting, clear hand positioning, and moderate signing speed. We continuously update our models to enhance performance across different conditions and regional variations.'
    },
    {
      q: 'Is my camera data stored or recorded?',
      a: 'No. Your privacy is our top priority. All video processing happens locally on your device in real-time. We do not record, store, or transmit your camera feed to any external servers. Your data stays with you.'
    },
    {
      q: 'Which sign languages are supported?',
      a: 'Currently, Vaani Setu supports American Sign Language (ASL) with plans to expand to British Sign Language (BSL) and other sign languages in the near future. We\'re actively working to make the platform more inclusive and accessible globally.'
    },
    {
      q: 'Do I need special equipment to use Vaani Setu?',
      a: 'No special equipment is required! Vaani Setu works with any standard webcam or device camera. For best results, we recommend using a device with a good quality camera in a well-lit environment. The platform is accessible on desktop, tablet, and mobile devices.'
    },
    {
      q: 'Can I learn sign language through Vaani Setu?',
      a: 'Absolutely! Vaani Setu includes comprehensive interactive tutorials covering beginner to advanced levels. Learn at your own pace with video lessons, practice exercises, and a supportive community forum. Our tutorials cover greetings, daily conversations, emergency signs, numbers, and much more.'
    },
    {
      q: 'Is Vaani Setu free to use?',
      a: "Yes! Vaani Setu's core features including real-time sign language interpretation, basic tutorials, and community access are completely free. We believe in making communication accessible to everyone. Premium features and advanced courses may be available in the future."
    },
    {
      q: 'How can I get support or report issues?',
      a: "We're here to help! You can reach our support team via email at support@vaanisetu.com or call our toll-free helpline at +91 1800-123-456 (Mon-Fri, 9 AM - 6 PM IST). You can also visit our community forum to connect with other users and get answers to common questions."
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <PublicNav onNavigate={onNavigate} currentPage="landing" darkMode={darkMode} toggleDarkMode={toggleDarkMode} onSearch={handleSearch} />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-purple-900/30 overflow-hidden">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        </div>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced gradient orbs with more sophisticated animation */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-60 -right-60 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-purple-400/30 via-purple-300/20 to-transparent dark:from-purple-600/20 dark:via-purple-500/10 dark:to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.3, 1, 1.3],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-60 -left-60 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-blue-400/30 via-blue-300/20 to-transparent dark:from-blue-600/20 dark:via-blue-500/10 dark:to-transparent rounded-full blur-3xl"
          />
          
          {/* Additional subtle floating elements */}
          <motion.div
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [30, -30, 30],
              x: [20, -20, 20],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-blue-200/20 dark:from-purple-400/10 dark:to-blue-400/10 rounded-full blur-2xl"
          />
          
          {/* Floating particles for added depth */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [Math.random() * -50, Math.random() * 50, Math.random() * -50],
                x: [Math.random() * -30, Math.random() * 30, Math.random() * -30],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              className={`absolute w-2 h-2 bg-gradient-to-br from-blue-400/40 to-purple-400/40 dark:from-blue-300/30 dark:to-purple-300/30 rounded-full blur-sm ${
                i % 2 === 0 ? 'top-1/3 left-1/3' : 'top-2/3 right-1/3'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-12 md:py-20">
          {/* Glass morphism background for content */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 backdrop-blur-md rounded-3xl -z-10" />
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl p-3 ring-4 ring-purple-100 dark:ring-purple-900/30 backdrop-blur-sm"
            >
              <img src={logo} alt="Vaani Setu Logo" className="w-full h-full object-contain" />
            </motion.div>
            <motion.h1 
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent text-3xl sm:text-5xl md:text-7xl font-bold"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Vaani Setu
            </motion.h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-4xl text-gray-700 dark:text-gray-200 mb-6 font-light tracking-wide"
          >
            Breaking Communication Barriers with AI
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experience the power of AI-driven sign language interpretation. 
            Connect seamlessly with real-time translation from sign language to text and speech.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/60 dark:bg-purple-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-white font-medium">Active Users</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white">12,483+</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/60 dark:bg-purple-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-white font-medium">Accuracy Rate</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white">95%+</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/60 dark:bg-purple-700 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-white font-medium">Processing Speed</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white">Real-time</p>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.button
              onClick={() => onNavigate('signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
            >
              <span className="relative z-10 font-semibold text-lg">Get Started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </motion.button>
            <motion.button
              onClick={() => onNavigate('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 font-semibold text-lg"
            >
              Login
            </motion.button>
          </motion.div>

          {/* Learn More Button */}
          <motion.button
            onClick={scrollToAbout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors group"
            >
              <span className="text-sm font-medium">Discover More</span>
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 dark:bg-purple-400/40 rounded-full blur-md group-hover:bg-purple-600/40 dark:group-hover:bg-purple-300/50 transition-all" />
                <div className="absolute inset-0 border border-purple-400/30 dark:border-purple-300/40 rounded-full group-hover:border-purple-600/40 dark:group-hover:border-purple-200/50 transition-all" />
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-6 h-10 border-2 border-purple-600 dark:border-purple-300 rounded-full flex justify-center group-hover:border-purple-800 dark:group-hover:border-purple-200 transition-colors shadow-sm relative bg-gray-100 dark:bg-gray-700/50"
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 h-3 bg-purple-600 dark:bg-purple-300 rounded-full mt-2 group-hover:bg-purple-800 dark:group-hover:bg-purple-200 transition-colors shadow-sm"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" className="py-12 md:py-24 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Breaking Communication Barriers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Vaani Setu uses advanced AI technology to interpret sign language in real-time, 
              creating an inclusive environment where everyone can communicate effortlessly.
            </p>
          </motion.div>

          {/* How It Works */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📹</span>
                </div>
                <h3 className="text-xl mb-3 text-gray-800 dark:text-gray-100">Camera Detection</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI captures and analyzes hand gestures through your camera in real-time
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 dark:border-purple-800/30"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🧠</span>
                </div>
                <h3 className="text-xl mb-3 text-gray-800 dark:text-gray-100">AI Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced machine learning algorithms interpret gestures with high accuracy
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 dark:border-purple-800/30"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl mb-3 text-gray-800 dark:text-gray-100">Text & Speech Output</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instant conversion to text and natural-sounding speech for seamless communication
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Learn More About Our Mission
            </button>
          </motion.div>
        </div>
      </div>

      {/* Demo Video Section - NEW */}
      <div className="py-12 md:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                See It In Action
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Watch how Vaani Setu translates sign language in real-time
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-4 md:p-8">
              {/* Demo Interface Mockup */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Demo Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-white text-sm">Vaani Setu - Sign Language Interpreter</span>
                  <div className="w-20"></div>
                </div>

                {/* Demo Content */}
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Video Feed */}
                  <div className="relative">
                    <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1749353709979-7f169131254e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduJTIwbGFuZ3VhZ2UlMjBjb252ZXJzYXRpb24lMjBjb21tdW5pY2F0aW9ufGVufDF8fHx8MTc2MjQwOTQ0OXww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Person using sign language"
                        className="w-full h-full object-cover"
                      />
                      {/* Live indicator */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                      {/* Hand tracking overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 300">
                          {/* Hand tracking points */}
                          <circle cx="180" cy="120" r="4" fill="#00FF00" opacity="0.8" />
                          <circle cx="195" cy="100" r="4" fill="#00FF00" opacity="0.8" />
                          <circle cx="210" cy="85" r="4" fill="#00FF00" opacity="0.8" />
                          <circle cx="200" cy="130" r="4" fill="#00FF00" opacity="0.8" />
                          <circle cx="215" cy="115" r="4" fill="#00FF00" opacity="0.8" />
                          {/* Connecting lines */}
                          <line x1="180" y1="120" x2="195" y2="100" stroke="#00FF00" strokeWidth="2" opacity="0.6" />
                          <line x1="195" y1="100" x2="210" y2="85" stroke="#00FF00" strokeWidth="2" opacity="0.6" />
                          <line x1="180" y1="120" x2="200" y2="130" stroke="#00FF00" strokeWidth="2" opacity="0.6" />
                          <line x1="200" y1="130" x2="215" y2="115" stroke="#00FF00" strokeWidth="2" opacity="0.6" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Camera Active</span>
                      </div>
                      <span>•</span>
                      <span>Hand Detected</span>
                    </div>
                  </div>

                  {/* Translation Output */}
                  <div className="flex flex-col gap-4">
                    {/* Detected Sign */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Detected Sign</span>
                      </div>
                      <p className="text-2xl text-gray-900 dark:text-white">Hello</p>
                    </div>

                    {/* Real-time Text */}
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Live Translation</span>
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                          Copy
                        </button>
                      </div>
                      <div className="space-y-2 text-gray-900 dark:text-white">
                        <p>Hello, how are you today?</p>
                        <p className="text-gray-500 dark:text-gray-400">I am doing great, thank you!</p>
                        <p>Nice to meet you<span className="animate-pulse">|</span></p>
                      </div>
                    </div>

                    {/* Audio Output Button */}
                    <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all group">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      <span>Play Audio Output</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </button>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <div className="text-lg text-blue-600 dark:text-blue-400">98%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg text-purple-600 dark:text-purple-400">0.3s</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Latency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg text-green-600 dark:text-green-400">24</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Signs/min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Try It Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                >
                  <span className="text-lg">Try It Yourself</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* User Testimonials Section */}
      <div className="py-12 md:py-24 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who are breaking communication barriers with Vaani Setu
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                  👩‍🎓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Meera Singh</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Vaani Setu has been a game-changer for me! As a teacher with hearing-impaired students, this platform has made communication so much easier. The AI detection is incredibly accurate."
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 28, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-600 dark:text-blue-400">👍</span>
                  24 found helpful
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  👨‍💻
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Karan Mehta</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "The interface is intuitive and the tutorials are very well structured. I learned basic ASL in just 2 weeks. Highly recommend for anyone wanting to learn sign language!"
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 25, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-purple-600 dark:text-purple-400">👍</span>
                  18 found helpful
                </span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl">
                  👩‍⚕️
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sanya Kapoor</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Great platform overall. The real-time translation is impressive. Would love to see more regional sign variations added. Still, an excellent tool for bridging communication gaps."
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 22, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-green-600 dark:text-green-400">👍</span>
                  15 found helpful
                </span>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                  🧑‍🔧
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Vikram Reddy</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "As someone who works with the deaf community, I can say this is one of the best AI-powered sign language tools out there. The accuracy and speed are remarkable!"
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 20, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-600 dark:text-orange-400">👍</span>
                  31 found helpful
                </span>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-2xl border border-pink-200 dark:border-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                  👩‍🎨
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Anjali Verma</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "My daughter is deaf and Vaani Setu has helped our entire family learn ASL together. The community support is amazing. Thank you for creating such an inclusive platform!"
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 18, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-pink-600 dark:text-pink-400">👍</span>
                  42 found helpful
                </span>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Rohit Sharma</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Very useful for my work as a special education teacher. The camera detection works well in most lighting conditions. A few minor bugs here and there, but overall fantastic!"
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Oct 15, 2024</span>
                <span className="flex items-center gap-1">
                  <span className="text-indigo-600 dark:text-indigo-400">👍</span>
                  12 found helpful
                </span>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Write a Review
            </button>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq-section" className="py-12 md:py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent text-center">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about Vaani Setu
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((item, idx) => (
                <AccordionItem key={item.q} value={`item-${idx + 1}`} className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="text-gray-900 dark:text-white">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Still have questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">Still have questions?</p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} darkMode={darkMode} />

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Write a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{reviewForm.avatar}</div>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose Emoji
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="mt-3">
                    <EmojiPicker
                      onEmojiSelect={(emoji) => {
                        setReviewForm({...reviewForm, avatar: emoji});
                        setShowEmojiPicker(false);
                      }}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  </div>
                )}
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || reviewForm.rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                  placeholder="Share your experience with Vaani Setu..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would typically submit the review to your backend
                    alert('Thank you for your review! It will be reviewed and posted soon.');
                    setShowReviewModal(false);
                    // Reset form
                    setReviewForm({ name: '', rating: 5, review: '', avatar: '👤' });
                  }}
                  disabled={!reviewForm.name || !reviewForm.review}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}