import React, { useState, useCallback, useEffect } from "react";
import ModelViewer from "./ModelViewer";
import { translations, Language } from "../utils/translations";

interface QuoteCalculatorProps {
  language: Language;
}

// Limiti di dimensione
const MIN_DIM = 2;
const MAX_DIM = 300;

// Prezzo minimo per 1 o più pezzi
const MIN_PRICE = 15;

// Se vuoi cambiare il massimo file, ecc.
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const API_URL = "https://server.3dmakes.ch/upload";

export default function QuoteCalculator({ language }: QuoteCalculatorProps) {
  const t = translations[language];

  // Stato del file
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Dati di stampa
  const [printTime, setPrintTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Parametri
  const [quality, setQuality] = useState<string>("0.2");
  const [material, setMaterial] = useState<string>("pla");

  // Costo per 1 pezzo
  const [singlePrice, setSinglePrice] = useState<number | null>(null);

  // Breakdown cost
  const [materialCost, setMaterialCost] = useState<number | null>(null);
  const [electricityCost, setElectricityCost] = useState<number | null>(null);
  const [depreciationCost, setDepreciationCost] = useState<number | null>(null);

  // Dimensioni
  const [modelDims, setModelDims] = useState<{ x: number; y: number; z: number } | null>(null);

  // Quantità
  const [quantity, setQuantity] = useState<number>(1);
  
  // Stato per drag and drop
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Reset degli stati quando cambia il file
  const resetStates = () => {
    setError(null);
    setPrintTime(null);
    setSinglePrice(null);
    setMaterialCost(null);
    setElectricityCost(null);
    setDepreciationCost(null);
    setIsProcessing(false);
    setUploadProgress(0);
    setModelDims(null);
  };

  // Handler per il caricamento del file (sia tramite input che drag & drop)
  const processFile = (f: File) => {
    resetStates();
    
    if (f.size > MAX_FILE_SIZE) {
      setError("File troppo grande");
      return;
    }
    
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    setFileType(ext);
    setFile(f);
  };

  // Handler per l'input file tradizionale
  const handleFileChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const f = evt.target.files?.[0];
      if (f) {
        processFile(f);
      }
    },
    []
  );

  // Handler per il drag & drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  // Calcolo del prezzo per 1 pezzo
  const calculateSinglePrice = useCallback((printTimeHours: number, materialGrams: number) => {
    // 1) Costo materiale
    const matCost = materialGrams * 0.1;
    setMaterialCost(matCost);

    // 2) Costo elettricità
    const elecCost = printTimeHours * 0.03;
    setElectricityCost(elecCost);

    // 3) Costo ammortamento
    const deprCost = printTimeHours * 0.25;
    setDepreciationCost(deprCost);

    // 4) Totale base
    const base = matCost + elecCost + deprCost;

    // 5) Markup
    const finalPrice = base * 1.35 * 1.35 * 1.2;

    // 6) Se è meno di 15 per 1 pezzo => segniamo come < 15
    if (finalPrice < MIN_PRICE) {
      return Math.round(finalPrice * 100) / 100;
    }
    return Math.round(finalPrice * 100) / 100;
  }, []);

  // Materiali
  const MATERIALS = [
    { id: "pla", label: "PLA", desc: t.quote.pla },
    { id: "petg", label: "PETG", desc: t.quote.petg },
    { id: "abs", label: "ABS", desc: t.quote.abs },
    { id: "tpu", label: "TPU", desc: t.quote.tpu },
    { id: "petg_cf", label: "PETG CF", desc: t.quote.petg_cf },
    { id: "pc", label: "PC", desc: t.quote.pc },
    { id: "nylon", label: "Nylon", desc: t.quote.nylon },
    {
      id: "resin",
      label: "Resina",
      desc: t.quote.resin,
      resinOnly: true,
    },
  ];
  
  const QUALITY_OPTIONS = [
    { id: "0.3", label: "Draft (0.3mm)", mobileLabel: "Draft", desc: t.quote.draftp },
    { id: "0.2", label: "Standard (0.2mm)", mobileLabel: "STD", desc: t.quote.standard },
    { id: "0.1", label: "High (0.1mm)", mobileLabel: "High", desc: t.quote.high },
    {
      id: "0.05",
      label: "Ultra High (0.01mm)",
      mobileLabel: "Ultra High",
      desc: t.quote.ultra_high,
      extraCost: 30,
      resinOnly: true,
    },
  ];

  // Handler invio al server
  const handleCalculate = useCallback(async () => {
    if (!file) {
      setError("Nessun file selezionato");
      return;
    }
    // Check dimensioni
    if (!modelDims) {
      setError("Attendi il rendering o verifica il modello: dimensioni non disponibili.");
      return;
    }
    
    const { x, y, z } = modelDims;
    
    // Nuova logica per il controllo delle dimensioni minime
    const dimensionsUnderMin = [x, y, z].filter(dim => dim < MIN_DIM).length;
    if (dimensionsUnderMin >= 2) {
      setError(`Il modello è troppo piccolo: almeno due dimensioni sono sotto ${MIN_DIM}mm.`);
      return;
    }

    // Controllo dimensioni massime (invariato)
    if (x > MAX_DIM || y > MAX_DIM || z > MAX_DIM) {
      setError(`Il modello è troppo grande (max ${MAX_DIM}mm). Contattaci per stamparlo in più parti.`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPrintTime(null);
    setUploadProgress(0);
    setSinglePrice(null);

    // Barra fake
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      // Completa la barra di progresso
      for (const p of [96, 97, 98, 99, 100]) {
        setUploadProgress(p);
        await new Promise((r) => setTimeout(r, 100));
      }

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrintTime(data.print_time);

        // print_time in minuti
        const printTimeHours = parseFloat(data.print_time) / 60;
        const materialGrams = parseFloat(data.filament_used_grams);

        // Calcola il costo per 1 pezzo
        const sp = calculateSinglePrice(printTimeHours, materialGrams);
        setSinglePrice(sp);
      }
    } catch (err) {
      setError("Errore di connessione con il server");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [file, modelDims, quality, calculateSinglePrice]);

  // Cambia materiale se qualitá = 0.05 => resin
  useEffect(() => {
    if (quality === "0.05") {
      setMaterial("resin");
    } else if (material === "resin") {
      setMaterial("pla");
    }
  }, [quality, material]);

  // Funzione per calcolare lo sconto
  const calculateDiscount = (quantity: number, price: number) => {
    let discount = 0;
    if (quantity >= 10 && quantity < 20) {
      discount = 0.1; // 10%
    } else if (quantity >= 20 && quantity < 30) {
      discount = 0.2; // 20%
    } else if (quantity >= 30 && quantity < 50) {
      discount = 0.25; // 25%
    } else if (quantity >= 50) {
      discount = 0.3; // 30%
    }
    return price * discount;
  };

  // Calcolo finale in base a quantity
  const getTotal = () => {
    if (!singlePrice) return null;

    const discount = calculateDiscount(quantity, singlePrice);
    const totalPrice = (singlePrice * quantity) - discount;

    // Assicurati che il totale non scenda sotto il prezzo minimo
    if (totalPrice < MIN_PRICE) {
      return MIN_PRICE;
    }
    return totalPrice;
  };

  // Messaggio: se singlePrice < 15 e singlePrice * quantity < 15 => avviso
  const isBelowMin = () => {
    if (singlePrice == null) return false;
    if (singlePrice >= MIN_PRICE) return false;
    const sub = singlePrice * quantity;
    return sub < MIN_PRICE;
  };

  const totalPrice = getTotal();

  return (
    <section id="quote" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t.quote.title}
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonna sinistra */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <label className="block text-white font-medium mb-4">
                {t.quote.uploadTitle}
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="*/*" 
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  multiple={false} 
                />
                <label
                  htmlFor="file-upload"
                  className={`w-full flex items-center justify-center px-6 py-4 border-2 border-dashed ${
                    isDragging ? 'border-red-500 bg-red-500/10' : 'border-gray-600'
                  } rounded-lg cursor-pointer hover:border-red-500 transition-colors`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <span className="text-gray-300">
                      {file ? file.name : isDragging ? 'Rilascia qui il file' : t.quote.dropzoneText}
                    </span>
                  </div>
                </label>
              </div>

              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}

              {file && (fileType === "stl" || fileType === "obj") && (
                <div className="mt-4">
                  <div className="relative">
                    <div className="aspect-square w-full h-80 md:h-96 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                      <ModelViewer
                        file={file}
                        fileType={fileType}
                        uploadPrompt="carica il modello"
                        onDimensions={(dims) => setModelDims(dims)}
                      />
                    </div>
                    <button 
                      className="absolute top-2 right-2 bg-gray-800/70 hover:bg-gray-700 text-white p-2 rounded-md transition-colors"
                      onClick={() => {
                        // Creare un elemento contenitore per il modello a schermo intero
                        const fullscreenContainer = document.createElement('div');
                        fullscreenContainer.style.position = 'fixed';
                        fullscreenContainer.style.top = '0';
                        fullscreenContainer.style.left = '0';
                        fullscreenContainer.style.width = '100vw';
                        fullscreenContainer.style.height = '100vh';
                        fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        fullscreenContainer.style.zIndex = '9999';
                        fullscreenContainer.style.display = 'flex';
                        fullscreenContainer.style.justifyContent = 'center';
                        fullscreenContainer.style.alignItems = 'center';
                        
                        // Aggiungere pulsante di chiusura
                        const closeButton = document.createElement('button');
                        closeButton.innerHTML = '✕';
                        closeButton.style.position = 'absolute';
                        closeButton.style.top = '20px';
                        closeButton.style.right = '20px';
                        closeButton.style.backgroundColor = 'rgba(200, 30, 30, 0.8)';
                        closeButton.style.color = 'white';
                        closeButton.style.border = 'none';
                        closeButton.style.borderRadius = '50%';
                        closeButton.style.width = '40px';
                        closeButton.style.height = '40px';
                        closeButton.style.cursor = 'pointer';
                        closeButton.style.fontSize = '20px';
                        closeButton.style.display = 'flex';
                        closeButton.style.justifyContent = 'center';
                        closeButton.style.alignItems = 'center';
                        
                        closeButton.onclick = () => {
                          document.body.removeChild(fullscreenContainer);
                        };
                        
                        // Creare un clone del modello viewer
                        const modelContainer = document.createElement('div');
                        modelContainer.style.width = '90vmin';
                        modelContainer.style.height = '90vmin';
                        modelContainer.style.position = 'relative';
                        
                        fullscreenContainer.appendChild(modelContainer);
                        fullscreenContainer.appendChild(closeButton);
                        document.body.appendChild(fullscreenContainer);
                        
                        // Renderizzare un nuovo ModelViewer dentro il container
                        const newModelViewer = document.createElement('div');
                        newModelViewer.style.width = '100%';
                        newModelViewer.style.height = '100%';
                        modelContainer.appendChild(newModelViewer);
                        
                        // Importa dinamicamente React e ReactDOM per rendere il componente
                        import('react-dom/client').then((ReactDOM) => {
                          import('react').then((React) => {
                            const root = ReactDOM.createRoot(newModelViewer);
                            root.render(
                              React.createElement(ModelViewer, {
                                file: file,
                                fileType: fileType,
                                uploadPrompt: "carica il modello"
                              })
                            );
                          });
                        });
                      }}
                      title="Visualizza a schermo intero"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
                      </svg>
                    </button>
                  </div>
                  {modelDims && (
                    <p className="text-gray-400 mt-2">
                      {t.quote.size}: {modelDims.x.toFixed(2)} ×{" "}
                      {modelDims.y.toFixed(2)} × {modelDims.z.toFixed(2)} mm
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Colonna destra */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">
                {t.quote.printSettings}
              </h3>

              {/* Selezione qualità */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  {t.quote.printQuality}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {QUALITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setQuality(option.id)}
                      className={`px-4 py-2 rounded-lg border ${
                        quality === option.id
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      } transition-all`}
                    >
                      <span className="hidden md:inline">{option.label}</span>
                      <span className="md:hidden">{option.mobileLabel}</span>
                    </button>
                  ))}
                </div>
                <p className="hidden md:block text-gray-400 mt-2">
                  {QUALITY_OPTIONS.find((q) => q.id === quality)?.desc}
                </p>
              </div>

              {QUALITY_OPTIONS.find((q) => q.id === quality)?.extraCost && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ {t.quote.addCost}
                </p>
              )}

              {/* Selezione materiale */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  {t.quote.material}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {MATERIALS.map((mat) => {
                    const isDisabled =
                      (mat.resinOnly && quality !== "0.05") ||
                      (!mat.resinOnly && quality === "0.05");
                    return (
                      <button
                        key={mat.id}
                        onClick={() => setMaterial(mat.id)}
                        disabled={isDisabled}
                        className={`
                          px-4 py-2 rounded-lg border 
                          ${
                            material === mat.id
                              ? "bg-red-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }
                          ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-red-600"
                          }
                          transition-all
                        `}
                      >
                        {mat.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-gray-400 mt-2">
                  {MATERIALS.find((m) => m.id === material)?.desc}
                </p>
              </div>

              {/* Pulsante calcola */}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!file || isProcessing}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isProcessing && (
                  <div
                    className="absolute left-0 top-0 h-full bg-red-700 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                )}
                <span className="relative z-10">
                  {isProcessing ? `Elaborazione ${uploadProgress}%` : t.quote.calculatePrice}
                </span>
              </button>

              {/* Input quantità */}
              {singlePrice !== null && (
                <div className="mt-4 flex flex-col items-start space-y-2">
                  <label className="text-white font-medium">
                    {t.quote.quantity}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 rounded bg-gray-800 text-white border border-gray-600 px-2 py-1"
                  />
                </div>
              )}

              {/* Mostra risultati */}
              {printTime && singlePrice !== null && (
                <div className="mt-4 bg-gray-700/50 p-6 rounded-lg text-center">
                  <p className="text-white text-lg">
                    {t.quote.cost1} {quantity} {t.quote.cost2} {" "}
                    <strong>{getTotal()?.toFixed(2)} CHF</strong>
                  </p>
                  {singlePrice < 15 && (
                    <span className="text-sm text-yellow-400 block mt-1">
                      {t.quote.price1}{singlePrice.toFixed(2)} {t.quote.price2}.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}