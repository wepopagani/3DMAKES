# Setup Recensioni Google e Loghi Partner

## 📝 Componenti Creati

Sono stati creati due nuovi componenti per il tuo sito:

### 1. **GoogleReviewsCarousel** 
Un carousel con recensioni Google che scorre automaticamente ogni 5 secondi.

### 2. **PartnersLogos**
Un carousel con i loghi delle aziende partner che scorre automaticamente ogni 3 secondi.

---

## 🚀 Come Funzionano

I componenti sono già stati aggiunti alla pagina principale (`Index.tsx`) e appariranno in questa sequenza:
1. Hero
2. About Section
3. Services Section
4. Mission Section
5. Search Section
6. Blog Section
7. **→ Google Reviews Carousel** (NUOVO!)
8. **→ Partners Logos** (NUOVO!)
9. FAQ Section
10. Contact Form
11. Call to Action

---

## 📋 Come Personalizzare le Recensioni

### File: `src/components/GoogleReviewsCarousel.tsx`

Modifica l'array `reviews` con le tue recensioni reali di Google:

```typescript
const reviews: Review[] = [
  {
    id: 1,
    author: "Nome Cliente",
    rating: 5,
    text: "Testo della recensione...",
    date: "2 settimane fa",
  },
  // Aggiungi altre recensioni...
];
```

### Campi disponibili:
- **id**: Numero univoco
- **author**: Nome del cliente
- **rating**: Da 1 a 5 stelle
- **text**: Testo della recensione
- **date**: Data relativa (es: "2 settimane fa", "1 mese fa")

---

## 🏢 Come Aggiungere i Loghi Partner

### 1. Aggiungi le immagini dei loghi

Salva i loghi delle aziende partner nella cartella:
```
public/images/partners/
```

**Formati consigliati**: PNG o SVG con sfondo trasparente
**Nomi file esempio**: 
- `partner1.png`
- `partner2.png`
- `partner3.png`

### 2. Modifica il file PartnersLogos.tsx

File: `src/components/PartnersLogos.tsx`

Aggiorna l'array `partners` con i tuoi loghi:

```typescript
const partners: Partner[] = [
  {
    id: 1,
    name: "Nome Azienda",
    logo: "/images/partners/logo-azienda.png",
    website: "https://www.azienda.com", // Opzionale
  },
  // Aggiungi altri partner...
];
```

### Campi disponibili:
- **id**: Numero univoco
- **name**: Nome dell'azienda (usato come fallback se l'immagine non carica)
- **logo**: Percorso dell'immagine (relativo a `public/`)
- **website**: (Opzionale) Link al sito web - si apre al click sul logo

---

## 🎨 Personalizzazione Stile

### Colori e Spacing

Entrambi i componenti usano le classi Tailwind del tuo tema:
- `brand-blue`: Colore principale
- `brand-accent`: Colore di accento
- `brand-gray`: Grigio per testi secondari

### Modificare la velocità di scroll

**Recensioni Google** (GoogleReviewsCarousel.tsx):
```typescript
Autoplay({
  delay: 5000, // Cambia questo valore (in millisecondi)
  stopOnInteraction: true,
})
```

**Partner Logos** (PartnersLogos.tsx):
```typescript
Autoplay({
  delay: 3000, // Cambia questo valore (in millisecondi)
  stopOnInteraction: false,
})
```

### Modificare il numero di loghi visibili

Nel file `PartnersLogos.tsx`, modifica le classi del `CarouselItem`:

```tsx
<CarouselItem 
  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
>
```

Opzioni:
- `basis-1/2`: 2 loghi per riga (mobile)
- `basis-1/3`: 3 loghi per riga (tablet)
- `basis-1/4`: 4 loghi per riga (desktop)
- `basis-1/5`: 5 loghi per riga (desktop large)

---

## ✨ Funzionalità

### Google Reviews Carousel:
- ⏱️ Auto-scroll ogni 5 secondi
- ⏸️ Pausa quando l'utente interagisce
- 👆 Navigazione con frecce (desktop)
- 📱 Swipe su mobile
- 🎯 Indicatori di posizione
- ⭐ Rating con stelle visualizzato
- 🔗 Logo Google per autenticità

### Partners Logos:
- ⏱️ Auto-scroll ogni 3 secondi
- 🎨 Effetto grayscale → colore al hover
- 🔍 Zoom al hover
- 🔗 Click per aprire sito web partner
- 📱 Responsive su tutti i dispositivi
- 💫 Animazioni smooth

---

## 🧪 Test

Dopo aver aggiunto le tue recensioni e loghi:

1. Avvia il server di sviluppo:
```bash
npm run dev
```

2. Visita la homepage e scrolla fino a trovare le nuove sezioni

3. Verifica:
   - Le recensioni scorrono automaticamente
   - I loghi dei partner sono visibili
   - Il click sui loghi apre i siti web
   - Le animazioni funzionano su mobile e desktop

---

## 🐛 Risoluzione Problemi

### Le immagini dei loghi non si vedono?
- Verifica che i file siano nella cartella `public/images/partners/`
- Controlla che i percorsi nell'array `partners` siano corretti
- Assicurati che i nomi dei file corrispondano

### Il carousel non scorre?
- Verifica che `embla-carousel-autoplay` sia installato
- Controlla la console del browser per eventuali errori

### Voglio cambiare la posizione dei componenti?
Modifica il file `src/pages/Index.tsx` e sposta i componenti:
```tsx
<GoogleReviewsCarousel />
<PartnersLogos />
```

---

## 📞 Supporto

Per qualsiasi domanda o personalizzazione aggiuntiva, contattami!



