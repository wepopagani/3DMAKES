import axios from 'axios';

// Funzione per inviare un prompt all'API di OpenAI
export async function getAIResponse(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo', // Puoi usare anche 'gpt-4' se disponibile
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150, // Numero massimo di token nella risposta
        temperature: 0.7, // Creatività della risposta
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Restituisce il contenuto generato dall'AI
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Errore nella richiesta OpenAI:', error);
    return 'Mi dispiace, si è verificato un errore durante la generazione della risposta.';
  }
}