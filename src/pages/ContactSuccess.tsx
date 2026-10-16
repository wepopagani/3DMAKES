import { ShopPhoneLinks } from '@/components/ShopPhoneLinks';
import { SHOP_PRIMARY_WA_DIGITS } from '@/constants/shopPhones';
import { CheckCircle, Mail, MapPin, Clock } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { GrowLine, PageHero, SectionIntro } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { InteractiveCard, PressLink, Reveal, Stagger, StaggerItem } from "@/components/anteprima/primitives";
import { cn } from "@/lib/utils";

// Dichiarazione gtag per Google Ads tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
const gtag = typeof window !== 'undefined' ? window.gtag : undefined;

const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785";

const SERVICE_LINKS = [
  {
    to: "/services/fdm",
    titleKey: "services.fdm.title",
    descriptionKey: "contactSuccess.fdmDescription",
    paths: ["M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"],
  },
  {
    to: "/services/sla",
    titleKey: "services.sla.title",
    descriptionKey: "contactSuccess.slaDescription",
    paths: ["M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"],
  },
  {
    to: "/services/laser",
    titleKey: "services.laser.title",
    descriptionKey: "contactSuccess.laserDescription",
    paths: ["M13 10V3L4 14h7v7l9-11h-7z"],
  },
  {
    to: "/services/riparazione-stampanti",
    titleKey: "services.largePrint.title",
    descriptionKey: "contactSuccess.largePrintDescription",
    paths: ["M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"],
  },
  {
    to: "/services/scansione",
    titleKey: "services.scanning.title",
    descriptionKey: "contactSuccess.scanningDescription",
    paths: [
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    ],
  },
  {
    to: "/services/prototipazione",
    titleKey: "services.prototyping.title",
    descriptionKey: "contactSuccess.prototypingDescription",
    paths: ["M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"],
  },
];

const ContactSuccess = () => {
  const { t } = useTranslation();
  
  // Scroll to top quando la pagina viene caricata e track conversione
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track conversion for contact form completion
    if (gtag) {
      gtag('event', 'ads_conversion_Modulo_1', {
        'send_to': 'AW-758841456/Modulo_1',
        'value': 40.0,
        'currency': 'CHF'
      });
    }
  }, []);

  const contactCards: { key: string; icon: ReactNode; iconClassName: string; title: string; body: ReactNode }[] = [
    {
      key: "contacts",
      icon: <Mail className="h-6 w-6" />,
      iconClassName: "bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent group-hover:text-white",
      title: t('contactSuccess.contacts'),
      body: (
        <>
          <p className="mb-2 text-sm text-brand-gray">
            📧{" "}
            <a href="mailto:info@3dmakes.ch" className="hover:text-brand-accent hover:underline">
              info@3dmakes.ch
            </a>
          </p>
          <div className="flex flex-col items-center gap-1 text-sm text-brand-gray">
            <span aria-hidden>📞</span>
            <ShopPhoneLinks stacked linkClassName="hover:text-brand-accent hover:underline" className="items-center" />
          </div>
        </>
      ),
    },
    {
      key: "whatsapp",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d={WHATSAPP_PATH} />
        </svg>
      ),
      iconClassName: "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white",
      title: "WhatsApp",
      body: (
        <a
          href={`https://wa.me/${SHOP_PRIMARY_WA_DIGITS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-gray transition-colors hover:text-green-600"
        >
          {t('contact.chatWithUs')}
        </a>
      ),
    },
    {
      key: "address",
      icon: <MapPin className="h-6 w-6" />,
      iconClassName: "bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent group-hover:text-white",
      title: t('contact.info.address'),
      body: <p className="text-sm text-brand-gray">{t('contact.fullAddress')}</p>,
    },
    {
      key: "hours",
      icon: <Clock className="h-6 w-6" />,
      iconClassName: "bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent group-hover:text-white",
      title: t('contactSuccess.hours'),
      body: <p className="whitespace-pre-line text-sm text-brand-gray">{t('contactSuccess.schedule')}</p>,
    },
  ];

  const steps = [1, 2, 3].map((n) => ({
    n,
    title: t(`contactSuccess.step${n}Title`),
    description: t(`contactSuccess.step${n}Description`),
  }));

  return (
    <PageShell>
      <PageHero
        title={t('contact.messageSentSuccess')}
        subtitle={t('contactSuccess.thankYouDetailed')}
        badge={
          <Reveal
            y={0}
            scale={0.5}
            delay={0.1}
            className="relative mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full ring-2 ring-green-400/50 motion-safe:animate-ping [animation-duration:2.4s] [animation-iteration-count:3]"
            />
            <CheckCircle className="h-10 w-10 text-white" />
          </Reveal>
        }
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <PressLink to="/" variant="accent" size="lg" arrow>
            {t('contactSuccess.backToHome')}
          </PressLink>
          <PressLink to="/services" variant="outlineLight" size="lg">
            {t('contactSuccess.discoverServices')}
          </PressLink>
        </div>
      </PageHero>

      {/* Recapiti */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-5xl">
            <SectionIntro title={t('contactSuccess.howToFindUs')} text={t('contactSuccess.urgentContact')} />
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {contactCards.map((card) => (
                <StaggerItem key={card.key} className="h-full">
                  <InteractiveCard
                    lift={8}
                    className="h-full rounded-3xl bg-[#E5DDD3]/45 p-6 text-center ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div
                      className={cn(
                        "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300",
                        card.iconClassName
                      )}
                    >
                      {card.icon}
                    </div>
                    <h3 className="mb-2 font-semibold text-brand-blue">{card.title}</h3>
                    <div className="break-words">{card.body}</div>
                  </InteractiveCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Cosa succede ora */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#E5DDD3' }}>
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <SectionIntro title={t('contactSuccess.whatHappensNow')} />
            <div className="relative">
              <GrowLine className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-0.5 rounded-full bg-brand-blue/20 md:block" />
              <Stagger className="relative grid grid-cols-1 gap-8 md:grid-cols-3" stagger={0.15}>
                {steps.map((step) => (
                  <StaggerItem key={step.n}>
                    <div className="group flex flex-col items-center text-center">
                      <span
                        className={cn(
                          "relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                          step.n === 3 ? "bg-brand-accent shadow-brand-accent/30" : "bg-brand-blue shadow-brand-blue/20"
                        )}
                      >
                        {step.n}
                      </span>
                      <h3 className="mb-2 font-semibold text-brand-blue">{step.title}</h3>
                      <p className="text-sm text-brand-gray">{step.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* Esplora i servizi */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-6xl">
            <SectionIntro title={t('contactSuccess.exploreServices')} />
            <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3" stagger={0.07}>
              {SERVICE_LINKS.map((service) => (
                <StaggerItem key={service.to} className="h-full">
                  <InteractiveCard
                    lift={8}
                    className="h-full rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-accent/40 hover:shadow-xl"
                  >
                    <div className="flex h-full flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white">
                        <svg
                          className="h-6 w-6 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          {service.paths.map((d) => (
                            <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                          ))}
                        </svg>
                      </div>
                      <h3 className="mb-2 font-semibold text-brand-blue">{t(service.titleKey)}</h3>
                      <p className="mb-5 flex-1 text-sm text-brand-gray">{t(service.descriptionKey)}</p>
                      <PressLink to={service.to} variant="outlineDark" className="h-10 px-5 text-sm md:text-sm">
                        {t('common.discoverMore')}
                      </PressLink>
                    </div>
                  </InteractiveCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default ContactSuccess;
