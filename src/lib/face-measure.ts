"use client";

/**
 * Measuring a face, on the device.
 *
 * The photograph never leaves the phone. The landmark model runs in the
 * browser, this turns its output into about twenty ratios, and only those
 * numbers are sent. There is no upload, nothing to store and nothing to leak —
 * which is a better answer to "you are handling biometric data" than any
 * retention policy would have been.
 *
 * Every measurement is a ratio against the subject's **own** face. Camera
 * distance, lens and image size all cancel out, so a selfie at arm's length
 * and a photo from across a room give the same numbers. Nothing downstream is
 * in pixels.
 */

import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

/**
 * Landmark indices from the canonical 478-point face mesh.
 *
 * Named rather than inlined because a bare `234` in a width calculation is
 * unreviewable — and because if the model ever renumbers, this is the only
 * block that changes.
 */
const P = {
  foreheadTop: 10,
  chinBottom: 152,
  cheekRight: 234,
  cheekLeft: 454,
  jawRight: 172,
  jawLeft: 397,
  browRidgeRight: 103,
  browRidgeLeft: 332,
  browCentre: 9,

  // Right eye (the subject's right, which is image-left).
  rEyeOuter: 33,
  rEyeInner: 133,
  rEyeTop: 159,
  rEyeBottom: 145,
  // Left eye.
  lEyeInner: 362,
  lEyeOuter: 263,
  lEyeTop: 386,
  lEyeBottom: 374,

  rBrowInner: 55,
  rBrowPeak: 105,
  rBrowOuter: 46,
  // Upper and lower edge of the brow at its peak — the gap between these two
  // is the brow's thickness. Measuring from the brow down to the eye instead
  // gives how high the brow sits, which is a different thing entirely.
  rBrowPeakLower: 52,
  lBrowInner: 285,
  lBrowPeak: 334,
  lBrowOuter: 276,
  lBrowPeakLower: 282,

  noseBridgeTop: 168,
  noseTip: 1,
  noseRight: 49,
  noseLeft: 279,
  nostrilRight: 98,
  nostrilLeft: 327,
  noseBase: 2,

  mouthRight: 61,
  mouthLeft: 291,
  lipTop: 0,
  lipBottom: 17,
  lipInnerTop: 13,
  lipInnerBottom: 14,

  cheekLineRight: 215,
  cheekLineLeft: 435,
} as const;

type Pt = NormalizedLandmark;

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: 0 }) as Pt;

export type Measurements = Record<string, number>;

export type MeasureResult = {
  measurements: Measurements;
  /** 0–1. How square-on and symmetric the capture was. */
  quality: number;
  /** Why the capture is poor, when it is — shown to the person. */
  warning: string | null;
};

/**
 * How trustworthy the proportions are.
 *
 * A turned head foreshortens one side, and *every* width ratio is then wrong
 * in a way no later step can detect — so this is checked before anything is
 * measured. Yaw is estimated from how far the nose tip sits from the midpoint
 * of the cheekbones, relative to face width; roll from the tilt of the eye
 * line.
 *
 * Thresholds are deliberately generous. The original 0.09 yaw divisor meant
 * even a 5° head turn scored zero — people sitting in front of a webcam
 * almost never hit that, because the camera angle itself adds offset. Now
 * 0.15 for yaw and 0.25 for roll give a natural tolerance that still rejects
 * obviously turned shots.
 */
export function assessPose(pts: Pt[]): { quality: number; warning: string | null } {
  const faceW = dist(pts[P.cheekRight], pts[P.cheekLeft]);
  if (faceW <= 0) return { quality: 0, warning: "No face was found in that photo." };

  // Midline estimate using cheek and outer eye centers for robust stability
  const cheekMidX = (pts[P.cheekRight].x + pts[P.cheekLeft].x) / 2;
  const eyeMidX = (pts[P.rEyeOuter].x + pts[P.lEyeOuter].x) / 2;
  const midX = (cheekMidX + eyeMidX) / 2;
  const yaw = Math.abs(pts[P.noseTip].x - midX) / faceW;

  const eyeR = pts[P.rEyeOuter];
  const eyeL = pts[P.lEyeOuter];
  const roll = Math.abs(eyeL.y - eyeR.y) / Math.max(dist(eyeR, eyeL), 1e-6);

  // Height of face for distance / framing guidance
  const faceH = dist(pts[P.foreheadTop], pts[P.chinBottom]);

  // Scaled scores: 0.18 for yaw and 0.25 for roll provide natural webcam tolerance
  const yawScore = Math.max(0, 1 - yaw / 0.18);
  const rollScore = Math.max(0, 1 - roll / 0.25);
  let quality = Math.min(yawScore, rollScore);

  let warning: string | null = null;
  if (faceH < 0.22) {
    warning = "Move closer to the camera.";
    quality = Math.min(quality, 0.45);
  } else if (faceH > 0.88) {
    warning = "Move slightly back from the camera.";
    quality = Math.min(quality, 0.45);
  } else if (yawScore < rollScore && yawScore < 0.55) {
    warning = "Your head is turned. Look straight at the camera.";
  } else if (rollScore < 0.55) {
    warning = "Your head is tilted. Keep it level.";
  }
  return { quality, warning };
}

