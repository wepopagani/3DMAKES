import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { ShopPhoneLinks } from "@/components/ShopPhoneLinks";
import { HeroPrint } from "@/components/anteprima/HeroPrint";
import { useGoToContact } from "@/components/anteprima/hooks";
import { PageHero, SectionIntro, WRAP_LONG_WORDS } from "@/components/anteprima/PageBlocks";
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

// Dichiarazione gtag per Google Ads tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
const gtag = typeof window !== 'undefined' ? window.gtag : undefined;

interface ContactRow {
  icon: LucideIcon;
  label: string;
  content: ReactNode;
}

const About = () => {
  const { t } = useTranslation();
  const goToContact = useGoToContact();

  // Effect to handle page load scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storyParagraphs = [t("about.storyParagraph1"), t("about.storyParagraph2"), t("about.storyParagraph3")];

  const values = [
    { n: "01", title: t("about.values.reliable"), description: t("about.values.reliableDescription") },
    { n: "02", title: t("about.values.flexible"), description: t("about.values.flexibleDescription") },
    { n: "03", title: t("about.values.close"), description: t("about.values.closeDescription") },
  ];

  const linkClass = "font-medium text-brand-accent transition-colors hover:text-white";
  const contactRows: ContactRow[] = [
    {
      icon: MapPin,
      label: t("contact.info.address"),
      content: (
        <a
          href="https://www.google.com/maps/search/?api=1&query=Via+Cantonale+15%2C+6918+Figino%2C+Svizzera"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Via Cantonale 15
          <br />
          6918 Figino, Svizzera
        </a>
      ),
    },
    {
      icon: Phone,
      label: t("contact.info.phone"),
      content: (
        <ShopPhoneLinks
          stacked
          linkClassName={linkClass}
          nameClassName="font-medium text-white/80"
          onTelClick={() => {
            if (gtag) {
              gtag('event', 'conversion', {
                'send_to': 'AW-758841456/phone_call',
                'value': 50.0,
                'currency': 'CHF'
              });
            }
          }}
        />
      ),
    },
    {
      icon: Mail,
      label: "Email",
      content: (
        <a href="mailto:info@3dmakes.ch" className={linkClass}>
          info@3dmakes.ch
        </a>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} subtitle={t("about.heroSubtitle")} />

      {/* La nostra storia */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>{t("about.ourStory")}</Eyebrow>
            <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6 text-brand-blue")}>
              <SplitWords text={t("about.fromDreamToReality")} />
            </h2>
            {storyParagraphs.map((paragraph, index) => (
              <Reveal key={index} delay={0.1 + index * 0.1}>
                <p className={cn("body-text", index < storyParagraphs.length - 1 && "mb-6")}>{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal x={48} y={0} delay={0.2} className="min-w-0">
            <HeroPrint />
          </Reveal>
        </div>
      </section>

      {/* Valori */}
      <section className="relative overflow-hidden bg-[#E5DDD3] py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(26,42,74,0.13)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="container-custom relative">
          <SectionIntro eyebrow={t("about.ourValues")} title={t("about.whatGuidesUs")} text={t("about.valuesDescription")} />
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {values.map((value) => (
              <StaggerItem key={value.n} className="h-full">
                <InteractiveCard
                  lift={8}
                  className="h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="p-6 md:p-8">
                    <p className="mb-6 text-5xl font-black leading-none text-brand-accent/25 transition-colors duration-300 group-hover:text-brand-accent">
                      {value.n}
                    </p>
                    <h3 className="mb-3 text-xl font-semibold text-brand-blue">{value.title}</h3>
                    <p className="leading-relaxed text-brand-gray">{value.description}</p>
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

      {/* Come raggiungerci */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <SectionIntro eyebrow={t("about.whereWeAre")} title={t("about.howToReachUs")} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <Reveal x={-48} y={0} className="min-w-0">
              <div className="h-[320px] overflow-hidden rounded-3xl bg-brand-blue/5 shadow-xl shadow-brand-blue/10 ring-1 ring-brand-blue/10 md:h-[420px] lg:h-full lg:min-h-[440px]">
                <iframe
                  src="https://maps.google.com/maps?q=Via+Cantonale+15,+6918+Figino,+Switzerland&hl=it&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa di 3DMAKES - Via Cantonale 15, 6918 Figino, Ticino"
                  className="block h-full w-full"
                ></iframe>
              </div>
            </Reveal>

            <Reveal x={48} y={0} delay={0.1} className="min-w-0">
              <div className="relative h-full overflow-hidden rounded-3xl bg-brand-blue p-6 text-white shadow-xl shadow-brand-blue/20 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(61,157,255,0.25),transparent_70%)]"
                />
                <h3 className="relative mb-6 text-xl font-semibold md:text-2xl">{t("about.ourAddress")}</h3>
                <Stagger className="relative space-y-2" stagger={0.08}>
                  {contactRows.map(({ icon: Icon, label, content }) => (
                    <StaggerItem key={label}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        className="group -mx-3 flex items-start gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-white/5"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
                          <Icon aria-hidden className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">{label}</p>
                          <div className="break-words">{content}</div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </Stagger>
                <div className="relative mt-8">
                  <PressLink
                    to="/#contact"
                    variant="accent"
                    arrow
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      goToContact();
                    }}
                  >
                    {t("contact.title")}
                  </PressLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default About;
