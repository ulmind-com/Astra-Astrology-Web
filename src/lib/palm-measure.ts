/**
 * Live palm tracking in the browser.
 *
 * The crease tracing itself runs on the server, where OpenCV is. What runs here is
 * the part that has to be live: finding the hand many times a second and telling
 * the user, while they are still holding the camera, whether this shot is going to
 * be readable.
 *
 * The checks below deliberately mirror the server's quality gates
 * (`app/services/palm_cv/quality.py`) and use the same thresholds. If they drifted
 * apart the preview would say "hold still, looking good" and the server would then
 * reject the photo, which is a worse experience than no guidance at all.
 */

import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

export type Pt = { x: number; y: number; z: number };

/** Named joints, matching `app/services/palm_cv/landmarks.py`. */
export const WRIST = 0;
export const THUMB_CMC = 1;
export const THUMB_MCP = 2;
export const THUMB_IP = 3;
export const THUMB_TIP = 4;
export const INDEX_MCP = 5;
export const INDEX_TIP = 8;
export const MIDDLE_MCP = 9;
export const MIDDLE_TIP = 12;
export const RING_MCP = 13;
export const RING_TIP = 16;
export const PINKY_MCP = 17;
export const PINKY_TIP = 20;

export const HAND_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const FINGER_CHAINS: ReadonlyArray<readonly [number, number]> = [
  [INDEX_MCP, INDEX_TIP],
  [MIDDLE_MCP, MIDDLE_TIP],
  [RING_MCP, RING_TIP],
  [PINKY_MCP, PINKY_TIP],
];

/**
 * Thresholds copied from the server's `PalmScanConfig`. Kept slightly stricter
 * here than there, so a shot the preview accepts is one the server will too —
 * being told "ready" and then rejected is the failure worth avoiding.
 */
const MAX_TILT_DEGREES = 28;      // server allows 32
const MAX_ROLL_DEGREES = 38;      // server allows 45
const MIN_FINGER_EXTENSION = 0.6; // server allows 0.55
const MIN_PALM_AREA_RATIO = 0.055; // server allows 0.045
const MAX_PALM_AREA_RATIO = 0.75;  // too close to hold the whole palm in frame

export type PalmCheck = {
  id: string;
  ok: boolean;
  /** What to do about it, phrased as an instruction. */
  hint: string;
};

export type PalmStatus = {
  found: boolean;
  landmarks: Pt[] | null;
  handedness: string | null;
  checks: PalmCheck[];
  /** True when every check passes and the frame is worth capturing. */
  aligned: boolean;
  /** The single most useful thing to say right now. */
  guidance: string;
};

function distance(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleBetween(ax: number, ay: number, bx: number, by: number): number {
  const na = Math.hypot(ax, ay);
  const nb = Math.hypot(bx, by);
  if (na < 1e-9 || nb < 1e-9) return 0;
  const cosine = (ax * bx + ay * by) / (na * nb);
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
}

/** Area of the palm quadrilateral as a share of the frame, by the shoelace formula. */
function palmAreaRatio(pts: Pt[]): number {
  const poly = [pts[WRIST], pts[INDEX_MCP], pts[MIDDLE_MCP], pts[RING_MCP], pts[PINKY_MCP]];
  let area = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    area += a.x * b.y - b.x * a.y;
  }
  // The landmarks are normalised to 0..1, so this is already a share of the frame.
  // Scaled up because the quadrilateral covers only the palm, not the fingers.
  return Math.abs(area / 2) * 2.4;
}

/**
 * Judge a frame the way the server will.
 *
 * `aspect` is the frame's width divided by its height, and it is not optional in
 * practice. MediaPipe returns x as a share of the width and y as a share of the
 * height, so on any frame that is not square those two axes are on different
 * scales and every angle measured from them is wrong. The server works in pixels
 * and does not have the problem; measured on the test palm, the same hand reads
 * 19.4 degrees of tilt in pixels and 28.5 in raw normalised coordinates, which is
 * the difference between accepting the shot and refusing it. So the points are put
 * back on a common scale here before any angle or length is taken from them.
 *
 * Returns one check per gate rather than a single score, so the overlay can tell
 * the user the one thing to change instead of just "not good enough".
 */
