import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { HowWeHelpSection } from "@/components/anteprima/HelpAndFaq";
import { useGoToContact } from "@/components/anteprima/hooks";
import {
  CtaBand,
  FilterChips,
  GrowLine,
  PageHero,
  SectionIntro,
  ServiceImage,
  WRAP_LONG_WORDS,
} from "@/components/anteprima/PageBlocks";
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
import {
  SERVICE_CATALOG,
  SERVICE_FAMILIES,
  isServiceFamilyId,
  resolveServiceSlug,
  type ServiceGroupId,
} from "@/data/servicesCatalog";
import { cn } from "@/lib/utils";

const CATALOG_HASH = "catalog";
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const goToContact = useGoToContact();
  const [searchParams, setSearchParams] = useSearchParams();
  const familyParam = searchParams.get("family");
  const groupParam = searchParams.get("group");
  const activeFamily = isServiceFamilyId(familyParam) ? familyParam : null;
  const activeGroup: ServiceGroupId | "all" | null = activeFamily
    ? null
    : groupParam === "polymer" || groupParam === "metal" || groupParam === "digital"
      ? groupParam
      : "all";

  const technologies = useMemo(
    () =>
      SERVICE_CATALOG.map((tech) => ({
        ...tech,
        title: t(`services.${tech.translationKey}.title`),
        description: t(`services.${tech.translationKey}.description`),
      })),
    [t]
  );

  const groups: { id: ServiceGroupId | "all"; label: string }[] = [
    { id: "all", label: t("services.groups.all") },
    { id: "polymer", label: t("services.groups.polymer") },
    { id: "metal", label: t("services.groups.metal") },
    { id: "digital", label: t("services.groups.digital") },
  ];

  const visibleTechnologies = activeFamily
    ? technologies.filter((tech) => tech.family === activeFamily)
    : activeGroup && activeGroup !== "all"
      ? technologies.filter((tech) => tech.group === activeGroup)
      : technologies;

  const scrollToCatalog = (behavior: ScrollBehavior = "smooth") => {
    document.getElementById(CATALOG_HASH)?.scrollIntoView({ behavior, block: "start" });
  };

  const capabilities = [
    {
      n: "01",
      title: t("services.capabilities.designTitle"),
      text: t("services.capabilities.designText"),
    },
    {
      n: "02",
      title: t("services.capabilities.makeTitle"),
      text: t("services.capabilities.makeText"),
    },
    {
      n: "03",
      title: t("services.capabilities.supportTitle"),
      text: t("services.capabilities.supportText"),
    },
  ];

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash || hash === CATALOG_HASH) return;
    if (location.pathname !== "/services") return;

    navigate(`/services/${resolveServiceSlug(hash)}`, { replace: true });
  }, [location.hash, location.pathname, navigate]);

  useEffect(() => {
    if (location.hash.replace("#", "") === CATALOG_HASH) return;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.hash.replace("#", "") !== CATALOG_HASH) return;
    const frame = window.requestAnimationFrame(() => scrollToCatalog());
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.search]);

  return (
    <PageShell>
      <PageHero eyebrow={t("services.heroEyebrow")} title={t("services.heroTitle")} subtitle={t("services.heroSubtitle")} />

      {/* Dall'idea al pezzo finito */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <SectionIntro title={t("services.introTitle")} text={t("services.introText")} />
          <div className="relative mx-auto max-w-5xl">
            <GrowLine className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-0.5 rounded-full bg-brand-accent/30 md:block" />
            <Stagger className="relative grid grid-cols-1 gap-8 md:grid-cols-3" stagger={0.12}>
              {capabilities.map((item, index) => (
                <StaggerItem key={item.n} className="relative">
                  {index < capabilities.length - 1 ? (
                    <GrowLine axis="y" className="absolute -bottom-8 left-[23px] top-12 w-0.5 bg-brand-accent/30 md:hidden" />
                  ) : null}
                  <div className="group flex gap-5 md:flex-col md:items-center md:text-center">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold tracking-[0.08em] text-white shadow-lg shadow-brand-blue/20 ring-[6px] ring-white transition-[background-color,transform] duration-300 group-hover:scale-110 group-hover:bg-brand-accent">
                      {item.n}
                    </span>
                    <div className="min-w-0 pt-2.5 md:pt-0">
                      <h3 className="mb-2 text-xl font-semibold text-brand-blue md:mt-5">{item.title}</h3>
                      <p className="leading-relaxed text-brand-gray">{item.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Famiglie di servizi */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="container-custom">
          <SectionIntro align="left" title={t("services.familiesTitle")} text={t("services.familiesSubtitle")} />
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3" stagger={0.07}>
            {SERVICE_FAMILIES.map((family) => {
              const title = t(`services.${family.translationKey}.title`);
              const isActive = activeFamily === family.id;
              return (
                <StaggerItem key={family.id} className="h-full">
                  <InteractiveCard
                    lift={8}
                    glow="rgba(61,157,255,0.28)"
                    className={cn(
                      "h-full overflow-hidden rounded-3xl bg-brand-blue text-white shadow-lg shadow-brand-blue/10 transition-shadow duration-300 hover:shadow-2xl",
                      isActive && "ring-2 ring-brand-accent ring-offset-2"
                    )}
                  >
                    <Link
                      to={family.href}
                      aria-current={isActive ? "page" : undefined}
                      className="flex h-full flex-col rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <ServiceImage id={family.id} src={family.image} alt={title} label={family.badge} className="opacity-80" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.18em] backdrop-blur">
                          {family.badge}
                        </span>
                        {isActive ? (
                          <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent shadow-lg">
                            <Check aria-hidden className="h-4 w-4" strokeWidth={3} />
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 items-end justify-between gap-4 p-5">
                        <div className="min-w-0">
                          <h3
                            className={cn(
                              "mb-1.5 text-lg font-semibold transition-colors duration-300 group-hover:text-brand-accent",
                              WRAP_LONG_WORDS
                            )}
                          >
                            {title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-300">{t(`services.${family.translationKey}.tags`)}</p>
                        </div>
                        <span
                          aria-hidden
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 group-hover:border-brand-accent group-hover:bg-brand-accent"
                        >
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
                        </span>
                      </div>
                    </Link>
                  </InteractiveCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Catalogo tecnologie */}
      <section id={CATALOG_HASH} className="scroll-mt-24 bg-[#E5DDD3] py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 max-w-2xl">
              <SectionIntro
                align="left"
                className="mb-0 md:mb-0"
                title={t("services.catalogTitle")}
                text={t("services.catalogSubtitle")}
              />
              <AnimatePresence initial={false}>
                {activeFamily ? (
                  <motion.p
                    key={activeFamily}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white"
                  >
                    <Check aria-hidden className="h-4 w-4 text-brand-accent" strokeWidth={3} />
                    {t(`services.families.${activeFamily}.title`)}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
            <FilterChips
              options={groups}
              active={activeGroup}
              layoutId="servizi-gruppo-attivo"
              label={t("services.catalogTitle")}
              onChange={(id) => {
                setSearchParams(id === "all" ? {} : { group: id });
                scrollToCatalog();
              }}
            />
          </div>

          <Reveal y={20}>
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleTechnologies.map((tech) => (
                  <motion.div
                    key={tech.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="h-full"
                  >
                    <InteractiveCard
                      lift={8}
                      className="h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl"
                    >
                      <Link
                        to={`/services/${tech.slug}`}
                        className="flex h-full flex-col rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent"
                      >
                        <div className="relative h-44 overflow-hidden bg-brand-blue md:h-48">
                          <ServiceImage id={tech.id} src={tech.image} alt={tech.title} label={tech.badge} />
                          <span className="absolute left-4 top-4 rounded-full bg-brand-blue/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                            {tech.badge}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h3
                            className={cn(
                              "mb-3 text-xl font-semibold text-brand-blue transition-colors duration-300 group-hover:text-brand-accent",
                              WRAP_LONG_WORDS
                            )}
                          >
                            {tech.title}
                          </h3>
                          <p className="mb-5 line-clamp-3 leading-relaxed text-brand-gray">{tech.description}</p>
                          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors duration-300 group-hover:text-brand-accent">
                            {t("common.discoverMore")}
                            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </InteractiveCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-3xl text-center">
            <p className="leading-relaxed text-brand-gray">{t("services.partnerNetwork")}</p>
          </Reveal>
        </div>
      </section>

      <HowWeHelpSection />

      {/* Anteprima FAQ */}
      <section className="bg-[#E5DDD3] py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-4 text-brand-blue")}>
              <SplitWords text={t("services.faqTeaserTitle")} />
            </h2>
            <Reveal delay={0.15}>
              <p className="body-text mb-8">{t("services.faqTeaserText")}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <PressLink to="/faq" variant="outlineDark" size="lg" arrow>
                {t("services.faqTeaserCta")}
              </PressLink>
            </Reveal>
          </div>
          <Stagger className="min-w-0 space-y-4">
            {[1, 2, 3].map((n) => (
              <StaggerItem key={n}>
                <InteractiveCard
                  lift={4}
                  className="overflow-hidden rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-lg md:p-6"
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-5 -left-5 -top-5 w-1 origin-top scale-y-0 bg-brand-accent transition-transform duration-500 group-hover:scale-y-100 md:-bottom-6 md:-left-6 md:-top-6"
                  />
                  <p className="mb-1 font-semibold text-brand-blue">{t(`seo.homeFaqQ${n}`)}</p>
                  <p className="text-sm leading-relaxed text-brand-gray">{t(`seo.homeFaqA${n}`)}</p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand title={t("services.readyToRealize")} text={t("services.contactToday")}>
        <PressLink to="/calculator" variant="accent" size="lg" arrow>
          {t("services.calculateQuote")}
        </PressLink>
        <PressLink
          to="/#contact"
          variant="outlineLight"
          size="lg"
          onClick={(event) => {
            event.preventDefault();
            goToContact();
          }}
        >
          {t("nav.contact")}
        </PressLink>
      </CtaBand>
    </PageShell>
  );
};

export default Services;
