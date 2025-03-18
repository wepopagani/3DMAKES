import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const ContactView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [contactData, setContactData] = useState<{
    nome: string;
    cognome: string;
    telefono: string;
    email: string;
    indirizzo: string;
    indirizzoDettagli: {
      via: string;
      numeroCivico: string;
      citta: string;
      cap: string;
      provincia: string;
      paese: string;
    };
    azienda: string;
    ruolo: string;
    sito: string;
  } | null>(null);
  
  const [vCardUrl, setVCardUrl] = useState('');
  
  useEffect(() => {
    // Estrai i parametri dall'URL
    const nome = searchParams.get('nome') || '';
    const cognome = searchParams.get('cognome') || '';
    const telefono = searchParams.get('tel') || '';
    const email = searchParams.get('email') || '';
    const indirizzo = searchParams.get('adr') || '';
    
    // Estrai i componenti individuali dell'indirizzo
    const via = searchParams.get('via') || '';
    const numeroCivico = searchParams.get('civico') || '';
    const citta = searchParams.get('citta') || '';
    const cap = searchParams.get('cap') || '';
    const provincia = searchParams.get('provincia') || '';
    const paese = searchParams.get('paese') || 'Italia';
    
    const azienda = searchParams.get('org') || '';
    const ruolo = searchParams.get('title') || '';
    const sito = searchParams.get('url') || '';
    
    if (nome || cognome) {
      setContactData({
        nome,
        cognome,
        telefono,
        email,
        indirizzo,
        indirizzoDettagli: {
          via,
          numeroCivico,
          citta,
          cap,
          provincia,
          paese
        },
        azienda,
        ruolo,
        sito
      });
      
      // Genera l'URL della vCard
      generateVCardUrl({
        nome,
        cognome,
        telefono,
        email,
        indirizzo,
        azienda,
        ruolo,
        sito
      });
    }
  }, [searchParams]);
  
  const generateVCardUrl = (data: any) => {
    // Crea il contenuto vCard in formato standard
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${data.cognome};${data.nome};;;
FN:${data.nome} ${data.cognome}
${data.azienda ? `ORG:${data.azienda}\n` : ''}
${data.ruolo ? `TITLE:${data.ruolo}\n` : ''}
${data.telefono ? `TEL;TYPE=CELL:${data.telefono}\n` : ''}
${data.email ? `EMAIL:${data.email}\n` : ''}
${data.indirizzo ? `ADR:;;${data.indirizzo};;;;\n` : ''}
${data.sito ? `URL:${data.sito}\n` : ''}
END:VCARD`;
    
    // Codifica il contenuto come data URL
    const encodedVCard = encodeURIComponent(vCardContent);
    const vCardDataUrl = `data:text/vcard;charset=utf-8;content-disposition=attachment;filename=${data.nome}_${data.cognome}.vcf,${encodedVCard}`;
    
    setVCardUrl(vCardDataUrl);
  };
  
  if (!contactData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento contatto...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header con nome (senza foto profilo) */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{contactData.nome} {contactData.cognome}</h1>
          {contactData.ruolo && contactData.azienda && (
            <p className="text-lg text-gray-600 mt-1">{contactData.ruolo}, {contactData.azienda}</p>
          )}
          {contactData.ruolo && !contactData.azienda && (
            <p className="text-lg text-gray-600 mt-1">{contactData.ruolo}</p>
          )}
          {!contactData.ruolo && contactData.azienda && (
            <p className="text-lg text-gray-600 mt-1">{contactData.azienda}</p>
          )}
        </div>
        
        {/* Dettagli contatto */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {contactData.telefono && (
            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefono</p>
                <a href={`tel:${contactData.telefono}`} className="text-lg font-medium text-gray-800">{contactData.telefono}</a>
              </div>
            </div>
          )}
          
          {contactData.email && (
            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${contactData.email}`} className="text-lg font-medium text-gray-800">{contactData.email}</a>
              </div>
            </div>
          )}
          
          {(contactData.indirizzo || contactData.indirizzoDettagli.via) && (
            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Indirizzo</p>
                
                {/* Visualizzazione dettagliata dell'indirizzo */}
                <div>
                  {contactData.indirizzoDettagli.via && (
                    <p className="text-lg font-medium text-gray-800">
                      {contactData.indirizzoDettagli.via} {contactData.indirizzoDettagli.numeroCivico}
                    </p>
                  )}
                  
                  {(contactData.indirizzoDettagli.cap || contactData.indirizzoDettagli.citta || contactData.indirizzoDettagli.provincia) && (
                    <p className="text-lg font-medium text-gray-800">
                      {contactData.indirizzoDettagli.cap && `${contactData.indirizzoDettagli.cap} `}
                      {contactData.indirizzoDettagli.citta && `${contactData.indirizzoDettagli.citta} `}
                      {contactData.indirizzoDettagli.provincia && `(${contactData.indirizzoDettagli.provincia})`}
                    </p>
                  )}
                  
                  {contactData.indirizzoDettagli.paese && contactData.indirizzoDettagli.paese !== "Italia" && (
                    <p className="text-lg font-medium text-gray-800">
                      {contactData.indirizzoDettagli.paese}
                    </p>
                  )}
                  
                  {/* Se non ci sono dettagli, mostra l'indirizzo completo */}
                  {!contactData.indirizzoDettagli.via && contactData.indirizzo && (
                    <p className="text-lg font-medium text-gray-800">{contactData.indirizzo}</p>
                  )}
                </div>
                
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactData.indirizzo || formatIndirizzoPerMappa())}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 mt-1 block hover:underline"
                >
                  Apri in Google Maps
                </a>
              </div>
            </div>
          )}
          
          {contactData.sito && (
            <div className="flex items-center py-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sito Web</p>
                <a href={contactData.sito.startsWith('http') ? contactData.sito : `https://${contactData.sito}`} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-800">{contactData.sito}</a>
              </div>
            </div>
          )}
        </div>
        
        {/* Pulsante per aggiungere contatto */}
        <div className="text-center">
          <a 
            href={vCardUrl}
            download={`${contactData.nome}_${contactData.cognome}.vcf`}
            className="inline-block w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Aggiungi ai contatti
          </a>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Creato con <a href="/" className="text-red-600 hover:underline">3D Makes</a>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Funzione per formattare l'indirizzo per Google Maps
  function formatIndirizzoPerMappa() {
    if (!contactData) return '';
    
    const { via, numeroCivico, citta, cap, provincia, paese } = contactData.indirizzoDettagli;
    const componenti = [];
    
    if (via) {
      componenti.push(`${via}${numeroCivico ? ' ' + numeroCivico : ''}`);
    }
    
    if (citta) componenti.push(citta);
    if (cap) componenti.push(cap);
    if (provincia) componenti.push(provincia);
    if (paese) componenti.push(paese);
    
    return componenti.join(", ");
  }
};

export default ContactView; 