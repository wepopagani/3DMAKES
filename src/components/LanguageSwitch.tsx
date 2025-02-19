import { Language } from '../utils/translations';

interface LanguageSwitchProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitch({ currentLanguage, onLanguageChange }: LanguageSwitchProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 flex space-x-1">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentLanguage === 'en'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('it')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentLanguage === 'it'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          IT
        </button>
      </div>
    </div>
  );
}