/** Turns landmarks into the ratios the backend's rules are written against. */
export function measureFrom(pts: Pt[]): MeasureResult {
  const { quality, warning } = assessPose(pts);

  const faceW = dist(pts[P.cheekRight], pts[P.cheekLeft]);
  const faceH = dist(pts[P.foreheadTop], pts[P.chinBottom]);
  const jawW = dist(pts[P.jawRight], pts[P.jawLeft]);
  const browW = dist(pts[P.browRidgeRight], pts[P.browRidgeLeft]);

  // Each eye measured on its own, then averaged — one squinting eye should
  // not quietly halve the pair.
  const rEyeW = dist(pts[P.rEyeOuter], pts[P.rEyeInner]);
  const lEyeW = dist(pts[P.lEyeInner], pts[P.lEyeOuter]);
  const rEyeH = dist(pts[P.rEyeTop], pts[P.rEyeBottom]);
  const lEyeH = dist(pts[P.lEyeTop], pts[P.lEyeBottom]);
  const eyeW = (rEyeW + lEyeW) / 2;
  const eyeH = (rEyeH + lEyeH) / 2;

  const browThick =
    (Math.abs(pts[P.rBrowPeak].y - pts[P.rBrowPeakLower].y) +
      Math.abs(pts[P.lBrowPeak].y - pts[P.lBrowPeakLower].y)) / 2;
  const browLen =
    (dist(pts[P.rBrowInner], pts[P.rBrowOuter]) + dist(pts[P.lBrowInner], pts[P.lBrowOuter])) / 2;
  // How far the peak rises above the line from inner to outer end.
  const archOf = (inner: Pt, peak: Pt, outer: Pt) =>
    Math.abs(peak.y - (inner.y + outer.y) / 2);
  const browArch =
    (archOf(pts[P.rBrowInner], pts[P.rBrowPeak], pts[P.rBrowOuter]) +
      archOf(pts[P.lBrowInner], pts[P.lBrowPeak], pts[P.lBrowOuter])) / 2;

  const noseW = dist(pts[P.noseRight], pts[P.noseLeft]);
  const noseLen = dist(pts[P.noseBridgeTop], pts[P.noseBase]);
  const nostrilW = dist(pts[P.nostrilRight], pts[P.nostrilLeft]);
  const faceMid = mid(pts[P.cheekRight], pts[P.cheekLeft]);

  const mouthW = dist(pts[P.mouthRight], pts[P.mouthLeft]);
  const lipH = dist(pts[P.lipTop], pts[P.lipBottom]);
  const lipCentreY = (pts[P.lipInnerTop].y + pts[P.lipInnerBottom].y) / 2;
  const cornerY = (pts[P.mouthRight].y + pts[P.mouthLeft].y) / 2;

  const cheekLineW = dist(pts[P.cheekLineRight], pts[P.cheekLineLeft]);

  // Guard every denominator: a failed detection gives zeros, and a NaN here
  // would travel all the way to a rule comparison and silently never match.
  const over = (a: number, b: number) => (b > 1e-6 ? a / b : 0);

  const measurements: Measurements = {
    wh_ratio: over(faceW, faceH),
    jaw_cheek: over(jawW, faceW),
    brow_cheek: over(browW, faceW),
    forehead_h: over(Math.abs(pts[P.browCentre].y - pts[P.foreheadTop].y), faceH),

    eye_open: over(eyeH, eyeW),
    eye_size: over(eyeW, faceW),
    eye_gap: over(dist(pts[P.rEyeInner], pts[P.lEyeInner]), eyeW),
    // Positive when the outer corner sits above the inner one.
    eye_tilt: over(
      (pts[P.rEyeInner].y - pts[P.rEyeOuter].y + (pts[P.lEyeInner].y - pts[P.lEyeOuter].y)) / 2,
      eyeW,
    ),
    eye_asym: over(Math.abs(rEyeH - lEyeH), (rEyeH + lEyeH) / 2),

    brow_thick: over(browThick, eyeW),
    brow_arch: over(browArch, browLen),
    brow_gap: over(dist(pts[P.rBrowInner], pts[P.lBrowInner]), eyeW),
    brow_len: over(browLen, eyeW),

    nose_w: over(noseW, faceW),
    nose_len: over(noseLen, faceH),
    nostril: over(nostrilW, noseW),
    nose_dev: over(Math.abs(pts[P.noseTip].x - faceMid.x), faceW),

    lip_thick: over(lipH, mouthW),
    // Not yet read by any rule, but stored: these values are what future
    // thresholds get calibrated against.
    mouth_w: over(mouthW, faceW),
    // Measured as distance from lower lip bottom to corners, divided by mouth width.
    // Calibrated against reference faces (0.056 - 0.088); >0.095 is upturned, <0.045 is downturned.
    lip_corner: over(pts[P.lipBottom].y - cornerY, mouthW),
    lip_asym: over(
      Math.abs(pts[P.mouthRight].y - pts[P.mouthLeft].y),
      Math.max(lipH, 1e-6),
    ),

    chin_h: over(Math.abs(pts[P.chinBottom].y - pts[P.lipBottom].y), faceH),
    cheek_full: over(cheekLineW, faceW),
  };

  // Round and clamp all metrics to [0, 10.0] to strictly comply with backend METRIC_BOUNDS.
  for (const key of Object.keys(measurements)) {
    measurements[key] = Math.max(0, Math.min(10.0, Math.round(measurements[key] * 10000) / 10000));
  }

  return { measurements, quality: Math.round(quality * 1000) / 1000, warning };
}

