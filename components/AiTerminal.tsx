'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, GraduationCap, Briefcase, TrendingUp, Cpu, Wifi, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AiTerminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'INITIALIZING MIHAI DANIEL CORE v3.0...\n\nSistemele sunt online. Sunt conectat la matricea pieței.\n\nSpune-mi, tati, astăzi facem bani sau doar ne uităm?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages.length]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ EROARE DE CONEXIUNE LA MATRICE. Reîncearcă.' }]);
    } finally { setIsLoading(false); }
  };

  return (
    <section id="ai" className="py-12 lg:py-24 relative bg-[#01030c] overflow-hidden min-h-screen lg:min-h-[950px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] lg:w-[1000px] h-[500px] lg:h-[1000px] bg-blue-600/20 rounded-full blur-[100px] lg:blur-[200px] pointer-events-none animate-pulse-slow"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-10 lg:mb-16">
                 {/* HEADER FUTURIST */}
                <div className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-2 lg:py-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-xl text-cyan-300 text-xs lg:text-sm font-bold tracking-[0.2em] lg:tracking-[0.3em] mb-6 uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                    <Cpu size={16} className="text-cyan-400 animate-spin-slow"/> QUANTUM AI CORE
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 lg:mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-400 tracking-tight leading-none filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    Vrei Adevărul? <br/> Primești Strategie.
                </h2>
                <p className="text-blue-200/70 text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed px-4">
                    Nu e un chatbot. E un sistem neural antrenat să gândească exact ca mine.
                </p>
            </div>

            {/* --- THE HOLOGRAPHIC TERMINAL --- */}
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-[30px] lg:rounded-[40px] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-gradient-xy"></div>
                
                <div className="bg-[#030712]/95 backdrop-blur-3xl border border-blue-500/20 rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-auto lg:h-[800px] relative z-10 ring-1 ring-blue-400/10">
                    
                    {/* LEFT PANEL */}
                    <div className="w-full lg:w-[400px] bg-[#02040a]/60 border-b lg:border-b-0 lg:border-r border-blue-500/10 p-6 lg:p-8 flex flex-col shrink-0 relative overflow-hidden">
                        <div className="relative w-40 h-40 lg:w-56 lg:h-56 mx-auto mb-6 lg:mb-10 flex items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30"></motion.div>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-cyan-400/40"></motion.div>
                            
                            <div className="relative w-28 h-28 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 animate-pulse-slow">
                                <Image 
                                    src="/mihai-daniel-icon.jpg" 
                                    alt="AI Core" 
                                    width={200}
                                    height={200}
                                    className="object-cover w-full h-full opacity-80 mix-blend-luminosity scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 flex gap-4 items-center justify-center w-full">
                                <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono"><Wifi size={12} className="animate-pulse"/> NET: STABLE</div>
                                <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono"><Activity size={12} className="animate-bounce-slow"/> CPU: 98%</div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 lg:space-y-4 overflow-y-auto pr-2 custom-scrollbar z-10 max-h-[200px] lg:max-h-none">
                            <p className="text-xs text-blue-300/50 font-mono uppercase tracking-[0.2em] mb-2 lg:mb-4 pl-2 text-center lg:text-left">/// QUICK_ACCESS</p>
                            
                            {[
                                { icon: GraduationCap, color: 'blue', text: 'De ce Cursul tău?', sub: 'Valoare vs. Preț' },
                                { icon: Briefcase, color: 'yellow', text: 'Consultanță VIP', sub: 'Audit Portofoliu Urgent' },
                                { icon: TrendingUp, color: 'green', text: 'Analiză Piață', sub: 'BTC / ETH Status' }
                            ].map((item, idx) => (
                                <button key={idx} onClick={() => handleSend(item.text)} className={`w-full text-left p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 hover:bg-${item.color}-500/10 border border-white/5 hover:border-${item.color}-500/50 transition-all group relative overflow-hidden`}>
                                    <div className="flex items-center gap-3 lg:gap-4 relative z-10">
                                        <div className={`bg-${item.color}-500/20 p-2 rounded-lg lg:rounded-xl text-${item.color}-400 shrink-0`}><item.icon size={18}/></div>
                                        <div>
                                            <div className="font-bold text-gray-100 text-xs lg:text-sm">{item.text}</div>
                                            <div className={`text-[9px] lg:text-[10px] text-${item.color}-300/70 font-mono mt-0.5`}>{item.sub}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: CHAT */}
                    <div className="flex-1 flex flex-col bg-transparent relative min-w-0 min-h-[500px] lg:min-h-auto">
                        <div className="h-16 lg:h-20 border-b border-blue-500/10 flex items-center justify-between px-4 lg:px-8 bg-[#030712]/50 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <Sparkles size={18} className="text-cyan-400 animate-pulse"/>
                                <div>
                                    <span className="text-xs lg:text-sm font-bold text-white tracking-widest block">NEURAL LINK</span>
                                    <span className="text-[9px] lg:text-[10px] font-mono text-blue-300/70">Online // Latency: 12ms</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 lg:p-10 overflow-y-auto space-y-6 custom-scrollbar relative h-[400px] lg:h-auto" style={{ overflowAnchor: 'none' }}>
                            <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[95%] lg:max-w-[80%] p-4 lg:p-6 rounded-2xl lg:rounded-3xl relative overflow-hidden group ${
                                        msg.role === 'ai' 
                                        ? 'bg-[#0a1025] text-blue-100 border border-blue-400/20' 
                                        : 'bg-gradient-to-br from-blue-600 to-cyan-700 text-white shadow-lg'
                                    }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap font-medium text-sm lg:text-base">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                            
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-[#0a1025]/80 px-6 py-4 rounded-2xl border border-blue-400/10 flex gap-3 items-center text-blue-300">
                                        <Loader2 size={16} className="animate-spin text-cyan-400"/>
                                        <span className="text-xs font-mono tracking-widest animate-pulse">PROCESSING...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        <div className="p-4 lg:p-8 border-t border-blue-500/10 bg-[#02040a]/80 backdrop-blur-xl relative z-20">
                            <div className="flex gap-2 lg:gap-4 relative group">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Scrie mesajul..."
                                    className="w-full bg-[#050810] text-white rounded-xl lg:rounded-2xl pl-4 lg:pl-8 pr-14 lg:pr-20 py-4 lg:py-5 border border-blue-500/20 focus:border-cyan-400/50 outline-none transition-all placeholder:text-blue-500/40 text-sm lg:text-base"
                                />
                                <button 
                                    onClick={() => handleSend(input)}
                                    disabled={isLoading || !input.trim()}
                                    aria-label="Trimite mesajul"
                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-cyan-500 text-white rounded-lg lg:rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    <Send size={18} className="lg:w-6 lg:h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}