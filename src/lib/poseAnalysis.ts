import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export interface PoseFeatures {
  shoulderWidthPx: number;
  hipWidthPx: number;
  shoulderToHipRatio: number;
  torsoLengthPx: number;
  shoulderToTorsoRatio: number;
  visibility: {
    shoulders: number;
    hips: number;
  };
  detected: boolean;
  note?: string;
}

let landmarkerPromise: Promise<PoseLandmarker> | null = null;

async function getLandmarker(): Promise<PoseLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );
      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numPoses: 1,
      });
    })();
  }
  return landmarkerPromise;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function extractPoseFeatures(imageDataUrl: string): Promise<PoseFeatures | null> {
  try {
    const landmarker = await getLandmarker();
    const img = await loadImage(imageDataUrl);
    const result = landmarker.detect(img);

    const lm = result.landmarks?.[0];
    if (!lm || lm.length < 33) {
      return { detected: false, shoulderWidthPx: 0, hipWidthPx: 0, shoulderToHipRatio: 0, torsoLengthPx: 0, shoulderToTorsoRatio: 0, visibility: { shoulders: 0, hips: 0 }, note: "No pose detected" };
    }

    const w = img.naturalWidth;
    const h = img.naturalHeight;

    // MediaPipe Pose indices: 11=L shoulder, 12=R shoulder, 23=L hip, 24=R hip
    const ls = lm[11], rs = lm[12], lh = lm[23], rh = lm[24];

    const px = (a: any, b: any) =>
      Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);

    const shoulderWidthPx = px(ls, rs);
    const hipWidthPx = px(lh, rh);

    const shoulderMid = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
    const hipMid = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
    const torsoLengthPx = px(shoulderMid, hipMid);

    const shoulderVis = ((ls.visibility ?? 0) + (rs.visibility ?? 0)) / 2;
    const hipVis = ((lh.visibility ?? 0) + (rh.visibility ?? 0)) / 2;

    return {
      detected: true,
      shoulderWidthPx: Math.round(shoulderWidthPx),
      hipWidthPx: Math.round(hipWidthPx),
      shoulderToHipRatio: hipWidthPx > 0 ? +(shoulderWidthPx / hipWidthPx).toFixed(3) : 0,
      torsoLengthPx: Math.round(torsoLengthPx),
      shoulderToTorsoRatio: torsoLengthPx > 0 ? +(shoulderWidthPx / torsoLengthPx).toFixed(3) : 0,
      visibility: {
        shoulders: +shoulderVis.toFixed(2),
        hips: +hipVis.toFixed(2),
      },
    };
  } catch (err) {
    console.warn("Pose extraction failed:", err);
    return null;
  }
}
