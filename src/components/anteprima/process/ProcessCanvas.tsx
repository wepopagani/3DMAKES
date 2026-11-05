import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import { getHousingAsset, type HousingAsset } from "./housing";
import { createMillStock, type MillStock } from "./millStock";

export type ProcessTool = "print" | "scan" | "cnc" | "laser";
export type ProcessChapter = "hero" | "scan" | "reverse" | "print" | "cnc" | "laser" | "done";

export type ProcessInput = {
  hover: ProcessTool | null;
  chapter: ProcessChapter;
  chapterT: number;
  reduce: boolean;
  ready: boolean;
  pointerX: number;
  pointerY: number;
};

const CHAPTERS: Array<{ id: ProcessChapter; span: number }> = [
  { id: "hero", span: 0.1 },
  { id: "scan", span: 0.15 },
  { id: "reverse", span: 0.15 },
  { id: "print", span: 0.16 },
  { id: "cnc", span: 0.16 },
  { id: "laser", span: 0.15 },
  { id: "done", span: 0.13 },
];

export function chapterFromProgress(progress: number) {
  const value = Math.min(1, Math.max(0, progress));
  let cursor = 0;
  for (const chapter of CHAPTERS) {
    const end = cursor + chapter.span;
    if (value <= end || chapter.id === "done") {
      return {
        id: chapter.id,
        t: Math.min(1, Math.max(0, (value - cursor) / chapter.span)),
      };
    }
    cursor = end;
  }
  return { id: "done" as const, t: 1 };
}

type Look = {
  points: number;
  pointReveal: number;
  scanY: number;
  scanLine: number;
  solid: number;
  finish: number;
  wire: number;
  layers: number;
  layerBuild: number;
  layerGap: number;
  stock: number;
  cnc: number;
  engrave: number;
  laser: number;
  spin: number;
};

const POLYMER = new THREE.Color("#d7d2ca");
const METAL = new THREE.Color("#c4c8ce");
const ANODIZED = new THREE.Color("#3d444c");
const INTRO_SECONDS = 7.4;
const CNC_LOOP_MS = 9000;

function blankLook(scanY: number): Look {
  return {
    points: 0,
    pointReveal: 1,
    scanY,
    scanLine: 0,
    solid: 0,
    finish: 0,
    wire: 0,
    layers: 0,
    layerBuild: 1,
    layerGap: 0,
    stock: 0,
    cnc: 0,
    engrave: 0,
    laser: 0,
    spin: 0.2,
  };
}

