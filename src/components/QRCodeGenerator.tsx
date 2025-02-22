import React, { useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);

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
    link.download = 'qr-code.png';
    link.click();
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

      {qrImage && (
        <div className="mt-6">
          <img src={qrImage} alt="QR Code" className="mb-4" />
          <button
            onClick={downloadQRImage}
            className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Scarica come PNG
          </button>
        </div>
      )}
    </div>
  );
}