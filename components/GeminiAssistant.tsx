import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! 🤖 Soy el Boti-Amigo. ¿Buscas recomendaciones, recetas de tragos o precios? ¡Pregúntame!', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-neon-purple to-pink-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(188,19,254,0.6)] hover:scale-110 transition-transform duration-300 group border-2 border-white/20"
        >
          <Bot size={32} className="group-hover:rotate-12 transition-transform drop-shadow-md" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-neon-green border-2 border-dark-900"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[550px] flex flex-col bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden font-sans animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-purple/90 to-pink-600/90 p-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full border border-white/20">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Asistente de Carrete</h3>
                <p className="text-white/80 text-[10px] flex items-center gap-1 uppercase tracking-wider font-semibold">
                  <Sparkles size={10} /> Powered by Gemini
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1.5">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-neon-purple text-white rounded-br-sm'
                      : 'bg-dark-700/80 text-gray-100 rounded-bl-sm border border-white/5 backdrop-blur-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-dark-700/80 border border-white/5 text-gray-400 p-4 rounded-2xl rounded-bl-sm text-xs flex items-center gap-2">
                  <span className="text-xs font-semibold mr-1">Pensando</span>
                  <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-dark-800/80 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pregunta por un trago..."
              className="flex-1 bg-black/40 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-neon-purple outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-neon-purple text-white p-3 rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-900/50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;