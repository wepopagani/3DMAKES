import { useState } from 'react';
import { Language, translations } from '../utils/translations';

interface FAQSectionProps {
  language: Language;
}

export default function FAQSection({ language }: FAQSectionProps) {
  const t = translations[language].faq;

  const faqCategories = [
    {
      title: t.categories.printing,
      faqs: [
        {
          question: language === 'it' ? "Quali materiali offrite per la stampa 3D?" : "What materials do you offer for 3D printing?",
          answer: language === 'it' 
            ? "Offriamo un'ampia gamma di materiali tra cui PLA, PETG, ABS, TPU, Nylon e filamenti rinforzati con fibra di carbonio. Per applicazioni ad alta precisione, offriamo anche servizi di stampa in resina."
            : "We offer a wide range of materials including PLA, PETG, ABS, TPU, Nylon, and carbon-fiber-reinforced filaments. We also offer resin printing for high-precision applications."
        },
        {
          question: language === 'it' ? "Quanto tempo richiede un ordine di stampa 3D?" : "How long does a 3D print order take?",
          answer: language === 'it'
            ? "I tempi di consegna dipendono da diversi fattori come dimensioni, complessità e quantità dei pezzi. Gli ordini standard vengono completati in 2-5 giorni lavorativi. Sono disponibili servizi urgenti per progetti prioritari."
            : "Delivery times depend on factors like size, complexity, and quantity. Standard orders are completed within 2-5 business days. Expedited services are available for priority projects."
        },
        {
          question: language === 'it' ? "Qual è la dimensione massima di stampa?" : "What is the maximum print size?",
          answer: language === 'it'
            ? "Le nostre stampanti FDM possono realizzare pezzi fino a 350×350×400mm in un unico pezzo. Oggetti più grandi possono essere stampati in sezioni e assemblati."
            : "Our FDM printers can produce parts up to 350×350×400mm in a single piece. Larger objects can be printed in sections and assembled."
        }
      ]
    },
    {
      title: t.categories.scanning,
      faqs: [
        {
          question: language === 'it' ? "Qual è la precisione del vostro servizio di scansione 3D?" : "What is the accuracy of your 3D scanning service?",
          answer: language === 'it'
            ? "I nostri scanner professionali raggiungono una precisione fino a 0,1mm in base alle dimensioni e alla complessità dell'oggetto. Possiamo acquisire sia la geometria che le informazioni sulla texture."
            : "Our professional scanners reach an accuracy of up to 0.1mm, depending on the size and complexity of the object. We capture both geometry and texture data."
        },
        {
          question: language === 'it' ? "Potete scansionare oggetti grandi?" : "Can you scan large objects?",
          answer: language === 'it'
            ? "Sì, possiamo scansionare oggetti di varie dimensioni. Per oggetti grandi, utilizziamo scansioni multiple che vengono poi combinate in un unico modello 3D."
            : "Yes, we can scan objects of various sizes. For larger objects, we use multiple scans which are then combined into a single 3D model."
        }
      ]
    },
    {
      title: t.categories.pricing,
      faqs: [
        {
          question: language === 'it' ? "Come calcolate i prezzi?" : "How do you calculate prices?",
          answer: language === 'it'
            ? "I prezzi sono basati sul volume del materiale, tempo di stampa e complessità. I fattori includono tipo di materiale, impostazioni di qualità e requisiti di post-processing. Usa il nostro calcolatore online per preventivi istantanei."
            : "Prices are based on material volume, print time, and complexity. Factors include material type, quality settings, and post-processing requirements. Use our online calculator for instant quotes."
        },
        {
          question: language === 'it' ? "Offrite sconti per ordini all'ingrosso?" : "Do you offer discounts for bulk orders?",
          answer: language === 'it'
            ? "Sì, offriamo sconti per ordini all'ingrosso. 5+ pezzi ricevono uno sconto del 10%, e 10+ pezzi ricevono uno sconto del 15%. Contattaci per preventivi personalizzati su grandi ordini."
            : "Yes, we offer bulk discounts. Orders of 5+ pieces receive a 10% discount, and 10+ pieces receive a 15% discount. Contact us for custom quotes on large orders."
        }
      ]
    },
    {
      title: t.categories.quality,
      faqs: [
        {
          question: language === 'it' ? "Quali misure di controllo qualità adottate?" : "What quality control measures do you have?",
          answer: language === 'it'
            ? "Ogni stampa viene sottoposta a rigorosi controlli di qualità, inclusa la verifica dimensionale e l'ispezione visiva. Forniamo stampe di prova per applicazioni critiche e manteniamo rigorosi standard di controllo qualità."
            : "Every print undergoes strict quality control, including dimensional verification and visual inspection. We provide test prints for critical applications and maintain high-quality standards."
        },
        {
          question: language === 'it' ? "Fornite assistenza per il design?" : "Do you provide design assistance?",
          answer: language === 'it'
            ? "Sì, il nostro team può aiutare a ottimizzare i design per la stampa 3D, suggerire materiali appropriati e fornire consulenza tecnica durante tutto il progetto."
            : "Yes, our team can help optimize designs for 3D printing, suggest suitable materials, and provide technical support throughout the project."
        }
      ]
    }
  ];

  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
    setOpenFAQ(null);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="pt-0 pb-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          {t.title}
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          {t.subtitle}
        </p>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleCategory(categoryIndex)}
              >
                <h3 className="text-xl font-semibold text-white">
                  {category.title}
                </h3>
                <svg
                  className={`w-6 h-6 text-red-500 transform transition-transform ${
                    openCategory === categoryIndex ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openCategory === categoryIndex && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-700 last:border-0">
                        <button
                          className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
                          onClick={() => toggleFAQ(faqIndex)}
                        >
                          <h4 className="text-gray-200 pr-8">
                            {faq.question}
                          </h4>
                          <svg
                            className={`w-5 h-5 text-red-500 transform transition-transform flex-shrink-0 ${
                              openFAQ === faqIndex ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {openFAQ === faqIndex && (
                          <div className="pb-4 text-gray-400">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}