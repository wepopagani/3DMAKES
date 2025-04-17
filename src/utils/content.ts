export const blogPosts = {
  en: [
    {
      id: '1',
      title: 'The Future of 3D Printing in Manufacturing',
      excerpt: 'Exploring how additive manufacturing is revolutionizing traditional production methods.',
      content: `3D printing technology continues to evolve rapidly, transforming the manufacturing landscape. From rapid prototyping to end-use parts production, the applications are endless. Companies are increasingly adopting these technologies to reduce costs, improve efficiency, and create complex geometries that were previously impossible with traditional manufacturing methods.

      Key advantages:
      - Reduced lead times
      - Lower tooling costs
      - Design freedom
      - Mass customization
      - Sustainable production

      As materials science advances and printer capabilities improve, we see more industries embracing 3D printing as a primary manufacturing technology.`,
      imageUrl: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5',
      date: '2024-01-15',
      author: 'Mark Ross',
      category: 'Technology',
      readTime: '5'
    },
    {
      id: '2',
      title: 'Sustainable 3D Printing: Using Recycled Materials',
      excerpt: 'How we\'re reducing environmental impact through innovative material choices.',
      content: `Sustainability in 3D printing is becoming increasingly important. We're proud to be at the forefront of using recycled materials in our printing processes. This not only reduces waste but also creates new possibilities for eco-friendly production.

      Our initiatives include:
      - Using recycled PLA and PETG
      - Implementing closed-loop material systems
      - Minimizing waste through optimal print settings
      - Offering biodegradable alternatives
      
      By choosing recycled materials, our clients can reduce their environmental impact while maintaining high-quality results.`,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
      date: '2024-01-10',
      author: 'Sophie White',
      category: 'Sustainability',
      readTime: '4'
    },
    {
      id: '4',
      title: 'Innovative Applications in Aerospace 3D Printing',
      excerpt: 'How 3D printing is transforming the aerospace industry with lightweight, complex parts.',
      content: `The aerospace industry is witnessing a revolution in manufacturing thanks to advanced 3D printing technologies. From lightweight brackets to complex turbine components, additive manufacturing is enabling new possibilities in aircraft design and production.

      Key innovations:
      - Topology-optimized structural components
      - Integrated cooling channels in engine parts
      - Consolidated assemblies reducing part count
      - Weight reduction through lattice structures
      
      These advancements are leading to more efficient, lighter aircraft with reduced fuel consumption and improved performance.`,
      imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933',
      date: '2023-12-20',
      author: 'James Mitchell',
      category: 'Aerospace',
      readTime: '6'
    },
    {
      id: '6',
      title: '3D Printing Materials: A Comprehensive Guide',
      excerpt: 'Exploring the diverse world of 3D printing materials and their applications.',
      content: `3D printing is revolutionizing industry and transforming how we create objects. A crucial aspect of this technology is the wide range of available materials, each with unique properties and specific applications. In this guide, we'll explore the most common 3D printing materials and their uses.

      Thermoplastics: Versatile and Widely Used

      Thermoplastics, available in filament form, are the most common materials for 3D printing. They are heated until molten, extruded through a nozzle, and solidify upon cooling.

      PLA (Polylactic Acid): Biodegradable and easy to print, ideal for beginners and general prototypes.
      ABS (Acrylonitrile Butadiene Styrene): More durable and heat-tolerant than PLA, suitable for functional parts and outdoor applications.
      PETG (Polyethylene Terephthalate Glycol): Combines ABS strength with PLA printability, making it a versatile choice.
      TPU (Thermoplastic Polyurethane): Flexible and durable, used for items like phone cases, gaskets, and wearables.

      Resins: High Definition and Precision

      Resins are liquid photopolymers that cure when exposed to UV light. They offer high resolution and are ideal for intricate details and smooth surfaces.

      Standard Resins: Used for general printing, prototypes, and artistic creations.
      Engineering Resins: Offer improved mechanical properties like high strength, heat resistance, and chemical resistance.
      Casting Resins: Designed for jewelry molds and lost-wax casting models.
      Dental Resins: Specifically formulated for dental applications like crowns, bridges, and aligners.

      Composites: Tailored Properties

      Composites combine multiple materials to achieve specific properties. In 3D printing, continuous fiber reinforcement is gaining popularity for creating lightweight, strong parts.

      Carbon Fiber Reinforced: Increases strength and stiffness for applications like drones, automotive parts, and sporting equipment.
      Glass Fiber Reinforced: Offers a balance of strength and cost for various applications.

      Choosing the Right Material

      The best material for your 3D printing project depends on several factors:

      Desired properties: Strength, flexibility, heat resistance, biocompatibility, etc.
      Intended use: Prototyping, functional parts, aesthetics, etc.

      Experimenting with different materials is key to unlocking the full potential of 3D printing and creating truly innovative and functional objects.

      Stay tuned for more insights into the fascinating world of 3D printing materials!`,
      imageUrl: '/images/blog/materials.png',
      date: '2024-02-20',
      author: 'David Chen',
      category: 'Materials',
      readTime: '8'
    },
    {
      id: '7',
      title: 'Slicing: The Unsung Hero of 3D Printing',
      excerpt: 'Understanding the crucial role of slicing software in successful 3D printing.',
      content: `Slicing is a fundamental step in the 3D printing process that often goes unnoticed, but plays a crucial role in the success of your prints. In this post, we'll dive into the world of slicing software, explaining its importance, key features, and providing tips for optimal results.

      What is Slicing?
      Slicing is the process of converting a 3D model into a series of thin layers that a 3D printer can understand and execute. Specialized software, known as slicers, analyzes the 3D model and generates G-code instructions, which tell the printer how to move, where to deposit material, and at what temperature to operate.

      Why is Slicing Important?
      Slicing doesn't just translate a 3D model into printable instructions. It also allows you to adjust a variety of settings that significantly impact the quality, strength, and speed of your prints. Some of the main parameters you can control include:

      Layer Height: Determines the thickness of each layer, affecting print resolution and surface finish.
      Infill: The internal structure of the print, affecting strength and material usage.
      Print Speed: Balancing between speed and quality to achieve desired results.
      Supports: Generation of structures to hold up overhanging parts of the model.

      Key Features of Slicing Software
      Modern slicing software offers a wide range of features to help you achieve the best possible prints. Some essential features include:

      - Automatic Support Generation: Intelligently adds support structures where needed.
      
      - Adaptive Layer Height: Adjusts layer height based on model geometry.
      
      - Print Time Estimation: Provides an estimate of how long the print will take.
      
      - Material Profiles: Preset settings for different types of filaments.

      Conclusion
      Slicing might not be the most glamorous part of 3D printing, but it's certainly one of the most important. By understanding the role of slicing and mastering the use of slicing software, you can unlock the full potential of your 3D printer and achieve amazing results.

      Share your experiences with slicing and your favorite software in the comments!`,
      imageUrl: '/images/blog/slicing.png',
      date: '2024-02-25',
      author: 'Michael Brown',
      category: 'Technology',
      readTime: '6'
    },
    {
      id: '8',
      title: '8 Best Websites to Find 3D Printing Models',
      excerpt: 'A comprehensive guide to the top platforms for downloading 3D printable models.',
      content: `3D printing is becoming increasingly accessible, and one of the most common questions is: where can I find ready-to-print 3D models?

      Fortunately, there are numerous online platforms offering a wide range of 3D models, both free and paid, ideal for hobbyists, designers, and professionals.

      Here's a list of 8 of the best sites to find the perfect model for your next project:

      1. Thingiverse is probably the most well-known site for downloading free 3D models. Run by MakerBot, it's one of the largest online communities of 3D printing enthusiasts. Here you can find a wide range of objects, from home decorations to prototyping components.

      2. Cults3D is a platform offering both free and paid models. It's known for having high-quality projects created by both professional designers and hobbyists. Each file has a comments section, useful for seeing opinions from those who have already tried that model.

      3. Printables, managed by Prusa, offers a community-driven platform with a wide range of free 3D models. It features designs optimized for Prusa printers but works well with other 3D printers too.

      4. MyMiniFactory offers a vast collection of both free and premium 3D models, curated and tested to be compatible with most 3D printers. It's a very active platform in the community, often hosting contests for creators.

      5. Yeggi is a search engine for 3D models that collects files from various websites. If you have something specific in mind, Yeggi helps you quickly find the model to download by searching across multiple platforms.

      6. CGTrader is a 3D model marketplace with a wide selection of models both ready for printing and for other design and animation applications. While many models are paid, the quality is high, and there are also some free files.

      7. TurboSquid is another 3D model marketplace primarily targeting 3D graphics and design professionals. Although most models are paid, there are several high-quality free options available.

      8. Free3D is a platform offering both free and paid 3D models. While many models are designed for animations and rendering, some are suitable for 3D printing. It's a great resource for finding various models.

      Stay tuned to CreaLab for the latest updates on the ever-evolving world of 3D printing!`,
      imageUrl: '/images/blog/websites.png',
      date: '2024-03-01',
      author: 'Thomas Anderson',
      category: 'Resources',
      readTime: '7'
    },
  ],
  it: [
    {
      id: '1',
      title: 'Il Futuro della Stampa 3D nella Produzione',
      excerpt: 'Esplorando come la produzione additiva sta rivoluzionando i metodi di produzione tradizionali.',
      content: `La tecnologia di stampa 3D continua ad evolversi rapidamente, trasformando il panorama manifatturiero. Dalla prototipazione rapida alla produzione di parti per uso finale, le applicazioni sono infinite. Le aziende stanno sempre più adottando queste tecnologie per ridurre i costi, migliorare l'efficienza e creare geometrie complesse che erano precedentemente impossibili con i metodi di produzione tradizionali.

      Vantaggi principali:
      - Riduzione dei tempi di consegna
      - Minori costi di attrezzaggio
      - Libertà di design
      - Personalizzazione di massa
      - Produzione sostenibile

      Con l'avanzare della scienza dei materiali e il miglioramento delle capacità delle stampanti, vediamo sempre più industrie abbracciare la stampa 3D come tecnologia di produzione principale.`,
      imageUrl: '/images/blog/future.png',
      date: '2024-01-15',
      author: 'Marco Rossi',
      category: 'Tecnologia',
      readTime: '5'
    },
    {
      id: '2',
      title: 'Stampa 3D Sostenibile: Utilizzo di Materiali Riciclati',
      excerpt: 'Come stiamo riducendo l\'impatto ambientale attraverso scelte innovative dei materiali.',
      content: `La sostenibilità nella stampa 3D sta diventando sempre più importante. Siamo orgogliosi di essere all'avanguardia nell'utilizzo di materiali riciclati nei nostri processi di stampa. Questo non solo riduce i rifiuti ma crea anche nuove possibilità per la produzione eco-sostenibile.

      Le nostre iniziative includono:
      - Utilizzo di PLA e PETG riciclati
      - Implementazione di sistemi di materiale a ciclo chiuso
      - Minimizzazione degli sprechi attraverso impostazioni di stampa ottimali
      - Offerta di alternative biodegradabili
      
      Scegliendo materiali riciclati, i nostri clienti possono ridurre il loro impatto ambientale mantenendo risultati di alta qualità.`,
      imageUrl: '/images/blog/sustainable.png',
      date: '2024-01-10',
      author: 'Sofia Bianchi',
      category: 'Sostenibilità',
      readTime: '4'
    },
    {
      id: '4',
      title: 'Applicazioni Innovative nella Stampa 3D Aerospaziale',
      excerpt: 'Come la stampa 3D sta trasformando l\'industria aerospaziale con parti leggere e complesse.',
      content: `L'industria aerospaziale sta assistendo a una rivoluzione nella produzione grazie alle tecnologie di stampa 3D avanzate. Dai supporti leggeri ai componenti complessi delle turbine, la produzione additiva sta aprendo nuove possibilità nel design e nella produzione di aeromobili.

      Innovazioni chiave:
      - Componenti strutturali ottimizzati topologicamente
      - Canali di raffreddamento integrati nei componenti del motore
      - Assemblaggi consolidati che riducono il numero di parti
      - Riduzione del peso attraverso strutture reticolari
      
      Questi progressi stanno portando ad aeromobili più efficienti e leggeri con ridotto consumo di carburante e prestazioni migliorate.`,
      imageUrl: 'images/blog/aereo.png',
      date: '2023-12-20',
      author: 'Giacomo Moretti',
      category: 'Aerospaziale',
      readTime: '6'
    },
    {
      id: '6',
      title: 'Materiali per la Stampa 3D: Una Guida Completa',
      excerpt: 'Esplorando il mondo diversificato dei materiali per la stampa 3D e le loro applicazioni.',
      content: `La stampa 3D sta rivoluzionando l'industria e trasformando il modo in cui creiamo oggetti. Un aspetto cruciale di questa tecnologia è la vasta gamma di materiali disponibili, ognuno con proprietà uniche e applicazioni specifiche. In questa guida esploreremo i materiali per la stampa 3D più comuni e i loro usi.

      Termoplastici: Versatili e ampiamente utilizzati

      I termoplastici, disponibili in forma di filamento, sono i materiali più comuni per la stampa 3D. Vengono riscaldati fino a diventare fusi, estrusi attraverso un ugello e si solidificano raffreddandosi.

      PLA (Acido Polilattico): Biodegradabile e facile da stampare, ideale per principianti e prototipi generici.
      ABS (Acrilonitrile Butadiene Stirene): Più resistente e più tollerante al calore rispetto al PLA, adatto per parti funzionali e applicazioni all'aperto.
      PETG (Glicole di Polietilene Tereftalato): Combina la resistenza dell'ABS con la facilità di stampa del PLA, rendendolo una scelta versatile.
      TPU (Poliuretano Termoplastico): Flessibile e resistente, viene utilizzato per oggetti come cover per telefoni, guarnizioni e accessori indossabili.

      Resine: Alta definizione e precisione

      Le resine sono fotopolimeri liquidi che si induriscono quando esposti alla luce UV. Offrono alta risoluzione e sono ideali per dettagli intricati e superfici lisce.

      Standard Resins: Utilizzate per la stampa generale, prototipi e creazioni artistiche.
      Engineering Resins: Offrono proprietà meccaniche migliorate come alta resistenza, resistenza al calore e resistenza chimica.
      Casting Resins: Progettate per creare stampi per gioielli e modelli per fusione a cera persa.
      Dental Resins: Formulate specificamente per applicazioni odontoiatriche come corone, ponti e allineatori.

      Compositi: Proprietà su misura

      I compositi combinano più materiali per ottenere proprietà specifiche. Nella stampa 3D, il rinforzo con fibre continue sta guadagnando popolarità per creare parti leggere e resistenti.

      Fibra di Carbonio Rinforzata: Aumenta la resistenza e la rigidità per applicazioni come droni, parti automobilistiche e attrezzature sportive.
      Fibra di Vetro Rinforzata: Offre un equilibrio tra resistenza e costi per diverse applicazioni.

      Scegliere il materiale giusto

      Il miglior materiale per il tuo progetto di stampa 3D dipende da diversi fattori:

      Proprietà desiderate: Strength, flexibility, heat resistance, biocompatibility, etc.
      Uso previsto: Prototyping, functional parts, aesthetics, etc.

      Sperimentare con diversi materiali è la chiave per sbloccare il pieno potenziale della stampa 3D e creare oggetti davvero innovativi e funzionali.

      Rimani sintonizzato per ulteriori approfondimenti sul mondo affascinante dei materiali per la stampa 3D!`,
      imageUrl: '/images/blog/materials.png',
      date: '2024-02-20',
      author: 'Davide Conti',
      category: 'Materiali',
      readTime: '8'
    },
    {
      id: '7',
      title: 'Slicing: L\'eroe sconosciuto della stampa 3D',
      excerpt: 'Comprendere il ruolo cruciale del software di slicing nella stampa 3D di successo.',
      content: `Lo slicing è un passaggio fondamentale nel processo di stampa 3D che spesso passa inosservato, ma gioca un ruolo importante nel successo delle tue stampe. In questo post, approfondiremo il mondo del software di slicing, spiegandone l'importanza, le caratteristiche chiave e fornendo suggerimenti per ottenere risultati ottimali.

      Cos'è lo slicing?
      Lo slicing è il processo di conversione di un modello 3D in una serie di sottili strati che una stampante 3D può comprendere ed eseguire. Il software specializzato, noto come slicer, analizza il modello 3D e genera istruzioni G-code, che indicano alla stampante come muoversi, dove depositare il materiale e a quale temperatura operare.

      Perché lo slicing è importante?
      Lo slicing non serve solo a tradurre un modello 3D in istruzioni stampabili. Ti consente anche di regolare una varietà di impostazioni che influiscono significativamente sulla qualità, resistenza e velocità delle tue stampe. Alcuni dei principali parametri che puoi controllare includono:

      Altezza dello strato: Determina lo spessore di ogni strato, influenzando la risoluzione e la finitura superficiale della stampa.
      Riempimento: La struttura interna della stampa, che influisce sulla resistenza e sull'uso del materiale.
      Velocità di stampa: Bilanciamento tra velocità e qualità per ottenere il risultato desiderato.
      Supporti: Generazione di strutture per sostenere le parti in sospensione del modello.

      Caratteristiche principali del software di slicing
      Il software di slicing moderno offre una vasta gamma di funzionalità per aiutarti a ottenere le migliori stampe possibili. Alcune caratteristiche essenziali includono:

      - Generazione automatica di supporti: Aggiunge in modo intelligente strutture di supporto dove necessario.

      - Altezza dello strato adattiva: Regola l'altezza dello strato in base alla geometria del modello.

      - Stima del tempo di stampa: Fornisce una stima del tempo necessario per la stampa.

      - Profili di materiale: Impostazioni predefinite per diversi tipi di filamenti.

      Conclusione
      Lo slicing potrebbe non essere la parte più affascinante della stampa 3D, ma è sicuramente una delle più importanti. Comprendendo il ruolo del slicing e padroneggiando l'uso del software di slicing, puoi sbloccare tutto il potenziale della tua stampante 3D e ottenere risultati sorprendenti.

      Condividi nei commenti le tue esperienze con lo slicing e il tuo software preferito!`,
      imageUrl: '/images/blog/slicing.png',
      date: '2024-02-25',
      author: 'Michele Bruno',
      category: 'Tecnologia',
      readTime: '6'
    },
    {
      id: '8',
      title: '8 Migliori Siti per Trovare Modelli per la Stampa 3D',
      excerpt: 'Una guida completa alle migliori piattaforme per scaricare modelli stampabili in 3D.',
      content: `La stampa 3D sta diventando sempre più accessibile, e una delle domande più frequenti è: dove posso trovare modelli 3D pronti da stampare?

      Fortunatamente, ci sono numerose piattaforme online che offrono un'ampia gamma di modelli 3D, sia gratuiti che a pagamento, ideali per hobbisti, designer e professionisti.

      Ecco una lista di 8 dei migliori siti dove trovare il modello perfetto per il tuo prossimo progetto:

      1. Thingiverse è probabilmente il sito più conosciuto per scaricare modelli 3D gratuiti. È gestito da MakerBot ed è una delle più grandi comunità online di appassionati di stampa 3D. Qui puoi trovare una vasta gamma di oggetti, dalle decorazioni per la casa ai componenti per il prototipaggio.

      2. Cults3D è una piattaforma che offre sia modelli gratuiti che a pagamento. È nota per avere progetti di alta qualità realizzati sia da designer professionisti che da hobbisti. Ogni file ha una sezione di commenti, utile per vedere le opinioni di chi ha già provato quel modello.

      3. Printables, gestito da Prusa, offre una piattaforma animata dalla comunità con una vasta gamma di modelli 3D gratuiti. Propone design ottimizzati per stampanti Prusa, ma funziona bene anche con altre stampanti 3D.

      4. MyMiniFactory offre una vasta collezione di modelli 3D sia gratuiti che premium, curati e testati per essere compatibili con la maggior parte delle stampanti 3D. È una piattaforma molto attiva nella comunità, spesso ospita concorsi per i creativi.

      5. Yeggi è un motore di ricerca per modelli 3D che raccoglie file da vari siti web. Se hai in mente qualcosa di specifico, Yeggi ti aiuta a trovare il modello da scaricare rapidamente, cercando su più piattaforme.

      6. CGTrader è un marketplace di modelli 3D con un'ampia selezione di modelli sia pronti per la stampa che per altre applicazioni di design e animazione. Anche se molti modelli sono a pagamento, la qualità è elevata e ci sono anche alcuni file gratuiti.

      7. TurboSquid è un altro marketplace di modelli 3D che si rivolge principalmente ai professionisti della grafica 3D e del design. Anche se la maggior parte dei modelli è a pagamento, ci sono diverse opzioni gratuite di ottima qualità disponibili.

      8. Free3D è una piattaforma che offre modelli 3D gratuiti e a pagamento. Anche se molti modelli sono progettati per animazioni e rendering, alcuni sono adatti alla stampa 3D. È un'ottima risorsa per trovare modelli vari.

      Rimani sintonizzato su CreaLab per gli ultimi aggiornamenti sul mondo in continua evoluzione della stampa 3D!`,
      imageUrl: '/images/blog/websites.png',
      date: '2024-03-01',
      author: 'Tommaso Andrei',
      category: 'Risorse',
      readTime: '7'
    }
  ]
};

