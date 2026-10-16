import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  CLIENTS_ICON_PATH,
  LIGHT_ARTWORK_LOGOS,
  PARTNERS_CLIENT_COUNT,
  PREVIEW_PARTNERS,
  type PreviewPartner,
} from "./data";
import { CountUp, HEADING_2, Reveal, RoundButton, SplitWords } from "./primitives";

const AUTOPLAY_MS = 2800;
const STEP_TRANSITION = { duration: 0.9, ease: [0.65, 0, 0.35, 1] } as const;

interface PartnerTileProps {
  partner: PreviewPartner;
  tileRef: (node: HTMLElement | null) => void;
  onKeyboardFocus: (node: HTMLElement) => void;
}

function PartnerTile({ partner, tileRef, onKeyboardFocus }: PartnerTileProps) {
  const [failed, setFailed] = useState(false);
  const dark = LIGHT_ARTWORK_LOGOS.has(partner.logo);
  const className = cn(
    "group/tile relative flex h-28 w-44 shrink-0 select-none items-center justify-center rounded-2xl px-6 shadow-sm ring-1 transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-52 md:h-32 lg:w-60",
    dark ? "bg-black ring-white/10" : "bg-white ring-brand-blue/5"
  );
  const content = failed ? (
    <span className={cn("text-center text-sm font-semibold", dark ? "text-white" : "text-brand-gray")}>{partner.name}</span>
  ) : (
    <img
      src={partner.logo}
      alt={partner.name}
      draggable={false}
      onError={() => setFailed(true)}
      className="pointer-events-none max-h-16 w-full object-contain transition-transform duration-500 ease-out group-hover/tile:scale-[1.06] motion-reduce:transition-none md:max-h-20"
    />
  );

  if (!partner.website) {
    return (
      <div ref={tileRef} className={className}>
        {content}
      </div>
    );
  }

  return (
    <a
      ref={tileRef}
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) onKeyboardFocus(event.currentTarget);
      }}
      className={cn(className, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent")}
    >
      {content}
      <ArrowUpRight
        aria-hidden
        className={cn(
          "absolute right-3 top-3 h-4 w-4 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100",
          dark ? "text-white" : "text-brand-accent"
        )}
      />
    </a>
  );
}

