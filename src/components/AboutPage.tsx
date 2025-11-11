// React import not required with modern JSX transform
import { Heart, Target, Users, Award, Linkedin, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from './PublicNav';
import aareevImg from '../assets/27666179a65751a5bf9ce3ffaf46c9fa19b1404f.png';
import shivanshImg from '../assets/a637af40a1a41e19b730027c5387e41be72236e3.png';
import adityaImg from '../assets/e3d0fbae616eafb81d792fa8e20a687cb8982468.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  onNavigate: (page: any) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  isLoggedIn?: boolean;
}

export default function AboutPage({ onNavigate, darkMode = false, toggleDarkMode, isLoggedIn = false }: AboutPageProps) {
  const team = [
    { name: 'Shivansh Ojha', role: 'Marketing Lead & Pitcher', avatar: shivanshImg, bio: 'Leading marketing strategy and business pitches', linkedin: 'https://www.linkedin.com/in/shivansh-ojha-87915b235/' },
    { name: 'Aditya Bahuguna', role: 'UI/UX Designer & Front End Developer', avatar: adityaImg, bio: 'Creating inclusive and accessible experiences', linkedin: 'https://www.linkedin.com/in/aditya-bahuguna-/' },
    { name: 'Aareev Srinivasan', role: 'Full Stack Developer & Graphics Head', avatar: aareevImg, bio: 'Building scalable applications and visual design', linkedin: 'https://www.linkedin.com/in/aareev-srinivasan-746851372/' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'Creating a world where everyone can communicate freely',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI to solve real-world problems',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building together with users and advocates',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to accuracy and reliability',
      color: 'from-orange-500 to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation - Only show PublicNav when not logged in */}
      {!isLoggedIn && (
        <PublicNav onNavigate={onNavigate} currentPage="about" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white py-20 px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl mb-6"
          >
            About Vaani Setu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Breaking Communication Barriers with AI - Empowering seamless communication 
            between hearing and hearing-impaired communities through innovative technology.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900 dark:text-white">Our Translation Process</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-3 text-gray-900 dark:text-white">Large dataset of sign language</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Vaani Setu uses an extensive library of qualified Indian Sign Language (ISL) videos and datasets to maximize translation accuracy. Our AI is trained on thousands of signs across different contexts, regional variations, and signing styles.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎥</span>
                  </div>
                  <h3 className="text-lg text-gray-900 dark:text-white">Video selection</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg text-gray-900 dark:text-white">AI-powered blending</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-lg text-gray-900 dark:text-white">Integration</h3>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1573497161249-42447f9f6706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwdmlkZW8lMjBjYWxsJTIwY29tbXVuaWNhdGlvbnxlbnwxfHx8fDE3NjI0MTAxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Person communicating"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Verified</span>
                </div>

                <div className="absolute -top-6 -left-6 flex gap-2">
                  <div className="w-24 h-32 rounded-2xl bg-white dark:bg-gray-700 shadow-xl border-4 border-white dark:border-gray-600 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1573497161161-a0ea343ae7d3?w=300"
                      alt="User 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute top-32 -right-6">
                  <div className="w-20 h-28 rounded-2xl bg-white dark:bg-gray-700 shadow-xl border-4 border-white dark:border-gray-600 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300"
                      alt="User 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Detection Accuracy</p>
                      <p className="text-gray-900 dark:text-white">95%+ ISL Recognition</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Processing Speed</p>
                      <p className="text-gray-900 dark:text-white">Real-time (0.3s latency)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signs Per Minute</p>
                      <p className="text-gray-900 dark:text-white">24 signs translated</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900 dark:text-white">Our Mission</h2>
          
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl text-white mb-6">
                    Empowering India with real-time AI-powered sign language translation to bridge communication gaps.
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Vaani Setu is built by a passionate team of <span className="text-white">Indian developers, designers, and accessibility advocates</span> committed to making communication barrier-free for India's deaf and hard-of-hearing community. We specialize in Indian Sign Language (ISL) interpretation, helping millions access education, healthcare, employment, and public services with dignity and independence.
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('about')}
                  className="mt-6 px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors w-fit"
                >
                  More about us
                </button>
              </div>

              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="rounded-3xl overflow-hidden shadow-xl h-64 md:h-80">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1653379673150-4fb5c7f9c758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNpZ24lMjBsYW5ndWFnZSUyMGNvbW11bmljYXRpb258ZW58MXx8fHwxNzYyNDA2NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Sign language communication in India"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="bg-gradient-to-br from-green-300 to-green-200 dark:from-green-400 dark:to-green-300 rounded-3xl p-6 shadow-xl relative">
                  <div className="absolute top-4 right-4">
                    <Plane className="w-5 h-5 text-gray-700 rotate-45" />
                  </div>
                  <h4 className="text-3xl md:text-4xl text-gray-900 mb-4">
                    Over<br />18 Million
                  </h4>
                  <p className="text-sm text-gray-800">
                    People with hearing disabilities in India need accessible communication solutions
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-300 dark:to-pink-300 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
                <div className="mb-6">
                  <h4 className="text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-4">
                    63 Million
                  </h4>
                  <p className="text-lg text-gray-800">
                    Deaf and hard-of-hearing individuals across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900 dark:text-white">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900 dark:text-white">Meet the Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-blue-400 shadow-lg">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">Connect on LinkedIn</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are breaking communication barriers every day
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Create Free Account
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer is rendered centrally by App to avoid duplicates */}
    </div>
  );
}