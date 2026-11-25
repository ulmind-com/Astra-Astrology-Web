"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const HEAD_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172206_0181329a-86e2-41c9-8ab8-c496f29aaa53.glb";
export const ARM_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172137_cd6086ec-07ef-44dc-bd15-95a450ddaa8c.glb";

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function radialTexture(
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

export function rimMaterial(
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

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
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

  envScene.traverse((obj) => {
    const m = obj as THREE.Mesh;
    if (m.isMesh) {
      m.geometry?.dispose?.();
      (m.material as THREE.Material)?.dispose?.();
    }
  });
  pmrem.dispose();
  return envRT;
}

export function prepareModel(
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

export function buildFallbackHead(): THREE.Group {
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

export function buildFallbackArm(): THREE.Group {
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

export interface RobotRigState {
  robot: THREE.Group;
  body: THREE.Group;
  head: THREE.Group;
  pupilWraps: THREE.Group[];
  eyeGroups: THREE.Group[];
  antennaGlowSprites: THREE.Sprite[];
  armStates: Array<{
    group: THREE.Group;
    restX: number;
    restY: number;
    restRz: number;
    phase: number;
  }>;
  textures: THREE.Texture[];
}

export function createDivinLinkRobotRig(armSpread = 1.32): RobotRigState {
  const glowTex = radialTexture([
    [0, "rgba(255, 204, 112, 1)"],
    [0.25, "rgba(243, 148, 25, 0.58)"],
    [0.6, "rgba(217, 119, 6, 0.14)"],
    [1, "rgba(180, 83, 9, 0)"],
  ]);

  const irisTex = radialTexture([
    [0, "#fff4d9"],
    [0.42, "#fbbf24"],
    [0.78, "#f39419"],
    [1, "#b45309"],
  ]);

  const robot = new THREE.Group();
  const body = new THREE.Group();
  robot.add(body);
  const head = new THREE.Group();
  body.add(head);

  const rig: RobotRigState = {
    robot,
    body,
    head,
    pupilWraps: [],
    eyeGroups: [],
    antennaGlowSprites: [],
    armStates: [],
    textures: [glowTex, irisTex],
  };

  // Helper stored internally for mount calls via attachRobotAssets
  (rig as RobotRigState & { _glowTex: THREE.CanvasTexture; _irisTex: THREE.CanvasTexture; _armSpread: number })._glowTex = glowTex;
  (rig as RobotRigState & { _irisTex: THREE.CanvasTexture })._irisTex = irisTex;
  (rig as RobotRigState & { _armSpread: number })._armSpread = armSpread;

  return rig;
}

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

function sphereNormals(head: THREE.Group, model: THREE.Object3D, radius: number) {
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

function addVisor(head: THREE.Group, radius: number) {
  const bezelGeo = buildCurvedVisorGeometry(1.86, 1.12, 0.46, -0.07, radius * 1.03);
  const bezel = new THREE.Mesh(
    bezelGeo,
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0c0a0b"),
      roughness: 0.28,
      metalness: 0.28,
      clearcoat: 0.85,
      envMapIntensity: 0.55,
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
      color: new THREE.Color("#020203"),
      roughness: 0.09,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: -8,
      polygonOffsetUnits: -8,
    }),
  );
  glass.renderOrder = 4;
  head.add(glass);
}

function addEyes(
  rig: RobotRigState,
  radius: number,
  glowTex: THREE.CanvasTexture,
  irisTex: THREE.CanvasTexture,
  hdrBloom = true,
) {
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
        opacity: 0.3,
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
        color: hdrBloom ? new THREE.Color(2.1, 1.35, 0.28) : new THREE.Color("#ffd166"),
        ...baseEyeMat,
      }),
    );
    ring.renderOrder = 10;
    eyeGroup.add(ring);

    const iris = new THREE.Mesh(
      new THREE.CircleGeometry(0.17, 48),
      new THREE.MeshBasicMaterial({
        map: irisTex,
        color: hdrBloom ? new THREE.Color(1.25, 0.98, 0.55) : new THREE.Color("#fff3cf"),
        ...baseEyeMat,
      }),
    );
    iris.position.z = 0.001;
    iris.renderOrder = 11;
    eyeGroup.add(iris);

    // Strictly ascending renderOrder (12 for pupil, 13 for glint) guarantees BOTH eyes always draw pupils on top of iris regardless of camera distance sorting!
    const pupilWrap = new THREE.Group();
    const pupil = new THREE.Mesh(
      new THREE.CircleGeometry(0.085, 32),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#0d0907"),
        ...baseEyeMat,
      }),
    );
    pupil.position.z = 0.003;
    pupil.renderOrder = 12;
    pupilWrap.add(pupil);

    const glint = new THREE.Mesh(
      new THREE.CircleGeometry(0.023, 20),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#fffcf7"),
        ...baseEyeMat,
      }),
    );
    glint.position.set(0.032, 0.034, 0.005);
    glint.renderOrder = 13;
    pupilWrap.add(glint);

    eyeGroup.add(pupilWrap);
    rig.head.add(eyeGroup);
    rig.pupilWraps.push(pupilWrap);
    rig.eyeGroups.push(eyeGroup);
  }
}

