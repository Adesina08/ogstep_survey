

import React, { useState, useRef, useEffect } from 'react';
// FIX: The component now receives the entire DashboardData object for context.
import { DashboardData } from '../../types';
import { analyzeDataWithGemini } from '../../services/geminiService';
// FIX: Card is a named export, not a default export.
import { Card } from '../ui/Card';
import { Send, User, Bot, CornerDownLeft, Sparkles } from 'lucide-react';

interface AIAnalystProps {
  // FIX: Changed prop from `submissions` to `data` to provide full context to the AI.
  data: DashboardData;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
        sender: 'ai',
        text: "Hello! I'm your AI Data Analyst. Ask me anything about the survey data, such as 'Which state has the most rejections?' or 'Show me the top 3 surveyors by approval rate'."
    }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // FIX: Pass the entire `data` object to the Gemini service.
      const aiResponse = await analyzeDataWithGemini(data, query);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error while analyzing the data. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Sparkles className="text-primary mr-3" />
        <h3 className="text-lg font-semibold text-text-primary">AI Analyst Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white">
                <Bot size={20} />
              </div>
            )}
            <div className={`max-w-xl p-4 rounded-xl ${msg.sender === 'ai' ? 'bg-gray-800 text-text-secondary' : 'bg-primary text-white'}`}>
                <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 text-text-primary">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white">
                    <Bot size={20} />
                 </div>
                 <div className="max-w-xl p-4 rounded-xl bg-gray-800 text-text-secondary">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-muted rounded-full animate-bounce"></div>
                    </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the data..."
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-4 pr-20 focus:ring-2 focus:ring-primary focus:outline-none text-text-primary placeholder-muted"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-16 text-muted hover:text-primary disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin"></div> : <Send size={20} />}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default AIAnalyst;
