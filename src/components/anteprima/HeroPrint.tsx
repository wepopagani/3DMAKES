import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useFinePointer } from "./hooks";

const LAYERS = 16;
const BUILD = 0.72;

function isoGear(cx: number, cy: number, teeth: number, outer: number, inner: number) {
  const steps = teeth * 2;
  let d = "";
  for (let i = 0; i < steps; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.4;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

const GEAR = isoGear(160, 118, 12, 58, 44);
const HOLE = isoGear(160, 118, 10, 16, 16);

function layerColor(index: number) {
  const t = index / (LAYERS - 1);
  const r = Math.round(18 + t * 62);
  const g = Math.round(58 + t * 110);
  const b = Math.round(110 + t * 110);
  return `rgb(${r}, ${g}, ${b})`;
}

function PrintLayer({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const start = (index / LAYERS) * BUILD;
  const opacity = useTransform(progress, [start, start + 0.03], [0, 1]);
  const rise = useTransform(progress, [start, start + 0.045], [8, 0]);
  const hot = useTransform(progress, [start, start + 0.015, start + 0.07], [0, 1, 0]);
  const y = -(index * 4.4);

  return (
    <motion.g style={{ opacity, y: rise }}>
      <g transform={`translate(0 ${y})`}>
        <path d={GEAR} fill={layerColor(index)} />
        <motion.path d={GEAR} fill="none" stroke="#d7efff" strokeWidth={1.6} style={{ opacity: hot }} />
        <path d={HOLE} fill="#07111f" />
      </g>
    </motion.g>
  );
}

function Nozzle({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, (value) => {
    const built = Math.min(LAYERS - 1, Math.floor((Math.min(value, BUILD) / BUILD) * LAYERS));
    return 118 - built * 4.4 - 18;
  });
  const x = useTransform(progress, (value) => 160 + Math.sin(value * 36) * 34);
  const opacity = useTransform(progress, [0, 0.04, BUILD, BUILD + 0.08], [0, 1, 1, 0]);

  return (
    <motion.g style={{ x, y, opacity }}>
      <line x1={0} y1={-28} x2={0} y2={-2} stroke="#9fd4ff" strokeWidth={2} />
      <rect x={-11} y={-34} width={22} height={6} rx={2} fill="#d7efff" />
      <circle cx={0} cy={0} r={3.2} fill="#ffffff" />
      <circle cx={0} cy={2.5} r={5} fill="#3D9DFF" opacity={0.35} />
    </motion.g>
  );
}

export function HeroPrint() {
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const progress = useMotionValue(reduce ? 1 : 0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 18 });
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-14, 14]), { stiffness: 140, damping: 18 });
  const spin = useTransform(progress, [BUILD, 1], [0, 22]);
  const sceneOpacity = useTransform(progress, [0, 0.03, 0.92, 1], [0.4, 1, 1, 0.35]);
  const glow = useMotionTemplate`radial-gradient(120px circle at ${useTransform(pointerX, [-0.5, 0.5], [30, 70])}% ${useTransform(pointerY, [-0.5, 0.5], [25, 75])}%, rgba(61,157,255,0.45), transparent 70%)`;

  useEffect(() => {
    if (reduce) {
      progress.set(1);
      return;
    }
    const controls = animate(progress, [0, 1], {
      duration: 7.5,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [progress, reduce]);

  return (
    <div
      className="relative mx-auto w-full max-w-lg"
      style={{ perspective: 1100 }}
      onPointerMove={(event) => {
        if (!finePointer || reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div aria-hidden className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-brand-accent to-brand-blue opacity-40 blur" />
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#071422] shadow-2xl"
        style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY }}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <svg viewBox="0 0 320 250" className="relative block h-auto w-full" role="img" aria-label="Animazione di una stampa 3D che costruisce un ingranaggio strato dopo strato">
          <defs>
            <linearGradient id="bedGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D9DFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3D9DFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="168" rx="108" ry="40" fill="url(#bedGlow)" />
          <ellipse cx="160" cy="164" rx="96" ry="34" fill="none" stroke="rgba(255,255,255,0.16)" />
          <ellipse cx="160" cy="164" rx="64" ry="22" fill="none" stroke="rgba(61,157,255,0.35)" />
          <motion.g style={{ opacity: sceneOpacity, rotate: spin, originX: "160px", originY: "118px" }}>
            {Array.from({ length: LAYERS }, (_, index) => (
              <PrintLayer key={index} index={index} progress={progress} />
            ))}
          </motion.g>
          {reduce ? null : <Nozzle progress={progress} />}
        </svg>
      </motion.div>
    </div>
  );
}
