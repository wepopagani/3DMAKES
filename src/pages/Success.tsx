import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect alla home page dopo 5 secondi
    const timeout = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm text-center">
        <div className="mb-6 text-green-500">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Messaggio Inviato!
        </h1>
        <p className="text-gray-300 mb-8">
          Grazie per averci contattato. Ti risponderemo il prima possibile.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Verrai reindirizzato alla home page tra pochi secondi...
        </p>
        <button 
          onClick={() => navigate('/')}
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Torna alla Home
        </button>
      </div>
    </div>
  );
} 