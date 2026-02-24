# Passaporto Digitale per Animali - 3DMAKES

Sistema di passaporti digitali per animali domestici collegati a tag NFC.

## 📋 Panoramica

Ogni pagina rappresenta un "passaporto digitale" per un animale domestico che può essere collegato a un tag NFC. Quando qualcuno scansiona il tag, viene reindirizzato alla pagina con le informazioni dell'animale e del proprietario.

## 🎯 Caratteristiche

- **Design responsive**: ottimizzato per smartphone
- **Accessibilità**: leggibile anche per anziani
- **Azioni interattive**:
  - 📞 Chiamata diretta al proprietario
  - 📍 Apertura indirizzo su Google Maps
  - 💾 Download vCard con contatti
- **Brand consistency**: colori e stile 3DMAKES

## 📁 Struttura File

```
public/pets/
├── README.md                    # Questa documentazione
├── example.html                 # Esempio di pagina personalizzata
└── [numero_tag]/
    └── index.html               # Pagina specifica per animale
```

## 🔧 Come Personalizzare una Pagina

### 1. Copia il Template
Parti dal file `pet-passport-template.html` nella cartella `public/`

### 2. Modifica i Dati JSON
Trova la sezione `<script id="pet-data">` e aggiorna i parametri:

```json
{
    "animalName": "Nome dell'animale",
    "breed": "Razza",
    "ownerName": "Nome Proprietario",
    "phone": "+41791234567",
    "address": "Indirizzo completo",
    "petPhoto": "/path/to/photo.jpg",
    "vcardFilename": "nome_file.vcf"
}
```

### 3. Parametri Spiegati

| Parametro | Descrizione | Esempio |
|-----------|-------------|---------|
| `animalName` | Nome dell'animale (visualizzato grande) | "Buddy" |
| `breed` | Razza dell'animale | "Golden Retriever" |
| `ownerName` | Nome completo del proprietario | "Mario Rossi" |
| `phone` | Numero di telefono (formato internazionale) | "+41791234567" |
| `address` | Indirizzo completo per Maps | "Via Example 123, 6918 Figino, CH" |
| `petPhoto` | Percorso foto animale (opzionale) | "/images/pets/buddy.jpg" |
| `vcardFilename` | Nome file vCard generato | "buddy_contatto.vcf" |

### 4. Gestione Foto

**Con foto:**
```json
"petPhoto": "/images/pets/buddy.jpg"
```

**Senza foto (usa placeholder):**
```json
"petPhoto": ""
```

## 🌐 URL Structure

Le pagine seguono la struttura:
```
https://3dmakes.ch/pets/[NUMERO]
```

Dove `[NUMERO]` è l'ID univoco associato al tag NFC.

## 📱 Funzionalità

### Chiamata Telefonica
- Clic su "Chiama Proprietario" → apre app telefono
- Formato link: `tel:+41791234567`

### Google Maps
- Clic su "Apri Indirizzo" → apre Google Maps
- Cerca automaticamente l'indirizzo inserito

### Download vCard
- Clic su "Scarica Contatto" → genera e scarica file .vcf
- Compatibile con tutti i dispositivi
- Include nota con nome e razza animale

## 🎨 Personalizzazione Visiva

### Colori Brand
```css
--primary-color: hsl(216, 71%, 20%);    /* Blu scuro */
--accent-color: hsl(217, 90%, 62%);     /* Azzurro */
--background: hsl(210, 40%, 98%);       /* Bianco sporco */
```

### Logo
Il logo "3DM" viene mostrato in alto a sinistra. Per cambiare:
- Modifica la classe `.logo` nel CSS
- Oppure sostituisci con un'immagine

## 📝 Esempio Completo

Vedi `example.html` per un esempio completo con:
- Dati personalizzati per "Luna" (Border Collie)
- Proprietario: Elena Bianchi
- Foto placeholder
- Tutti i link funzionanti

## 🚀 Deploy

1. Crea una nuova cartella in `public/pets/[NUMERO]/`
2. Copia il template e personalizza i dati
3. Rinomina in `index.html`
4. Carica sul server
5. Associa l'URL al tag NFC

## 📞 Supporto

Per assistenza tecnica: [3dmakes.ch](https://3dmakes.ch)

---
*Sviluppato da 3DMAKES - Servizi di Stampa 3D Professionale* 