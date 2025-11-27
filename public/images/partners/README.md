# Loghi Partner

## 📁 Questa cartella contiene i loghi delle aziende partner

### Come aggiungere un nuovo logo:

1. Salva il logo in questa cartella con un nome descrittivo
   - Esempio: `azienda-nome.png`

2. Formati consigliati:
   - PNG con sfondo trasparente
   - SVG (preferibile per qualità)
   - JPG (solo se necessario)

3. Dimensioni consigliate:
   - Larghezza: 200-400px
   - Altezza: 100-200px
   - Proporzioni: mantieni quelle originali del logo

4. Aggiungi il logo nel file: `src/components/PartnersLogos.tsx`

### Esempio di codice da aggiungere:

```typescript
{
  id: 1,
  name: "Nome Azienda",
  logo: "/images/partners/nome-file.png",
  website: "https://www.azienda.com",
},
```

---

**Nota**: Se il logo ha uno sfondo bianco, considera di usare un PNG con sfondo trasparente per un risultato migliore.



