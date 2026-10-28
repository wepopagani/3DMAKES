/**
 * Valori scritti inline nei componenti della homepage (non stanno nel locale):
 * GoogleReviewsCarousel legge PREVIEW_REVIEWS da qui. Partner, Hero, Banner,
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

/** Testi scritti su Google, dal più recente (28 ott 2026). Le sole stelle restano nel conteggio, senza una frase inventata. */
export const PREVIEW_REVIEWS: PreviewReview[] = [
  {
    id: 1,
    author: "Leonardo Strignano",
    rating: 5,
    text: "Tip Top, rapido e professionali",
    date: "3 settimane fa",
  },
  {
    id: 2,
    author: "Andrea Francese",
    rating: 5,
    text: "Mi hanno seguito per l’incisione del mio logo su una serie limitata di coltelli e hanno fatto un lavoro impeccabile, con grande cura dei dettagli e un risultato finale molto elegante. Si sono dimostrati disponibili, competenti e rapidi nel rispondere, dando l’impressione di un’azienda che sa davvero ascoltare il cliente. Li consiglio senza esitazione a chi cerca qualità e serietà per progetti di personalizzazione.",
    date: "1 mese fa",
  },
  {
    id: 3,
    author: "Francesco Culici",
    rating: 5,
    text: "Avevo bisogno di realizzare un timbro, con la grafica ancora da definire, in ottone e fresato a CNC. I ragazzi sono stati simpatici e disponibili e il risultato è stato perfetto, in ottimi tempi ed esattamente cio che mi serviva.",
    date: "1 mese fa",
  },
  {
    id: 4,
    author: "Katya Vettorello",
    rating: 5,
    text: "Gentilezza, disponibilità, simpatia e professionalità da manuale. Prodotto PERFETTO. Esperienza complessiva di incredibile qualità. Consigliatissimo!",
    date: "1 mese fa",
  },
  {
    id: 5,
    author: "Amelia Curti",
    rating: 5,
    text: "Esperienza davvero super positiva con Marco e Matteo di 3DMakes! Gentilissimi, disponibili e simpatici fin dal primo contatto, mi hanno aiutata con grande professionalità realizzando in tempi brevissimi delle bellissime statuine 3D in resina, curate nei dettagli e di ottima qualità. Sono stati sempre disponibili a rispondere alle mie richieste e a trovare rapidamente le soluzioni migliori, venendomi incontro anche con tempistiche molto strette. Li ringrazio davvero per la disponibilità, la gentilezza e l’ottimo lavoro. Assolutamente consigliati!",
    date: "1 mese fa",
  },
  {
    id: 6,
    author: "alex moghini",
    rating: 5,
    text: "Esperienza davvero molto positiva! Il team di 3D Makes è stato estremamente competente, gentile e disponibile. Hanno saputo soddisfare al meglio la mia richiesta personalizzata, dimostrando grande professionalità e attenzione ai dettagli. Mi sono sentito seguito dall’inizio alla fine e il risultato ha superato le mie aspettative. Li consiglio vivamente a chi cerca qualità e affidabilità. Sicuramente mi rivolgerò di nuovo a loro per altri progetti in futuro!👌🏽",
    date: "3 mesi fa",
  },
  {
    id: 7,
    author: "Davide D'Angelo",
    rating: 5,
    text: "Ho avuto il piacere di sottoporre un progettino che avevo in mente da tanto tempo e sono rimasto sorpreso dalla velocità con cui 3DMakes ha saputo materializzarlo in pochissimo tempo e con la giusta precisione. Ho apprezzato tantissimo l'estrema disponibilità, genitlezza e simpatia di chi mi ha supportato. La comunicazione è stata sempre veloce e puntuale. Un grazie speciale a Marco che mi ha seguito in ogni fase: dalla raccolta dei requisiti alla modellazione 3D, dalla verifica della prima bozza (che era già praticamente perfetta) fino alla stampa finale. Non ho molti progetti in testa, ma di sicuro, quando me ne verrà un altro in mente, so a chi potrò rivolgermi.",
    date: "4 mesi fa",
  },
  {
    id: 8,
    author: "Anand Rochira Saglini",
    rating: 5,
    text: "Ho avuto modo di utilizzare il servizio di 3DMakes e sono soddisfatta. I titolari sono persone disponibili e molto gentili e ho potuto usufruire di un trattamento top. Grazie. 😁",
    date: "5 mesi fa",
  },
  {
    id: 9,
    author: "Ramona Coscia",
    rating: 5,
    text: "Esperienza assolutamente perfetta. Marco è stato molto disponibile ed ha capito esattamente cosa avessi bisogno. Ha fatto tutte le modifiche richieste, fino al risultato perfetto 🔝 Azienda consigliatissima!!!",
    date: "5 mesi fa",
  },
  {
    id: 10,
    author: "Ian Tortora",
    rating: 5,
    text: "Super efficienti e tempestivi, sono molto soddisfatto",
    date: "5 mesi fa",
  },
  {
    id: 11,
    author: "Gaja",
    rating: 5,
    text: "Ho avuto un’ottima esperienza con 3D Makes. I ragazzi si distinguono davvero per serietà e impegno: si percepisce chiaramente la passione che mettono in quello che fanno e l’attenzione verso il cliente. Un altro grande punto di forza è l’ampia scelta di prodotti e servizi disponibili, che permette di trovare sempre la soluzione più adatta alle proprie esigenze. Che si tratti di stampa 3D o di consulenza, si viene seguiti con professionalità e disponibilità. Consiglio vivamente 3D Makes a chiunque cerchi qualità, competenza e un team affidabile!",
    date: "7 mesi fa",
  },
  {
    id: 12,
    author: "Gabriele Rosa",
    rating: 5,
    text: "Un team super competente e professionale Che consiglio! Hanno capito subito quello di cuoi avevo bisogno, e mi hanno proposto delle soluzioni ottimali, eseguendo prima una campionatura e in seguito il pezzo definitivo. Ho trovato la loro proposta e il loro servizio, assolutamente eccezionale. Si sono interessate e mi hanno seguito, anche dopo la vendita, accertandosi della mia soddisfazione. Complimenti! Tornerò",
    date: "7 mesi fa",
  },
  {
    id: 13,
    author: "Sue An",
    rating: 5,
    text: "Mi sono trovata molto bene con 3D makes, sono stati gentili e cordiali. Hanno eseguito subito la mia richiesta con professionalità e velocità. Se dovessi aver ancora bisogno di stampare in 3D chiederei sicuramente a loro!",
    date: "8 mesi fa",
  },
  {
    id: 14,
    author: "Thomas Trangoni",
    rating: 5,
    text: "Prodotti di qualità e grande disponibilità ad esaudire le richieste più assurde. Nota di merito a Matteo che, per ogni richiesta, è stato in grado di proporre eventuali alternative più economiche e/o più qualitative",
    date: "8 mesi fa",
  },
  {
    id: 15,
    author: "AURORA CASARIN",
    rating: 5,
    text: "Super professionali e soprattutto tempi ottimi. Consigliatissimo per gli studenti di architettura!",
    date: "8 mesi fa",
  },
  {
    id: 16,
    author: "Maria Vittoria schultze",
    rating: 5,
    text: "Servizio davvero eccellente da 3DMakes a Lugano! Il ragazzo è stato super disponibile, professionale e rapidissimo. Il lavoro è stato realizzato alla perfezione ed era pronto in pochissimo tempo. Consigliatissimo a chiunque cerchi qualità, velocità e cortesia!",
    date: "8 mesi fa",
  },
  {
    id: 17,
    author: "Tanya Malfanti",
    rating: 5,
    text: "Abbiamo avuto un’ottima esperienza con 3D Makes. Ci siamo rivolti a loro per un problema tecnico sulla nostra stampante Bambu Lab e siamo rimasti davvero colpiti: intervento rapidissimo, competenza e grande professionalità. In pochissimo tempo hanno individuato il problema e lo hanno risolto in modo efficace, spiegandoci tutto con chiarezza. È raro trovare un’assistenza così veloce e disponibile. Consigliamo 3D Makes senza esitazione a chi cerca supporto serio e affidabile nel mondo della stampa 3D.",
    date: "9 mesi fa",
  },
  {
    id: 18,
    author: "turienzo gasser architectes",
    rating: 5,
    text: "Giovani, entusiasti e appassionati; ma soprattutto competenti ed efficaci. Ho chiesto loro una scansione di un oggetto piuttosto complicato ed il risultato è stato a dir poco entusiasmante. Prezzi onestissimi. Non posso che consigliarli. Sicuramente mi rivolgerò nuovamente a loro in caso di necessità!",
    date: "11 mesi fa",
  },
  {
    id: 19,
    author: "Ian",
    rating: 5,
    text: "Avevo bisogno di un pezzo di ricambio e sono stati molto efficienti nel risolvere il mio problema, sono dei ragazzi gentili e offrono un altissima qualità di stampa.",
    date: "11 mesi fa",
  },
  {
    id: 20,
    author: "Nicholas Chiggiato",
    rating: 5,
    text: "Prodotti eccezionali, molto professionali e disponibili",
    date: "un anno fa",
  },
  {
    id: 21,
    author: "Francesca Bertagnoli",
    rating: 5,
    text: "Ho ordinato una stampa di un’arma per un cosplay e il risultato è stato eccellente! La qualità di stampa è davvero alta, con dettagli precisi. Inoltre i tempi di realizzazione e consegna sono stati rapidissimi, molto più veloci di quanto mi aspettassi. Servizio assolutamente consigliato!",
    date: "un anno fa",
  },
  {
    id: 22,
    author: "Lorenzo Rebuffo",
    rating: 5,
    text: "Lavoro veloce e di qualità. Molto disponibile e preparato. Consiglio vivamente",
    date: "un anno fa",
  },
  {
    id: 23,
    author: "Elia Alacam",
    rating: 5,
    text: "Lavoro veloce ed efficace. Marco è stato in grado di capire esattamente la mia richiesta e senza troppe perdite di tempo ha eseguito un lavoro a dir poco perfetto. Consigliato!",
    date: "un anno fa",
  },
  {
    id: 24,
    author: "Titti Bi",
    rating: 5,
    text: "Incredibilmente disponibile e gentile. Ha risolto il mio problema con estrema competenza, ben oltre le mie aspettative. Lo consiglio a tutti. Grazie mille.",
    date: "2 anni fa",
  },
  {
    id: 25,
    author: "Leonardo",
    rating: 5,
    text: "Un esperienza professionale meritevole di lode, il titolare è stato cortese e molto qualificato per svolgere il lavoro affidatogli !!",
    date: "2 anni fa",
  },
  {
    id: 26,
    author: "Francesco Quattrucci",
    rating: 5,
    text: "Velocità e Qualità, Buonissimo il rapporto prezzo/materiale",
    date: "2 anni fa",
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
