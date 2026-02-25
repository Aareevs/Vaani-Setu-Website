import { useState } from 'react';
import { Instagram, Linkedin, Mail, Phone, HelpCircle, FileText, Shield, X as CloseIcon } from 'lucide-react';
import logo from 'figma:asset/bd00bd3a9f16cf036d031e12858b5516cf661d7f.png';

// Twitter/X Logo SVG Component
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface FooterProps {
  darkMode: boolean;
  onNavigate: (page: any) => void;
  isLoggedIn?: boolean;
}

export default function Footer({ darkMode, onNavigate, isLoggedIn = false }: FooterProps) {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  return (
    <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
          {/* Brand Section - Left Side (Larger) */}
          <div className="w-full md:flex-1 md:max-w-sm md:pr-8">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Vaani Setu Logo" className="w-12 h-12 object-contain" />
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-bold text-lg">Vaani Setu</span>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Breaking Barriers with AI</p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered sign language interpretation, creating seamless communication between hearing and deaf communities.
            </p>
            <p className={`text-sm italic ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              "Breaking Communication Barriers with AI"
            </p>
          </div>

          {/* Right Side - All Link Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Quick Links Column */}
            <div>
              <h3 className={`mb-6 font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Quick Links</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('about')}
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  About
                </button>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  Support
                </button>
                {isLoggedIn && (
                  <>
                    <button
                      onClick={() => onNavigate('interpreter')}
                      className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                    >
                      Interpreter
                    </button>
                    <button
                      onClick={() => onNavigate('community')}
                      className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                    >
                      Community
                    </button>
                    <button
                      onClick={() => onNavigate('tutorials')}
                      className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                    >
                      Tutorials
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Features Column (Logged In Only) */}
            {isLoggedIn && (
              <div>
                <h3 className={`mb-6 font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Features</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('pricing')}
                    className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => onNavigate('settings')}
                    className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setShowSupportModal(true)}
                    className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            )}

            {/* Connect Column */}
            <div>
              <h3 className={`mb-6 font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Connect</h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/vaani_setu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  Follow Us
                </a>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  Get Help
                </button>
                <a
                  href="mailto:info.vaanisetu@gmail.com"
                  className={`block text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  Email Us
                </a>
              </div>
              {/* Social Icons */}
              <div className="flex gap-3 mt-6">
                <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-black' : 'bg-gray-100 hover:bg-black'} transition-colors group`}>
                  <TwitterXIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'}`} />
                </a>
                <a href="https://www.instagram.com/vaani_setu/" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-pink-600' : 'bg-gray-100 hover:bg-pink-600'} transition-colors group`}>
                  <Instagram className={`w-5 h-5 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'}`} />
                </a>
                <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-blue-700' : 'bg-gray-100 hover:bg-blue-700'} transition-colors group`}>
                  <Linkedin className={`w-5 h-5 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'}`} />
                </a>
                <a href="mailto:info.vaanisetu@gmail.com" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-purple-600' : 'bg-gray-100 hover:bg-purple-600'} transition-colors group`}>
                  <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'}`} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-8 flex flex-col sm:flex-row justify-between items-center gap-4`}>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2025 Vaani Setu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSupportModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Support Center</h2>
              </div>
              <button 
                onClick={() => setShowSupportModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <CloseIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className={`text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className={`w-5 h-5 mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Support</p>
                      <a href="mailto:info.vaanisetu@gmail.com" className="text-blue-600 hover:text-blue-700">
                        info.vaanisetu@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className={`w-5 h-5 mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Support</p>
                      <a href="tel:+911800123456" className="text-blue-600 hover:text-blue-700">
                        +91 1800-123-456 (Toll Free)
                      </a>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mon-Fri: 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className={`text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How do I start using the sign language interpreter?</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Navigate to the Interpreter page from your dashboard, click "Start Camera", and allow camera access. Position yourself in front of the camera and start signing!
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What sign languages are supported?</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
Currently, we support American Sign Language (ASL) with plans to add BSL and other variations soon.
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Is my camera data stored or recorded?</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No. All processing happens in real-time on your device. We do not store, record, or transmit your camera feed to any servers.
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How can I improve detection accuracy?</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ensure good lighting, keep your hands clearly visible in the frame, and perform signs at a moderate pace. Check our Tutorials page for best practices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div>
                <h3 className={`text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Additional Resources</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setShowSupportModal(false); onNavigate('tutorials'); }}
                    className={`w-full text-left p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                  >
                    <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>📚 Tutorials & Learning Resources</span>
                  </button>
                  <button 
                    onClick={() => { setShowSupportModal(false); onNavigate('community'); }}
                    className={`w-full text-left p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                  >
                    <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>💬 Community Forum</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowTermsModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h2>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <CloseIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Terms of Service */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Acceptable Use</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Use the platform for legitimate communication and learning purposes</li>
                      <li>Respect other users and maintain a supportive community</li>
                      <li>Do not use the service for illegal activities or harassment</li>
                      <li>Do not attempt to reverse engineer or misuse our AI models</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>User Responsibilities</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Provide accurate information when creating your account</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Report any security vulnerabilities or inappropriate content</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Service Limitations</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>AI interpretation accuracy may vary based on conditions</li>
                      <li>Service availability is not guaranteed 100% of the time</li>
                      <li>We reserve the right to modify or discontinue features</li>
                      <li>Critical communications should be verified through multiple channels</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Intellectual Property</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>All platform content and technology are protected by copyright</li>
                      <li>User-generated content remains the property of users</li>
                      <li>Respect intellectual property rights of others</li>
                      <li>Do not reproduce or distribute platform content without permission</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Termination</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>We may suspend or terminate accounts for violations</li>
                      <li>Users may terminate their account at any time</li>
                      <li>Upon termination, user data will be deleted per our privacy policy</li>
                      <li>Certain provisions survive termination</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Limitation of Liability</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Vaani Setu is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from the use of our service.
                    </p>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Governing Law</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      These terms are governed by the laws of India. Any disputes will be resolved in the courts of New Delhi, India.
                    </p>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Updates to Terms</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      We may update these terms periodically. Continued use of Vaani Setu constitutes acceptance of updated terms. Major changes will be communicated via email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: November 4, 2024
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPrivacyModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy & Guidelines</h2>
              </div>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <CloseIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Privacy Policy */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Information We Collect</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      We collect minimal information necessary to provide our services:
                    </p>
                    <ul className={`list-disc list-inside mt-2 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Account information (name, email address)</li>
                      <li>Usage statistics and preferences</li>
                      <li>Device information for optimization</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Camera & Video Data</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Your privacy is our priority.</strong> All video processing happens locally on your device in real-time. We do not:
                    </p>
                    <ul className={`list-disc list-inside mt-2 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Record or store camera feeds</li>
                      <li>Transmit video data to external servers</li>
                      <li>Share your video with third parties</li>
                      <li>Use your camera data for any purpose other than real-time sign language interpretation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Data Security</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      We employ industry-standard security measures including encryption, secure authentication, and regular security audits to protect your data.
                    </p>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Your Rights</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      You have the right to access, modify, or delete your personal data at any time through your profile settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules & Regulations */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service & Community Guidelines</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Acceptable Use</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Use the platform for legitimate communication and learning purposes</li>
                      <li>Respect other users and maintain a supportive community</li>
                      <li>Do not use the service for illegal activities or harassment</li>
                      <li>Do not attempt to reverse engineer or misuse our AI models</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Community Guidelines</h4>
                    <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>Be respectful and inclusive in all interactions</li>
                      <li>Share knowledge and help others learn</li>
                      <li>Report inappropriate content or behavior</li>
                      <li>Respect intellectual property and give credit where due</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Disclaimer</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      While we strive for high accuracy, AI-powered sign language interpretation is not perfect. Users should verify critical communications through multiple channels.
                    </p>
                  </div>

                  <div>
                    <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Updates to Policies</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      We may update these policies periodically. Continued use of Vaani Setu constitutes acceptance of updated terms. Major changes will be communicated via email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: November 4, 2024
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowTermsModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h2>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <CloseIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Acceptable Use</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Use the platform for legitimate communication and learning purposes</li>
                    <li>Respect other users and maintain a supportive community</li>
                    <li>Do not use the service for illegal activities or harassment</li>
                    <li>Do not attempt to reverse engineer or misuse our AI models</li>
                  </ul>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>User Responsibilities</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Provide accurate information when creating your account</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Report any security vulnerabilities or inappropriate content</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Service Limitations</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>AI interpretation accuracy may vary based on conditions</li>
                    <li>Service availability is not guaranteed 100% of the time</li>
                    <li>We reserve the right to modify or discontinue features</li>
                    <li>Critical communications should be verified through multiple channels</li>
                  </ul>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Intellectual Property</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>All platform content and technology are protected by copyright</li>
                    <li>User-generated content remains the property of users</li>
                    <li>Respect intellectual property rights of others</li>
                    <li>Do not reproduce or distribute platform content without permission</li>
                  </ul>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Termination</h4>
                  <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>We may suspend or terminate accounts for violations</li>
                    <li>Users may terminate their account at any time</li>
                    <li>Upon termination, user data will be deleted per our privacy policy</li>
                    <li>Certain provisions survive termination</li>
                  </ul>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Limitation of Liability</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Vaani Setu is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from the use of our service.
                  </p>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Governing Law</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    These terms are governed by the laws of India. Any disputes will be resolved in the courts of New Delhi, India.
                  </p>
                </div>

                <div>
                  <h4 className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Updates to Terms</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    We may update these terms periodically. Continued use of Vaani Setu constitutes acceptance of updated terms. Major changes will be communicated via email.
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: November 4, 2024
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}