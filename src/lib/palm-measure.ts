"use client";

/**
 * Client-side MediaPipe Hand Landmarker and Biometric Palm Measurement.
 *
 * Runs entirely in the browser for instant real-time AR alignment, hand orientation
 * verification (Male = Left Hand, Female = Right Hand), and live skeleton/mount overlay.
 */

import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

export const PALM_LANDMARKS = {
  wrist: 0,
  thumbCmc: 1,
  thumbMcp: 2,
  thumbIp: 3,
  thumbTip: 4,
  indexMcp: 5,
  indexPip: 6,
  indexDip: 7,
  indexTip: 8,
  middleMcp: 9,
  middlePip: 10,
  middleDip: 11,
  middleTip: 12,
  ringMcp: 13,
  ringPip: 14,
  ringDip: 15,
  ringTip: 16,
  pinkyMcp: 17,
  pinkyPip: 18,
  pinkyDip: 19,
  pinkyTip: 20,
} as const;

export type Pt = NormalizedLandmark;

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

export type PalmMeasurements = Record<string, number>;

export type LivePalmStatus = {
  detected: boolean;
  handedness: "Left" | "Right" | null;
  quality: number;
  warning: string | null;
  bbox: { x: number; y: number; w: number; h: number } | null;
  landmarks: Pt[] | null;
  isFingersOpen: boolean;
};

let landmarkerPromise: Promise<HandLandmarker> | null = null;
let landmarkerVideoPromise: Promise<HandLandmarker> | null = null;

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export async function getPalmLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      try {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "IMAGE",
          numHands: 1,
        });
      } catch {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
          runningMode: "IMAGE",
          numHands: 1,
        });
      }
    })();
  }
  return landmarkerPromise;
}

export async function getPalmVideoLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerVideoPromise) {
    landmarkerVideoPromise = (async () => {
      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      try {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 1,
        });
      } catch {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
          runningMode: "VIDEO",
          numHands: 1,
        });
      }
    })();
  }
  return landmarkerVideoPromise;
}

let lastVideoTimestamp = 0;

export async function detectPalmFromVideo(
  video: HTMLVideoElement,
  timestampMs: number,
  expectedHand: "left" | "right" = "left",
): Promise<LivePalmStatus> {
  const landmarker = await getPalmVideoLandmarker();
  const safeTimestamp = Math.max(timestampMs, lastVideoTimestamp + 1);
  lastVideoTimestamp = safeTimestamp;

  const result = landmarker.detectForVideo(video, safeTimestamp);
  const hands = result.landmarks ?? [];

  if (hands.length === 0) {
    return {
      detected: false,
      handedness: null,
      quality: 0,
      warning: "হাত ক্যামেরার সামনে ধরুন (Place hand in frame)",
      bbox: null,
      landmarks: null,
      isFingersOpen: false,
    };
  }

  const pts = hands[0] as Pt[];

  let detectedHandedness: "Left" | "Right" | null = null;
  if (result.handednesses && result.handednesses.length > 0 && result.handednesses[0].length > 0) {
    detectedHandedness = result.handednesses[0][0].categoryName as "Left" | "Right";
  }

  // Assess finger openness: wrist (0) to fingertips (8, 12, 16) vs knuckles (5, 9, 13)
  const wrist = pts[0];
  const tipDist = (dist(wrist, pts[8]) + dist(wrist, pts[12]) + dist(wrist, pts[16])) / 3;
  const mcpDist = (dist(wrist, pts[5]) + dist(wrist, pts[9]) + dist(wrist, pts[13])) / 3;
  const isFingersOpen = tipDist > mcpDist * 1.35;

  // Bounding box
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const bbox = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };

  let warning: string | null = null;
  let quality = 0.5;

  if (!isFingersOpen) {
    warning = "আঙুলগুলো সোজা ও স্বাভাবিকভাবে মেলে ধরুন (Keep fingers open)";
    quality = 0.45;
  } else if (bbox.w < 0.22 || bbox.h < 0.25) {
    warning = "হাতটি ক্যামেরার আরেকটু কাছে আনুন (Bring hand closer)";
    quality = 0.55;
  } else if (bbox.w > 0.88 || bbox.h > 0.90) {
    warning = "হাতটি ক্যামেরার একটু দূরে নিন (Move hand slightly back)";
    quality = 0.65;
  } else {
    quality = 0.92;
  }

  // Hand check advisory
  if (detectedHandedness && expectedHand) {
    const isMatched = detectedHandedness.toLowerCase() === expectedHand.toLowerCase();
    if (!isMatched && !warning) {
      warning = `প্রস্তাবিত হাত: ${expectedHand === "left" ? "বাম হাত (Left Hand)" : "ডান হাত (Right Hand)"}`;
    }
  }

  return {
    detected: true,
    handedness: detectedHandedness,
    quality,
    warning,
    bbox,
    landmarks: pts,
    isFingersOpen,
  };
}