export default function PartnersStrip() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  const snapPoints = useRef<number[]>([0]);
  const target = useRef(0);
  const direction = useRef<1 | -1>(1);
  const dragMoved = useRef(false);
  const x = useMotionValue(0);
  const maxScrollValue = useMotionValue(0);
  const progress = useTransform(() => {
    const max = maxScrollValue.get();
    return max > 0 ? Math.min(1, Math.max(0, -x.get() / max)) : 0;
  });
  const [maxScroll, setMaxScroll] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);
  const inView = useInView(viewportRef, { margin: "0px 0px -10% 0px" });
  const canScroll = maxScroll > 1;

  const updateEdges = useCallback(
    (value: number) => {
      const max = maxScrollValue.get();
      const start = -value <= 1;
      const end = -value >= max - 1;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    },
    [maxScrollValue]
  );

  useMotionValueEvent(x, "change", updateEdges);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const max = Math.max(0, track.offsetWidth - viewport.clientWidth);
    const origin = tileRefs.current[0]?.offsetLeft ?? 0;
    const points: number[] = [];
    for (const tile of tileRefs.current) {
      if (!tile) continue;
      const point = Math.min(tile.offsetLeft - origin, max);
      if (points.length === 0 || point > points[points.length - 1] + 1) points.push(point);
    }
    snapPoints.current = points.length ? points : [0];
    maxScrollValue.set(max);
    setMaxScroll(max);
    if (-x.get() > max) x.set(-max);
    updateEdges(x.get());
  }, [maxScrollValue, updateEdges, x]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const moveTo = useCallback(
    (position: number) => {
      const clamped = Math.min(maxScrollValue.get(), Math.max(0, position));
      target.current = clamped;
      if (reduce) {
        x.stop();
        x.set(-clamped);
        return;
      }
      animate(x, -clamped, STEP_TRANSITION);
    },
    [maxScrollValue, reduce, x]
  );

  /** Passa al punto di aggancio successivo nella direzione indicata; false se è già al bordo. */
  const step = useCallback(
    (dir: 1 | -1) => {
      const points = snapPoints.current;
      const current = x.isAnimating() ? target.current : -x.get();
      const next =
        dir === 1 ? points.find((point) => point > current + 1) : [...points].reverse().find((point) => point < current - 1);
      if (next === undefined) return false;
      moveTo(next);
      return true;
    },
    [moveTo, x]
  );

  const revealTile = useCallback(
    (tile: HTMLElement) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const origin = tileRefs.current[0]?.offsetLeft ?? 0;
      const left = tile.offsetLeft - origin;
      const right = left + tile.offsetWidth;
      const current = -x.get();
      if (left < current) moveTo(left);
      else if (right > current + viewport.clientWidth) moveTo(right - viewport.clientWidth);
    },
    [moveTo, x]
  );

  const paused = hovered || focused || dragging;

  useEffect(() => {
    if (reduce || paused || !inView || !canScroll) return;
    const timer = window.setInterval(() => {
      if (!step(direction.current)) {
        direction.current = direction.current === 1 ? -1 : 1;
        step(direction.current);
      }
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplayEpoch, canScroll, inView, paused, reduce, step]);

  const goManually = (dir: 1 | -1) => {
    direction.current = dir;
    step(dir);
    setAutoplayEpoch((epoch) => epoch + 1);
  };

  return (
    <section
      id="partners"
      className="relative overflow-hidden border-y border-gray-200 py-12 md:py-20"
      style={{ backgroundColor: "#E5DDD3" }}
    >
      <div className="container-custom">
        <div className="mb-8 text-center md:mb-10">
          <h2 className={cn(HEADING_2, "mb-4 text-brand-blue")}>
            <SplitWords text={t("partners.title")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text mx-auto max-w-2xl">{t("partners.description")}</p>
          </Reveal>
        </div>

        <Reveal y={0}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t("partners.title")}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(true);
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
            }}
          >
            <div ref={viewportRef} className="relative overflow-x-clip py-4">
              <motion.div
                ref={trackRef}
                className={cn(
                  "relative flex w-max gap-4 md:gap-5",
                  canScroll ? "cursor-grab active:cursor-grabbing" : "mx-auto"
                )}
                style={{ x }}
                drag={canScroll ? "x" : false}
                dragConstraints={{ left: -maxScroll, right: 0 }}
                dragElastic={0.12}
                dragTransition={{ power: 0.3, timeConstant: 240, bounceStiffness: 300, bounceDamping: 30 }}
                onPointerDownCapture={() => {
                  dragMoved.current = false;
                }}
                onDragStart={() => {
                  dragMoved.current = true;
                  setDragging(true);
                }}
                onDragEnd={(_, info) => {
                  setDragging(false);
                  if (info.velocity.x < -50) direction.current = 1;
                  else if (info.velocity.x > 50) direction.current = -1;
                }}
                onClickCapture={(event) => {
                  if (!dragMoved.current) return;
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                {PREVIEW_PARTNERS.map((partner, index) => (
                  <PartnerTile
                    key={partner.id}
                    partner={partner}
                    tileRef={(node) => {
                      tileRefs.current[index] = node;
                    }}
                    onKeyboardFocus={revealTile}
                  />
                ))}
              </motion.div>
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#E5DDD3] to-transparent transition-opacity duration-300 md:w-16",
                  edges.start ? "opacity-0" : "opacity-100"
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#E5DDD3] to-transparent transition-opacity duration-300 md:w-16",
                  edges.end || !canScroll ? "opacity-0" : "opacity-100"
                )}
              />
            </div>

            {canScroll ? (
              <div className="mt-4 flex items-center gap-4">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-brand-blue/10">
                  <motion.div className="h-full origin-left rounded-full bg-brand-blue" style={{ scaleX: progress }} />
                </div>
                <RoundButton
                  aria-label={t("common.previous")}
                  onClick={() => goManually(-1)}
                  disabled={edges.start}
                  className="bg-white text-brand-blue shadow-md hover:bg-brand-blue hover:text-white"
                >
                  <ChevronLeft aria-hidden className="h-5 w-5" />
                </RoundButton>
                <RoundButton
                  aria-label={t("common.next")}
                  onClick={() => goManually(1)}
                  disabled={edges.end}
                  className="bg-white text-brand-blue shadow-md hover:bg-brand-blue hover:text-white"
                >
                  <ChevronRight aria-hidden className="h-5 w-5" />
                </RoundButton>
              </div>
            ) : null}
          </div>
        </Reveal>

        <Reveal className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-2">
            <svg aria-hidden className="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CLIENTS_ICON_PATH} />
            </svg>
            <span className="font-semibold text-brand-blue">
              <CountUp to={PARTNERS_CLIENT_COUNT} suffix="+" /> {t("partners.companiesCount")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