function addAntennaBalls(
  rig: RobotRigState,
  headModel: THREE.Object3D,
  glowTex: THREE.CanvasTexture,
  isFallback = false,
) {
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
    rig.head.add(ball);

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
    rig.head.add(glow);
    rig.antennaGlowSprites.push(glow);
  };

  if (isFallback) {
    addBallAt(-0.46, 1.24, 0);
    addBallAt(0.46, 1.24, 0);
    return;
  }

  rig.head.updateMatrixWorld(true);
  const sides: Record<"L" | "R", THREE.Vector3[]> = { L: [], R: [] };
  const vLocal = new THREE.Vector3();

  headModel.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
    if (!pos) return;
    for (let i = 0; i < pos.count; i++) {
      vLocal.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      rig.head.worldToLocal(vLocal);
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

export function attachRobotAssets(
  rig: RobotRigState,
  headTemplate: THREE.Object3D | null,
  armTemplate: THREE.Object3D | null,
  opts?: { hdrBloom?: boolean },
) {
  const meta = rig as RobotRigState & {
    _glowTex: THREE.CanvasTexture;
    _irisTex: THREE.CanvasTexture;
    _armSpread: number;
  };

  // 1. Mount Head
  const isFallbackHead = !headTemplate;
  const headModel = headTemplate ? headTemplate.clone(true) : buildFallbackHead();
  if (!isFallbackHead) {
    normaliseHead(headModel);
    prepareModel(headModel, {
      glossy: true,
      useMap: false,
      smooth: false,
      tint: "#383236",
      rim: { color: 0xf59e0b, power: 4.2, strength: 0.36 },
    });
  }
  rig.head.add(headModel);
  rig.head.updateMatrixWorld(true);

  let radius = 1.0;
  if (!isFallbackHead) {
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(0, 0, -1),
    );
    const hits = raycaster.intersectObject(headModel, true);
    if (hits.length > 0) {
      radius = clamp(hits[0].point.length(), 0.85, 1.1);
    }
    sphereNormals(rig.head, headModel, radius);
  }

  addVisor(rig.head, radius);
  addEyes(rig, radius, meta._glowTex, meta._irisTex, opts?.hdrBloom ?? true);
  addAntennaBalls(rig, headModel, meta._glowTex, isFallbackHead);

  // 2. Mount Arms
  const copies = armTemplate
    ? [armTemplate.clone(true), armTemplate.clone(true)]
    : [buildFallbackArm(), buildFallbackArm()];

  if (armTemplate) {
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

  const spread = meta._armSpread ?? 1.32;
  const poses = [
    { x: -spread, y: -0.72, z: 0.15, rz: -0.62, phase: 0 },
    { x: spread, y: -0.72, z: 0.15, rz: 0.62, phase: Math.PI * 0.85 },
  ];

  copies.forEach((rawArm, idx) => {
    const pose = poses[idx];
    const armGroup = normaliseArm(rawArm);
    armGroup.position.set(pose.x, pose.y, pose.z);
    armGroup.rotation.z = pose.rz;
    rig.body.add(armGroup);
    rig.armStates.push({
      group: armGroup,
      restX: pose.x,
      restY: pose.y,
      restRz: pose.rz,
      phase: pose.phase,
    });
  });
}

// Shared cached GLB loader so Hero & Mini Avatars download & parse each GLB once.
let cachedAssetsPromise: Promise<{
  head: THREE.Object3D | null;
  arm: THREE.Object3D | null;
}> | null = null;

export function loadRobotAssetsCached() {
  if (cachedAssetsPromise) return cachedAssetsPromise;

  const gltfLoader = new GLTFLoader();
  gltfLoader.setCrossOrigin("anonymous");

  const loadWithTimeout = (url: string, ms = 14000) =>
    new Promise<THREE.Group>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error("GLB timeout")), ms);
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

  cachedAssetsPromise = Promise.allSettled([
    loadWithTimeout(HEAD_GLB),
    loadWithTimeout(ARM_GLB),
  ]).then(([headRes, armRes]) => ({
    head: headRes.status === "fulfilled" ? headRes.value : null,
    arm: armRes.status === "fulfilled" ? armRes.value : null,
  }));

  return cachedAssetsPromise;
}

