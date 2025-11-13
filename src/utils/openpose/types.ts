export interface Keypoint2D {
  x: number; // normalized 0..1 in image space
  y: number; // normalized 0..1 in image space
  confidence?: number;
}

export interface OpenPoseHandResult {
  // 21 keypoints following OpenPose hand indexing
  keypoints: Keypoint2D[]; // length 21
  handedness?: 'Left' | 'Right';
}

export interface OpenPoseBodyResult {
  // 25 body keypoints (COCO/Body25 depending on backend)
  keypoints: Keypoint2D[]; // variable length depending on model
}

export interface OpenPoseResponse {
  hands?: OpenPoseHandResult[];
  body?: OpenPoseBodyResult[];
  face?: Keypoint2D[];
}

export type OpenPoseBackendConfig = {
  endpoint: string; // e.g. process-frames API
  timeoutMs?: number;
};