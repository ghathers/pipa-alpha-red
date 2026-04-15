import React, { useState, useRef, useEffect } from 'react';
import { Message, IncidentData } from '../types';
import { getPipaResponse } from '../services/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatProps {
  incident: IncidentData;
}

export const Chat: React.FC<ChatProps> = ({ incident }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I have analyzed your incident context. How can I help you with the post-incident planning today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getPipaResponse([...messages, userMessage], incident);
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full border rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="p-4 border-bottom bg-black text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest">PIPA Assistant</h3>
            <p className="text-[10px] opacity-70">Post-Incident Support Agent</p>
          </div>
        </div>
        <Sparkles size={16} className="text-yellow-400" />
      </div>

      <ScrollArea className="flex-1 p-4 min-h-0" viewportRef={scrollRef}>
        <div className="space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    m.role === 'user' ? 'bg-gray-100' : 'bg-black text-white'
                  }`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-gray-100 text-black rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PIPA about the incident..."
            className="bg-white border-gray-200 focus-visible:ring-black"
          />
          <Button type="submit" size="icon" className="bg-black hover:bg-gray-800 shrink-0">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};
