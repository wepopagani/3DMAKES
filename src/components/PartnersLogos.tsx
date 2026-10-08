import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

// Loghi delle aziende partner
const partners: Partner[] = [
  {
    id: 1,
    name: "TRC",
    logo: "/partner/trc.png",
    website: "https://www.trc2038.com/en-eu",
  },
  {
    id: 2,
    name: "Securitas",
    logo: "/partner/securitas.png",
    website: "https://www.securitas.ch/it/",
  },
  {
    id: 3,
    name: "Studio MN",
    logo: "/partner/studiomn.png",
    website: "https://studiomn.ch",
  },
  {
    id: 4,
    name: "USI",
    logo: "/partner/usi.png",
    website: "https://www.usi.ch/it",
  },
  {
    id: 5,
    name: "UAV",
    logo: "/partner/uav.png",
    website: "",
  },
  {
    id: 6,
    name: "Verzasca",
    logo: "/partner/verzasca.png",
    website: "",
  },
  {
    id: 7,
    name: "Caffematica",
    logo: "/partner/caffematica.png",
    website: "",
  },
  {
    id: 8,
    name: "Marino Bernasconi Engineering",
    logo: "/partner/marino-bernasconi.webp",
    website: "",
  },
];

const PartnersLogos = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const direction = useRef<1 | -1>(1);
  const paused = useRef(false);

  useEffect(() => {
    if (!api) return;

    const onPointerDown = () => {
      paused.current = true;
    };
    const onPointerUp = () => {
      paused.current = false;
      if (!api.canScrollNext()) direction.current = -1;
      else if (!api.canScrollPrev()) direction.current = 1;
    };

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    const timer = window.setInterval(() => {
      if (paused.current) return;
      if (!api.canScrollNext() && !api.canScrollPrev()) return;

      if (direction.current === 1) {
        if (api.canScrollNext()) api.scrollNext();
        else {
          direction.current = -1;
          api.scrollPrev();
        }
      } else if (api.canScrollPrev()) {
        api.scrollPrev();
      } else {
        direction.current = 1;
        api.scrollNext();
      }
    }, 2800);

    return () => {
      window.clearInterval(timer);
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
    };
  }, [api]);

  return (
    <section id="partners" className="py-12 md:py-20 border-t border-b border-gray-200" style={{backgroundColor: '#E5DDD3'}}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t('partners.title')}</h2>
          <p className="body-text max-w-2xl mx-auto">
            {t('partners.description')}
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
            dragFree: true,
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <CarouselContent>
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div
                  className={`flex h-28 md:h-32 items-center justify-center px-3 ${
                    partner.website ? "cursor-pointer" : ""
                  }`}
                  onClick={() => partner.website && window.open(partner.website, "_blank")}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    draggable={false}
                    className="max-h-20 md:max-h-24 w-full object-contain select-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector("[data-logo-fallback]")) {
                        const textDiv = document.createElement("div");
                        textDiv.dataset.logoFallback = "true";
                        textDiv.className = "text-center text-sm font-semibold text-brand-gray";
                        textDiv.textContent = partner.name;
                        parent.appendChild(textDiv);
                      }
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Badge "Collaborazioni" */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 rounded-full">
            <svg 
              className="w-5 h-5 text-brand-blue" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span className="text-brand-blue font-semibold">
              150+ Clienti
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersLogos;

