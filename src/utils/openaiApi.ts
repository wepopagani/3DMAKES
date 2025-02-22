import axios from "axios";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";

// Definizione del tipo di messaggio
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Accetta il contesto della chat e invia il messaggio a OpenAI
export async function sendMessageToOpenAI(messages: ChatMessage[], sectionContext: string, language: string) {
  // Definizione della lingua
  const languageContext = language === 'it'
    ? 'Rispondi sempre in italiano.'
    : 'Respond always in English.';

  // Definizione della personalità e istruzioni specifiche per il chatbot
  const botIdentity = `
    Sei un assistente virtuale esperto di stampa 3D chiamato 3DMAKES AI Assistant. 
    Il tuo ruolo è aiutare gli utenti con informazioni tecniche sulla stampa 3D, 
    materiali, costi, tempi di produzione e processi. Rispondi in modo professionale ma amichevole.
    
    Disponiamo delle seguenti stampanti 3D:
    - Creality K1: Stampante CoreXY ad alta velocità
    - Creality K1 Max: Stampante di grandi dimensioni
    - Bambu Lab AQ1: Stampante con capacità multicolore

    Le nostre capacità di stampa includono:
    - Stampa multicolore grazie alla Bambu Lab A1
    - Dimensione massima di stampa: 300mm x 300mm x 300mm
    - Alta velocità di stampa con le K1
    - Stampa di oggetti precisi con Elegoo Mars 5 Ultra, precisione fino a 0.01 mm
    
    Se ricevi domande non correlate alla stampa 3D, educatamente spiega che non puoi aiutare con quell'argomento.

    Se qualcuno chiede informazioni sulla posizione o dove si trova 3DMAKES, rispondi così:
    "Ci troviamo a Lugano, in via Pelli 14, proprio accanto alla Manor. 
    Davanti a Tally Weijl c'è un cortile: attraversalo tutto e in fondo sulla sinistra troverai lo studio di 3DMAKES."

    L'utente attualmente sta navigando nella sezione: ${sectionContext}.
  `;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `${languageContext} ${botIdentity}` },
          ...messages,
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Ritorna la risposta generata dal modello
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Errore nella richiesta OpenAI:', error);
    throw new Error('Errore durante la generazione della risposta dal chatbot.');
  }
}