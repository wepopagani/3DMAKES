/**
 * Valori scritti inline nei componenti della homepage (non stanno nel locale):
 * devono restare identici a GoogleReviewsCarousel, PartnersLogos, Hero, Banner,
 * MissionSection, SearchSection e BlogPost.
 */

export interface PreviewReview {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export const PREVIEW_REVIEWS: PreviewReview[] = [
  {
    id: 1,
    author: "Titti Bl",
    rating: 5,
    text: "Incredibilmente disponibile e gentile. Ha risolto il mio problema con estrema competenza, ben oltre le mie aspettative. Lo consiglio a tutti. Grazie mille.",
    date: "5 ago 2024",
  },
  {
    id: 2,
    author: "Leonardo",
    rating: 5,
    text: "Un esperienza professionale meritevole di lode, il titolare è stato cortese e molto qualificato per svolgere il lavoro affidatogli !!",
    date: "26 lug 2024",
  },
  {
    id: 3,
    author: "Francesco Quattrucci",
    rating: 5,
    text: "Velocità e Qualità, Buonissimo il rapporto prezzo/materiale",
    date: "26 lug 2024",
  },
  {
    id: 4,
    author: "Nicholas Chiggiato",
    rating: 5,
    text: "Prodotti eccezionali, molto professionali e disponibili",
    date: "28 settimane fa",
  },
  {
    id: 5,
    author: "Elia Alacam",
    rating: 5,
    text: "Lavoro veloce ed efficace. Marco è stato in grado di capire esattamente la mia richiesta e senza troppe perdite di tempo ha eseguito un lavoro a dir poco perfetto. Consigliato!",
    date: "5 dic 2024",
  },
  {
    id: 6,
    author: "Lorenzo Rebuffo",
    rating: 5,
    text: "Lavoro veloce e di qualità. Molto disponibile e preparato. Consiglio vivamente",
    date: "33 settimane fa",
  },
  {
    id: 7,
    author: "turienzo gasser architectes",
    rating: 5,
    text: "Giovani, entusiasti e appassionati; ma soprattutto competenti ed efficaci. Ho chiesto loro una scansione di un oggetto piuttosto complicato ed il risultato è stato a dir poco entusiasmante. Prezzi onestissimi. Non posso che consigliarli. Sicuramente mi rivolgerò nuovamente a loro in caso di necessità!",
    date: "16 settimane fa",
  },
  {
    id: 8,
    author: "Francesca Bertagnoli",
    rating: 5,
    text: "Ho ordinato una stampa di un'arma per un cosplay e il risultato è stato eccellente! La qualità di stampa è davvero alta, con dettagli precisi. Inoltre i tempi di realizzazione e consegna sono stati rapidissimi, molto più veloci di quanto mi aspettassi. Servizio assolutamente consigliato!",
    date: "32 settimane fa",
  },
  {
    id: 9,
    author: "Andrea Portaro",
    rating: 5,
    text: "Fantastici, disposti ad ascoltarti e a capire esattamente le tue esigenze. Comunicazione veloce e precisa, non potevo chiedere di meglio.",
    date: "6 giorni fa",
  },
  {
    id: 10,
    author: "Ian",
    rating: 5,
    text: "Avevo bisogno di un pezzo di ricambio e sono stati molto efficienti nel risolvere il mio problema, sono dei ragazzi gentili e offrono un altissima qualità di stampa.",
    date: "24 settimane fa",
  },
  {
    id: 11,
    author: "Gabriele Rosa",
    rating: 5,
    text: "Un team super competente e professionale, che consiglio vivamente! Hanno capito subito quello di cui avevo bisogno e hanno realizzato il lavoro alla perfezione.",
    date: "5 giorni fa",
  },
  {
    id: 12,
    author: "AURORA CASARIN",
    rating: 5,
    text: "Super professionali e soprattutto tempi ottimi. Consigliatissimo per gli studenti di architettura!",
    date: "5 settimane fa",
  },
  {
    id: 13,
    author: "Maria Vittoria schultze",
    rating: 5,
    text: "Servizio davvero eccellente da 3DMakes a Lugano! Il ragazzo è stato super disponibile, professionale e rapidissimo, non avrei potuto chiedere di meglio.",
    date: "5 settimane fa",
  },
  {
    id: 14,
    author: "Tanya Malfanti",
    rating: 5,
    text: "Abbiamo avuto un'ottima esperienza con 3D Makes. Ci siamo rivolti a loro per un problema e sono stati rapidi ed efficienti nel trovare la soluzione migliore.",
    date: "7 settimane fa",
  },
];

export interface PreviewPartner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

export const PREVIEW_PARTNERS: PreviewPartner[] = [
  {
    id: 1,
    name: "TRC",
    logo: "/partner/trc.png",
    website: "https://www.trc2038.com/en-eu",
  },
  {
    id: 2,
    name: "Securitas",
    logo: "/partner/securitas.png",
    website: "https://www.securitas.ch/it/",
  },
  {
    id: 3,
    name: "Studio MN",
    logo: "/partner/studiomn.png",
    website: "https://studiomn.ch",
  },
  {
    id: 4,
    name: "USI",
    logo: "/partner/usi.png",
    website: "https://www.usi.ch/it",
  },
  {
    id: 5,
    name: "UAV",
    logo: "/partner/uav.png",
    website: "",
  },
  {
    id: 6,
    name: "Verzasca",
    logo: "/partner/verzasca.png",
    website: "",
  },
  {
    id: 7,
    name: "Caffematica",
    logo: "/partner/caffematica.png",
    website: "",
  },
  {
    id: 8,
    name: "Marino Bernasconi Engineering",
    logo: "/partner/marino-bernasconi.webp",
    website: "",
  },
  {
    id: 9,
    name: "North Star Group",
    logo: "/partner/north-star-group.png",
    website: "https://www.northstargroup.ch",
  },
];

/** Loghi disegnati in bianco su trasparente: su fondo chiaro sparirebbero. */
export const LIGHT_ARTWORK_LOGOS = new Set([
  "/partner/trc.png",
  "/partner/studiomn.png",
  "/partner/uav.png",
]);

export const PARTNERS_CLIENT_COUNT = 300;

export const BANNER_TEXT = "DOVE OGNI IDEA PRENDE FORMA";
export const BANNER_LINES = ["DOVE OGNI IDEA", "PRENDE FORMA"];

export const TONY_IMAGE = {
  src: "/TONY HD CON OMBRA copia.png",
  alt: "Mascotte Tony 3DMAKES — stampa 3D professionale Lugano e Ticino",
  width: 3000,
  height: 2884,
};

export const HERO_IMAGE = {
  src: "/images/brochure/workshop.jpg",
  alt: "Laboratorio 3DMAKES — progettazione, stampa 3D e produzione di componenti",
  width: 1435,
  height: 1023,
};

/** Foto generiche di laboratorio: nelle pagine restyling lasciano il posto a HeroPrint o a elementi grafici. */
export const DECORATIVE_PHOTOS = new Set([HERO_IMAGE.src, "/images/brochure/cover.jpg"]);

export const ABOUT_IMAGE = {
  src: "/ragazzi.png",
  alt: "Team 3DMAKES — laboratorio di progettazione e stampa 3D a Figino",
  width: 1024,
  height: 1536,
};

export const MISSION_IMAGE = {
  src: "/la nostra mission copia.png",
  alt: "Mission 3DMAKES — democratizzare la stampa 3D in Ticino e Lombardia",
  width: 834,
  height: 102,
};

export const BLOG_HEADER_IMAGE = {
  src: "/curioso.png",
  alt: "Blog stampa 3D 3DMAKES — guide, casi studio e novità da Lugano",
  width: 820,
  height: 146,
};

export interface HeroStat {
  end: number;
  suffix: string;
  labelKey?: string;
  label?: string;
}

export const HERO_STATS: HeroStat[] = [
  { end: 5, suffix: "+", labelKey: "hero.stats.experience" },
  { end: 500, suffix: "+", labelKey: "hero.stats.projects" },
  { end: 450, suffix: "", label: "Km di filamento impiegati" },
  { end: 100, suffix: "%", labelKey: "hero.stats.precision" },
  { end: 5000, suffix: "+", label: "Caffè consumati" },
];

export const MISSION_PILLARS = [
  {
    title: "INNOVAZIONE",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "CONOSCENZA",
    iconPath:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "SEMPLICITÀ",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
];

export const CLIENTS_ICON_PATH = MISSION_PILLARS[1].iconPath;

export const BLOG_READ_MORE = "Leggi articolo";

export const GRID_PATTERN =
  "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')";

export const GOOGLE_CSE_ID = "d6f5fdd7384fa4e0f";

export const GOOGLE_CSE_STYLES = `
      .gsc-control-cse {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      .gsc-search-button-v2 {
        background-color: #3B82F6 !important;
        border-color: #3B82F6 !important;
        padding: 12px 15px !important;
        border-radius: 4px !important;
        margin-left: 5px !important;
      }
      .gsc-search-button-v2:hover {
        background-color: #2563EB !important;
        border-color: #2563EB !important;
      }
      .gsc-input-box {
        border-radius: 12px !important;
        border: 1px solid #d0d5dd !important;
        height: auto !important;
        min-height: 48px !important;
        background-color: white !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      table.gsc-input {
        height: 48px !important;
        margin: 0 !important;
      }
      .gsc-input {
        padding-right: 12px !important;
        background: transparent !important;
        margin: 0 !important;
      }
      .gsib_a {
        padding: 0 12px !important;
        background-color: transparent !important;
      }
      .gsib_a input {
        color: #333 !important;
        font-size: 16px !important;
        background: transparent !important;
        height: 46px !important;
        margin: 0 !important;
      }
      .gsib_a input::placeholder {
        color: #666 !important;
      }
      table.gsc-search-box td {
        vertical-align: middle !important;
      }
      .gsc-results-wrapper-overlay {
        width: 80% !important;
        max-width: 800px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }
      .gsc-results {
        width: 100% !important;
      }
      /* Aggiungiamo un po' di padding attorno al box di ricerca */
      .gsc-search-box {
        margin-bottom: 0 !important;
      }
      /* Stile per il pulsante */
      .gsc-search-button-v2 svg {
        fill: white !important;
        width: 16px !important;
        height: 16px !important;
      }
    `;
