'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dictionary, AcademyItem } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, X, ArrowUpRight, ShieldCheck, BookOpen, Activity, BrainCircuit, Database, Zap, Brain, TrendingUp, CheckCircle2 } from 'lucide-react';

// Categorii pentru tab-uri (Navigare clară stil Binance)
const CATEGORIES = [
  { id: 'TOATE', label: 'Toate', icon: <BookOpen size={16}/> },
  { id: 'BITCOIN & FUNDAMENTE', label: 'Bitcoin & Baze', icon: <Database size={16}/> },
  { id: 'TRADING & CHARTURI', label: 'Trading', icon: <Activity size={16}/> },
  { id: 'DEFI & WEB3', label: 'DeFi & Web3', icon: <BrainCircuit size={16}/> },
  { id: 'SECURITATE & WALLETS', label: 'Securitate', icon: <ShieldCheck size={16}/> },
  { id: 'ANALIZĂ FUNDAMENTALĂ', label: 'Analiză Fund.', icon: <TrendingUp size={16}/> },
  { id: 'PSIHOLOGIE & CICLE', label: 'Psihologie', icon: <Brain size={16}/> },
];

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('TOATE');
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // === 🧠 GAME MECHANICS: MEMORIA LOCALĂ ===
  
  // Funcție de reîmprospătare a progresului (poate fi apelată oricând)
  const refreshProgress = () => {
    const saved = localStorage.getItem('mihai_academy_progress');
    if (saved) {
      setReadArticles(JSON.parse(saved));
    }
  };

  useEffect(() => {
    // 1. Citim la încărcarea paginii
    refreshProgress();

    // 2. Ascultăm evenimentul de "focus" (când utilizatorul revine în tab/pagină după ce a citit)
    window.addEventListener('focus', refreshProgress);
    
    // 3. Ascultăm evenimentul custom "storage" (dacă modifică în alt tab)
    window.addEventListener('storage', refreshProgress);

    // Curățăm ascultătorii când pleacă de pe pagină
    return () => {
      window.removeEventListener('focus', refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  // Calculăm procentajul
  const progressPercentage = Math.round((readArticles.length / dictionary.length) * 100);

  // Logică de Filtrare
  const filteredArticles = dictionary.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'TOATE' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white font-[var(--font-inter)] selection:bg-blue-500/30">
      <Navbar />
      
      {/* === HERO SECTION === */}
      <div className="relative pt-32 pb-12 px-6 container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-[var(--font-space)]">
              Academia Crypto
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Nu ghici. Învață. Ghiduri complete de la zero la expert, explicate pe înțelesul tuturor.
          </p>

          {/* === 🧠 BARA DE PROGRES (Gamification) === */}
          <div className="max-w-xl mx-auto mb-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400 font-medium">Nivelul tău de cunoștințe</span>
                <span className="text-blue-400 font-bold">{readArticles.length} / {dictionary.length} Articole ({progressPercentage}%)</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center font-medium">
                {progressPercentage === 100 ? "🏆 Ești un Expert Crypto! Ai terminat tot cursul!" : "Citește toate ghidurile pentru a deveni un investitor complet."}
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Caută subiecte (ex: Bitcoin, RSI, Wallets)..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all shadow-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={16}/></button>}
          </div>
      </div>

      {/* === CATEGORY TABS === */}
      <div className="border-b border-white/5 sticky top-20 z-30 bg-[#020617]/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-8 min-w-max pb-1">
                  {CATEGORIES.map((cat) => (
                      <button
                          key={cat.id}
                          onClick={() => setActiveFilter(cat.id)}
                          className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
                              activeFilter === cat.id 
                              ? 'text-blue-400 border-blue-400' 
                              : 'text-gray-400 border-transparent hover:text-white'
                          }`}
                      >
                          {cat.icon}
                          {cat.label}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* === CONTENT GRID === */}
      <div className="container mx-auto px-6 py-12 min-h-[50vh]">
          
          <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {activeFilter === 'TOATE' ? <Zap className="text-yellow-500"/> : CATEGORIES.find(c => c.id === activeFilter)?.icon}
                  {activeFilter === 'TOATE' ? 'Toate Ghidurile' : CATEGORIES.find(c => c.id === activeFilter)?.label}
              </h2>
              <span className="text-sm text-gray-500">{filteredArticles.length} Articole</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((item) => (
                  <ArticleCard 
                    key={item.slug} 
                    item={item} 
                    isRead={readArticles.includes(item.slug)} 
                  />
              ))}
          </div>

          {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Nu am găsit articole pentru această căutare.</p>
                  <button onClick={() => {setSearchQuery(''); setActiveFilter('TOATE')}} className="mt-4 text-blue-400 hover:underline">
                      Resetează filtrele
                  </button>
              </div>
          )}

      </div>

      <Footer />
    </main>
  );
}

// --- COMPONENTA CARD CU LOGICĂ PREMIUM DE CULORI ---
function ArticleCard({ item, isRead }: { item: AcademyItem, isRead: boolean }) {
    
    // ✅ Aceasta este funcția pentru culori pe categorii
    const getCategoryColor = (cat: string) => {
        if (cat.includes('SECURITATE')) return 'text-red-400 bg-red-950/30 border-red-500/20 shadow-red-900/10';
        if (cat.includes('BITCOIN')) return 'text-orange-400 bg-orange-950/30 border-orange-500/20 shadow-orange-900/10';
        if (cat.includes('DEFI')) return 'text-purple-400 bg-purple-950/30 border-purple-500/20 shadow-purple-900/10';
        if (cat.includes('PSIHOLOGIE')) return 'text-pink-400 bg-pink-950/30 border-pink-500/20 shadow-pink-900/10';
        if (cat.includes('ANALIZĂ')) return 'text-green-400 bg-green-950/30 border-green-500/20 shadow-green-900/10';
        if (cat.includes('TRADING')) return 'text-blue-400 bg-blue-950/30 border-blue-500/20 shadow-blue-900/10';
        return 'text-gray-400 bg-gray-800 border-gray-700';
    };

    const badgeStyle = getCategoryColor(item.category);

    return (
        <Link 
            href={`/academie/${item.slug}`} 
            className={`group bg-[#0a0f1e] rounded-2xl border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${
                isRead ? 'border-green-500/30 opacity-75 hover:opacity-100' : 'border-white/5 hover:border-blue-500/30'
            }`}
        >
            
            {/* Imaginea de sus */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image 
                    src={item.image} 
                    alt={item.term} 
                    fill 
                    className={`object-cover transition-transform duration-700 ${isRead ? 'grayscale group-hover:grayscale-0' : 'group-hover:scale-105'}`}
                    unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] to-transparent opacity-60"></div>
                
                {/* Badge Categorie - Aici se aplică culoarea specifică */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${badgeStyle}`}>
                    {item.category.split(' &')[0]}
                </div>

                {/* ✅ Badge CITIT (Dopamina) */}
                {isRead && (
                    <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-green-500/20 z-10 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={12} />
                        CITIT
                    </div>
                )}
            </div>

            {/* Conținut Text */}
            <div className="p-6 flex flex-col flex-grow relative">
                <h3 className={`text-xl font-bold mb-3 transition-colors line-clamp-2 ${isRead ? 'text-gray-400 group-hover:text-white' : 'text-white group-hover:text-blue-400'}`}>
                    {item.term}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {item.definition}
                </p>
                
                <div className={`flex items-center text-sm font-bold mt-auto group/btn ${isRead ? 'text-green-400' : 'text-blue-400'}`}>
                    {isRead ? 'Recitește Ghidul' : 'Începe Lecția'} 
                    <ArrowUpRight size={16} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"/>
                </div>
            </div>
        </Link>
    );
}