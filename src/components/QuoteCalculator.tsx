import React, { useState, useCallback, useEffect } from "react";
import ModelViewer from "./ModelViewer";
import { translations, Language } from "../utils/translations";

interface QuoteCalculatorProps {
  language: Language;
}

// Limiti di dimensione
const MIN_DIM = 20;
const MAX_DIM = 300;

// Prezzo minimo per 1 o più pezzi
const MIN_PRICE = 15;

// Se vuoi cambiare il massimo file, ecc.
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const API_URL = "https://5d8a-89-217-108-88.ngrok-free.app/upload";

// Opzioni qualità
const QUALITY_OPTIONS = [
  { id: "0.3", label: "Draft (0.3mm)", desc: "Stampa veloce, meno dettagli" },
  { id: "0.2", label: "Standard (0.2mm)", desc: "Bilanciato tra qualità e velocità" },
  { id: "0.1", label: "High (0.1mm)", desc: "Maggiori dettagli, stampa più lenta" },
  {
    id: "0.05",
    label: "Ultra High (0.01mm)",
    desc: "Qualità estrema (solo resina, +30CHF)",
    extraCost: 30,
    resinOnly: true,
  },
];

// Materiali
const MATERIALS = [
  { id: "pla", label: "PLA", desc: "Economico e facile da stampare" },
  { id: "petg", label: "PETG", desc: "Resistente e versatile" },
  { id: "abs", label: "ABS", desc: "Resistente al calore" },
  { id: "tpu", label: "TPU", desc: "Flessibile" },
  { id: "petg_cf", label: "PETG CF", desc: "PETG rinforzato con fibra di carbonio" },
  { id: "pc", label: "PC", desc: "Policarbonato ad alta resistenza" },
  { id: "nylon", label: "Nylon", desc: "Forte e durevole" },
  {
    id: "resin",
    label: "Resina",
    desc: "Alta precisione, solo per Ultra High",
    resinOnly: true,
  },
];

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

  // Handler caricamento file
  const handleFileChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setPrintTime(null);
      setSinglePrice(null);

      setMaterialCost(null);
      setElectricityCost(null);
      setDepreciationCost(null);

      setIsProcessing(false);
      setUploadProgress(0);
      setModelDims(null);

      const f = evt.target.files?.[0];
      if (f) {
        if (f.size > MAX_FILE_SIZE) {
          setError("File troppo grande");
          return;
        }
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
        setFileType(ext);
        setFile(f);
      }
    },
    [t]
  );

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
    if (x < MIN_DIM || y < MIN_DIM || z < MIN_DIM) {
      setError(`Il modello è troppo piccolo (min ${MIN_DIM}mm).`);
      return;
    }
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

      // Completa
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
  }, [quality]);

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
          Ottieni un preventivo istantaneo
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonna sinistra */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <label className="block text-white font-medium mb-4">
                Carica il modello 3D (.stl, .obj)
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-gray-300">
                      {file ? file.name : "Seleziona un file"}
                    </span>
                  </div>
                </label>
              </div>

              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}

              {file && (fileType === "stl" || fileType === "obj") && (
                <div className="mt-4">
                  <ModelViewer
                    file={file}
                    fileType={fileType}
                    uploadPrompt="carica il modello"
                    onDimensions={(dims) => setModelDims(dims)}
                  />
                  {modelDims && (
                    <p className="text-gray-400 mt-2">
                      Dimensioni rilevate: {modelDims.x.toFixed(2)} ×{" "}
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
                Impostazioni di stampa
              </h3>

              {/* Selezione qualità */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  Qualità di stampa
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
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 mt-2">
                  {QUALITY_OPTIONS.find((q) => q.id === quality)?.desc}
                </p>
              </div>

              {QUALITY_OPTIONS.find((q) => q.id === quality)?.extraCost && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ Questa opzione comporta un costo aggiuntivo di 30 CHF
                </p>
              )}

              {/* Selezione materiale */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  Materiale
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
                  {isProcessing ? `Elaborazione ${uploadProgress}%` : "Calcola il Prezzo"}
                </span>
              </button>

              {/* Input quantità */}
              {singlePrice !== null && (
                <div className="mt-4 flex flex-col items-start space-y-2">
                  <label className="text-white font-medium">
                    Quantità
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
                    Costo totale per {quantity} pezzi:{" "}
                    <strong>{getTotal()?.toFixed(2)} CHF</strong>
                  </p>
                  {singlePrice < 15 && (
                    <span className="text-sm text-yellow-400 block mt-1">
                      Il prezzo del singolo pezzo sarebbe di {singlePrice.toFixed(2)} CHF, ma c'è un minimo d'ordine di 15 CHF.
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