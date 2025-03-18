import { useState, useEffect } from 'react';
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
import SearchSection from './components/SearchSection';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import QRCodeGenerator from "./components/QRCodeGenerator";
import Success from './pages/Success';
import TestConnection from './pages/TestConnection';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import LinkShortener from './components/LinkShortener';
import VCardGenerator from './components/VCardGenerator';
import CiotolePersonalizzabili from './components/CiotolePersonalizzabili';
import AccessoriRistorativi from './components/AccessoriRistorativi';
import GadgetAziendali from './components/GadgetAziendali';
import ContactView from './components/ContactView';

// Componente HomePage con accesso al contesto di autenticazione
const HomePage = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('it');
  const [currentSection, setCurrentSection] = useState<string>('home');
  const navigate = useNavigate();

  const t = translations[language].nav;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleScroll = () => {
    const sections = ['home', 'services', 'quote', 'projects', 'blog', 'faq', 'contact'];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setCurrentSection(sectionId);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar migliorata */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-6xl bg-black/40 backdrop-blur-lg z-50 rounded-xl border border-gray-800/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300`}>
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="ml-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                3DMAKES
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Desktop menu */}
              <div className={`hidden md:flex space-x-6`}>
                <button onClick={() => scrollToSection('home')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'home' ? 'text-white' : ''}`}>
                  {t.home}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'home' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('services')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'services' ? 'text-white' : ''}`}>
                  {t.services}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'services' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('quote')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'quote' ? 'text-white' : ''}`}>
                  {t.getQuote}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'quote' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('projects')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'projects' ? 'text-white' : ''}`}>
                  {t.projects}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'projects' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('blog')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'blog' ? 'text-white' : ''}`}>
                  {t.blog}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'blog' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('faq')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'faq' ? 'text-white' : ''}`}>
                  FAQ
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'faq' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <button onClick={() => scrollToSection('contact')} 
                  className={`relative px-3 py-2 text-gray-300 hover:text-white transition-colors group ${currentSection === 'contact' ? 'text-white' : ''}`}>
                  {t.contact}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform ${currentSection === 'contact' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
                <div className="h-6 w-px bg-gray-700/50 mx-2"></div>
                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === 'en'
                        ? 'text-white bg-red-600'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('it')}
                    className={`px-2 py-1 rounded transition-colors ${
                      language === 'it'
                        ? 'text-white bg-red-600'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    IT
                  </button>
                  <div className="h-6 w-px bg-gray-700/50 ml-2"></div>
                  {currentUser ? (
                    <button
                      onClick={() => navigate('/user-panel')}
                      className="mr-4 ml-2 flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-1 rounded  hover:bg-gray-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Account</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="ml-2 flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-1 rounded bg-gray-800/60 hover:bg-gray-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Accedi</span>
                    </Link>
                  )}
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
              <div className="flex flex-col space-y-3">
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
                {currentUser ? (
                  <button
                    onClick={() => navigate('/user-panel')}
                    className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Il mio account
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Accedi / Registrati
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection language={language} />

      {/* Services Section */}
      <ServicesSection language={language} />
      
      {/* Search Section */}
      <SearchSection language={language}/>

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
      <ChatBot language={language} currentSection={currentSection} />
    </div>
  );
};

// Aggiungi questo componente nell'App.tsx
const LinkShRedirect = () => {
  useEffect(() => {
    window.location.href = 'http://server.3dmakes.ch:3000';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Reindirizzamento in corso...</h1>
        <div className="w-8 h-8 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qrgen" element={<QRCodeGenerator />} />
          <Route path="/success" element={<Success />} />
          <Route path="/test-firebase" element={<TestConnection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user-panel" element={<UserPanel />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          
          {/* Usa il componente LinkShortener */}
          <Route path="/linksh" element={<LinkShortener />} />
          <Route path="/vcard" element={<VCardGenerator />} />
          <Route path="/ciotole-personalizzabili" element={<CiotolePersonalizzabili />} />
          <Route path="/accessori-ristorativi" element={<AccessoriRistorativi />} />
          <Route path="/gadget-aziendali" element={<GadgetAziendali />} />
          <Route path="/contact-view" element={<ContactView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;