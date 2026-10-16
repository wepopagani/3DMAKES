import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SERVICE_FAMILIES } from "@/data/servicesCatalog";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "./hooks";
import { Eyebrow, HEADING_2, Magnetic, PressLink, Reveal, SplitWords, Stagger, StaggerItem } from "./primitives";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FamilyView {
  id: string;
  href: string;
  image: string;
  badge: string;
  title: string;
  description: string;
}

interface FamilyListProps {
  families: FamilyView[];
  discoverLabel: string;
}

/** Desktop: pannelli affiancati, quello aperto si allarga e mostra descrizione e link. */
function ServicesRail({ families, discoverLabel }: FamilyListProps) {
  const [active, setActive] = useState(0);
  const openRefs = useRef<(HTMLDivElement | null)[]>([]);
  const focusAfterOpen = useRef(false);

  useEffect(() => {
    if (!focusAfterOpen.current) return;
    focusAfterOpen.current = false;
    openRefs.current[active]?.focus({ preventScroll: true });
  }, [active]);

  return (
    <Reveal className="flex h-[540px] gap-3 xl:h-[560px]">
      {families.map((family, index) => {
        const isActive = index === active;
        return (
          <div
            key={family.id}
            className="group relative min-w-0 overflow-hidden rounded-3xl bg-brand-blue shadow-lg shadow-brand-blue/10 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ flexGrow: isActive ? 5 : 1, flexBasis: 0 }}
          >
            <img
              src={family.image}
              alt={isActive ? family.title : ""}
              draggable={false}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition duration-700 ease-out motion-safe:group-hover:scale-105",
                isActive ? "opacity-100" : "opacity-45 grayscale-[35%]"
              )}
            />
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 transition-colors duration-500",
                isActive
                  ? "bg-gradient-to-t from-brand-blue via-brand-blue/55 to-brand-blue/0"
                  : "bg-gradient-to-t from-brand-blue/95 to-brand-blue/50"
              )}
            />
            <AnimatePresence initial={false}>
              {isActive ? (
                <motion.div
                  key="open"
                  ref={(node) => {
                    openRefs.current[index] = node;
                  }}
                  tabIndex={-1}
                  className="absolute inset-x-0 bottom-0 p-8 outline-none xl:p-10"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.55, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div className="w-[24rem] text-white xl:w-[30rem]">
                    <span className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.18em] backdrop-blur">
                      {family.badge}
                    </span>
                    <h3 className="mb-3 text-3xl font-bold leading-tight">{family.title}</h3>
                    <p className="mb-6 text-base leading-relaxed text-white/80">{family.description}</p>
                    <PressLink to={family.href} variant="light" arrow>
                      {discoverLabel}
                    </PressLink>
                  </div>
                </motion.div>
              ) : (
                <motion.h3
                  key="closed"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <button
                    type="button"
                    aria-expanded={false}
                    onClick={(event) => {
                      focusAfterOpen.current = event.detail === 0;
                      setActive(index);
                    }}
                    className="flex h-full w-full flex-col items-center justify-between px-2 py-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent"
                  >
                    <span className="text-sm font-semibold tracking-[0.16em] text-brand-accent">{family.badge}</span>
                    <span className="rotate-180 whitespace-nowrap text-lg font-semibold [writing-mode:vertical-rl]">
                      {family.title}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 group-hover:border-brand-accent group-hover:bg-brand-accent">
                      <Plus aria-hidden className="h-4 w-4" />
                    </span>
                  </button>
                </motion.h3>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </Reveal>
  );
}

/** Mobile e tablet: fisarmonica, una famiglia aperta alla volta. */
function ServicesAccordion({ families, discoverLabel }: FamilyListProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const releaseHold = useRef<(() => void) | null>(null);

  useEffect(() => () => releaseHold.current?.(), []);

  /** Mentre il pannello sopra si chiude, il titolo toccato resta fermo invece di scivolare sotto la navbar. */
  const holdInPlace = (header: HTMLElement) => {
    releaseHold.current?.();
    const startTop = header.getBoundingClientRect().top;
    const until = performance.now() + (reduce ? 150 : 550);
    let frame = 0;
    const release = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      releaseHold.current = null;
    };
    const tick = () => {
      const drift = header.getBoundingClientRect().top - startTop;
      if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: "instant" });
      if (performance.now() < until) frame = requestAnimationFrame(tick);
      else release();
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    releaseHold.current = release;
    frame = requestAnimationFrame(tick);
  };

  const toggle = (index: number, header: HTMLElement) => {
    if (open === index) {
      setOpen(null);
      return;
    }
    if (open !== null && open < index) holdInPlace(header);
    setOpen(index);
  };

  return (
    <Stagger className="mx-auto max-w-2xl space-y-3" stagger={0.06}>
      {families.map((family, index) => {
        const isOpen = open === index;
        const panelId = `anteprima-servizio-${family.id}`;
        return (
          <StaggerItem key={family.id}>
            <div
              className={cn(
                "overflow-hidden rounded-2xl bg-white ring-1 transition-shadow duration-300",
                isOpen ? "shadow-xl shadow-brand-blue/10 ring-brand-accent/30" : "shadow-sm ring-brand-blue/5"
              )}
            >
              <h3>
                <motion.button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={(event) => toggle(index, event.currentTarget)}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center gap-4 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent sm:p-4"
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-blue">
                    <img src={family.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold tracking-[0.16em] text-brand-accent">{family.badge}</span>
                    <span className="block text-base font-semibold leading-snug text-brand-blue">{family.title}</span>
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                      isOpen ? "bg-brand-accent text-white" : "bg-brand-blue/5 text-brand-blue"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </motion.button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-5 sm:px-4">
                      <div className="group mb-4 overflow-hidden rounded-xl">
                        <img
                          src={family.image}
                          alt={family.title}
                          className="h-44 w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105 sm:h-56"
                        />
                      </div>
                      <p className="mb-5 leading-relaxed text-brand-gray">{family.description}</p>
                      <PressLink to={family.href} arrow>
                        {discoverLabel}
                      </PressLink>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export default function ServicesExplorer() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const families: FamilyView[] = SERVICE_FAMILIES.map((family) => ({
    id: family.id,
    href: family.href,
    image: family.image,
    badge: family.badge,
    title: t(`services.${family.translationKey}.title`),
    description: t(`services.${family.translationKey}.description`),
  }));
  const discoverLabel = t("common.discoverMore");

  return (
    <section id="services" className="relative overflow-hidden py-16 md:py-24" style={{ backgroundColor: "#E5DDD3" }}>
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Eyebrow>{t("services.offerEyebrow")}</Eyebrow>
          <h2 className={cn(HEADING_2, "mb-6 text-brand-blue")}>
            <SplitWords text={t("services.subtitle")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text">{t("services.description")}</p>
          </Reveal>
        </div>

        {isDesktop ? (
          <ServicesRail families={families} discoverLabel={discoverLabel} />
        ) : (
          <ServicesAccordion families={families} discoverLabel={discoverLabel} />
        )}

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="leading-relaxed text-brand-gray">{t("services.partnerNetwork")}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 text-center">
          <Magnetic>
            <PressLink to="/services" size="lg" arrow>
              {t("services.seeAll")}
            </PressLink>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
