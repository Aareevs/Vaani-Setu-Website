import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Volume2, VolumeX, AlertCircle, CheckCircle, Maximize, Minimize, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SignTeacher from './SignTeacher';
import { supabase } from '../utils/supabase';

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

interface FaceLandmarker {
  detectForVideo(video: HTMLVideoElement, timestamp: number): any;
}

interface PoseLandmarker {
  detectForVideo(video: HTMLVideoElement, timestamp: number): any;
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
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const lastLandmarksRef = useRef<HandLandmarkerResult | null>(null); // Shared landmarks for Teach Vaani
  const lastVideoTimeRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);
  
  // Gesture state machine (per hand)
  const gestureStatesRef = useRef<Record<number, string>>({});
  const lastHandYRef = useRef<Record<number, number>>({});
  const stateTimersRef = useRef<Record<number, number>>({});
  const lastHandXRef = useRef<Record<number, number>>({});
  const handPositionsRef = useRef<Record<number, { x: number; y: number; sign: string }>>({});
  const lastHandZRef = useRef<Record<number, number>>({});
  const handPathRef = useRef<Record<number, Array<{ x: number; y: number; z: number }>>>({});
  const motherHoldRef = useRef<Record<number, number>>({});
  const fatherHoldRef = useRef<Record<number, number>>({});
  const loveHoldRef = useRef<number>(0);
  const deafStateRef = useRef<Record<number, { stage: 'none' | 'mouth' | 'ear'; timer: number }>>({});
  const goodStateRef = useRef<Record<number, { stage: 'none' | 'nearChin'; timer: number }>>({});
  const recentPhrasesRef = useRef<Array<{ text: string; time: number }>>([]);
  const speechStateRef = useRef<{ text: string; lastSpokenAt: number }>({ text: '', lastSpokenAt: 0 });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showSignTeacher, setShowSignTeacher] = useState(false);
  const learnedDynamicStatesRef = useRef<Record<string, Record<number, { stage: 'start' | 'end'; timer: number; startY: number }>>>({});
  
  // Check for admin mode on mount
  useEffect(() => {
    const checkAdminMode = () => {
      const isEnabled = localStorage.getItem('vaani_admin_mode') === 'true';
      setIsAdminMode(isEnabled);
    };
    checkAdminMode();
    // Listen for storage changes in case settings are updated in another tab
    window.addEventListener('storage', checkAdminMode);
    return () => window.removeEventListener('storage', checkAdminMode);
  }, []);

  // Fetch learned signs
  useEffect(() => {
    const fetchLearnedSigns = async () => {
      const { data } = await supabase.from('learned_signs').select('*');
      if (data) {
        // setLearnedSigns(data); // Removed as state is unused
        const dynamicSigns = data.filter((s: any) => s.type === 'dynamic');
        dynamicSigns.forEach((s: any) => {
          learnedDynamicStatesRef.current[s.name] = {};
        });
      }
    };
    fetchLearnedSigns();
  }, []);

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
  const detectStaticSign = (landmarks: HandLandmark[], faceLandmarks?: any[]): string => {
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
    
    if (isIndexUp && isMiddleUp && isRingDown && isPinkyDown && !isThumbUp) {
      return "Two Fingers Up";
    }

    // 7. Eat Sign (All finger tips touching thumb tip AND near mouth)
    const thumbTip = landmarks[4];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const getDist = (p1: HandLandmark, p2: HandLandmark) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
    };

    const distThumbIndex = getDist(thumbTip, landmarks[8]);
    const distThumbMiddle = getDist(thumbTip, middleTip);
    const distThumbRing = getDist(thumbTip, ringTip);
    const distThumbPinky = getDist(thumbTip, pinkyTip);

    // Threshold for "touching"
    const TOUCH_THRESHOLD = 0.06; 
    
    // Check hand shape first
    const isEatShape = distThumbIndex < TOUCH_THRESHOLD && 
                       distThumbMiddle < TOUCH_THRESHOLD && 
                       distThumbRing < TOUCH_THRESHOLD && 
                       distThumbPinky < TOUCH_THRESHOLD;

    if (isEatShape) {
      // If face landmarks are available, check proximity to mouth
      if (faceLandmarks && faceLandmarks.length > 0) {
        // Mouth center (approximate using lip landmarks)
        // 13: Upper lip center, 14: Lower lip center
        const upperLip = faceLandmarks[13];
        const lowerLip = faceLandmarks[14];
        
        if (upperLip && lowerLip) {
          const mouthX = (upperLip.x + lowerLip.x) / 2;
          const mouthY = (upperLip.y + lowerLip.y) / 2;
          
          // Calculate distance from hand (thumb tip) to mouth
          const distHandMouth = Math.sqrt(
            Math.pow(thumbTip.x - mouthX, 2) + 
            Math.pow(thumbTip.y - mouthY, 2)
          );
          
          // Threshold for "near mouth" (adjust as needed)
          const MOUTH_THRESHOLD = 0.15;
          
          if (distHandMouth < MOUTH_THRESHOLD) {
            return "Eat";
          }
        }
      } else {
        // Fallback if no face detected (less accurate)
        return "Eat";
      }
    }
    
    // Default Fallback
    return "Hand Detected - Unknown Sign";
  };

  // Tracks dynamic gestures over time using a state machine (per hand)
  const trackDynamicGestures = (staticSign: string, landmarks: HandLandmark[], handIndex: number): string => {
    const currentHandY = landmarks[0].y; // Wrist Y coordinate
    const currentHandX = landmarks[0].x;
    const currentHandZ = landmarks[0].z;
    
    // Initialize state for this hand if it's new
    if (gestureStatesRef.current[handIndex] === undefined) {
      gestureStatesRef.current[handIndex] = "none";
      lastHandYRef.current[handIndex] = 0;
      stateTimersRef.current[handIndex] = 0;
      lastHandZRef.current[handIndex] = 0;
      handPathRef.current[handIndex] = [];
    }
    
    const path = handPathRef.current[handIndex] || [];
    path.push({ x: currentHandX, y: currentHandY, z: currentHandZ });
    if (path.length > 24) path.shift();
    handPathRef.current[handIndex] = path;

    switch (gestureStatesRef.current[handIndex]) {
      case "none":
        if (staticSign === "Yes") {
          // START: Found the first part of "Good Morning" (Yes -> Hello/Open Hand)
          gestureStatesRef.current[handIndex] = "lookingForUpwardMovement";
          lastHandYRef.current[handIndex] = currentHandY;
          stateTimersRef.current[handIndex] = 0;
        }
        
        if (staticSign === "Hello") {
          if (path.length >= 12) {
            const cx = path.reduce((a, p) => a + p.x, 0) / path.length;
            const cy = path.reduce((a, p) => a + p.y, 0) / path.length;
            let angleSum = 0;
            for (let i = 1; i < path.length; i++) {
              const v1x = path[i - 1].x - cx;
              const v1y = path[i - 1].y - cy;
              const v2x = path[i].x - cx;
              const v2y = path[i].y - cy;
              const dot = v1x * v2x + v1y * v2y;
              const m1 = Math.sqrt(v1x * v1x + v1y * v1y);
              const m2 = Math.sqrt(v2x * v2x + v2y * v2y);
              const cos = Math.max(-1, Math.min(1, dot / (m1 * m2 || 1)));
              angleSum += Math.acos(cos);
            }
            const avgR = path.reduce((a, p) => a + Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2), 0) / path.length;
            if (angleSum > 4 && avgR > 0.01 && avgR < 0.06) {
              return "Please";
            }
          }
          if (path.length >= 8) {
            const zDelta = path[path.length - 1].z - path[0].z;
            const yDelta = path[path.length - 1].y - path[0].y;
            if (zDelta < -0.06 && yDelta > 0) {
              return "Thank You";
            }
          }
        }
        
        if (staticSign === "Two Fingers Up") {
          if (path.length >= 10) {
            let directionChanges = 0;
            let prevDx = 0;
            for (let i = 1; i < path.length; i++) {
              const dx = path[i].x - path[i - 1].x;
              if (prevDx !== 0 && dx !== 0 && Math.sign(dx) !== Math.sign(prevDx)) directionChanges++;
              prevDx = dx;
            }
            const amp = Math.max(...path.map(p => p.x)) - Math.min(...path.map(p => p.x));
            if (directionChanges >= 3 && amp > 0.04) {
              return "Bathroom";
            }
          }
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
  const drawResults = (results: HandLandmarkerResult, faceResults?: any, poseResults?: any) => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let detectedSigns: string[] = [];
    
    // Update shared landmarks ref
    lastLandmarksRef.current = results;
    
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
          }
        }
        
        // 3. Detect Sign
        const staticSign = detectStaticSign(
          landmarks, 
          faceResults && faceResults.faceLandmarks ? faceResults.faceLandmarks[0] : undefined
        );
        detectedSigns.push(staticSign);
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

        const index0 = results.landmarks[0][8];
        const index1 = results.landmarks[1][8];
        const distIndex = Math.sqrt(
          Math.pow((index0.x - index1.x) * canvas.width, 2) +
          Math.pow((index0.y - index1.y) * canvas.height, 2)
        );
        if (hand0.sign === "Index Finger Up" && hand1.sign === "Index Finger Up" && distIndex < 120) {
          detectedSigns[0] = "Friend";
          detectedSigns[1] = "Friend";
        }

        const hand0PrevX = lastHandXRef.current[0] !== undefined ? lastHandXRef.current[0] : hand0.x;
        const hand1PrevX = lastHandXRef.current[1] !== undefined ? lastHandXRef.current[1] : hand1.x;
        const v0x = hand0.x - hand0PrevX;
        const v1x = hand1.x - hand1PrevX;
        if (hand0.sign === "Closed Fist" && hand1.sign === "Closed Fist" && Math.sign(v0x) !== Math.sign(v1x) && Math.abs(v0x) > 0.02 && Math.abs(v1x) > 0.02) {
          detectedSigns[0] = "Baby";
          detectedSigns[1] = "Baby";
        }

        const hand0PrevY2 = lastHandYRef.current[0] !== undefined ? lastHandYRef.current[0] : hand0.y;
        const hand1PrevY2 = lastHandYRef.current[1] !== undefined ? lastHandYRef.current[1] : hand1.y;
        const v0y = hand0.y - hand0PrevY2;
        const v1y = hand1.y - hand1PrevY2;
        const handsCloseForSchool = Math.sqrt(
          Math.pow((hand0.x - hand1.x) * canvas.width, 2) +
          Math.pow((hand0.y - hand1.y) * canvas.height, 2)
        ) < 180;
        if ((hand0.sign === "Hello" || hand1.sign === "Hello") && Math.abs(v0y) > 0.02 && Math.abs(v1y) > 0.02 && Math.sign(v0y) !== Math.sign(v1y) && handsCloseForSchool) {
          detectedSigns[0] = "School";
          detectedSigns[1] = "School";
        }
      }

      const face = faceResults?.faceLandmarks?.[0] || faceResults?.landmarks?.[0];
      const pose = poseResults?.poseLandmarks?.[0] || poseResults?.landmarks?.[0];

      if (face) {
        const chin = face[152];
        const forehead = face[10];
        for (let i = 0; i < results.landmarks.length; i++) {
          const landmarks = results.landmarks[i];
          const thumbTip = landmarks[4];
          const dMother = Math.sqrt(
            Math.pow(thumbTip.x - chin.x, 2) +
            Math.pow(thumbTip.y - chin.y, 2)
          );
          const dFather = Math.sqrt(
            Math.pow(thumbTip.x - forehead.x, 2) +
            Math.pow(thumbTip.y - forehead.y, 2)
          );
          if (!motherHoldRef.current[i]) motherHoldRef.current[i] = 0;
          if (!fatherHoldRef.current[i]) fatherHoldRef.current[i] = 0;
          
          // Mother: Thumb on chin + Open Hand (Hello)
          // "Eat" sign (fingers touching thumb) should NOT trigger this
          if (dMother < 0.06 && detectedSigns[i] === "Hello") {
            motherHoldRef.current[i]++;
            if (motherHoldRef.current[i] > 6) detectedSigns[i] = "Mother";
          } else {
            motherHoldRef.current[i] = 0;
          }
          
        // Father: Thumb on forehead + Open Hand
        if (dFather < 0.06 && detectedSigns[i] === "Hello") {
          fatherHoldRef.current[i]++;
          if (fatherHoldRef.current[i] > 6) detectedSigns[i] = "Father";
        } else {
          fatherHoldRef.current[i] = 0;
        }
        const indexTipForGood = landmarks[8];
        if (!goodStateRef.current[i]) goodStateRef.current[i] = { stage: 'none', timer: 0 };
        const dChinIdx = Math.sqrt(
          Math.pow(indexTipForGood.x - chin.x, 2) +
          Math.pow(indexTipForGood.y - chin.y, 2)
        );
        const pathGood = handPathRef.current[i] || [];
        if (dChinIdx < 0.06) {
          goodStateRef.current[i] = { stage: 'nearChin', timer: 0 };
        } else if (goodStateRef.current[i].stage === 'nearChin' && pathGood.length >= 8) {
          const zDeltaGood = pathGood[pathGood.length - 1].z - pathGood[0].z;
          const yDeltaGood = pathGood[pathGood.length - 1].y - pathGood[0].y;
          if (zDeltaGood < -0.05 || yDeltaGood > 0.03) {
            detectedSigns[i] = "Good";
            goodStateRef.current[i] = { stage: 'none', timer: 0 };
          } else {
            goodStateRef.current[i].timer++;
            if (goodStateRef.current[i].timer > 40) goodStateRef.current[i] = { stage: 'none', timer: 0 };
          }
        }
      }
    }

      if (pose) {
        const leftShoulder = pose[11];
        const rightShoulder = pose[12];
        const leftElbow = pose[13];
        const rightElbow = pose[14];
        const leftWrist = pose[15];
        const rightWrist = pose[16];
        const chestYMin = Math.min(leftShoulder.y, rightShoulder.y);
        const chestYMax = chestYMin + 0.15;
        const crossX = rightWrist.x < leftShoulder.x && leftWrist.x > rightShoulder.x;
        const chestRange = rightWrist.y > chestYMin && rightWrist.y < chestYMax && leftWrist.y > chestYMin && leftWrist.y < chestYMax;
        const elbowsBent = Math.abs(leftElbow.x - leftWrist.x) < 0.12 && Math.abs(rightElbow.x - rightWrist.x) < 0.12;
        if (crossX && chestRange && elbowsBent) {
          loveHoldRef.current++;
          if (loveHoldRef.current > 8) {
            detectedSigns[0] = "Love";
            if (detectedSigns.length > 1) detectedSigns[1] = "Love";
          }
        } else {
          loveHoldRef.current = 0;
        }

        const palmsClose = Math.sqrt(
          Math.pow((leftWrist.x - rightWrist.x) * canvas.width, 2) +
          Math.pow((leftWrist.y - rightWrist.y) * canvas.height, 2)
        ) < 180;
        const rightPrevY = lastHandYRef.current[1] !== undefined ? lastHandYRef.current[1] : rightWrist.y;
        const leftPrevY = lastHandYRef.current[0] !== undefined ? lastHandYRef.current[0] : leftWrist.y;
        const rightUp = (rightPrevY - rightWrist.y) > 0.02;
        const leftDownSmall = (leftWrist.y - leftPrevY) > 0.01;
        if (palmsClose && rightUp) {
          detectedSigns[1] = "Morning";
        }
        if (palmsClose && leftDownSmall && Math.abs((rightPrevY - rightWrist.y)) < 0.01) {
          detectedSigns[0] = "Afternoon";
        }
        const rightDown = (rightWrist.y - rightPrevY) > 0.02;
        if (palmsClose && rightDown) {
          detectedSigns[1] = "Night";
        }
      }

      if (pose || face) {
        for (let i = 0; i < results.landmarks.length; i++) {
          if (!deafStateRef.current[i]) deafStateRef.current[i] = { stage: 'none', timer: 0 };
          const state = deafStateRef.current[i];
          const indexTip = results.landmarks[i][8];
          const mouthCenter = face ? { x: (face[13].x + face[14].x) / 2, y: (face[13].y + face[14].y) / 2 } : null;
          const leftEar = pose ? pose[7] : (face ? face[234] : null);
          const rightEar = pose ? pose[8] : (face ? face[454] : null);
          const earTarget = leftEar && rightEar ? (Math.abs(indexTip.x - leftEar.x) < Math.abs(indexTip.x - rightEar.x) ? leftEar : rightEar) : (leftEar || rightEar);
          state.timer = Math.min(120, state.timer + 1);
          
          // Deaf: Index finger touching mouth then ear (or vice versa)
          // Must be "Index Finger Up" sign to avoid confusion with "Eat"
          const isIndexFingerSign = detectedSigns[i] === "Index Finger Up";
          
          if (state.stage === 'none' && mouthCenter && isIndexFingerSign) {
            const dMouth = Math.sqrt(Math.pow(indexTip.x - mouthCenter.x, 2) + Math.pow(indexTip.y - mouthCenter.y, 2));
            if (dMouth < 0.05) {
              state.stage = 'mouth';
              state.timer = 0;
            }
          } else if (state.stage === 'mouth' && earTarget) {
            const dEar = Math.sqrt(Math.pow(indexTip.x - earTarget.x, 2) + Math.pow(indexTip.y - earTarget.y, 2));
            if (dEar < 0.07) {
              detectedSigns[i] = "Deaf";
              state.stage = 'none';
              state.timer = 0;
            } else if (state.timer > 60) {
              state.stage = 'none';
            }
          }
          deafStateRef.current[i] = state;
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
      motherHoldRef.current = {};
      fatherHoldRef.current = {};
      loveHoldRef.current = 0;
      deafStateRef.current = {};
      goodStateRef.current = {};
      recentPhrasesRef.current = [];
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
    
    const now = performance.now();
    const phraseParts = ["Good", "Morning", "Afternoon", "Night"];
    for (const s of signs) {
      if (phraseParts.includes(s)) {
        recentPhrasesRef.current.push({ text: s, time: now });
      }
    }
    recentPhrasesRef.current = recentPhrasesRef.current.filter(p => now - p.time < 2000);
    const hasGood = recentPhrasesRef.current.find(p => p.text === "Good");
    const hasMorning = recentPhrasesRef.current.find(p => p.text === "Morning");
    const hasAfternoon = recentPhrasesRef.current.find(p => p.text === "Afternoon");
    const hasNight = recentPhrasesRef.current.find(p => p.text === "Night");
    if (hasGood && hasMorning) {
      outputText = "Good Morning";
      mainSign = "Good Morning";
    } else if (hasGood && hasAfternoon) {
      outputText = "Good Afternoon";
      mainSign = "Good Afternoon";
    } else if (hasGood && hasNight) {
      outputText = "Good Night";
      mainSign = "Good Night";
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
        const nowSpeak = performance.now();
        const sameText = speechStateRef.current.text === outputText;
        const intervalMs = 1500;
        if (!sameText || (nowSpeak - (speechStateRef.current.lastSpokenAt || 0)) >= intervalMs) {
          const utterance = new SpeechSynthesisUtterance(outputText);
          utterance.rate = 0.9;
          utterance.onend = () => {
            speechStateRef.current.lastSpokenAt = performance.now();
          };
          speechStateRef.current.text = outputText;
          speechStateRef.current.lastSpokenAt = nowSpeak;
          if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
          }
          speechSynthesis.speak(utterance);
        }
      }
    }
  };

  // Load MediaPipe Tasks Vision dynamically via script tag
  const loadMediaPipe = async (): Promise<{ HandLandmarker: any; FilesetResolver: any; FaceLandmarker: any; PoseLandmarker: any }> => {
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
        import { HandLandmarker, FilesetResolver, FaceLandmarker, PoseLandmarker } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest';
        window.mediapipe = { tasks: { vision: { HandLandmarker, FilesetResolver, FaceLandmarker, PoseLandmarker } } };
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

  const createFaceLandmarker = async () => {
    try {
      const { FaceLandmarker, FilesetResolver } = await loadMediaPipe();
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO"
      });
      faceLandmarkerRef.current = faceLandmarker;
      return true;
    } catch (error) {
      console.error("Face init error", error);
      return false;
    }
  };

  const createPoseLandmarker = async () => {
    try {
      const { PoseLandmarker, FilesetResolver } = await loadMediaPipe();
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO"
      });
      poseLandmarkerRef.current = poseLandmarker;
      return true;
    } catch (error) {
      console.error("Pose init error", error);
      return false;
    }
  };

  // Main prediction loop
  const predictWebcam = () => {
    const handLandmarker = handLandmarkerRef.current;
    const faceLandmarker = faceLandmarkerRef.current;
    const poseLandmarker = poseLandmarkerRef.current;
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
        const faceResults = faceLandmarker ? faceLandmarker.detectForVideo(video, nowInMs) : null;
        const poseResults = poseLandmarker ? poseLandmarker.detectForVideo(video, nowInMs) : null;
        drawResults(results, faceResults, poseResults);
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

      const s1 = await createHandLandmarker();
      await createFaceLandmarker();
      await createPoseLandmarker();
      setIsProcessing(false);
      if (s1 && handLandmarkerRef.current) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Sign Language Interpreter</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time AI-powered sign language detection and translation</p>
          </motion.div>

          {/* Teach Vaani Button - Only visible if Admin Mode is enabled in Settings */}
          {isAdminMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowSignTeacher(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Teach Vaani</span>
            </motion.button>
          )}
        </div>

        {/* Sign Teacher Modal */}
        <AnimatePresence>
          {showSignTeacher && (
            <SignTeacher 
              onClose={() => setShowSignTeacher(false)} 
              onSignSaved={() => {
                // Refresh logic to be implemented when recognition is added
              }}
              handLandmarker={handLandmarkerRef.current}
              lastLandmarksRef={lastLandmarksRef}
              stream={videoRef.current?.srcObject as MediaStream}
            />
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-transparent dark:border-gray-700 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07)]"
            >
              {/* Video Container */}
              <div className={`relative bg-gray-900 ${isFullscreen ? 'h-screen' : 'h-[600px]'} dark:ring-1 dark:ring-gray-700 dark:rounded-xl dark:shadow-lg`}>
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
                      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
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
                          className="absolute top-4 left-4 bg-blue-500 dark:bg-blue-600/80 text-white px-6 py-3 rounded-xl shadow-lg border border-transparent dark:border-blue-400/40 backdrop-blur"
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
                        className="absolute top-4 right-4 bg-green-500 dark:bg-green-600/80 text-white px-3 py-2 rounded-lg shadow-lg text-sm border border-transparent dark:border-green-400/40 backdrop-blur"
                      >
                        ✋ Hand Tracking Active
                      </motion.div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/20 dark:bg-gray-800/60 px-4 py-3 rounded-xl backdrop-blur border border-transparent dark:border-gray-700">
                      <button
                        onClick={stopCamera}
                        className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        <VideoOff className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-4 bg-gray-700 dark:bg-gray-900/60 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-4 bg-gray-700 dark:bg-gray-900/60 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors"
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
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center max-w-md p-8">
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
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl border border-transparent dark:border-gray-700">
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
                className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700"
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
          <div className="space-y-4">
            {/* ASL Learning Guide - Compact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-transparent dark:border-gray-700"
            >
              <h3 className="text-base mb-3 text-gray-900 dark:text-white">🎯 Quick ASL Tips</h3>
              
              <div className="space-y-3">
                {/* Basic Hand Positions - Compact */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Hand Positions</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">✋</span>
                      <span>Open Palm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">✊</span>
                      <span>Closed Fist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">👍</span>
                      <span>Thumb Up</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">👆</span>
                      <span>Pointing</span>
                    </div>
                  </div>
                </div>

                {/* Detection Tips - Compact */}
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">💡 Detection Tips</h4>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Keep hands 6-12" from camera</li>
                    <li>• Ensure good lighting</li>
                    <li>• Hold signs 2-3 seconds</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            

            {/* Detailed ASL Sign Formation Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">👐 How to Form ASL Signs</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Thank You</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Fingers touch chin</li>
                      <li>2. Palm inward</li>
                      <li>3. Move forward and down</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Please</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Flat hand over chest</li>
                      <li>2. Rub in a small circle</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Mother</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Open hand</li>
                      <li>2. Thumb touches chin</li>
                      <li>3. Hold briefly</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Father</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Open hand</li>
                      <li>2. Thumb touches forehead</li>
                      <li>3. Hold briefly</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Deaf</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Index touches mouth</li>
                      <li>2. Then touch ear</li>
                      <li>3. Complete within 2 seconds</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Love</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Cross arms over chest</li>
                      <li>2. Wrists near shoulders</li>
                      <li>3. Hold briefly</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Good + Morning/Afternoon/Night</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Good: index near chin then move outward</li>
                      <li>2. Morning: raise one hand near the other</li>
                      <li>3. Afternoon: small downward tap</li>
                      <li>4. Night: move palm down onto the other</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bathroom</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Index + middle up</li>
                      <li>2. Wrist shakes left-right</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Friend</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Index fingers up on both hands</li>
                      <li>2. Bring tips close together</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-lime-50 to-emerald-50 dark:from-lime-900/20 dark:to-emerald-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">School</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Open palms close</li>
                      <li>2. Move up/down opposite directions</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-stone-50 to-zinc-50 dark:from-stone-900/20 dark:to-zinc-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Baby</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Closed fists</li>
                      <li>2. Rock hands left-right alternately</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Stop</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Both open palms</li>
                      <li>2. One hand slaps downward onto the other</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Yes / No</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Yes: thumbs up, other fingers down</li>
                      <li>2. No: thumb down, other fingers down</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">I Love You (ILY)</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. Thumb, index, pinky extended</li>
                      <li>2. Middle and ring curled</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">OK / Index Up</h4>
                    <ol className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1. OK: thumb and index form a circle</li>
                      <li>2. Index Up: index up, others down</li>
                    </ol>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tips</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <strong className="text-red-600 dark:text-red-400">Avoid</strong>
                      <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Rushing through signs</li>
                        <li>• Fingers mashed together</li>
                        <li>• Poor lighting</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-green-600 dark:text-green-400">Do</strong>
                      <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Hold for 2–3 seconds</li>
                        <li>• Keep hands 6–12" from camera</li>
                        <li>• Ensure clear view of face and hands</li>
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-gray-700"
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

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
