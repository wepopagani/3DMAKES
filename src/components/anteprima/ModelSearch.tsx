import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { GOOGLE_CSE_ID, GOOGLE_CSE_STYLES, GRID_PATTERN } from "./data";
import { HEADING_2, Reveal, SplitWords } from "./primitives";

export default function ModelSearch() {
  const { t } = useTranslation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://cse.google.com/cse.js?cx=${GOOGLE_CSE_ID}`;
    script.async = true;
    document.body.appendChild(script);

    const styleSheet = document.createElement("style");
    styleSheet.textContent = GOOGLE_CSE_STYLES;
    document.head.appendChild(styleSheet);

    return () => {
      document.querySelector('script[src*="cse.google.com"]')?.remove();
      styleSheet.remove();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-blue py-16 text-white md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: GRID_PATTERN }} />
      <div className="container-custom relative">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Reveal y={12} className="mb-4 inline-block rounded-full bg-brand-accent/20 px-3 py-1 text-sm font-medium text-white">
            {t("search.title")}
          </Reveal>
          <h2 className={cn(HEADING_2, "mb-6")}>
            <SplitWords text={t("search.findModels")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mb-2 text-gray-300">{t("search.description")}</p>
          </Reveal>
        </div>

        {/* Solo dissolvenza: un transform sugli antenati sposterebbe l'overlay fixed dei risultati Google. */}
        <Reveal y={0} delay={0.2} className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/10">
          <div className="gcse-search" />
          <p className="mt-6 text-center text-sm italic text-gray-600">{t("search.instructions")}</p>
        </Reveal>
      </div>
    </section>
  );
}
