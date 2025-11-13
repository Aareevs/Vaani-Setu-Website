import { OpenPoseResponse, OpenPoseBackendConfig } from './types';

const DEFAULT_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('OpenPose request timed out')), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function estimateFromImageData(
  base64Image: string,
  config: OpenPoseBackendConfig
): Promise<OpenPoseResponse | null> {
  const { endpoint, timeoutMs = DEFAULT_TIMEOUT_MS } = config;
  try {
    const resp = await withTimeout(
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      }),
      timeoutMs
    );

    if (!resp.ok) throw new Error(`OpenPose server error: ${resp.status}`);
    const json = (await resp.json()) as OpenPoseResponse;
    return json;
  } catch (e) {
    console.error('OpenPose estimate error:', e);
    return null;
  }
}

export function getOpenPoseConfig(): OpenPoseBackendConfig | null {
  const endpoint = import.meta.env.VITE_OPENPOSE_ENDPOINT as string | undefined;
  if (!endpoint) return null;
  return { endpoint, timeoutMs: 7000 };
}