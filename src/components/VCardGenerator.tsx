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

// Aggiungi le lingue supportate
const lingueDisponibili = [
  { codice: 'it', nome: 'Italiano' },
  { codice: 'en', nome: 'English' },
  { codice: 'fr', nome: 'Français' },
  { codice: 'de', nome: 'Deutsch' },
  { codice: 'es', nome: 'Español' }
];

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
    sito: '',
    social: {
      linkedin: '',
      facebook: '',
      instagram: '',
      x: ''
    },
    lingua: 'it'
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
  
  // Aggiungi queste funzioni per la validazione
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateInput = () => {
    const newErrors: Record<string, string> = {};
    
    // Validazioni base
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email non valida";
    }
    
    // Valida sito web
    if (formData.sito && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.sito)) {
      newErrors.sito = "URL non valido";
    }
    
    // Valida telefono (versione internazionale semplificata)
    if (formData.telefono && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.telefono)) {
      newErrors.telefono = "Formato telefono non valido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
    
    // Debug - verifica cosa restituisce OpenStreetMap
    console.log('Indirizzo OpenStreetMap:', address);
    
    // Verifica se il numero civico è presente nella risposta di OpenStreetMap
    if (!numeroCivico) {
      // Prova ad estrarre il numero civico dalla stringa di visualizzazione
      const displayParts = result.display_name.split(',');
      const firstPart = displayParts[0].trim();
      
      // Verifica se la prima parte contiene numeri (possibile formato "Via Roma 12")
      const match = firstPart.match(/(\d+\w*)\s*$/);
      if (match && via) {
        numeroCivico = match[1];
        // Rimuovi il numero civico dalla via se è incluso
        via = via.replace(new RegExp(`\\s*${numeroCivico}\\s*$`), '').trim();
      }
    }
    
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Gestione dei campi di indirizzo annidati
    if (name.startsWith("indirizzo.")) {
      const indirizzoField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        indirizzo: {
          ...prev.indirizzo,
          [indirizzoField]: value
        }
      }));
    }
    // Gestione dei campi social annidati
    else if (name.startsWith("social.")) {
      const socialField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Aggiungi lo stato e le funzioni per la cronologia
  const [savedCards, setSavedCards] = useState<Array<{
    id: string;
    nome: string;
    cognome: string;
    data: typeof formData;
    timestamp: number;
  }>>([]);

  // Carica la cronologia al mount
  useEffect(() => {
    const saved = localStorage.getItem('vcard-history');
    if (saved) {
      try {
        setSavedCards(JSON.parse(saved));
      } catch (e) {
        console.error('Errore nel parsing della cronologia:', e);
      }
    }
  }, []);

  // Funzione per salvare una vCard nella cronologia
  const saveToHistory = () => {
    const newCard = {
      id: Date.now().toString(),
      nome: formData.nome,
      cognome: formData.cognome,
      data: {...formData},
      timestamp: Date.now()
    };
    
    const updatedHistory = [newCard, ...savedCards].slice(0, 10); // Mantieni solo le ultime 10
    setSavedCards(updatedHistory);
    localStorage.setItem('vcard-history', JSON.stringify(updatedHistory));
  };
  
  const generateVCard = () => {
    // Formatta l'indirizzo completo
    const indirizzoCompleto = formattaIndirizzo();
    
    // Aggiungi i profili social alla vCard
    let socialLines = '';
    if (formData.social.linkedin) socialLines += `X-SOCIALPROFILE;TYPE=linkedin:${formData.social.linkedin}\n`;
    if (formData.social.facebook) socialLines += `X-SOCIALPROFILE;TYPE=facebook:${formData.social.facebook}\n`;
    if (formData.social.instagram) socialLines += `X-SOCIALPROFILE;TYPE=instagram:${formData.social.instagram}\n`;
    if (formData.social.x) socialLines += `X-SOCIALPROFILE;TYPE=x:${formData.social.x}\n`;
    
    // Crea il contenuto vCard con i social
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
${socialLines}END:VCARD`;
    
    // Codifica il contenuto come data URL con il Content-Disposition corretto
    const encodedVCard = encodeURIComponent(vCardContent);
    const vCardDataUrl = `data:text/vcard;charset=utf-8;content-disposition=attachment;filename=${formData.nome}_${formData.cognome}.vcf,${encodedVCard}`;
    
    setVCardUrl(vCardDataUrl);
    setShowResults(true);
    
    // Accorcia l'URL e genera il QR
    shortenVCardUrl(vCardDataUrl, indirizzoCompleto);
    
    // Salva nella cronologia
    saveToHistory();
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
      
      // Aggiungi i social media
      if (formData.social.linkedin) contactParams.append('linkedin', formData.social.linkedin);
      if (formData.social.facebook) contactParams.append('facebook', formData.social.facebook);
      if (formData.social.instagram) contactParams.append('instagram', formData.social.instagram);
      if (formData.social.x) contactParams.append('x', formData.social.x);
      
      // Aggiungi la lingua preferita
      contactParams.append('lingua', formData.lingua);
      
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
        
        // Genera il QR code per l'URL ACCORCIATO
        try {
          const imageData = await QRCode.toDataURL(data.shortUrl, {
            color: {
              dark: '#000000',
              light: '#ffffff'
            },
            margin: 2
          });
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
  
  // Aggiungi uno stato per controllare la visualizzazione dell'anteprima
  const [showPreview, setShowPreview] = useState(false);
  
  // Aggiungi stato per la personalizzazione del QR code
  const [qrOptions, setQrOptions] = useState({
    color: '#000000',
    backgroundColor: '#ffffff',
    margin: 2,
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Generatore vCard
          </h1>
          <p className="text-gray-400">Crea la tua vCard e condividila facilmente</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-4 sm:p-6 shadow-xl mb-8">
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
              {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
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
              {errors.cognome && <p className="text-red-400 text-xs mt-1">{errors.cognome}</p>}
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
              {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
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
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-3 text-gray-300">Indirizzo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Via</label>
                  <input
                    type="text"
                    name="indirizzo.via"
                    value={formData.indirizzo.via}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Numero civico</label>
                  <input
                    type="text"
                    name="indirizzo.numeroCivico"
                    value={formData.indirizzo.numeroCivico}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Città</label>
                  <input
                    type="text"
                    name="indirizzo.citta"
                    value={formData.indirizzo.citta}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">CAP</label>
                  <input
                    type="text"
                    name="indirizzo.cap"
                    value={formData.indirizzo.cap}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Provincia</label>
                  <input
                    type="text"
                    name="indirizzo.provincia"
                    value={formData.indirizzo.provincia}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Paese</label>
                  <input
                    type="text"
                    name="indirizzo.paese"
                    value={formData.indirizzo.paese}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
              </div>
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
              {errors.sito && <p className="text-red-400 text-xs mt-1">{errors.sito}</p>}
            </div>
            
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium mb-3 text-gray-300">Profili Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center text-gray-300 mb-1">
                    <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="social.linkedin"
                    value={formData.social.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-300 mb-1">
                    <svg className="w-5 h-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="social.facebook"
                    value={formData.social.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/username"
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-300 mb-1">
                    <svg className="w-5 h-5 mr-2 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="social.instagram"
                    value={formData.social.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-300 mb-1">
                    <svg className="w-5 h-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </label>
                  <input
                    type="url"
                    name="social.x"
                    value={formData.social.x}
                    onChange={handleChange}
                    placeholder="https://x.com/username"
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 mt-2">
              <label className="block text-gray-300 mb-1">Lingua preferita</label>
              <select
                name="lingua"
                value={formData.lingua}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                {lingueDisponibili.map(lingua => (
                  <option key={lingua.codice} value={lingua.codice}>
                    {lingua.nome}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Lingua in cui verrà visualizzata la pagina del contatto
              </p>
            </div>
          </div>
          
          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={() => setShowPreview(true)}
              disabled={!formData.nome || !formData.cognome}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anteprima
            </button>
            
            <button
              onClick={() => {
                if (validateInput()) {
                  generateVCard();
                }
              }}
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
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white text-gray-800 rounded-lg w-full max-w-md relative">
            {/* Header con pulsante di chiusura */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Anteprima contatto</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenuto anteprima - simile a ContactView */}
            <div className="p-6">
              {/* Header con nome */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{formData.nome} {formData.cognome}</h1>
                {formData.ruolo && formData.azienda && (
                  <p className="text-lg text-gray-600 mt-1">{formData.ruolo}, {formData.azienda}</p>
                )}
                {formData.ruolo && !formData.azienda && (
                  <p className="text-lg text-gray-600 mt-1">{formData.ruolo}</p>
                )}
                {!formData.ruolo && formData.azienda && (
                  <p className="text-lg text-gray-600 mt-1">{formData.azienda}</p>
                )}
              </div>
              
              {/* Dettagli contatto */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                {formData.telefono && (
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefono</p>
                      <p className="text-lg font-medium text-gray-800">{formData.telefono}</p>
                    </div>
                  </div>
                )}
                
                {formData.email && (
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-800">{formData.email}</p>
                    </div>
                  </div>
                )}
                
                {(formData.indirizzo.via || formData.indirizzo.citta || formData.indirizzo.cap) && (
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Indirizzo</p>
                      {formData.indirizzo.via && (
                        <p className="text-lg font-medium text-gray-800">
                          {formData.indirizzo.via} {formData.indirizzo.numeroCivico}
                        </p>
                      )}
                      
                      {(formData.indirizzo.cap || formData.indirizzo.citta || formData.indirizzo.provincia) && (
                        <p className="text-lg font-medium text-gray-800">
                          {formData.indirizzo.cap && `${formData.indirizzo.cap} `}
                          {formData.indirizzo.citta && `${formData.indirizzo.citta} `}
                          {formData.indirizzo.provincia && `(${formData.indirizzo.provincia})`}
                        </p>
                      )}
                      
                      {formData.indirizzo.paese && formData.indirizzo.paese !== "Italia" && (
                        <p className="text-lg font-medium text-gray-800">
                          {formData.indirizzo.paese}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {formData.sito && (
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sito Web</p>
                      <p className="text-lg font-medium text-gray-800">{formData.sito}</p>
                    </div>
                  </div>
                )}
                
                {/* Profili social */}
                {(formData.social.linkedin || formData.social.facebook || formData.social.instagram || formData.social.x) && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-700">Social</h3>
                    <div className="flex flex-wrap gap-3">
                      {formData.social.linkedin && (
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </div>
                      )}
                      
                      {formData.social.facebook && (
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                          </svg>
                        </div>
                      )}
                      
                      {formData.social.instagram && (
                        <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                          </svg>
                        </div>
                      )}
                      
                      {formData.social.x && (
                        <div className="p-2 bg-black text-white rounded-full">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer con lingua */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Lingua selezionata: {lingueDisponibili.find(l => l.codice === formData.lingua)?.nome || 'Italiano'}
              </div>
            </div>
            
            {/* Pulsanti di azione */}
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Chiudi
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  if (validateInput()) {
                    generateVCard();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Genera vCard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Aggiungi un pannello per la cronologia */}
      <div className="mt-6">
        <details className="bg-gray-700 rounded-lg">
          <summary className="cursor-pointer p-3 font-medium">Cronologia vCard recenti</summary>
          <div className="p-3">
            {savedCards.length === 0 ? (
              <p className="text-gray-400 text-center">Nessuna vCard salvata</p>
            ) : (
              <ul className="divide-y divide-gray-600">
                {savedCards.map(card => (
                  <li key={card.id} className="py-2">
                    <div className="flex justify-between items-center">
                      <span>{card.nome} {card.cognome}</span>
                      <button
                        onClick={() => {
                          setFormData(card.data);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Riutilizza
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(card.timestamp).toLocaleString('it-IT')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default VCardGenerator;
