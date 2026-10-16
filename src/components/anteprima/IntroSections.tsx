import { Fragment, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { BANNER_LINES, BANNER_TEXT, GRID_PATTERN, HERO_STATS, TONY_IMAGE } from "./data";
import { useFinePointer, useGoToContact, useIntroReady, useMediaQuery } from "./hooks";
import {
  ProcessCanvas,
  chapterFromProgress,
  type ProcessChapter,
  type ProcessInput,
  type ProcessTool,
} from "./process/ProcessCanvas";
import {
  CountUp,
  Eyebrow,
  HEADING_2,
  Magnetic,
  PressLink,
  Reveal,
  SplitWords,
} from "./primitives";

const letterVariants: Variants = {
  hidden: { opacity: 0, y: "0.55em", rotate: 8 },
  shown: { opacity: 1, y: "0em", rotate: 0, transition: { type: "spring", stiffness: 380, damping: 24 } },
};

export function BannerSection() {
  const ready = useIntroReady();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tonyX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-20, 20]), { stiffness: 110, damping: 18 });
  const tonyY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-12, 12]), { stiffness: 110, damping: 18 });
  const tonyRotate = useSpring(useTransform(pointerX, [-0.5, 0.5], [-4, 4]), { stiffness: 110, damping: 18 });

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!finePointer || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#E5DDD3" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(26,42,74,0.13)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="container-custom relative grid grid-cols-1 items-center gap-6 py-10 md:py-14 lg:grid-cols-12 lg:gap-8 lg:py-8">
        <motion.h2
          aria-label={BANNER_TEXT}
          className="text-center text-[clamp(2.2rem,9.5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-brand-blue lg:col-span-8 lg:text-left xl:text-[5rem]"
          style={{ textShadow: "2px 2px 4px rgba(61, 115, 221, 0.3)" }}
          initial="hidden"
          animate={ready ? "shown" : "hidden"}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
        >
          {BANNER_LINES.map((line) => (
            <span key={line} aria-hidden className="block">
              {line.split(" ").map((word, wordIndex, words) => (
                <Fragment key={wordIndex}>
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        className="inline-block cursor-default"
                        variants={letterVariants}
                        whileHover={
                          reduce
                            ? undefined
                            : { y: -10, color: "#3D9DFF", transition: { type: "spring", stiffness: 500, damping: 14 } }
                        }
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          ))}
        </motion.h2>

        {isDesktop ? (
          <div className="relative lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 48, rotate: -8 }}
              animate={ready ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 48, rotate: -8 }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.55 }}
            >
              <motion.div style={{ x: tonyX, y: tonyY, rotate: tonyRotate }}>
                <motion.img
                  src={TONY_IMAGE.src}
                  alt={TONY_IMAGE.alt}
                  width={TONY_IMAGE.width}
                  height={TONY_IMAGE.height}
                  draggable={false}
                  className="mx-auto h-auto w-full max-w-[440px] select-none"
                  animate={reduce ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.04, rotate: -2 }}
                />
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const PROCESS_TOOLS: ProcessTool[] = ["print", "scan", "cnc", "laser"];
const INTRO_PHASES = new Set(["idea", "scan", "cad", "print", "cnc", "laser"]);

export function HeroSection() {
  const { t } = useTranslation();
  const ready = useIntroReady();
  const reduce = Boolean(useReducedMotion());
  const finePointer = useFinePointer();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const journey = desktop && !reduce;
  const goToContact = useGoToContact();
  const trackRef = useRef<HTMLElement>(null);
  const inputRef = useRef<ProcessInput>({
    hover: null,
    chapter: "hero",
    chapterT: 0,
    reduce,
    ready,
    pointerX: 0,
    pointerY: 0,
  });
  const [chapter, setChapter] = useState<ProcessChapter>("hero");
  const [hover, setHover] = useState<ProcessTool | null>(null);
  const [phase, setPhase] = useState("idea");

  useEffect(() => {
    inputRef.current.reduce = reduce;
    inputRef.current.ready = ready;
    if (!journey) {
      inputRef.current.chapter = "hero";
      inputRef.current.chapterT = 0;
      setChapter("hero");
    }
  }, [journey, ready, reduce]);

  useEffect(() => {
    if (!journey) return;
    const track = trackRef.current;
    if (!track) return;

    let glide = 0;
    let smooth = 0;
    let target = 0;
    let last = 0;

    const publish = (progress: number) => {
      const next = chapterFromProgress(progress);
      inputRef.current.chapter = next.id;
      inputRef.current.chapterT = next.t;
      setChapter((current) => (current === next.id ? current : next.id));
    };

    const measure = () => {
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 72;
      const stage = track.firstElementChild as HTMLElement | null;
      const travel = Math.max(1, track.offsetHeight - (stage?.offsetHeight ?? 0));
      const passed = header - track.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, passed / travel));
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      smooth += (target - smooth) * (1 - Math.exp(-9 * dt));
      if (Math.abs(target - smooth) < 0.0004) smooth = target;
      publish(smooth);
      glide = smooth === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = measure();
      if (glide) return;
      last = 0;
      glide = requestAnimationFrame(tick);
    };

    target = measure();
    smooth = target;
    publish(smooth);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(glide);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [journey]);

  const setTool = (tool: ProcessTool | null) => {
    inputRef.current.hover = tool;
    setHover(tool);
  };

  const onModelMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!finePointer || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    inputRef.current.pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    inputRef.current.pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  };

  const onModelLeave = () => {
    inputRef.current.pointerX = 0;
    inputRef.current.pointerY = 0;
    setTool(null);
  };

  const stats = HERO_STATS.map((stat) => ({
    ...stat,
    label: stat.labelKey ? t(stat.labelKey) : stat.label,
  }));
  const showIntroPhase = chapter === "hero" && !hover && INTRO_PHASES.has(phase);
  const showCta = chapter === "hero" || chapter === "done";

  return (
    <section
      ref={trackRef}
      className={cn("relative bg-gradient-to-b from-brand-blue to-slate-900 text-white", journey && "h-[640vh]")}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          journey && "sticky top-[72px] z-10 h-[calc(100svh-72px)]"
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(61,157,255,0.16)_0%,rgba(0,0,0,0)_46%)]" />
          <div className="h-full w-full" style={{ backgroundImage: GRID_PATTERN }} />
        </div>

        <div className="container-custom relative z-10 flex h-full flex-col justify-center py-10 lg:py-6">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
            <div className="relative min-h-[240px] text-center lg:min-h-[320px] lg:text-left">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={chapter}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {chapter === "hero" ? (
                    <>
                      <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
                        {t("hero.lab.line1")}
                        <span className="mt-1 block text-brand-accent">{t("hero.lab.line2")}</span>
                      </h1>
                      <p className="mx-auto mt-5 max-w-xl text-base text-gray-300 md:text-lg lg:mx-0">{t("hero.lab.subtitle")}</p>
                    </>
                  ) : (
                    <>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent md:text-sm">
                        {t(`hero.lab.chapters.${chapter}.eyebrow`)}
                      </p>
                      <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
                        {t(`hero.lab.chapters.${chapter}.title`)}
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl text-base text-gray-300 md:text-lg lg:mx-0">
                        {t(`hero.lab.chapters.${chapter}.body`)}
                      </p>
                    </>
                  )}

                  {showCta ? (
                    <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
                      <Magnetic>
                        <PressLink
                          to="/#contact"
                          variant="accent"
                          size="lg"
                          arrow
                          onClick={(event) => {
                            event.preventDefault();
                            goToContact();
                          }}
                        >
                          {t("hero.lab.primary")}
                        </PressLink>
                      </Magnetic>
                      <div className="flex w-full flex-col items-center gap-1 text-sm font-medium text-white/70 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:justify-center min-[480px]:gap-x-3 lg:justify-start">
                        <Link to="/services" className="transition-colors hover:text-white">
                          {t("hero.lab.technologies")}
                        </Link>
                        <span aria-hidden className="text-white/30">
                          /
                        </span>
                        <Link to="/iscrizione-corsi" className="transition-colors hover:text-white">
                          {t("hero.lab.courses")}
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {chapter === "hero" ? (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                      {stats.map((stat) => (
                        <div key={stat.label} className="border-t border-white/10 pt-2 text-left">
                          <p className="font-display text-xl font-bold text-brand-accent md:text-2xl">
                            <CountUp to={stat.end} suffix={stat.suffix} />
                          </p>
                          <p className="text-xs text-gray-400 md:text-sm">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div onPointerMove={onModelMove} onPointerLeave={onModelLeave}>
              <p className="sr-only">{t("hero.lab.aria")}</p>
              <div className="relative h-[320px] sm:h-[420px] lg:h-[min(62vh,560px)]">
                <ProcessCanvas inputRef={inputRef} onPhase={setPhase} className="absolute inset-0" />
                <div className="absolute inset-0 grid grid-cols-4">
                  {PROCESS_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      className={cn(
                        "border-0 bg-transparent",
                        hover === tool && "bg-gradient-to-t from-white/[0.07] to-transparent"
                      )}
                      onPointerEnter={() => {
                        if (finePointer) setTool(tool);
                      }}
                    />
                  ))}
                </div>
              </div>
              {showIntroPhase ? (
                <p className="mb-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                  {t(`hero.lab.phases.${phase}`)}
                </p>
              ) : (
                <div className="mb-3 h-5" aria-hidden />
              )}
              <div className="flex items-center justify-between gap-2 px-1">
                {PROCESS_TOOLS.map((tool, index) => (
                  <Fragment key={tool}>
                    {index > 0 ? (
                      <span aria-hidden className="hidden text-white/25 sm:inline">
                        ·
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-pressed={hover === tool}
                      onPointerEnter={() => {
                        if (finePointer) setTool(tool);
                      }}
                      onFocus={() => setTool(tool)}
                      onBlur={() => setTool(null)}
                      onClick={() => {
                        if (!finePointer) setTool(hover === tool ? null : tool);
                      }}
                      className={cn(
                        "min-w-0 flex-1 text-balance text-center text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:text-[0.7rem] sm:tracking-[0.08em] lg:tracking-[0.14em]",
                        hover === tool ? "text-white" : "text-white/45 hover:text-white/80"
                      )}
                    >
                      {t(`hero.lab.modes.${tool}`)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="container-custom mx-auto max-w-3xl text-center">
        <Eyebrow>{t("about.eyebrow")}</Eyebrow>
        <h2 className={cn(HEADING_2, "mb-6 text-brand-blue")}>
          <SplitWords text={t("about.heroSubtitle")} />
        </h2>
        <Reveal delay={0.15}>
          <p className="body-text mb-6">{t("about.description")}</p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="body-text mb-8">{t("about.humanFace")}</p>
        </Reveal>
        <Reveal delay={0.35} className="flex justify-center">
          <PressLink to="/about" arrow>
            {t("common.discoverMore")}
          </PressLink>
        </Reveal>
      </div>
    </section>
  );
}
