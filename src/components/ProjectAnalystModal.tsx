import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Loader2, Sparkles, User, FileText, Download, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeProject } from '../services/geminiService';
import { Article } from '../types';

interface ProjectAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ProjectAnalystModal: React.FC<ProjectAnalystModalProps> = ({ 
  isOpen, 
  onClose, 
  articles 
}) => {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Ciao! Sono il tuo analista di progetto IA. Chiedimi pure qualsiasi cosa riguardo al tuo computo metrico: suggerimenti, analisi dei costi, o controlli di coerenza.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const projectData = JSON.stringify(articles.map(a => ({ 
        code: a.code, 
        description: a.description, 
        unit: a.unit,
        unitPrice: a.unitPrice, 
        quantity: a.quantity,
        total: (a.quantity || 0) * (a.unitPrice || 0)
      })));
      const response = await analyzeProject(projectData, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Si è verificato un errore durante l\'analisi. Riprova più tardi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className={`bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ${isFullScreen ? 'w-full h-full m-0 rounded-none' : 'w-full max-w-5xl h-[90vh]'}`}>
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">
                Analista Progetto IA
              </h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Report & Analisi Tecnica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              title={isFullScreen ? "Riduci" : "Ingrandisci"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f8fafc]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg border border-slate-700">
                  <Bot className="w-6 h-6 text-green-400" />
                </div>
              )}
              
              <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-green-700 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md text-sm font-medium">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm overflow-hidden">
                    {/* Report Header Style for Assistant */}
                    <div className="bg-slate-50 border-b border-slate-100 px-5 py-2 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Report Generato
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="p-6 prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-h2:text-slate-900 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-0 prose-table:border prose-table:rounded-lg prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-strong:text-slate-900">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-green-200 order-2">
                  <User className="w-6 h-6 text-green-700" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                <Bot className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 max-w-[400px]">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-6 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs mt-4">
                    <Loader2 className="w-3 h-3 animate-spin" /> Elaborazione analisi tecnica...
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-200 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                className="w-full border border-slate-200 rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none resize-none transition-all bg-slate-50 hover:bg-white min-h-[60px] max-h-[200px]"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                placeholder="Chiedi un'analisi dettagliata, un controllo costi o suggerimenti tecnici..."
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSend(); 
                  } 
                }}
              />
              <div className="absolute right-4 bottom-4 text-[10px] text-slate-400 font-medium uppercase tracking-tighter pointer-events-none">
                Shift + Invio per a capo
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-[52px] w-[52px] bg-green-700 text-white rounded-2xl flex items-center justify-center hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-4">
            <button className="text-[10px] font-bold text-slate-400 hover:text-green-700 uppercase tracking-widest transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Analisi Costi
            </button>
            <button className="text-[10px] font-bold text-slate-400 hover:text-green-700 uppercase tracking-widest transition-colors flex items-center gap-1">
              <FileText className="w-3 h-3" /> Verifica Coerenza
            </button>
            <button className="text-[10px] font-bold text-slate-400 hover:text-green-700 uppercase tracking-widest transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> Esporta Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalystModal;
