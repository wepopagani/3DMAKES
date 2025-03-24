import nodemailer from 'nodemailer';

export const handler = async (event) => {
  // Verifica che la richiesta sia POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Metodo non consentito' }),
    };
  }

  try {
    // Configurazione del trasportatore email
    const trasportatore = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || "info@3dmakes.ch", 
        pass: process.env.SMTP_PASSWORD || "ewuj ewur ggva ddho",
      },
    });
    
    // Ottieni i dati dall'ordine
    const body = JSON.parse(event.body);
    const { 
      prodottoId, 
      titoloProdotto, 
      colore, 
      nomeColore,
      nome,
      timestamp
    } = body;
    
    // Invia l'email
    const infoEmail = await trasportatore.sendMail({
      from: `"Store Ciotole" <${process.env.SMTP_USER || "info@3dmakes.ch"}>`,
      to: "marco@3dmakes.ch",
      subject: `Nuovo ordine: ${titoloProdotto}`,
      text: `Nuovo ordine personalizzato:
            Prodotto ID: ${prodottoId}
            Prodotto: ${titoloProdotto}
            Colore: ${nomeColore} (${colore})
            Nome personalizzato: ${nome}
            Data: ${new Date(timestamp).toLocaleString('it-IT')}`,
      html: `
        <h2>Nuovo ordine personalizzato</h2>
        <p><strong>Prodotto ID:</strong> ${prodottoId}</p>
        <p><strong>Prodotto:</strong> ${titoloProdotto}</p>
        <p><strong>Colore:</strong> ${nomeColore} (${colore})</p>
        <p><strong>Nome personalizzato:</strong> ${nome}</p>
        <p><strong>Data:</strong> ${new Date(timestamp).toLocaleString('it-IT')}</p>
      `,
    });
    
    console.log('Email inviata:', infoEmail.messageId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email inviata con successo',
        messageId: infoEmail.messageId
      }),
    };
  } catch (error) {
    console.error('Errore durante invio email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: "Errore nell'invio dell'email", 
        error: error.message 
      }),
    };
  }
};