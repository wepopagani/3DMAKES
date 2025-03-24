import React from 'react';
import { Link } from 'react-router-dom';

const RicercaFerraturaTpu: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Ricerca sui cuscinetti in TPU per ferrature equine
          </h1>
          <p className="text-gray-400">Studio approfondito sui benefici biomeccanici e prestazionali</p>
        </header>
        
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden">
            <iframe
              src="/documents/EQUIMAKES.pdf"
              className="w-full h-full"
              title="Ricerca sui cuscinetti in TPU per ferrature equine"
            ></iframe>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/documents/EQUIMAKES.pdf" 
              download="EQUIMAKES.pdf"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors inline-block"
            >
              Scarica PDF
            </a>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RicercaFerraturaTpu;