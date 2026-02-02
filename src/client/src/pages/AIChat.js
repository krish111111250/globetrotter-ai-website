import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../api';

const AIChat = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Greetings, explorer. I am your Globetrotter AI Suite. How can I assist with your upcoming journey today?' }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await chatWithAI(userMsg);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.reply
            }]);
        } catch (err) {
            console.error("AI Chat Error:", err);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "I encountered a minor sync error. Please try again in a moment."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-serif italic text-aero-900 mb-2">AI Travel Suite</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Neural Link</span>
                        <div className="h-px w-12 bg-aero-200"></div>
                        <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Model: GT-v2.0 Active</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-aero-600 hover:text-primary-500 transition-all active:scale-95 border border-aero-200"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Chat Frame */}
            <div className="flex-1 glass-panel flex flex-col overflow-hidden border-white/40 bg-white/20">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <p className={`text-[9px] font-black text-aero-400 uppercase tracking-widest px-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.role === 'user' ? 'Transmission' : 'AI Node'}
                                </p>
                                <div className={`p-6 rounded-[2rem] text-sm md:text-base font-medium shadow-glass border transition-all ${msg.role === 'user'
                                        ? 'bg-aero-900 text-white rounded-tr-none border-white/10'
                                        : 'bg-white/80 text-aero-800 rounded-tl-none border-white/40'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-full flex gap-1 items-center border border-white/20">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bay */}
                <div className="p-6 md:p-8 bg-white/40 border-t border-white/40">
                    <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-4">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Query the travel nexus..."
                                className="w-full p-5 bg-white rounded-2xl border-2 border-transparent focus:border-primary-400 focus:bg-white outline-none font-bold text-aero-900 shadow-sm transition-all text-sm"
                            />
                        </div>
                        <button
                            disabled={!input || loading}
                            className="bg-aero-900 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary-600 active:scale-95 disabled:opacity-50 transition-all shrink-0"
                        >
                            <span className="text-xl">➹</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;