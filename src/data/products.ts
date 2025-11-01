export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  images: string[];
  video?: string;
  category?: string; // Predisposizione per categorie future
  inStock: boolean;
  customizable?: boolean; // Indica se il prodotto è personalizzabile
}

// Prodotti personalizzabili (i clienti possono caricare immagini e note)
export const products: Product[] = [
  {
    id: 'custom-001',
    name: 'Portachiavi Personalizzato 3D',
    nameEn: 'Custom 3D Keychain',
    price: 12.00,
    description: 'Crea il tuo portachiavi unico stampato in 3D! Carica il tuo logo, disegno o foto e noi lo trasformiamo in un portachiavi personalizzato. Perfetto come regalo o gadget aziendale.',
    descriptionEn: 'Create your unique 3D printed keychain! Upload your logo, design or photo and we\'ll transform it into a custom keychain. Perfect as a gift or corporate gadget.',
    features: [
      '100% Personalizzabile',
      'Materiale resistente (PLA/PETG)',
      'Dimensioni: circa 5x5cm',
      'Disponibile in tutti i colori',
      'Consegna: 3-5 giorni lavorativi'
    ],
    featuresEn: [
      '100% Customizable',
      'Durable material (PLA/PETG)',
      'Size: approx 5x5cm',
      'Available in all colors',
      'Delivery: 3-5 business days'
    ],
    images: [
      '/images/gadget/portachiavi1.png',
      '/images/gadget/portachiavi2.png'
    ],
    category: 'custom',
    inStock: true,
    customizable: true
  },
  {
    id: 'custom-002',
    name: 'Custodia Telefono Personalizzata',
    nameEn: 'Custom Phone Case',
    price: 18.00,
    description: 'Custodia per smartphone stampata in 3D su misura! Carica il tuo design, logo o immagine preferita. Protezione completa e stile unico per il tuo telefono.',
    descriptionEn: 'Custom 3D printed phone case made to measure! Upload your design, logo or favorite image. Complete protection and unique style for your phone.',
    features: [
      '100% Personalizzabile',
      'Protezione totale del telefono',
      'Materiale: TPU flessibile o PLA rigido',
      'Compatibile con tutti i modelli',
      'Finitura liscia e professionale'
    ],
    featuresEn: [
      '100% Customizable',
      'Total phone protection',
      'Material: Flexible TPU or rigid PLA',
      'Compatible with all models',
      'Smooth professional finish'
    ],
    images: [
      '/images/accessori/supporto1.png',
      '/images/accessori/supporto2.png'
    ],
    category: 'custom',
    inStock: true,
    customizable: true
  },
  {
    id: 'custom-003',
    name: 'Targa/Targhetta Personalizzata',
    nameEn: 'Custom Name Plate/Sign',
    price: 15.00,
    description: 'Targa o targhetta personalizzata stampata in 3D. Ideale per porte, scrivanie, negozi o regali speciali. Carica il tuo design o dicci cosa vuoi scrivere.',
    descriptionEn: 'Custom 3D printed name plate or sign. Ideal for doors, desks, shops or special gifts. Upload your design or tell us what you want to write.',
    features: [
      '100% Personalizzabile',
      'Testo e grafica a scelta',
      'Dimensioni: fino a 20x10cm',
      'Disponibile in tutti i colori',
      'Fori pre-montaggio inclusi'
    ],
    featuresEn: [
      '100% Customizable',
      'Custom text and graphics',
      'Size: up to 20x10cm',
      'Available in all colors',
      'Pre-drilled mounting holes'
    ],
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    category: 'custom',
    inStock: true,
    customizable: true
  },
  {
    id: 'custom-004',
    name: 'Gadget/Accessorio Personalizzato',
    nameEn: 'Custom Gadget/Accessory',
    price: 20.00,
    description: 'Crea il tuo gadget o accessorio unico! Dalle statuette personalizzate ai supporti su misura, dai ciondoli agli oggetti decorativi. Carica le tue idee e noi le realizziamo in 3D.',
    descriptionEn: 'Create your unique gadget or accessory! From custom figurines to tailor-made holders, from pendants to decorative items. Upload your ideas and we\'ll bring them to life in 3D.',
    features: [
      '100% Personalizzabile',
      'Qualsiasi design o idea',
      'Consulenza gratuita sul progetto',
      'Materiali vari disponibili',
      'Perfetto per regali unici'
    ],
    featuresEn: [
      '100% Customizable',
      'Any design or idea',
      'Free project consultation',
      'Various materials available',
      'Perfect for unique gifts'
    ],
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    category: 'custom',
    inStock: true,
    customizable: true
  },
  {
    id: 'prod-002',
    name: 'Supporto per Smartphone',
    nameEn: 'Smartphone Stand',
    price: 15.00,
    description: 'Supporto elegante e funzionale per smartphone, stampato in 3D. Design minimale e moderno, perfetto per scrivania o comodino.',
    descriptionEn: 'Elegant and functional 3D printed smartphone stand. Minimal and modern design, perfect for desk or nightstand.',
    features: [
      'Design ergonomico',
      'Angolazione regolabile',
      'Compatibile con tutti gli smartphone',
      'Base antiscivolo',
      'Leggero e resistente'
    ],
    featuresEn: [
      'Ergonomic design',
      'Adjustable angle',
      'Compatible with all smartphones',
      'Non-slip base',
      'Lightweight and durable'
    ],
    images: [
      '/images/accessori/supporto1.png',
      '/images/accessori/supporto2.png'
    ],
    category: 'accessories',
    inStock: true
  },
  {
    id: 'prod-003',
    name: 'Portachiavi Personalizzato',
    nameEn: 'Custom Keychain',
    price: 8.00,
    description: 'Portachiavi unico stampato in 3D. Personalizzabile con iniziali, logo o design a scelta. Idea regalo perfetta!',
    descriptionEn: 'Unique 3D printed keychain. Customizable with initials, logo or custom design. Perfect gift idea!',
    features: [
      'Personalizzabile',
      'Materiale resistente',
      'Design unico',
      'Leggero',
      'Disponibile in vari colori'
    ],
    featuresEn: [
      'Customizable',
      'Durable material',
      'Unique design',
      'Lightweight',
      'Available in various colors'
    ],
    images: [
      '/images/gadget/portachiavi1.png',
      '/images/gadget/portachiavi2.png'
    ],
    category: 'gadget',
    inStock: true
  },
  {
    id: 'prod-004',
    name: 'Vaso Geometrico',
    nameEn: 'Geometric Planter',
    price: 30.00,
    description: 'Vaso dal design geometrico moderno, perfetto per piante grasse e piccole piante. Stampa 3D di alta qualità.',
    descriptionEn: 'Modern geometric design planter, perfect for succulents and small plants. High quality 3D print.',
    features: [
      'Design moderno',
      'Dimensioni: 12x12x12cm',
      'Foro di drenaggio',
      'Ideale per piante grasse',
      'Finitura liscia'
    ],
    featuresEn: [
      'Modern design',
      'Size: 12x12x12cm',
      'Drainage hole',
      'Ideal for succulents',
      'Smooth finish'
    ],
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    category: 'home',
    inStock: true
  },
  {
    id: 'prod-005',
    name: 'Organizer da Scrivania',
    nameEn: 'Desk Organizer',
    price: 22.00,
    description: 'Organizer multifunzionale per scrivania. Scomparti per penne, graffette, post-it e accessori vari.',
    descriptionEn: 'Multifunctional desk organizer. Compartments for pens, clips, post-its and various accessories.',
    features: [
      'Design modulare',
      'Scomparti multipli',
      'Base stabile',
      'Facile da pulire',
      'Dimensioni: 20x15x8cm'
    ],
    featuresEn: [
      'Modular design',
      'Multiple compartments',
      'Stable base',
      'Easy to clean',
      'Size: 20x15x8cm'
    ],
    images: [
      '/placeholder.svg'
    ],
    category: 'office',
    inStock: true
  },
  {
    id: 'prod-006',
    name: 'Lampada LED Personalizzata',
    nameEn: 'Custom LED Lamp',
    price: 45.00,
    description: 'Lampada LED con base stampata in 3D personalizzabile. Design unico e moderno, perfetta come regalo o per la tua casa.',
    descriptionEn: 'LED lamp with customizable 3D printed base. Unique and modern design, perfect as a gift or for your home.',
    features: [
      'LED a basso consumo',
      'Base personalizzabile',
      'Luce calda o fredda',
      'Design esclusivo',
      'Alimentazione USB'
    ],
    featuresEn: [
      'Low consumption LED',
      'Customizable base',
      'Warm or cold light',
      'Exclusive design',
      'USB powered'
    ],
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    category: 'lighting',
    inStock: true
  },
  {
    id: 'prod-007',
    name: 'Custodia AirPods',
    nameEn: 'AirPods Case',
    price: 12.00,
    description: 'Custodia protettiva per AirPods stampata in 3D. Design originale, protezione completa e aggancio per portachiavi.',
    descriptionEn: 'Protective 3D printed case for AirPods. Original design, complete protection and keychain attachment.',
    features: [
      'Protezione totale',
      'Design unico',
      'Aggancio portachiavi',
      'Facile accesso alla ricarica',
      'Leggera e resistente'
    ],
    featuresEn: [
      'Total protection',
      'Unique design',
      'Keychain attachment',
      'Easy charging access',
      'Light and durable'
    ],
    images: [
      '/placeholder.svg'
    ],
    category: 'accessories',
    inStock: true
  },
  {
    id: 'prod-008',
    name: 'Miniatura Personalizzata',
    nameEn: 'Custom Miniature',
    price: 35.00,
    description: 'Miniatura 3D personalizzata. Perfetta per collezionisti, giochi da tavolo o come regalo unico. Alta qualità di stampa.',
    descriptionEn: 'Custom 3D miniature. Perfect for collectors, board games or as a unique gift. High print quality.',
    features: [
      'Alta risoluzione',
      'Dettagli precisi',
      'Personalizzabile',
      'Verniciabile',
      'Altezza: 5-10cm'
    ],
    featuresEn: [
      'High resolution',
      'Precise details',
      'Customizable',
      'Paintable',
      'Height: 5-10cm'
    ],
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    category: 'collectibles',
    inStock: true
  }
];

// Funzioni helper
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getInStockProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};

// Categorie (predisposte per implementazione futura)
export const categories = [
  { id: 'pet', nameIt: 'Animali', nameEn: 'Pets' },
  { id: 'accessories', nameIt: 'Accessori', nameEn: 'Accessories' },
  { id: 'gadget', nameIt: 'Gadget', nameEn: 'Gadgets' },
  { id: 'home', nameIt: 'Casa', nameEn: 'Home' },
  { id: 'office', nameIt: 'Ufficio', nameEn: 'Office' },
  { id: 'lighting', nameIt: 'Illuminazione', nameEn: 'Lighting' },
  { id: 'collectibles', nameIt: 'Collezionabili', nameEn: 'Collectibles' }
];

