# Vaani Setu - Comprehensive Technical Documentation

> **Note for Notion**: This document is formatted to be easily copied into a Notion database or page. It uses toggle headers, callouts, and code blocks for clarity.

---

## 1. Project Overview & Tech Stack

**Vaani Setu** is a Progressive Web App (PWA) designed to bridge the communication gap between sign language users and non-signers using AI-powered real-time interpretation.

### **Core Technology Stack**

| Layer                  | Technology        | Version | Purpose                                                                   |
| :--------------------- | :---------------- | :------ | :------------------------------------------------------------------------ |
| **Frontend Framework** | **React**         | 18.3.1  | Component-based UI architecture.                                          |
| **Language**           | **TypeScript**    | 5.0+    | Static typing for reliability and developer experience.                   |
| **Build Tool**         | **Vite**          | 6.3.5   | Extremely fast dev server and optimized production builds.                |
| **Styling**            | **Tailwind CSS**  | 3.4.17  | Utility-first CSS framework for rapid UI development.                     |
| **Icons**              | **Lucide React**  | 0.469.0 | Lightweight, consistent icon set.                                         |
| **Animations**         | **Framer Motion** | 11.15.0 | Complex layout transitions and micro-interactions.                        |
| **Routing**            | **Custom State**  | N/A     | React State-based routing (Single Page App behavior without URL changes). |

### **AI & Machine Learning**

| Library                | Purpose                                   | Key Modules Used                                                                 |
| :--------------------- | :---------------------------------------- | :------------------------------------------------------------------------------- |
| **MediaPipe** (Google) | real-time computer vision in the browser. | `@mediapipe/tasks-vision`, `HandLandmarker`, `FaceLandmarker`, `PoseLandmarker`. |
| **Google Gemini**      | Generative AI for the Chatbot assistant.  | `@google/generative-ai` (Gemini 1.5 Flash).                                      |

### **Backend & Services**

| Service            | Purpose                                                               |
| :----------------- | :-------------------------------------------------------------------- |
| **Supabase**       | Backend-as-a-Service (BaaS) for Auth, Database, and Realtime.         |
| **Web Speech API** | Browser-native API for Text-to-Speech (TTS) and Speech-to-Text (STT). |

---

## 2. Architecture & Operational Flow

### **2.1. Application Entry Point (`main.tsx` & `App.tsx`)**

- **Entry**: `main.tsx` mounts the React application into the DOM.
- **Context**: Wraps the app in `AuthProvider` (auth state) and `ToastProvider` (notifications).
- **Routing Logic**:
  - Vaani Setu does **not** use a standard router like `react-router-dom`.
  - **State**: Uses a `currentPage` state variable (Type: `Page` enum) in `App.tsx` to conditionally render components.
  - **Persistence**: Saves `vaani:currentPage` to `localStorage` so the user stays on the same page after a refresh.
  - **Auth Guards**: Automatically redirects unauthenticated users to 'landing' and authenticated users to 'dashboard' if they visit public pages.

### **2.2. Authentication System (`AuthContext.tsx`)**

- **Provider**: Supabase Auth (Email/Password & Google OAuth).
- **Session Management**:
  - On mount, it checks `supabase.auth.getSession()`.
  - It subscribes to `onAuthStateChange` to react to login/logout/token refresh events in real-time.
- **User Profile**:
  - Fetches extended profile data (avatar, username) from the `profiles` table in Supabase, falling back to Auth Metadata if the profile row doesn't exist yet.

---

## 3. The Interpreter Engine (Deep Dive)

The **Interpreter** is the core feature, located in `src/components/InterpreterPage.tsx`. It runs entirely on the client side (in the browser) for privacy and zero latency.

### **3.1. Initialization Phase**

1.  **Camera Access**: Requests `navigator.mediaDevices.getUserMedia()` for video stream.
2.  **Model Loading**: Asynchronously loads 3 MediaPipe models:
    - **HandLandmarker**: Detects 21 points per hand (Knuckles, Tips, Wrist).
    - **FaceLandmarker**: Detects 478 face points (Mouth, Eyes, Contour).
    - **PoseLandmarker**: Detects 33 body points (Shoulders, Elbows).

### **3.2. Detection Loop (The "Heartbeat")**

