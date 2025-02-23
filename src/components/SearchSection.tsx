import React from 'react';
import { translations, Language } from '../utils/translations';

const SearchSection: React.FC<{ language: Language }> = ({ language }) => {
  React.useEffect(() => {
    // Carica lo script di Google CSE dinamicamente
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=d6f5fdd7384fa4e0f`;
    script.async = true;
    document.body.appendChild(script);

    // Aggiungiamo gli stili personalizzati per il motore di ricerca
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .gsc-control-cse {
        background-color: transparent !important;
        border: none !important;
      }
      .gsc-search-button-v2 {
        background-color: #ff0000 !important;
        border-color: #ff0000 !important;
        padding: 12px 15px !important;
        border-radius: 4px !important;
        margin-left: 5px !important;
      }
      .gsc-search-button-v2:hover {
        background-color: #cc0000 !important;
        border-color: #cc0000 !important;
      }
      .gsc-input-box {
        border-radius: 4px !important;
        border: 2px solid #e0e0e0 !important;
        height: 40px !important;
      }
      .gsc-input {
        padding-right: 12px !important;
      }
      .gsib_a {
        padding: 5px 9px !important;
      }
      .gsc-results-wrapper-overlay {
        width: 80% !important;
        max-width: 800px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }
      .gsc-results {
        width: 100% !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <div className="search-section" style={styles.searchSection}>
      <h1 style={styles.title}>{translations[language].search.title}</h1>
      <p style={styles.subtitle}>{translations[language].search.subtitle}</p>
      <div className="search-container" style={styles.searchContainer}>
        <div className="gcse-search"></div>
      </div>
      <p style={styles.instructions}>{translations[language].search.instructions}</p>
    </div>
  );
};

const styles = {
  searchSection: {
    width: '100%',
    padding: '20px 0',
    background: 'transparent'
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    textAlign: 'center' as const,
    color: '#ffffff',
    marginBottom: '30px',
    fontFamily: "'Poppins', sans-serif"
  },
  subtitle: {
    fontSize: '18px',
    textAlign: 'center' as const,
    color: '#ffffff',
    marginBottom: '25px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400
  },
  searchContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '15px',
    background: 'transparent',
    borderRadius: '4px'
  },
  instructions: {
    fontSize: '16px',
    textAlign: 'center' as const,
    color: '#ffffff',
    marginTop: '20px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontStyle: 'italic'
  }
};

export default SearchSection; 