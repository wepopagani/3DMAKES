import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
    name: "Kesmon",
    logo: "/partner/kesmon.png",
    website: "https://www.kesmon.ch",
  },
  {
    id: 2,
    name: "Securitas",
    logo: "/partner/securitas.png",
    website: "https://www.securitas.ch",
  },
  {
    id: 3,
    name: "Studio MN",
    logo: "/partner/studiomn.png",
    website: "https://www.studiomn.ch",
  },
  {
    id: 4,
    name: "USI",
    logo: "/partner/usi.png",
    website: "https://www.usi.ch",
  },
];

const PartnersLogos = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  return (
    <section className="py-12 md:py-20 bg-white border-t border-b border-gray-200">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t('partners.title')}</h2>
          <p className="body-text max-w-2xl mx-auto">
            {t('partners.description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {partners.map((partner) => (
                <CarouselItem 
                  key={partner.id} 
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="p-4">
                    <div 
                      className="bg-white rounded-lg border border-gray-200 p-6 h-32 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                      onClick={() => partner.website && window.open(partner.website, '_blank')}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          // Fallback: mostra il nome se l'immagine non viene caricata
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const textDiv = document.createElement('div');
                            textDiv.className = 'text-center font-semibold text-brand-gray';
                            textDiv.textContent = partner.name;
                            parent.appendChild(textDiv);
                          }
                        }}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

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
              {partners.length}+ {t('partners.companiesCount')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersLogos;

