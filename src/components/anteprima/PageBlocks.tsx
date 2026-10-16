import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, Box, Check, Cog, Hexagon, Layers, Lightbulb, PenTool, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DECORATIVE_PHOTOS, GRID_PATTERN } from "./data";
import { useFinePointer, useIntroReady } from "./hooks";
import { Eyebrow, HEADING_2, Reveal, SplitWords } from "./primitives";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PRESS_SPRING = { type: "spring", stiffness: 420, damping: 24 } as const;
const MotionLink = motion.create(Link);

/** Le parole italiane lunghe vanno a capo con il trattino invece di uscire dallo schermo. */
export const WRAP_LONG_WORDS = "hyphens-auto [overflow-wrap:anywhere]";

const HERO_SHAPES = [
  { Icon: Box, className: "left-[4%] top-6 h-10 w-10 sm:top-[14%] sm:h-12 sm:w-12 md:h-16 md:w-16", duration: 9 },
  { Icon: Hexagon, className: "right-[6%] top-[10%] hidden h-12 w-12 sm:block", duration: 11 },
  { Icon: Layers, className: "bottom-[12%] right-[9%] hidden h-10 w-10 md:block", duration: 8 },
];

function HeroShapes() {
  const reduce = useReducedMotion();
  return (
    <>
      {HERO_SHAPES.map(({ Icon, className, duration }, index) => (
        <motion.div
          key={index}
          aria-hidden
          className={cn("pointer-events-none absolute text-brand-accent/25", className)}
          animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 10, 0] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-full w-full" strokeWidth={1} />
        </motion.div>
      ))}
    </>
  );
}

function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <MotionLink
      to={to}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={PRESS_SPRING}
      className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:border-brand-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      <ArrowLeft aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {label}
    </MotionLink>
  );
}

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  back?: { to: string; label: string };
  /** Colonna destra su desktop (HeroPrint, foto del servizio, card). */
  aside?: ReactNode;
  /** Pulsanti o note sotto il sottotitolo. */
  children?: ReactNode;
  titleClassName?: string;
  /** Contenuto sopra il titolo al posto dell'eyebrow (es. icona di conferma). */
  badge?: ReactNode;
  /** Fascia a tutta larghezza sotto il testo (es. card delle caratteristiche). */
  footer?: ReactNode;
}

