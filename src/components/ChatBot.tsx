import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../utils/translations';
import { sendMessageToOpenAI } from '../utils/openaiApi';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatBotProps {
  language: Language;
  currentSection: string;
}

export default function ChatBot({ language, currentSection }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const t = translations[language].chatbot;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      // Limitiamo il contesto agli ultimi 10 messaggi
      const recentMessages = [...messages, userMessage]
        .slice(-10) // Prendi solo gli ultimi 10 messaggi
        .map((msg) => ({ role: msg.role, content: msg.content }));
  
        const response = await sendMessageToOpenAI(recentMessages, 'Chatbot Section', language);  
      const botResponse: Message = {
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Errore nel generare la risposta:", error);
  
      const errorResponse: Message = {
        content: "⚠️ Si è verificato un errore. Riprova più tardi.",
        role: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (input: string): string => {
    let context = '';

    switch (currentSection) {
      case 'services':
        context = 'L\'utente sta esplorando i nostri servizi di stampa 3D.';
        break;
      case 'quote':
        context = 'L\'utente sta cercando di ottenere un preventivo.';
        break;
      case 'projects':
        context = 'L\'utente sta esplorando i progetti realizzati.';
        break;
      case 'faq':
        context = 'L\'utente sta leggendo le domande frequenti.';
        break;
      default:
        context = 'L\'utente sta navigando sul sito.';
    }

    return `${context} ${input}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 p-4">
            <h3 className="text-white font-semibold">{t.title}</h3>
            <p className="text-red-100 text-sm">{t.subtitle}</p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}