function finishedLook(scanY: number): Look {
  return { ...blankLook(scanY), solid: 1, finish: 1.15, engrave: 1, spin: 0.55 };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function introLook(t: number, yMin: number, yMax: number): Look {
  const look = blankLook(yMax);
  if (t < 0.12) {
    look.points = 1;
    look.pointReveal = t / 0.12;
    look.spin = 0.05;
    return look;
  }
  if (t < 0.3) {
    const k = (t - 0.12) / 0.18;
    look.points = 1;
    look.scanY = lerp(yMax, yMin, k);
    look.scanLine = 1;
    look.spin = 0.05;
    return look;
  }
  if (t < 0.44) {
    const k = (t - 0.3) / 0.14;
    look.points = 1 - k;
    look.scanY = yMin;
    look.wire = k;
    look.solid = k * 0.14;
    return look;
  }
  if (t < 0.68) {
    const k = (t - 0.44) / 0.24;
    look.layers = 1;
    look.layerBuild = Math.max(k, 0.04);
    look.wire = Math.max(0, 1 - k * 4);
    look.spin = 0.12;
    return look;
  }
  if (t < 0.82) {
    const k = (t - 0.68) / 0.14;
    look.stock = 1;
    look.cnc = k;
    look.solid = 1;
    look.finish = 1;
    look.layers = Math.max(0, 1 - k * 3);
    look.spin = 0.03;
    return look;
  }
  if (t < 0.94) {
    const k = (t - 0.82) / 0.12;
    look.solid = 1;
    look.finish = lerp(1, 2, k);
    look.engrave = k;
    look.laser = 1;
    look.stock = Math.max(0, 1 - k * 5);
    return look;
  }
  const done = finishedLook(yMax);
  done.laser = 1 - (t - 0.94) / 0.06;
  return done;
}

function hoverLook(tool: ProcessTool, loop: number, yMin: number, yMax: number): Look {
  const look = blankLook(yMax);
  if (tool === "print") {
    look.layers = 1;
    look.layerBuild = 1;
    look.layerGap = 0.006;
    look.spin = 0.35;
    return look;
  }
  if (tool === "scan") {
    look.points = 1;
    look.scanY = lerp(yMax, yMin, loop);
    look.scanLine = 1;
    look.spin = 0.08;
    return look;
  }
  if (tool === "cnc") {
    look.stock = 1;
    look.cnc = loop;
    look.solid = 1;
    look.finish = 1;
    look.spin = 0.03;
    return look;
  }
  look.solid = 1;
  look.finish = 2;
  look.engrave = loop;
  look.laser = 1;
  look.spin = 0.08;
  return look;
}

function scrollLook(chapter: ProcessChapter, t: number, yMin: number, yMax: number): Look {
  if (chapter === "scan") {
    const look = blankLook(yMax);
    look.points = 1;
    look.scanY = lerp(yMax, yMin, t);
    look.scanLine = Math.min(1, t / 0.12, (1 - t) / 0.12);
    look.spin = 0.08;
    return look;
  }
  if (chapter === "reverse") {
    const look = blankLook(yMin);
    if (t < 0.34) {
      look.points = 1;
      look.scanY = yMin;
      return look;
    }
    if (t < 0.67) {
      const k = (t - 0.34) / 0.33;
      look.points = 1 - k;
      look.solid = 0.2 + k * 0.55;
      look.wire = k * 0.35;
      return look;
    }
    const k = (t - 0.67) / 0.33;
    look.solid = lerp(0.75, 0.08, k);
    look.wire = lerp(0.35, 1, k);
    return look;
  }
  if (chapter === "print") {
    const look = blankLook(yMax);
    const arrive = Math.min(1, t / 0.12);
    look.layers = arrive;
    look.layerBuild = Math.max(t, 0.04);
    look.wire = (1 - arrive) * 0.85;
    look.spin = 0.12;
    return look;
  }
  if (chapter === "cnc") {
    const look = blankLook(yMax);
    const handoff = Math.min(1, t / 0.22);
    look.layers = 1 - handoff;
    look.layerBuild = 1;
    look.solid = 1;
    look.finish = 1;
    look.stock = Math.min(1, Math.max(0, (t - 0.08) / 0.22));
    look.cnc = Math.max(0, (t - 0.16) / 0.84);
    look.spin = 0.03;
    return look;
  }
  if (chapter === "laser") {
    const look = blankLook(yMax);
    look.solid = 1;
    look.finish = 2;
    look.engrave = t;
    look.laser = Math.min(1, t / 0.12, (1 - t) / 0.12);
    look.cnc = 1;
    look.spin = 0.08;
    return look;
  }
  return finishedLook(yMax);
}

const BLEND = 0.02;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function mixLook(a: Look, b: Look, t: number): Look {
  const out = { ...a };
  (Object.keys(a) as Array<keyof Look>).forEach((key) => {
    out[key] = lerp(a[key], b[key], t);
  });
  const aLayers = a.layers * (1 - t);
  const bLayers = b.layers * t;
  const layerSum = aLayers + bLayers;
  if (layerSum > 0.001) out.layerBuild = (a.layerBuild * aLayers + b.layerBuild * bLayers) / layerSum;
  const aPoints = a.points * (1 - t);
  const bPoints = b.points * t;
  const pointSum = aPoints + bPoints;
  if (pointSum > 0.001) out.scanY = (a.scanY * aPoints + b.scanY * bPoints) / pointSum;
  return out;
}

function progressOf(chapter: ProcessChapter, t: number) {
  let cursor = 0;
  for (const item of CHAPTERS) {
    if (item.id === chapter) return cursor + item.span * Math.min(1, Math.max(0, t));
    cursor += item.span;
  }
  return 1;
}

function chapterWeight(progress: number, start: number, end: number) {
  if (progress < start - BLEND || progress > end + BLEND) return 0;
  if (progress < start) return 0.5 * (1 - smoothstep((start - progress) / BLEND));
  if (progress > end) return 0.5 * (1 - smoothstep((progress - end) / BLEND));
  const edge = Math.min(progress - start, end - progress);
  if (edge >= BLEND) return 1;
  return 0.5 + 0.5 * smoothstep(edge / BLEND);
}

function blendedScrollLook(progress: number, yMin: number, yMax: number): Look {
  const value = Math.min(1, Math.max(0, progress));
  let cursor = 0;
  let look: Look | null = null;
  let weight = 0;
  for (const chapter of CHAPTERS) {
    const start = cursor;
    const end = cursor + chapter.span;
    cursor = end;
    const sampleWeight = chapterWeight(value, start, end);
    if (sampleWeight <= 0) continue;
    const local = Math.min(1, Math.max(0, (value - start) / chapter.span));
    const sample = scrollLook(chapter.id, local, yMin, yMax);
    if (!look) {
      look = sample;
      weight = sampleWeight;
    } else {
      const next = weight + sampleWeight;
      look = mixLook(look, sample, sampleWeight / next);
      weight = next;
    }
  }
  return look ?? finishedLook(yMax);
}

function targetLook(input: ProcessInput, intro: number, loop: number, yMin: number, yMax: number) {
  if (input.hover) return hoverLook(input.hover, loop, yMin, yMax);
  if (input.chapter === "hero" && intro < 1 && input.chapterT < 0.02) return introLook(intro, yMin, yMax);
  return blendedScrollLook(progressOf(input.chapter, input.chapterT), yMin, yMax);
}

function phaseOf(input: ProcessInput, intro: number) {
  if (input.hover) return input.hover;
  if (input.chapter !== "hero") return input.chapter;
  if (intro >= 1) return "done";
  if (intro < 0.12) return "idea";
  if (intro < 0.3) return "scan";
  if (intro < 0.44) return "cad";
  if (intro < 0.68) return "print";
  if (intro < 0.82) return "cnc";
  if (intro < 0.94) return "laser";
  return "done";
}

function damp(current: number, target: number, delta: number, speed: number) {
  return lerp(current, target, 1 - Math.exp(-speed * delta));
}

function makeEngraveTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f3efe8";
  context.font = "700 148px Montserrat, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  (context as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "0.16em";
  context.fillText("3DMAKES", 512, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

const pointVertex = `
  attribute float aRand;
  uniform float uReveal;
  uniform float uScan;
  uniform float uSize;
  varying float vOn;
  void main() {
    float shown = step(aRand, uReveal) * step(position.y, uScan + 0.004);
    vOn = shown;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * shown;
    gl_Position = projectionMatrix * view;
  }
`;

const pointFragment = `
  uniform float uOpacity;
  varying float vOn;
  void main() {
    if (vOn < 0.5) discard;
    vec2 centered = gl_PointCoord - vec2(0.5);
    if (dot(centered, centered) > 0.25) discard;
    gl_FragColor = vec4(0.90, 0.92, 0.94, uOpacity);
  }
`;

const engraveVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const engraveFragment = `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform vec3 uInk;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uReveal) discard;
    vec4 texel = texture2D(uMap, vUv);
    if (texel.a < 0.35) discard;
    gl_FragColor = vec4(uInk, 1.0);
  }
`;

function ProcessObject({
  inputRef,
  onPhase,
}: {
  inputRef: RefObject<ProcessInput>;
  onPhase?: (phase: string) => void;
}) {
  const asset = useMemo(() => getHousingAsset(), []);
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.Mesh>(null);
  const points = useRef<THREE.Points>(null);
  const edges = useRef<THREE.LineSegments>(null);
  const tool = useRef<THREE.Group>(null);
  const flutes = useRef<THREE.Group>(null);
  const cncStart = useRef<number | null>(null);
  const beam = useRef<THREE.Mesh>(null);
  const hot = useRef<THREE.Mesh>(null);
  const scan = useRef<THREE.Mesh>(null);
  const mark = useRef<THREE.Mesh>(null);
  const layers = useRef<Array<THREE.Mesh | null>>([]);
  const look = useRef<Look>(blankLook(asset.bounds.max.y));
  const intro = useRef(0);
  const introStart = useRef<number | null>(null);
  const yaw = useRef(0.78);
  const phase = useRef("");
  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;

  const yMin = asset.bounds.min.y;
  const yMax = asset.bounds.max.y;

  const resources = useMemo(() => buildResources(asset), [asset]);

  useEffect(() => {
    let active = true;
    const apply = () => {
      if (!active) return;
      const next = makeEngraveTexture();
      const material = mark.current?.material;
      if (next && material instanceof THREE.ShaderMaterial) {
        const previous = material.uniforms.uMap.value as THREE.Texture | null;
        material.uniforms.uMap.value = next;
        previous?.dispose();
      }
    };
    document.fonts?.load("700 148px Montserrat").then(apply).catch(apply);
    return () => {
      active = false;
    };
  }, []);

  useFrame((_, delta) => {
    const input = inputRef.current;
    if (!input || !group.current) return;
    const step = Math.min(delta, 0.05);

    const introRunning = input.ready && !input.hover && input.chapter === "hero" && !input.reduce;
    if (input.reduce) intro.current = 1;
    else if (introRunning && intro.current < 1) {
      if (introStart.current === null) introStart.current = performance.now();
      intro.current = Math.min(1, (performance.now() - introStart.current) / (INTRO_SECONDS * 1000));
    } else if (introStart.current !== null && intro.current < 1) {
      introStart.current = performance.now() - intro.current * INTRO_SECONDS * 1000;
    }

    const nextPhase = phaseOf(input, intro.current);
    if (nextPhase !== phase.current) {
      phase.current = nextPhase;
      onPhaseRef.current?.(nextPhase);
    }

    if (input.hover === "cnc") {
      if (cncStart.current === null) cncStart.current = performance.now();
    } else {
      cncStart.current = null;
    }
    const loop =
      input.hover === "cnc" && cncStart.current !== null
        ? ((performance.now() - cncStart.current) % CNC_LOOP_MS) / CNC_LOOP_MS
        : (performance.now() % 3400) / 3400;
    const target = targetLook(input, intro.current, loop, yMin, yMax);
    const current = look.current;
    const speed = input.reduce ? 22 : input.hover ? 8 : 11;
    (Object.keys(current) as Array<keyof Look>).forEach((key) => {
      const goal = target[key];
      const rewind = key === "cnc" && input.hover === "cnc" && goal < current[key] - 0.35;
      current[key] = rewind || Math.abs(current[key] - goal) > 3 ? goal : damp(current[key], goal, step, speed);
    });

    if (flutes.current) flutes.current.rotation.y += step * 42;
    yaw.current += step * 0.22 * current.spin;
    group.current.rotation.y = damp(group.current.rotation.y, yaw.current + input.pointerX * 0.7, step, 6);
    group.current.rotation.x = damp(group.current.rotation.x, -0.16 + input.pointerY * 0.32, step, 6);

    applyLook(current, {
      solid: solid.current,
      points: points.current,
      edges: edges.current,
      stock: resources.mill,
      tool: tool.current,
      beam: beam.current,
      hot: hot.current,
      scan: scan.current,
      mark: mark.current,
      layers: layers.current,
      engraveY: asset.engraveY,
    });
  });

  return (
    <>
      <hemisphereLight args={["#f4f6f8", "#1c2838", 0.72]} />
      <directionalLight position={[4.2, 7.2, 3.2]} intensity={2.7} color="#fffaf6" />
      <directionalLight position={[-5, 3.2, -2]} intensity={1.15} color="#d5e2f2" />
      <directionalLight position={[0.2, 1.6, 6]} intensity={0.7} color="#ffffff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yMin - 0.02, 0]} renderOrder={-1}>
        <planeGeometry args={[3.1, 2.1]} />
        <meshBasicMaterial map={resources.shadow} transparent depthWrite={false} />
      </mesh>
      <group ref={group} scale={0.78}>
        <mesh ref={solid} geometry={asset.geometry} material={resources.solid} />
        <lineSegments ref={edges} geometry={resources.edges} material={resources.wire} />
        <points ref={points} geometry={resources.pointGeometry} material={resources.points} />
        {asset.layers.map((geometry, index) => (
          <mesh
            key={index}
            ref={(node) => {
              layers.current[index] = node;
            }}
            geometry={geometry}
            material={resources.layerMaterials[index]}
            visible={false}
          />
        ))}
        <primitive object={resources.mill.mesh} />
        <mesh ref={scan} geometry={resources.scan} material={resources.scanMaterial} visible={false} />
        <mesh ref={mark} geometry={resources.mark} material={resources.markMaterial} position={[0, asset.engraveY, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false} />
        <group ref={tool} visible={false}>
          <mesh position={[0, 0.23, 0]} material={resources.holderMaterial} geometry={resources.holder} />
          <mesh position={[0, 0.075, 0]} material={resources.tool} geometry={resources.shank} />
          <group ref={flutes}>
            <mesh position={[0, 0.02, 0]} material={resources.tool} geometry={resources.core} />
            {[0, 1, 2, 3].map((tooth) => (
              <mesh key={tooth} position={[0, 0.02, 0]} rotation={[0, tooth * Math.PI * 0.5, 0]} material={resources.fluteMaterial} geometry={resources.flute} />
            ))}
          </group>
        </group>
        <mesh ref={beam} geometry={resources.beam} material={resources.beamMaterial} visible={false} />
        <mesh ref={hot} geometry={resources.hot} material={resources.hotMaterial} visible={false} />
      </group>
    </>
  );
}

function buildResources(asset: HousingAsset) {
  const solid = new THREE.MeshStandardMaterial({
    color: POLYMER,
    roughness: 0.55,
    metalness: 0.04,
    envMapIntensity: 0.6,
  });
  const wire = new THREE.LineBasicMaterial({ color: "#d5dee8", transparent: true, opacity: 0 });
  const edges = new THREE.EdgesGeometry(asset.geometry, 26);

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(asset.points, 3));
  pointGeometry.setAttribute("aRand", new THREE.BufferAttribute(asset.pointRand, 1));
  const points = new THREE.ShaderMaterial({
    uniforms: {
      uReveal: { value: 0 },
      uScan: { value: asset.bounds.max.y + 1 },
      uSize: { value: 3.6 },
      uOpacity: { value: 0 },
    },
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
  });

  const layerMaterials = asset.layers.map((_, index) => {
    const color = index % 2 === 0 ? "#ddd8d0" : "#d2cdc4";
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.62,
      metalness: 0.03,
      envMapIntensity: 0.4,
      transparent: true,
      opacity: 0,
    });
  });

  const scanGeometry = new THREE.BoxGeometry(
    (asset.bounds.max.x - asset.bounds.min.x) * 0.96,
    0.01,
    0.012
  );
  const scanMaterial = new THREE.MeshBasicMaterial({
    color: "#f7f3ec",
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const markMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: makeEngraveTexture() },
      uReveal: { value: 0 },
      uInk: { value: new THREE.Color("#1a1e24") },
    },
    vertexShader: engraveVertex,
    fragmentShader: engraveFragment,
    side: THREE.DoubleSide,
  });
  const mark = new THREE.PlaneGeometry(0.52, 0.16);

  const tool = new THREE.MeshStandardMaterial({
    color: "#c5ced6",
    roughness: 0.32,
    metalness: 0.88,
    transparent: true,
    opacity: 0,
  });
  const flute = new THREE.MeshStandardMaterial({
    color: "#edf2f6",
    roughness: 0.22,
    metalness: 0.94,
    transparent: true,
    opacity: 0,
  });
  const holderMaterial = new THREE.MeshStandardMaterial({
    color: "#8d98a4",
    roughness: 0.38,
    metalness: 0.8,
    transparent: true,
    opacity: 0,
  });
  const shank = new THREE.CylinderGeometry(0.026, 0.026, 0.07, 18);
  const core = new THREE.CylinderGeometry(0.022, 0.022, 0.04, 16);
  const fluteGeometry = new THREE.BoxGeometry(0.1, 0.04, 0.012);
  fluteGeometry.translate(0.046, 0, 0);
  const holder = new THREE.CylinderGeometry(0.052, 0.06, 0.24, 22);
  const beam = new THREE.CylinderGeometry(0.004, 0.009, 1, 10);
  const beamMaterial = new THREE.MeshBasicMaterial({ color: "#fff6ea", transparent: true, opacity: 0.8 });
  const hot = new THREE.SphereGeometry(0.016, 12, 12);
  const hotMaterial = new THREE.MeshBasicMaterial({ color: "#fffaf3", transparent: true, opacity: 0 });
  const shadow = shadowTexture();

  return {
    solid,
    wire,
    edges,
    pointGeometry,
    points,
    layerMaterials,
    mill: createMillStock(asset),
    scan: scanGeometry,
    scanMaterial,
    mark,
    markMaterial,
    tool,
    fluteMaterial: flute,
    flute: fluteGeometry,
    holderMaterial,
    holder,
    shank,
    core,
    beam,
    beamMaterial,
    hot,
    hotMaterial,
    shadow,
  };
}

