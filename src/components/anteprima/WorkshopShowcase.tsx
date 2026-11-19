import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import MediaClip from "./MediaClip";
import { HEADING_2, PressLink } from "./primitives";

const CLIPS = [
  { id: "printing", file: "print-timelapse", href: "/services/fdm" },
  { id: "cnc", file: "cnc-workbench", href: "/services/cnc" },
  { id: "laser", file: "laser-results", href: "/services/laser" },
  { id: "machines", file: "shop-printer", href: "/about" },
] as const;

const EQUIPMENT = [
  { id: "filament", models: "Bambu Lab H2D, H2S · ELEGOO OrangeStorm Giga" },
  { id: "resin", models: "Anycubic Photon Mono M7 Max" },
  { id: "cnc", models: "Makera Z1 Pro" },
  { id: "laser", models: "xTool F2 Ultra" },
] as const;

export default function WorkshopShowcase({ clip }: { clip?: "printing" | "cnc" | "laser" }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<(typeof CLIPS)[number]["id"]>("printing");
  const current = CLIPS.find((item) => item.id === (clip ?? selected)) ?? CLIPS[0];
  const path = `/media/workshop/${current.file}`;
  const title = t(`siteMedia.workshop.clips.${current.id}.title`);

  return (
    <section id={clip ? undefined : "laboratorio"} className="bg-[#101c30] py-14 text-white md:py-20">
      <div className="container-custom">
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <h2 className={cn(HEADING_2, "mb-5 text-balance text-white")}>
              {clip ? title : t("siteMedia.workshop.title")}
            </h2>
            {!clip && (
              <div role="group" aria-label={t("siteMedia.workshop.title")} className="mb-6 flex flex-wrap gap-2">
                {CLIPS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === current.id}
                    onClick={() => setSelected(item.id)}
                    className="min-h-11 rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white aria-pressed:border-[#b9d9ff] aria-pressed:bg-[#dcecff] aria-pressed:text-[#101c30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {t(`siteMedia.workshop.clips.${item.id}.tab`)}
                  </button>
                ))}
              </div>
            )}
            <div aria-live="polite">
              {!clip && <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>}
              <p className="max-w-lg leading-relaxed text-blue-100/85">{t(`siteMedia.workshop.clips.${current.id}.description`)}</p>
            </div>
            {!clip && (
              <PressLink to={current.href} variant="outlineLight" className="mt-6" arrow>
                {t(`siteMedia.workshop.clips.${current.id}.link`)}
              </PressLink>
            )}
          </div>
          <MediaClip
            key={current.id}
            src={`${path}.mp4`}
            poster={`${path}-poster.webp`}
            label={title}
            className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/15"
          />
        </div>
        {!clip && (
          <div className="mt-10 border-t border-white/15 pt-6 md:mt-12">
            <h3 className="mb-5 text-lg font-semibold">{t("siteMedia.workshop.equipment")}</h3>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-8 lg:grid-cols-4">
              {EQUIPMENT.map(({ id, models }) => (
                <div className="min-w-0" key={id}>
                  <dt className="mb-1 text-sm font-medium text-[#a5cfff]">{t(`siteMedia.workshop.types.${id}`)}</dt>
                  <dd className="text-sm leading-relaxed text-white/90">{models}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
