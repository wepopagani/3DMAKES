import { FC } from 'react';
import { SplineScene } from './ui/spline';
import { Language, translations } from '../utils/translations';

interface HeroSectionProps {
  language: Language;
}

const HeroSection: FC<HeroSectionProps> = ({ language }) => {
  const t = translations[language as keyof typeof translations].hero;

  return (
<<<<<<< HEAD
    <section className="mt-16 md:pt-0 relative min-h-screen flex items-center overflow-hidden bg-black">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
=======
    <section id="home" className="min-h-screen relative flex items-center overflow-hidden bg-black/[0.96]">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
>>>>>>> 451a88e0ec42036f43e40f456c7047b04091947c
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
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