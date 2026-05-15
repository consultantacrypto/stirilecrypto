import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Contactează-ne
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ai o întrebare despre academie, o propunere de parteneriat sau vrei să semnalezi o știre? Suntem aici.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Informații */}
          <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="text-blue-500" /> Email
              </h3>
              <p className="text-gray-400 mb-2">Pentru suport, întrebări și parteneriate:</p>
              <a href="mailto:consultantacrypto.ro@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium break-all">
                consultantacrypto.ro@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="text-green-500" /> Consultanță
              </h3>
              <p className="text-gray-400 mb-2">Programează o sesiune de strategie:</p>
              <a href="mailto:consultantacrypto.ro@gmail.com" className="text-green-400 hover:text-green-300 transition-colors font-medium break-all">
                consultantacrypto.ro@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-purple-500" /> Sediu Editorial
              </h3>
              <p className="text-gray-400">
                București, România<br />
                Sector 1, Piața Victoriei
              </p>
            </div>

            <div>
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-orange-500" /> Program
              </h3>
              <p className="text-gray-400">
                Luni - Vineri: 09:00 - 18:00<br />
                Weekend: Doar urgențe majore de piață
              </p>
            </div>
          </div>

          {/* Formular Contact */}
          <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Numele Tău</label>
                <input type="text" className="w-full bg-[#02050a] border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Ex: Alex Popescu" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Adresa de Email</label>
                <input type="email" className="w-full bg-[#02050a] border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="alex@email.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Subiect</label>
                <select className="w-full bg-[#02050a] border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors">
                  <option>Suport General</option>
                  <option>Consultanță 1-la-1</option>
                  <option>Problemă Acces Academie</option>
                  <option>Propunere Parteneriat</option>
                  <option>Presă / Media</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Mesaj</label>
                <textarea rows={4} className="w-full bg-[#02050a] border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Salut Mihai, aș vrea să știu..."></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20">
                Trimite Mesajul
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                *Datele tale sunt protejate conform politicii GDPR. Nu trimitem spam.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}