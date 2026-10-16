import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { GRID_PATTERN } from "./data";
import { HEADING_2, Magnetic, PressLink, Reveal, SplitWords } from "./primitives";

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-slate-900 py-16 text-white md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: GRID_PATTERN }} />
      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={cn(HEADING_2, "mb-6")}>
            <SplitWords text={t("services.readyToRealize")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">{t("services.contactToday")}</p>
          </Reveal>
          <Reveal delay={0.25} className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Magnetic>
              <PressLink to="/calculator" size="lg" variant="accent" arrow>
                {t("nav.requestQuote")}
              </PressLink>
            </Magnetic>
            <Magnetic>
              <PressLink to="/dashboard" size="lg" variant="outlineLight">
                {t("nav.clientArea")}
              </PressLink>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
