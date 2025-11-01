# 🔧 Configurazione SumUp per Pagamenti

## 📋 Prerequisiti

1. **Account SumUp Business**
   - Registrati su: https://sumup.com/
   - Tipo: Account Business/Merchant
   
2. **Developer Account**
   - Vai su: https://developer.sumup.com/
   - Crea un'applicazione
   - Ottieni le credenziali

## 🔑 Variabili d'Ambiente

Crea/modifica il file `.env` nella root del progetto e aggiungi:

```env
# SumUp Configuration
VITE_SUMUP_APP_ID=your_sumup_app_id_here
VITE_SUMUP_API_KEY=your_sumup_api_key_here
VITE_SUMUP_MERCHANT_CODE=your_merchant_code_here
VITE_SUMUP_ENVIRONMENT=sandbox
```

### Dove trovare le credenziali:

1. **App ID**: Dashboard Developer → La tua App → App Credentials
2. **API Key**: Dashboard Developer → La tua App → API Keys
3. **Merchant Code**: Dashboard SumUp → Impostazioni → Merchant Profile

### Ambienti:

- `sandbox` - Per test (usa carte di credito test)
- `production` - Per pagamenti reali

## 🧪 Modalità Test

Se le variabili SumUp NON sono configurate, il sistema funziona in **modalità test**:
- Simula i pagamenti
- Non richiede credenziali reali
- Perfetto per sviluppo e testing

## 🚀 Attivazione

1. Configura le variabili d'ambiente
2. Riavvia il server dev (`npm run dev`)
3. Il sistema rileverà automaticamente SumUp
4. I pagamenti verranno processati tramite SumUp

## 💳 Carte di Test (Sandbox)

Quando usi `VITE_SUMUP_ENVIRONMENT=sandbox`:

- **Successo**: 4242 4242 4242 4242
- **Fallimento**: 4000 0000 0000 0002
- CVV: Qualsiasi 3 cifre
- Data: Qualsiasi data futura

## 📚 Documentazione SumUp

- API Docs: https://developer.sumup.com/docs/
- Dashboard: https://me.sumup.com/
- Support: https://sumup.com/help/

## ⚠️ Note Importanti

- I pagamenti reali richiedono account verificato
- Le commissioni SumUp si applicano (circa 1.95% + CHF 0.25)
- Tempo di accredito: 2-3 giorni lavorativi
- Verifiche di sicurezza potrebbero richiedere documenti aziendali

