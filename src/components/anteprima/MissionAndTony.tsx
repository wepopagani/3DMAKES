import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { MISSION_PILLARS } from "./data";
import {
  Eyebrow,
  HEADING_2,
  InteractiveCard,
  PressLink,
  Reveal,
  SplitWords,
  Stagger,
  StaggerItem,
} from "./primitives";

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: "easeInOut", delay: 0.2 } },
};

export function MissionSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const values = [
    { n: "01", title: t("about.values.reliable"), description: t("about.values.reliableDescription") },
    { n: "02", title: t("about.values.flexible"), description: t("about.values.flexibleDescription") },
    { n: "03", title: t("about.values.close"), description: t("about.values.closeDescription") },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-blue py-16 text-white md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(61,157,255,0.16),transparent_70%)]"
      />
      <div className="container-custom relative">
        <div className="mb-16 text-center md:mb-20">
          <Eyebrow>{t("about.ourValues")}</Eyebrow>
          <h2 className={cn(HEADING_2, "mb-10")}>
            <SplitWords text={t("about.humanFaceTitle")} />
          </h2>
          <Stagger className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {values.map((value) => (
              <StaggerItem key={value.n} className="h-full">
                <InteractiveCard
                  lift={6}
                  glow="rgba(61,157,255,0.2)"
                  className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition-colors duration-300 hover:border-brand-accent/40"
                >
                  <span className="mb-3 block text-sm font-semibold tracking-[0.16em] text-brand-accent">{value.n}</span>
                  <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="text-sm text-gray-300">{value.description}</p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">La nostra mission</p>
            <h2 className={cn(HEADING_2, "mb-6")}>
              <SplitWords text={t("mission.democratize")} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mb-2 text-lg text-gray-300">{t("mission.description")}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mb-8 text-lg text-gray-300">{t("mission.paragraph1")}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <PressLink to="/mission" variant="light" arrow>
                {t("common.discoverMore")}
              </PressLink>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3" stagger={0.12}>
            {MISSION_PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title} className="min-w-0">
                <InteractiveCard tilt={8} lift={0} glow="rgba(61,157,255,0.28)" className="h-full rounded-2xl">
                  <div className="flex h-full min-h-[168px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-8 text-center transition-colors duration-300 group-hover:border-brand-accent/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                      className="mb-4 h-10 w-10 shrink-0 text-brand-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {reduce ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pillar.iconPath} />
                      ) : (
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={pillar.iconPath}
                          variants={drawVariants}
                        />
                      )}
                    </svg>
                    <h3 className="max-w-full text-balance text-xs font-bold uppercase leading-tight tracking-[0.12em] sm:text-sm">
                      {pillar.title}
                    </h3>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function TonySection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(videoRef, { amount: 0.35 });
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    if (inView) video.play().catch(() => undefined);
    else video.pause();
  }, [inView, reduce]);

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container-custom flex flex-col items-center justify-center gap-8 lg:flex-row">
        <Reveal x={-48} y={0} className="w-full max-w-2xl">
          {videoFailed ? (
            <img
              src={`https://placehold.co/600x400/ffffff/333333?text=${encodeURIComponent(t("index.tonyVideoFallbackText"))}`}
              alt={t("index.tonyVideoAlt")}
              className="h-auto w-full"
            />
          ) : (
            <video
              ref={videoRef}
              src="/tony si sdraia.mp4"
              className="h-auto w-full"
              muted
              playsInline
              preload="auto"
              controls={Boolean(reduce)}
              onEnded={
                reduce
                  ? undefined
                  : (event) => {
                      event.currentTarget.currentTime = 3;
                      event.currentTarget.play().catch(() => undefined);
                    }
              }
              onError={() => setVideoFailed(true)}
            >
              {t("index.videoUnsupported")}
            </video>
          )}
        </Reveal>
        <Reveal x={48} y={0} delay={0.15} className="w-full max-w-xl text-center lg:text-left">
          <h2 className={cn(HEADING_2, "mb-4 text-brand-blue")}>
            <SplitWords text={t("services.readyToRealize")} />
          </h2>
          <p className="body-text mb-8">{t("services.contactToday")}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <PressLink to="/calculator" size="lg" arrow>
              {t("nav.requestQuote")}
            </PressLink>
            <PressLink to="/iscrizione-corsi" size="lg" variant="outlineDark">
              {t("courseRegistration.form.title")}
            </PressLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
