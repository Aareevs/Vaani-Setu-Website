import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Volume2, VolumeX, AlertCircle, CheckCircle, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InterpreterPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [detectedSign, setDetectedSign] = useState('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sign language detection system
  const mockSigns = ['Hello', 'Thank you', 'Good morning', 'How are you?', 'Nice to meet you', 'Yes', 'No', 'Please', 'Help', 'Welcome', 'Goodbye', 'Sorry', 'Understand', 'Learn', 'Friend'];

  // Real-time hand detection from camera
  useEffect(() => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      let animationFrameId: number;
      let lastDetectionTime = 0;
      const detectionInterval = 2000; // Detect every 2 seconds

      const processFrame = () => {
        if (!video.paused && !video.ended && video.readyState >= 2) {
          const currentTime = Date.now();
          
          // Draw video frame to canvas for processing
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Perform hand detection (simplified motion detection)
          if (currentTime - lastDetectionTime > detectionInterval) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const hasMotion = detectHandMotion(imageData);
            
            if (hasMotion) {
              // Simulate AI detection with random sign
              const randomSign = mockSigns[Math.floor(Math.random() * mockSigns.length)];
              setDetectedSign(randomSign);
              setDetectionHistory(prev => [randomSign, ...prev].slice(0, 10));
              
              // Play audio if enabled
              if (audioEnabled) {
                const utterance = new SpeechSynthesisUtterance(randomSign);
                utterance.rate = 0.9;
                speechSynthesis.speak(utterance);
              }
              
              lastDetectionTime = currentTime;
            }
          }
        }
        
        animationFrameId = requestAnimationFrame(processFrame);
      };

      // Start processing after video is ready
      const startProcessing = () => {
        if (video.readyState >= 2) {
          processFrame();
        } else {
          video.addEventListener('loadeddata', processFrame, { once: true });
        }
      };

      startProcessing();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    } else if (demoMode) {
      // Demo mode with simulated detection
      const interval = setInterval(() => {
        const randomSign = mockSigns[Math.floor(Math.random() * mockSigns.length)];
        setDetectedSign(randomSign);
        setDetectionHistory(prev => [randomSign, ...prev].slice(0, 10));
        
        if (audioEnabled) {
          const utterance = new SpeechSynthesisUtterance(randomSign);
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(interval);
    }
  }, [cameraActive, demoMode, audioEnabled]);

  // Simple motion detection algorithm
  const detectHandMotion = (imageData: ImageData): boolean => {
    const { data, width, height } = imageData;
    let motionPixels = 0;
    const threshold = 100;
    const motionThreshold = width * height * 0.02; // 2% of pixels need to show motion

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect skin-tone colors (simplified)
      if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
        motionPixels++;
      }
    }

    return motionPixels > motionThreshold;
  };

  // Demo mode animation
  useEffect(() => {
    if (demoMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let frame = 0;
      const animate = () => {
        // Create animated gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${frame % 360}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${(frame + 60) % 360}, 70%, 40%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw demo text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DEMO MODE', canvas.width / 2, canvas.height / 2);
        
        // Draw animated hand silhouette
        const handY = canvas.height / 2 + 60 + Math.sin(frame * 0.05) * 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '80px Arial';
        ctx.fillText('👋', canvas.width / 2, handY);
        
        frame++;
        if (demoMode) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [demoMode]);

  const startCamera = async () => {
    setCameraError('');
    setIsLoading(true);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('UNSUPPORTED');
      }

      // Request camera access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraActive(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('PERMISSION_DENIED');
        // Don't log - this is expected when user denies permission
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('NO_CAMERA');
        // Don't log - this is expected when no camera is available
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('CAMERA_IN_USE');
        // Don't log - this is expected when camera is already in use
      } else if (error.message === 'UNSUPPORTED') {
        setCameraError('UNSUPPORTED');
        // Don't log - this is expected for unsupported browsers
      } else {
        // Only log truly unexpected errors
        console.warn('Unexpected camera error:', error);
        setCameraError('UNKNOWN');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setDemoMode(false);
    setDetectedSign('');
    setCameraError('');
  };

  const startDemoMode = () => {
    setCameraError('');
    setDemoMode(true);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const sampleGestures = [
    { name: 'Hello', emoji: '👋', description: 'Wave your hand' },
    { name: 'Thank You', emoji: '🙏', description: 'Touch chin and move forward' },
    { name: 'Yes', emoji: '👍', description: 'Thumbs up' },
    { name: 'No', emoji: '👎', description: 'Shake head' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Sign Language Interpreter</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time AI-powered sign language detection and translation</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Video Container */}
              <div className={`relative bg-gray-900 ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} className="hidden" />
                
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Detection Overlay */}
                    <AnimatePresence>
                      {detectedSign && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Detected: <strong>{detectedSign}</strong></span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bounding Box Simulation */}
                    <motion.div
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-green-400 rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.6)]"
                    >
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                    </motion.div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <button
                        onClick={stopCamera}
                        className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        <VideoOff className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                      </button>
                    </div>
                  </>
                ) : demoMode ? (
                  <>
                    <canvas
                      ref={canvasRef}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Detection Overlay */}
                    <AnimatePresence>
                      {detectedSign && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Detected: <strong>{detectedSign}</strong></span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Demo Mode Badge */}
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                      Demo Mode
                    </div>

                    {/* Bounding Box Simulation */}
                    <motion.div
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-purple-400 rounded-xl shadow-[0_0_20px_rgba(192,132,252,0.6)]"
                    >
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                    </motion.div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                      <button
                        onClick={stopCamera}
                        className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        <VideoOff className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                      {cameraError ? (
                        <>
                          {/* Error States */}
                          {cameraError === 'PERMISSION_DENIED' && (
                            <>
                              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl mb-3 text-white">Camera Permission Denied</h3>
                              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                To use sign language interpretation, we need access to your camera. Please enable camera permissions for this site.
                              </p>
                              <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
                                <p className="text-white text-sm mb-2">How to enable camera access:</p>
                                <ol className="text-gray-300 text-xs space-y-2 list-decimal list-inside">
                                  <li>Click the camera icon in your browser's address bar</li>
                                  <li>Select "Allow" or "Always allow" for camera access</li>
                                  <li>Refresh the page if needed</li>
                                  <li>Click "Try Again" below</li>
                                </ol>
                              </div>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={startCamera}
                                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Again
                                </button>
                                <button
                                  onClick={startDemoMode}
                                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Demo Mode
                                </button>
                              </div>
                            </>
                          )}
                          
                          {cameraError === 'NO_CAMERA' && (
                            <>
                              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl mb-3 text-white">No Camera Found</h3>
                              <p className="text-gray-300 mb-6">
                                No camera device was detected on your system. Please connect a camera and try again.
                              </p>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={startCamera}
                                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Again
                                </button>
                                <button
                                  onClick={startDemoMode}
                                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Demo Mode
                                </button>
                              </div>
                            </>
                          )}
                          
                          {cameraError === 'CAMERA_IN_USE' && (
                            <>
                              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl mb-3 text-white">Camera Already in Use</h3>
                              <p className="text-gray-300 mb-6">
                                Your camera is being used by another application. Please close other apps using the camera and try again.
                              </p>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={startCamera}
                                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Again
                                </button>
                                <button
                                  onClick={startDemoMode}
                                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Demo Mode
                                </button>
                              </div>
                            </>
                          )}
                          
                          {cameraError === 'UNSUPPORTED' && (
                            <>
                              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl mb-3 text-white">Browser Not Supported</h3>
                              <p className="text-gray-300 mb-6">
                                Your browser doesn't support camera access. Please use a modern browser like Chrome, Firefox, Safari, or Edge.
                              </p>
                              <button
                                onClick={startDemoMode}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all"
                              >
                                Try Demo Mode
                              </button>
                            </>
                          )}
                          
                          {cameraError === 'UNKNOWN' && (
                            <>
                              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-white" />
                              </div>
                              <h3 className="text-xl mb-3 text-white">Camera Error</h3>
                              <p className="text-gray-300 mb-6">
                                An unexpected error occurred while accessing the camera. Please try again or refresh the page.
                              </p>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={startCamera}
                                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Again
                                </button>
                                <button
                                  onClick={startDemoMode}
                                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all"
                                >
                                  Try Demo Mode
                                </button>
                              </div>
                            </>
                          )}
                        </>
                      ) : isLoading ? (
                        <>
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Video className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl mb-2 text-white">Initializing Camera...</h3>
                          <p className="text-gray-400">Please allow camera access when prompted</p>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Video className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl mb-2 text-white">Camera Not Active</h3>
                          <p className="text-gray-400 mb-6">Click below to start sign language interpretation</p>
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={startCamera}
                              disabled={isLoading}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Start Camera
                            </button>
                            <button
                              onClick={startDemoMode}
                              disabled={isLoading}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Demo Mode
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Output Section */}
              {(cameraActive || demoMode) && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Translation</h3>
                      <p className="text-xl text-gray-900 dark:text-white">
                        {detectedSign || 'Waiting for sign detection...'}
                      </p>
                    </div>
                    {detectedSign && (
                      <button
                        onClick={() => speakText(detectedSign)}
                        className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Detection History */}
            {(cameraActive || demoMode) && detectionHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Detection History</h3>
                <div className="flex flex-wrap gap-2">
                  {detectionHistory.map((sign, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg text-gray-900 dark:text-white">Instructions</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">1.</span>
                  <span>Position yourself in front of the camera with good lighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">2.</span>
                  <span>Ensure your hands are clearly visible in the frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">3.</span>
                  <span>Perform signs clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">4.</span>
                  <span>Wait for detection confirmation before next sign</span>
                </li>
              </ul>
            </motion.div>

            {/* Sample Gestures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Sample Gestures</h3>
              <div className="space-y-3">
                {sampleGestures.map((gesture, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <span className="text-2xl">{gesture.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{gesture.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{gesture.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-2">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Mode:</span>
                  <span className={(cameraActive || demoMode) ? 'text-green-300' : 'text-red-300'}>
                    {cameraActive ? 'Live Camera' : demoMode ? 'Demo Mode' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audio:</span>
                  <span className={audioEnabled ? 'text-green-300' : 'text-red-300'}>
                    {audioEnabled ? 'Enabled' : 'Muted'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI Model:</span>
                  <span className="text-green-300">Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
