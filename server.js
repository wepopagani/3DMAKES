const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurazione del trasportatore email
const trasportatore = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@3dmakes.ch", 
    pass: "ewuj ewur ggva ddho", 
  },
});

// Endpoint per l'invio dell'email
app.post('/api/invia-ordine', async (req, res) => {
  const { 
    prodottoId, 
    titoloProdotto, 
    colore, 
    nomeColore,
    nome 
  } = req.body;
  
  try {
    // Invia l'email
    await trasportatore.sendMail({
      from: '"Store Ciotole" <info@3dmakes.ch>',
      to: "marco@3dmakes.ch", // aggiornato con il tuo indirizzo email
      subject: `Nuovo ordine: ${titoloProdotto}`,
      text: `Nuovo ordine personalizzato:
            Prodotto ID: ${prodottoId}
            Prodotto: ${titoloProdotto}
            Colore: ${nomeColore} (${colore})
            Nome personalizzato: ${nome}
            Data: ${new Date().toLocaleString('it-IT')}`,
      html: `
        <h2>Nuovo ordine personalizzato</h2>
        <p><strong>Prodotto ID:</strong> ${prodottoId}</p>
        <p><strong>Prodotto:</strong> ${titoloProdotto}</p>
        <p><strong>Colore:</strong> ${nomeColore} (${colore})</p>
        <p><strong>Nome personalizzato:</strong> ${nome}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
      `,
    });
    
    res.status(200).json({ success: true, message: "Email inviata con successo" });
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    res.status(500).json({ success: false, message: "Errore nell'invio dell'email", error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
}); 