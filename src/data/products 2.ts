import { Product } from '@/types/shop';

export const products: Product[] = [
  {
    id: '1',
    name: 'Ciotola Personalizzata Premium',
    description: 'Ciotola per animali stampata in 3D con personalizzazione del nome.',
    price: 29.90,
    images: [
      '/images/ciotole/ciotola1.png',
      '/images/ciotole/ciotola2.png',
    ],
    category: 'ciotole',
    details: [
      { label: 'Materiale', value: 'PLA alimentare' },
      { label: 'Dimensioni', value: '15cm diametro' },
      { label: 'Colori', value: 'Personalizzabile' },
      { label: 'Lavabile', value: 'Sì, in lavastoviglie' },
    ],
    features: [
      'Materiale sicuro per alimenti',
      'Resistente e durevole',
      'Personalizzabile con il nome del tuo pet',
      'Design moderno e funzionale',
    ],
    stock: 15,
    featured: true,
  },
  {
    id: '2',
    name: 'Porta Sacchetti per Guinzaglio',
    description: 'Pratico porta sacchetti da attaccare al guinzaglio, design compatto.',
    price: 12.90,
    images: [
      '/images/accessori/accessorio1.png',
      '/images/accessori/accessorio2.png',
    ],
    category: 'accessori',
    details: [
      { label: 'Materiale', value: 'PLA resistente' },
      { label: 'Capacità', value: '1 rotolo standard' },
      { label: 'Montaggio', value: 'Moschettone incluso' },
      { label: 'Peso', value: '25g' },
    ],
    features: [
      'Leggero e resistente',
      'Facile da attaccare e staccare',
      'Design ergonomico',
      'Disponibile in vari colori',
    ],
    stock: 30,
    featured: true,
  },
  {
    id: '3',
    name: 'Targhetta ID Personalizzata',
    description: 'Targhetta identificativa per collare con incisione personalizzata.',
    price: 15.90,
    images: [
      '/images/accessori/accessorio3.png',
      '/images/accessori/accessorio4.png',
    ],
    category: 'accessori',
    details: [
      { label: 'Materiale', value: 'PLA durevole' },
      { label: 'Forme', value: 'Osso, cerchio, cuore' },
      { label: 'Incisione', value: 'Nome e telefono' },
      { label: 'Dimensioni', value: '3cm x 2cm' },
    ],
    features: [
      'Incisione laser permanente',
      'Resistente agli agenti atmosferici',
      'Anello di attacco rinforzato',
      'Personalizzazione completa',
    ],
    stock: 25,
  },
  {
    id: '4',
    name: 'Gioco Interattivo per Cani',
    description: 'Giocattolo stampato in 3D per stimolare l\'intelligenza del tuo cane.',
    price: 24.90,
    images: [
      '/images/gadget/gadget1.png',
      '/images/gadget/gadget2.png',
    ],
    category: 'gadget',
    details: [
      { label: 'Materiale', value: 'PLA non tossico' },
      { label: 'Difficoltà', value: 'Media' },
      { label: 'Dimensioni', value: '20cm x 20cm' },
      { label: 'Adatto a', value: 'Cani di tutte le taglie' },
    ],
    features: [
      'Stimola l\'intelligenza del pet',
      'Materiale sicuro e resistente',
      'Facile da pulire',
      'Design brevettato',
    ],
    stock: 12,
  },
  {
    id: '5',
    name: 'Ciotola Rialzata Ergonomica',
    description: 'Ciotola con supporto rialzato per una postura corretta durante i pasti.',
    price: 39.90,
    images: [
      '/images/ciotole/ciotola3.png',
      '/images/ciotole/ciotola4.png',
    ],
    category: 'ciotole',
    details: [
      { label: 'Materiale', value: 'PLA alimentare' },
      { label: 'Altezza', value: '15cm regolabile' },
      { label: 'Capacità', value: '500ml' },
      { label: 'Base', value: 'Anti-scivolo' },
    ],
    features: [
      'Migliora la postura durante i pasti',
      'Riduce il gonfiore addominale',
      'Base stabile e antiscivolo',
      'Facile da pulire',
    ],
    stock: 8,
    featured: true,
  },
  {
    id: '6',
    name: 'Porta Crocchette da Viaggio',
    description: 'Contenitore ermetico per portare le crocchette ovunque.',
    price: 18.90,
    images: [
      '/images/accessori/accessorio5.png',
      '/images/gadget/gadget3.png',
    ],
    category: 'accessori',
    details: [
      { label: 'Materiale', value: 'PLA alimentare' },
      { label: 'Capacità', value: '200g di crocchette' },
      { label: 'Chiusura', value: 'Ermetica' },
      { label: 'Dimensioni', value: '10cm x 8cm' },
    ],
    features: [
      'Perfetto per viaggi e passeggiate',
      'Mantiene le crocchette fresche',
      'Compatto e leggero',
      'Facile da aprire con una mano',
    ],
    stock: 20,
  },
  {
    id: '7',
    name: 'Set Ciotole Gemelle',
    description: 'Set di 2 ciotole coordinate per acqua e cibo.',
    price: 49.90,
    images: [
      '/images/ciotole/ciotola5.png',
      '/images/ciotole/ciotola6.png',
    ],
    category: 'ciotole',
    details: [
      { label: 'Materiale', value: 'PLA alimentare' },
      { label: 'Contenuto', value: '2 ciotole' },
      { label: 'Capacità', value: '400ml ciascuna' },
      { label: 'Colori', value: 'Abbinati' },
    ],
    features: [
      'Set completo per acqua e cibo',
      'Design coordinato',
      'Base antiscivolo',
      'Personalizzabile',
    ],
    stock: 10,
  },
  {
    id: '8',
    name: 'Medaglione Smart QR',
    description: 'Medaglione con QR code per profilo digitale del tuo pet.',
    price: 22.90,
    images: [
      '/images/gadget/gadget4.png',
      '/images/accessori/accessorio1.png',
    ],
    category: 'gadget',
    details: [
      { label: 'Materiale', value: 'PLA resistente' },
      { label: 'Tecnologia', value: 'QR code permanente' },
      { label: 'Profilo', value: 'Online personalizzabile' },
      { label: 'Dimensioni', value: '3.5cm diametro' },
    ],
    features: [
      'Profilo digitale completo',
      'Aggiornabile in tempo reale',
      'Contatti di emergenza',
      'Cartella clinica digitale',
    ],
    stock: 18,
    featured: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

