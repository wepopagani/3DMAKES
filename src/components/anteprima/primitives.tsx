import { Fragment, useEffect, useLayoutEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Link, type To } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinePointer, useIntroReady } from "./hooks";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT_MARGIN = "0px 0px -12% 0px" as const;
const PRESS_SPRING = { type: "spring", stiffness: 420, damping: 24 } as const;

export const HEADING_2 =
  "font-display text-2xl font-extrabold leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]";

function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const ready = useIntroReady();
  return { ref, show: inView && ready };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
}

export function Reveal({ children, className, delay = 0, duration = 0.75, x = 0, y = 28, scale = 1 }: RevealProps) {
  const { ref, show } = useReveal<HTMLDivElement>();
  const hidden: Record<string, number> = { opacity: 0 };
  const shown: Record<string, number> = { opacity: 1 };
  if (x) {
    hidden.x = x;
    shown.x = 0;
  }
  if (y) {
    hidden.y = y;
    shown.y = 0;
  }
  if (scale !== 1) {
    hidden.scale = scale;
    shown.scale = 1;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={show ? shown : hidden}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function Stagger({ children, className, stagger = 0.09, delay = 0 }: StaggerProps) {
  const { ref, show } = useReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "shown" : "hidden"}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  shown: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/** Titolo che entra parola per parola; il testo resta leggibile dagli screen reader. */
export function SplitWords({ text, className, delay = 0, stagger = 0.055 }: SplitWordsProps) {
  const { ref, show } = useReveal<HTMLSpanElement>();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "shown" : "hidden"}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, show } = useReveal<HTMLParagraphElement>();
  return (
    <motion.p
      ref={ref}
      className={cn(
        "mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent md:text-sm",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <motion.span
        aria-hidden
        className="h-px w-8 origin-left bg-current"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: show ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
      />
      {children}
    </motion.p>
  );
}

const MotionLink = motion.create(Link);

const PRESS_STYLES = {
  primary: "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90",
  accent: "bg-brand-accent text-white shadow-lg shadow-brand-accent/30 hover:bg-brand-accent/90",
  outlineDark: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
  outlineLight: "border-2 border-white/70 text-white hover:border-white hover:bg-white hover:text-brand-blue",
  light: "bg-white text-brand-blue shadow-lg shadow-black/10 hover:bg-brand-light",
};

interface PressLinkProps {
  to: To;
  children: ReactNode;
  variant?: keyof typeof PRESS_STYLES;
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

function pressClasses(variant: keyof typeof PRESS_STYLES, size: "md" | "lg", className?: string) {
  return cn(
    "group inline-flex max-w-full select-none items-center justify-center gap-2 whitespace-normal rounded-full text-center font-semibold leading-snug transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
    size === "lg"
      ? "min-h-12 px-5 py-3 text-sm sm:min-h-14 sm:px-7 sm:text-base md:px-9 md:text-lg"
      : "min-h-11 px-5 py-2.5 text-sm sm:px-6 md:text-base",
    PRESS_STYLES[variant],
    className
  );
}

function PressArrow() {
  return (
    <ArrowRight
      aria-hidden
      className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
    />
  );
}

/** Link con risposta tattile: si alza in hover e si comprime alla pressione. */
export function PressLink({ to, children, variant = "primary", size = "md", arrow = false, className, onClick }: PressLinkProps) {
  return (
    <MotionLink
      to={to}
      onClick={onClick}
      className={pressClasses(variant, size, className)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={PRESS_SPRING}
    >
      {children}
      {arrow ? <PressArrow /> : null}
    </MotionLink>
  );
}

interface PressAnchorProps extends Omit<PressLinkProps, "to" | "onClick"> {
  href: string;
  target?: string;
  rel?: string;
}

/** Come PressLink, per indirizzi fuori dal router (mailto, tel, siti esterni). */
export function PressAnchor({ href, target, rel, children, variant = "primary", size = "md", arrow = false, className }: PressAnchorProps) {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={pressClasses(variant, size, className)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={PRESS_SPRING}
    >
      {children}
      {arrow ? <PressArrow /> : null}
    </motion.a>
  );
}

interface PressButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: keyof typeof PRESS_STYLES;
  size?: "md" | "lg";
  arrow?: boolean;
}

/** Come PressLink, per azioni che non sono link. */
export function PressButton({ children, variant = "primary", size = "md", arrow = false, className, type = "button", ...props }: PressButtonProps) {
  return (
    <motion.button
      type={type}
      className={pressClasses(variant, size, className)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={PRESS_SPRING}
      {...props}
    >
      {children}
      {arrow ? <PressArrow /> : null}
    </motion.button>
  );
}

export function RoundButton({ children, className, ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.88 }}
      transition={PRESS_SPRING}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Attira leggermente il contenuto verso il puntatore (solo mouse, mai con riduzione movimento). */
export function Magnetic({ children, className, strength = 0.28 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduce;
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function CountUp({ to, suffix = "", className, duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const rounded = useTransform(value, (latest) => Math.round(latest));

  useLayoutEffect(() => {
    if (!reduce) value.set(0);
  }, [reduce, value]);

  useEffect(() => {
    if (reduce) {
      value.set(to);
      return;
    }
    if (!inView || !ready) return;
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [duration, inView, ready, reduce, to, value]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${to}${suffix}`}</span>
      <span aria-hidden>
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
    </span>
  );
}

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  /** Inclinazione massima in gradi; 0 la disattiva. */
  tilt?: number;
  lift?: number;
  glow?: string;
}

/** Card che si solleva in hover, con luce che segue il puntatore ed eventuale inclinazione 3D. */
export function InteractiveCard({ children, className, tilt = 0, lift = 6, glow = "rgba(61,157,255,0.18)" }: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduce;
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const background = useMotionTemplate`radial-gradient(380px circle at ${glowX}% ${glowY}%, ${glow}, transparent 65%)`;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    glowX.set(px * 100);
    glowY.set(py * 100);
    if (tilt) {
      rotateY.set((px - 0.5) * 2 * tilt);
      rotateX.set((0.5 - py) * 2 * tilt);
    }
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={enabled ? { y: -lift } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={enabled && tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={cn("group relative", className)}
    >
      {enabled ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      ) : null}
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

interface WipeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

/** Immagine che si scopre da sinistra a destra quando entra in vista. */
export function WipeImage({ src, alt, className, width, height }: WipeImageProps) {
  const { ref, show } = useReveal<HTMLImageElement>();
  const reduce = useReducedMotion();

  if (reduce) {
    return <img ref={ref} src={src} alt={alt} width={width} height={height} className={className} />;
  }

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
      animate={{ clipPath: show ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    />
  );
}
