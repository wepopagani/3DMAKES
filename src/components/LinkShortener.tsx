import React from 'react';
import { Link } from 'react-router-dom';

const LinkShortener: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">LinkSh</h1>
          <p className="text-gray-400 mb-4">Accorcia i tuoi link in modo semplice e veloce</p>
        </header>
        
        {/* Contenitore senza bordo e senza ombre */}
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden">
          <iframe 
            src="http://server.3dmakes.ch:3000" 
            title="LinkSh Service" 
            className="w-full h-[450px] bg-gray-900" 
            style={{ 
              border: 'none',
              outline: 'none',
              boxShadow: 'none'  // Elimina qualsiasi ombra dell'iframe
            }}
          />
        </div>
        
        {/* Bottone per generare QR Code */}
        <div className="mt-4 text-center">
          <Link 
            to="/qrgen" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            Genera il QR
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkShortener;