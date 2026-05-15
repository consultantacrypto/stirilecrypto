import Navbar from '@/components/Navbar';
import Course from '@/components/Course';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Curs Trading | Mihai Daniel',
  description: 'Învață să tranzacționezi corect cu un sistem validat.',
};

export default function CursPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. Navigația (ca să se poată întoarce acasă) */}
      <Navbar />

      {/* 2. Spațiu gol sus (pentru că Navbar e fix) */}
      <div className="pt-20">
        
        {/* 3. Componenta Cursului (Mobilierul) */}
        <Course />
        
      </div>

      {/* 4. Footer (ca să arate profi) */}
      <Footer />
      
    </main>
  );
}