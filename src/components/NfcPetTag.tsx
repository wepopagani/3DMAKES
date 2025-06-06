import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Interfaccia per le proprietà dell'autocomplete
interface GooglePlace {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
}

interface PetTagData {
  proprietario: {
    nome: string;
    cognome: string;
    telefono: string;
    via: string;
    cap: string;
    citta: string;
    paese: string;
  };
  animale: {
    nome: string;
    tipo: string;
    razza: string;
    sesso: string;
    colore: string;
  };
}

const NfcPetTag: React.FC = () => {
  const [formData, setFormData] = useState<PetTagData>({
    proprietario: {
      nome: '',
      cognome: '',
      telefono: '',
      via: '',
      cap: '',
      citta: '',
      paese: 'Italia'
    },
    animale: {
      nome: '',
      tipo: 'Cane',
      razza: '',
      sesso: '',
      colore: ''
    }
  });
  
  const [shortUrl, setShortUrl] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [addressInput, setAddressInput] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Carica Google Maps API
  useEffect(() => {
    // Verifico se lo script è già stato caricato
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAH-o9eHTwVsSgrFEvbDVunCbxJU_oddjs&libraries=places&language=it`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
    
    return () => {
      // Cleanup se necessario
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);
  
  const initializeAutocomplete = () => {
    if (inputRef.current && window.google) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['it', 'ch'] }, // Italia e Svizzera
        fields: ['address_components', 'formatted_address']
      });
      
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  };
  
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace() as GooglePlace;
      
      if (place && place.address_components) {
        console.log('Place selected:', place);
        
        // Estraggo le informazioni dall'indirizzo
        let street = '';
        let streetNumber = '';
        let postalCode = '';
        let city = '';
        let country = '';
        
        place.address_components.forEach(component => {
          const types = component.types;
          
          if (types.includes('route')) {
            street = component.long_name;
          }
          
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_3') && !city) {
            city = component.long_name;
          }
          
          if (types.includes('country')) {
            country = component.long_name;
          }
        });
        
        // Aggiorno il formData con i dati estratti
        setFormData(prev => ({
          ...prev,
          proprietario: {
            ...prev.proprietario,
            via: street,
            cap: postalCode,
            citta: city,
            paese: country
          }
        }));
        
        // Aggiorno il campo di visualizzazione con l'indirizzo completo
        setAddressInput(place.formatted_address);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('proprietario.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        proprietario: { ...prev.proprietario, [field]: value }
      }));
    } else if (name.startsWith('animale.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        animale: { ...prev.animale, [field]: value }
      }));
    }
  };
  
  const generateTag = async () => {
    if (!formData.proprietario.nome || !formData.proprietario.telefono || !formData.animale.nome) {
      setError('Compila almeno nome e telefono del proprietario e il nome dell\'animale');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Crea un URL con tutti i parametri
      const params = new URLSearchParams();
      
      // Aggiungi i dati del proprietario
      Object.entries(formData.proprietario).forEach(([key, value]) => {
        if (value) params.append(`p_${key}`, value);
      });
      
      // Aggiungi i dati dell'animale
      Object.entries(formData.animale).forEach(([key, value]) => {
        if (value) params.append(`a_${key}`, value);
      });
      
      // URL della pagina di visualizzazione
      const viewUrl = `${window.location.origin}/pet-view?${params.toString()}`;
      
      // Usa direttamente l'URL lungo (più sicuro!)
      setShortUrl(viewUrl);
      setShowResults(true);
      setLoading(false);
      
    } catch (error) {
      console.error('Errore:', error);
      setError('Si è verificato un errore durante la creazione del tag');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Tag NFC per il tuo Amico a 4 Zampe
          </h1>
          <p className="text-gray-400">Crea un tag identificativo per il collare del tuo animale</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow-xl mb-8 relative overflow-hidden">
          {/* Decorazione a tema cane */}
          <div className="absolute top-0 right-0 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 512 512">
              <path d="M496 96h-64l-7.16-14.31A32 32 0 0 0 396.22 64H342.6l-27.28-27.28C305.23 26.64 288 33.78 288 48.03v149.84l128 45.71V208h32c35.35 0 64-28.65 64-64v-32c0-8.84-7.16-16-16-16zm-112 48c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zM96 224c-17.64 0-32-14.36-32-32 0-17.67-14.33-32-32-32S0 174.33 0 192c0 41.66 26.83 76.85 64 90.1V496c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V384h160v112c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V277.55L266.05 224H96z"/>
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold mb-6 text-center text-blue-300">
            Informazioni del Proprietario
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-gray-300 mb-1">Nome *</label>
              <input
                type="text"
                name="proprietario.nome"
                value={formData.proprietario.nome}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Cognome *</label>
              <input
                type="text"
                name="proprietario.cognome"
                value={formData.proprietario.cognome}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Telefono *</label>
              <input
                type="tel"
                name="proprietario.telefono"
                value={formData.proprietario.telefono}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Indirizzo (cerca con Google Maps)</label>
              <input
                type="text"
                ref={inputRef}
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Inizia a digitare l'indirizzo..."
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Digita e seleziona un indirizzo per compilare automaticamente i campi sottostanti
              </p>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">CAP</label>
              <input
                type="text"
                name="proprietario.cap"
                value={formData.proprietario.cap}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Città</label>
              <input
                type="text"
                name="proprietario.citta"
                value={formData.proprietario.citta}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Paese</label>
              <input
                type="text"
                name="proprietario.paese"
                value={formData.proprietario.paese}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-6 text-center text-purple-300">
            Informazioni dell'Animale
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-gray-300 mb-1">Nome dell'Animale *</label>
              <input
                type="text"
                name="animale.nome"
                value={formData.animale.nome}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Tipo di Animale</label>
              <select
                name="animale.tipo"
                value={formData.animale.tipo}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="Cane">Cane</option>
                <option value="Gatto">Gatto</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Razza</label>
              <input
                type="text"
                name="animale.razza"
                value={formData.animale.razza}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Colore</label>
              <input
                type="text"
                name="animale.colore"
                value={formData.animale.colore}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Sesso</label>
              <select
                name="animale.sesso"
                value={formData.animale.sesso}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="">Seleziona</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 mb-4">
              {error}
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={generateTag}
              disabled={loading || !formData.proprietario.nome || !formData.proprietario.telefono || !formData.animale.nome}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md transition-colors hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generazione in corso...' : 'Genera Tag NFC'}
            </button>
          </div>
        </div>
        
        {showResults && (
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-center">Tag NFC Generato</h2>
            
            <div className="max-w-xl mx-auto">
              <h3 className="text-lg font-medium mb-3 text-gray-300">Link del Tag</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Link per accedere alle informazioni:</p>
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
                <p className="text-sm text-yellow-400 mt-2">
                  Nota: Questo è un URL diretto che funzionerà anche se il servizio di accorciamento link non è disponibile.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">Come usare questo tag:</h4>
                <ol className="list-decimal pl-5 text-gray-300 space-y-2">
                  <li>Procurati un tag NFC scrivibile compatibile con i collari per animali</li>
                  <li>Usa un'app per scrivere tag NFC sul tuo smartphone</li>
                  <li>Copia il link generato e scrivilo nel tag NFC</li>
                  <li>Applica il tag al collare del tuo animale</li>
                  <li>Chiunque trovi il tuo animale potrà leggere il tag con uno smartphone per visualizzare le informazioni di contatto</li>
                </ol>
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

export default NfcPetTag; 