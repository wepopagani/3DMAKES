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
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
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

  // Stato per l'orientamento del modello
  const [modelOrientation, setModelOrientation] = useState({ x: 0, y: 0, z: 0 });

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
    setModelOrientation({ x: 0, y: 0, z: 0 });
  };

  // Handler per il caricamento del file (sia tramite input che drag & drop)
  const processFile = (f: File) => {
    resetStates();
    
    if (f.size > MAX_FILE_SIZE) {
      setError(`File troppo grande (max ${Math.round(MAX_FILE_SIZE/1024/1024)}MB). Per file più grandi, contattaci.`);
      return;
    }
    
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["stl", "obj"].includes(ext)) {
      setError("Formato file non supportato. Usa STL o OBJ.");
      return;
    }
    
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

  // Modifica la funzione simulateProgress per essere più lenta e graduale
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92;
        }
        // Incremento più piccolo e costante
        return Math.min(92, Math.floor(prev + 1));
      });
    }, 100); // Aggiornamento ogni 50ms
    
    return interval;
  };

  // Handler invio al server
  const handleCalculate = useCallback(async () => {
    if (!file) {
      setError("Nessun file selezionato");
      return;
    }

    try {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File troppo grande (max ${Math.round(MAX_FILE_SIZE/1024/1024)}MB). Per file più grandi, contattaci.`);
        return;
      }

      setIsProcessing(true);
      setError(null);
      setPrintTime(null);
      setSinglePrice(null);

      // Avvia la simulazione del progresso
      const progressInterval = simulateProgress();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality);
      formData.append("material", material);
      formData.append("orientation", JSON.stringify(modelOrientation));

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      // Ferma la simulazione e completa il progresso gradualmente
      clearInterval(progressInterval);
      
      // Completa il progresso da 85 a 100 gradualmente
      const completeProgress = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(completeProgress);
            return 100;
          }
          return Math.min(100, Math.floor(prev + 1));
        });
      }, 30);

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(`File troppo grande per il server (max 50MB). Per file più grandi, contattaci.`);
        }
        const errorText = await res.text();
        throw new Error(`Errore del server (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Aspetta che il progresso sia completato
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPrintTime(data.print_time);
      const printTimeHours = parseFloat(data.print_time) / 60;
      const materialGrams = parseFloat(data.filament_used_grams);
      const sp = calculateSinglePrice(printTimeHours, materialGrams);
      setSinglePrice(sp);

    } catch (err: any) {
      console.error("Errore durante l'upload:", err);
      setError(err.message || "Errore di connessione con il server");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [file, quality, material, modelOrientation, calculateSinglePrice]);

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
                        onOrientationChange={(rotation) => setModelOrientation(rotation)}
                      />
                    </div>
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
                  {isProcessing ? `Elaborazione ${Math.floor(uploadProgress)}%` : t.quote.calculatePrice}
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