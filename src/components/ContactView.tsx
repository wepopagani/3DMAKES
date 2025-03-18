import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Traduzioni per multilingua
const traduzioni = {
  it: {
    telefono: "Telefono",
    email: "Email",
    indirizzo: "Indirizzo",
    apriGoogleMaps: "Apri in Google Maps",
    sitoWeb: "Sito Web",
    social: "Social",
    aggiungiContatti: "Aggiungi ai contatti",
    creatocon: "Creato con"
  },
  en: {
    telefono: "Phone",
    email: "Email",
    indirizzo: "Address",
    apriGoogleMaps: "Open in Google Maps",
    sitoWeb: "Website",
    social: "Social Media",
    aggiungiContatti: "Add to contacts",
    creatocon: "Created with"
  },
  fr: {
    telefono: "Téléphone",
    email: "Email",
    indirizzo: "Adresse",
    apriGoogleMaps: "Ouvrir dans Google Maps",
    sitoWeb: "Site Web",
    social: "Réseaux sociaux",
    aggiungiContatti: "Ajouter aux contacts",
    creatocon: "Créé avec"
  },
  de: {
    telefono: "Telefon",
    email: "E-Mail",
    indirizzo: "Adresse",
    apriGoogleMaps: "In Google Maps öffnen",
    sitoWeb: "Webseite",
    social: "Soziale Medien",
    aggiungiContatti: "Zu Kontakten hinzufügen",
    creatocon: "Erstellt mit"
  },
  es: {
    telefono: "Teléfono",
    email: "Correo electrónico",
    indirizzo: "Dirección",
    apriGoogleMaps: "Abrir en Google Maps",
    sitoWeb: "Sitio web",
    social: "Redes sociales",
    aggiungiContatti: "Añadir a contactos",
    creatocon: "Creado con"
  }
};

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
    social: {
      linkedin: string;
      facebook: string;
      instagram: string;
      x: string;
    }
  } | null>(null);
  
  const [vCardUrl, setVCardUrl] = useState('');
  const [lingua, setLingua] = useState('it');
  
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
    
    // Estrai la lingua preferita
    const linguaParam = searchParams.get('lingua') || 'it';
    setLingua(linguaParam);
    
    // Estrai i profili social
    const linkedin = searchParams.get('linkedin') || '';
    const facebook = searchParams.get('facebook') || '';
    const instagram = searchParams.get('instagram') || '';
    const x = searchParams.get('x') || '';
    
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
        sito,
        social: {
          linkedin,
          facebook,
          instagram,
          x
        }
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
  
  // Ottieni le traduzioni in base alla lingua
  const t = traduzioni[lingua as keyof typeof traduzioni] || traduzioni.it;
  
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
                <p className="text-sm text-gray-500">{t.telefono}</p>
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
                <p className="text-sm text-gray-500">{t.email}</p>
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
                <p className="text-sm text-gray-500">{t.indirizzo}</p>
                
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
                  
                  {contactData.indirizzoDettagli.paese && (
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
                  {t.apriGoogleMaps}
                </a>
              </div>
            </div>
          )}
          
          {contactData.sito && (
            <div className="flex items-center py-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.sitoWeb}</p>
                <a href={contactData.sito.startsWith('http') ? contactData.sito : `https://${contactData.sito}`} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-800">{contactData.sito}</a>
              </div>
            </div>
          )}
          
          {/* Profili social */}
          {(contactData.social.linkedin || contactData.social.facebook || 
            contactData.social.instagram || contactData.social.x) && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3 text-gray-700">{t.social}</h3>
              <div className="flex flex-wrap gap-3">
                {contactData.social.linkedin && (
                  <a 
                    href={contactData.social.linkedin} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}
                
                {contactData.social.facebook && (
                  <a 
                    href={contactData.social.facebook} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </a>
                )}
                
                {contactData.social.instagram && (
                  <a 
                    href={contactData.social.instagram} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                  </a>
                )}
                
                {contactData.social.x && (
                  <a 
                    href={contactData.social.x} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="X"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
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
            {t.aggiungiContatti}
          </a>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            {t.creatocon} <a href="/" className="text-red-600 hover:underline">3D Makes</a>
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