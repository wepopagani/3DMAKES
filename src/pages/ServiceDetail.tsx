import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { BadgeCheck, Check, PenTool, Sparkles } from "lucide-react";
import FAQSection from "@/components/FAQSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import { HeroPrint } from "@/components/anteprima/HeroPrint";
import { useGoToContact } from "@/components/anteprima/hooks";
import {
  CheckDot,
  CtaBand,
  PageHero,
  SectionIntro,
  TiltPhoto,
  WRAP_LONG_WORDS,
  isDecorativePhoto,
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
  WipeImage,
} from "@/components/anteprima/primitives";
import { GRID_PATTERN } from "@/components/anteprima/data";
import { getExtendedServiceContent } from "@/data/serviceExtendedContent";
import { getServiceByParam } from "@/data/servicesCatalog";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

interface Material {
  name: string;
  features: string;
  applications: string;
}

interface MaterialGroup {
  name: string;
  items: string[];
}

interface Application {
  name: string;
  description: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/** Nello stesso ordine di services.ancillaryServices.items. */
const ANCILLARY_ICONS = [PenTool, Sparkles, BadgeCheck];

const CARD = "rounded-3xl bg-white shadow-sm ring-1 ring-brand-blue/10 transition-shadow duration-300 hover:shadow-xl";

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const goToContact = useGoToContact();
  const catalogItem = getServiceByParam(serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!catalogItem) {
    return <NotFound />;
  }

  const key = catalogItem.translationKey;
  const title = t(`services.${key}.title`);
  const description = t(`services.${key}.description`);
  const features = asArray<string>(t(`services.${key}.features`, { returnObjects: true }));
  const materials = asArray<Material>(t(`services.${key}.materials`, { returnObjects: true }));
  const materialGroups = asArray<MaterialGroup>(
    t(`services.${key}.materialGroups`, { returnObjects: true })
  );
  const materialsNote = t(`services.${key}.materialsNote`, { defaultValue: "" });
  const materialsSummary = t(`services.${key}.materialsSummary`, { defaultValue: "" });
  const applications = asArray<Application>(
    t(`services.${key}.applications`, { returnObjects: true })
  );
  const process = asArray<ProcessStep>(t(`services.${key}.process`, { returnObjects: true }));
  const quoteNeeds = asArray<string>(t(`services.${key}.quoteNeeds`, { returnObjects: true }));
  const featuresTitle = t(`services.${key}.featuresTitle`, {
    defaultValue: t("services.characteristics"),
  });
  const applicationsTitle = t(`services.${key}.applicationsTitle`, {
    defaultValue: t("services.applications"),
  });
  const quoteNeedsTitle = t(`services.${key}.quoteNeedsTitle`, {
    defaultValue: t("services.quoteNeedsTitle"),
  });
  const quoteNeedsIntro = t(`services.${key}.quoteNeedsIntro`, { defaultValue: "" });
  const noCadTitle = t(`services.${key}.noCadTitle`, { defaultValue: "" });
  const noCadText = t(`services.${key}.noCadText`, { defaultValue: "" });
  const isCalculatorRequest = catalogItem.id === "fdm" || catalogItem.id === "sla";
  const extendedContent = getExtendedServiceContent(catalogItem.id);
  const gallery = catalogItem.gallery ?? [];
  const ancillaryItems = asArray<Application>(
    t("services.ancillaryServices.items", { returnObjects: true })
  );

  const quoteLink = isCalculatorRequest ? (
    <PressLink to="/calculator" size="lg" arrow>
      {t("services.requestQuote")}
    </PressLink>
  ) : (
    <PressLink
      to="/#contact"
      size="lg"
      arrow
      onClick={(event) => {
        event.preventDefault();
        goToContact();
      }}
    >
      {t("services.requestQuote")}
    </PressLink>
  );

