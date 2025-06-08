
import React, { useState } from 'react';
import { X, Send, Mic, Calendar, Plus } from 'lucide-react';
import { Button } from '../ui/button';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant culinaire IA. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulation de réponse de l'IA
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('recette') || lowerMessage.includes('plat')) {
      return "Je peux vous aider à créer une nouvelle recette ! Quel type de plat souhaitez-vous préparer ? Avez-vous des ingrédients spécifiques en tête ?";
    }
    
    if (lowerMessage.includes('planning') || lowerMessage.includes('planifier')) {
      return "Parfait ! Je peux vous aider à planifier vos repas. Pour combien de personnes et sur quelle période souhaitez-vous planifier ?";
    }
    
    if (lowerMessage.includes('ingrédient') || lowerMessage.includes('stock')) {
      return "Je peux vous aider avec la gestion de vos stocks. Voulez-vous ajouter des ingrédients, vérifier ce qui vous manque, ou générer une liste de courses ?";
    }
    
    return "Je suis là pour vous aider avec vos repas ! Je peux vous proposer des recettes, planifier vos repas, gérer vos stocks, ou répondre à vos questions culinaires. Que souhaitez-vous faire ?";
  };

  const quickActions = [
    {
      icon: Plus,
      text: "Créer une recette",
      action: () => setInputMessage("Je veux créer une nouvelle recette")
    },
    {
      icon: Calendar,
      text: "Planifier mes repas",
      action: () => setInputMessage("Aide-moi à planifier mes repas de la semaine")
    }
  ];

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center"
        >
          <div className="text-2xl">🤖</div>
        </button>
      )}

      {/* Interface du chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* En-tête du chat */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold">Assistant Culinaire IA</h3>
                <p className="text-sm opacity-90">En ligne</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex space-x-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-3"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
