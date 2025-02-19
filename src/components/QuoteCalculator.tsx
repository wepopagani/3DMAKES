import React, { useState, useCallback, useEffect } from "react";
import ModelViewer from "./ModelViewer";
import { translations, Language } from "../utils/translations";

interface QuoteCalculatorProps {
  language: Language;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const API_URL = "http://192.168.1.235:5000/upload"; // IP del Raspberry Pi

// Definiamo le opzioni di qualità come tab interattive
const QUALITY_OPTIONS = [
  { id: "0.3", label: "Draft (0.3mm)", desc: "Stampa veloce, meno dettagli" },
  { id: "0.2", label: "Standard (0.2mm)", desc: "Bilanciato tra qualità e velocità" },
  { id: "0.1", label: "High (0.1mm)", desc: "Maggiori dettagli, stampa più lenta" },
  { id: "0.05", label: "Ultra High (0.01mm)", desc: "Qualità estrema (solo resina, +30CHF)", extraCost: 30, resinOnly: true }
];

const MATERIALS = [
  { id: "pla", label: "PLA", desc: "Economico e facile da stampare" },
  { id: "petg", label: "PETG", desc: "Resistente e versatile" },
  { id: "abs", label: "ABS", desc: "Resistente al calore" },
  { id: "tpu", label: "TPU", desc: "Flessibile" },
  { id: "petg_cf", label: "PETG CF", desc: "PETG rinforzato con fibra di carbonio" },
  { id: "pc", label: "PC", desc: "Policarbonato ad alta resistenza" },
  { id: "nylon", label: "Nylon", desc: "Forte e durevole" },
  { id: "resin", label: "Resina", desc: "Alta precisione, solo per Ultra High", resinOnly: true }
];

export default function QuoteCalculator({ language }: QuoteCalculatorProps) {
  const t = translations[language];

  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [printTime, setPrintTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [quality, setQuality] = useState<string>("0.2"); // Default Standard
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [material, setMaterial] = useState<string>("pla");
  const [price, setPrice] = useState<number | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPrintTime(null);
    setIsProcessing(false);

    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(t.fileError.tooLarge);
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension === "stl" || extension === "obj" || extension === "gcode") {
        setFile(file);
        setFileType(extension);
      } else {
        setError("Formato file non supportato");
      }
    }
  }, [t]);

  const calculatePrice = (printTimeHours: number, materialGrams: number) => {
    // Costo materiale
    const materialCost = materialGrams * 0.1;
    
    // Costo elettricità
    const electricityCost = printTimeHours * 0.03;
    
    // Costo ammortamento
    const depreciationCost = printTimeHours * 15;
    
    // Somma costi base
    const baseCost = materialCost + electricityCost + depreciationCost;
    
    // Calcola il prezzo finale
    const finalPrice = baseCost * 1.35 * 1.35 * 1.2;
    
    // Se costa meno di 10 CHF, applica il minimo
    if (finalPrice < 10) {
      return 10;
    }
    
    return Math.round(finalPrice * 100) / 100; // Arrotonda a 2 decimali
  };

  const handleCalculate = useCallback(async () => {
    if (!file) {
      setError("Nessun file selezionato");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPrintTime(null);
    setUploadProgress(0);

    // Timer per 15 secondi fino al 95%
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 150); // 15000ms / 100 steps = 150ms per step

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      clearInterval(interval);
      
      // Completa il progresso rapidamente dopo la risposta
      for (const progress of [96, 97, 98, 99, 100]) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrintTime(data.print_time);
        
        // Converti il tempo di stampa in ore (assumendo che data.print_time sia in minuti)
        const printTimeHours = parseFloat(data.print_time) / 60;
        const materialGrams = parseFloat(data.filament_used_grams);
        
        // Calcola e imposta il prezzo
        const calculatedPrice = calculatePrice(printTimeHours, materialGrams);
        setPrice(calculatedPrice);
      }
    } catch (error) {
      setError("Errore di connessione con il server");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [file, quality]);

  useEffect(() => {
    if (quality === "0.05") {
      setMaterial("resin");
    } else if (material === "resin") {
      setMaterial("pla");
    }
  }, [quality]);

  return (
    <section id="quote" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">{t.title}</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna sinistra - Upload file e anteprima */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <label className="block text-white font-medium mb-4">
                Carica il modello 3D (.stl, .obj) o G-code (.gcode)
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept=".stl,.obj,.gcode"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-gray-300">{file ? file.name : "Seleziona un file"}</span>
                  </div>
                </label>
              </div>

              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

              {file && (fileType === "stl" || fileType === "obj") && (
                <div className="mt-4">
                  <ModelViewer file={file} fileType={fileType} uploadPrompt={t.uploadPrompt} />
                </div>
              )}
            </div>
          </div>

          {/* Colonna destra - Selezione qualità + pulsante calcola */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Impostazioni di stampa</h3>

              {/* Selezione qualità con tab */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">Qualità di stampa</label>
                <div className="grid grid-cols-4 gap-2">
                  {QUALITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setQuality(option.id)}
                      className={`px-4 py-2 rounded-lg border ${quality === option.id ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"} transition-all`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 mt-2">{QUALITY_OPTIONS.find(q => q.id === quality)?.desc}</p>
              </div>

              {QUALITY_OPTIONS.find(q => q.id === quality)?.extraCost && (
                <p className="text-yellow-400 text-sm">⚠️ Questa opzione comporta un costo aggiuntivo di 30 CHF</p>
              )}

              {/* Aggiungi questa sezione dopo la selezione della qualità */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">Materiale</label>
                <div className="grid grid-cols-4 gap-2">
                  {MATERIALS.map((mat) => {
                    const isDisabled = (mat.resinOnly && quality !== "0.05") || 
                                     (!mat.resinOnly && quality === "0.05");
                    return (
                      <button
                        key={mat.id}
                        onClick={() => setMaterial(mat.id)}
                        disabled={isDisabled}
                        className={`
                          px-4 py-2 rounded-lg border 
                          ${material === mat.id ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"}
                          ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}
                          transition-all
                        `}
                      >
                        {mat.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-gray-400 mt-2">
                  {MATERIALS.find(m => m.id === material)?.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCalculate}
                disabled={!file || isProcessing}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xl transition-all hover:shadow-red-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isProcessing && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-red-700 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                )}
                <span className="relative z-10">
                  {isProcessing ? `Elaborazione ${uploadProgress}%` : "Calcola il Prezzo"}
                </span>
              </button>

              {printTime && (
                <div className="mt-4 bg-gray-700/50 p-6 rounded-lg">
                  {price && (
                    <div className="flex flex-col justify-center items-center text-center space-y-2">
                      <p className="text-white font-semibold text-xl">
                        <strong>Prezzo totale:</strong> {price.toFixed(2)} CHF
                      </p>
                      {price === 10 && (
                        <p className="text-yellow-400 text-sm mt-2">
                          Il prezzo reale sarebbe inferiore, ma applichiamo il minimo di 10 CHF.
                        </p>
                      )}
                    </div>
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