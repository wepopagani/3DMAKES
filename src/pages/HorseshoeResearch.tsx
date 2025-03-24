import React from 'react';
import { useParams } from 'react-router-dom';
import { Language, translations } from '../utils/translations';

interface HorseshoeResearchProps {
  language: Language;
}

export default function HorseshoeResearch({ language }: HorseshoeResearchProps) {
  const t = translations[language].horseshoeResearch || {
    title: language === 'it' ? 'Ricerca sulla Ferratura Equina con Cuscinetti in TPU' : 'Research on Equine Horseshoeing with TPU Cushions',
    downloadPdf: language === 'it' ? 'Scarica PDF' : 'Download PDF',
    backToProject: language === 'it' ? 'Torna al Progetto' : 'Back to Project',
    // Aggiungi altre traduzioni necessarie
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <a 
            href="/pdfs/horseshoe-research.pdf" 
            target="_blank"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
            download
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.downloadPdf}
          </a>
        </header>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {/* Indice della ricerca */}
          <div className="mb-8 p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{language === 'it' ? 'Indice' : 'Table of Contents'}</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><a href="#introduction" className="text-red-400 hover:underline">{language === 'it' ? 'Introduzione' : 'Introduction'}</a></li>
              <li><a href="#methodology" className="text-red-400 hover:underline">{language === 'it' ? 'Metodologia' : 'Methodology'}</a></li>
              <li><a href="#results" className="text-red-400 hover:underline">{language === 'it' ? 'Risultati' : 'Results'}</a></li>
              {/* Aggiungi altri capitoli della tua ricerca */}
            </ol>
          </div>

          {/* Contenuto della ricerca */}
          <div className="prose prose-invert max-w-none">
            <section id="introduction" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{language === 'it' ? 'Introduzione' : 'Introduction'}</h2>
              <p>
                {language === 'it' 
                  ? 'Questa ricerca esplora l\'efficacia dei cuscinetti in TPU (Poliuretano Termoplastico) applicati alle ferrature equine tradizionali. L\'obiettivo principale è valutare come questi cuscinetti possano ridurre lo stress sulle articolazioni dei cavalli e migliorare la trazione su diverse superfici.'
                  : 'This research explores the effectiveness of TPU (Thermoplastic Polyurethane) cushions applied to traditional horseshoes. The main objective is to evaluate how these cushions can reduce stress on horses\' joints and improve traction on various surfaces.'
                }
              </p>
              {/* Continua con il resto dell'introduzione */}
            </section>

            <section id="methodology" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{language === 'it' ? 'Metodologia' : 'Methodology'}</h2>
              <p>
                {language === 'it'
                  ? 'Lo studio è stato condotto su un campione di 30 cavalli di diverse razze e utilizzi. I soggetti sono stati divisi in gruppi di controllo e sperimentali, con misurazioni effettuate prima e dopo l\'applicazione dei cuscinetti in TPU.'
                  : 'The study was conducted on a sample of 30 horses of different breeds and uses. The subjects were divided into control and experimental groups, with measurements taken before and after the application of TPU cushions.'
                }
              </p>
              {/* Continua con la metodologia */}
            </section>

            <section id="results" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{language === 'it' ? 'Risultati' : 'Results'}</h2>
              <p>
                {language === 'it'
                  ? 'I risultati mostrano una riduzione significativa (p < 0.05) dello stress di impatto sulle articolazioni nei cavalli dotati di cuscinetti in TPU. La trazione su superfici scivolose è migliorata del 37% rispetto alle ferrature tradizionali senza cuscinetti.'
                  : 'Results show a significant reduction (p < 0.05) in impact stress on joints in horses equipped with TPU cushions. Traction on slippery surfaces improved by 37% compared to traditional horseshoes without cushions.'
                }
              </p>
              {/* Continua con i risultati */}
            </section>

            {/* Aggiungi altre sezioni della ricerca */}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/projects" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            {t.backToProject}
          </a>
        </div>
      </div>
    </div>
  );
} 