/* ============================================================================
 * Singleton Shared WebGL Offscreen Renderer for Mini Chat Avatars (<AiAvatar>)
 * Avoids creating multiple WebGL contexts (browser max is ~8-16) even across
 * long 100+ message AI conversations!
 * ========================================================================== */

interface AvatarSubscriber {
  canvas: HTMLCanvasElement;
  onReady: () => void;
}

class SharedAvatarRenderer {
  private subscribers = new Set<AvatarSubscriber>();
  private initialized = false;
  private failed = false;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private envRT: THREE.WebGLRenderTarget | null = null;
  private rig: RobotRigState | null = null;
  private rafId = 0;
  private target = { x: 0, y: 0 };
  private look = { x: 0, y: 0 };
  private lastMoveTime = 0;
  private prevTime = 0;
  private elapsed = 0;
  private nextBlink = 2.8;
  private blinkClock = -1;
  private assetsReady = false;
  private listenersBound = false;

  subscribe(canvas: HTMLCanvasElement, onReady: () => void, onFail: () => void): () => void {
    if (this.failed) {
      onFail();
      return () => {};
    }

    const entry: AvatarSubscriber = { canvas, onReady };
    this.subscribers.add(entry);

    if (!this.initialized) {
      this.init(onFail);
    } else if (this.assetsReady) {
      onReady();
    }

    if (!this.failed && !this.rafId) {
      this.prevTime = performance.now();
      this.rafId = window.requestAnimationFrame(this.tick);
    }

    return () => {
      this.subscribers.delete(entry);
      if (this.subscribers.size === 0 && this.rafId) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
    };
  }

  private init(onFail: () => void) {
    this.initialized = true;
    try {
      const size = 128;
      this.offscreenCanvas = document.createElement("canvas");
      this.offscreenCanvas.width = size;
      this.offscreenCanvas.height = size;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.offscreenCanvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(size, size, false);
      this.renderer.setPixelRatio(1);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.setClearColor(0x000000, 0);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      this.camera.position.set(0, 0.08, 6.4);

      this.envRT = createStudioEnvironment(this.renderer);
      this.scene.environment = this.envRT.texture;
      this.scene.environmentIntensity = 1.0;

      this.scene.add(new THREE.HemisphereLight(0xfff5e8, 0x3b2110, 2.35));
      const dirLight = new THREE.DirectionalLight(0xfffaf0, 0.85);
      dirLight.position.set(-3, 4, 5);
      this.scene.add(dirLight);

      // Slightly tighter arm spread so arms fit cleanly inside the square 36x36 tile
      this.rig = createDivinLinkRobotRig(1.18);
      this.rig.robot.visible = false;
      this.scene.add(this.rig.robot);

      this.bindPointerListeners();

      loadRobotAssetsCached().then(({ head, arm }) => {
        if (!this.rig) return;
        attachRobotAssets(this.rig, head, arm, { hdrBloom: false });
        this.rig.robot.visible = true;
        this.assetsReady = true;
        for (const sub of this.subscribers) sub.onReady();
      });
    } catch {
      this.failed = true;
      onFail();
    }
  }

