import { FC } from 'react';
import { SplineScene } from './ui/spline';
import { Language, translations } from '../utils/translations';

interface HeroSectionProps {
  language: Language;
}

const HeroSection: FC<HeroSectionProps> = ({ language }) => {
  const t = translations[language as keyof typeof translations].hero;

  return (
    <section className="mt-16 md:pt-0 relative min-h-screen flex items-center overflow-hidden bg-black">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
        {/* Left content */}
        <div className="flex-1 relative z-10 lg:pr-8 mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            <span className="text-red-500">{t.highlightedTitle}</span>
            {t.remainingTitle}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 mb-12 max-w-2xl whitespace-pre-line">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/20"
            >
              {t.getQuote}
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
            >
              {t.ourServices}
            </button>
            <button
              onClick={() => window.open('https://wa.me/+41762660396', '_blank')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              WhatsApp
            </button>
          </div>
        </div>

        {/* Right content - Spline Animation */}
        <div className="flex-1 relative h-[500px] w-full hidden md:block">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;