export const projects = {
  en: [
    {
      id: '0',
      title: '3D Printing in Dental Technology: A New Era',
      category: 'Medical',
      description: 'Innovations and practical applications of 3D printing in the dental sector, for dental clinics and laboratories.',
      longDescription: `In recent years, 3D printing has revolutionized the dental industry, bringing innovation, efficiency, and new opportunities for both laboratories and dental practices. But what are the real possibilities offered by this technology? And why are more and more dental professionals choosing it every day?

### Speed, Precision, and Customization

3D printing allows transforming a digital scan into a physical model in just a few hours. Whether it's a dental model for treatment planning, a surgical guide for implantology, or a bite for bruxism, rapid execution is one of the most appreciated benefits.  
Furthermore, the precision achieved by the latest generation printers guarantees reliable and repeatable results, reducing errors and remakes.

### Practical Applications: From Diagnostic Model to Trial Prosthesis

With 3D printing, it is now possible to create:
- **Dental models**: ideal for diagnosis, patient communication, and planning orthodontic or prosthetic treatments.
- **Surgical guides**: customized guides that increase safety and precision in implantology procedures.
- **Bites and splints**: custom devices for treating bruxism or dental protection.
- **Individual impression trays**: to obtain more precise and comfortable impressions.
- **Temporary prostheses, crowns, and trial bridges**: rapid solutions to test aesthetics and functionality before final realization.

### Benefits for Clinics and Laboratories

- **Reduced delivery times**: internal production or through a specialized service allows obtaining devices in much shorter times compared to traditional methods.
- **Cost savings**: less material waste, fewer manual steps, fewer errors.
- **Enhanced communication**: patients can see and touch the final result already at the design stage, increasing their trust and satisfaction.
- **Flexibility**: possibility to customize each device based on the patient's specific needs.

### The Future is Digital

3D printing doesn't replace the dental technician's expertise but enhances it. It allows working in a more digital, precise, and faster way, integrating artisanal tradition with the most advanced technologies.

At **3DMAKES**, we believe that the future of dental technology is already here: a future made of collaboration, innovation, and quality.  
If you are a dental clinic or laboratory and want to discover how 3D printing can improve your work, contact us: we will be happy to show you the possibilities of this extraordinary technology!

**Marco Pagani – 3DMAKES**  
info@3dmakes.ch | +41 76 266 03 96`,
      imageUrl: '/images/progetti/dental.png',
      details: {
        material: 'Biocompatible resins, PETG, PLA',
        printTime: 'Varies by application type',
        quality: '0.05-0.1mm layer',
        size: 'Customized according to clinical needs'
      },
      challenges: [
        'Achieving precision within clinical tolerances',
        'Using certified biocompatible materials',
        'Ensuring reproducibility of results',
        'Integration with existing digital workflows'
      ],
      benefits: [
        'Significant reduction in production time',
        'Greater precision compared to traditional methods',
        'Possibility of complete customization',
        'Better communication with the patient',
        'Perfect integration between digital and manual work'
      ],
      cta: {
        text: 'Discover dental applications',
        link: '/3d-printing-dentistry'
      }
    },
    {
      id: '1',
      title: 'Customizable Pet Bowls',
      category: 'Pet Accessories',
      description: 'Collection of bowls and accessories for pets made with 3D printing in carefully selected materials to ensure safety and practicality.',
      longDescription: `Our line of customizable pet bowls has been designed with animal well-being in mind. We offer different solutions tailored to the specific needs of dogs and cats.

The slow feeding bowls, made of PETG, are designed to slow down food consumption, preventing digestive problems and obesity. PETG is a material that retains very few bacteria and is extremely durable, ideal for food contact.

For those who prefer traditional stainless steel bowls, we offer supporting structures in PLA (an organic and biodegradable material) in different sizes: two options for dogs (14 cm and 16 cm in diameter) and a standard size for cats. These structures can be personalized with your pet's name and in various colors.

We complete the range with the NFC pendant in PETG-CF, reinforced with carbon fiber to ensure high resistance while maintaining a weight of only 5g. The integrated NFC tag contains all essential information about your pet and your contact details, working even where there is no internet connection.`,
      imageUrl: '/images/projects/ciotole.png',
      details: {
        material: 'PETG, PLA, PETG-CF, Stainless Steel',
        printTime: 'Varies by model',
        quality: '0.16mm layer',
        size: 'Various dimensions'
      },
      challenges: [
        'Creating effective slow feeding designs',
        'Optimizing durability for daily use',
        'Customization while maintaining functionality',
        'Miniaturization of NFC tag for the pendant'
      ],
      benefits: [
        'Materials selected for food safety',
        'Complete customization (name and colors)',
        'Specific solutions for different needs',
        'Identification pendant working everywhere'
      ],
      cta: {
        text: 'Customize your bowl',
        link: '/ciotole-personalizzabili'
      }
    },
    {
      id: '2',
      title: 'TPU Horseshoe Cushions',
      category: 'Equestrian',
      description: 'Custom 3D printed TPU cushions for horseshoes, designed to reduce joint stress and improve grip on various terrains.',
      longDescription: `This innovative project offers a significant improvement in traditional horseshoeing by incorporating custom-designed TPU (Thermoplastic Polyurethane) cushions. These cushions can be installed either before or after the metal horseshoe, providing multiple benefits for the horse's health and performance.

TPU is an ideal material for this application due to its unique properties. It combines the elasticity of rubber with the durability and processability of thermoplastics. The material offers excellent shock absorption capabilities while maintaining resilience over time, even under the significant stress of equine movement.

The cushions serve multiple purposes:
- Reducing impact stress on joints, tendons, and ligaments
- Improving traction on various surfaces, including slippery or uneven terrain
- Dampening vibration on hard surfaces
- Providing better weight distribution across the hoof

Each cushion is custom-designed based on the specific horse's measurements and needs. Using 3D scanning technology, we create precise models that perfectly match the hoof shape and size. This level of customization allows for addressing individual biomechanical issues that might affect the horse's performance or comfort.

The implementation has shown remarkable results, with riders reporting improved performance, reduced lameness issues, and increased comfort for their horses, especially on challenging terrains or during intensive activities.`,
      imageUrl: '/images/projects/horseshoe.png',
      details: {
        material: 'TPU (Thermoplastic Polyurethane)',
        printTime: '3-4 hours per set',
        quality: '0.2mm layer',
        size: 'Custom to horse specifications'
      },
      challenges: [
        'Creating designs that work with standard horseshoes',
        'Ensuring durability under extreme stress conditions',
        'Optimizing flexibility while maintaining structural integrity',
        'Developing custom solutions for different equestrian disciplines'
      ],
      benefits: [
        'Reduced joint and ligament stress for the horse',
        'Improved traction on various terrains',
        'Better shock absorption on hard surfaces',
        'Extended horseshoe longevity',
        'Customizable to address specific movement issues'
      ],
      cta: {
        text: 'Leggi la ricerca completa',
        link: '/ricerca-ferratura-tpu'
      }
    },
    {
      id: '3',
      title: 'Smart NFC Corporate Gadgets',
      category: 'Business Innovation',
      description: 'Smart corporate gadgets with integrated NFC technology for modern business networking and digital interaction.',
      longDescription: `Our innovative line of NFC-enabled corporate gadgets represents a significant evolution in business networking and brand promotion. Each item combines elegant design with smart functionality, creating powerful touchpoints for digital interaction.

      Smart NFC Keychains
      We've reinvented the traditional corporate keychain by integrating NFC technology. Each keychain becomes a digital touchpoint that can:
      - Share digital business cards instantly
      - Direct to company websites or landing pages
      - Provide quick access to social profiles
      - Share digital catalogs or promotions
      The design shown is just a starting point - we customize every aspect according to your preferences.

      Intelligent ID Badges
      Our NFC badges represent the future of corporate identification. Beyond traditional recognition functions, each badge contains:
      - Complete professional profile accessible via smartphone
      - Verifiable credentials and certifications
      - Immediate professional contact information
      - Access control system integration
      The presented model is indicative - we create custom designs tailored to your company's needs.

      Display Solutions
      Counter displays transform into interactive information points. We design ideal solutions for your needs, customizing dimensions, materials, and style to best showcase your commercial offering.

      Each product in our range represents just a starting point - the real strength lies in complete customization, allowing each gadget to be adapted to your specific needs.`,
      imageUrl: '/images/projects/nfc-gadgets.png',
      details: {
        material: 'PETG, PLA, PETG-CF',
        printTime: 'Varies by product',
        quality: '0.16mm layer',
        size: 'Various sizes'
      },
      challenges: [
        'NFC integration in compact designs',
        'Ensuring durability for daily use',
        'Maintaining signal strength through materials',
        'Creating user-friendly programming interfaces'
      ],
      benefits: [
        'Instant digital information sharing',
        'Complete customization options',
        'Professional brand representation',
        'Integration with existing systems'
      ],
      cta: {
        text: 'Explore Corporate Gadgets',
        link: '/gadget-aziendali'
      }
    },
    {
      id: '4',
      title: 'Restaurant Accessories Collection',
      category: 'Hospitality',
      description: 'Innovative and customizable restaurant accessories designed to enhance dining experience and operational efficiency.',
      longDescription: `Our restaurant accessories collection represents a perfect blend of functionality and style, designed specifically for modern dining establishments. Each piece is customizable to match your restaurant's branding and aesthetic needs.

      QR Menu & WiFi Cube (5x5x5cm)
      An elegant table accessory that combines multiple functions:
      - Two vertical faces customizable with your restaurant logo
      - Two faces featuring QR codes for digital menu and WiFi access
      - Available in various colors and finishes
      - Optional NFC tag integration
      - Made from eco-friendly, liquid-resistant material

      Professional Coasters (9cm)
      High-quality coasters made from PETG-CF (Carbon Fiber reinforced):
      - Ultra-resistant to impacts and high temperatures
      - Customizable with restaurant logo
      - Available in various colors
      - Carbon fiber finish for timeless elegance
      - Superior durability for intensive use

      Bag Holders
      Elegant table-side solution for guests' bags:
      - Keeps bags safely elevated from the floor
      - Customizable with restaurant branding
      - Available in various finishes and colors
      - Designed to complement your interior décor

      Each item in our collection is designed with both practicality and aesthetics in mind, helping restaurants create a more organized and professional dining environment while enhancing the customer experience.`,
      imageUrl: '/images/projects/restaurant-accessories.png',
      details: {
        material: 'PETG, PETG-CF, PLA',
        printTime: 'Varies by product',
        quality: '0.16mm layer',
        size: 'Various dimensions'
      },
      challenges: [
        'Ensuring durability for intensive commercial use',
        'Maintaining aesthetic appeal with functional design',
        'Creating efficient QR code placement for easy scanning',
        'Developing hygienic and easy-to-clean surfaces'
      ],
      benefits: [
        'Complete customization options',
        'Professional brand representation',
        'Improved dining experience',
        'Durable and practical solutions',
        'Modern technology integration'
      ],
      cta: {
        text: 'Explore Restaurant Accessories',
        link: '/accessori-ristorativi'
      }
    },
    {
      id: '5',
      title: 'Custom Mechanical Components',
      category: 'Industrial',
      description: 'High-precision mechanical components printed in PETG with reinforced infill for industrial applications.',
      longDescription: `This project involved creating custom mechanical components for an industrial automation system. The client needed specialized parts not available on the market and required quick turnaround times.

The components were designed with specific tolerances and mechanical properties to withstand industrial use. We used PETG material with reinforced infill patterns to ensure maximum durability while maintaining reasonable print times.

The final implementation led to significant cost savings compared to traditional manufacturing methods, meeting all functional requirements.`,
      imageUrl: '/images/projects/comp.png',
      details: {
        material: 'PETG',
        printTime: '14 hours',
        quality: '0.1mm layer',
        size: '15 × 8 × 5 cm'
      },
      challenges: [
        'Complex geometry requiring precise tolerances',
        'High strength requirements for industrial use',
        'Need for heat resistance up to 70°C',
        'Integration with existing mechanical systems'
      ],
      benefits: [
        '60% cost reduction compared to traditional manufacturing',
        'Rapid iteration capability for design optimization',
        'Custom functionality impossible with traditional methods',
        'Immediate availability of spare parts'
      ]
    },
    {
      id: '6',
      title: 'Custom Medical Prosthetics',
      category: 'Medical',
      description: 'Customized prosthetic devices printed with biocompatible materials for individual patient needs.',
      longDescription: `This groundbreaking project focuses on creating personalized prosthetic solutions using advanced 3D printing technologies. Each prosthetic is custom-designed to match the patient's specific measurements and requirements.

      Key Achievements:
      - Reduced production time by 60% compared to traditional methods
      - Decreased costs by 45% while maintaining high quality
      - Improved patient comfort through precise customization
      - Integrated lightweight internal structures

      Technical Specifications:
      - Biocompatible materials certified for medical use
      - High-precision printing with 50-micron layer height
      - Optimized support structures for minimal post-processing
      - Integrated comfort features for extended wear

      The project has successfully helped dozens of patients regain mobility and confidence, while establishing new standards for prosthetic manufacturing.`,
      imageUrl: '/images/projects/medical.jpg',
      details: {
        material: 'Medical-grade PEEK',
        printTime: '32 hours',
        quality: '0.05mm layer',
        size: '25 × 12 × 8 cm'
      },
      challenges: [
        'Meeting medical certification requirements',
        'Achieving perfect fit for each patient',
        'Ensuring long-term durability',
        'Optimizing weight while maintaining strength'
      ],
      benefits: [
        'Fully customized solutions for each patient',
        'Rapid production and delivery',
        'Significant cost reduction',
        'Improved comfort and functionality'
      ]
    }
  ],
  it: [
    {
      id: '0',
      title: 'Stampa 3D in Odontotecnica: Una Nuova Era',
      category: 'Medicale',
      description: 'Innovazioni e applicazioni pratiche della stampa 3D nel settore odontotecnico, per studi dentistici e laboratori.',
      longDescription: `Negli ultimi anni, la stampa 3D ha rivoluzionato il settore odontotecnico, portando innovazione, efficienza e nuove opportunità sia per i laboratori che per gli studi dentistici. Ma quali sono le reali possibilità offerte da questa tecnologia? E perché sempre più professionisti del dentale la scelgono ogni giorno?

### Velocità, Precisione e Personalizzazione

La stampa 3D permette di trasformare una scansione digitale in un modello fisico in poche ore. Che si tratti di un modello dentale per la pianificazione di un trattamento, di una dima chirurgica per implantologia o di un bite per il bruxismo, la rapidità di esecuzione è uno dei vantaggi più apprezzati.  
Inoltre, la precisione raggiunta dalle stampanti di ultima generazione garantisce risultati affidabili e ripetibili, riducendo errori e rifacimenti.

### Applicazioni Pratiche: Dal Modello Diagnostico alla Protesi di Prova

Con la stampa 3D oggi è possibile realizzare:
- **Modelli dentali**: ideali per la diagnosi, la comunicazione col paziente e la pianificazione di trattamenti ortodontici o protesici.
- **Dime chirurgiche**: guide personalizzate che aumentano la sicurezza e la precisione negli interventi di implantologia.
- **Bite e splint**: dispositivi su misura per il trattamento del bruxismo o per la protezione dentale.
- **Vassoi individuali per impronte**: per ottenere impronte più precise e confortevoli.
- **Protesi provvisorie, corone e ponti di prova**: soluzioni rapide per testare estetica e funzionalità prima della realizzazione definitiva.

### Vantaggi per Studi e Laboratori

- **Riduzione dei tempi di consegna**: la produzione interna o tramite un servizio specializzato permette di ottenere i dispositivi in tempi molto più brevi rispetto ai metodi tradizionali.
- **Risparmio sui costi**: meno sprechi di materiale, meno passaggi manuali, meno errori.
- **Maggiore comunicazione**: il paziente può vedere e toccare con mano il risultato finale già in fase di progettazione, aumentando la sua fiducia e soddisfazione.
- **Flessibilità**: possibilità di personalizzare ogni dispositivo in base alle esigenze specifiche del paziente.

### Il Futuro è Digitale

La stampa 3D non sostituisce la competenza dell'odontotecnico, ma la potenzia. Permette di lavorare in modo più digitale, preciso e veloce, integrando la tradizione artigianale con le tecnologie più avanzate.

Noi di **3DMAKES** crediamo che il futuro dell'odontotecnica sia già qui: un futuro fatto di collaborazione, innovazione e qualità.  
Se sei uno studio dentistico o un laboratorio e vuoi scoprire come la stampa 3D può migliorare il tuo lavoro, contattaci: saremo felici di mostrarti dal vivo le possibilità di questa straordinaria tecnologia!

**Marco Pagani – 3DMAKES**  
info@3dmakes.ch | +41 76 266 03 96`,
      imageUrl: '/images/progetti/dental.png',
      details: {
        material: 'Resine biocompatibili, PETG, PLA',
        printTime: 'Variabile per tipo di applicazione',
        quality: 'strato 0.05-0.1mm',
        size: 'Personalizzato secondo necessità cliniche'
      },
      challenges: [
        'Ottenere precisione entro tolleranze cliniche',
        'Utilizzo di materiali biocompatibili certificati',
        'Garantire riproducibilità dei risultati',
        'Integrazione con flussi di lavoro digitali esistenti'
      ],
      benefits: [
        'Riduzione significativa dei tempi di produzione',
        'Maggiore precisione rispetto ai metodi tradizionali',
        'Possibilità di personalizzazione completa',
        'Migliore comunicazione con il paziente',
        'Integrazione perfetta tra digitale e manuale'
      ],
      cta: {
        text: 'Scopri le applicazioni dentali',
        link: '/stampa-3d-odontoiatria'
      }
    },
    {
      id: '1',
      title: 'Ciotole Personalizzabili',
      category: 'Accessori per Animali',
      description: 'Collezione di ciotole e accessori per animali domestici realizzati con stampa 3D in materiali selezionati per garantire sicurezza e praticità.',
      longDescription: `La nostra linea di ciotole personalizzabili è stata progettata pensando al benessere degli animali domestici. Offriamo diverse soluzioni adatte alle esigenze specifiche di cani e gatti.

Le ciotole slow feeding, realizzate in PETG, sono pensate per rallentare l'assunzione di cibo, prevenendo problemi digestivi e obesità. Il PETG è un materiale che trattiene pochissimi batteri ed è estremamente resistente, ideale per il contatto con gli alimenti.

Per chi preferisce le classiche ciotole in acciaio inox, offriamo strutture di supporto in PLA (materiale organico e biodegradabile) in diverse dimensioni: due misure per cani (14 cm e 16 cm di diametro) e una misura standard per gatti. Queste strutture possono essere personalizzate con il nome del tuo animale e in diversi colori.

Completiamo la gamma con il ciondolo NFC in PETG-CF, rinforzato in fibra di carbonio per garantire elevata resistenza pur mantenendo un peso di soli 5g. Il tag NFC integrato contiene tutte le informazioni essenziali del tuo animale e i tuoi dati di contatto, funzionando anche dove non c'è connessione a internet.`,
      imageUrl: '/images/projects/ciotole.png',
      details: {
        material: 'PETG, PLA, PETG-CF, Acciaio Inox',
        printTime: 'Variabile per modello',
        quality: '0.16mm layer',
        size: 'Varie dimensioni'
      },
      challenges: [
        'Creazione di design slow feeding efficaci',
        'Ottimizzazione della resistenza per uso quotidiano',
        'Personalizzazione mantenendo la funzionalità',
        'Miniaturizzazione del tag NFC per il ciondolo'
      ],
      benefits: [
        'Materiali selezionati per uso alimentare e sicurezza',
        'Personalizzazione completa (nome e colori)',
        'Soluzioni specifiche per esigenze diverse',
        'Ciondolo di identificazione funzionante ovunque'
      ],
      cta: {
        text: 'Personalizza la tua ciotola',
        link: '/ciotole-personalizzabili'
      }
    },
    {
      id: '2',
      title: 'Cuscinetti in TPU per Ferrature Equine',
      category: 'Equitazione',
      description: 'Cuscinetti in TPU stampati in 3D su misura per ferrature dei cavalli, progettati per ridurre lo stress articolare e migliorare l\'aderenza su vari terreni.',
      longDescription: `Questo progetto innovativo offre un miglioramento significativo nella tradizionale ferratura dei cavalli incorporando cuscinetti in TPU (Poliuretano Termoplastico) progettati su misura. Questi cuscinetti possono essere installati sia prima che dopo il ferro di cavallo metallico, fornendo molteplici benefici per la salute e le prestazioni del cavallo.

Il TPU è un materiale ideale per questa applicazione grazie alle sue proprietà uniche. Combina l'elasticità della gomma con la durabilità e la lavorabilità dei termoplastici. Il materiale offre eccellenti capacità di assorbimento degli urti mantenendo la resilienza nel tempo, anche sotto lo stress significativo del movimento equino.

I cuscinetti servono a molteplici scopi:
- Riduzione dello stress da impatto su articolazioni, tendini e legamenti
- Miglioramento della trazione su varie superfici, compreso il terreno scivoloso o irregolare
- Attenuazione delle vibrazioni su superfici dure
- Migliore distribuzione del peso su tutto lo zoccolo

Ogni cuscinetto è progettato su misura in base alle specifiche misurazioni e necessità del cavallo. Utilizzando la tecnologia di scansione 3D, creiamo modelli precisi che si adattano perfettamente alla forma e alle dimensioni dello zoccolo. Questo livello di personalizzazione permette di affrontare problemi biomeccanici individuali che potrebbero influire sulle prestazioni o sul comfort del cavallo.

L'implementazione ha mostrato risultati notevoli, con cavalieri che riportano prestazioni migliorate, riduzione dei problemi di zoppia e maggiore comfort per i loro cavalli, specialmente su terreni difficili o durante attività intensive.`,
      imageUrl: '/images/projects/horseshoe.png',
      details: {
        material: 'TPU (Poliuretano Termoplastico)',
        printTime: '3-4 ore per set',
        quality: 'strato 0.2mm',
        size: 'Personalizzato secondo le specifiche del cavallo'
      },
      challenges: [
        'Creazione di design compatibili con ferri standard',
        'Garantire durabilità in condizioni di stress estremo',
        'Ottimizzare la flessibilità mantenendo l\'integrità strutturale',
        'Sviluppare soluzioni personalizzate per diverse discipline equestri'
      ],
      benefits: [
        'Riduzione dello stress su articolazioni e legamenti del cavallo',
        'Miglioramento dell\'aderenza su vari terreni',
        'Migliore assorbimento degli urti su superfici dure',
        'Maggiore longevità della ferratura',
        'Personalizzabile per risolvere problemi specifici di movimento'
      ],
      cta: {
        text: 'Leggi la ricerca completa',
        link: '/ricerca-ferratura-tpu'
      }
    },
    {
      id: '3',
      title: 'Gadget Aziendali NFC Smart',
      category: 'Innovazione Aziendale',
      description: 'Gadget aziendali smart con tecnologia NFC integrata per il networking aziendale moderno e l\'interazione digitale.',
      longDescription: `La nostra innovativa linea di gadget aziendali con tecnologia NFC rappresenta un'importante evoluzione nel networking aziendale e nella promozione del brand. Ogni articolo combina design elegante e funzionalità smart, creando potenti punti di contatto per l'interazione digitale.

      Portachiavi NFC Smart
      Abbiamo reinventato il tradizionale portachiavi aziendale integrando la tecnologia NFC. Ogni portachiavi diventa un punto di contatto digitale che può:
      - Condividere biglietti da visita digitali istantaneamente
      - Indirizzare a siti web aziendali o landing page
      - Fornire accesso rapido ai profili social
      - Condividere cataloghi digitali o promozioni
      Il design mostrato è solo un punto di partenza - personalizziamo ogni aspetto secondo le tue preferenze.

      Badge Identificativi Intelligenti
      I nostri badge NFC rappresentano il futuro dell'identificazione aziendale. Oltre alle funzioni di riconoscimento tradizionali, ogni badge contiene:
      - Profilo professionale completo accessibile via smartphone
      - Credenziali e certificazioni verificabili
      - Informazioni di contatto professionale immediate
      - Integrazione con sistemi di controllo accessi
      Il modello presentato è indicativo - creiamo design personalizzati su misura per la tua azienda.

      Soluzioni Espositive
      Gli espositori da banco si trasformano in punti informativi interattivi. Progettiamo soluzioni ideali per le tue esigenze, personalizzando dimensioni, materiali e stile per valorizzare al meglio la tua offerta commerciale.

      Ogni prodotto della nostra gamma rappresenta solo un punto di partenza - la vera forza sta nella personalizzazione completa, che permette di adattare ogni gadget alle tue esigenze specifiche.`,
      imageUrl: '/images/projects/nfc-gadgets.png',
      details: {
        material: 'PETG, PLA, PETG-CF',
        printTime: 'Varia per prodotto',
        quality: 'strato 0.16mm',
        size: 'Dimensioni varie'
      },
      challenges: [
        'Integrazione NFC in design compatti',
        'Garanzia di durabilità per uso quotidiano',
        'Mantenimento della forza del segnale attraverso i materiali',
        'Creazione di interfacce di programmazione intuitive'
      ],
      benefits: [
        'Condivisione istantanea di informazioni digitali',
        'Opzioni di personalizzazione complete',
        'Rappresentazione professionale del brand',
        'Integrazione con sistemi esistenti'
      ],
      cta: {
        text: 'Esplora i Gadget Aziendali',
        link: '/gadget-aziendali'
      }
    },
    {
      id: '4',
      title: 'Collezione Accessori Ristorativi',
      category: 'Ristorazione',
      description: 'Accessori innovativi e personalizzabili per ristoranti, progettati per migliorare l\'esperienza di ristorazione e l\'efficienza operativa.',
      longDescription: `La nostra collezione di accessori per la ristorazione rappresenta una perfetta fusione tra funzionalità e stile, progettata specificamente per i moderni locali di ristorazione. Ogni pezzo è personalizzabile per adattarsi al branding e alle esigenze estetiche del tuo ristorante.

      Cubo QR Menu & WiFi (5x5x5cm)
      Un elegante accessorio da tavolo che combina più funzioni:
      - Due facce verticali personalizzabili con il logo del tuo ristorante
      - Due facce con codici QR per menu digitale e accesso WiFi
      - Disponibile in vari colori e finiture
      - Possibilità di integrazione tag NFC
      - Realizzato in materiale ecologico e resistente ai liquidi

      Sottobicchieri Professionali (9cm)
      Sottobicchieri di alta qualità in PETG-CF (rinforzato in fibra di carbonio):
      - Ultra resistenti agli urti e alle alte temperature
      - Personalizzabili con il logo del ristorante
      - Disponibili in diverse colorazioni
      - Finitura in fibra di carbonio per un'eleganza senza tempo
      - Durabilità superiore per uso intensivo

      Poggia Borse
      Elegante soluzione da tavolo per le borse degli ospiti:
      - Mantiene le borse sollevate da terra in modo sicuro
      - Personalizzabile con il brand del ristorante
      - Disponibile in diverse finiture e colori
      - Progettato per integrarsi con l'arredamento

      Ogni elemento della nostra collezione è progettato pensando sia alla praticità che all'estetica, aiutando i ristoranti a creare un ambiente più organizzato e professionale migliorando al contempo l'esperienza del cliente.`,
      imageUrl: '/images/projects/restaurant-accessories.png',
      details: {
        material: 'PETG, PETG-CF, PLA',
        printTime: 'Variabile per prodotto',
        quality: 'strato 0.16mm',
        size: 'Dimensioni varie'
      },
      challenges: [
        'Garantire durabilità per uso commerciale intensivo',
        'Mantenere appeal estetico con design funzionale',
        'Creare posizionamento efficiente dei QR code per facile scansione',
        'Sviluppare superfici igieniche e facili da pulire'
      ],
      benefits: [
        'Opzioni di personalizzazione complete',
        'Rappresentazione professionale del brand',
        'Esperienza di ristorazione migliorata',
        'Soluzioni durevoli e pratiche',
        'Integrazione tecnologica moderna'
      ],
      cta: {
        text: 'Esplora gli Accessori Ristorativi',
        link: '/accessori-ristorativi'
      }
    },
    {
      id: '5',
      title: 'Componenti Meccanici Personalizzati',
      category: 'Industriale',
      description: 'Componenti meccanici di alta precisione stampati in PETG con riempimento rinforzato per applicazioni industriali.',
      longDescription: `Questo progetto ha coinvolto la creazione di componenti meccanici personalizzati per un sistema di automazione industriale. Il cliente necessitava di parti specializzate non disponibili sul mercato e richiedeva tempi di consegna rapidi.

I componenti sono stati progettati con tolleranze specifiche e proprietà meccaniche per resistere all'uso industriale. Abbiamo utilizzato materiale PETG con pattern di riempimento rinforzati per garantire la massima durabilità mantenendo tempi di stampa ragionevoli.

L'implementazione finale ha portato a significativi risparmi sui costi rispetto ai metodi di produzione tradizionali, soddisfacendo tutti i requisiti funzionali.`,
      imageUrl: '/images/projects/comp.png',
      details: {
        material: 'PETG',
        printTime: '14 ore',
        quality: '0.1mm layer',
        size: '15 × 8 × 5 cm'
      },
      challenges: [
        'Geometria complessa che richiede tolleranze precise',
        'Elevati requisiti di resistenza per uso industriale',
        'Necessità di resistenza al calore fino a 70°C',
        'Integrazione con sistemi meccanici esistenti'
      ],
      benefits: [
        'Riduzione dei costi del 60% rispetto alla produzione tradizionale',
        'Capacità di iterazione rapida per ottimizzazione del design',
        'Funzionalità personalizzate impossibili con metodi tradizionali',
        'Disponibilità immediata di parti di ricambio'
      ]
    },
    {
      id: '6',
      title: 'Protesi Mediche Personalizzate',
      category: 'Medicale',
      description: 'Dispositivi protesici personalizzati stampati con materiali biocompatibili per le esigenze individuali dei pazienti.',
      longDescription: `Questo progetto innovativo si concentra sulla creazione di soluzioni protesiche personalizzate utilizzando tecnologie di stampa 3D avanzate. Ogni protesi è progettata su misura per adattarsi alle misure e ai requisiti specifici del paziente.

      Risultati Chiave:
      - Riduzione del 60% dei tempi di produzione rispetto ai metodi tradizionali
      - Diminuzione dei costi del 45% mantenendo alta qualità
      - Miglioramento del comfort del paziente attraverso personalizzazione precisa
      - Strutture interne leggere integrate

      Specifiche Tecniche:
      - Materiali biocompatibili certificati per uso medico
      - Stampa ad alta precisione con altezza dello strato di 50 micron
      - Strutture di supporto ottimizzate per minima post-elaborazione
      - Caratteristiche di comfort integrate per uso prolungato

      Il progetto ha aiutato con successo decine di pazienti a recuperare mobilità e fiducia, stabilendo nuovi standard per la produzione di protesi.`,
      imageUrl: '/images/projects/medical.jpg',
      details: {
        material: 'PEEK grado medicale',
        printTime: '32 ore',
        quality: 'strato 0.05mm',
        size: '25 × 12 × 8 cm'
      },
      challenges: [
        'Soddisfare i requisiti di certificazione medica',
        'Ottenere una vestibilità perfetta per ogni paziente',
        'Garantire durabilità a lungo termine',
        'Ottimizzare il peso mantenendo la resistenza'
      ],
      benefits: [
        'Soluzioni completamente personalizzate per ogni paziente',
        'Produzione e consegna rapide',
        'Riduzione significativa dei costi',
        'Comfort e funzionalità migliorati'
      ]
    }
  ]
};