import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../utils/translations';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatBotProps {
  language: Language;
}

export default function ChatBot({ language }: ChatBotProps) {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse: Message = {
        content: generateResponse(input),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (input: string): string => {
    const knowledgeBase = {
      materials: {
        keywords: ['material', 'pla', 'abs', 'petg', 'filament', 'resin'],
        response: `We offer a comprehensive range of materials including:
- PLA: Ideal for prototypes and decorative parts (0.1-0.3mm layers)
- PETG: Great for functional parts with good chemical resistance (0.1-0.3mm layers)
- ABS: Perfect for durable end-use parts (0.1-0.2mm layers)
- Nylon: For high-strength mechanical components (0.1-0.2mm layers)
- Carbon Fiber composites: For maximum strength-to-weight ratio (0.15-0.2mm layers)
- Resins: For high-detail models (0.025-0.1mm layers)

Typical print times:
- Small parts (< 10cm³): 2-4 hours
- Medium parts (10-50cm³): 4-12 hours
- Large parts (> 50cm³): 12-48 hours

Maximum build volumes:
- FDM: 350 × 350 × 400mm
- Resin: 192 × 120 × 200mm
- Metal: 250 × 250 × 300mm

Each material has specific properties and use cases. What's your application?`
      },
      pricing: {
        keywords: ['price', 'cost', 'quote', 'expensive', 'cheap'],
        response: `Our pricing is based on several factors:
- Material volume and type (starting from CHF 0.5/cm³)
- Print time (CHF 20-30/hour depending on quality)
- Quality settings (layer height affects print time)
- Quantity (10+ pieces get 10% discount)

Typical price ranges:
- Small parts: CHF 30-100
- Medium parts: CHF 100-300
- Large parts: CHF 300+
- Complex parts may cost more

You can get an instant quote using our calculator above. For custom projects, we offer personalized quotes.`
      },
      timing: {
        keywords: ['time', 'fast', 'quick', 'duration', 'long', 'delivery', 'turnaround'],
        response: `Our standard turnaround times:
- Small parts (< 10cm³): 1-2 business days
- Medium parts (10-50cm³): 2-3 business days
- Large parts (> 50cm³): 3-5 business days
- Complex projects: 5-10 business days

Rush services available for 50% surcharge:
- Same-day for small parts (when ordered before 10am)
- Next-day for medium parts
- 2-day for large parts

Print times vary by size and quality:
- Draft quality (0.3mm): Fastest, visible layers
- Standard quality (0.2mm): Good balance
- High quality (0.1mm): Slower, smooth finish`
      },
      quality: {
        keywords: ['quality', 'resolution', 'accuracy', 'precision', 'detail', 'finish'],
        response: `We ensure high quality through:
Layer heights:
- Ultra-fine: 0.05mm (resin)
- High detail: 0.1mm
- Standard: 0.2mm
- Draft: 0.3mm

Accuracy:
- FDM: ±0.1mm or ±0.1% (whichever is greater)
- Resin: ±0.025mm
- Metal: ±0.1mm

Resolution:
- XY (FDM): 0.4mm nozzle standard
- XY (Resin): 0.047mm
- Z: Depends on layer height

All prints undergo quality control checks before delivery.`
      },
      metal: {
        keywords: ['metal', 'steel', 'aluminum', 'titanium', 'dmls', 'slm'],
        response: `Our metal 3D printing services include:
Materials available:
- Stainless Steel 316L
- Titanium Ti6Al4V
- Aluminum AlSi10Mg
- Tool Steel H13
- Inconel 718

Technologies:
- Direct Metal Laser Sintering (DMLS)
- Selective Laser Melting (SLM)

Build volume: 250 × 250 × 300mm
Layer height: 0.02-0.05mm
Accuracy: ±0.1mm

Applications:
- Aerospace components
- Medical implants
- Industrial tooling
- Automotive parts
- Heat exchangers

Post-processing options:
- Heat treatment
- Surface finishing
- CNC machining
- Quality inspection (CT scanning)`
      },
      process: {
        keywords: ['process', 'how', 'work', 'steps', 'order'],
        response: `Our 3D printing process:

1. Design & Quote
   - Upload your 3D model (STL/OBJ)
   - Choose material and quality
   - Get instant quote

2. File Preparation
   - Design review
   - Optimization if needed
   - Slicing and print setup

3. Production
   - Quality control checks
   - Print monitoring
   - Post-processing

4. Quality Assurance
   - Dimensional verification
   - Visual inspection
   - Functional testing

5. Delivery
   - Secure packaging
   - Shipping worldwide
   - Tracking provided

Need help with any specific step?`
      }
    };

    const lowercaseInput = input.toLowerCase();
    
    // Check each category for matching keywords
    for (const [, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return data.response;
      }
    }

    return `I'm here to help with any questions about 3D printing! You can ask about:
- Materials and their properties
- Pricing and quotes
- Print process and timelines
- Quality and specifications
- Metal 3D printing

What would you like to know more about?`;
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