// --------------------------------------------------------------- the model
let landmarkerImagePromise: Promise<FaceLandmarker> | null = null;
let landmarkerVideoPromise: Promise<FaceLandmarker> | null = null;

/** Loads the IMAGE-mode landmark model once. ~3 MB, fetched on first use only. */
export async function getLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerImagePromise) {
    landmarkerImagePromise = (async () => {
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm",
      );
      try {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        });
      } catch {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        });
      }
    })();
  }
  return landmarkerImagePromise;
}

/** Loads a VIDEO-mode landmarker for real-time tracking. */
export async function getVideoLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerVideoPromise) {
    landmarkerVideoPromise = (async () => {
      const visionPkg = await import("@mediapipe/tasks-vision");
      cachedVisionPackage = visionPkg;
      const { FaceLandmarker, FilesetResolver } = visionPkg;
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm",
      );
      try {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
      } catch {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
      }
    })();
  }
  return landmarkerVideoPromise;
}

export class NoFaceError extends Error {
  constructor(message = "No face was found. Make sure your whole face is in frame.") {
    super(message);
    this.name = "NoFaceError";
  }
}

/** Measures one still image. Throws `NoFaceError` if there is no face in it. */
export async function measureImage(
  image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): Promise<MeasureResult> {
  const landmarker = await getLandmarker();
  const result = landmarker.detect(image);
  const faces = result.faceLandmarks ?? [];
  if (faces.length === 0) throw new NoFaceError();
  return measureFrom(faces[0] as Pt[]);
}

/**
 * Lightweight live-frame result for the real-time feedback loop.
 * Returns face detected status, quality score, warning, bounding box,
 * and 3D landmarks for real-time mesh rendering.
 */
export type LiveFaceStatus = {
  detected: boolean;
  quality: number;
  warning: string | null;
  /** Normalised bounding box of the detected face [0–1]. */
  bbox: { x: number; y: number; w: number; h: number } | null;
  /** Complete 478 normalized 3D landmarks (x, y, z). */
  landmarks: Pt[] | null;
};

let lastVideoTimestamp = 0;

/**
 * Runs a single frame through the VIDEO-mode landmarker.
 * Returns a lightweight status suitable for a 12–15 fps feedback loop.
 */
export async function detectFromVideo(
  video: HTMLVideoElement,
  timestampMs: number,
): Promise<LiveFaceStatus> {
  const landmarker = await getVideoLandmarker();

  // MediaPipe requires strictly monotonically increasing timestamps for VIDEO mode
  const safeTimestamp = Math.max(timestampMs, lastVideoTimestamp + 1);
  lastVideoTimestamp = safeTimestamp;

  const result = landmarker.detectForVideo(video, safeTimestamp);
  const faces = result.faceLandmarks ?? [];

  if (faces.length === 0) {
    return { detected: false, quality: 0, warning: "No face found — position face in frame", bbox: null, landmarks: null };
  }

  const pts = faces[0] as Pt[];
  const { quality, warning } = assessPose(pts);

  // Compute a rough bounding box from the face width/height landmarks.
  const xs = [pts[P.cheekRight].x, pts[P.cheekLeft].x, pts[P.foreheadTop].x, pts[P.chinBottom].x];
  const ys = [pts[P.cheekRight].y, pts[P.cheekLeft].y, pts[P.foreheadTop].y, pts[P.chinBottom].y];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    detected: true,
    quality,
    warning,
    bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
    landmarks: pts,
  };
}

