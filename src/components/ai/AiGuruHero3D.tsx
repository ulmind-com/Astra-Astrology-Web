"use client";

import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Sparkles, ArrowRight } from "lucide-react";

const HEAD_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172206_0181329a-86e2-41c9-8ab8-c496f29aaa53.glb";
const ARM_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172137_cd6086ec-07ef-44dc-bd15-95a450ddaa8c.glb";

const HERO_COPY = {
  bn: {
    badge: "বৈদিক এআই গুরু • সরাসরি গ্রহ-নক্ষত্র বিশ্লেষণ",
    headlineLine1: "পরিচিত হোন আপনার",
    headlineLine2: "বৈদিক এআই গুরুর সাথে",
    subLine1: "শাস্ত্রসম্মত গণনায় শুরু করা সহজ, অন্বেষণে সাবলীল।",
    subLine2: "প্রতিটি প্রশ্নে নির্ভুল কুন্ডলী, মহাদশা ও বাস্তু নির্দেশনা।",
    cta: "বিনামূল্যে শুরু করুন",
  },
  hi: {
    badge: "वैदिक एआई गुरु • लाइव ग्रह-नक्षत्र विश्लेषण",
    headlineLine1: "मिलिए अपने",
    headlineLine2: "वैदिक एआई गुरु से",
    subLine1: "शुरुआत करना आसान, हर प्रश्न में सटीक शास्त्र-सम्मत उत्तर।",
    subLine2: "व्यक्तिगत जन्मकुंडली, महादशा और वास्तु मार्गदर्शन २४ घंटे।",
    cta: "निःशुल्क शुरू करें",
  },
  en: {
    badge: "Vedic AI Guru • Live Planetary Intelligence",
    headlineLine1: "Introducing Your",
    headlineLine2: "Smart AI Astrologer",
    subLine1: "Easy to start. Effortless to explore.",
    subLine2: "Capable in every Kundli, Dasha & Vastu conversation.",
    cta: "Start free",
  },
} as const;

export interface AiGuruHero3DProps {
  language?: "bn" | "hi" | "en";
  onStartClick?: () => void;
  paused?: boolean;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function radialTexture(
  stops: ReadonlyArray<readonly [number, string]>,
  size = 256,
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const r = size / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    for (const [off, col] of stops) g.addColorStop(off, col);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function rimMaterial(
  colorHex: number,
  power: number,
  strength: number,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uPower: { value: power },
      uStrength: { value: strength },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uStrength;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), uPower);
        gl_FragColor = vec4(uColor * fresnel * uStrength, fresnel);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function prepareModel(
  root: THREE.Object3D,
  opts: {
    glossy: boolean;
    useMap: boolean;
    smooth: boolean;
    tint: string;
    rim?: { color: number; power: number; strength: number };
  },
) {
  const meshes: THREE.Mesh[] = [];
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) meshes.push(obj as THREE.Mesh);
  });

  for (const mesh of meshes) {
    if (opts.smooth && mesh.geometry) {
      const cloned = mesh.geometry.clone();
      cloned.deleteAttribute("normal");
      cloned.deleteAttribute("uv");
      cloned.deleteAttribute("uv1");
      cloned.deleteAttribute("tangent");
      cloned.deleteAttribute("color");
      const merged = mergeVertices(cloned, 1e-3);
      merged.computeVertexNormals();
      cloned.dispose();
      mesh.geometry.dispose();
      mesh.geometry = merged;
    }

    const oldMat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] | undefined;
    const mapTex =
      opts.useMap && oldMat && !Array.isArray(oldMat) ? oldMat.map : null;

    if (Array.isArray(oldMat)) oldMat.forEach((m) => m?.dispose?.());
    else oldMat?.dispose?.();

    mesh.material = opts.glossy
      ? new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(opts.tint),
          map: mapTex,
          metalness: 0.1,
          roughness: 0.28,
          clearcoat: 1.0,
          clearcoatRoughness: 0.14,
          envMapIntensity: 0.95,
        })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(opts.tint),
          map: mapTex,
          metalness: 0.02,
          roughness: 0.45,
          clearcoat: 0.35,
          clearcoatRoughness: 0.36,
          envMapIntensity: 0.65,
        });

    if (opts.rim) {
      const shell = new THREE.Mesh(
        mesh.geometry,
        rimMaterial(opts.rim.color, opts.rim.power, opts.rim.strength),
      );
      shell.renderOrder = 2;
      mesh.add(shell);
    }
  }
}

function buildRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const hw = w / 2;
  const hh = h / 2;
  const cr = Math.min(r, hw, hh);
  const s = new THREE.Shape();
  s.moveTo(-hw + cr, -hh);
  s.lineTo(hw - cr, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + cr);
  s.lineTo(hw, hh - cr);
  s.quadraticCurveTo(hw, hh, hw - cr, hh);
  s.lineTo(-hw + cr, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - cr);
  s.lineTo(-hw, -hh + cr);
  s.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
  return s;
}

function subdivideNonIndexed(geo: THREE.BufferGeometry, rounds = 3): THREE.BufferGeometry {
  let current = geo.index ? geo.toNonIndexed() : geo;
  for (let pass = 0; pass < rounds; pass++) {
    const pos = current.attributes.position as THREE.BufferAttribute;
    const triCount = pos.count / 3;
    const out = new Float32Array(triCount * 4 * 9);
    let ptr = 0;
    const pushTri = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      cx: number, cy: number, cz: number,
    ) => {
      out[ptr++] = ax; out[ptr++] = ay; out[ptr++] = az;
      out[ptr++] = bx; out[ptr++] = by; out[ptr++] = bz;
      out[ptr++] = cx; out[ptr++] = cy; out[ptr++] = cz;
    };

    for (let i = 0; i < pos.count; i += 3) {
      const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
      const bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1);
      const cx = pos.getX(i + 2), cy = pos.getY(i + 2), cz = pos.getZ(i + 2);

      const abx = (ax + bx) * 0.5, aby = (ay + by) * 0.5, abz = (az + bz) * 0.5;
      const bcx = (bx + cx) * 0.5, bcy = (by + cy) * 0.5, bcz = (bz + cz) * 0.5;
      const cax = (cx + ax) * 0.5, cay = (cy + ay) * 0.5, caz = (cz + az) * 0.5;

      pushTri(ax, ay, az, abx, aby, abz, cax, cay, caz);
      pushTri(abx, aby, abz, bx, by, bz, bcx, bcy, bcz);
      pushTri(cax, cay, caz, bcx, bcy, bcz, cx, cy, cz);
      pushTri(abx, aby, abz, bcx, bcy, bcz, cax, cay, caz);
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(out, 3));
    if (current !== geo) current.dispose();
    current = next;
  }
  return current;
}

function buildCurvedVisorGeometry(
  w: number,
  h: number,
  corner: number,
  centreY: number,
  radius: number,
): THREE.BufferGeometry {
  const shape = buildRoundedRectShape(w, h, corner);
  const base = new THREE.ShapeGeometry(shape, 48);
  const geo = subdivideNonIndexed(base, 3);
  base.dispose();

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const normals = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i) + centreY;
    const zSq = Math.max(0.01, radius * radius - x * x - y * y);
    const z = Math.sqrt(zSq);
    pos.setXYZ(i, x, y, z);

    v.set(x, y, z).normalize();
    normals[i * 3] = v.x;
    normals[i * 3 + 1] = v.y;
    normals[i * 3 + 2] = v.z;
  }

  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  return geo;
}

function buildFallbackHead(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#383236"),
    roughness: 0.26,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.14,
  });
  const rimMat = rimMaterial(0xf59e0b, 4.2, 0.36);

  const addPart = (geo: THREE.BufferGeometry, x = 0, y = 0, z = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, bodyMat);
    m.position.set(x, y, z);
    m.rotation.z = rz;
    const shell = new THREE.Mesh(geo, rimMat);
    shell.renderOrder = 2;
    m.add(shell);
    g.add(m);
  };

  addPart(new THREE.SphereGeometry(1, 64, 48));
  addPart(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 32), -1.02, 0, 0, Math.PI / 2);
  addPart(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 32), 1.02, 0, 0, Math.PI / 2);
  addPart(new THREE.CylinderGeometry(0.045, 0.055, 0.34, 16), -0.42, 1.06, 0, 0.22);
  addPart(new THREE.CylinderGeometry(0.045, 0.055, 0.34, 16), 0.42, 1.06, 0, -0.22);

  return g;
}

function buildFallbackArm(): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.CapsuleGeometry(0.22, 0.36, 16, 32);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#262124"),
    roughness: 0.44,
    metalness: 0.02,
    clearcoat: 0.35,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const shell = new THREE.Mesh(geo, rimMaterial(0xf39419, 2.6, 0.95));
  shell.renderOrder = 2;
  mesh.add(shell);
  g.add(mesh);
  return g;
}

