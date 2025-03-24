import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CiotolePersonalizzabili: React.FC = () => {
  // Immagini di esempio (sostituite con URL reali in produzione)
  const immagini = [
    "/Users/wepo/Desktop/ /website/public/images/ciotole/1.png",
    "https://example.com/ciotola-medium.jpg",
    "https://example.com/ciotola-large.jpg",
  ];

  const prodotti = [
    {
      id: 1,
      titolo: "Ciotola per Cani 3D - 14 cm",
      descrizione: "Ciotola stampata in 3D per cani, diametro 14 cm. Personalizzabile con nome del tuo amico a quattro zampe e colore a scelta. Struttura robusta e resistente, ideale per cani di piccola taglia.",
      dimensione: "14 cm",
      perChi: "Cani piccoli",
      immagine: "/images/ciotole/ciotola_cani_14cm.png"
    },
    {
      id: 2,
      titolo: "Ciotola per Cani 3D - 16 cm",
      descrizione: "Ciotola stampata in 3D per cani, diametro 16 cm. Personalizzabile con nome e colore. Perfetta per cani di taglia media, garantisce stabilità durante i pasti.",
      dimensione: "16 cm",
      perChi: "Cani medi",
      immagine: "/images/ciotole/ciotola_cani_16cm.png"
    },
    {
      id: 3,
      titolo: "Slow Feeding per Cani - PETG",
      descrizione: "Ciotola slow feeding in PETG per cani. Design con ostacoli che rallenta l'assunzione del cibo, prevenendo problemi digestivi e obesità. Materiale sicuro e durevole.",
      dimensione: "Standard",
      perChi: "Cani",
      immagine: "/images/ciotole/ciotola_cani_slow.png"
    },
    {
      id: 4,
      titolo: "Ciotola per Gatti - Acciaio Inox",
      descrizione: "Elegante ciotola per gatti con interno in acciaio inox. Facile da pulire e igienica, mantiene il cibo fresco più a lungo. Base stabile per evitare ribaltamenti.",
      dimensione: "Standard",
      perChi: "Gatti",
      immagine: "/images/ciotole/ciotola_gatti_inox.png"
    },
    {
      id: 5,
      titolo: "Slow Feeding per Gatti - PETG",
      descrizione: "Ciotola slow feeding in PETG progettata specificamente per gatti. Aiuta a rallentare i pasti dei gatti che mangiano troppo velocemente, riducendo il rischio di vomito e favorendo una digestione sana.",
      dimensione: "Standard",
      perChi: "Gatti",
      
      immagine: "/images/ciotole/ciotola_gatti_slow.png"
    },
    {
      id: 6,
      titolo: "Ciondolo NFC per Collare",
      descrizione: "Ciondolo intelligente con tag NFC integrato. Contiene i dati del proprietario e dell'animale, accessibili tramite smartphone. Perfetto in caso di smarrimento, resistente all'acqua e personalizzabile con nome e informazioni di contatto.",
      dimensione: "Standard",
      perChi: "Cani e Gatti",
      immagine: "/images/ciotole/ciondolo.png"
    }
  ];

  // Stati per il modale di personalizzazione
  const [modalAperto, setModalAperto] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState<any>(null);
  const [coloreSelezionato, setColoreSelezionato] = useState('');
  const [nomePersonalizzato, setNomePersonalizzato] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Colori disponibili
  const coloriDisponibili = [
    { nome: 'Rosso', codice: '#FF0000' },
    { nome: 'Azzurro', codice: '#0000FF' },
    { nome: 'Verde', codice: '#00FF00' },
    { nome: 'Nero', codice: '#000000' },
    { nome: 'Bianco', codice: '#FFFFFF' },
    { nome: 'Rosa', codice: '#FFC0CB' },
  ];
  
  // Funzione per aprire il modale
  const apriPersonalizzazione = (prodotto: any) => {
    setProdottoSelezionato(prodotto);
    setColoreSelezionato(coloriDisponibili[0].codice);
    setNomePersonalizzato('');
    setModalAperto(true);
  };
  
  // Funzione per inviare i dati di personalizzazione
  const inviaPersonalizzazione = async () => {
    // Trova il nome del colore selezionato
    const coloreSelezionatoObj = coloriDisponibili.find(c => c.codice === coloreSelezionato);
    
    // Costruisci i dati dell'ordine
    const datiOrdine = {
      prodottoId: prodottoSelezionato.id,
      titoloProdotto: prodottoSelezionato.titolo,
      colore: coloreSelezionato,
      nomeColore: coloreSelezionatoObj?.nome || 'Sconosciuto',
      nome: nomePersonalizzato,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Mostra messaggio di caricamento
      setModalAperto(false);
      setIsLoading(true);
      
      // Effettua la chiamata alla funzione Netlify
      const risposta = await fetch('/.netlify/functions/invia-ordine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datiOrdine),
      });
      
      const dati = await risposta.json();
      
      setIsLoading(false);
      
      if (dati.success) {
        alert(`Grazie per il tuo ordine! Riceverai presto la tua ${prodottoSelezionato.titolo} personalizzata con il nome "${nomePersonalizzato}" in colore ${coloreSelezionatoObj?.nome}.`);
      } else {
        // In caso di errore, mostra un messaggio e offri il metodo mailto come fallback
        if (confirm(`Si è verificato un errore nell'invio dell'email. Vuoi utilizzare il tuo client email?`)) {
          // Crea il corpo dell'email in formato leggibile
          const corpoEmail = 
            `Nuovo ordine personalizzato!\n\n` +
            `Prodotto: ${prodottoSelezionato.titolo}\n` +
            `Colore: ${coloreSelezionatoObj?.nome}\n` +
            `Nome personalizzato: ${nomePersonalizzato}\n` +
            `Data: ${new Date().toLocaleString('it-IT')}\n\n`;
          
          window.location.href = `mailto:marco@3dmakes.ch?subject=Nuovo ordine: ${prodottoSelezionato.titolo}&body=${encodeURIComponent(corpoEmail)}`;
        }
      }
    } catch (errore) {
      console.error("Errore durante l'invio dell'ordine:", errore);
      setIsLoading(false);
      alert("Si è verificato un errore nell'elaborazione dell'ordine. Riprova più tardi.");
    }
  };

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
            <div key={prodotto.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl flex flex-col h-full">
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
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{prodotto.titolo}</h2>
                <div className="flex space-x-2 mb-3">
                  <span className="px-3 py-1 bg-red-600 rounded-full text-sm">{prodotto.dimensione}</span>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{prodotto.perChi}</span>
                </div>
                <p className="text-gray-300 mb-4 flex-1">{prodotto.descrizione}</p>
                <button 
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors mt-auto"
                  onClick={() => apriPersonalizzazione(prodotto)}
                >
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
      
      {/* Modale di personalizzazione */}
      {modalAperto && prodottoSelezionato && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Personalizza {prodottoSelezionato.titolo}
            </h2>
            
            {/* Selettore di colore */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Scegli il colore:</h3>
              <div className="grid grid-cols-3 gap-2">
                {coloriDisponibili.map((colore) => (
                  <div 
                    key={colore.codice} 
                    className={`p-2 rounded-md cursor-pointer border-2 ${coloreSelezionato === colore.codice ? 'border-red-500' : 'border-transparent'}`}
                    onClick={() => setColoreSelezionato(colore.codice)}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full mr-2"
                        style={{ backgroundColor: colore.codice, border: colore.codice === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
                      ></div>
                      <span>{colore.nome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Campo per il nome */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Nome da personalizzare:</h3>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                placeholder="Inserisci il nome del tuo animale"
                value={nomePersonalizzato}
                onChange={(e) => setNomePersonalizzato(e.target.value)}
                maxLength={20}
              />
              <p className="text-sm text-gray-400 mt-1">Massimo 20 caratteri</p>
            </div>
            
            {/* Pulsanti */}
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition-colors"
                onClick={() => setModalAperto(false)}
              >
                Annulla
              </button>
              <button 
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                onClick={inviaPersonalizzazione}
                disabled={!nomePersonalizzato.trim()}
              >
                Conferma ordine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aggiungi un componente di caricamento */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-white text-center">Invio dell'ordine in corso...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CiotolePersonalizzabili; 