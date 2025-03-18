import React from 'react';
import { Link } from 'react-router-dom';

const CiotolePersonalizzabili: React.FC = () => {
  // Immagini di esempio (sostituite con URL reali in produzione)
  const immagini = [
    "https://example.com/ciotola-small.jpg",
    "https://example.com/ciotola-medium.jpg",
    "https://example.com/ciotola-large.jpg",
  ];

  const prodotti = [
    {
      id: 1,
      titolo: "Ciotola Micio S",
      descrizione: "Ciotola personalizzabile per gatti, diametro 15 cm. Ideale per i nostri amici felini, con bordo rialzato per evitare fuoriuscite e base antiscivolo. Personalizzabile con nome e simboli.",
      dimensione: "S - 15 cm",
      perChi: "Gatti",
      immagine: immagini[0]
    },
    {
      id: 2,
      titolo: "Ciotola Fido M",
      descrizione: "Ciotola personalizzabile per cani di taglia media, diametro 18 cm. Design ergonomico con profilo ribassato anteriormente per facilitare l'accesso al cibo. Personalizzabile con nome, colori e decorazioni.",
      dimensione: "M - 18 cm",
      perChi: "Cani taglia media",
      immagine: immagini[1]
    },
    {
      id: 3,
      titolo: "Ciotola Big Woof L",
      descrizione: "Ciotola personalizzabile per cani di taglia grande, diametro 21 cm. Extra resistente e con capacità maggiorata. Base stabilizzante per cani più vivaci. Personalizzabile con nome, colori e disegni.",
      dimensione: "L - 21 cm",
      perChi: "Cani taglia grande",
      immagine: immagini[2]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Ciotole Personalizzabili
          </h1>
          <p className="text-gray-400">Ciotole stampate in 3D, personalizzabili con colori, nomi e simboli</p>
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
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Ciotola+3D";
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{prodotto.titolo}</h2>
                <div className="flex space-x-2 mb-3">
                  <span className="px-3 py-1 bg-red-600 rounded-full text-sm">{prodotto.dimensione}</span>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{prodotto.perChi}</span>
                </div>
                <p className="text-gray-300 mb-4">{prodotto.descrizione}</p>
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors">
                  Personalizza ora
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Personalizzazione</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Colori Personalizzabili</h3>
              <p className="text-gray-400">Scegli tra 12 colori diversi per la tua ciotola, combinabili tra loro</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Nome del tuo Animale</h3>
              <p className="text-gray-400">Aggiungi il nome del tuo amico a quattro zampe in rilievo</p>
            </div>
            <div className="p-4">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Simboli e Decorazioni</h3>
              <p className="text-gray-400">Aggiungi simboli, zampette o decorazioni a tua scelta</p>
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
            to="/accessori-ristorativi" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Accessori Ristorativi
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

export default CiotolePersonalizzabili; 