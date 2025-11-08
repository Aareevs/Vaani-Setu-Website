import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, AlertCircle, Image as ImageIcon, Mic, MicOff, Square, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { containsProfanity, getProfanityWarningMessage } from '../utils/profanityFilter';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getGeminiResponse, testGeminiConnection } from '../utils/gemini';
import { voiceRecorder } from '../utils/voiceRecorder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';



interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  imageUrl?: string;
  signWord?: string;
}

interface ChatbotProps {
  darkMode: boolean;
}

export default function Chatbot({ darkMode }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Vaani, your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profanityError, setProfanityError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Network status checking
  useEffect(() => {
    const checkNetworkStatus = async () => {
      setNetworkStatus('checking');
      try {
        // Test Gemini API connection
        const response = await testGeminiConnection();
        if (response && response.includes('Test successful')) {
          setNetworkStatus('online');
        } else {
          setNetworkStatus('error');
        }
      } catch (error) {
        console.error('Network check failed:', error);
        setNetworkStatus('error');
      }
    };

    checkNetworkStatus();
    // Check network status every 30 seconds
    const interval = setInterval(checkNetworkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleVoiceRecording = useCallback(() => {
    if (isRecording) {
      // Stop recording
      voiceRecorder.stopRecording();
      setIsRecording(false);
    } else {
      // Start recording
      setVoiceError(null);
      setIsRecording(true);
      
      voiceRecorder.startRecording(
        (transcript) => {
          setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsRecording(false);
        },
        (error) => {
          setVoiceError(error);
          setIsRecording(false);
          setTimeout(() => setVoiceError(null), 5000);
        }
      );
    }
  }, [isRecording]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    if (containsProfanity(inputMessage)) {
      setProfanityError(getProfanityWarningMessage());
      setTimeout(() => setProfanityError(null), 5000);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setProfanityError(null);

    try {
      const botResponseText = await getGeminiResponse(inputMessage);
      
      if (!botResponseText) {
        throw new Error('No response received from AI. Please check your internet connection and API key.');
      }
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please check your internet connection and try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:shadow-blue-500/50 transition-all relative"
          >
            <MessageCircle className="w-7 h-7" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`w-[380px] h-[600px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg">Vaani Assistant</h3>
                    <div className="flex items-center gap-2">
                      {networkStatus === 'checking' && (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <p className="text-xs text-white/90">Checking connection...</p>
                        </>
                      )}
                      {networkStatus === 'online' && (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <p className="text-xs text-white/90">Online & Ready</p>
                        </>
                      )}
                      {networkStatus === 'error' && (
                        <>
                          <WifiOff className="w-3 h-3 text-red-400" />
                          <p className="text-xs text-red-300">Connection issue</p>
                        </>
                      )}
                    </div>
                  </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={async () => {
                    setNetworkStatus('checking');
                    try {
                      const response = await testGeminiConnection();
                      if (response && response.includes('Test successful')) {
                        setNetworkStatus('online');
                      } else {
                        setNetworkStatus('error');
                      }
                    } catch (error) {
                      console.error('Manual connection test failed:', error);
                      setNetworkStatus('error');
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  title="Test connection"
                >
                  <Wifi className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                      message.isBot
                        ? darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        : 'bg-gradient-to-r from-blue-600 to-purple-500 text-white'
                    }`}
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vaani</span>
                      </div>
                    )}
                    {message.imageUrl && message.signWord && (
                      <div className="mb-3">
                        <div className={`relative rounded-xl overflow-hidden p-2 ${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                          <ImageWithFallback
                            src={message.imageUrl}
                            alt={`ISL sign for ${message.signWord}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg flex items-center gap-1 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'}`}>
                            <ImageIcon className={`w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ISL Sign</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text.replace(/[*_`#\[\]()]/g, '')}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? (darkMode ? 'text-gray-500' : 'text-gray-400') : 'text-white/70'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl px-4 py-3 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center gap-2">
                      <Bot className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay }}
                            className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <AnimatePresence>
                {profanityError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-3 p-3 border rounded-xl flex items-start gap-2 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-400'}`}
                  >
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{profanityError}</p>
                  </motion.div>
                )}
                {voiceError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-3 p-3 border rounded-xl flex items-start gap-2 ${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-100 border-orange-400'}`}
                  >
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <p className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>{voiceError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                />
                <button
                  type="button"
                  onClick={handleVoiceRecording}
                  disabled={isTyping}
                  className={`px-3 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:shadow-lg'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  <AnimatePresence mode="wait">
                    {isRecording ? (
                      <motion.div
                        key="recording"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="relative"
                      >
                        <Square className="w-5 h-5" />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 bg-red-400 rounded-full opacity-50"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="not-recording"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Mic className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
