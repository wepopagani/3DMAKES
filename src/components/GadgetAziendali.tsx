import React from 'react';
import { Link } from 'react-router-dom';

const GadgetAziendali: React.FC = () => {
  // Immagini di esempio (sostituite con URL reali in produzione)
  const immagini = [
    "/images/gadget/badge.png",
    "/images/gadget/portachiavi.png",
    "/images/gadget/espositori.png",
  ];

  const prodotti = [
    {
      id: 1,
      titolo: "Portachiavi NFC Smart",
      descrizione: "Portachiavi innovativi con tecnologia NFC integrata. Personalizzabili con il logo aziendale e programmabili per condividere istantaneamente sito web, contatti o biglietto da visita digitale. Disponibili in diverse forme e materiali premium.",
      categoria: "Accessori Smart",
      immagine: immagini[0]
    },
    {
      id: 2,
      titolo: "Badge NFC Intelligenti",
      descrizione: "Badge identificativi di nuova generazione con chip NFC incorporato. Personalizzabili con logo aziendale, foto, nome e ruolo. Permettono l'accesso rapido al profilo professionale e ai contatti digitali del dipendente.",
      categoria: "Identificazione Smart",
      immagine: immagini[1]
    },
    {
      id: 3,
      titolo: "Espositori da Banco",
      descrizione: "Espositori da banco e vetrina per prodotti o materiale informativo. Struttura leggera ma robusta, personalizzabile nel design e nei colori per valorizzare la tua offerta commerciale.",
      categoria: "Display",
      immagine: immagini[2]
    }
  ];

  const gadgetExtra = [
    { nome: "Targhette Nominative", descrizione: "Perfette per uffici e reception" },
    { nome: "Supporti per Smartphone", descrizione: "Personalizzabili con logo aziendale" },
    { nome: "Portabiglietti da Visita", descrizione: "Eleganti e funzionali" },
    { nome: "Clip Fermacarte", descrizione: "Design moderno, personalizzabili" },
    { nome: "Segnaposto per Meeting", descrizione: "Ideali per sale riunioni e conferenze" },
    { nome: "Decorazioni da Scrivania", descrizione: "Per un tocco personale all'ambiente di lavoro" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Gadget Aziendali
          </h1>
          <p className="text-gray-400">Soluzioni personalizzate per valorizzare il tuo brand</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {prodotti.map((prodotto) => (
            <div key={prodotto.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              <div className="h-64 bg-gray-700 flex items-center justify-center">
                <img 
                  src={prodotto.immagine} 
                  alt={prodotto.titolo} 
                  className="object-cover h-full w-full"
                  // Immagine placeholder in caso di errore
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Gadget+Aziendale";
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{prodotto.titolo}</h2>
                <div className="mb-3">
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{prodotto.categoria}</span>
                </div>
                <p className="text-gray-300 mb-4">{prodotto.descrizione}</p>
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors">
                  Richiedi preventivo
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Altri Gadget Disponibili</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gadgetExtra.map((gadget, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-1">{gadget.nome}</h3>
                <p className="text-gray-300 text-sm">{gadget.descrizione}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Perché Sceglierci</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 text-center">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Consegna Rapida</h3>
              <p className="text-gray-400">Produzione e consegna in tempi rapidi, anche per grandi quantità</p>
            </div>
            <div className="p-4 text-center">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Qualità Garantita</h3>
              <p className="text-gray-400">Materiali di alta qualità e finiture professionali per durare nel tempo</p>
            </div>
            <div className="p-4 text-center">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Assistenza Dedicata</h3>
              <p className="text-gray-400">Supporto personalizzato per aiutarti nella scelta dei gadget più adatti</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/ciotole-personalizzabili" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Ciotole Personalizzabili
          </Link>
          <Link 
            to="/accessori-ristorativi" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Accessori Ristorativi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GadgetAziendali; 