  private bindPointerListeners() {
    if (this.listenersBound) return;
    this.listenersBound = true;
    this.lastMoveTime = performance.now();

    const updateFromClient = (clientX: number, clientY: number) => {
      const vw = Math.max(window.innerWidth, 320);
      const vh = Math.max(window.innerHeight, 320);
      this.target.x = clamp(((clientX / vw) - 0.5) * 2.1, -1.15, 1.15);
      this.target.y = clamp(((clientY / vh) - 0.5) * 1.9, -1.15, 1.15);
      this.lastMoveTime = performance.now();
    };

    window.addEventListener("pointermove", (e) => updateFromClient(e.clientX, e.clientY), {
      passive: true,
    });
    window.addEventListener("pointerdown", (e) => updateFromClient(e.clientX, e.clientY), {
      passive: true,
    });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches[0]) updateFromClient(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true },
    );
  }

  private tick = (now: number) => {
    if (this.subscribers.size === 0 || this.failed) {
      this.rafId = 0;
      return;
    }
    this.rafId = window.requestAnimationFrame(this.tick);

    const rawDt = (now - this.prevTime) * 0.001;
    this.prevTime = now;

    if (document.hidden || !this.assetsReady || !this.renderer || !this.scene || !this.camera || !this.rig || !this.offscreenCanvas) {
      return;
    }

    const dt = Math.min(rawDt, 0.05);
    this.elapsed += dt;

    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = motionReduced ? 0.25 : 1;

    if (now - this.lastMoveTime > 3200) {
      this.target.x = Math.sin(this.elapsed * 0.6) * 0.45;
      this.target.y = Math.sin(this.elapsed * 0.41 + 1.2) * 0.22;
    }

    const smoothFactor = 1 - Math.pow(0.0025, dt);
    this.look.x += (this.target.x - this.look.x) * smoothFactor;
    this.look.y += (this.target.y - this.look.y) * smoothFactor;

    const bob = Math.sin(this.elapsed * 1.8) * 0.09 * m;
    this.rig.robot.position.y = bob;

    this.rig.head.rotation.y = this.look.x * 0.5;
    this.rig.head.rotation.x = this.look.y * 0.42;
    this.rig.head.rotation.z = -this.look.x * 0.06 + Math.sin(this.elapsed * 1.1) * 0.02 * m;

    this.rig.body.rotation.y = this.look.x * 0.28;
    this.rig.body.rotation.x = this.look.y * 0.12;

    for (const arm of this.rig.armStates) {
      const w = Math.sin(this.elapsed * 2.2 + arm.phase);
      const sign = Math.sign(arm.restX);
      arm.group.position.y = arm.restY + w * 0.14 * m - bob * 0.35;
      arm.group.position.x = arm.restX + sign * this.look.x * -0.04;
      arm.group.rotation.z = arm.restRz + w * 0.14 * sign * m;
      arm.group.rotation.x = Math.sin(this.elapsed * 1.4 + arm.phase) * 0.08 * m;
    }

    const px = clamp(this.look.x * 0.075, -0.07, 0.07);
    const py = clamp(-this.look.y * 0.06, -0.06, 0.06);
    for (const pw of this.rig.pupilWraps) {
      pw.position.set(px, py, 0);
    }

    if (this.blinkClock < 0 && this.elapsed >= this.nextBlink) {
      this.blinkClock = 0;
    }
    if (this.blinkClock >= 0) {
      this.blinkClock += dt;
      const p = this.blinkClock / 0.32;
      if (p >= 1) {
        this.blinkClock = -1;
        this.nextBlink = this.elapsed + 2.5 + Math.random() * 3.5;
        for (const eg of this.rig.eyeGroups) eg.scale.y = 1;
      } else {
        const sy = 1 - 0.92 * Math.sin(Math.PI * p);
        for (const eg of this.rig.eyeGroups) eg.scale.y = sy;
      }
    }

    const antOpacity = 0.7 * (0.85 + Math.sin(this.elapsed * 1.8) * 0.15) + 0.15;
    for (const sp of this.rig.antennaGlowSprites) {
      (sp.material as THREE.SpriteMaterial).opacity = antOpacity;
    }

    this.renderer.render(this.scene, this.camera);

    // Blit fresh frame immediately onto every visible avatar canvas in the same rAF tick
    for (const sub of this.subscribers) {
      const ctx = sub.canvas.getContext("2d");
      if (!ctx) continue;
      ctx.clearRect(0, 0, sub.canvas.width, sub.canvas.height);
      ctx.drawImage(this.offscreenCanvas, 0, 0, sub.canvas.width, sub.canvas.height);
    }
  };
}

let sharedAvatarRenderer: SharedAvatarRenderer | null = null;

export function getSharedAvatarRenderer(): SharedAvatarRenderer {
  if (!sharedAvatarRenderer) {
    sharedAvatarRenderer = new SharedAvatarRenderer();
  }
  return sharedAvatarRenderer;
}
