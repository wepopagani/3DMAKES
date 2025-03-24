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
      cliente,
      timestamp
    } = body;
    
    // Invia l'email
    const infoEmail = await trasportatore.sendMail({
      from: `"Store Ciotole" <${process.env.SMTP_USER || "info@3dmakes.ch"}>`,
      to: "wepo.pagani10@gmail.com",
      subject: `Nuovo ordine: ${titoloProdotto}`,
      text: `Nuovo ordine personalizzato:
            Prodotto ID: ${prodottoId}
            Prodotto: ${titoloProdotto}
            Colore: ${nomeColore} (${colore})
            Nome personalizzato: ${nome}
            
            Dati cliente:
            Nome: ${cliente.nome} ${cliente.cognome}
            Telefono: ${cliente.telefono}
            
            Data: ${new Date(timestamp).toLocaleString('it-IT')}`,
      html: `
        <h2>Nuovo ordine personalizzato</h2>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2; border: 1px solid #ddd;">Dettaglio</th>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2; border: 1px solid #ddd;">Valore</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Prodotto</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${titoloProdotto} (ID: ${prodottoId})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Colore</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${nomeColore} (${colore})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Nome personalizzato</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${nome}</td>
          </tr>
        </table>
        
        <h3>Dati cliente</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2; border: 1px solid #ddd;">Dettaglio</th>
            <th style="text-align: left; padding: 8px; background-color: #f2f2f2; border: 1px solid #ddd;">Valore</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Nome e cognome</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${cliente.nome} ${cliente.cognome}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Telefono (WhatsApp)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${cliente.telefono}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Data ordine</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(timestamp).toLocaleString('it-IT')}</td>
          </tr>
        </table>
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