export function assessPalm(
  pts: Pt[],
  aspect = 1,
): Omit<PalmStatus, "found" | "landmarks" | "handedness"> {
  // Square units for everything angular. Areas stay on the raw points below,
  // where a share of the frame is exactly what is wanted.
  const square: Pt[] = pts.map((p) => ({ x: p.x * aspect, y: p.y, z: p.z }));

  const wrist = square[WRIST];
  const indexMcp = square[INDEX_MCP];
  const middleMcp = square[MIDDLE_MCP];
  const pinkyMcp = square[PINKY_MCP];

  const axisX = middleMcp.x - wrist.x;
  const axisY = middleMcp.y - wrist.y;
  const acrossX = pinkyMcp.x - indexMcp.x;
  const acrossY = pinkyMcp.y - indexMcp.y;

  // In-plane rotation. Fingers should point towards the top of the frame.
  const roll = (Math.atan2(axisX, -axisY) * 180) / Math.PI;

  // With the palm square to the camera the knuckle row is perpendicular to the
  // wrist axis; departure from perpendicular means the hand is turned away.
  const tilt = Math.abs(90 - angleBetween(axisX, axisY, acrossX, acrossY));

  const palmLength = Math.hypot(axisX, axisY) || 1;
  const extension =
    FINGER_CHAINS.reduce((sum, [mcp, tip]) => sum + distance(square[mcp], square[tip]), 0) /
    (FINGER_CHAINS.length * palmLength);

  const area = palmAreaRatio(pts);

  const checks: PalmCheck[] = [
    {
      id: "facing",
      ok: tilt <= MAX_TILT_DEGREES,
      hint: "Turn your palm flat towards the camera",
    },
    {
      id: "rotation",
      ok: Math.abs(roll) <= MAX_ROLL_DEGREES,
      hint: "Point your fingers towards the top of the screen",
    },
    {
      id: "open",
      ok: extension >= MIN_FINGER_EXTENSION,
      hint: "Open your fingers",
    },
    {
      id: "distance",
      ok: area >= MIN_PALM_AREA_RATIO && area <= MAX_PALM_AREA_RATIO,
      hint: area < MIN_PALM_AREA_RATIO ? "Bring your hand closer" : "Move your hand back a little",
    },
  ];

  const failing = checks.find((check) => !check.ok);
  return {
    checks,
    aligned: !failing,
    guidance: failing ? failing.hint : "Hold still",
  };
}

// --------------------------------------------------------------------------
// The landmarker
// --------------------------------------------------------------------------
let videoLandmarkerPromise: Promise<HandLandmarker> | null = null;

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm";
const HAND_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/**
 * One landmarker in VIDEO mode, built once and reused.
 *
 * GPU first, falling back to CPU. On a phone without a usable WebGL context the
 * GPU delegate throws at creation, and without the fallback the whole feature
 * would be unavailable on exactly the devices most likely to be used for this.
 */
export async function getVideoHandLandmarker(): Promise<HandLandmarker> {
  if (!videoLandmarkerPromise) {
    videoLandmarkerPromise = (async () => {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
      const options = {
        baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" as const },
        runningMode: "VIDEO" as const,
        numHands: 1,
      };
      try {
        return await HandLandmarker.createFromOptions(vision, options);
      } catch {
        return await HandLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath: HAND_MODEL, delegate: "CPU" as const },
        });
      }
    })().catch((error) => {
      // Clear the cache so a later attempt can retry rather than returning the
      // same rejected promise for the rest of the session.
      videoLandmarkerPromise = null;
      throw error;
    });
  }
  return videoLandmarkerPromise;
}

function toPoints(landmarks: NormalizedLandmark[]): Pt[] {
  return landmarks.map((p) => ({ x: p.x, y: p.y, z: p.z ?? 0 }));
}

/** Run detection on the current video frame. */
export async function detectFromVideo(
  video: HTMLVideoElement,
  timestampMs: number,
): Promise<PalmStatus> {
  const landmarker = await getVideoHandLandmarker();
  const result = landmarker.detectForVideo(video, timestampMs);

  if (!result.landmarks?.length) {
    return {
      found: false,
      landmarks: null,
      handedness: null,
      checks: [],
      aligned: false,
      guidance: "Show your open palm to the camera",
    };
  }

  const points = toPoints(result.landmarks[0]);
  const handedness = result.handedness?.[0]?.[0]?.categoryName ?? null;
  const aspect =
    video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 1;
  return { found: true, landmarks: points, handedness, ...assessPalm(points, aspect) };
}

// --------------------------------------------------------------------------
// Live overlay
// --------------------------------------------------------------------------
/**
 * Draw the tracked hand over the video.
 *
 * Its job is to make the tracking visible: if the skeleton is not sitting on the
 * hand, the user can see that before they spend a scan on it.
 */
export function drawHandOverlay(
  canvas: HTMLCanvasElement,
  points: Pt[] | null,
  aligned: boolean,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!points) return;

  const toX = (x: number) => x * canvas.width;
  const toY = (y: number) => y * canvas.height;
  const accent = aligned ? "#34d399" : "#fbbf24";

  ctx.lineWidth = Math.max(2, canvas.width / 260);
  ctx.lineCap = "round";
  ctx.strokeStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = aligned ? 14 : 6;

  for (const [a, b] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(toX(points[a].x), toY(points[a].y));
    ctx.lineTo(toX(points[b].x), toY(points[b].y));
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  const dot = Math.max(2.5, canvas.width / 320);
  for (const point of points) {
    ctx.beginPath();
    ctx.arc(toX(point.x), toY(point.y), dot, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outline the palm region the creases will be traced inside, so the part of the
  // hand that actually matters is obvious while framing.
  ctx.strokeStyle = aligned ? "rgba(52,211,153,0.9)" : "rgba(251,191,36,0.55)";
  ctx.lineWidth = Math.max(1.5, canvas.width / 400);
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  for (const [i, index] of [WRIST, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP].entries()) {
    const point = points[index];
    if (i === 0) ctx.moveTo(toX(point.x), toY(point.y));
    else ctx.lineTo(toX(point.x), toY(point.y));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
}

/** Grab the current video frame as a JPEG, at full sensor resolution. */
export function captureFrame(video: HTMLVideoElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("This browser could not capture the frame."));
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The frame could not be encoded."))),
      "image/jpeg",
      // High quality: the creases are a few pixels wide and JPEG artefacts at a
      // lower setting sit in the same frequency band as the lines themselves.
      0.95,
    );
  });
}
