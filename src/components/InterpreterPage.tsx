import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Volume2, VolumeX, AlertCircle, CheckCircle, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as mpHands from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export default function InterpreterPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [detectedSign, setDetectedSign] = useState('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Basic ISL (Indian Sign Language) signs for detection
  const mockSigns = [
    // Greetings & Basic
    'नमस्ते (Namaste)', 'Hello', 'Thank you', 'Sorry', 'Please', 'Good morning', 'Good night',
    // Questions
    'क्या (What?)', 'कहाँ (Where?)', 'कब (When?)', 'क्यों (Why?)', 'कैसे (How?)', 'कौन (Who?)',
    // Responses
    'हाँ (Yes)', 'नहीं (No)', 'ठीक है (OK)', 'समझ गया (Understood)',
    // People & Relations
    'मैं (I/Me)', 'आप (You)', 'वह (He/She)', 'मित्र (Friend)', 'परिवार (Family)', 'माँ (Mother)', 'पिता (Father)',
    // Actions
    'खाना (Eat)', 'पीना (Drink)', 'जाना (Go)', 'आना (Come)', 'बैठना (Sit)', 'खड़ा होना (Stand)',
    // Emotions
    'खुश (Happy)', 'दुखी (Sad)', 'गुस्सा (Angry)', 'डर (Fear)', 'प्रेम (Love)',
    // Common phrases
    'मदद करो (Help)', 'धन्यवाद (Dhanyavaad)', 'स्वागत (Welcome)', 'विदाई (Goodbye)'
  ];

  // Real-time hand detection from camera using MediaPipe
  useEffect(() => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      let hands: mpHands.Hands;
      let camera: Camera;
      let lastDetectionTime = 0;
      const detectionInterval = 1500; // Detect every 1.5 seconds

      // Initialize MediaPipe Hands
      hands = new mpHands.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.85,  // Increased from 0.7
        minTrackingConfidence: 0.8       // Increased from 0.5
      });

      hands.onResults((results) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw hand landmarks and connections
        if (results.multiHandLandmarks && results.multiHandedness) {
          for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const landmarks = results.multiHandLandmarks[i];
            const handedness = results.multiHandedness[i];
            
            // Draw hand landmarks
            ctx.fillStyle = handedness.label === 'Right' ? '#00FF00' : '#FF0000';
            ctx.strokeStyle = handedness.label === 'Right' ? '#00FF00' : '#FF0000';
            ctx.lineWidth = 2;
            
            // Draw landmarks
            landmarks.forEach((landmark) => {
              const x = landmark.x * canvas.width;
              const y = landmark.y * canvas.height;
              
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            });
            
            // Draw connections (simplified)
            const connections = [
              [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
              [0, 5], [5, 6], [6, 7], [7, 8], // Index
              [0, 9], [9, 10], [10, 11], [11, 12], // Middle
              [0, 13], [13, 14], [14, 15], [15, 16], // Ring
              [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
              [5, 9], [9, 13], [13, 17] // Palm
            ];
            
            ctx.beginPath();
            connections.forEach(([start, end]) => {
              const startPoint = landmarks[start];
              const endPoint = landmarks[end];
              
              ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
              ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
            });
            ctx.stroke();
            
            // Detect signs based on hand position and landmarks
            const currentTime = Date.now();
            if (currentTime - lastDetectionTime > detectionInterval) {
              // Additional validation: ensure hand is reasonably positioned and sized
            const palm = landmarks[0];
            const wrist = landmarks[0];
            const middleFingerTip = landmarks[12];
            
            // Check hand size (distance from wrist to middle fingertip)
            const handSize = Math.sqrt(
              Math.pow(middleFingerTip.x - wrist.x, 2) + Math.pow(middleFingerTip.y - wrist.y, 2)
            );
            
            if (palm.x > 0.1 && palm.x < 0.9 && palm.y > 0.1 && palm.y < 0.9 && handSize > 0.15) {
                const detectedSign = detectSignFromLandmarks(landmarks, handedness.label);
                if (detectedSign) {
                  setDetectedSign(detectedSign);
                  setDetectionHistory(prev => [detectedSign, ...prev].slice(0, 10));
                  
                  if (audioEnabled) {
                    const utterance = new SpeechSynthesisUtterance(detectedSign);
                    utterance.rate = 0.9;
                    speechSynthesis.speak(utterance);
                  }
                }
              }
              lastDetectionTime = currentTime;
            }
          }
        }
      });

      // Initialize camera
      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 1280,
        height: 720
      });

      camera.start();

      return () => {
        if (camera) {
          camera.stop();
        }
        if (hands) {
          hands.close();
        }
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

  // Enhanced ISL (Indian Sign Language) detection function
  const detectSignFromLandmarks = (landmarks: mpHands.Landmark[], _handedness: string): string => {
    if (!landmarks || landmarks.length < 21) return '';

    // Validate landmark quality - check if landmarks are reasonable
    const validateLandmarks = (landmarks: mpHands.Landmark[]): boolean => {
      // Check if hand is within reasonable bounds (not outside camera view)
      for (const landmark of landmarks) {
        if (landmark.x < -0.1 || landmark.x > 1.1 || landmark.y < -0.1 || landmark.y > 1.1) {
          return false; // Hand is likely outside camera view
        }
        if (landmark.z < -0.5 || landmark.z > 0.5) {
          return false; // Unreasonable depth value
        }
      }

      // Check if hand landmarks form a reasonable hand shape
      const palmCenter = landmarks[0];
      const fingerTips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
      
      // All fingertips should be reasonably close to palm center
      for (const tip of fingerTips) {
        const distance = Math.sqrt(
          Math.pow(tip.x - palmCenter.x, 2) + Math.pow(tip.y - palmCenter.y, 2)
        );
        if (distance > 0.5) { // Too far from palm center
          return false;
        }
      }

      return true;
    };

    if (!validateLandmarks(landmarks)) {
      return ''; // Invalid landmarks, don't detect anything
    }

    // Helper function to calculate distance between two points
    const calculateDistance = (p1: mpHands.Landmark, p2: mpHands.Landmark): number => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    // Helper function to check if finger is extended
    const isFingerExtended = (finger: number[]): boolean => {
      const tip = landmarks[finger[3]];
      const pip = landmarks[finger[2]];
      const mcp = landmarks[finger[0]];
      
      // More strict criteria for finger extension
      const tipAbovePip = tip.y < pip.y - 0.03;
      const tipAboveMcp = tip.y < mcp.y - 0.01;
      
      return tipAbovePip && tipAboveMcp;
    };

    // Helper function to check if finger is curled
    const isFingerCurled = (finger: number[]): boolean => {
      const tip = landmarks[finger[3]];
      const pip = landmarks[finger[2]];
      return tip.y > pip.y + 0.01;
    };

    // Finger landmark indices
    const fingers = {
      thumb: [1, 2, 3, 4],
      index: [5, 6, 7, 8],
      middle: [9, 10, 11, 12],
      ring: [13, 14, 15, 16],
      pinky: [17, 18, 19, 20]
    };

    // Detect basic signs based on finger positions
    const thumbExtended = isFingerExtended(fingers.thumb);
    const indexExtended = isFingerExtended(fingers.index);
    const middleExtended = isFingerExtended(fingers.middle);
    const ringExtended = isFingerExtended(fingers.ring);
    const pinkyExtended = isFingerExtended(fingers.pinky);

    // Count extended fingers
    const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended]
      .filter(Boolean).length;

    // Count curled fingers
    const curledCount = [
      isFingerCurled(fingers.thumb),
      isFingerCurled(fingers.index),
      isFingerCurled(fingers.middle),
      isFingerCurled(fingers.ring),
      isFingerCurled(fingers.pinky)
    ].filter(Boolean).length;

    // Basic ISL Signs Detection - More accurate criteria
    
    // नमस्ते (Namaste) - Prayer position (both hands together)
    // This requires both hands to be detected, so we'll handle it differently
    // For single hand, we'll focus on other signs
    
    // हाँ (Yes) - Thumbs up (only thumb extended, others curled)
    if (thumbExtended && extendedCount === 1 && curledCount >= 3) {
      return 'हाँ (Yes)';
    }

    // नहीं (No) - Index finger extended, others curled
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended && 
        curledCount >= 3) {
      return 'नहीं (No)';
    }

    // धन्यवाद (Thank you) - Hand to chin and forward (more specific)
    if (thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended && 
        landmarks[8].y < 0.4 && landmarks[4].y < 0.5) { // Hand near face area
      return 'धन्यवाद (Dhanyavaad)';
    }

    // मैं (I/Me) - Point to self (more specific positioning)
    if (indexExtended && extendedCount === 1 && curledCount >= 3) {
      // Pointing toward chest area (center of frame, lower position)
      if (landmarks[8].x > 0.3 && landmarks[8].x < 0.7 && landmarks[8].y > 0.4) { 
        return 'मैं (I/Me)';
      }
    }

    // आप (You) - Point forward (more specific)
    if (indexExtended && extendedCount === 1 && curledCount >= 3) {
      // Pointing forward/upward (away from body)
      if (landmarks[8].y < 0.6) { // Higher position indicates pointing away
        return 'आप (You)';
      }
    }

    // मदद (Help) - Both hands raised (simulate with one hand for now)
    // In single hand mode, we'll use a specific gesture: open palm facing up
    if (extendedCount === 5 && curledCount === 0) {
      // Palm facing up (fingertips higher than palm center)
      const avgFingertipY = [4, 8, 12, 16, 20].reduce((sum, i) => sum + landmarks[i].y, 0) / 5;
      if (avgFingertipY < landmarks[0].y && landmarks[0].y < 0.7) {
        return 'मदद (Help)';
      }
    }

    // ठीक है (OK) - Circle with thumb and index (more precise)
    if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended && 
        curledCount >= 2) {
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const thumbIndexDistance = calculateDistance(thumbTip, indexTip);
      
      if (thumbIndexDistance < 0.06 && thumbIndexDistance > 0.02) { // More precise distance range
        return 'ठीक है (OK)';
      }
    }

    // Open palm greeting (all fingers extended, palm facing forward)
    if (extendedCount === 5 && curledCount === 0) {
      // Check if palm is relatively flat (fingertips not too spread)
      const fingerSpread = Math.max(...[4, 8, 12, 16, 20].map(i => landmarks[i].x)) - 
                          Math.min(...[4, 8, 12, 16, 20].map(i => landmarks[i].x));
      if (fingerSpread < 0.3) { // Reasonable spread for a greeting
        return 'Hello';
      }
    }

    // Fist - Stop/Wait (all fingers curled)
    if (extendedCount === 0 && curledCount >= 4) {
      return 'रुको (Stop/Wait)';
    }

    // Peace sign - Victory/Good (index and middle extended, others curled)
    if (!thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended && 
        curledCount >= 2) {
      return 'अच्छा (Good)';
    }

    // I Love You sign (thumb, index, and pinky extended)
    if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended && 
        curledCount >= 1) {
      return 'प्रेम (Love)';
    }

    // Food/Eat - Hand to mouth gesture (thumb and fingers together, near mouth)
    if (thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended && 
        landmarks[8].y < 0.3) { // Hand near top of frame (mouth area)
      return 'खाना (Food/Eat)';
    }

    // Water - W hand shape (thumb, index, middle extended, ring and pinky curled)
    if (thumbExtended && indexExtended && middleExtended && !ringExtended && pinkyExtended && 
        curledCount >= 1) {
      return 'पानी (Water)';
    }

    // Home/House - Roof shape (both hands together, single hand: flat palm)
    if (extendedCount === 5 && curledCount === 0) {
      // Flat palm, horizontal (for roof gesture)
      const fingerHeightDiff = Math.max(...[4, 8, 12, 16, 20].map(i => landmarks[i].y)) - 
                              Math.min(...[4, 8, 12, 16, 20].map(i => landmarks[i].y));
      if (fingerHeightDiff < 0.1 && landmarks[0].y > 0.3) { // Flat and not too high
        return 'घर (Home)';
      }
    }

    // No clear sign detected - return empty string instead of random sign
    // This prevents false positive detections and random shuffling
    return '';
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
    setIsProcessing(true);
    
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
      
      // Keep processing state for a moment while MediaPipe initializes
      setTimeout(() => setIsProcessing(false), 2000);
      
    } catch (error: any) {
      setIsLoading(false);
      setIsProcessing(false);
      
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

  const startDemoMode = async () => {
    setCameraError('');
    setIsLoading(true);
    
    try {
      // Request camera access for demo mode
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
      
      setDemoMode(true);
      setIsLoading(false);
    } catch (error) {
      // If camera access fails, still enable demo mode with animated background
      setDemoMode(true);
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const basicISLSigns = [
    { 
      name: 'नमस्ते (Namaste)', 
      emoji: '🙏', 
      description: 'Press palms together at chest level',
      category: 'Greetings'
    },
    { 
      name: 'हाँ (Yes)', 
      emoji: '👍', 
      description: 'Single thumbs up gesture',
      category: 'Responses'
    },
    { 
      name: 'नहीं (No)', 
      emoji: '👆', 
      description: 'Index finger moved side to side',
      category: 'Responses'
    },
    { 
      name: 'धन्यवाद (Thank You)', 
      emoji: '🤲', 
      description: 'Touch chin with fingertips, move forward',
      category: 'Greetings'
    },
    { 
      name: 'मैं (I/Me)', 
      emoji: '👉', 
      description: 'Point to your chest',
      category: 'People'
    },
    { 
      name: 'आप (You)', 
      emoji: '👈', 
      description: 'Point forward at person',
      category: 'People'
    },
    { 
      name: 'ठीक है (OK)', 
      emoji: '👌', 
      description: 'Circle with thumb and index finger',
      category: 'Responses'
    },
    { 
      name: 'प्रेम (Love)', 
      emoji: '🤟', 
      description: 'Index finger and pinky extended',
      category: 'Emotions'
    },
    { 
      name: 'Hello', 
      emoji: '✋', 
      description: 'Open palm facing forward',
      category: 'Greetings'
    },
    { 
      name: 'मदद (Help)', 
      emoji: '🆘', 
      description: 'Both hands raised with palms up',
      category: 'Actions'
    },
    { 
      name: 'खुश (Happy)', 
      emoji: '😊', 
      description: 'Both hands at chest, move outward',
      category: 'Emotions'
    },
    { 
      name: 'रुको (Stop)', 
      emoji: '✋', 
      description: 'Open palm facing outward',
      category: 'Actions'
    }
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
                    
                    {/* Processing Indicator */}
                    {isProcessing && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Initializing AI Detection...</span>
                      </div>
                    )}
                    
                    {/* Detection Overlay - Only show when hand is actually detected */}
                    <AnimatePresence>
                      {detectedSign && !isProcessing && (
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

                    {/* Hand Detection Status Indicator */}
                    {detectedSign && (
                      <motion.div
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm"
                      >
                        ✋ Hand Tracking Active
                      </motion.div>
                    )}

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
                    
                    {/* Detection Overlay - Only show when hand is actually detected */}
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
            {/* ISL Learning Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">🎯 Learn Basic ISL</h3>
              
              <div className="space-y-4">
                {/* Basic Hand Positions */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hand Positions</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✋</span>
                      <span>Open Palm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✊</span>
                      <span>Closed Fist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👍</span>
                      <span>Thumb Up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👆</span>
                      <span>Pointing</span>
                    </div>
                  </div>
                </div>

                {/* Common Patterns */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Common Patterns</h4>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Single finger = Pointing/You/Me</li>
                    <li>• Thumb up = Yes/Approval</li>
                    <li>• Open palm = Greeting/Stop</li>
                    <li>• Two fingers = Peace/Good</li>
                  </ul>
                </div>

                {/* Tips for Better Detection */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 Detection Tips</h4>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Keep hands 6-12 inches from camera</li>
                    <li>• Ensure good lighting on hands</li>
                    <li>• Move slowly between signs</li>
                    <li>• Hold signs for 2-3 seconds</li>
                    <li>• Keep fingers clearly separated</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Visual ISL Reference */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">📚 ISL Visual Reference</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Essential Greetings */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Greetings & Basic</h4>
                  
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                        🙏
                      </div>
                      <div>
                        <div className="font-medium text-sm">Namaste</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Prayer hands</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                        ✋
                      </div>
                      <div>
                        <div className="font-medium text-sm">Hello</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Open palm</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                        🤚
                      </div>
                      <div>
                        <div className="font-medium text-sm">Goodbye</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Waving hand</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common Responses */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Responses & Actions</h4>
                  
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
                        👍
                      </div>
                      <div>
                        <div className="font-medium text-sm">Yes</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Thumbs up</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
                        👎
                      </div>
                      <div>
                        <div className="font-medium text-sm">No</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Thumbs down</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                        ✋
                      </div>
                      <div>
                        <div className="font-medium text-sm">Stop</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Open palm forward</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Signs */}
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-900/20 dark:to-pink-900/20 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">More Essential Signs</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-1">
                      👆
                    </div>
                    <div className="text-xs font-medium">You</div>
                    <div className="text-xs text-gray-500">Pointing</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-1">
                      🤟
                    </div>
                    <div className="text-xs font-medium">Love</div>
                    <div className="text-xs text-gray-500">ILY sign</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-1">
                      🤏
                    </div>
                    <div className="text-xs font-medium">OK</div>
                    <div className="text-xs text-gray-500">Finger circle</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-1">
                      ✌️
                    </div>
                    <div className="text-xs font-medium">Good</div>
                    <div className="text-xs text-gray-500">Peace sign</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>💡 Pro Tip:</strong> These are basic ISL signs. For complex conversations, learn finger spelling and grammar rules. Practice regularly for better fluency!
                </div>
              </div>
            </motion.div>

            {/* Detailed ISL Sign Formation Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">👐 How to Form ISL Signs</h3>
              
              <div className="space-y-4">
                {/* Step-by-step guides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">🙏</span> Namaste Formation
                    </h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Bring palms together at chest level</li>
                      <li>2. Fingers pointing upwards</li>
                      <li>3. Thumbs touching chest</li>
                      <li>4. Slight bow of head (optional)</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">✋</span> Hello Formation
                    </h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Open palm completely</li>
                      <li>2. Fingers together, extended</li>
                      <li>3. Thumb relaxed at side</li>
                      <li>4. Move hand side to side</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">👍</span> Yes Formation
                    </h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Make a fist with hand</li>
                      <li>2. Extend thumb upwards</li>
                      <li>3. Keep other fingers curled</li>
                      <li>4. Move thumb up slightly</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">👎</span> No Formation
                    </h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Make a fist with hand</li>
                      <li>2. Extend thumb downwards</li>
                      <li>3. Keep other fingers curled</li>
                      <li>4. Move thumb down slightly</li>
                    </ol>
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">⚠️</span> Common Mistakes to Avoid
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <strong className="text-red-600 dark:text-red-400">❌ Don't:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Rush through signs</li>
                        <li>• Keep fingers too close</li>
                        <li>• Poor lighting conditions</li>
                        <li>• Hand too far/close to camera</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-green-600 dark:text-green-400">✅ Do:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Hold signs for 2-3 seconds</li>
                        <li>• Keep fingers clearly separated</li>
                        <li>• Ensure good face/hand lighting</li>
                        <li>• Maintain 6-12 inch distance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

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

            {/* ISL Reference Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Basic ISL Signs Reference</h3>
              
              {/* Category Filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {['All', 'Greetings', 'Responses', 'People', 'Actions', 'Emotions'].map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {basicISLSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{sign.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{sign.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{sign.description}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                        {sign.category}
                      </span>
                    </div>
                    <button
                      onClick={() => speakText(sign.name)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  💡 <strong>Tip:</strong> These are basic ISL signs. For complex conversations, consider professional interpretation services.
                </p>
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
