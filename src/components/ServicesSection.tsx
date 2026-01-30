import ServiceCard from "./ServiceCard";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const ServicesSection = () => {
  const { t } = useTranslation();

  // Servizi principali da mostrare nella homepage
  const services = [
    {
      title: t('services.prototyping.title'),
      description: t('services.prototyping.description'),
      imageUrl: "/prototipo logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      link: "/services#prototipazione"
    },
    {
      title: t('services.scanning.title'),
      description: t('services.scanning.description'),
      imageUrl: "/scan logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: "/services#scansione"
    },
    {
      title: t('services.repair.title'),
      description: t('services.repair.description'),
      imageUrl: "/riparazione logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: "/services#riparazione-stampanti-3d"
    },
    {
      title: t('services.sla.title'),
      description: t('services.sla.description'),
      imageUrl: "/stampa 3d resina logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      link: "/services#sla"
    },
    {
      title: t('services.fdmBasic.title'),
      description: t('services.fdmBasic.description'),
      imageUrl: "/stampa 3d logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: "/services#fdm"
    },
    {
      title: t('services.laser.title'),
      description: t('services.laser.description'),
      imageUrl: "/taglio laser logo.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: "/services#incisione-laser"
    }
  ];
  
  return (
    <>
      {/* Banner Cosa Offriamo */}
      <section className="bg-white py-2">
        <div className="container-custom">
          <div className="flex justify-center">
            <img 
              src="/COSA OFFRIAMO.png" 
              alt="Cosa Offriamo"
              className="w-full h-auto max-w-4xl"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/1000x400/ffffff/333333?text=Cosa+Offriamo";
              }}
            />
          </div>
        </div>
      </section>

      {/* Sezione Servizi */}
      <section id="services" className="pt-8 pb-12 md:pb-24" style={{backgroundColor: '#E5DDD3'}}>
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-2 mb-6">
            {t('services.subtitle')}
          </h2>
          <p className="body-text">
            {t('services.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <button className="bg-brand-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              Scopri tutti i servizi
            </button>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
};

export default ServicesSection;
