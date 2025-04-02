import React, { useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('qr-code');

  // Genera QR code in formato immagine
  const generateQRCode = async () => {
    if (!url.trim()) return;

    try {
      const imageData = await QRCode.toDataURL(url);
      setQrImage(imageData);
    } catch (error) {
      console.error('Errore nella generazione del QR code:', error);
    }
  };

  // Scarica immagine QR
  const downloadQRImage = () => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `${fileName.trim() || 'qr-code'}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
      {/* Title */}
      <motion.h1 
        className="text-4xl font-extrabold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🚀 Generatore di QR Code
      </motion.h1>

      {/* URL Input */}
      <motion.input
        type="text"
        placeholder="Inserisci l'URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-4 rounded-xl text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Generate Button */}
      <motion.button
        onClick={generateQRCode}
        className="mt-6 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-transform hover:-translate-y-1 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎨 Genera QR Code
      </motion.button>

      {/* QR Code Display */}
      {qrImage && (
        <motion.div
          className="mt-8 bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={qrImage}
            alt="QR Code"
            className="w-64 h-64 rounded-lg border-4 border-gray-300 shadow-md"
          />
          {/* File Name Input */}
          <motion.input
            type="text"
            placeholder="Nome del file..."
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full max-w-xs p-2 rounded-lg text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <button
            onClick={downloadQRImage}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg transition-transform hover:-translate-y-1"
          >
            ⬇️ Scarica come PNG
          </button>
        </motion.div>
      )}
    </div>
  );
}