import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FaqAccordion, WRAP_LONG_WORDS } from "@/components/anteprima/PageBlocks";
import { HEADING_2, PressLink, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/anteprima/primitives";
import { buildCompactFaqCategories } from "@/data/faqCategories";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FAQSectionProps {
  /**
   * FAQ aggiuntive specifiche della pagina (es. FAQ per singola tecnologia
   * di stampa). Vengono incluse sia nel JSON-LD FAQPage unificato, sia
   * come categoria extra nell'UI. Evita il problema di avere più schemi
   * FAQPage sulla stessa URL.
   */
  extraCategoryTitle?: string;
  extraFaqs?: { question: string; answer: string }[];
  /**
   * Se true, NON renderizza l'UI della FAQ (le FAQ vengono già mostrate
   * altrove nella pagina) ma include comunque i dati nello schema JSON-LD.
   * Utile quando ServiceDetail ha già la sua sezione di FAQ specifiche.
   */
  hideExtraInUi?: boolean;
  /** Nasconde il link “Vedi tutte le FAQ” (es. sulla pagina /faq stessa). */
  hideViewAllLink?: boolean;
}

export default function FAQSection({
  extraCategoryTitle,
  extraFaqs,
  hideExtraInUi = false,
  hideViewAllLink = false,
}: FAQSectionProps = {}) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();

  const faqCategories = useMemo(
    () => buildCompactFaqCategories(t),
    [t, i18n.language]
  );

  const visibleCategories =
    extraFaqs && extraFaqs.length > 0 && !hideExtraInUi
      ? [
          ...faqCategories,
          {
            id: "extra",
            title: extraCategoryTitle ?? t("faq.titleSpecific"),
            faqs: extraFaqs,
          },
        ]
      : faqCategories;

  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  const faqPageSchema = useMemo(() => {
    const genericQuestions = faqCategories.flatMap((category) =>
      category.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))
    );
    const extraQuestions = (extraFaqs ?? []).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [...extraQuestions, ...genericQuestions].map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    };
  }, [faqCategories, extraFaqs]);

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ backgroundColor: "#E5DDD3" }}>
      <div className="container-custom">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <Reveal y={12} className="mb-4 inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent">
            FAQ
          </Reveal>
          <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-4 text-brand-blue")}>
            <SplitWords text={t("faq.title")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text">{t("faq.subtitle")}</p>
          </Reveal>
        </div>

        <Stagger className="mx-auto max-w-3xl space-y-4" stagger={0.07}>
          {visibleCategories.map((category, categoryIndex) => {
            const isOpen = openCategory === categoryIndex;
            const panelId = `faq-categoria-${category.id}`;
            return (
              <StaggerItem key={category.id}>
                <div
                  className={cn(
                    "overflow-hidden rounded-3xl bg-white ring-1 transition-shadow duration-300",
                    isOpen ? "shadow-xl shadow-brand-blue/10 ring-brand-accent/30" : "shadow-sm ring-brand-blue/5 hover:shadow-md"
                  )}
                >
                  <h3>
                    <motion.button
                      type="button"
                      id={`${panelId}-trigger`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleCategory(categoryIndex)}
                      whileTap={{ scale: 0.985 }}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent md:px-6 md:py-5"
                    >
                      <span
                        className={cn(
                          "min-w-0 text-lg font-semibold transition-colors duration-300",
                          WRAP_LONG_WORDS,
                          isOpen ? "text-brand-accent" : "text-brand-blue group-hover:text-brand-accent"
                        )}
                      >
                        {category.title}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 26 }}
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                          isOpen ? "bg-brand-accent text-white" : "bg-brand-blue/5 text-brand-blue group-hover:bg-brand-accent/15"
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </motion.button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="faqs"
                        id={panelId}
                        role="region"
                        aria-labelledby={`${panelId}-trigger`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="mx-5 border-t border-brand-blue/10 pb-2 md:mx-6">
                          <FaqAccordion items={category.faqs} idPrefix={`${panelId}-domanda`} headingLevel="h4" tone="flush" />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {!hideViewAllLink && (
          <Reveal className="mt-10 text-center">
            <PressLink to="/faq" variant="outlineDark" arrow>
              {t("faq.viewAll")}
            </PressLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
