import { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, Save, X } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useToast } from '../hooks/useToast';

interface SignTeacherProps {
  onClose: () => void;
  onSignSaved: () => void;
  lastLandmarksRef: React.MutableRefObject<any>; // Using any for HandLandmarkerResult to avoid import issues
  stream: MediaStream;
  handLandmarker?: any; // kept for compatibility but unused
}

export default function SignTeacher({ onClose, onSignSaved, lastLandmarksRef, stream }: SignTeacherProps) {
  const { addToast } = useToast();
  const [signName, setSignName] = useState('');
  const [signType, setSignType] = useState<'static' | 'dynamic'>('static');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordedData, setRecordedData] = useState<any>(null);
  const [previewLandmarks, setPreviewLandmarks] = useState<any[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const recordingBufferRef = useRef<any[]>([]);

  // Initialize Video from Stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Drawing Loop (uses shared landmarks)
  useEffect(() => {
    const draw = () => {
      if (canvasRef.current && lastLandmarksRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const results = lastLandmarksRef.current;

        if (ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            setPreviewLandmarks(landmarks); // Store for capture
            
            // Draw skeleton
            for (const landmark of landmarks) {
              ctx.beginPath();
              ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "#00FF00";
              ctx.fill();
            }
            
            // If recording dynamic sign, push to buffer
            if (isRecording) {
              recordingBufferRef.current.push(landmarks);
            }
          } else {
            setPreviewLandmarks([]);
          }
        }
      }
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRecording, lastLandmarksRef]);

  const handleCaptureStatic = () => {
    if (previewLandmarks.length === 0) {
      addToast("No hand detected! Please show your hand.", "error");
      return;
    }
    
    // Normalize landmarks (relative to wrist) to make it position-invariant
    const wrist = previewLandmarks[0];
    const normalizedLandmarks = previewLandmarks.map(lm => ({
      x: lm.x - wrist.x,
      y: lm.y - wrist.y,
      z: lm.z - wrist.z
    }));

    setRecordedData({
      landmarks: normalizedLandmarks,
      rawLandmarks: previewLandmarks // Keep raw for debugging/preview
    });
    addToast("Static sign captured!", "success");
  };

  const handleStartRecording = () => {
    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setIsRecording(true);
        recordingBufferRef.current = [];
        addToast("Recording started...", "info");
      }
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const frames = recordingBufferRef.current;
    
    if (frames.length < 10) {
      addToast("Recording too short. Please try again.", "error");
      return;
    }

    // Process Dynamic Data
    // 1. Extract Start Shape (first 5 frames average)
    // 2. Extract End Shape (last 5 frames average)
    // 3. Calculate Motion Vector (wrist movement)
    
    const startFrame = frames[0];
    const endFrame = frames[frames.length - 1];
    
    // Calculate average motion vector of the wrist
    const startWrist = startFrame[0];
    const endWrist = endFrame[0];
    const motionVector = {
      x: endWrist.x - startWrist.x,
      y: endWrist.y - startWrist.y,
      z: endWrist.z - startWrist.z
    };

    setRecordedData({
      type: 'dynamic',
      startShape: startFrame, // Simplified: just take first frame
      endShape: endFrame,     // Simplified: just take last frame
      motionVector: motionVector,
      frameCount: frames.length
    });
    
    addToast("Dynamic sign recorded!", "success");
  };

  const handleSave = async () => {
    if (!signName.trim()) {
      addToast("Please enter a name for the sign", "error");
      return;
    }
    if (!recordedData) {
      addToast("Please capture or record a sign first", "error");
      return;
    }

    try {
      const { error } = await supabase
        .from('learned_signs')
        .insert({
          name: signName.trim(),
          type: signType,
          data: recordedData
        });

      if (error) throw error;

      addToast(`Successfully learned sign: ${signName}`, "success");
      onSignSaved();
      onClose();
    } catch (error: any) {
      console.error("Save error:", error);
      addToast("Failed to save sign: " + error.message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teach Vaani a New Sign</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sign Name</label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder="e.g., Peace, Wave, Thumbs Up"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sign Type</label>
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button
                    onClick={() => { setSignType('static'); setRecordedData(null); }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      signType === 'static'
                        ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Static (Pose)
                  </button>
                  <button
                    onClick={() => { setSignType('dynamic'); setRecordedData(null); }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      signType === 'dynamic'
                        ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Dynamic (Motion)
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {signType === 'static' 
                    ? "Best for signs that are held in one position (e.g., 'A', 'B', 'Peace')." 
                    : "Best for signs that involve movement (e.g., 'Hello', 'Thank You', 'Sleep')."}
                </p>
              </div>

              <div className="pt-4">
                {signType === 'static' ? (
                  <button
                    onClick={handleCaptureStatic}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Snapshot
                  </button>
                ) : (
                  !isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      {countdown > 0 ? `Starting in ${countdown}...` : "Start Recording"}
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors animate-pulse"
                    >
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </button>
                  )
                )}
              </div>

              {recordedData && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-medium">Data Captured Successfully</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    {signType === 'static' 
                      ? "Hand landmarks captured. Ready to save." 
                      : `Motion sequence captured (${recordedData.frameCount} frames). Ready to save.`}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {/* Overlay UI */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-mono">
                {isRecording ? "REC ●" : "LIVE"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!recordedData || !signName.trim()}
            className={`px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
              recordedData && signName.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Sign
          </button>
        </div>
      </div>
    </div>
  );
}