Runs via `requestAnimationFrame` generally at 60 FPS.

1.  **Frame Capture**: Takes the current video frame.
2.  **Inference**: Sends the frame to MediaPipe models.
3.  **Coordinate Space**: Returns normalized coordinates (0.0 to 1.0) relative to frame width/height.

### **3.3. Sign Logic: Static vs. Dynamic**

#### **A. Static Signs (Pose Processing)**

_Signs that are held still (e.g., "OK", "Yes")._

- **Algorithm**: Geometric Heuristics.
- **Steps**:
  1.  **Finger States**: Calculates `isFingerUp` by comparing Tip vs. Joint Y-coordinates.
  2.  **Distance Checks**: Calculates Euclidean distance between key points.
      - _Example ("Eat")_: IF (ThumbTip distance to Mouth < 0.1) AND (All fingers touching thumb).
  3.  **Rule Matching**:
      - `High Five / Hello`: All 5 fingers UP.
      - `I Love You`: Thumb UP + Index UP + Pinky UP (Middle/Ring DOWN).
      - `Yes`: Thumbs UP (Fist closed).

#### **B. Dynamic Gestures (Motion Processing)**

_Signs that involve movement (e.g., "Good Morning")._

- **Algorithm**: State Machine per Hand (`trackDynamicGestures`).
- **Structure**:
  - **INPUT**: Current Static Sign + Frame History (Array of last 24 positions).
  - **STATE**: `none` -> `stage_1` -> `stage_2` -> `complete`.
- **Example: "Good Morning"**:
  1.  **Start State**: Detect "Yes" (Fist with thumb up).
  2.  **Transition**: Hand moves UPWARD (Y-coordinate decreases significantly) for > 5 frames.
  3.  **End State**: Hand opens to "Hello" (Open Palm).
  4.  **Action**: If sequence 1->2->3 completes within `STATE_TIMEOUT` (120 frames), trigger "Good Morning".

#### **C. Multi-Modal Signs (Context Aware)**

_Signs that require face or body context._

- **Mother**: Thumb of Open Hand touches **Chin** (`faceLandmarks[152]`).
- **Father**: Thumb of Open Hand touches **Forehead** (`faceLandmarks[10]`).
- **Deaf**: Index finger touches **Mouth** then **Ear**.
- **Love**: Crossed Arms (Left Wrist X > Right Wrist X).

### **3.4. Teacher Mode ("Teach Vaani")**

Located in `src/components/SignTeacher.tsx`. allows users to extend the system.

- **Recording**: Captures a stream of landmarks (for dynamic) or a snapshot (for static).
- **Normalization**: Subtracts the Wrist coordinate from all other points to make the sign "location invariant" (works wherever the hand is).
- **Storage**: Saves the normalized vector data to Supabase `learned_signs` table.

---

## 4. Feature Details

### **4.1. Vaani AI Chatbot**

- **Engine**: Gemini 1.5 Flash via REST API.
- **Connection**:
  - Uses a heartbeat check (`testGeminiConnection`) every 30 seconds to update the UI "Status Light" (Online/Offline).
- **Safety**:
  - **Profanity Filter**: Regex-based check on local input before sending to API.
- **Voice**:
  - **Speech-to-Text**: Uses `window.webkitSpeechRecognition`.
  - **Flow**: Record -> Transcribe -> Send Text to Gemini -> Display Response.

### **4.2. Offline Capabilities (PWA)**

- **Service Worker**: Configured via `vite-plugin-pwa`.
- **Caching**:
  - Caches bundle assets (JS/CSS/HTML).
  - Caches API responses where applicable.
- **Indicator**: `OfflineIndicator` component listens to `window.ononline`/`onoffline` events to show a banner when the internet drops.

---

## 5. System Limitations & Known Issues

1.  **Lighting Sensitivity**: MediaPipe tracking quality degrades significantly in low light or strong backlight.
2.  **Occlusion**: Signs where hands cross each other or cover the face (like "Peekaboo") are difficult to track accurately.
3.  **Z-Axis Depth**: Single camera setup makes depth perception (Z-axis) an estimation, making signs like pointing "forward" vs "up" sometimes ambiguous.
4.  **Browser Support**: Web Speech API is not supported in Firefox by default; Voice Recorder requires Chrome/Edge/Safari.