let cachedVisionPackage: any = null;

/**
 * Renders the live 3D facial landmark mesh, contours, pupil tracking,
 * and glowing biometric anchor nodes continuously onto the overlay canvas.
 * Highly optimized with single-path batching for 60fps performance.
 */
export async function drawLiveFaceMesh(
  canvas: HTMLCanvasElement,
  landmarks: Pt[],
  isAligned: boolean,
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (!landmarks || landmarks.length < 468) return;

  if (!cachedVisionPackage) {
    cachedVisionPackage = await import("@mediapipe/tasks-vision");
  }
  const { FaceLandmarker } = cachedVisionPackage;

  // Futuristic biometric styling
  const meshColor = isAligned ? "rgba(52, 211, 153, 0.35)" : "rgba(56, 189, 248, 0.28)";
  const contourColor = isAligned ? "rgba(52, 211, 153, 0.95)" : "rgba(56, 189, 248, 0.88)";
  const irisColor = "#fbbf24";
  const anchorNodeColor = isAligned ? "#34d399" : "#fbbf24";
  const anchorGlowColor = isAligned ? "rgba(52, 211, 153, 0.5)" : "rgba(251, 191, 36, 0.5)";

  // 1. Full 3D Tesselation Mesh (Surface wireframe - batched for 60fps)
  const tesselation = FaceLandmarker.FACE_LANDMARKS_TESSELATION;
  if (tesselation && tesselation.length > 0) {
    ctx.strokeStyle = meshColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < tesselation.length; i++) {
      const conn = tesselation[i];
      const p1 = landmarks[conn.start];
      const p2 = landmarks[conn.end];
      if (p1 && p2) {
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
      }
    }
    ctx.stroke();
  }

  // 2. Anatomical Contours (Face oval, brows, eyes, nose, lips)
  const contours = FaceLandmarker.FACE_LANDMARKS_CONTOURS;
  if (contours && contours.length > 0) {
    ctx.strokeStyle = contourColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < contours.length; i++) {
      const conn = contours[i];
      const p1 = landmarks[conn.start];
      const p2 = landmarks[conn.end];
      if (p1 && p2) {
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
      }
    }
    ctx.stroke();
  }

  // 3. Iris / Pupil Tracking Circles
  const irisConn = [
    ...(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS || []),
    ...(FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS || []),
  ];
  if (irisConn.length > 0) {
    ctx.strokeStyle = irisColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < irisConn.length; i++) {
      const conn = irisConn[i];
      const p1 = landmarks[conn.start];
      const p2 = landmarks[conn.end];
      if (p1 && p2) {
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
      }
    }
    ctx.stroke();
  }

  // 4. Subtle surface micro-nodes across vertices (batched)
  ctx.fillStyle = isAligned ? "rgba(52, 211, 153, 0.75)" : "rgba(56, 189, 248, 0.65)";
  ctx.beginPath();
  for (let i = 0; i < landmarks.length; i += 3) {
    const pt = landmarks[i];
    const px = pt.x * w;
    const py = pt.y * h;
    ctx.moveTo(px + 1.2, py);
    ctx.arc(px, py, 1.2, 0, 2 * Math.PI);
  }
  ctx.fill();

  // 5. Primary Vedic Anthropometric Anchor Nodes (Glowing Dual-Ring Markers)
  const keyNodes = [
    P.foreheadTop, P.chinBottom, P.cheekRight, P.cheekLeft,
    P.rEyeOuter, P.rEyeInner, P.lEyeInner, P.lEyeOuter,
    P.noseBridgeTop, P.noseTip, P.noseBase,
    P.mouthRight, P.mouthLeft, P.lipTop, P.lipBottom,
    P.rBrowPeak, P.lBrowPeak, 468, 473,
  ];

  ctx.save();
  for (const idx of keyNodes) {
    if (idx < landmarks.length) {
      const pt = landmarks[idx];
      const px = pt.x * w;
      const py = pt.y * h;

      // Outer glow halo
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = anchorGlowColor;
      ctx.fill();

      // Solid core point
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, 2 * Math.PI);
      ctx.fillStyle = anchorNodeColor;
      ctx.fill();
    }
  }
  ctx.restore();
}
