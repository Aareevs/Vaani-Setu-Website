import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Volume2, VolumeX, AlertCircle, CheckCircle, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for MediaPipe HandLandmarker
interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandLandmarkerResult {
  landmarks: HandLandmark[][];
  handednesses?: Array<{ categoryName: string; score: number }>;
}

interface HandLandmarker {
  detectForVideo(video: HTMLVideoElement, timestamp: number): HandLandmarkerResult;
}


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
  const [showHandTrackingActive, setShowHandTrackingActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // MediaPipe HandLandmarker refs
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);
  
  // Gesture state machine (per hand)
  const gestureStatesRef = useRef<Record<number, string>>({});
  const lastHandYRef = useRef<Record<number, number>>({});
  const stateTimersRef = useRef<Record<number, number>>({});
  const lastHandXRef = useRef<Record<number, number>>({});
  const handPositionsRef = useRef<Record<number, { x: number; y: number; sign: string }>>({});
  
  // Constants
  const Y_MOVEMENT_THRESHOLD = 0.01;
  const STATE_TIMEOUT = 120;
  const UP_THRESHOLD = 0.04;
  const DOWN_THRESHOLD = 0.02;
  
  const LANDMARK_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
    [9, 10], [10, 11], [11, 12], // Middle finger
    [13, 14], [14, 15], [15, 16], // Ring finger
    [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [5, 9], [9, 13], [13, 17], [0, 9] // Palm base connections
  ];

  // Helper functions for finger detection
  const isFingerUp = (tipY: number, baseMCPY: number): boolean => {
    return (baseMCPY - tipY) > UP_THRESHOLD;
  };

  const isFingerDown = (tipY: number, baseMCPY: number): boolean => {
    return (tipY - baseMCPY) > DOWN_THRESHOLD;
  };

  // Detects only the STATIC hand shape for the CURRENT frame
  const detectStaticSign = (landmarks: HandLandmark[]): string => {
    if (!landmarks || landmarks.length < 21) return "No Hand";
    
    // Extract key joint Y-coordinates
    const thumbTipY = landmarks[4].y;
    const thumbBaseY = landmarks[2].y;
    const indexTipY = landmarks[8].y;
    const indexBaseY = landmarks[5].y;
    const middleTipY = landmarks[12].y;
    const middleBaseY = landmarks[9].y;
    const ringTipY = landmarks[16].y;
    const ringBaseY = landmarks[13].y;
    const pinkyTipY = landmarks[20].y;
    const pinkyBaseY = landmarks[17].y;
    
    // Determine state of each finger
    const isThumbUp = isFingerUp(thumbTipY, thumbBaseY);
    const isIndexUp = isFingerUp(indexTipY, indexBaseY);
    const isMiddleUp = isFingerUp(middleTipY, middleBaseY);
    const isRingUp = isFingerUp(ringTipY, ringBaseY);
    const isPinkyUp = isFingerUp(pinkyTipY, pinkyBaseY);
    
    const isIndexDown = isFingerDown(indexTipY, indexBaseY);
    const isMiddleDown = isFingerDown(middleTipY, middleBaseY);
    const isRingDown = isFingerDown(ringTipY, ringBaseY);
    const isPinkyDown = isFingerDown(pinkyTipY, pinkyBaseY);
    
    // Classification Logic
    // 1. "I Love You" (ILY Sign - Index, Pinky, Thumb Up)
    if (isIndexUp && isPinkyUp && isThumbUp && isMiddleDown && isRingDown) {
      return "I Love You (ILY)";
    }
    
    // 2. "Thumbs Up" = Yes
    if (isThumbUp && isIndexDown && isMiddleDown && isRingDown && isPinkyDown) {
      return "Yes";
    }
    
    // 2b. "Thumbs Down" = No
    const thumbTipForNo = landmarks[4];
    const thumbIPForNo = landmarks[3];
    const thumbMCP = landmarks[2];
    // Thumb is down if tip Y is significantly below the base
    const isThumbDown = (thumbTipForNo.y - thumbMCP.y) > 0.05 && thumbTipForNo.y > thumbIPForNo.y;
    if (isThumbDown && isIndexDown && isMiddleDown && isRingDown && isPinkyDown) {
      return "No";
    }
    
    // 3. Closed Fist
    if (isIndexDown && isMiddleDown && isRingDown && isPinkyDown) {
      return "Closed Fist";
    }
    
    // 4. Open Hand (All fingers up) = Hello
    if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp && isThumbUp) {
      return "Hello";
    }
    
    // 5. OK Sign (Circle with thumb and index)
    const thumbTipForOK = landmarks[4];
    const indexTip = landmarks[8];
    
    // Calculate distance between thumb tip and index tip
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTipForOK.x - indexTip.x, 2) + 
      Math.pow(thumbTipForOK.y - indexTip.y, 2) + 
      Math.pow(thumbTipForOK.z - indexTip.z, 2)
    );
    
    // Check if thumb and index form a circle (tips are close together)
    // and other fingers are extended or slightly curled
    const isOKSign = thumbIndexDistance < 0.08 && 
                     thumbIndexDistance > 0.02 &&
                     isMiddleDown && 
                     isRingDown && 
                     isPinkyDown;
    
    if (isOKSign) {
      return "OK";
    }
    
    // 6. Index Finger Up (ASL '1')
    if (isIndexUp && isMiddleDown && isRingDown && isPinkyDown) {
      return "Index Finger Up";
    }
    
    // Default Fallback
    return "Hand Detected - Unknown Sign";
  };

  // Tracks dynamic gestures over time using a state machine (per hand)
  const trackDynamicGestures = (staticSign: string, landmarks: HandLandmark[], handIndex: number): string => {
    const currentHandY = landmarks[0].y; // Wrist Y coordinate
    
    // Initialize state for this hand if it's new
    if (gestureStatesRef.current[handIndex] === undefined) {
      gestureStatesRef.current[handIndex] = "none";
      lastHandYRef.current[handIndex] = 0;
      stateTimersRef.current[handIndex] = 0;
    }
    
    switch (gestureStatesRef.current[handIndex]) {
      case "none":
        if (staticSign === "Yes") {
          // START: Found the first part of "Good Morning" (Yes -> Hello/Open Hand)
          gestureStatesRef.current[handIndex] = "lookingForUpwardMovement";
          lastHandYRef.current[handIndex] = currentHandY;
          stateTimersRef.current[handIndex] = 0;
        }
        // Note: Stop gesture is now handled in drawResults for two-hand detection
        return staticSign;
        
      case "lookingForUpwardMovement":
        stateTimersRef.current[handIndex]++;
        if (stateTimersRef.current[handIndex] > STATE_TIMEOUT) {
          // Took too long, reset state
          gestureStatesRef.current[handIndex] = "none";
          return staticSign;
        }
        
        // Check if hand is moving up (Y coordinate decreases)
        const isMovingUp = (lastHandYRef.current[handIndex] - currentHandY) > Y_MOVEMENT_THRESHOLD;
        if (isMovingUp) {
          // Hand is moving up, check if shape is now "Hello" (Open Hand)
          if (staticSign.includes("Hello")) {
            // COMPLETE: Gesture sequence matched!
            gestureStatesRef.current[handIndex] = "none"; // Reset for next gesture
            return "Good Morning (ISL)";
          }
          
          // Hand is moving up, but not yet open, update position
          lastHandYRef.current[handIndex] = currentHandY;
          return "Yes (moving...)";
        }
        
        // If sign changes to something else, cancel the gesture
        if (staticSign !== "Yes") {
          gestureStatesRef.current[handIndex] = "none";
          return staticSign;
        }
        
        // Not moving up, but still Yes
        return "Yes";
        
      default:
        gestureStatesRef.current[handIndex] = "none";
        return staticSign;
    }
  };

  // Draw landmarks and connections on canvas
  const drawResults = (results: HandLandmarkerResult) => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let detectedSigns: string[] = [];
    
    if (results.landmarks && results.landmarks.length > 0) {
      // Store current hand positions for two-hand gesture detection
      const currentHandPositions: Array<{ x: number; y: number; sign: string; landmarks: HandLandmark[] }> = [];
      
      // Loop through each detected hand
      for (let i = 0; i < results.landmarks.length; i++) {
        const landmarks = results.landmarks[i];
        const scaleX = canvas.width;
        const scaleY = canvas.height;
        
        // 1. Draw connections
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        for (const connection of LANDMARK_CONNECTIONS) {
          const start = landmarks[connection[0]];
          const end = landmarks[connection[1]];
          ctx.beginPath();
          ctx.moveTo(start.x * scaleX, start.y * scaleY);
          ctx.lineTo(end.x * scaleX, end.y * scaleY);
          ctx.stroke();
        }
        
        // 2. Draw landmarks
        ctx.fillStyle = '#ef4444';
        for (let j = 0; j < landmarks.length; j++) {
          const landmark = landmarks[j];
          ctx.beginPath();
          ctx.arc(landmark.x * scaleX, landmark.y * scaleY, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          if ([4, 8, 12, 16, 20].includes(j)) {
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(landmark.x * scaleX, landmark.y * scaleY, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#ef4444';
          }
        }
        
        // 3. Gesture Detection Logic for this hand
        const staticSign = detectStaticSign(landmarks);
        const wrist = landmarks[0];
        
        // Store hand position for two-hand detection
        currentHandPositions.push({
          x: wrist.x,
          y: wrist.y,
          sign: staticSign,
          landmarks: landmarks
        });
        
        // Track single-hand dynamic gestures
        const finalSign = trackDynamicGestures(staticSign, landmarks, i);
        detectedSigns.push(finalSign);
        
        // Update last position for this hand
        lastHandYRef.current[i] = landmarks[0].y;
        lastHandXRef.current[i] = landmarks[0].x;
      }
      
      // 4. Check for two-hand "Stop" gesture (one hand slapping onto other palm)
      if (results.landmarks.length === 2 && currentHandPositions.length === 2) {
        const hand0 = currentHandPositions[0];
        const hand1 = currentHandPositions[1];
        
        // Check if both hands are in "Hello" (Open Hand) position
        if ((hand0.sign === "Hello" || hand0.sign === "Open Hand") && 
            (hand1.sign === "Hello" || hand1.sign === "Open Hand")) {
          // Check if one hand is moving downward toward the other
          // Use previous Y position if available, otherwise use current position (no movement detected)
          const hand0PrevY = lastHandYRef.current[0] !== undefined ? lastHandYRef.current[0] : hand0.y;
          const hand1PrevY = lastHandYRef.current[1] !== undefined ? lastHandYRef.current[1] : hand1.y;
          
          // Calculate distance between hands
        const distance = Math.sqrt(
            Math.pow((hand0.x - hand1.x) * canvas.width, 2) + 
            Math.pow((hand0.y - hand1.y) * canvas.height, 2)
          );
          
          // Check if one hand is moving down quickly (slapping motion)
          const hand0MovingDown = (hand0.y - hand0PrevY) > (Y_MOVEMENT_THRESHOLD * 1.5);
          const hand1MovingDown = (hand1.y - hand1PrevY) > (Y_MOVEMENT_THRESHOLD * 1.5);
          
          // Check if hands are getting closer (within reasonable distance for a slap)
          const handsAreClose = distance < 150; // pixels
          
          if ((hand0MovingDown || hand1MovingDown) && handsAreClose) {
            // Detect which hand is slapping (the one moving down faster)
            const slappingHandIndex = hand0MovingDown && hand0.y > hand1.y ? 0 : 
                                     hand1MovingDown && hand1.y > hand0.y ? 1 : -1;
            
            if (slappingHandIndex !== -1) {
              // Replace the detected sign with "Stop" for the slapping hand
              detectedSigns[slappingHandIndex] = "Stop";
              // Reset states after detecting Stop
              gestureStatesRef.current[slappingHandIndex] = "none";
            }
          }
        }
      }
      
      updateGestureOutput(detectedSigns);
    } else {
      // No hand detected, reset all states
      gestureStatesRef.current = {};
      lastHandYRef.current = {};
      lastHandXRef.current = {};
      stateTimersRef.current = {};
      handPositionsRef.current = {};
      updateGestureOutput([]);
    }
    
    ctx.restore();
  };

  // Update gesture output display
  const updateGestureOutput = (signs: string[]) => {
    let outputText = "";
    let mainSign = "none";
    
    if (signs.length === 0) {
      outputText = "... Awaiting Sign ...";
      mainSign = "awaiting";
    } else if (signs.length === 1) {
      outputText = signs[0];
      mainSign = signs[0];
    } else {
      // Both hands detected
      outputText = `Hand 1: ${signs[0]} | Hand 2: ${signs[1]}`;
      // Prioritize dynamic gestures or "success" signs for color
      if (signs.includes("Good Morning (ISL)") || signs.includes("I Love You (ILY)") || signs.includes("Stop")) {
        mainSign = signs.includes("Stop") ? "Stop" : "Good Morning (ISL)";
      } else if (signs[0].includes("moving...") || signs[1].includes("moving...") || signs[0].includes("slapping...") || signs[1].includes("slapping...")) {
        mainSign = "moving...";
      } else {
        mainSign = signs[0];
      }
    }
    
    setDetectedSign(outputText);
    
    // Show "Hand Tracking Active" indicator when hand is detected
    if (signs.length > 0 && !showHandTrackingActive) {
      setShowHandTrackingActive(true);
      // Hide after 5 seconds
      setTimeout(() => {
        setShowHandTrackingActive(false);
      }, 5000);
    }
    
    if (outputText && outputText !== "... Awaiting Sign ...") {
      setDetectionHistory((prev: string[]) => [outputText, ...prev].slice(0, 10));
      
      if (audioEnabled && !mainSign.includes("moving...") && !mainSign.includes("slapping...") && mainSign !== "awaiting") {
        const utterance = new SpeechSynthesisUtterance(outputText);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Load MediaPipe Tasks Vision dynamically via script tag
  const loadMediaPipe = async (): Promise<{ HandLandmarker: any; FilesetResolver: any }> => {
    if ((window as any).mediapipe?.tasks?.vision) {
      return (window as any).mediapipe.tasks.vision;
    }

    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[data-mediapipe]');
      if (existingScript) {
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if ((window as any).mediapipe?.tasks?.vision) {
            clearInterval(checkInterval);
            resolve((window as any).mediapipe.tasks.vision);
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!(window as any).mediapipe?.tasks?.vision) {
            reject(new Error('MediaPipe failed to load'));
          }
        }, 10000);
        return;
      }

      // Create and inject script tag
      const script = document.createElement('script');
      script.type = 'module';
      script.setAttribute('data-mediapipe', 'true');
      script.textContent = `
        import { HandLandmarker, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest';
        window.mediapipe = { tasks: { vision: { HandLandmarker, FilesetResolver } } };
        window.dispatchEvent(new Event('mediapipe-loaded'));
      `;
      
      script.onerror = () => {
        reject(new Error('Failed to load MediaPipe script'));
      };
      
      window.addEventListener('mediapipe-loaded', () => {
        resolve((window as any).mediapipe.tasks.vision);
      }, { once: true });
      
      document.head.appendChild(script);
    });
  };

  // Initialize MediaPipe HandLandmarker
  const createHandLandmarker = async () => {
    try {
      console.log("Loading MediaPipe Tasks Vision...");
      const { HandLandmarker, FilesetResolver } = await loadMediaPipe();
      
      console.log("Initializing FilesetResolver...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      console.log("Creating HandLandmarker...");
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      
      handLandmarkerRef.current = handLandmarker;
      console.log("MediaPipe HandLandmarker initialized for 2 hands.");
      
      setIsProcessing(false);
      return true;
    } catch (error: any) {
      console.error("Initialization error:", error);
      setCameraError('UNKNOWN');
      setIsProcessing(false);
      return false;
    }
  };

  // Main prediction loop
  const predictWebcam = () => {
    const handLandmarker = handLandmarkerRef.current;
    const video = videoRef.current;
    
    if (!cameraActive || !handLandmarker || !video) {
      return;
    }
    
    if (video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam);
      return;
    }
    
    const nowInMs = performance.now();
    
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      try {
        const results = handLandmarker.detectForVideo(video, nowInMs);
        drawResults(results);
      } catch (error) {
        console.error("Error in detection:", error);
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(predictWebcam);
  };

  // Real-time hand detection from camera using MediaPipe Tasks Vision
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !outputCanvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = outputCanvasRef.current;

    const initializeAndStart = async () => {
      setIsProcessing(true);
      
      // Wait for video to be ready
      const waitForVideo = () => {
        return new Promise<void>((resolve) => {
          if (video.readyState >= 2) {
            resolve();
          } else {
            const onLoadedData = () => {
              video.removeEventListener('loadeddata', onLoadedData);
              resolve();
            };
            video.addEventListener('loadeddata', onLoadedData);
          }
        });
      };

      await waitForVideo();

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Initialize MediaPipe
      const success = await createHandLandmarker();
      
      if (success && handLandmarkerRef.current) {
        console.log("Starting prediction loop...");
        predictWebcam();
      }
    };

    initializeAndStart();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      gestureStatesRef.current = {};
      lastHandYRef.current = {};
      stateTimersRef.current = {};
      lastVideoTimeRef.current = -1;
    };
  }, [cameraActive]);


  const startCamera = async () => {
    setCameraError('');
    setIsLoading(true);
    
    try {
      console.log("Starting camera...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('UNSUPPORTED');
      }

      // Request camera access
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        } 
      });
      
      console.log("Camera stream obtained:", stream);
      console.log("Video tracks:", stream.getVideoTracks());
      
      // Set camera active first so video element renders
      setCameraActive(true);
      setIsLoading(false);
      
      // Wait a bit for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!videoRef.current) {
        console.error("Video ref is still null after waiting!");
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Video element not available after render');
      }
      
      const video = videoRef.current;
      console.log("Setting video srcObject...");
      console.log("Video element:", video);
      console.log("Video readyState before:", video.readyState);
      
      video.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video timeout - video did not become ready'));
        }, 5000);
        
        const onCanPlay = () => {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          console.log("Video can play, readyState:", video.readyState);
          resolve();
        };
        
        const onError = (e: Event) => {
          clearTimeout(timeout);
          video.removeEventListener('error', onError);
          console.error("Video error event:", e);
          reject(new Error('Video element error'));
        };
        
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);
        
        // Try to play
        video.play().then(() => {
          console.log("Video play() succeeded");
        }).catch((playError) => {
          console.error("Video play() error:", playError);
          // Don't reject - video might still work
        });
        
        // If already ready, resolve immediately
        if (video.readyState >= 2) {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        }
      });
      
      // Set processing after a short delay to allow video to start
      setIsProcessing(true);
      setTimeout(() => {
        // MediaPipe will set this to false when ready
      }, 500);
      
    } catch (error: any) {
      console.error("Camera start error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      
      setIsLoading(false);
      setIsProcessing(false);
      setCameraActive(false);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('PERMISSION_DENIED');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('NO_CAMERA');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('CAMERA_IN_USE');
      } else if (error.message === 'UNSUPPORTED') {
        setCameraError('UNSUPPORTED');
      } else {
        console.warn('Unexpected camera error:', error);
        // Store error details for debugging
        (window as any).lastCameraError = error;
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

  const basicASLSigns = [
    { 
      name: 'HELLO', 
      emoji: '👋', 
      description: 'Open palm wave',
      category: 'Greetings'
    },
    { 
      name: 'YES', 
      emoji: '👍', 
      description: 'Fist nod (approximated as fist)',
      category: 'Responses'
    },
    { 
      name: 'NO', 
      emoji: '✌️', 
      description: 'Index+middle extended, others curled',
      category: 'Responses'
    },
    { 
      name: 'THANK YOU', 
      emoji: '🤲', 
      description: 'Flat hand from chin outward (reference)',
      category: 'Greetings'
    },
    { 
      name: 'I LOVE YOU', 
      emoji: '🤟', 
      description: 'Thumb, index, and pinky extended',
      category: 'Emotions'
    },
    { 
      name: 'OK', 
      emoji: '👌', 
      description: 'Circle with thumb and index',
      category: 'Responses'
    },
    { 
      name: 'A', 
      emoji: '✊', 
      description: 'Fist; thumb along side',
      category: 'Alphabet'
    },
    { 
      name: 'B', 
      emoji: '✋', 
      description: 'Flat hand; thumb across palm',
      category: 'Alphabet'
    },
    { 
      name: 'L', 
      emoji: '🫲', 
      description: 'Index+thumb form an “L”',
      category: 'Alphabet'
    },
    { 
      name: 'I', 
      emoji: '☝️', 
      description: 'Only pinky extended',
      category: 'Alphabet'
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
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                      onLoadedMetadata={() => {
                        console.log("Video metadata loaded:", {
                          width: videoRef.current?.videoWidth,
                          height: videoRef.current?.videoHeight,
                          readyState: videoRef.current?.readyState
                        });
                      }}
                      onLoadedData={() => {
                        console.log("Video data loaded");
                      }}
                      onCanPlay={() => {
                        console.log("Video can play");
                      }}
                    />
                    {/* Canvas overlay for hand landmarks */}
                    <canvas
                      ref={outputCanvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ transform: 'scaleX(-1)' }}
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
                    {showHandTrackingActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
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
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                      Demo Mode - Please start camera for detection
                    </div>
                    
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
                              <p className="text-gray-300 mb-4">
                                An unexpected error occurred while accessing the camera. Please try again or refresh the page.
                              </p>
                              {(window as any).lastCameraError && (
                                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400 font-mono">
                                  <div className="mb-1">Error details (check console for more):</div>
                                  <div>Name: {(window as any).lastCameraError?.name || 'Unknown'}</div>
                                  <div>Message: {(window as any).lastCameraError?.message || 'No message'}</div>
                                </div>
                              )}
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
            {/* ASL Learning Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">🎯 Learn Basic ASL</h3>
              
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

            {/* Visual ASL Reference */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">📚 ASL Visual Reference</h3>
              
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
              <strong>💡 Pro Tip:</strong> These are basic ASL signs. For complex conversations, learn finger spelling and grammar rules. Practice regularly for better fluency!
                </div>
              </div>
            </motion.div>

            {/* Detailed ASL Sign Formation Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">👐 How to Form ASL Signs</h3>
              
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

            {/* ASL Reference Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Basic ASL Signs Reference</h3>
              
              {/* Category Filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {['All', 'Greetings', 'Responses', 'Alphabet'].map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {basicASLSigns.map((sign, index) => (
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
                  💡 <strong>Tip:</strong> These are basic ASL signs. For complex conversations, consider professional interpretation services.
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
