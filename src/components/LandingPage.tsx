import { ArrowRight, ChevronDown, HelpCircle, Sparkles, Zap, Users } from 'lucide-react';
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

interface LandingPageProps {
  onNavigate: (page: any) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function LandingPage({ onNavigate, darkMode = false, toggleDarkMode }: LandingPageProps) {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <PublicNav onNavigate={onNavigate} currentPage="landing" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-purple-900/30 overflow-hidden">
        {/* Animated Background */}
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
            className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"
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
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          />
          
          {/* Floating Hand Signs */}
          <motion.div
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 text-6xl opacity-10 dark:opacity-5"
          >
            👋
          </motion.div>
          <motion.div
            animate={{
              y: [20, -20, 20],
              x: [10, -10, 10],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-32 text-6xl opacity-10 dark:opacity-5"
          >
            🤟
          </motion.div>
          <motion.div
            animate={{
              y: [-15, 15, -15],
              x: [15, -15, 15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-1/3 text-6xl opacity-10 dark:opacity-5"
          >
            ✌️
          </motion.div>
          <motion.div
            animate={{
              y: [10, -10, 10],
              x: [-15, 15, -15],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-40 right-20 text-6xl opacity-10 dark:opacity-5"
          >
            👍
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl p-3 ring-4 ring-purple-100 dark:ring-purple-900/30">
              <img src={logo} alt="Vaani Setu Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent text-5xl md:text-7xl animate-gradient">
              Vaani Setu
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-700 dark:text-gray-200 mb-6 tracking-tight"
          >
            Breaking Communication Barriers with AI
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the power of AI-driven sign language interpretation. 
            Connect seamlessly with real-time translation from sign language to text and speech.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Users</span>
                <p className="text-gray-900 dark:text-white">12,483+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Accuracy</span>
                <p className="text-gray-900 dark:text-white">95%+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Speed</span>
                <p className="text-gray-900 dark:text-white">Real-time</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={() => onNavigate('signup')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              Login
            </button>
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
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="text-sm">Scroll to Learn More</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" className="py-24 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
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
      <div className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
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

            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-8">
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

      {/* FAQ Section */}
      <div className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
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
              <AccordionItem value="item-1" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">What is Vaani Setu?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  Vaani Setu is an AI-powered platform that interprets sign language in real-time through your camera and converts it into text and speech. It's designed to bridge communication gaps between hearing-impaired and non-impaired individuals, making conversations seamless and inclusive.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">How accurate is the sign language detection?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  Our AI models are trained on extensive datasets and achieve high accuracy rates for Indian Sign Language (ISL). Accuracy improves with good lighting, clear hand positioning, and moderate signing speed. We continuously update our models to enhance performance across different conditions and regional variations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">Is my camera data stored or recorded?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  No. Your privacy is our top priority. All video processing happens locally on your device in real-time. We do not record, store, or transmit your camera feed to any external servers. Your data stays with you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">Which sign languages are supported?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  Currently, Vaani Setu supports Indian Sign Language (ISL) with plans to expand to American Sign Language (ASL), British Sign Language (BSL), and regional ISL variations in the near future. We're actively working to make the platform more inclusive and accessible globally.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">Do I need special equipment to use Vaani Setu?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  No special equipment is required! Vaani Setu works with any standard webcam or device camera. For best results, we recommend using a device with a good quality camera in a well-lit environment. The platform is accessible on desktop, tablet, and mobile devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">Can I learn sign language through Vaani Setu?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  Absolutely! Vaani Setu includes comprehensive interactive tutorials covering beginner to advanced levels. Learn at your own pace with video lessons, practice exercises, and a supportive community forum. Our tutorials cover greetings, daily conversations, emergency signs, numbers, and much more.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">Is Vaani Setu free to use?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  Yes! Vaani Setu's core features including real-time sign language interpretation, basic tutorials, and community access are completely free. We believe in making communication accessible to everyone. Premium features and advanced courses may be available in the future.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-white dark:bg-gray-800 rounded-2xl px-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-gray-900 dark:text-white">How can I get support or report issues?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-5">
                  We're here to help! You can reach our support team via email at support@vaanisetu.com or call our toll-free helpline at +91 1800-123-456 (Mon-Fri, 9 AM - 6 PM IST). You can also visit our community forum to connect with other users and get answers to common questions.
                </AccordionContent>
              </AccordionItem>
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
    </div>
  );
}