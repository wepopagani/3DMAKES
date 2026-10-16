import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { FinalCta } from "@/components/anteprima/CtaPanels";
import { GRID_PATTERN, MISSION_PILLARS } from "@/components/anteprima/data";
import { HeroPrint } from "@/components/anteprima/HeroPrint";
import { GrowLine, PageHero, SectionIntro, WRAP_LONG_WORDS } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import {
  Eyebrow,
  HEADING_2,
  InteractiveCard,
  PressLink,
  Reveal,
  SplitWords,
  Stagger,
  StaggerItem,
} from "@/components/anteprima/primitives";
import { cn } from "@/lib/utils";

const PILLAR_TEXT: Record<string, string> = {
  INNOVAZIONE:
    "Ricerchiamo costantemente le soluzioni più innovative per offrire ai nostri clienti risultati all'avanguardia. Investiamo in tecnologie di ultima generazione e aggiorniamo continuamente le nostre competenze.",
  CONOSCENZA:
    "Vogliamo che la stampa 3D diventi un linguaggio universale, conosciuto e riconosciuto da tutti, non più riservato a pochi esperti. Crediamo in un futuro in cui questa tecnologia sia parte integrante della vita quotidiana, al punto da diventare il primo pensiero quando si cerca una soluzione creativa e concreta.",
  SEMPLICITÀ:
    "Semplicità significa ridurre le distanze tra idea e realtà, eliminare barriere e rendere la creazione un processo fluido, immediato e accessibile a tutti. Crediamo che ogni innovazione debba nascere senza complicazioni, lasciando spazio solo all'essenza: trasformare un pensiero in oggetto con naturalezza, come se fosse il passo più ovvio del percorso creativo.",
};

const LAYERS_ICON = MISSION_PILLARS[2].iconPath;

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: "easeInOut", delay: 0.2 } },
};

const Mission = () => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  // Effect to handle page load scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const commitments = MISSION_PILLARS.map((pillar) => ({ ...pillar, text: PILLAR_TEXT[pillar.title] }));
  const visionParagraphs = [t("mission.visionParagraph1"), t("mission.visionParagraph2"), t("mission.visionParagraph3")];

  return (
    <PageShell>
      <PageHero title={t("mission.title")} subtitle={t("mission.subtitle")} />

      {/* Il nostro obiettivo */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>{t("mission.ourGoal")}</Eyebrow>
            <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6 text-brand-blue")}>
              <SplitWords text={t("mission.revolutionTitle")} />
            </h2>
            <Reveal delay={0.1}>
              <p className="body-text mb-6">{t("mission.paragraph1")}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="body-text">{t("mission.paragraph2")}</p>
            </Reveal>
          </div>

          <Reveal x={48} y={0} delay={0.15} className="min-w-0">
            <InteractiveCard tilt={6} lift={0} glow="rgba(61,157,255,0.3)" className="rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-slate-900 p-8 text-white shadow-2xl shadow-brand-blue/30 md:p-12">
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: GRID_PATTERN }} />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 text-brand-accent/20 md:h-80 md:w-80"
                >
                  <motion.path
                    d={LAYERS_ICON}
                    strokeWidth={0.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
                  />
                </svg>
                <div className="relative">
                  <motion.span
                    className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg shadow-brand-accent/40"
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
                  >
                    <Check aria-hidden className="h-7 w-7" strokeWidth={3} />
                  </motion.span>
                  <p className={cn("font-display text-3xl font-extrabold leading-tight md:text-4xl", WRAP_LONG_WORDS)}>
                    <SplitWords text={t("mission.democratize")} delay={0.2} />
                  </p>
                  <GrowLine className="mt-8 h-1 w-24 rounded-full bg-brand-accent" delay={0.6} />
                </div>
              </div>
            </InteractiveCard>
          </Reveal>
        </div>
      </section>

      {/* I nostri impegni */}
      <section className="relative overflow-hidden bg-[#E5DDD3] py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(26,42,74,0.13)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="container-custom relative">
          <SectionIntro
            eyebrow={t("mission.ourCommitments")}
            title={t("mission.howWeRealize")}
            text={t("mission.commitmentDescription")}
          />
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6" stagger={0.12}>
            {commitments.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <InteractiveCard
                  lift={8}
                  className="h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="flex h-full flex-col p-6 md:p-8">
                    <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                        className="h-7 w-7 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {reduce ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                        ) : (
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.iconPath}
                            variants={drawVariants}
                          />
                        )}
                      </svg>
                    </span>
                    <h3 className="mb-3 text-xl font-bold tracking-[0.08em] text-brand-blue">{item.title}</h3>
                    <p className="leading-relaxed text-brand-gray">{item.text}</p>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* La nostra visione */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>{t("mission.ourVision")}</Eyebrow>
            <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6 text-brand-blue")}>
              <SplitWords text={t("mission.visionTitle")} />
            </h2>
            {visionParagraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.1 + index * 0.1}>
                <p className="body-text mb-6">{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.4} className="pt-2">
              <PressLink to="/services" arrow className="h-auto min-h-11 py-3 text-center">
                {t("mission.discoverVision")}
              </PressLink>
            </Reveal>
          </div>
          <Reveal x={48} y={0} delay={0.2} className="min-w-0">
            <HeroPrint />
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </PageShell>
  );
};

export default Mission;
