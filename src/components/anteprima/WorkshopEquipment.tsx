import { Maximize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Machine {
  id: string;
  name: string;
  type: "filament" | "resin" | "cnc" | "laser";
}

const MACHINES: Machine[] = [
  { id: "bambu-h2d", name: "Bambu Lab H2D", type: "filament" },
  { id: "bambu-h2s", name: "Bambu Lab H2S", type: "filament" },
  { id: "elegoo-orangestorm-giga", name: "ELEGOO OrangeStorm Giga", type: "filament" },
  { id: "anycubic-m7-max", name: "Anycubic Photon Mono M7 Max", type: "resin" },
  { id: "makera-z1-pro", name: "Makera Z1 Pro", type: "cnc" },
  { id: "xtool-f2-ultra", name: "xTool F2 Ultra", type: "laser" },
];

export default function WorkshopEquipment() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 border-t border-white/15 pt-7 md:mt-12 md:pt-9">
      <h3 className="mb-5 text-xl font-bold text-white sm:text-2xl">{t("siteMedia.workshop.equipment")}</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-6">
        {MACHINES.map(({ id, name, type }) => {
          const image = `/media/workshop/equipment/${id}.webp`;
          const category = t(`siteMedia.workshop.types.${type}`);

          return (
            <li key={id} className="min-w-0 overflow-hidden rounded-xl border border-white/15 bg-white/5 sm:rounded-2xl">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    aria-label={t("siteMedia.workshop.enlargePhoto", { name })}
                    className="group relative block aspect-[3/4] w-full overflow-hidden bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-[#101c30]/85 text-white sm:bottom-3 sm:right-3">
                      <Maximize2 aria-hidden size={15} />
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[95svh] w-[min(94vw,34rem)] max-w-none overflow-y-auto rounded-xl p-4 motion-reduce:animate-none sm:p-6">
                  <DialogTitle className="pr-8 text-brand-blue">{name}</DialogTitle>
                  <img src={image} alt={name} className="max-h-[76svh] w-full rounded-lg object-contain" />
                  <DialogDescription>{category}</DialogDescription>
                </DialogContent>
              </Dialog>
              <div className="space-y-1 p-3 sm:p-4">
                <p className="text-xs font-medium text-[#a5cfff]">{category}</p>
                <h4 className="break-words text-sm font-semibold text-white sm:text-base">{name}</h4>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
