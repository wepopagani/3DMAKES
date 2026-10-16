import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { scrollToElement, useGoToContact } from "@/components/anteprima/hooks";
import {
  CtaBand,
  FaqAccordion,
  FilterChips,
  GrowLine,
  PageHero,
  WRAP_LONG_WORDS,
} from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { PressLink } from "@/components/anteprima/primitives";
import { buildFaqCategories } from "@/data/faqCategories";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const reduce = Boolean(useReducedMotion());
  const goToContact = useGoToContact();
  const listRef = useRef<HTMLElement>(null);
  const categories = useMemo(() => buildFaqCategories(t), [t, i18n.language]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  const faqPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: categories.flatMap((category) =>
        category.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        }))
      ),
    }),
    [categories]
  );

  const filters = [
    { id: "all", label: t("faq.filterAll") },
    ...categories.map((category) => ({ id: category.id, label: category.title })),
  ];

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) scrollToElement(list, reduce);
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <PageHero eyebrow="FAQ" title={t("faq.pageTitle")} subtitle={t("faq.pageSubtitle")} />

      <section ref={listRef} className="bg-[#E5DDD3] pb-16 md:pb-24">
        <div className="sticky top-16 z-20 border-b border-brand-blue/10 bg-[#E5DDD3]/90 py-4 backdrop-blur-md md:top-[72px]">
          <div className="container-custom">
            <FilterChips
              align="center"
              options={filters}
              active={activeCategory}
              onChange={selectCategory}
              layoutId="faq-filtro-attivo"
              label={t("faq.pageTitle")}
            />
          </div>
        </div>

        <div className="container-custom pt-10 md:pt-14">
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className="space-y-12"
              >
                {visibleCategories.map((category) => (
                  <div key={category.id}>
                    <div className="mb-5">
                      <h2 className={cn("text-2xl font-semibold text-brand-blue md:text-3xl", WRAP_LONG_WORDS)}>
                        {category.title}
                      </h2>
                      <GrowLine className="mt-3 h-0.5 w-16 rounded-full bg-brand-accent" />
                    </div>
                    <FaqAccordion items={category.faqs} idPrefix={`faq-${category.id}`} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CtaBand title={t("faq.stillHaveQuestions")} text={t("faq.stillHaveQuestionsText")}>
        <PressLink to="/calculator" variant="accent" size="lg" arrow>
          {t("faq.ctaQuote")}
        </PressLink>
        <PressLink to="/services" variant="outlineLight" size="lg">
          {t("faq.ctaTechnologies")}
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

export default FAQ;
