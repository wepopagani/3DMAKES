import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  limit, 
  Timestamp, 
  where,
  DocumentData
} from 'firebase/firestore';

interface ChatProps {
  recipientId?: string; // ID dell'utente con cui si sta chattando (opzionale)
  isGlobalChat?: boolean; // Se true, è una chat globale
  className?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  createdAt: Date;
  recipientId?: string;
}

const ChatComponent: React.FC<ChatProps> = ({ 
  recipientId, 
  isGlobalChat = false,
  className = '' 
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Funzione per inviare un messaggio
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentUser) return;
    
    try {
      const messagesCollection = collection(db, 'messages');
      
      // Crea il nuovo messaggio
      const newMessage = {
        text: message,
        senderId: currentUser.uid,
        senderEmail: currentUser.email || 'Utente anonimo',
        createdAt: Timestamp.now(),
        recipientId: isGlobalChat ? null : recipientId // null per chat globale
      };
      
      // Aggiungi il messaggio a Firestore
      await addDoc(messagesCollection, newMessage);
      
      // Pulisci l'input
      setMessage('');
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
    }
  };

  // Effetto per caricare e ascoltare i messaggi
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    
    // Crea la query in base al tipo di chat
    let messagesQuery;
    
    if (isGlobalChat) {
      // Chat globale: carica tutti i messaggi senza recipientId
      messagesQuery = query(
        collection(db, 'messages'),
        where('recipientId', '==', null),
        orderBy('createdAt', 'asc'),
        limit(100)
      );
    } else if (recipientId) {
      // Chat privata: carica messaggi tra l'utente corrente e il destinatario
      messagesQuery = query(
        collection(db, 'messages'),
        where('recipientId', 'in', [recipientId, currentUser.uid]),
        where('senderId', 'in', [recipientId, currentUser.uid]),
        orderBy('createdAt', 'asc'),
        limit(100)
      );
    } else {
      return; // Nessuna configurazione valida
    }
    
    // Ascolta i messaggi in tempo reale
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          senderEmail: data.senderEmail,
          createdAt: data.createdAt.toDate(),
          recipientId: data.recipientId
        });
      });
      
      setMessages(fetchedMessages);
      setLoading(false);
      
      // Scrolla automaticamente all'ultimo messaggio
      scrollToBottom();
    });
    
    // Pulizia della sottoscrizione quando il componente viene smontato
    return () => unsubscribe();
  }, [currentUser, recipientId, isGlobalChat]);

  // Funzione per scorrere automaticamente all'ultimo messaggio
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatta l'ora del messaggio
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Determina se un messaggio è stato inviato dall'utente corrente
  const isCurrentUser = (senderId: string) => {
    return currentUser?.uid === senderId;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 bg-gray-800 rounded-t-lg overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Intestazione */}
          <div className="bg-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium">
              {isGlobalChat ? 'Chat Globale' : 'Chat Privata'}
            </h3>
          </div>
          
          {/* Area messaggi */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Caricamento messaggi...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Nessun messaggio. Inizia la conversazione!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser(msg.senderId) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] px-4 py-3 rounded-lg ${
                        isCurrentUser(msg.senderId)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700'
                      }`}
                    >
                      {!isCurrentUser(msg.senderId) && (
                        <p className="text-xs font-medium text-gray-300 mb-1">
                          {msg.senderEmail}
                        </p>
                      )}
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser(msg.senderId) ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input per i messaggi */}
          <div className="bg-gray-700 p-3">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 bg-gray-800 rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Invia
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent; 