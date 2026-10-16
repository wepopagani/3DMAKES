import QuoteCalculator from "@/components/QuoteCalculator";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { PageHero, SectionIntro } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { InteractiveCard, PressAnchor, PressLink, Reveal, Stagger, StaggerItem } from "@/components/anteprima/primitives";

const Calculator = () => {
  const { t, i18n } = useTranslation();

  // Sample FAQ data
  const faqs = [
    {
      question: t('faq.howItWorks'),
      answer: t('calculator.howItWorks')
    },
    {
      question: t('faq.accuracy'),
      answer: t('calculator.accuracy')
    },
    {
      question: t('faq.fileFormats'),
      answer: t('calculator.fileFormats')
    },
    {
      question: t('faq.deliveryTimes'),
      answer: t('calculator.deliveryTimes')
    },
    {
      question: t('faq.modelModification'),
      answer: t('calculator.modelModification')
    }
  ];

  // FAQPage structured data (Schema.org)
  useEffect(() => {
    const FAQ_SCHEMA_ID = "faqpage-schema-calculator";

    const faqPageSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const existing = document.getElementById(FAQ_SCHEMA_ID) as HTMLScriptElement | null;
    const json = JSON.stringify(faqPageSchema);

    if (existing) {
      existing.textContent = json;
      return;
    }

    const script = document.createElement("script");
    script.id = FAQ_SCHEMA_ID;
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(FAQ_SCHEMA_ID);
      el?.remove();
    };
  }, [i18n.language]); // ricalcola quando cambia lingua

  return (
    <PageShell>
      <PageHero title={t('calculator.title')} subtitle={t('calculator.subtitle')} />

      {/* Calculator Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#E5DDD3' }}>
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <QuoteCalculator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <SectionIntro title={t('faq.title')} text={t('faq.subtitle')} />

          <Stagger className="mx-auto max-w-4xl space-y-4" stagger={0.07}>
            {faqs.map((faq, index) => (
              <StaggerItem key={index}>
                <InteractiveCard
                  lift={4}
                  className="overflow-hidden rounded-2xl bg-[#E5DDD3]/45 p-6 ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-lg"
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-6 -left-6 -top-6 w-1 origin-top scale-y-0 bg-brand-accent transition-transform duration-500 group-hover:scale-y-100"
                  />
                  <h3 className="mb-3 text-lg font-semibold text-brand-blue">{faq.question}</h3>
                  <p className="leading-relaxed text-brand-gray">{faq.answer}</p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 flex flex-col items-center gap-5 text-center">
            <PressLink to="/faq" variant="outlineDark" arrow>
              {t('faq.viewAll')}
            </PressLink>
            <div>
              <p className="body-text mb-3">{t('contact.title')}?</p>
              <PressAnchor href="mailto:info@3dmakes.ch" variant="accent" arrow>
                {t('contact.form.send')}
              </PressAnchor>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default Calculator;