export function AiGuruHero3D({
  language = "bn",
  onStartClick,
  paused = false,
}: AiGuruHero3DProps) {
  const heroRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const copyRef = React.useRef<HTMLDivElement>(null);
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const pausedPropRef = React.useRef(paused);

  const [webglFailed, setWebglFailed] = React.useState(false);
  const [modelsLoaded, setModelsLoaded] = React.useState(false);

  React.useEffect(() => {
    pausedPropRef.current = paused;
  }, [paused]);

  React.useEffect(() => {
    const heroEl = heroRef.current;
    const canvasEl = canvasRef.current;
    if (!heroEl || !canvasEl) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => {
        if (!disposed) setWebglFailed(true);
      });
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fdf5ec");

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

    // Warm Saffron & Gold radial glow texture (replacing violet)
    const glowTex = radialTexture([
      [0, "rgba(255, 204, 112, 1)"],
      [0.25, "rgba(243, 148, 25, 0.58)"],
      [0.6, "rgba(217, 119, 6, 0.14)"],
      [1, "rgba(180, 83, 9, 0)"],
    ]);

    const softAuraTex = radialTexture([
      [0, "rgba(251, 191, 36, 0.34)"],
      [0.42, "rgba(246, 166, 80, 0.16)"],
      [0.75, "rgba(253, 238, 227, 0.05)"],
      [1, "rgba(253, 245, 236, 0)"],
    ]);

    const floorShadowTex = radialTexture([
      [0, "rgba(114, 63, 19, 0.24)"],
      [0.4, "rgba(176, 97, 12, 0.11)"],
      [0.72, "rgba(243, 148, 25, 0.03)"],
      [1, "rgba(253, 245, 236, 0)"],
    ]);

    const irisTex = radialTexture([
      [0, "#fff4d9"],
      [0.42, "#fbbf24"],
      [0.78, "#f39419"],
      [1, "#b45309"],
    ]);

    // Dark-core Studio PMREM Environment with crisp round softboxes (no square bloom artifacts)
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#140f11");
    const addSoftbox = (
      hex: number,
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      intensity: number,
    ) => {
      const box = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(hex).multiplyScalar(intensity),
        }),
      );
      box.position.set(x, y, z);
      box.scale.set(w, h, 0.3);
      box.lookAt(0, 0, 0);
      envScene.add(box);
    };

    addSoftbox(0xffffff, 5, 3.2, -3, 4.5, 4, 3.2);
    addSoftbox(0xfff5e6, 1.2, 6, 6, 0.5, 2, 1.15);
    addSoftbox(0xffffff, 3, 1, 1.5, 5, -1, 0.85);
    addSoftbox(0xf39419, 4, 5, -5, 0, -4, 1.1);
    addSoftbox(0xf6a650, 4, 5, 5, 0, -4, 1.1);
    addSoftbox(0xb0610c, 6, 3, 0, -5, 1, 0.42);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(envScene, 0.02);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.0;

    // Clean up envScene meshes after baking PMREM
    envScene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.geometry?.dispose?.();
        (m.material as THREE.Material)?.dispose?.();
      }
    });
    pmrem.dispose();

    // Scene Lights
    scene.add(new THREE.HemisphereLight(0xfff5e8, 0x3b2110, 2.25));
    const dirLight = new THREE.DirectionalLight(0xfffaf0, 0.78);
    dirLight.position.set(-3, 4, 5);
    scene.add(dirLight);

    // Post-processing: threshold 1.06 keeps the #fdf5ec warm cream backdrop clean while blooming HDR emissive gold/saffron
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(heroEl.clientWidth || 800, heroEl.clientHeight || 500),
      0.42,
      0.38,
      1.06,
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Backdrop Haze & Floor Contact Shadow
    const bgHaze = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: softAuraTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    );
    bgHaze.position.set(0, 0.1, -3);
    bgHaze.scale.set(6.8, 6.8, 1);
    scene.add(bgHaze);

    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: floorShadowTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), floorGlowMat);
    floorGlow.position.set(0, -2.02, -0.6);
    floorGlow.scale.set(3.4, 0.44, 1);
    scene.add(floorGlow);

    // Rig Hierarchy: robot -> body -> head
    // Keep robot at scale=1 while mounting head/arms so raycaster & sphereNormals measure true units.
    const robot = new THREE.Group();
    robot.visible = false;
    scene.add(robot);

    const body = new THREE.Group();
    robot.add(body);

    const head = new THREE.Group();
    body.add(head);

    // Animated targets populated by mountHead / mountArm
    const pupilWraps: THREE.Group[] = [];
    const eyeGroups: THREE.Group[] = [];
    const antennaGlowSprites: THREE.Sprite[] = [];
    const armStates: Array<{
      group: THREE.Group;
      restX: number;
      restY: number;
      restRz: number;
      phase: number;
    }> = [];

    function normaliseHead(model: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = size.z > 0.001 ? 2 / size.z : 1;
      model.scale.multiplyScalar(scale);
      model.updateMatrixWorld(true);

      const box2 = new THREE.Box3().setFromObject(model);
      const centre = new THREE.Vector3();
      box2.getCenter(centre);
      model.position.set(-centre.x, -(box2.min.y + 1), -centre.z);
      model.updateMatrixWorld(true);
    }

    function sphereNormals(model: THREE.Object3D, radius: number) {
      const worldCenter = new THREE.Vector3();
      head.localToWorld(worldCenter.set(0, 0, 0));

      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
        const norm = mesh.geometry.attributes.normal as THREE.BufferAttribute;
        if (!pos || !norm) return;

        const invMat = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
        const normalMat = new THREE.Matrix3().getNormalMatrix(invMat);
        const vWorld = new THREE.Vector3();
        const nLocal = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
          vWorld.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
          const dist = vWorld.distanceTo(worldCenter);
          if (Math.abs(dist - radius) <= radius * 0.07) {
            nLocal.copy(vWorld).sub(worldCenter).normalize().applyMatrix3(normalMat).normalize();
            norm.setXYZ(i, nLocal.x, nLocal.y, nLocal.z);
          }
        }
        norm.needsUpdate = true;
      });
    }

    function addVisor(radius: number) {
      const bezelGeo = buildCurvedVisorGeometry(1.86, 1.12, 0.46, -0.07, radius * 1.03);
      const bezel = new THREE.Mesh(
        bezelGeo,
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#141113"),
          roughness: 0.3,
          metalness: 0.3,
          clearcoat: 0.85,
          polygonOffset: true,
          polygonOffsetFactor: -6,
          polygonOffsetUnits: -6,
        }),
      );
      bezel.renderOrder = 3;
      head.add(bezel);

      const glassGeo = buildCurvedVisorGeometry(1.74, 1.0, 0.4, -0.07, radius * 1.036);
      const glass = new THREE.Mesh(
        glassGeo,
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#060506"),
          roughness: 0.12,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          envMapIntensity: 0.95,
          polygonOffset: true,
          polygonOffsetFactor: -8,
          polygonOffsetUnits: -8,
        }),
      );
      glass.renderOrder = 4;
      head.add(glass);
    }

    function addEyes(radius: number) {
      const eyeR = radius * 1.055;
      for (const side of [-1, 1]) {
        const ex = side * 0.43;
        const ey = -0.08;
        const ez = Math.sqrt(Math.max(0.01, eyeR * eyeR - ex * ex - ey * ey));

        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(ex, ey, ez);
        const dir = eyeGroup.position.clone().normalize();
        eyeGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

        const baseEyeMat = {
          transparent: true,
          toneMapped: false,
          depthWrite: false,
          depthTest: false,
        };

        const halo = new THREE.Mesh(
          new THREE.CircleGeometry(0.42, 32),
          new THREE.MeshBasicMaterial({
            map: glowTex,
            color: new THREE.Color(0xf59e0b),
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            ...baseEyeMat,
          }),
        );
        halo.position.z = -0.004;
        halo.renderOrder = 9;
        eyeGroup.add(halo);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.168, 0.212, 64),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(2.1, 1.35, 0.28),
            ...baseEyeMat,
          }),
        );
        ring.renderOrder = 10;
        eyeGroup.add(ring);

        const iris = new THREE.Mesh(
          new THREE.CircleGeometry(0.17, 48),
          new THREE.MeshBasicMaterial({
            map: irisTex,
            color: new THREE.Color(1.25, 0.98, 0.55),
            ...baseEyeMat,
          }),
        );
        iris.position.z = 0.001;
        iris.renderOrder = 10;
        eyeGroup.add(iris);

        const pupilWrap = new THREE.Group();
        const pupil = new THREE.Mesh(
          new THREE.CircleGeometry(0.083, 32),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color("#0d0907"),
            ...baseEyeMat,
          }),
        );
        pupil.position.z = 0.003;
        pupil.renderOrder = 10;
        pupilWrap.add(pupil);

        const glint = new THREE.Mesh(
          new THREE.CircleGeometry(0.022, 20),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color("#fffcf7"),
            ...baseEyeMat,
          }),
        );
        glint.position.set(0.032, 0.034, 0.005);
        glint.renderOrder = 10;
        pupilWrap.add(glint);

        eyeGroup.add(pupilWrap);
        head.add(eyeGroup);
        pupilWraps.push(pupilWrap);
        eyeGroups.push(eyeGroup);
      }
    }

    function addAntennaBalls(headModel: THREE.Object3D, isFallback = false) {
      const addBallAt = (x: number, y: number, z: number) => {
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.118, 32, 24),
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#f59e0b"),
            emissive: new THREE.Color("#d97b0b"),
            emissiveIntensity: 1.9,
            roughness: 0.22,
            clearcoat: 1.0,
            clearcoatRoughness: 0.14,
          }),
        );
        ball.position.set(x, y, z);
        head.add(ball);

        const glow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: new THREE.Color(0xfbbf24),
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        glow.scale.set(0.5, 0.5, 1);
        glow.position.set(x, y, z);
        head.add(glow);
        antennaGlowSprites.push(glow);
      };

      if (isFallback) {
        addBallAt(-0.46, 1.24, 0);
        addBallAt(0.46, 1.24, 0);
        return;
      }

      head.updateMatrixWorld(true);
      const sides: Record<"L" | "R", THREE.Vector3[]> = { L: [], R: [] };
      const vLocal = new THREE.Vector3();

      headModel.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
        if (!pos) return;
        for (let i = 0; i < pos.count; i++) {
          vLocal.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
          head.worldToLocal(vLocal);
          if (vLocal.y > 0.75 && Math.abs(vLocal.x) > 0.15) {
            sides[vLocal.x < 0 ? "L" : "R"].push(vLocal.clone());
          }
        }
      });

      for (const pts of [sides.L, sides.R]) {
        if (pts.length === 0) continue;
        let top = pts[0];
        for (const p of pts) {
          if (p.y > top.y) top = p;
        }
        const near = pts.filter((p) => p.distanceTo(top) <= 0.2);
        const avg = new THREE.Vector3();
        for (const p of near) avg.add(p);
        avg.divideScalar(near.length || 1);
        avg.y = Math.max(avg.y, top.y - 0.1);
        addBallAt(avg.x, avg.y, avg.z);
      }
    }

    function mountHead(headModel: THREE.Object3D, isFallback = false) {
      if (!isFallback) {
        normaliseHead(headModel);
        prepareModel(headModel, {
          glossy: true,
          useMap: false,
          smooth: false,
          tint: "#383236",
          rim: { color: 0xf59e0b, power: 4.2, strength: 0.36 },
        });
      }
      head.add(headModel);
      head.updateMatrixWorld(true);

      let radius = 1.0;
      if (!isFallback) {
        const raycaster = new THREE.Raycaster(
          new THREE.Vector3(0, 0, 5),
          new THREE.Vector3(0, 0, -1),
        );
        const hits = raycaster.intersectObject(headModel, true);
        if (hits.length > 0) {
          radius = clamp(hits[0].point.length(), 0.85, 1.1);
        }
        sphereNormals(headModel, radius);
      }

      addVisor(radius);
      addEyes(radius);
      addAntennaBalls(headModel, isFallback);
    }

    function normaliseArm(model: THREE.Object3D): THREE.Group {
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = size.y > 0.001 ? 0.78 / size.y : 1;
      model.scale.multiplyScalar(scale);
      model.updateMatrixWorld(true);

      const box2 = new THREE.Box3().setFromObject(model);
      const centre = new THREE.Vector3();
      box2.getCenter(centre);
      model.position.sub(centre);

      const wrapper = new THREE.Group();
      wrapper.add(model);
      return wrapper;
    }

    function mountArms(armModel: THREE.Object3D | null) {
      const copies = armModel
        ? [armModel, armModel.clone(true)]
        : [buildFallbackArm(), buildFallbackArm()];

      if (armModel) {
        for (const c of copies) {
          prepareModel(c, {
            glossy: false,
            useMap: false,
            smooth: true,
            tint: "#262124",
            rim: { color: 0xf39419, power: 2.6, strength: 0.95 },
          });
        }
      }

      const poses = [
        { x: -1.32, y: -0.72, z: 0.15, rz: -0.62, phase: 0 },
        { x: 1.32, y: -0.72, z: 0.15, rz: 0.62, phase: Math.PI * 0.85 },
      ];

      copies.forEach((rawArm, idx) => {
        const pose = poses[idx];
        const armGroup = normaliseArm(rawArm);
        armGroup.position.set(pose.x, pose.y, pose.z);
        armGroup.rotation.z = pose.rz;
        body.add(armGroup);
        armStates.push({
          group: armGroup,
          restX: pose.x,
          restY: pose.y,
          restRz: pose.rz,
          phase: pose.phase,
        });
      });
    }

    // Layout & responsive projection offset
    const anchor = { x: 400, y: 240 };
    let viewW = heroEl.clientWidth || 800;
    let viewH = heroEl.clientHeight || 500;
    let isMobile = viewW <= 860;

    const layout = () => {
      if (!heroEl || disposed) return;
      viewW = Math.max(heroEl.clientWidth, 320);
      viewH = Math.max(heroEl.clientHeight, 360);
      isMobile = viewW <= 860;

      renderer.setSize(viewW, viewH, false);
      composer.setSize(viewW, viewH);
      bloomPass.setSize(viewW, viewH);
      camera.aspect = viewW / viewH;

      let robotPx: number;
      if (!isMobile) {
        robotPx = Math.min(viewH * 0.72, viewW * 0.36, 520);
        anchor.x = viewW * 0.715;
        anchor.y = viewH * 0.5 + 4;
      } else {
        const heroRect = heroEl.getBoundingClientRect();
        const copyRect = copyRef.current?.getBoundingClientRect();
        const copyTop = copyRect ? copyRect.top - heroRect.top : viewH * 0.52;
        const room = Math.max(copyTop - 18, 200);
        robotPx = Math.min(room * 0.88, viewW * 0.76);
        anchor.x = viewW * 0.5;
        anchor.y = 14 + room * 0.5;
      }

      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      camera.position.z = (3.4 * viewH) / (Math.max(robotPx, 120) * 2 * Math.tan(fovRad / 2));
      camera.setViewOffset(
        viewW,
        viewH,
        viewW * 0.5 - anchor.x,
        viewH * 0.5 - anchor.y,
        viewW,
        viewH,
      );
      camera.updateProjectionMatrix();

      if (loaderRef.current) {
        loaderRef.current.style.left = `${anchor.x}px`;
        loaderRef.current.style.top = `${anchor.y}px`;
      }
    };

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(heroEl);
    layout();

    // Pointer + Touch Tracking
    const target = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    let lastMoveTime = performance.now();

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = heroEl.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const rx = isMobile ? viewW * 0.5 : Math.max(viewW * 0.55, 500);
      const ry = isMobile ? viewH * 0.5 : Math.max(viewH * 0.55, 400);
      target.x = clamp((localX - anchor.x) / rx, -1.2, 1.2);
      target.y = clamp((localY - anchor.y) / ry, -1.2, 1.2);
      lastMoveTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Load GLBs with safe timeout + procedural fallback
    const gltfLoader = new GLTFLoader();
    gltfLoader.setCrossOrigin("anonymous");

    const loadWithTimeout = (url: string, ms = 14000) =>
      new Promise<THREE.Group>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("GLB load timeout")), ms);
        gltfLoader.load(
          url,
          (gltf) => {
            window.clearTimeout(timer);
            resolve(gltf.scene);
          },
          undefined,
          (err) => {
            window.clearTimeout(timer);
            reject(err);
          },
        );
      });

    let introProgress = 0;
    let introStarted = false;

    Promise.allSettled([
      loadWithTimeout(HEAD_GLB),
      loadWithTimeout(ARM_GLB),
    ]).then(([headRes, armRes]) => {
      if (disposed) return;

      if (headRes.status === "fulfilled") {
        mountHead(headRes.value, false);
      } else {
        mountHead(buildFallbackHead(), true);
      }

      if (armRes.status === "fulfilled") {
        mountArms(armRes.value);
      } else {
        mountArms(null);
      }

      setModelsLoaded(true);
      robot.scale.setScalar(0.001);
      robot.visible = true;
      introStarted = true;
    });

    // Animation Loop + IntersectionObserver pause
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    io.observe(heroEl);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let prevTime = performance.now();
    let elapsed = 0;
    let nextBlink = 2.6 + Math.random() * 3.0;
    let blinkClock = -1;

    const tick = (now: number) => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(tick);

      const rawDt = (now - prevTime) * 0.001;
      prevTime = now;

      if (!isVisible || pausedPropRef.current) return;

      const dt = Math.min(rawDt, 0.05);
      elapsed += dt;
      const m = motionQuery.matches ? 0.25 : 1;

      if (now - lastMoveTime > 3500) {
        target.x = Math.sin(elapsed * 0.45) * 0.45;
        target.y = Math.sin(elapsed * 0.31 + 1.2) * 0.2;
      }

      const smoothFactor = 1 - Math.pow(0.0025, dt);
      look.x += (target.x - look.x) * smoothFactor;
      look.y += (target.y - look.y) * smoothFactor;

      if (introStarted && introProgress < 1) {
        introProgress = Math.min(1, introProgress + dt * 1.4);
        const k = introProgress - 1;
        const easeBack = 1 + 2.4 * k * k * k + 1.4 * k * k;
        robot.scale.setScalar(Math.max(0.001, easeBack));
      }

      const bob = Math.sin(elapsed * 1.6) * 0.09 * m;
      robot.position.y = bob;

      head.rotation.y = look.x * 0.5;
      head.rotation.x = look.y * 0.42;
      head.rotation.z = -look.x * 0.06 + Math.sin(elapsed * 1.1) * 0.015 * m;

      body.rotation.y = look.x * 0.28;
      body.rotation.x = look.y * 0.12;

      for (const arm of armStates) {
        const w = Math.sin(elapsed * 2.0 + arm.phase);
        const sign = Math.sign(arm.restX);
        arm.group.position.y = arm.restY + w * 0.13 * m - bob * 0.35;
        arm.group.position.x = arm.restX + sign * look.x * -0.04;
        arm.group.rotation.z = arm.restRz + w * 0.12 * sign * m;
        arm.group.rotation.x = Math.sin(elapsed * 1.3 + arm.phase) * 0.08 * m;
      }

      const px = clamp(look.x * 0.075, -0.07, 0.07);
      const py = clamp(-look.y * 0.06, -0.06, 0.06);
      for (const pw of pupilWraps) {
        pw.position.set(px, py, 0);
      }

      // Natural Blink cycle (2.5-6s random)
      if (blinkClock < 0 && elapsed >= nextBlink) {
        blinkClock = 0;
      }
      if (blinkClock >= 0) {
        blinkClock += dt;
        const p = blinkClock / 0.32;
        if (p >= 1) {
          blinkClock = -1;
          nextBlink = elapsed + 2.5 + Math.random() * 3.5;
          for (const eg of eyeGroups) eg.scale.y = 1;
        } else {
          const sy = 1 - 0.92 * Math.sin(Math.PI * p);
          for (const eg of eyeGroups) eg.scale.y = sy;
        }
      }

      floorGlow.scale.set(3.4 - bob * 3, 0.44 - bob * 0.4, 1);
      floorGlowMat.opacity = clamp(0.75 + (0.09 - bob) * 1.3, 0.45, 1.0);

      const antOpacity = 0.7 * (0.85 + Math.sin(elapsed * 1.6) * 0.15) + 0.15;
      for (const sp of antennaGlowSprites) {
        (sp.material as THREE.SpriteMaterial).opacity = antOpacity;
      }

      composer.render();
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);

      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((item) => item?.dispose?.());
        else mat?.dispose?.();
      });

      glowTex.dispose();
      softAuraTex.dispose();
      floorShadowTex.dispose();
      irisTex.dispose();
      envRT.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  const copy = HERO_COPY[language] || HERO_COPY.bn;

  return (
    <section
      ref={heroRef}
      className="dl-ai-hero relative isolate w-full overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-b from-[#fffcf7] via-[#fdf4eb] to-[#fbeee5] shadow-[0_12px_40px_-14px_rgba(140,76,18,0.12)]"
      aria-label={copy.badge}
    >
      {/* Interactive 3D WebGL Stage */}
      {!webglFailed ? (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block size-full z-0 [touch-action:pan-y]"
            aria-hidden="true"
          />
          <div
            ref={loaderRef}
            className={`dl-ai-loader transition-opacity duration-500 ${
              modelsLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex size-56 items-center justify-center rounded-full bg-gradient-to-tr from-amber-300/35 via-amber-200/20 to-transparent blur-xl"
          aria-hidden="true"
        />
      )}

      {/* Subtle Editorial Vertical Lines + Warm Edge Vignette Overlay */}
      <div className="dl-ai-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Copy Overlay */}
      <div className="dl-ai-hero-inner relative z-[2] pointer-events-none mx-auto flex max-w-[1344px] flex-col justify-center">
        <div ref={copyRef} className="dl-ai-copy pointer-events-auto">
          <div className="dl-ai-reveal dl-d1 mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/85 px-3.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs backdrop-blur-sm">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{copy.badge}</span>
          </div>

          <h2 className="dl-ai-reveal dl-d1 dl-ai-h1 font-serif font-extrabold tracking-tight text-stone-900">
            {copy.headlineLine1}
            <br />
            <span className="text-amber-800">{copy.headlineLine2}</span>
          </h2>

          <p className="dl-ai-reveal dl-d2 dl-ai-sub text-stone-600">
            {copy.subLine1}
            <br className="hidden sm:inline" /> {copy.subLine2}
          </p>

          <button
            type="button"
            onClick={onStartClick}
            className="dl-ai-reveal dl-d3 dl-ai-cta inline-flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>{copy.cta}</span>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .dl-ai-hero {
          min-height: 460px;
        }
        .dl-ai-vignette {
          background:
            repeating-linear-gradient(
              90deg,
              rgba(140, 76, 18, 0.018) 0 1px,
              transparent 1px 7px
            ),
            radial-gradient(
              120% 85% at 50% 0%,
              transparent 58%,
              rgba(251, 231, 218, 0.55) 100%
            );
        }
        .dl-ai-hero-inner {
          min-height: 460px;
          padding: 44px 48px 48px;
        }
        .dl-ai-copy {
          max-width: 540px;
        }
        .dl-ai-h1 {
          font-size: clamp(30px, 3.8vw, 52px);
          line-height: 1.08;
          letter-spacing: -0.025em;
        }
        .dl-ai-sub {
          margin-top: 18px;
          font-size: clamp(14px, 1.35vw, 18px);
          line-height: 1.55;
          font-weight: 400;
        }
        .dl-ai-cta {
          margin-top: 28px;
          height: 54px;
          padding: 0 32px;
          border-radius: 999px;
          background: linear-gradient(180deg, #f6a650 0%, #f39419 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.005em;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            0 6px 18px -6px rgba(217, 119, 6, 0.38);
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .dl-ai-cta:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
        }
        .dl-ai-reveal {
          opacity: 0;
          transform: translateY(18px);
          animation: dlAiRise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        .dl-d1 {
          animation-delay: 0.08s;
        }
        .dl-d2 {
          animation-delay: 0.2s;
        }
        .dl-d3 {
          animation-delay: 0.32s;
        }
        @keyframes dlAiRise {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .dl-ai-loader {
          position: absolute;
          z-index: 2;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid rgba(243, 148, 25, 0.22);
          border-top-color: #f39419;
          transform: translate(-50%, -50%);
          animation: dlAiSpin 1s linear infinite;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .dl-ai-loader.is-hidden {
          opacity: 0;
        }
        @keyframes dlAiSpin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @media (max-width: 1100px) {
          .dl-ai-hero-inner {
            padding: 36px 32px 40px;
          }
        }
        @media (max-width: 860px) {
          .dl-ai-hero {
            min-height: 540px;
          }
          .dl-ai-hero-inner {
            min-height: 540px;
            justify-content: flex-end;
            text-align: center;
            align-items: center;
            padding: 250px 20px 34px;
          }
          .dl-ai-copy {
            max-width: 520px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .dl-ai-h1 {
            font-size: clamp(28px, 7.6vw, 44px);
          }
          .dl-ai-sub {
            margin-top: 12px;
          }
          .dl-ai-cta {
            margin-top: 22px;
          }
        }
        @media (max-width: 480px) {
          .dl-ai-hero {
            min-height: 500px;
          }
          .dl-ai-hero-inner {
            min-height: 500px;
            padding: 225px 16px 28px;
          }
          .dl-ai-cta {
            height: 48px;
            padding: 0 26px;
            font-size: 15px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-ai-reveal {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
