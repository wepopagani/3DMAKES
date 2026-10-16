import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Eyebrow, HEADING_2, InteractiveCard, Magnetic, PressLink, Reveal, SplitWords, Stagger, StaggerItem } from "./primitives";

export function HowWeHelpSection() {
  const { t } = useTranslation();
  const items = [1, 2, 3, 4].map((n) => ({
    n: String(n).padStart(2, "0"),
    title: t(`services.howWeHelp.item${n}Title`),
    text: t(`services.howWeHelp.item${n}Text`),
  }));

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Eyebrow>{t("services.howWeHelp.eyebrow")}</Eyebrow>
          <h2 className={cn(HEADING_2, "mb-4 text-brand-blue")}>
            <SplitWords text={t("services.howWeHelp.title")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text">{t("services.howWeHelp.subtitle")}</p>
          </Reveal>
        </div>

        <Stagger className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.n} className="h-full">
              <InteractiveCard
                lift={8}
                className="h-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-accent/40 hover:shadow-xl md:p-8"
              >
                <p className="mb-6 text-5xl font-black leading-none text-brand-accent/25 transition-colors duration-300 group-hover:text-brand-accent">
                  {item.n}
                </p>
                <h3 className="mb-3 text-xl font-semibold text-brand-blue">{item.title}</h3>
                <p className="leading-relaxed text-brand-gray">{item.text}</p>
              </InteractiveCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="text-center">
          <Magnetic>
            <PressLink to="/calculator" size="lg" arrow>
              {t("nav.requestQuote")}
            </PressLink>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/** Le risposte restano sempre visibili, come nel teaser attuale. */
export function FaqSection() {
  const { t } = useTranslation();
  const items = [1, 2, 3, 4].map((n) => ({
    question: t(`seo.homeFaqQ${n}`),
    answer: t(`seo.homeFaqA${n}`),
  }));

  return (
    <section className="relative overflow-hidden py-16 md:py-20" style={{ backgroundColor: "#E5DDD3" }}>
      <div className="container-custom">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Reveal y={12} className="mb-4 inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent">
            FAQ
          </Reveal>
          <h2 className={cn(HEADING_2, "mb-4 text-brand-blue")}>
            <SplitWords text={t("faq.title")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text">{t("faq.subtitle")}</p>
          </Reveal>
        </div>

        <Stagger className="mx-auto mb-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {items.map((item, index) => (
            <StaggerItem key={item.question} className="h-full">
              <InteractiveCard
                lift={6}
                glow="rgba(61,157,255,0.12)"
                className="h-full overflow-hidden rounded-2xl bg-white/85 p-6 shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl md:p-7"
              >
                <span
                  aria-hidden
                  className="absolute -bottom-6 -left-6 -top-6 w-1 origin-top scale-y-0 bg-brand-accent transition-transform duration-500 group-hover:scale-y-100 md:-bottom-7 md:-left-7 md:-top-7"
                />
                <div className="mb-3 flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-sm font-bold text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="pt-1 font-semibold leading-snug text-brand-blue md:text-lg">{item.question}</h3>
                </div>
                <p className="leading-relaxed text-brand-gray">{item.answer}</p>
              </InteractiveCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="text-center">
          <PressLink to="/faq" variant="outlineDark" arrow>
            {t("faq.viewAll")}
          </PressLink>
        </Reveal>
      </div>
    </section>
  );
}
