export const translations = {
  en: {
    quote: {// Quote Calculator
      title: "Get an Instant Quote",
      uploadTitle: "Upload Your 3D Model",
      dropzoneText: "Drop your STL or OBJ file here, or click to browse",
      fileRequirements: "Maximum file size: 50MB • Supported formats: STL, OBJ",
      modelAnalysis: "Model Analysis",
      volume: "Volume",
      surfaceArea: "Surface Area",
      width: "Width",
      height: "Height",
      depth: "Depth",
      printTime: "Print Time",
      material: "Material",
      printQuality: "Print Quality",
      
      printSettings: "Print Settings",
      quantity: "Quantity",
      bulkDiscount: "10% bulk discount applied!",
      draftp: "Fast print, less details",
      standard: "Standard print, good quality",
      high: "High quality, fine details",
      ultra_high: "Ludicrous quality (only resin, +30CHF)",
      addCost: "This option incurs an additional cost of 30 CHF",
      price1: "The price of the model would be ",
      price2: " CHF",
      cost1: "Total cost for ",
      cost2: " pieces:",
      pla: "Cheap and easy to print",
      petg: "Versatile and resistant",
      abs: "Durable and heat resistant",
      tpu: "Elastic and soft",
      petg_cf: "PETG with carbon fiber",
      pc: "High-performance polymer",
      nylon: "Strong and durable",
      resin: "Ultra-high precision, only for Ultra High",
      size: "Detected size",
      calculatePrice: "Calculate Price",
      uploadPrompt: "Upload a 3D model to preview",
      hours: "hours",
      attachment: 'Attach file'
    },      printSettings: "Impostazioni di Stampa",
    fileError: {
      tooLarge: "File is too  large. Please upload a file smaller than 50MB.",
      invalidFormat: "Please upload an STL or OBJ file"
    },
    materials: {
      pla: "PLA - Standard",
      petg: "PETG - Versatile",
      abs: "ABS - Durable"
    },
    qualities: {
      draft: "Draft (0.3mm) - Fast & Economical",
      standard: "Standard (0.2mm) - Balanced Quality",
      high: "High Quality (0.1mm) - Fine Detail"
    },
    // Navigation
    nav: {
      home: "Home",
      services: "Services",
      getQuote: "Get Quote",
      projects: "Projects",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact"
    },

    // Hero Section
    hero: {
      highlightedTitle: "3D Printing -",
      remainingTitle: "Turn Your Ideas into Reality",
      subtitle: "From rapid prototyping to custom production, we bring your ideas to life with precision, speed, and top quality.",
      getQuote: "Get a Free Quote",
      ourServices: "Explore Our Services",
      whatsapp: "Contact Us on WhatsApp"
    },

    // Services Section
    services: {
      title: "Our Services",
      printing_FDM: {
        title: "FDM 3D Printing",
        description: "We offer FDM printing services for the creation of prototypes and functional parts.",
        features: [
          "Printing volume up to 300×300×300 mm",
          "Precision and durability for functional components",
          "Wide selection of technical materials (PLA, ABS, PETG, TPU, etc.)",
          "Customizable colors to meet every need"
        ]
      },
      
      printing_SLA: {
        title: "SLA 3D Printing",
        description: "SLA printing services for highly detailed parts and smooth surfaces, ideal for high-precision applications.",
        features: [
          "Printing volume up to 220×125×200 mm",
          "Ultra-fine resolution up to 0,01 mm",
          "Smooth surfaces and high precision details",
          "Specialized materials for various industries",
          "Perfect for jewelry, dentistry, and modeling"
        ]
      },
      scanning: {
        title: "3D Scanning",
        description: "Professional 3D scanning services for reverse engineering and quality control.",
        features: [
          "Accuracy up to 0.1 mm",
          "Capture textures in full color",
          "Scanning of large objects",
          "Product digitization"
        ]
      },
      design: {
        title: "Design Services",
        description: "Professional 3D design and modeling solutions to bring your ideas to life.",
        features: [
          "Design optimization for 3D printing",
          "Custom design for specific needs",
          "Photorealistic renderings",
          "Prototyping support"
        ]
      }
    },

    // Projects Section
    projects: {
      title: "Featured Projects",
      viewDetails: "View Details",
      readMore: "See More Projects",
      showLess: "Show Less",
      showMore: "Show More",
      categories: {
        industrial: "Industrial",
        architecture: "Architecture",
        medical: "Medical",
        robotics: "Robotics"
      },
      details: {
        material: "Material",
        printTime: "Print Time",
        quality: "Quality",
        size: "Size",
        challenges: "Challenges Overcome",
        benefits: "Key Benefits"
      }
    },

    // Blog Section
    blog: {
      title: "Latest Insights",
      readTime: "min read",
      readMore: "See More Insights",
      showLess: "Show Less",
      by: "By"
    },

    // Why Choose Us Section
    whyChooseUs: {
      title: "Why Choose Us",
      expertTeam: {
        title: "Expert Team",
        description: "Our team of certified professionals brings years of experience in 3D printing and design."
      },
      quality: {
        title: "Quality Guaranteed",
        description: "We use industrial-grade materials and maintain strict quality control standards."
      },
      turnaround: {
        title: "Fast Turnaround",
        description: "Quick delivery times without compromising on quality, with regular status updates."
      },
      pricing: {
        title: "Competitive Pricing",
        description: "Transparent pricing with no hidden costs, and bulk order discounts available."
      }
    },

    // FAQ Section
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our 3D printing, scanning, and design services. Can't find what you're looking for? Contact us directly.",
      categories: {
        printing: "3D Printing Services",
        scanning: "3D Scanning",
        pricing: "Pricing & Orders",
        quality: "Quality & Support"
      }
    },

    chatbot: {
      title: "3D Printing Assistant",
      subtitle: "Ask me anything about 3D printing!",
      inputPlaceholder: "Type your question here...",
      responses: {
        materials: "we offer a wide range of materials including PLA, PETG, ABS, and specialty filaments. Each material has unique properties suitable for different applications.",
        pricing: "Our pricing is based on factors like material volume, print time, and complexity. You can get an instant quote using our calculator above.",
        process: "The 3D printing process starts with your 3D model. We'll analyze it, suggest optimal print settings, and ensure the highest quality output.",
        default: "I'm here to help with any questions about 3D printing. Feel free to ask about materials, pricing, or our services!"
      }
    },
    // Contact Section
    contact: {
      title: "Contact Us",
      form: {
        title: "Send Us a Message",
        name: "Name",
        email: "Email",
        phone: "Phone",
        projectType: {
          label: "Project Type",
          general: "General Inquiry",
          quote: "Quote Request",
          prototype: "Prototyping Project",
          scanning: "3D Scanning Service",
          bulk: "Bulk Production"
        },
        message: "Message",
        attachment: "Attach file",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
        validation: {
          name: "Please enter your name",
          email: "Please enter a valid email address",
          message: "Please enter a message"
        }
      },
      info: {
        title: "Contact Information",
        address: "Address",
        email: "Email",
        phone: "Phone",
        hours: "Business Hours",
        workdays: "Monday - Friday: 9:00 - 18:00",
        saturday: "Saturday: By appointment",
        sunday: "Sunday: Closed"
      },
      location: {
        title: "Location",
        controls: "🖱️ Left click + drag to rotate\n🖱️ Right click + drag to pan\n🖱️ Scroll to zoom"
      }
    },

    search: {
      title: "Search Your 3D Model",
      subtitle: "Not sure what to print? Get inspired by the search engine!",
      instructions: "Once you find the model you like, download it and upload it in the next section to realize it"
    },

    horseshoeResearch: {
      title: "Research on Equine Horseshoeing with TPU Cushions",
      downloadPdf: "Download PDF",
      backToProject: "Back to Project",
    },

    dental: {
      title: "3D Printing in Dentistry",
      subtitle: "Innovative solutions for dental clinics and laboratories",
      section1: {
        title: "Revolutionizing Dental Practice",
        content: "3D printing technology is transforming dentistry by enabling rapid production of precise, customized dental models, surgical guides, and other dental appliances. This technology offers significant advantages in terms of speed, accuracy, and cost-effectiveness compared to traditional methods."
      },
      section2: {
        title: "Precision and Personalization",
        content: "Our dental 3D printing services provide superior accuracy and detail, allowing for completely personalized solutions for each patient. Using high-resolution printers and biocompatible materials, we ensure clinically acceptable results that meet all necessary requirements.",
        imageAlt: "Dental models printed in 3D"
      },
      applications: {
        title: "Applications in Dentistry",
        items: {
          1: {
            title: "Dental Models",
            description: "High-precision models for diagnosis, treatment planning, and patient communication."
          },
          2: {
            title: "Surgical Guides",
            description: "Custom guides that increase safety and precision in implantology procedures."
          },
          // e così via per gli altri elementi
        }
      },
      contact: {
        title: "Get in Touch",
        description: "Interested in implementing 3D printing in your dental practice? Contact us for a consultation."
      }
    }
  },

  it: {
    // Calcolatore Preventivi
    quote: {
      title: "Ottieni un Preventivo Istantaneo",
      uploadTitle: "Carica il Tuo Modello 3D",
      dropzoneText: "Trascina qui il tuo file STL o OBJ, o clicca per sfogliare",
      fileRequirements: "Dimensione massima: 50MB • Formati supportati: STL, OBJ",
      modelAnalysis: "Analisi del Modello",
      printTime: "Tempo di Stampa",
      material: "Materiale",
      printQuality: "Qualità di Stampa",
      printSettings: "Impostazioni di Stampa",
      quantity: "Quantità",
      bulkDiscount: "Sconto del 10% applicato!",
      calculatePrice: "Calcola Prezzo",
      uploadPrompt: "Carica un modello 3D per l'anteprima",
      draftp: "Stampa veloce, meno dettagli",
      standard: "Stampa standard, buona qualità",
      high: "Stampa ad alta precisione, dettagli precisi",
      ultra_high: "Qualità estrema (solo resina, +30CHF)",
      pla: "Economico e facile da stampare",
      petg: "Versatile e resistente",
      abs: "Robusto e resistente al calore",
      tpu: "Elastico e morbido",
      petg_cf: "PETG con fibre di carbonio",
      pc: "Policarbonato ad alta resistenza",
      nylon: "Forte e durevole",
      resin: "Alta precisione, solo per Ultra High",
      size: "Dimensioni rilevate",
      price1: "Il prezzo del modello sarebbe di ",
      price2: " CHF",
      addCost: "Questa opzione comporta un costo aggiuntivo di 30 CHF",
      cost1: "Costo totale per ",
      cost2: " pezzi:",
      fileError: {
        tooLarge: "File troppo grande. Carica un file più piccolo di 50MB.",
        invalidFormat: "Carica un file STL o OBJ"
      },
      modelError: {
        tooSmall: "Il modello è troppo piccolo (min 20mm).",
        tooLarge: "Il modello è troppo grande (max 300mm). Contattaci per stamparlo in più parti."
      },
      connectionError: "Errore di connessione con il server",
      singlePriceWarning: "Il prezzo del singolo pezzo sarebbe di {singlePrice.toFixed(2)} CHF, ma c'è un minimo d'ordine di 15 CHF.",
      attachment: 'Allega file'
    },
    // Navigazione
    nav: {
      home: "Home",
      services: "Servizi",
      getQuote: "Preventivo",
      projects: "Progetti",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contatti"
    },

    // Sezione Hero
    hero: {
      highlightedTitle: "Stampa 3D - ",
      remainingTitle: "Trasforma le tue idee in realtà",
      subtitle: "Dal prototipo alla produzione su misura: diamo vita alle tue idee con precisione, velocità e qualità superiore.",
      getQuote: "Richiedi un Preventivo Gratuito",
      ourServices: "Scopri i Nostri Servizi",
      whatsapp: "Contattaci su WhatsApp"
    },

    // Sezione Servizi
    services: {
      title: "I Nostri Servizi",
      printing_FDM: {
        title: "Stampa 3D FDM",
        description: "Offriamo servizi di stampa FDM per la realizzazione di prototipi e parti funzionali.",
        features: [
          "Volume di stampa fino a 300×300×300 mm",
          "Precisione e resistenza per componenti funzionali",
          "Ampia gamma di materiali tecnici (PLA, ABS, PETG, TPU, ecc.)",
          "Colori personalizzabili per soddisfare ogni esigenza"
        ]
      },
      printing_SLA: {
        title: "Stampa 3D SLA",
        description: "Servizi di stampa SLA per parti estremamente dettagliate e superfici lisce, ideali per applicazioni di alta precisione.",
        features: [
          "Volume di stampa fino a 220×125×200 mm",
          "Risoluzione ultra fine fino a 0,010 mm",
          "Superfici lisce e dettagli precisi",
          "Materiali specializzati per vari settori",
          "Perfetto per gioielleria, odontoiatria e modellismo"
        ]
      },
      scanning: {
        title: "Scansione 3D",
        description: "Servizi professionali di scansione 3D per reverse engineering e controllo qualità.",
        features: [
          "Precisione fino a 0.1 mm",
          "Cattura texture a colori",
          "Scansione oggetti grandi",
          "Digitalizzazione di prodotti"
        ]
      },
      design: {
        title: "Servizi di Design",
        description: "Servizio di design e modellazione 3D per i tuoi progetti.",
        features: [
          "Ottimizzazione del design per la stampa 3D",
          "Progettazione su misura per esigenze specifiche",
          "Rendering fotorealistici",
          "Supporto nella prototipazione"
        ]
      },
    },

    // Sezione Progetti
    projects: {
      title: "Progetti in Evidenza",
      viewDetails: "Vedi Dettagli",
      readMore: "Vedi Altri Progetti",
      showLess: "Mostra Meno",
      showMore: "Mostra altri progetti",
      categories: {
        industrial: "Industriale",
        architecture: "Architettura",
        medical: "Medicale",
        robotics: "Robotica"
      },
      details: {
        material: "Materiale",
        printTime: "Tempo di Stampa",
        quality: "Qualità",
        size: "Dimensioni",
        challenges: "Sfide Superate",
        benefits: "Benefici Chiave"
      }
    },

    // Sezione Blog
    blog: {
      title: "Ultimi Articoli",
      readTime: "min di lettura",
      readMore: "Vedi Altri Articoli",
      showLess: "Mostra Meno",
      by: "Di"
    },

    // Sezione Perché Sceglierci
    whyChooseUs: {
      title: "Perché Sceglierci",
      expertTeam: {
        title: "Team Esperto",
        description: "Il nostro team di professionisti certificati porta anni di esperienza nella stampa 3D e nel design."
      },
      quality: {
        title: "Qualità Garantita",
        description: "Utilizziamo materiali di grado industriale e manteniamo rigorosi standard di controllo qualità."
      },
      turnaround: {
        title: "Consegna Rapida",
        description: "Tempi di consegna rapidi senza compromettere la qualità, con aggiornamenti regolari sullo stato."
      },
      pricing: {
        title: "Prezzi Competitivi",
        description: "Prezzi trasparenti senza costi nascosti e sconti disponibili per ordini all'ingrosso."
      }
    },

    // Sezione FAQ
    faq: {
      title: "Domande Frequenti",
      subtitle: "Trova risposte alle domande comuni sui nostri servizi di stampa 3D, scansione e design. Non trovi quello che cerchi? Contattaci direttamente.",
      categories: {
        printing: "Servizi di Stampa 3D",
        scanning: "Scansione 3D",
        pricing: "Prezzi e Ordini",
        quality: "Qualità e Supporto"
      }
    },

    // Sezione Contatti
    contact: {
      title: "Contattaci",
      form: {
        title: "Inviaci un Messaggio",
        name: "Nome",
        email: "Email",
        phone: "Telefono",
        projectType: {
          label: "Tipo di Progetto",
          general: "Richiesta Generale",
          quote: "Richiesta Preventivo",
          prototype: "Progetto di Prototipazione",
          scanning: "Servizio di Scansione 3D",
          bulk: "Produzione in Serie"
        },
        message: "Messaggio",
        attachment: "Allega file",
        send: "Invia Messaggio",
        sending: "Invio in corso...",
        success: "Messaggio inviato con successo!",
        error: "Invio fallito. Riprova per favore.",
        validation: {
          name: "Inserisci il tuo nome",
          email: "Inserisci un indirizzo email valido",
          message: "Inserisci un messaggio"
        }
      },
      info: {
        title: "Informazioni di Contatto",
        address: "Indirizzo",
        email: "Email",
        phone: "Telefono",
        hours: "Orari di Apertura",
        workdays: "Lunedì - Venerdì: 9:00 - 18:00",
        saturday: "Sabato: Su appuntamento",
        sunday: "Domenica: Chiuso"
      },
      location: {
        title: "Posizione",
        controls: "🖱️ Click sinistro + trascina per ruotare\n🖱️ Click destro + trascina per spostare\n🖱️ Rotella per zoom"
      }
    },

    chatbot: {
      title: "Assistente Stampa 3D",
      subtitle: "Chiedi qualsiasi cosa sulla stampa 3D!",
      inputPlaceholder: "Scrivi la tua domanda qui...",
      responses: {
        materials: "Offriamo un'ampia gamma di materiali tra cui PLA, PETG, ABS e filamenti speciali. Ogni materiale ha proprietà uniche adatte a diverse applicazioni.",
        pricing: "I nostri prezzi si basano su fattori come il volume del materiale, il tempo di stampa e la complessità. Puoi ottenere un preventivo istantaneo usando il nostro calcolatore qui sopra.",
        process: "Il processo di stampa 3D inizia con il tuo modello 3D. Lo analizzeremo, suggeriremo le impostazioni di stampa ottimali e garantiremo la massima qualità del risultato.",
        default: "Sono qui per aiutarti con qualsiasi domanda sulla stampa 3D. Non esitare a chiedere informazioni sui materiali, prezzi o i nostri servizi!"
      }
    },

    search: {
      title: "Cerca il Tuo Modello 3D",
      subtitle: "Non sai cosa stampare? Lasciati ispirare dal motore di ricerca e scopri nuovi modelli 3D!",
      instructions: "Una volta trovato il modello che ti piace, scaricalo e caricalo nella sezione successiva per realizzarlo"
    },

    horseshoeResearch: {
      title: "Ricerca sulla Ferratura Equina con Cuscinetti in TPU",
      downloadPdf: "Scarica PDF",
      backToProject: "Torna al Progetto",
    },

    dental: {
      title: "Stampa 3D in Odontotecnica",
      subtitle: "Soluzioni innovative per studi dentistici e laboratori",
      service: {
        title: "Il servizio",
        content: "Realizziamo modelli dentali completi o parziali, dime chirurgiche, bite da laboratorio e vassoi individuali tramite stampa 3D professionale. Offro rapidità, precisione (fino a 0.01mm) e prezzi competitivi per studi dentistici e laboratori odontotecnici.<br><br>Lavoro su file STL forniti dal cliente e consegno in tempi brevi modelli di alta qualità, ideali per ortodonzia, protesi, pianificazione e comunicazione col paziente."
      },
      examples: {
        title: "Esempi di applicazioni",
        content: "La stampa 3D permette di ottenere risultati eccellenti in vari ambiti dell'odontoiatria:<br><br>• <strong>Modelli per diagnosi</strong>: precisi e dettagliati per pianificare al meglio i trattamenti<br>• <strong>Guide chirurgiche</strong>: per un posizionamento preciso degli impianti<br>• <strong>Bite e splint</strong>: perfettamente adattati all'anatomia del paziente<br>• <strong>Vassoi individuali</strong>: per impronte precise e confortevoli",
        imageAlt: "Modelli dentali stampati in 3D"
      },
      applications: {
        title: "Applicazioni Pratiche",
        items: {
          1: {
            title: "Modelli Dentali",
            description: "Modelli di alta precisione per diagnosi, pianificazione del trattamento e comunicazione col paziente."
          },
          2: {
            title: "Dime Chirurgiche",
            description: "Guide personalizzate che aumentano sicurezza e precisione negli interventi di implantologia."
          },
          3: {
            title: "Bite e Splint",
            description: "Dispositivi su misura per il trattamento del bruxismo o per la protezione dentale."
          },
          4: {
            title: "Vassoi Individuali",
            description: "Per ottenere impronte più precise e confortevoli per il paziente."
          }
        }
      },
      pricing: {
        title: "Listino Prezzi",
        product: "Prodotto",
        price: "Prezzo (CHF)",
        items: {
          1: {
            name: "Modello dentale arcata singola",
            price: "25"
          },
          2: {
            name: "Modello dentale completo",
            price: "45"
          },
          3: {
            name: "Dima/guida chirurgica (prova)",
            price: "20"
          },
          4: {
            name: "Bite/splint da laboratorio (prova)",
            price: "25"
          }
        }
      },
      additionalServices: {
        title: "Servizi aggiuntivi",
        items: {
          1: "Preparazione file STL: 12 CHF (se necessario)",
          2: "Urgenza (consegna in 12h): +30%",
          3: "Ritiro gratuito - consegna a domicilio (Lugano): 10 CHF (gratuito sopra 100 CHF di ordine)",
          4: "Sconti per ordini multipli o collaborazioni continuative"
        }
      },
      notes: {
        title: "Note",
        items: {
          1: "Tutti i modelli sono destinati a uso extraorale, diagnostico o di laboratorio (no dispositivi certificati per uso intraorale definitivo).",
          2: "Per esigenze particolari o grandi volumi, contattami per un preventivo personalizzato."
        }
      },
      contact: {
        title: "Contattaci",
        description: "Sei interessato a implementare la stampa 3D nel tuo studio o laboratorio? Contattaci per una consulenza."
      }
    }
  }
};

export type Language = keyof typeof translations;