/** Apertura delle pagine interne: stesso fondo, griglia e luce che segue il puntatore dell'hero in anteprima. */
export function PageHero({ title, eyebrow, subtitle, back, aside, children, titleClassName, badge, footer }: PageHeroProps) {
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}px ${glowY}px, rgba(61,157,255,0.16), transparent 65%)`;
  const centered = !aside;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!finePointer || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glowX.set(event.clientX - rect.left);
    glowY.set(event.clientY - rect.top);
  };

  const copy = (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center text-center",
        centered ? "mx-auto max-w-3xl" : "lg:items-start lg:text-left"
      )}
    >
      {back ? (
        <Reveal y={10} className="mb-6">
          <BackLink to={back.to} label={back.label} />
        </Reveal>
      ) : null}
      {badge}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1
        className={cn(
          "mb-6 max-w-full font-display text-[clamp(1.85rem,8vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight",
          WRAP_LONG_WORDS,
          titleClassName
        )}
      >
        <SplitWords text={title} />
      </h1>
      {subtitle ? (
        <Reveal delay={0.3}>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">{subtitle}</p>
        </Reveal>
      ) : null}
      {children ? (
        <Reveal delay={0.4} className="mt-8 w-full">
          {children}
        </Reveal>
      ) : null}
    </div>
  );

  return (
    <section
      onPointerMove={onPointerMove}
      className="relative overflow-hidden bg-gradient-to-b from-brand-blue to-slate-900 text-white"
    >
      <div aria-hidden className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,157,255,0.4)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="h-full w-full" style={{ backgroundImage: GRID_PATTERN }} />
      </div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <HeroShapes />

      <div className="container-custom relative z-10 pb-16 pt-12 md:pb-24 md:pt-20">
        {aside ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {copy}
            <Reveal x={48} y={0} delay={0.35} className="min-w-0">
              {aside}
            </Reveal>
          </div>
        ) : (
          copy
        )}
        {footer ? <div className="mx-auto mt-12 max-w-5xl md:mt-16">{footer}</div> : null}
      </div>
    </section>
  );
}

interface SectionIntroProps {
  title: string;
  eyebrow?: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionIntro({ title, eyebrow, text, align = "center", tone = "dark", className }: SectionIntroProps) {
  return (
    <div className={cn("mb-10 md:mb-12", align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-4", tone === "dark" ? "text-brand-blue" : "text-white")}>
        <SplitWords text={title} />
      </h2>
      {text ? (
        <Reveal delay={0.15}>
          <p className={tone === "dark" ? "body-text" : "text-base text-gray-300 md:text-lg"}>{text}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Fascia finale scura con titolo, testo e pulsanti, come la chiusura dell'anteprima. */
export function CtaBand({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-slate-900 py-16 text-white md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: GRID_PATTERN }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(61,157,255,0.18),transparent_70%)]"
      />
      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6")}>
            <SplitWords text={title} />
          </h2>
          {text ? (
            <Reveal delay={0.15}>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">{text}</p>
            </Reveal>
          ) : null}
          <Reveal delay={0.25} className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap md:gap-4">
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FilterChipsProps<T extends string> {
  options: { id: T; label: string }[];
  active: T | null;
  onChange: (id: T) => void;
  /** Identificativo unico per la pillola che scorre sotto la voce attiva. */
  layoutId: string;
  label?: string;
  align?: "start" | "center";
  className?: string;
}

/** Filtri a pillola: si comprimono alla pressione e l'evidenziatore scorre sulla voce scelta. */
export function FilterChips<T extends string>({
  options,
  active,
  onChange,
  layoutId,
  label,
  align = "start",
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "-mx-3 -my-2 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:-mx-4 sm:px-4 md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className={cn("flex w-max gap-2 md:w-auto md:flex-wrap", align === "center" && "mx-auto md:justify-center")}>
        {options.map((option) => {
          const isActive = option.id === active;
          return (
            <motion.button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={PRESS_SPRING}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
                isActive ? "text-white" : "bg-white/70 text-brand-blue ring-1 ring-brand-blue/10 hover:text-brand-accent hover:ring-brand-accent/40"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

interface FaqAccordionProps {
  items: { question: string; answer: string }[];
  idPrefix: string;
  /** Livello del titolo di ogni domanda, per rispettare la gerarchia della pagina. */
  headingLevel?: "h3" | "h4";
  /** "flush": righe separate da una linea, per elenchi dentro un contenitore già bianco. */
  tone?: "card" | "flush";
}

/** Una risposta aperta alla volta, con altezza animata e icona che ruota. */
export function FaqAccordion({ items, idPrefix, headingLevel = "h3", tone = "card" }: FaqAccordionProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const Heading = headingLevel;
  const flush = tone === "flush";

  return (
    <div className={flush ? "divide-y divide-brand-blue/10" : "space-y-3"}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${idPrefix}-${index}`;
        return (
          <div
            key={panelId}
            className={cn(
              !flush && "overflow-hidden rounded-2xl bg-white ring-1 transition-shadow duration-300",
              !flush && (isOpen ? "shadow-xl shadow-brand-blue/10 ring-brand-accent/30" : "shadow-sm ring-brand-blue/5 hover:shadow-md")
            )}
          >
            <Heading>
              <motion.button
                type="button"
                id={`${panelId}-trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                whileTap={{ scale: 0.985 }}
                className={cn(
                  "group flex w-full items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent",
                  flush ? "rounded-xl py-4" : "p-5 md:p-6"
                )}
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 pt-1.5 leading-snug transition-colors duration-300",
                    flush ? "font-medium" : "font-semibold md:text-lg",
                    WRAP_LONG_WORDS,
                    isOpen ? "text-brand-accent" : "text-brand-blue group-hover:text-brand-accent"
                  )}
                >
                  {item.question}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                    isOpen ? "bg-brand-accent text-white" : "bg-brand-blue/5 text-brand-blue group-hover:bg-brand-accent/15"
                  )}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </motion.button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="answer"
                  id={panelId}
                  role="region"
                  aria-labelledby={`${panelId}-trigger`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.38, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "leading-relaxed text-brand-gray",
                      flush ? "pb-5 pr-2 sm:pr-12" : "px-5 pb-6 md:px-6 md:text-[1.05rem]"
                    )}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Linea che si disegna quando entra in vista (collega passi e processi). */
export function GrowLine({ className, axis = "x", delay = 0.2 }: { className?: string; axis?: "x" | "y"; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const ready = useIntroReady();
  const show = inView && ready;
  const hidden = axis === "x" ? { scaleX: 0 } : { scaleY: 0 };
  const shown = axis === "x" ? { scaleX: 1 } : { scaleY: 1 };

  return (
    <motion.span
      ref={ref}
      aria-hidden
      className={cn("block", axis === "x" ? "origin-left" : "origin-top", className)}
      initial={hidden}
      animate={show ? shown : hidden}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    />
  );
}

export function CheckDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white",
        className
      )}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

/** Pannello grafico al posto delle foto generiche di laboratorio; si anima con l'hover della card che lo contiene. */
export function ServiceArt({ icon: Icon, label, className }: { icon: LucideIcon; label: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br from-brand-blue via-[#17284a] to-slate-900", className)}
    >
      <div
        className="absolute inset-0 opacity-25 transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
        style={{ backgroundImage: GRID_PATTERN }}
      />
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(61,157,255,0.42),transparent_70%)] transition-transform duration-700 ease-out motion-safe:group-hover:-translate-x-8 motion-safe:group-hover:translate-y-8" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-brand-accent ring-1 ring-white/15 backdrop-blur transition-transform duration-500 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110">
          <Icon className="h-8 w-8" strokeWidth={1.6} />
        </span>
      </div>
      <span className="absolute bottom-2 right-3 select-none font-display text-5xl font-black leading-none tracking-tight text-white/[0.07]">
        {label}
      </span>
    </div>
  );
}

/** Chiavi: id di servizi e famiglie in servicesCatalog che usano una foto generica. */
const ART_ICONS: Record<string, LucideIcon> = {
  design: PenTool,
  progettazione: PenTool,
  consulting: Lightbulb,
  consulenza: Lightbulb,
  cnc: Cog,
};

interface ServiceImageProps {
  id: string;
  src: string;
  alt: string;
  label: string;
  className?: string;
}

export function isDecorativePhoto(src: string) {
  return DECORATIVE_PHOTOS.has(src);
}

/** Foto del servizio; le foto generiche diventano un pannello grafico. */
export function ServiceImage({ id, src, alt, label, className }: ServiceImageProps) {
  if (isDecorativePhoto(src)) return <ServiceArt icon={ART_ICONS[id] ?? Layers} label={label} className={className} />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105", className)}
    />
  );
}

/** Foto incorniciata come HeroPrint: bordo luminoso e leggera inclinazione verso il puntatore. */
export function TiltPhoto({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 18 });

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
        style={reduce ? undefined : { rotateX, rotateY }}
      >
        <img src={src} alt={alt} className="block aspect-[4/3] h-auto w-full object-cover" />
      </motion.div>
    </div>
  );
}