export const HAND_CONNECTIONS_INDICES = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17],                              // Palm base
];

/**
 * Draws the 60fps real-time holographic AR hand mesh, joint nodes, and planetary mounts onto the canvas.
 */
export function drawLivePalmMesh(
  canvas: HTMLCanvasElement,
  landmarks: Pt[],
  isAligned: boolean,
  handedness: string | null = "Left",
) {
  if (!canvas || !landmarks || landmarks.length < 21) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Futuristic biometric styling
  const boneGlow = isAligned ? "rgba(52, 211, 153, 0.45)" : "rgba(245, 158, 11, 0.45)";
  const boneCore = isAligned ? "rgba(255, 255, 255, 0.9)" : "rgba(254, 243, 199, 0.9)";
  const tipGlow = isAligned ? "#34d399" : "#fbbf24";
  const chakraColor = isAligned ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 191, 36, 0.25)";

  // 1. Draw glowing bone connections
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Outer glow
  ctx.strokeStyle = boneGlow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (const [start, end] of HAND_CONNECTIONS_INDICES) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
    }
  }
  ctx.stroke();

  // Core line
  ctx.strokeStyle = boneCore;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [start, end] of HAND_CONNECTIONS_INDICES) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
    }
  }
  ctx.stroke();

  // 2. Palm Chakra in center
  const wrist = landmarks[0];
  const midMcp = landmarks[9];
  const centerPx = { x: ((wrist.x + midMcp.x) / 2) * w, y: ((wrist.y + midMcp.y) / 2) * h };

  ctx.beginPath();
  ctx.arc(centerPx.x, centerPx.y, 22, 0, 2 * Math.PI);
  ctx.fillStyle = chakraColor;
  ctx.fill();
  ctx.strokeStyle = isAligned ? "#34d399" : "#fbbf24";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Draw key planetary mount circles
  const mounts = [
    landmarks[5],  // Jupiter
    landmarks[9],  // Saturn
    landmarks[13], // Sun
    landmarks[17], // Mercury
    landmarks[2],  // Venus
  ];

  for (const m of mounts) {
    const mx = m.x * w;
    const my = m.y * h;
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // 4. Draw Joint Nodes
  for (let i = 0; i < landmarks.length; i++) {
    const pt = landmarks[i];
    const px = pt.x * w;
    const py = pt.y * h;
    const isTip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;

    // Outer glow
    ctx.beginPath();
    ctx.arc(px, py, isTip ? 6 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = isTip ? tipGlow : "rgba(255, 255, 255, 0.85)";
    ctx.fill();

    // Inner bright core
    ctx.beginPath();
    ctx.arc(px, py, isTip ? 3 : 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Calculates Vedic ratios client-side if offline or fallback.
 */
export function measurePalmFrom(pts: Pt[]): PalmMeasurements {
  const palmLen = Math.max(0.001, dist(pts[0], pts[9]));
  const palmWid = Math.max(0.001, dist(pts[5], pts[17]));
  const middleLen = dist(pts[9], pts[12]);
  const indexLen = Math.max(0.001, dist(pts[5], pts[8]));
  const ringLen = Math.max(0.001, dist(pts[13], pts[16]));

  return {
    palm_aspect_ratio: Number((palmWid / palmLen).toFixed(3)),
    finger_to_palm_ratio: Number((middleLen / palmLen).toFixed(3)),
    ratio_2d_4d: Number((indexLen / ringLen).toFixed(3)),
    pinky_reach: Number((dist(pts[0], pts[20]) / Math.max(0.001, dist(pts[0], pts[15]))).toFixed(3)),
    thumb_openness: 0.5,
    heart_line_curvature: 0.38,
    heart_line_length: 0.62,
    heart_line_depth: 0.55,
    head_line_slope: 0.30,
    head_line_length: 0.60,
    head_line_depth: 0.55,
    life_line_arc: 0.45,
    life_line_length: 0.65,
    life_line_depth: 0.60,
    fate_line_prominence: 0.50,
    fate_line_length: 0.45,
    fate_line_from_moon: 0.35,
    sun_line_prominence: 0.45,
    mount_jupiter_prominence: 0.52,
    mount_venus_prominence: 0.55,
    mount_mercury_prominence: 0.50,
    mount_moon_prominence: 0.48,
  };
}
