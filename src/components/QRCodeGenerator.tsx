import React, { useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeImageGenerator() {
  const [url, setUrl] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);

  // Funzione per generare il QR code come immagine PNG
  const generateQRCode = async () => {
    if (!url.trim()) return;

    try {
      const qrImageUrl = await QRCode.toDataURL(url);
      setQrImage(qrImageUrl);
    } catch (error) {
      console.error('Errore nella generazione del QR code:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Generatore di QR Code</h1>
      <input
        type="text"
        placeholder="Inserisci l'URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg text-black"
      />
      <button
        onClick={generateQRCode}
        className="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        Genera QR Code
      </button>

      {/* Visualizza l'immagine del QR Code */}
      {qrImage && (
        <div className="mt-6">
          <img src={qrImage} alt="QR Code" className="rounded-lg shadow-lg" />
          <a
            href={qrImage}
            download="qr-code.png"
            className="mt-4 block px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition text-center"
          >
            Scarica come PNG
          </a>
        </div>
      )}
    </div>
  );
}