import fetch from 'node-fetch';

const API_URL = 'https://short.3dmakes.ch/api/shorten';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non permesso' })
    };
  }

  try {
    const { originalUrl } = JSON.parse(event.body);

    if (!originalUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL non fornito' })
      };
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          originalUrl,
          source: 'web'
        }),
        timeout: 8000 // 8 secondi di timeout
      });

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      };
    } catch (fetchError) {
      console.error('Errore di connessione:', fetchError);
      return {
        statusCode: 503,
        body: JSON.stringify({ 
          error: 'Servizio temporaneamente non disponibile',
          message: 'Impossibile contattare il servizio di shortening. Riprova più tardi.'
        })
      };
    }
  } catch (error) {
    console.error('Errore:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Errore interno del server',
        message: error.message 
      })
    };
  }
}; 