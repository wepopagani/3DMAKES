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
/*  {
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
  },*/
  {
    id: 'prod-002',
    name: 'Maschera Black Panther',
    nameEn: 'Black Panther Mask',
    price: 250.00,
    description: 'Riproduzioni realistiche dei tuoi supereroi preferiti, perfette per collezione o cosplay.',
    descriptionEn: 'Realistic reproductions of your favorite superheroes, perfect for collection or cosplay.',
    features: [
      '100% Personalizzabile',
      'Chiusura con magneti',
      'Occhi a griglia',
      'Leggera e resistente',
    ],
    featuresEn: [
      '100% Customizable',
      'Magnet closure',
      'Grille eyes',
      'Lightweight and durable'
    ],
    images: [
      '/images/shop/Maschere/bp_1.jpg',
      '/images/shop/Maschere/bp_2.jpg',
      '/images/shop/Maschere/bp_3.jpg',
      '/images/shop/Maschere/bp_4.jpg'
    ],
    category: 'Maschere',
    inStock: true
  },
  {
    id: 'prod-003',
    name: 'Maschera Deadpool',
    nameEn: 'Deadpool Mask',
    price: 250.00,
    description: 'Riproduzioni realistiche dei tuoi supereroi preferiti, perfette per collezione o cosplay.',
    descriptionEn: 'Realistic reproductions of your favorite superheroes, perfect for collection or cosplay.',
    features: [
      '100% Personalizzabile',
      'Chiusura con magneti',
      'Occhi a griglia',
      'Leggera e resistente',
    ],
    featuresEn: [
      'Customizable',
      'Magnet closure',
      'Grille eyes',
      'Lightweight and durable',
    ],
    images: [
      '/images/shop/Maschere/dp_1.jpg',
      '/images/shop/Maschere/dp_2.jpg',
    ],
    category: 'Maschere',
    inStock: true
  },
  {
    id: 'prod-004',
    name: 'Miniatura Dubai',
    nameEn: 'Dubai Miniature',
    price: 55.00,
    description: 'Miniature delle città più iconiche, stampate in 3D con dettagli straordinari.',
    descriptionEn: 'Miniatures of the most iconic cities, printed in 3D with extraordinary details.',
    features: [
      'Palazzi con altezze variabili',
      'Dimensioni: 19x14x5 cm',
      'Mare fotorealistico',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Buildings with variable heights',
      'Size: 19x14x5 cm',
      'Factual sea',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/città/Dubai1.jpg',
      'images/shop/città/Dubai2.jpg',
    ],
    category: 'Miniature',
    inStock: true
  },
  {
    id: 'Miniatura Monte Carlo',
    name: 'Miniatura Monte Carlo',
    nameEn: 'Monte Carlo Miniature',
    price: 55.00,
    description: 'Miniature della città di Monte Carlo, stampate in 3D con dettagli straordinari.',
    descriptionEn: 'Miniatures of Monte Carlo, printed in 3D with extraordinary details.',
    features: [
      'Palazzi con altezze variabili',
      'Dimensioni: 19x14x5 cm',
      'Colori variabili',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Buildings with variable heights',
      'Size: 19x14x5 cm',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/città/Monaco1.jpg',
      'images/shop/città/Monaco2.jpg',
      'images/shop/città/Monaco3.jpg',
    ],
    category: 'Miniature',
    inStock: true
  },
  {
    id: 'Miniatura Tracciato Nürburgring',
    name: 'Miniatura Tracciato Nürburgring',
    nameEn: 'Nürburgring Track Miniature',
    price: 55.00,
    description: 'Miniature del tracciato Nürburgring, stampate in 3D con dettagli straordinari.',
    descriptionEn: 'Miniatures of the Nürburgring track, printed in 3D with extraordinary details.',
    features: [
      'Tracciato con altezze variabili',
      'Dimensioni: 19x14x5 cm',
      'Colori variabili',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Track with variable heights',
      'Size: 19x14x5 cm',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Track/Nur1.jpg',
      'images/shop/Track/Nur2.jpg',
    ],
    category: 'Miniature',
    inStock: true
  },
  {
    id: 'prod-007',
    name: 'Orologio da muro Rolex 1',
    nameEn: 'Wall Clock Rolex 1',
    price: 99.90,
    description: 'Orologio da muro Rolex Daytona con quadrante bianco, stampato in 3D con meccanismo funzionante.',
    descriptionEn: 'Wall Clock Rolex Daytona with white dial, printed in 3D with working mechanism.',
    features: [
      'Riproduzione fedele',
      'Dimensioni: 25x25x5 cm',
      'Colori variabili',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Accurate reproduction',
      'Size: 25x25x5 cm',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Orologi/daytonaW1.jpg',
      'images/shop/Orologi/daytonaW2.jpg',
      'images/shop/Orologi/daytonaW3.jpg',
      'images/shop/Orologi/daytonaW4.jpg',
    ],
    category: 'accessories',
    inStock: true
  },
  {
    id: 'prod-008',
    name: 'Pikachu 25 cm',
    nameEn: 'Pikachu 25 cm',
    price: 235.00,
    description: 'Pikachu 25 cm, stampato in 3D con dettagli straordinari e finitura in resina',
    descriptionEn: 'Pikachu 25 cm, printed in 3D with extraordinary details and resin finish.',
    features: [
      'Dimensioni: 25 cm',
      'finitura lucida in resina',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'High resolution',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Action/Pikachu1.jpg',
      'images/shop/Action/Pikachu2.jpg',
      'images/shop/Action/Pikachu3.jpg',
    ],
    category: 'collectibles',
    inStock: true
  },
  {
    id: 'prod-009',
    name: 'Supporto per Lego Formula 1',
    nameEn: 'Lego Formula 1 Support',
    price: 35.00,
    description: 'Supporto per Lego Formula 1, ti permette di mantenere in piedi la vettura e il personaggio Lego',
    descriptionEn: 'Lego Formula 1 Support, allows you to keep the vehicle and Lego character standing.',
    features: [
      'Supporto per Lego Formula 1',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Lego Formula 1 Support',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Action/ferrari1.jpg',
      'images/shop/Action/ferrari2.jpg',
      'images/shop/Action/ferrari3.jpg',
    ],
    category: 'collectibles',
    inStock: true
  },
  {
    id: 'prod-010',
    name: 'Miniatura Tracciato Villeneuve',
    nameEn: 'Villeneuve Track Miniature',
    price: 55.00,
    description: 'Miniatura del tracciato Villeneuve, stampato in 3D con dettagli straordinari.',
    descriptionEn: 'Miniature of the Villeneuve track, printed in 3D with extraordinary details.',
    features: [
      'Tracciato con altezze variabili',
      'Dimensioni: 19x14x5 cm',
      'Colori variabili',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Track with variable heights',
      'Size: 19x14x5 cm',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Track/V1.JPG',
      'images/shop/Track/V2.JPG',

    ],
    category: 'collectibles',
    inStock: true
  },
  {
    id: 'prod-011',
    name: 'Miniatura Tracciato Red Bull Ring',
    nameEn: 'Red Bull Ring Track Miniature',
    price: 55.00,
    description: 'Miniatura del tracciato Red Bull Ring, stampato in 3D con dettagli straordinari.',
    descriptionEn: 'Miniature of the Red Bull Ring track, printed in 3D with extraordinary details.',
    features: [
      'Tracciato con altezze variabili',
      'Dimensioni: 19x14x5 cm',
      'Colori variabili',
      'Perfetto per collezione o regalo unico'
    ],
    featuresEn: [
      'Track with variable heights',
      'Size: 19x14x5 cm',
      'Variable colors',
      'Perfect for collection or unique gift'
    ],
    images: [
      'images/shop/Track/RB1.JPG',
      'images/shop/Track/RB2.JPG',

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
  { id: 'collectibles', nameIt: 'Collezionabili', nameEn: 'Collectibles' },
  { id: 'Maschere', nameIt: 'Maschere', nameEn: 'Masks' }
];

