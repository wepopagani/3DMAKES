import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PetInfo {
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

const PetView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [petInfo, setPetInfo] = useState<PetInfo>({
    proprietario: {
      nome: '',
      cognome: '',
      telefono: '',
      via: '',
      cap: '',
      citta: '',
      paese: ''
    },
    animale: {
      nome: '',
      tipo: '',
      razza: '',
      sesso: '',
      colore: ''
    }
  });
  
  useEffect(() => {
    const newPetInfo: PetInfo = {
      proprietario: {
        nome: searchParams.get('p_nome') || '',
        cognome: searchParams.get('p_cognome') || '',
        telefono: searchParams.get('p_telefono') || '',
        via: searchParams.get('p_via') || '',
        cap: searchParams.get('p_cap') || '',
        citta: searchParams.get('p_citta') || '',
        paese: searchParams.get('p_paese') || 'Italia'
      },
      animale: {
        nome: searchParams.get('a_nome') || '',
        tipo: searchParams.get('a_tipo') || 'Cane',
        razza: searchParams.get('a_razza') || '',
        sesso: searchParams.get('a_sesso') || '',
        colore: searchParams.get('a_colore') || ''
      }
    };
    
    setPetInfo(newPetInfo);
  }, [searchParams]);
  
  const callOwner = () => {
    if (petInfo.proprietario.telefono) {
      window.location.href = `tel:${petInfo.proprietario.telefono}`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header a tema animale */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative">
            <div className="text-center relative z-10">
              <div className="inline-block bg-white p-3 rounded-full mb-2">
                <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M496 96h-64l-7.16-14.31A32 32 0 0 0 396.22 64H342.6l-27.28-27.28C305.23 26.64 288 33.78 288 48.03v149.84l128 45.71V208h32c35.35 0 64-28.65 64-64v-32c0-8.84-7.16-16-16-16zm-112 48c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zM96 224c-17.64 0-32-14.36-32-32 0-17.67-14.33-32-32-32S0 174.33 0 192c0 41.66 26.83 76.85 64 90.1V496c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V384h160v112c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V277.55L266.05 224H96z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Mi chiamo {petInfo.animale.nome}
              </h1>
              <p className="text-white text-opacity-80">
                {petInfo.animale.tipo} • {petInfo.animale.razza} • {petInfo.animale.colore}
                {petInfo.animale.sesso && ` • ${petInfo.animale.sesso === 'M' ? 'Maschio' : 'Femmina'}`}
              </p>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-0 bottom-0">
                <svg className="w-32 h-32" fill="white" viewBox="0 0 512 512">
                  <path d="M496 96h-64l-7.16-14.31A32 32 0 0 0 396.22 64H342.6l-27.28-27.28C305.23 26.64 288 33.78 288 48.03v149.84l128 45.71V208h32c35.35 0 64-28.65 64-64v-32c0-8.84-7.16-16-16-16zm-112 48c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zM96 224c-17.64 0-32-14.36-32-32 0-17.67-14.33-32-32-32S0 174.33 0 192c0 41.66 26.83 76.85 64 90.1V496c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V384h160v112c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V277.55L266.05 224H96z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Info proprietario */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Se mi hai trovato, contatta il mio proprietario:
              </h2>
              <div className="text-gray-700">
                <p className="font-medium">
                  {petInfo.proprietario.nome} {petInfo.proprietario.cognome}
                </p>
                
                {(petInfo.proprietario.via || petInfo.proprietario.citta) && (
                  <p className="mt-1">
                    {petInfo.proprietario.via && `${petInfo.proprietario.via}, `}
                    {petInfo.proprietario.cap && `${petInfo.proprietario.cap} `}
                    {petInfo.proprietario.citta && petInfo.proprietario.citta}
                  </p>
                )}
              </div>
            </div>
            
            {petInfo.proprietario.telefono && (
              <button
                onClick={callOwner}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Chiama {petInfo.proprietario.nome} ({petInfo.proprietario.telefono})
              </button>
            )}
            
            {petInfo.proprietario.telefono && (
              <a
                href={`sms:${petInfo.proprietario.telefono}?body=Salve, ho trovato il suo ${petInfo.animale.tipo.toLowerCase()} ${petInfo.animale.nome}!`}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Invia messaggio
              </a>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-xs">
            Questo tag NFC è stato generato su <a href="/" className="text-blue-500 hover:underline">3DMakes</a>
            <br />Aiuta qualcuno a ritrovare il suo amico peloso!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetView; 