function applyFinish(material: THREE.MeshStandardMaterial, finish: number, opacity: number) {
  const color = new THREE.Color();
  if (finish <= 1) {
    color.copy(POLYMER).lerp(METAL, finish);
    material.metalness = lerp(0.04, 0.78, finish);
    material.roughness = lerp(0.56, 0.34, finish);
  } else {
    color.copy(METAL).lerp(ANODIZED, finish - 1);
    material.metalness = lerp(0.78, 0.62, finish - 1);
    material.roughness = lerp(0.34, 0.46, finish - 1);
  }
  material.color.copy(color);
  material.opacity = opacity;
  material.transparent = opacity < 0.98;
  material.depthWrite = opacity > 0.85;
}

function applyLook(
  look: Look,
  nodes: {
    solid: THREE.Mesh | null;
    points: THREE.Points | null;
    edges: THREE.LineSegments | null;
    stock: MillStock | null;
    tool: THREE.Group | null;
    beam: THREE.Mesh | null;
    hot: THREE.Mesh | null;
    scan: THREE.Mesh | null;
    mark: THREE.Mesh | null;
    layers: Array<THREE.Mesh | null>;
    engraveY: number;
  }
) {
  if (nodes.solid) {
    const opacity = look.solid * (1 - Math.min(1, Math.max(0, look.layers)));
    nodes.solid.visible = opacity > 0.03;
    const material = nodes.solid.material as THREE.MeshStandardMaterial;
    applyFinish(material, look.finish, opacity);
  }

  if (nodes.points) {
    nodes.points.visible = look.points > 0.03;
    const material = nodes.points.material as THREE.ShaderMaterial;
    material.uniforms.uOpacity.value = look.points;
    material.uniforms.uReveal.value = look.pointReveal;
    material.uniforms.uScan.value = look.scanY;
  }

  if (nodes.edges) {
    nodes.edges.visible = look.wire > 0.04;
    const material = nodes.edges.material as THREE.LineBasicMaterial;
    material.opacity = look.wire;
  }

  const count = nodes.layers.length;
  const built = look.layerBuild * count;
  nodes.layers.forEach((mesh, index) => {
    if (!mesh) return;
    const mid = (count - 1) / 2;
    const reveal = built - index;
    const opacity = look.layers * Math.min(1, Math.max(0, reveal));
    mesh.visible = opacity > 0.02;
    mesh.position.y = (index - mid) * look.layerGap;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.opacity = opacity;
    material.transparent = true;
    material.depthWrite = opacity > 0.85;
    const active = reveal > 0 && reveal < 1.15 && look.layerGap < 0.0004 && look.layers > 0.85;
    material.emissive.set(active ? "#6a5c50" : "#000000");
    material.emissiveIntensity = active ? 0.45 : 0;
  });

  const stockOpacity = Math.min(1, Math.max(0, look.stock));
  const milling = stockOpacity > 0.02 && look.cnc < 0.995;
  if (nodes.stock) {
    nodes.stock.mesh.visible = milling;
    const material = nodes.stock.mesh.material as THREE.MeshStandardMaterial;
    material.opacity = stockOpacity;
    material.depthWrite = stockOpacity > 0.85;
    const stockTransparent = stockOpacity < 0.98;
    if (material.transparent !== stockTransparent) {
      material.transparent = stockTransparent;
      material.needsUpdate = true;
    }
    if (milling) nodes.stock.update(look.cnc);
  }

  if (nodes.tool && nodes.stock) {
    const toolOpacity = Math.min(stockOpacity, Math.min(1, look.cnc * 8), Math.min(1, (1 - look.cnc) * 12));
    nodes.tool.visible = toolOpacity > 0.03;
    if (nodes.tool.visible) {
      const point = nodes.stock.toolAt(look.cnc);
      nodes.tool.position.set(point.x, point.y, point.z);
    }
    nodes.tool.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = toolOpacity;
      material.depthWrite = toolOpacity > 0.85;
      const toolTransparent = toolOpacity < 0.98;
      if (material.transparent !== toolTransparent) {
        material.transparent = toolTransparent;
        material.needsUpdate = true;
      }
    });
  }

  if (nodes.scan) {
    const scanOpacity = Math.min(look.scanLine, look.points);
    nodes.scan.visible = scanOpacity > 0.03;
    nodes.scan.position.y = look.scanY;
    const material = nodes.scan.material as THREE.MeshBasicMaterial;
    material.opacity = scanOpacity;
    material.transparent = true;
    material.depthWrite = false;
  }

  const markX = lerp(-0.22, 0.22, look.engrave);
  if (nodes.mark) {
    nodes.mark.visible = look.engrave > 0.02 && look.solid > 0.4;
    const material = nodes.mark.material as THREE.ShaderMaterial;
    material.uniforms.uReveal.value = look.engrave;
    (material.uniforms.uInk.value as THREE.Color).set(look.finish > 1.45 ? "#f4f0e8" : "#1a1e24");
  }

  const beamOpacity = Math.min(look.laser, Math.min(1, look.engrave * 5), Math.min(1, (1 - look.engrave) * 8));
  if (nodes.beam) {
    nodes.beam.visible = beamOpacity > 0.04;
    nodes.beam.position.set(markX, nodes.engraveY + 0.42, 0);
    nodes.beam.scale.set(1, 0.84, 1);
    const material = nodes.beam.material as THREE.MeshBasicMaterial;
    material.opacity = 0.85 * beamOpacity;
    material.transparent = true;
  }
  if (nodes.hot) {
    nodes.hot.visible = beamOpacity > 0.04;
    nodes.hot.position.set(markX, nodes.engraveY + 0.01, 0);
    const material = nodes.hot.material as THREE.MeshBasicMaterial;
    material.opacity = beamOpacity;
    material.transparent = true;
  }
}

function AimCamera() {
  const aimed = useRef(false);
  useFrame(({ camera }) => {
    if (aimed.current) return;
    camera.lookAt(0, 0, 0);
    aimed.current = true;
  });
  return null;
}

export function ProcessCanvas({
  inputRef,
  onPhase,
  className,
}: {
  inputRef: RefObject<ProcessInput>;
  onPhase?: (phase: string) => void;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        className="!h-full !w-full"
        dpr={[1, 1.6]}
        camera={{ position: [2.15, 1.85, 2.85], fov: 30, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
          const pmrem = new THREE.PMREMGenerator(gl);
          scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          pmrem.dispose();
          camera.lookAt(0, 0, 0);
        }}
      >
        <AimCamera />
        <ProcessObject inputRef={inputRef} onPhase={onPhase} />
      </Canvas>
    </div>
  );
}
