import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface GeminiTutorProps {
    courseTitle: string;
    isOpen: boolean;
    onClose: () => void;
    systemInstruction?: string;
}

export const GeminiTutor: React.FC<GeminiTutorProps> = ({ courseTitle, isOpen, onClose, systemInstruction }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'model',
                text: `Hi! I'm your ${courseTitle} AI Tutor. How can I help you today?`,
                timestamp: new Date()
            }]);
        }
        if (isOpen) scrollToBottom();
    }, [isOpen, courseTitle]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const history = messages.map(m => ({ role: m.role, text: m.text }));

        try {
            const responseText = await getTutorResponse(courseTitle, userMsg.text, history, systemInstruction);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    if (!isOpen) return null;

    return (
        // Changed fixed to absolute to be relative to the App container (Phone Frame)
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full h-[95%] sm:h-[90%] rounded-t-[32px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 mx-0 sm:mx-4">
                
                {/* Header */}
                <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{courseTitle} Tutor</h3>
                            <div className="flex items-center gap-1 text-indigo-200 text-xs">
                                <Sparkles size={10} /> Powered by Gemini
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm ml-10">
                                <Loader2 className="animate-spin text-indigo-500" size={16} />
                                <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100 pb-8 sm:pb-4 shrink-0">
                    <div className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-inner">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400 text-slate-700 font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};