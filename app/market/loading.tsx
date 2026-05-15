import { Activity } from 'lucide-react';

export default function MarketLoading() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans">
      {/* Navbar Placeholder */}
      <div className="h-20 border-b border-white/5 bg-[#02050a]/80 backdrop-blur-md fixed top-0 w-full z-50"></div>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* 1. Header Skeleton */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600/20 p-2 rounded-lg w-10 h-10 animate-pulse"></div>
                <div className="h-8 w-64 bg-white/5 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-full max-w-2xl bg-white/5 rounded animate-pulse mt-2"></div>
        </div>

        {/* 2. Ticker Tape Skeleton */}
        <div className="mb-8">
            <div className="h-10 w-full bg-white/5 rounded animate-pulse"></div>
        </div>

        {/* 3. Metrics Grid Skeleton (Cu efect de VAL - Staggered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
                <div 
                    key={i} 
                    className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse"
                    style={{ 
                        animationDelay: `${i * 150}ms`, // ✨ Aici e magia: întârziere progresivă
                        animationDuration: '1.5s'
                    }}
                ></div>
            ))}
        </div>

        {/* 4. Main Layout Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Stânga */}
            <div className="xl:col-span-9 space-y-6">
                <div className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
                <div className="h-96 bg-white/5 rounded-xl animate-pulse"></div>
            </div>

            {/* Dreapta */}
            <div className="xl:col-span-3 space-y-6">
                <div className="h-64 bg-white/5 rounded-xl animate-pulse"></div>
                <div className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
            </div>

        </div>
      </main>
    </div>
  );
}