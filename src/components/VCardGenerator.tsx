import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';

// Interfaccia per i risultati di ricerca dell'indirizzo
interface AddressResult {
  place_id: number;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

const VCardGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    indirizzo: {
      via: '',
      numeroCivico: '',
      citta: '',
      cap: '',
      provincia: '',
      paese: 'Italia'
    },
    azienda: '',
    ruolo: '',
    sito: ''
  });
  
  const [vCardUrl, setVCardUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  
  // Stati per l'autocompletamento dell'indirizzo
  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddressResults, setShowAddressResults] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Effetto per il debounce della ricerca indirizzi
  useEffect(() => {
    if (addressSearch.length < 3) {
      setAddressResults([]);
      setShowAddressResults(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchAddresses(addressSearch);
    }, 500); // Attende 500ms dopo l'ultima digitazione

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [addressSearch]);
  
  // Effetto per chiudere i risultati quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowAddressResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Funzione per cercare indirizzi tramite OpenStreetMap/Nominatim
  const searchAddresses = async (query: string) => {
    if (query.length < 3) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=ch,it`
      );
      
      if (!response.ok) {
        throw new Error('Errore nella ricerca degli indirizzi');
      }
      
      const data = await response.json();
      setAddressResults(data);
      setShowAddressResults(true);
    } catch (error) {
      console.error('Errore nella ricerca degli indirizzi:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Funzione per selezionare un indirizzo dai risultati
  const handleSelectAddress = (result: AddressResult) => {
    // Estrai le informazioni dell'indirizzo
    const address = result.address;
    
    // Componi l'indirizzo con nome della strada e numero civico se disponibili
    let via = address.road || '';
    let numeroCivico = address.house_number || '';
    let citta = address.city || address.town || address.village || '';
    let cap = address.postcode || '';
    let provincia = address.state || '';
    let paese = address.country || 'Italia';
    
    // Aggiorna formData con i nuovi valori dell'indirizzo
    setFormData(prev => ({
      ...prev,
      indirizzo: {
        via,
        numeroCivico,
        citta,
        cap,
        provincia,
        paese
      }
    }));
    
    // Aggiorna il campo di ricerca con l'indirizzo completo selezionato
    setAddressSearch(result.display_name);
    
    // Chiudi il dropdown dei risultati
    setShowAddressResults(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateVCard = () => {
    // Formatta l'indirizzo completo
    const indirizzoCompleto = formattaIndirizzo();
    
    // Crea il contenuto vCard in formato standard
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${formData.cognome};${formData.nome};;;
FN:${formData.nome} ${formData.cognome}
${formData.azienda ? `ORG:${formData.azienda}\n` : ''}
${formData.ruolo ? `TITLE:${formData.ruolo}\n` : ''}
${formData.telefono ? `TEL;TYPE=CELL:${formData.telefono}\n` : ''}
${formData.email ? `EMAIL:${formData.email}\n` : ''}
${indirizzoCompleto ? `ADR:;;${indirizzoCompleto};;;;\n` : ''}
${formData.sito ? `URL:${formData.sito}\n` : ''}
END:VCARD`;
    
    // Codifica il contenuto come data URL con il Content-Disposition corretto
    const encodedVCard = encodeURIComponent(vCardContent);
    const vCardDataUrl = `data:text/vcard;charset=utf-8;content-disposition=attachment;filename=${formData.nome}_${formData.cognome}.vcf,${encodedVCard}`;
    
    setVCardUrl(vCardDataUrl);
    setShowResults(true);
    
    // Accorcia l'URL e genera il QR
    shortenVCardUrl(vCardDataUrl, indirizzoCompleto);
  };
  
  // Funzione per formattare l'indirizzo
  const formattaIndirizzo = () => {
    const { via, numeroCivico, citta, cap, provincia, paese } = formData.indirizzo;
    
    // Verifica quali componenti dell'indirizzo sono stati inseriti
    const componenti = [];
    
    if (via) {
      componenti.push(`${via}${numeroCivico ? ' ' + numeroCivico : ''}`);
    }
    
    if (citta || cap || provincia) {
      const secondaLinea = [citta, cap, provincia].filter(Boolean).join(", ");
      if (secondaLinea) componenti.push(secondaLinea);
    }
    
    if (paese && paese !== 'Italia') {
      componenti.push(paese);
    }
    
    return componenti.join(", ");
  };
  
  const shortenVCardUrl = async (url: string, indirizzoCompleto: string) => {
    setLoading(true);
    
    try {
      // Creiamo una query string con i dati del contatto
      const contactParams = new URLSearchParams();
      contactParams.append('nome', formData.nome);
      contactParams.append('cognome', formData.cognome);
      if (formData.telefono) contactParams.append('tel', formData.telefono);
      if (formData.email) contactParams.append('email', formData.email);
      
      // Aggiungi sia l'indirizzo completo che i componenti separati
      if (indirizzoCompleto) contactParams.append('adr', indirizzoCompleto);
      
      // Aggiungi anche i componenti individuali dell'indirizzo
      if (formData.indirizzo.via) contactParams.append('via', formData.indirizzo.via);
      if (formData.indirizzo.numeroCivico) contactParams.append('civico', formData.indirizzo.numeroCivico);
      if (formData.indirizzo.citta) contactParams.append('citta', formData.indirizzo.citta);
      if (formData.indirizzo.cap) contactParams.append('cap', formData.indirizzo.cap);
      if (formData.indirizzo.provincia) contactParams.append('provincia', formData.indirizzo.provincia);
      if (formData.indirizzo.paese) contactParams.append('paese', formData.indirizzo.paese);
      
      if (formData.azienda) contactParams.append('org', formData.azienda);
      if (formData.ruolo) contactParams.append('title', formData.ruolo);
      if (formData.sito) contactParams.append('url', formData.sito);
      
      // Crea l'URL della pagina di visualizzazione contatto
      const contactViewUrl = `${window.location.origin}/contact-view?${contactParams.toString()}`;
      
      // Accorcia l'URL della pagina di visualizzazione
      const response = await fetch('https://server.3dmakes.ch:3000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: contactViewUrl })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShortUrl(data.shortUrl);
        
        // Genera il QR code per l'URL della pagina di visualizzazione
        try {
          const imageData = await QRCode.toDataURL(contactViewUrl);
          setQrImage(imageData);
        } catch (qrError) {
          console.error('Errore nella generazione del QR:', qrError);
        }
      }
    } catch (error) {
      console.error('Errore durante l\'accorciamento dell\'URL:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Generatore vCard
          </h1>
          <p className="text-gray-400">Crea la tua vCard e condividila facilmente</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 mb-1">Nome *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Cognome *</label>
              <input
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Telefono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Indirizzo</label>
              <div className="relative">
                <input
                  type="text"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  placeholder="Inizia a digitare per cercare l'indirizzo..."
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Risultati della ricerca */}
                {showAddressResults && addressResults.length > 0 && (
                  <div 
                    ref={resultsRef}
                    className="absolute z-10 mt-1 w-full bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto"
                  >
                    <ul className="py-1">
                      {addressResults.map((result) => (
                        <li 
                          key={result.place_id}
                          onClick={() => handleSelectAddress(result)}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm text-white"
                        >
                          {result.display_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Cerca e seleziona un indirizzo dalle opzioni suggerite</p>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Azienda</label>
              <input
                type="text"
                name="azienda"
                value={formData.azienda}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Ruolo</label>
              <input
                type="text"
                name="ruolo"
                value={formData.ruolo}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Sito web</label>
              <input
                type="url"
                name="sito"
                value={formData.sito}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                placeholder="https://"
              />
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={generateVCard}
              disabled={!formData.nome || !formData.cognome}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Genera vCard
            </button>
          </div>
        </div>
        
        {showResults && (
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-center">La tua vCard è pronta</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-300">QR Code</h3>
                <div className="bg-white p-3 rounded-lg w-fit mx-auto">
                  {qrImage ? (
                    <img src={qrImage} alt="vCard QR Code" className="w-64 h-64" />
                  ) : (
                    <img src={qrCodeUrl} alt="vCard QR Code" className="w-64 h-64" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={qrImage || qrCodeUrl}
                    download="vcard-qrcode.png"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors inline-block"
                  >
                    Scarica QR Code
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-300">Link vCard</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Link diretto:</p>
                  <div className="flex items-center bg-gray-700 p-2 rounded-lg mb-3">
                    <input
                      type="text"
                      value={vCardUrl}
                      readOnly
                      className="bg-transparent flex-grow p-1 text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(vCardUrl)}
                      className="ml-2 p-1 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                      <span className="sr-only">Copia</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  
                  <a
                    href={vCardUrl}
                    download={`${formData.nome}_${formData.cognome}.vcf`}
                    className="block w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors text-center"
                  >
                    Scarica vCard
                  </a>
                </div>
                
                {shortUrl && (
                  <div className="mt-5">
                    <p className="text-sm text-gray-400 mb-1">Link accorciato:</p>
                    <div className="flex items-center bg-gray-700 p-2 rounded-lg">
                      <input
                        type="text"
                        value={shortUrl}
                        readOnly
                        className="bg-transparent flex-grow p-1"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(shortUrl)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md ml-2"
                      >
                        Copia
                      </button>
                    </div>
                  </div>
                )}
                
                {loading && (
                  <div className="text-center py-3 mt-4">
                    <div className="inline-block w-5 h-5 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-400">Accorciamento in corso...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link 
            to="/linksh" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Accorciatore URL
          </Link>
          <Link 
            to="/qrgen" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Generatore QR
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VCardGenerator;
