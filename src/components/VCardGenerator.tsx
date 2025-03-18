import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';

const VCardGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    indirizzo: '',
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateVCard = () => {
    // Crea il contenuto vCard in formato standard
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${formData.cognome};${formData.nome};;;
FN:${formData.nome} ${formData.cognome}
${formData.azienda ? `ORG:${formData.azienda}\n` : ''}
${formData.ruolo ? `TITLE:${formData.ruolo}\n` : ''}
${formData.telefono ? `TEL;TYPE=CELL:${formData.telefono}\n` : ''}
${formData.email ? `EMAIL:${formData.email}\n` : ''}
${formData.indirizzo ? `ADR:;;${formData.indirizzo};;;;\n` : ''}
${formData.sito ? `URL:${formData.sito}\n` : ''}
END:VCARD`;
    
    // Codifica il contenuto come data URL con il Content-Disposition corretto
    // Questo aiuta iOS a riconoscere il file come vCard scaricabile
    const encodedVCard = encodeURIComponent(vCardContent);
    const vCardDataUrl = `data:text/vcard;charset=utf-8;content-disposition=attachment;filename=${formData.nome}_${formData.cognome}.vcf,${encodedVCard}`;
    
    setVCardUrl(vCardDataUrl);
    setShowResults(true);
    
    // Accorcia l'URL e genera il QR
    shortenVCardUrl(vCardDataUrl);
  };
  
  const shortenVCardUrl = async (url: string) => {
    setLoading(true);
    
    try {
      // Nota: stiamo accorciando l'URL della vCard direttamente
      const response = await fetch('https://server.3dmakes.ch:3000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShortUrl(data.shortUrl);
        
        // Qui generiamo un QR code diretto all'URL della vCard
        // senza passare dalla pagina HTML intermedia
        try {
          const imageData = await QRCode.toDataURL(url); // Punta direttamente alla vCard
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
              <input
                type="text"
                name="indirizzo"
                value={formData.indirizzo}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
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
