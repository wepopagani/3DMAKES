import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LinkShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Usa direttamente l'URL del server in sviluppo
      const apiUrl = import.meta.env.DEV 
        ? 'https://short.3dmakes.ch/api/shorten'
        : '/api/shorten';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Aggiungi l'origin corretto
          'Origin': window.location.origin
        },
        // Aggiungi credentials se necessario
        credentials: 'include',
        body: JSON.stringify({ 
          originalUrl,
          // Aggiungi altri parametri se necessario
          source: 'web'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Errore del server: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setShortUrl(data.shortUrl);
        setShowResult(true);
      } else {
        setError(data.message || 'Errore durante l\'accorciamento');
      }
    } catch (err: any) {
      console.error('Errore:', err);
      setError(err.message || 'Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">LinkSh</h1>
          <p className="text-gray-400 mb-4">Accorcia i tuoi link in modo semplice e veloce</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Incolla qui il tuo URL lungo:</label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-l p-3 text-white"
                placeholder="https://esempio-molto-lungo.com/percorso"
              />
              <button
                onClick={handleShorten}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r"
              >
                {loading ? '...' : 'Accorcia'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 mb-4">
              {error}
            </div>
          )}
          
          {showResult && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-300">Il tuo URL accorciato:</h3>
              <div className="flex items-center bg-gray-700 p-2 rounded-lg">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="bg-transparent flex-grow p-2"
                />
                <button
                  onClick={copyToClipboard}
                  className={`${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md ml-2`}
                >
                  {copied ? 'Copiato!' : 'Copia'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/qrgen" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            Genera il QR
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkShortener;