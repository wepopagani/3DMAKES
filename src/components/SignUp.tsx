import React, { useState, useEffect, useRef } from 'react';
import { useAuth, UserData } from '../firebase/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
  };
}

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [citta, setCitta] = useState('');
  const [cap, setCap] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Nuovi stati per l'autocompletamento dell'indirizzo
  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { signUp, logInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Effetto per il debounce della ricerca indirizzi
  useEffect(() => {
    if (addressSearch.length < 3) {
      setAddressResults([]);
      setShowResults(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchAddresses(addressSearch);
    }, 500); // Attende 500ms dopo l'ultima digitazione

    // Sincronizza il valore di addressSearch con indirizzo
    setIndirizzo(addressSearch);

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
        setShowResults(false);
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
      setShowResults(true);
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
    let fullAddress = '';
    if (address.road) {
      fullAddress = address.road;
      if (address.house_number) {
        fullAddress += ' ' + address.house_number;
      }
    } else {
      // Se non c'è una strada specifica, usa il nome completo
      fullAddress = result.display_name.split(',')[0];
    }
    
    // Imposta i valori nei campi del form
    setIndirizzo(fullAddress);
    
    // Imposta la città usando town/city/village (a seconda di quale è disponibile)
    const cityValue = address.city || address.town || address.village || '';
    setCitta(cityValue);
    
    // Imposta il CAP
    setCap(address.postcode || '');
    
    // Chiudi il dropdown dei risultati
    setShowResults(false);
    setAddressSearch(fullAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Le password non corrispondono');
    }
    
    if (!nome || !cognome || !telefono || !indirizzo || !citta || !cap) {
      return setError('Tutti i campi sono obbligatori');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const userData: UserData = {
        nome,
        cognome,
        telefono,
        indirizzo,
        citta,
        cap,
        email
      };
      
      await signUp(email, password, userData);
      navigate('/user-panel');
    } catch (error: any) {
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Questo indirizzo email è già in uso');
      } else if (error.code === 'auth/weak-password') {
        setError('La password è troppo debole. Usa almeno 6 caratteri');
      } else {
        setError('Errore durante la registrazione: ' + (error.message || 'Si è verificato un errore'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await logInWithGoogle();
      navigate('/user-panel');
    } catch (error: any) {
      setError('Errore durante l\'accesso con Google: ' + (error.message || 'Si è verificato un errore'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-5">
          <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            3DMAKES
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Crea un nuovo account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <div className="flex-1">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <div className="mt-1">
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="cognome" className="block text-sm font-medium text-gray-300">
                  Cognome
                </label>
                <div className="mt-1">
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-300">
                Numero di telefono
              </label>
              <div className="mt-1">
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="address-search" className="block text-sm font-medium text-gray-300">
                Indirizzo
              </label>
              <div className="mt-1 relative">
                <input
                  id="address-search"
                  name="address-search"
                  type="text"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  placeholder="Inizia a digitare per cercare..."
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  required
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Risultati della ricerca */}
              {showResults && addressResults.length > 0 && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="citta" className="block text-sm font-medium text-gray-300">
                  Città
                </label>
                <div className="mt-1">
                  <input
                    id="citta"
                    name="citta"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={citta}
                    onChange={(e) => setCitta(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cap" className="block text-sm font-medium text-gray-300">
                  CAP
                </label>
                <div className="mt-1">
                  <input
                    id="cap"
                    name="cap"
                    type="text"
                    autoComplete="postal-code"
                    required
                    value={cap}
                    onChange={(e) => setCap(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <div className="flex-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                  Conferma Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <button
                  type="button"
                  onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                  className="text-sm text-red-500 hover:text-red-400 flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                  Perché chiediamo questi dati?
                </button>
              </div>
            </div>

            {showPrivacyInfo && (
              <div className="p-4 bg-gray-700 rounded-md text-sm text-gray-300">
                <p className="mb-2">
                  <strong>Perché raccogliamo i tuoi dati?</strong>
                </p>
                <p className="mb-2">
                  Raccogliamo queste informazioni per:
                </p>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>Gestire il tuo account personale e permetterti di accedere ai tuoi file da qualsiasi dispositivo</li>
                  <li>Fornirti assistenza tecnica personalizzata per i tuoi progetti 3D</li>
                  <li>Contattarti in caso di aggiornamenti importanti ai tuoi file o al nostro servizio</li>
                  <li>Permetterti di ricevere i prodotti fisici all'indirizzo specificato, quando richiesto</li>
                </ul>
                <p>
                  I tuoi dati sono protetti e non verranno mai condivisi con terze parti senza il tuo consenso. Puoi modificare o eliminare le tue informazioni in qualsiasi momento dalle impostazioni del tuo account.
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Caricamento...' : 'Registrati'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  o
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {googleLoading ? 'Caricamento...' : 'Continua con Google'}
              </button>

              <div className="flex items-center justify-center mt-6">
                <div className="text-sm">
                  Hai già un account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-red-500 hover:text-red-400"
                  >
                    Accedi
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="text-sm">
                  <Link
                    to="/"
                    className="font-medium text-gray-400 hover:text-white"
                  >
                    Torna alla home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 