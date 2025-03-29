const fetch = require('node-fetch');

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

    const response = await fetch('https://short.3dmakes.ch/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        originalUrl,
        source: 'web'
      })
    });

    const data = await response.text(); // Cambiato da response.json() a response.text()
    
    try {
      const jsonData = JSON.parse(data);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(jsonData)
      };
    } catch (e) {
      console.error('Risposta non valida dal server:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Errore nella risposta del server',
          details: data.substring(0, 200) // Per debug
        })
      };
    }
  } catch (error) {
    console.error('Errore:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server' })
    };
  }
}; 