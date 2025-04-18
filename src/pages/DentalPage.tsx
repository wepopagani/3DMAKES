import React from 'react';
import ContactForm from '../components/ContactView';

const DentalPage: React.FC = () => {
  // Prodotti dentali
  const prodotti = [
    {
      id: 1,
      titolo: "Modello Dentale Arcata Completa",
      descrizione: "Modelli di alta precisione per diagnosi, pianificazione del trattamento e comunicazione col paziente. Ideali per ortodonzia e protesi.",
      prezzo: "45 CHF",
      immagine: "/images/projects/arcata_completa.png"
    },
    {
      id: 2,
      titolo: "Dime Chirurgiche",
      descrizione: "Guide personalizzate che aumentano sicurezza e precisione negli interventi di implantologia. Consentono un posizionamento preciso degli impianti.",
      prezzo: "20 CHF",
      immagine: "/images/projects/dima.png"
    },
    {
      id: 3,
      titolo: "Bite e Splint",
      descrizione: "Dispositivi su misura per il trattamento del bruxismo o per la protezione dentale, perfettamente adattati all'anatomia del paziente.",
      prezzo: "25 CHF",
      immagine: "/images/projects/bite.png"
    },
    {
      id: 4,
      titolo: "Modello dentale arcata singola",
      descrizione: "Modelli precisi di una singola arcata dentale per diagnosi, pianificazione dei trattamenti e comunicazione efficace con il paziente.",
      prezzo: "25 CHF",
      immagine: "/images/projects/singola.png"
    }
  ];

  // Prezzi
  const listinoPrezzi = [
    { prodotto: "Modello dentale arcata singola", prezzo: "25" },
    { prodotto: "Modello dentale completo", prezzo: "45" },
    { prodotto: "Dima/guida chirurgica (prova)", prezzo: "20" },
    { prodotto: "Bite/splint da laboratorio (prova)", prezzo: "25" }
  ];

  // Servizi aggiuntivi
  const serviziAggiuntivi = [
    "Preparazione file STL: 12 CHF (se necessario)",
    "Urgenza (consegna in 12h): +30%",
    "Ritiro gratuito - consegna a domicilio (Lugano): 10 CHF (gratuito sopra 100 CHF di ordine)",
    "Sconti per ordini multipli o collaborazioni continuative"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Stampa 3D in Odontotecnica
          </h1>
          <p className="text-gray-400">Soluzioni innovative per studi dentistici e laboratori</p>
        </header>

        {/* Sezione servizio */}
        <div className="mb-12 max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Il servizio</h2>
          <p className="text-gray-300 mb-4">
            Realizziamo modelli dentali completi o parziali, dime chirurgiche, bite da laboratorio e vassoi
            individuali tramite stampa 3D professionale. Offro rapidità, precisione (fino a 0.01mm in asse Z) e prezzi
            competitivi per studi dentistici e laboratori odontotecnici.
          </p>
          <p className="text-gray-300">
            Lavoro su file STL forniti dal cliente e consegno in tempi brevi modelli di alta qualità, ideali per
            ortodonzia, protesi, pianificazione e comunicazione col paziente.
          </p>
        </div>

        {/* Prodotti/Applicazioni */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Applicazioni Pratiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {prodotti.map((prodotto) => (
              <div key={prodotto.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl flex flex-col h-full">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <img 
                    src={prodotto.immagine} 
                    alt={prodotto.titolo} 
                    className="object-cover h-full w-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Modello+3D";
                    }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{prodotto.titolo}</h3>
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-red-600 rounded-full text-sm">{prodotto.prezzo}</span>
                  </div>
                  <p className="text-gray-300 mb-4 flex-1">{prodotto.descrizione}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listino prezzi */}
        <div className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Listino Prezzi</h2>
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Prodotto
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Prezzo (CHF)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {listinoPrezzi.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {item.prodotto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {item.prezzo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vantaggi */}
        <div className="max-w-4xl mx-auto mt-12 mb-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Vantaggi della stampa 3D dentale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Rapidità</h3>
              <p className="text-gray-400">Tempi di produzione significativamente ridotti rispetto ai metodi tradizionali</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Precisione</h3>
              <p className="text-gray-400">Alta precisione con tolleranze fino a 0,01mm per risultati clinicamente eccellenti</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Personalizzazione</h3>
              <p className="text-gray-400">Soluzioni completamente personalizzate per ogni paziente</p>
            </div>
          </div>
        </div>

        {/* Servizi aggiuntivi */}
        <div className="max-w-4xl mx-auto mb-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Servizi aggiuntivi</h2>
          <ul className="space-y-2">
            {serviziAggiuntivi.map((servizio, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{servizio}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Note */}
        <div className="max-w-4xl mx-auto mb-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Note</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300">Tutti i modelli sono destinati a uso extraorale, diagnostico o di laboratorio (no dispositivi certificati per uso intraorale definitivo).</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300">Per esigenze particolari o grandi volumi, contattami per un preventivo personalizzato.</span>
            </li>
          </ul>
        </div>

        {/* Contatto */}
        <div className="max-w-4xl mx-auto mb-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Contattaci</h2>
          <p className="text-center mb-6 text-gray-300">
            Sei interessato a implementare la stampa 3D nel tuo studio o laboratorio? Contattaci per una consulenza.
          </p>
          
          <div className="text-center">
            <a 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
                setTimeout(() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              Contattaci!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalPage;
