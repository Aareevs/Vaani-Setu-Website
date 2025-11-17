## Overview
Add four signs that require face and body context. Extend the Interpreter to use MediaPipe Tasks Vision face and pose landmarks alongside the existing hand landmarks, then implement lightweight heuristics and state machines to classify Mother, Father, Deaf, and Love.

## Models to Load
1. Import additional classes via the existing dynamic loader:
   - `FaceLandmarker`, `PoseLandmarker`, `FilesetResolver` from the same CDN used for `HandLandmarker`.
2. Initialize with GPU delegate and VIDEO mode:
   - Face model: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`
   - Pose model (lite for performance): `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`
3. Create refs: `faceLandmarkerRef`, `poseLandmarkerRef`, and add per-frame calls in the prediction loop similar to hands.

## Data Flow Changes
1. In `predictWebcam()`, after hands detection, call:
   - `faceLandmarker.detectForVideo(video, nowInMs)` → face landmarks (468 points)
   - `poseLandmarker.detectForVideo(video, nowInMs)` → pose landmarks (e.g., shoulders, ears, elbows, wrists)
2. Pass these additional landmarks into `drawResults()` for classification.
3. Keep performance: skip face/pose calls if no hands are detected for >N frames; run at 30 FPS with GPU.

## Heuristic Classification
1. Mother (open hand, thumb at chin):
   - Static check: hand shape "Hello/Open Hand".
   - Proximity: distance(`thumb_tip` index 4, face chin index ~152) < 0.06.
   - Stabilize: require ≥6 consecutive frames within threshold.
   - Output: `"Mother"`.

2. Father (open hand, thumb at forehead):
   - Static check: hand shape "Hello/Open Hand".
   - Proximity: distance(`thumb_tip`, face forehead center ~10) < 0.06.
   - Stabilize: ≥6 frames.
   - Output: `"Father"`.

3. Deaf (index touches mouth then ear):
   - State machine per hand: `none → mouthTouched → earTouched` with 2-second timeout.
   - Mouth proximity: index tip near mouth center (avg of inner-lip landmarks ~13,14) < 0.05.
   - Ear proximity: index tip near pose `leftEar` or `rightEar` < 0.07.
   - On sequence completion: output `"Deaf"`, reset state.

4. Love (arms crossed over chest):
   - Two-hand pattern using pose:
     - Both wrists near opposite shoulders: `right_wrist` x < `left_shoulder` x and `left_wrist` x > `right_shoulder` x.
     - Wrists y near chest region (between shoulders and hips).
     - Elbows bent: elbow-wrist distance < forearm length threshold.
     - Hold ≥8 frames.
   - Output: `"Love"`.

## Integrations in Code
1. Loader: extend `loadMediaPipe()` script to export `FaceLandmarker` and `PoseLandmarker`.
2. Initializers: add `createFaceLandmarker()` and `createPoseLandmarker()` patterned after `createHandLandmarker()`.
3. Refs/state: add refs for face/pose, and small per-gesture state objects (timers, consecutive frame counters).
4. `drawResults()`:
   - Compute distances using normalized coordinates; reuse canvas scaling where needed.
   - Insert new checks after single-hand classification and before two-hand special cases.
   - Preserve existing gestures and priority: dynamic success gestures (e.g., `Good Morning`, `Stop`) still win; otherwise show strongest match.
5. Speech: reuse the current speaking logic; avoid speaking transitional states.

## Thresholds and Safety
- Use conservative distance thresholds and minimum frames to reduce false positives.
- Mirror handling: video element is mirrored visually; landmark coordinates remain normalized — use relative distances so mirroring does not affect classification.
- Add simple debouncing so repeated triggers don’t spam output.

## Testing & Verification
1. Run locally and test each new sign:
   - Mother/Father: open hand, place thumb on chin/forehead and hold.
   - Deaf: touch mouth with index, then ear within 2 seconds.
   - Love: cross arms over chest for ~0.5–1s.
2. Confirm detections appear in “Current Translation” and history; ensure audio speaks once per detection.
3. Stress-test lighting changes and distances; tweak thresholds based on observed variance.

## Performance Considerations
- Use the lite pose model to minimize CPU/GPU load.
- Short-circuit face/pose inference when hands aren’t visible.
- Maintain 30 FPS on typical laptops; if needed, run face/pose every other frame.

## Rollout Plan
1. Implement loaders and initializers.
2. Add refs/states and integrate detection calls.
3. Implement heuristics and state machines.
4. Tune thresholds live and document constants.
5. Final pass: verify with multiple testers and refine.

## Next
On approval, I will implement the face/pose integrations and the four gesture classifiers, wire them into the output flow, and validate live.