  return (
    <PageShell>
      <PageHero
        back={{ to: "/services#catalog", label: t("nav.services") }}
        eyebrow={catalogItem.badge}
        title={title}
        subtitle={description}
        aside={isDecorativePhoto(catalogItem.image) ? <HeroPrint /> : <TiltPhoto src={catalogItem.image} alt={title} />}
      >
        {materialsSummary ? (
          <div className="space-y-2">
            <p className="text-base leading-relaxed text-gray-400">{materialsSummary}</p>
            {materialsNote ? <p className="text-sm text-gray-500">{materialsNote}</p> : null}
          </div>
        ) : null}
      </PageHero>

      {/* Alterna bianco e beige contando dal fondo: l'ultima fascia resta bianca prima delle FAQ beige. */}
      <div className="[&>section:nth-last-of-type(even)]:bg-[#E5DDD3]">
        {/* Caratteristiche e galleria */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>{catalogItem.badge}</Eyebrow>
                <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-8 text-brand-blue")}>
                  <SplitWords text={features.length > 0 ? featuresTitle : title} />
                </h2>
                <Reveal delay={0.2}>{quoteLink}</Reveal>
              </div>
              {features.length > 0 ? (
                <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2" stagger={0.06}>
                  {features.map((feature) => (
                    <StaggerItem key={feature} className="h-full">
                      <InteractiveCard lift={4} className={cn(CARD, "h-full rounded-2xl p-5")}>
                        <div className="flex items-start gap-3">
                          <CheckDot className="mt-0.5" />
                          <span className={cn("leading-relaxed text-brand-blue/90", WRAP_LONG_WORDS)}>{feature}</span>
                        </div>
                      </InteractiveCard>
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : null}
            </div>

            {gallery.length > 0 && (
              <div className={cn("mt-12 grid grid-cols-1 gap-6", gallery.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-4xl")}>
                {gallery.map((src) => (
                  <div key={src} className="group overflow-hidden rounded-3xl shadow-xl shadow-brand-blue/10">
                    <WipeImage
                      src={src}
                      alt={title}
                      className="block h-auto w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Materiali */}
        {(materialGroups.length > 0 || materials.length > 0) && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom">
              <SectionIntro title={t("services.availableMaterials")} />
              {materialGroups.length > 0 ? (
                <>
                  <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {materialGroups.map((group) => (
                      <StaggerItem key={group.name} className="h-full">
                        <InteractiveCard lift={6} className={cn(CARD, "h-full p-6 md:p-8")}>
                          <h3 className="mb-4 text-xl font-semibold text-brand-blue">{group.name}</h3>
                          <ul className="flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="rounded-full bg-brand-blue/5 px-3 py-1.5 text-sm font-medium text-brand-blue ring-1 ring-brand-blue/10 transition-colors duration-300 hover:bg-brand-accent hover:text-white hover:ring-brand-accent"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </InteractiveCard>
                      </StaggerItem>
                    ))}
                  </Stagger>
                  {materialsNote && (
                    <Reveal>
                      <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-brand-gray">{materialsNote}</p>
                    </Reveal>
                  )}
                </>
              ) : (
                <Stagger
                  className={cn(
                    "mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6",
                    materials.length > 2 && "lg:grid-cols-3"
                  )}
                >
                  {materials.map((material) => (
                    <StaggerItem key={material.name} className="h-full">
                      <InteractiveCard lift={6} className={cn(CARD, "h-full p-6 md:p-7")}>
                        <h3 className="mb-4 text-xl font-semibold text-brand-blue">{material.name}</h3>
                        <dl className="space-y-3 text-brand-gray">
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
                              {t("services.characteristics")}
                            </dt>
                            <dd className="mt-1 leading-relaxed">{material.features}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
                              {t("services.applications")}
                            </dt>
                            <dd className="mt-1 leading-relaxed">{material.applications}</dd>
                          </div>
                        </dl>
                      </InteractiveCard>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>
          </section>
        )}

        {/* Applicazioni */}
        {applications.length > 0 && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom">
              <SectionIntro title={applicationsTitle} />
              <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {applications.map((app, index) => (
                  <StaggerItem key={app.name} className="h-full">
                    <InteractiveCard lift={8} className={cn(CARD, "h-full overflow-hidden")}>
                      <div className="flex h-full gap-5 p-6 md:p-8">
                        <span className="text-4xl font-black leading-none text-brand-accent/25 transition-colors duration-300 group-hover:text-brand-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className={cn("mb-2 text-xl font-semibold text-brand-blue", WRAP_LONG_WORDS)}>{app.name}</h3>
                          <p className="leading-relaxed text-brand-gray">{app.description}</p>
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-accent transition-transform duration-500 group-hover:scale-x-100"
                      />
                    </InteractiveCard>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )}

        {/* Cosa ci serve e progettazione */}
        {(quoteNeeds.length > 0 || noCadText) && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
              {quoteNeeds.length > 0 && (
                <Reveal x={-40} y={0} className="min-w-0">
                  <div className={cn(CARD, "h-full p-6 md:p-8")}>
                    <h2 className="mb-3 text-2xl font-bold text-brand-blue">{quoteNeedsTitle}</h2>
                    {quoteNeedsIntro && <p className="mb-5 leading-relaxed text-brand-gray">{quoteNeedsIntro}</p>}
                    <Stagger className="space-y-3" stagger={0.06}>
                      {quoteNeeds.map((item) => (
                        <StaggerItem key={item}>
                          <div className="group flex items-start gap-3">
                            <CheckDot className="mt-0.5" />
                            <span className="text-brand-gray">{item}</span>
                          </div>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </Reveal>
              )}
              {noCadText && (
                <Reveal x={40} y={0} delay={0.1} className="min-w-0">
                  <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-slate-900 p-6 text-white shadow-xl shadow-brand-blue/20 md:p-8">
                    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: GRID_PATTERN }} />
                    <div className="relative">
                      {noCadTitle && <h2 className="mb-3 text-2xl font-bold">{noCadTitle}</h2>}
                      <p className="mb-6 leading-relaxed text-gray-300">{noCadText}</p>
                      <PressLink to="/services/progettazione" variant="light" arrow>
                        {t("common.discoverMore")}
                      </PressLink>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Servizi complementari */}
        {ancillaryItems.length > 0 && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom">
              <SectionIntro
                title={t("services.ancillaryServices.title")}
                text={t("services.ancillaryServices.description")}
              />
              <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {ancillaryItems.map((item, index) => {
                  const Icon = ANCILLARY_ICONS[index] ?? Check;
                  return (
                    <StaggerItem key={item.name} className="h-full">
                      <InteractiveCard lift={8} className={cn(CARD, "h-full p-6 md:p-8")}>
                        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
                          <Icon aria-hidden className="h-6 w-6 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                        </span>
                        <h3 className="mb-2 text-lg font-semibold text-brand-blue">{item.name}</h3>
                        <p className="leading-relaxed text-brand-gray">{item.description}</p>
                      </InteractiveCard>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </section>
        )}

        {/* Processo */}
        {process.length > 0 && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom">
              <SectionIntro title={t("services.ourProcess")} />
              <ProcessTimeline steps={process} />
            </div>
          </section>
        )}

        {/* Approfondimento */}
        {extendedContent && (
          <section className="bg-white py-16 md:py-24">
            <div className="container-custom">
              <div className="mx-auto max-w-5xl">
                <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6 text-brand-blue")}>
                  <SplitWords text={`${title}: panoramica, applicazioni e settori serviti in Ticino e Lombardia`} />
                </h2>
                <Reveal delay={0.1}>
                  <p className="body-text mb-12 text-lg leading-relaxed">{extendedContent.overview}</p>
                </Reveal>

                <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
                  <div className="min-w-0">
                    <h3 className="mb-5 text-2xl font-semibold text-brand-blue">Applicazioni concrete</h3>
                    <Stagger className="space-y-3" stagger={0.06}>
                      {extendedContent.applications.map((app) => (
                        <StaggerItem key={app.title}>
                          <div className="group relative overflow-hidden rounded-2xl bg-white p-5 pl-6 shadow-sm ring-1 ring-brand-blue/10 transition-shadow duration-300 hover:shadow-lg">
                            <span
                              aria-hidden
                              className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-brand-accent transition-[top,bottom] duration-300 group-hover:inset-y-0"
                            />
                            <h4 className="mb-1 font-semibold text-brand-blue">{app.title}</h4>
                            <p className="leading-relaxed text-brand-gray">{app.description}</p>
                          </div>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-5 text-2xl font-semibold text-brand-blue">Settori che serviamo</h3>
                    <Stagger className="space-y-3" stagger={0.06}>
                      {extendedContent.sectors.map((sector) => (
                        <StaggerItem key={sector.name}>
                          <div className="group relative overflow-hidden rounded-2xl bg-white p-5 pl-6 shadow-sm ring-1 ring-brand-blue/10 transition-shadow duration-300 hover:shadow-lg">
                            <span
                              aria-hidden
                              className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-brand-blue transition-[top,bottom] duration-300 group-hover:inset-y-0"
                            />
                            <h4 className="mb-1 font-semibold text-brand-blue">{sector.name}</h4>
                            <p className="leading-relaxed text-brand-gray">{sector.description}</p>
                          </div>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </div>

                <Stagger className="mb-12 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                  <StaggerItem className="h-full">
                    <InteractiveCard
                      lift={6}
                      glow="rgba(61,157,255,0.3)"
                      className="h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-slate-900 p-6 text-white shadow-xl shadow-brand-blue/20 md:p-8"
                    >
                      <h3 className={cn("mb-3 text-xl font-semibold", WRAP_LONG_WORDS)}>Quando scegliere {title.toLowerCase()}</h3>
                      <p className="leading-relaxed text-gray-300">{extendedContent.whenToChoose}</p>
                    </InteractiveCard>
                  </StaggerItem>
                  <StaggerItem className="h-full">
                    <InteractiveCard lift={6} className={cn(CARD, "h-full p-6 md:p-8")}>
                      <h3 className="mb-3 text-xl font-semibold text-brand-blue">Perché 3DMAKES</h3>
                      <p className="leading-relaxed text-brand-gray">{extendedContent.whyUs}</p>
                    </InteractiveCard>
                  </StaggerItem>
                </Stagger>

                <div>
                  <h3 className={cn("mb-6 text-2xl font-semibold text-brand-blue", WRAP_LONG_WORDS)}>
                    Domande frequenti su {title.toLowerCase()}
                  </h3>
                  <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.06}>
                    {extendedContent.faqs.map((faq) => (
                      <StaggerItem key={faq.question} className="h-full">
                        <div className="h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-blue/10 md:p-6">
                          <h4 className="mb-2 font-semibold text-brand-blue">{faq.question}</h4>
                          <p className="leading-relaxed text-brand-gray">{faq.answer}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <FAQSection
        extraFaqs={extendedContent?.faqs}
        extraCategoryTitle={title}
        hideExtraInUi
      />

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

export default ServiceDetail;
