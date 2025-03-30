import React from 'react';
import { Link } from 'react-router-dom';

const AccessoriRistorativi: React.FC = () => {
  // Immagini di esempio (sostituite con URL reali in produzione)
  const immagini = [
    "/images/accessori/cubo.png",
    "/images/accessori/Sottobicchiere.png",
    "/images/accessori/portaborse.png",
    "/images/accessori/poggiabacchette.png",
    "/images/accessori/zucchero.png",
  ];

  const prodotti = [
    {
      id: 1,
      titolo: "Cubo QR Menu & WiFi",
      descrizione: "Cubo elegante da tavolo 5x5x5cm stampato in 3D. Due facce verticali personalizzabili con il tuo logo, due facce con QR code per menu digitale e WiFi con relative indicazioni. Disponibile in vari colori e finiture. Opzione per integrazione tag NFC. Materiale eco-compatibile, resistente a liquidi e facile da pulire.",
      categoria: "Digitale",
      immagine: immagini[0]
    },
    {
      id: 2,
      titolo: "Set Sottobicchieri Personalizzati",
      descrizione: "Sottobicchieri professionali diametro 9cm in PETG-CF, materiale ultra resistente agli urti e alle alte temperature. Personalizzabili con il logo del tuo locale, disponibili in diverse colorazioni. La finitura in fibra di carbonio garantisce un'eleganza senza tempo e una durabilità eccezionale.",
      categoria: "Tavola",
      immagine: immagini[1]
    },
    {
      id: 3,
      titolo: "Poggia Borse Design",
      descrizione: "Elegante poggia borse da tavolo, progettato per tenere le borse dei clienti sollevate da terra in modo sicuro e igienico. Personalizzabile con il logo del tuo locale, disponibile in diverse finiture e colori per abbinarsi perfettamente al tuo arredamento.",
      categoria: "Accessori",
      immagine: immagini[2]
    },
    {
      id: 4,
      titolo: "Porta Bacchette/Posate Personalizzato",
      descrizione: "Elegante porta bacchette e posate da tavolo, perfetto per ristoranti di sushi e non solo. Design minimalista con spazio per il logo del tuo locale in rilievo. Realizzato in materiale food-safe e disponibile in varie dimensioni e colori per adattarsi al tuo stile. Ideale anche come porta posate tradizionale.",
      categoria: "Tavola",
      immagine: immagini[3]
    },
    {
      id: 5,
      titolo: "Dispenser Zucchero Personalizzato",
      descrizione: "Dispenser per zucchero e dolcificanti dal design moderno ed elegante. Personalizzabile con il logo del tuo locale e disponibile in diverse forme e dimensioni. Dotato di sistema anti-umidità e facile da ricaricare. Realizzato in materiale alimentare di alta qualità, resistente e durevole. Perfetto per bar, caffetterie e ristoranti.",
      categoria: "Accessori",
      immagine: immagini[4]
    }
  ];

  const scrollToBottom = () => {
    // Piccolo timeout per assicurarsi che lo scroll avvenga dopo il cambio pagina
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Accessori Ristorativi
          </h1>
          <p className="text-gray-400">Soluzioni innovative per la ristorazione moderne e personalizzabili</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {prodotti.map((prodotto) => (
            <div key={prodotto.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl flex flex-col">
              <div className="h-64 bg-gray-700 flex items-center justify-center">
                <img 
                  src={prodotto.immagine} 
                  alt={prodotto.titolo} 
                  className="object-cover h-full w-full"
                  // Immagine placeholder in caso di errore
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Accessorio+Ristorativo";
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2">{prodotto.titolo}</h2>
                <div className="mb-3">
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{prodotto.categoria}</span>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">{prodotto.descrizione}</p>
                <Link 
                  to="/"
                  onClick={scrollToBottom}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors block text-center mt-auto"
                >
                  Contattaci
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">I nostri Vantaggi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Materiali Ecologici</h3>
              <p className="text-gray-400">Utilizziamo materiali biodegradabili e riciclabili per tutti i nostri prodotti</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Personalizzazione Completa</h3>
              <p className="text-gray-400">Ogni prodotto è personalizzabile nei colori, forme e finiture</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Design Unico</h3>
              <p className="text-gray-400">Prodotti esclusivi con design moderno per migliorare l'immagine del tuo locale</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-10 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Altri Accessori Disponibili</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-md font-medium">Portamenu</h3>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-md font-medium">Segnatavoli</h3>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-md font-medium">Portatovaglioli</h3>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-md font-medium">Decorazioni da Banco</h3>
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
            to="/gadget-aziendali" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Gadget Aziendali
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessoriRistorativi;