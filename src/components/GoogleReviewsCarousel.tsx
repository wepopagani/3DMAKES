import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

// Recensioni reali da Google
const reviews: Review[] = [
  {
    id: 1,
    author: "Titti Bl",
    rating: 5,
    text: "Incredibilmente disponibile e gentile. Ha risolto il mio problema con estrema competenza, ben oltre le mie aspettative. Lo consiglio a tutti. Grazie mille.",
    date: "un anno fa",
  },
  {
    id: 2,
    author: "Leonardo",
    rating: 5,
    text: "Un esperienza professionale meritevole di lode, il titolare è stato cortese e molto qualificato per svolgere il lavoro affidatogli !!",
    date: "un anno fa",
  },
  {
    id: 3,
    author: "Francesco Quattrucci",
    rating: 5,
    text: "Velocità e Qualità, Buonissimo il rapporto prezzo/materiale",
    date: "un anno fa",
  },
  {
    id: 4,
    author: "Nicholas Chiggiato",
    rating: 5,
    text: "Prodotti eccezionali, molto professionali e disponibili",
    date: "1 mese fa",
  },
  {
    id: 5,
    author: "Elia Alacam",
    rating: 5,
    text: "Lavoro veloce ed efficace. Marco è stato in grado di capire esattamente la mia richiesta e senza troppe perdite di tempo ha eseguito un lavoro a dir poco perfetto. Consigliato!",
    date: "11 mesi fa",
  },
  {
    id: 6,
    author: "Lorenzo Rebuffo",
    rating: 5,
    text: "Lavoro veloce e di qualità. Molto disponibile e preparato. Consiglio vivamente",
    date: "11 mesi fa",
  },
  {
    id: 7,
    author: "turienzo gasser architectes",
    rating: 5,
    text: "Giovani, entusiasti e appassionati; ma soprattutto competenti ed efficaci. Ho chiesto loro una scansione di un oggetto piuttosto complicato ed il risultato è stato a dir poco entusiasmante. Prezzi onestissimi. Non posso che consigliarli. Sicuramente mi rivolgerò nuovamente a loro in caso di necessità!",
    date: "2 giorni fa",
  },
  {
    id: 8,
    author: "Francesca Bertagnoli",
    rating: 5,
    text: "Ho ordinato una stampa di un'arma per un cosplay e il risultato è stato eccellente! La qualità di stampa è davvero alta, con dettagli precisi. Inoltre i tempi di realizzazione e consegna sono stati rapidissimi, molto più veloci di quanto mi aspettassi. Servizio assolutamente consigliato!",
    date: "1 mese fa",
  },
  {
    id: 9,
    author: "Andrea Portaro",
    rating: 5,
    text: "Fantastici, disposti ad ascoltarti e a capire esattamente le tue esigenze. Comunicazione veloce e precisa, non potevo chiedere di meglio.",
    date: "6 giorni fa",
  },
  {
    id: 10,
    author: "Ian",
    rating: 5,
    text: "Avevo bisogno di un pezzo di ricambio e sono stati molto efficienti nel risolvere il mio problema, sono dei ragazzi gentili e offrono un altissima qualità di stampa.",
    date: "una settimana fa",
  },
];

const GoogleReviewsCarousel = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t('reviews.title')}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold text-brand-gray">5.0 {t('reviews.ratingLabel')}</span>
          </div>
          <p className="body-text max-w-2xl mx-auto">
            {t('reviews.description')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4 h-full">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                      {/* Header con avatar e nome */}
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg mr-3">
                          {review.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-brand-dark">{review.author}</h3>
                          <p className="text-sm text-brand-gray">{review.date}</p>
                        </div>
                      </div>

                      {/* Stelle */}
                      <div className="flex mb-4">
                        {renderStars(review.rating)}
                      </div>

                      {/* Testo recensione */}
                      <p className="text-brand-gray leading-relaxed flex-grow">
                        "{review.text}"
                      </p>

                      {/* Logo Google */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-brand-gray">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          {t('reviews.googleReview')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          {/* Indicatori */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current ? 'bg-brand-blue w-8' : 'bg-gray-300'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Vai alla recensione ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsCarousel;

