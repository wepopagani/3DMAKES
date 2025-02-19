import { useState } from 'react';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import QuoteCalculator from './components/QuoteCalculator';
import ProjectsSection from './components/ProjectsSection';
import BlogSection from './components/BlogSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import ChatBot from './components/ChatBot';
import { Language, translations } from './utils/translations';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('it');

  const t = translations[language].nav;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl bg-black/30 backdrop-blur-md shadow-2xl z-50">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-red-500">3DMAKES</div>
            
            <div className="flex items-center">
              {/* Desktop menu */}
              <div className="hidden md:flex space-x-8">
                <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-red-500 transition-colors">{t.home}</button>
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-red-500 transition-colors">{t.services}</button>
                <button onClick={() => scrollToSection('quote')} className="text-gray-300 hover:text-red-500 transition-colors">{t.getQuote}</button>
                <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-red-500 transition-colors">{t.projects}</button>
                <button onClick={() => scrollToSection('blog')} className="text-gray-300 hover:text-red-500 transition-colors">{t.blog}</button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-red-500 transition-colors">FAQ</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-red-500 transition-colors">{t.contact}</button>
                <div className="h-6 w-px bg-gray-700"></div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 rounded transition-colors ${
                      language === 'en'
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('it')}
                    className={`px-2 rounded transition-colors ${
                      language === 'it'
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    IT
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 ml-4"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-red-500 transition-colors">{t.home}</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-red-500 transition-colors">{t.services}</button>
              <button onClick={() => scrollToSection('quote')} className="text-gray-300 hover:text-red-500 transition-colors">{t.getQuote}</button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-red-500 transition-colors">{t.projects}</button>
              <button onClick={() => scrollToSection('blog')} className="text-gray-300 hover:text-red-500 transition-colors">{t.blog}</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-red-500 transition-colors">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-red-500 transition-colors">{t.contact}</button>
              <div className="h-px bg-gray-700"></div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded transition-colors ${
                    language === 'en'
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('it')}
                  className={`px-3 py-1 rounded transition-colors ${
                    language === 'it'
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Italiano
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection language={language} />

      {/* Services Section */}
      <ServicesSection language={language} />
      
      {/* Quote Calculator Section */}
      <QuoteCalculator language={language} />

      {/* Projects Section */}
      <ProjectsSection language={language} />

      {/* Blog Section */}
      <BlogSection language={language} />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection language={language} />

      {/* FAQ Section */}
      <FAQSection language={language} />

      {/* Contact Section */}
      <ContactSection language={language} />

      {/* Chatbot */}
      <ChatBot language={language} />
    </div>
  );
}

export default App;