interface WhyChooseUsSectionProps {
  language: string;
}

type Translation = {
  whyChooseUs: {
    title: string;
    expertTeam: {
      title: string;
      description: string;
    };
    quality: {
      title: string;
      description: string;
    };
    turnaround: {
      title: string;
      description: string;
    };
    pricing: {
      title: string;
      description: string;
    };
  };
};

export default function WhyChooseUsSection({ language }: WhyChooseUsSectionProps) {
  const translations: Record<string, Translation> = {
    en: {
      whyChooseUs: {
        title: "Why Choose Us",
        expertTeam: {
          title: "Expert Team",
          description: "Our team consists of highly skilled professionals with years of experience"
        },
        quality: {
          title: "Quality Assurance",
          description: "We maintain the highest standards of quality in all our services"
        },
        turnaround: {
          title: "Quick Turnaround",
          description: "Fast and efficient service delivery without compromising quality"
        },
        pricing: {
          title: "Competitive Pricing",
          description: "Transparent and competitive pricing for all our services"
        }
      }
    },
    it: {
      whyChooseUs: {
        title: "Perché Sceglierci",
        expertTeam: {
          title: "Team di Esperti",
          description: "Il nostro team è composto da professionisti altamente qualificati con anni di esperienza"
        },
        quality: {
          title: "Garanzia di Qualità",
          description: "Manteniamo i più alti standard di qualità in tutti i nostri servizi"
        },
        turnaround: {
          title: "Tempi Rapidi",
          description: "Servizio veloce ed efficiente senza compromettere la qualità"
        },
        pricing: {
          title: "Prezzi Competitivi",
          description: "Prezzi trasparenti e competitivi per tutti i nostri servizi"
        }
      }
    }
  };
  
  const t = translations[language as keyof typeof translations]?.whyChooseUs ?? translations.en.whyChooseUs;
  

  const reasons = [
    {
      title: t.expertTeam.title,
      description: t.expertTeam.description,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: t.quality.title,
      description: t.quality.description,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: t.turnaround.title,
      description: t.turnaround.description,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t.pricing.title,
      description: t.pricing.description,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="why-choose-us" className="bg-gray-900 min-h-fit">
      <div className="container mx-auto pb-60">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all text-center"
            >
              <div className="text-red-500 mb-6 flex justify-center">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}