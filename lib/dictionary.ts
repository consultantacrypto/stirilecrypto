// lib/dictionary.ts

// --- 1. DEFINIREA TIPURILOR (STRUCTURA) ---
export type AcademyCategory = 
  | 'BITCOIN & FUNDAMENTE' 
  | 'TRADING & CHARTURI' 
  | 'DEFI & WEB3' 
  | 'SECURITATE & WALLETS' 
  | 'PSIHOLOGIE & CICLE'
  | 'ANALIZĂ FUNDAMENTALĂ';

export type AcademyItem = {
  slug: string;       
  term: string;       
  image: string;      
  category: AcademyCategory;
  definition: string; 
  analogy: string;    
  mihaiTake: string;  
  fullContent: string;
};

// --- 2. CONȚINUTUL ACADEMIEI (FULL CONTENT) ---
export const dictionary: AcademyItem[] = [
  // === 1. BITCOIN (FUNDAMENTE) ===
  {
    slug: "ce-este-bitcoin-ghid-complet",
    term: "Bitcoin (BTC)",
    category: "BITCOIN & FUNDAMENTE",
    image: "/bitcoinacademy.jpg", 
    definition: "Ghidul complet despre Bitcoin. Nu este doar o monedă, este prima formă de proprietate digitală absolută din istoria omenirii.",
    analogy: "Registrul Public Indestructibil. Imaginează-ți un caiet uriaș ținut de milioane de oameni simultan. Nimeni nu poate rupe o pagină din el fără ca toți ceilalți să observe.",
    mihaiTake: "Să înțelegi Bitcoin astăzi este ca și cum ai fi înțeles Internetul în 1995. Pare ciudat, pare complicat, dar este tehnologia care va reseta modul în care funcționează lumea. Nu trebuie să fii expert IT, trebuie doar să înțelegi un lucru: Banii s-au schimbat pentru totdeauna.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Introducere: Ce este Bitcoin, cu adevărat?</h3>
      <p class="mb-4 text-gray-300">Dacă întrebi 10 oameni ce este Bitcoin, vei primi 10 răspunsuri diferite: "Bani de internet", "O schemă piramidală", "Aur Digital". Să simplificăm.</p>
      <p class="text-xl text-white font-medium mb-6 border-l-4 border-orange-500 pl-4">Bitcoin este prima formă de proprietate digitală absolută din istoria omenirii.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Până la Bitcoin:</strong> Dacă aveai bani într-o bancă, banca îi deținea, tu aveai doar o promisiune. Dacă aveai o poză pe Facebook, Facebook o putea șterge.</li>
        <li><strong>După Bitcoin:</strong> Dacă deții cheia privată (parola), nimeni – niciun guvern, nicio bancă, niciun hacker – nu îți poate confisca fondurile. Este "Bani separați de Stat".</li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Tehnologia: Cum funcționează fără șefi? (Blockchain)</h3>
      <p class="mb-4 text-gray-300">Cum poți avea un sistem financiar fără o bancă centrală? Răspunsul este o inovație numită <strong>Blockchain</strong> (Lanț de Blocuri).</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <strong class="text-blue-400 block mb-2">Explicația Simplă: Registrul Public</strong>
        <p class="text-gray-300">Imaginează-ți un caiet uriaș în care sunt scrise toate tranzacțiile. În loc să fie ținut într-un seif la Banca Națională, copii ale lui sunt deținute de milioane de oameni simultan. Dacă eu vreau să trimit 1 Bitcoin, toți verifică caietele lor. Dacă toți sunt de acord, tranzacția se scrie.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Tokenomics: Matematica Rarității</h3>
      <p class="mb-4 text-gray-300">Aici stă geniul lui Satoshi Nakamoto. Bitcoin este programat să fie anti-inflaționist.</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-orange-500/20">
            <strong class="text-orange-400 block mb-2">Limita de 21 Milioane</strong>
            <p class="text-sm text-gray-400">Nu vor exista niciodată mai mult de 21.000.000 de Bitcoin. Spre deosebire de Dolari care se tipăresc infinit, Bitcoin este finit.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Halving-ul</strong>
            <p class="text-sm text-gray-400">La fiecare 4 ani, producția de Bitcoin nou se înjumătățește. Oferta scade, cererea crește = Prețul Urcă.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Use Case: La ce e bun?</h3>
      <p class="mb-4 text-gray-300">Bitcoin are două funcții majore care evoluează în timp:</p>
      <ul class="list-disc pl-6 mb-6 space-y-4 text-gray-300">
        <li><strong>Store of Value (Aur Digital):</strong> Faza actuală. Oamenii cumpără Bitcoin pentru a-și proteja averea de inflație pe termen lung (5-10 ani). Este contul de economii suprem.</li>
        <li><strong>Medium of Exchange (Plăți):</strong> Pe măsură ce tehnologia avansează (Lightning Network), devine o monedă pentru plăți instantanee globale.</li>
      </ul>
      <p class="italic text-gray-400 mb-6">Exemplu: Să trimiți 1 Miliard $ duminică seara prin bancă durează 3 zile și costă mii de dolari. Prin Bitcoin durează 10 minute și costă câțiva dolari.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. De ce contează? Libertate.</h3>
      <p class="mb-4 text-gray-300">Dincolo de preț, Bitcoin este o mișcare pentru Libertate. Într-o lume în care guvernele pot îngheța conturile, Bitcoin este singura "ușă de ieșire".</p>
      <p class="text-white font-bold">Este un sistem financiar neutral. Bitcoin nu știe dacă ești alb sau negru, rus sau american. El doar procesează tranzacții valide.</p>
    `
  },

  // === 2. ETHEREUM (DEFI & WEB3) ===
  {
    slug: "ce-este-ethereum-ghid-suprem",
    term: "Ethereum (ETH)",
    category: "DEFI & WEB3",
    image: "/ethereumexplicat.jpg",
    definition: "Ghidul Suprem. Ethereum nu este doar o monedă, este un 'World Computer'. Dacă Bitcoin este Nokia, Ethereum este iPhone-ul pe care se construiesc aplicațiile viitorului.",
    analogy: "Nokia vs iPhone. Bitcoin este telefonul robust, bun pentru apeluri (plăți). Ethereum este smartphone-ul pe care instalezi aplicații (DApps, DeFi, NFT).",
    mihaiTake: "Bitcoin ne-a dat banii digitali. Ethereum ne-a dat economia digitală. Astăzi, pe Ethereum se construiesc finanțele viitorului. Dacă Bitcoin este Regele, Ethereum este Regatul.",
    fullContent: `
        <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este Ethereum? (Definiția Simplă vs. Tehnică)</h3>
        <p class="mb-4 text-gray-300">Majoritatea oamenilor cred că Ethereum este doar "a doua cea mai mare criptomonedă după Bitcoin". Este o înțelegere limitată.</p>
        
        <div class="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mb-6">
            <strong class="text-purple-400 block mb-2">Analoga Simplă:</strong>
            <p class="text-gray-300">Gândește-te la Bitcoin ca la un telefon Nokia vechi (excelent pentru apeluri/plăți, robust, indestructibil). Gândește-te la Ethereum ca la un iPhone. Are valoare intrinsecă, dar adevărata lui putere vine din faptul că dezvoltatorii pot construi aplicații (Apps) pe el.</p>
        </div>

        <p class="mb-4 text-gray-300"><strong>Definiția Tehnică:</strong> Ethereum este un blockchain programabil, o platformă globală open-source pentru aplicații descentralizate (dApps). Este un "World Computer" (Computer Mondial) care nu poate fi oprit sau cenzurat.</p>
        <p class="mb-6 text-gray-300"><strong>Moneda:</strong> Numele rețelei este Ethereum. Numele monedei pe care o cumperi este Ether (ETH). Ether este "combustibilul" (gas) care plătește pentru utilizarea acestui computer global.</p>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Geneza: Băiatul Geniu și Viziunea (2013-2015)</h3>
        <p class="mb-4 text-gray-300">Istoria Ethereum începe cu un adolescent: Vitalik Buterin. În 2013, și-a dat seama că Bitcoin are o limitare majoră: era proiectat doar pentru bani. Vitalik a propus comunității Bitcoin să adauge un limbaj de programare complex. Comunitatea a refuzat.</p>
        <p class="italic text-gray-400 mb-4">Așa că Vitalik a spus celebra frază: "Fine, I'll do it myself" (Bine, o fac singur).</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>2013:</strong> Vitalik publică "Ethereum Whitepaper".</li>
            <li><strong>2014:</strong> Are loc vânzarea inițială (ICO), unde 1 BTC cumpăra 2.000 ETH (o investiție legendară azi).</li>
            <li><strong>30 Iulie 2015:</strong> Se lansează rețeaua ("Frontier"). Lumea crypto se schimbă pentru totdeauna.</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Inovația Supremă: Smart Contracts</h3>
        <p class="mb-4 text-gray-300">Aceasta este "sosul secret" al Ethereum. Un Smart Contract este un cod informatic care se execută singur atunci când sunt îndeplinite anumite condiții. Nu are nevoie de avocat, notar sau bancă.</p>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-[#0a0f1e] p-4 rounded-lg border border-red-500/20">
                <strong class="text-red-400 block mb-2">Lumea Veche</strong>
                <p class="text-sm text-gray-400">Vrei să vinzi o casă. Ai nevoie de agent, notar, bancă, cadastru. Durează luni, costă mii de euro.</p>
            </div>
            <div class="bg-[#0a0f1e] p-4 rounded-lg border border-green-500/20">
                <strong class="text-green-400 block mb-2">Ethereum</strong>
                <p class="text-sm text-gray-400">Scrii un contract inteligent: "Dacă A trimite 100 ETH, Token-ul casei se transferă automat la A, banii la B." Instant, transparent.</p>
            </div>
        </div>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Istoria Zbuciumată</h3>
        <p class="mb-4 text-gray-300">Ethereum nu a avut un drum lin. A trecut prin foc și sabie.</p>
        <ul class="space-y-4 text-gray-300">
            <li><strong>A. The DAO Hack (2016):</strong> Prima mare aplicație a fost hackuită (50M $). Comunitatea a dat timpul înapoi (Hard Fork) pentru a recupera banii. Așa s-a născut Ethereum Classic (ETC) - cei care au refuzat schimbarea.</li>
            <li><strong>B. ICO Boom (2017):</strong> Oricine putea crea o monedă nouă. A dus la o manie globală, cimentând Ethereum ca standard al industriei.</li>
            <li><strong>C. DeFi Summer (2020) & NFT Craze (2021):</strong> Ethereum a demonstrat că poate înlocui băncile (Uniswap) și galeriile de artă (NFT).</li>
            <li><strong>D. The Merge (2022):</strong> Cel mai complex eveniment. Trecerea de la Proof of Work (Minare) la Proof of Stake. Consumul de energie a scăzut cu 99.95%.</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Tokenomics: "Ultra Sound Money"</h3>
        <p class="mb-4 text-gray-300">După upgrade-ul EIP-1559 și The Merge, economia ETH s-a schimbat fundamental.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>Staking:</strong> Dacă blochezi ETH pentru securitate, primești dobândă. ETH devine "Internet Bond".</li>
            <li><strong>The Burn (Arderea):</strong> La fiecare tranzacție, o parte din taxă este distrusă.</li>
            <li><strong>Deflație:</strong> În activitate intensă, oferta totală scade. Asta face ETH "Ultra Sound Money".</li>
        </ul>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">6. Problema și Soluția: Layer 2</h3>
        <p class="mb-4 text-gray-300">Ethereum a devenit victima propriului succes (taxe mari). Soluția actuală este <strong>Layer 2 (L2)</strong>.</p>
        <p class="mb-4 text-gray-300">Imaginează-ți Ethereum ca pe o autostradă sigură dar lentă. L2 (Arbitrum, Optimism) sunt autobuze rapide deasupra autostrăzii. Procesează mii de tranzacții ieftin, apoi scriu rezultatul final pe Ethereum.</p>

        <h3 class="text-2xl font-bold text-white mt-12 mb-4">7. Concluzie: De ce Ethereum este Inevitabil</h3>
        <p class="mb-4 text-gray-300">Bitcoin ne-a dat banii digitali. Ethereum ne-a dat economia digitală.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li><strong>Finanțe:</strong> Stablecoins de trilioane de dolari.</li>
            <li><strong>Tokenizarea Activelor:</strong> BlackRock lansează fonduri pe Ethereum.</li>
            <li><strong>Identitate Digitală:</strong> Web3 și controlul datelor.</li>
        </ul>
        <p class="text-white font-bold border-l-4 border-purple-500 pl-4">Ethereum nu este perfect. Dar este singurul computer global descentralizat care a supraviețuit tuturor atacurilor. Dacă Bitcoin este Regele, Ethereum este Regatul.</p>
    `
  },

  // === 3. PORTOFELE & SECURITATE ===
  {
    slug: "portofele-crypto-hot-vs-cold-ghid",
    term: "Hot vs. Cold Wallets",
    category: "SECURITATE & WALLETS",
    image: "/hotcoldwalletacademie.jpg",
    definition: "Ghidul de Supraviețuire. Portofelul tău crypto NU conține niciun Bitcoin, ci doar cheile de acces. Învață diferența critică dintre a ține banii 'în buzunar' (Hot) și 'în seif' (Cold).",
    analogy: "Bani de buzunar vs. Seiful Băncii. Un Hot Wallet (telefon) este portofelul cu mărunțiș pentru cafea. Un Cold Wallet (Ledger) este seiful îngropat în pământ unde ții lingourile de aur.",
    mihaiTake: "Să deții crypto fără un Cold Wallet este ca și cum ai ține lingouri de aur pe o bancă în parc. Libertatea vine cu responsabilitate. Fii propria ta bancă, nu doar un client al ei.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Marea Concepție Greșită: Unde sunt banii tăi?</h3>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <p class="text-gray-300 mb-2">Primul lucru pe care trebuie să-l afli o să te șocheze: <strong class="text-white">Portofelul tău crypto NU conține niciun Bitcoin.</strong></p>
        <p class="text-gray-300">Spre deosebire de un portofel fizic, un portofel crypto (Wallet) este de fapt un <strong>Breloc de Chei</strong>.</p>
        <ul class="list-disc pl-6 mt-4 space-y-2 text-gray-300">
            <li><strong>Blockchain-ul</strong> este seiful comun, aflat pe internet, care conține toți banii.</li>
            <li><strong>Portofelul tău</strong> conține doar Cheia Privată (parola) care îți permite să muți banii din acel seif.</li>
        </ul>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Tipuri de Portofele: Fierbinți vs. Reci</h3>
      <p class="mb-6 text-gray-300">Aici se face diferența între "bani de cheltuială" și "avere".</p>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20 relative overflow-hidden">
            <div class="absolute top-2 right-2 text-2xl opacity-20">🔥</div>
            <strong class="text-red-400 block mb-2 text-lg">A. Hot Wallets (Fierbinți)</strong>
            <p class="text-xs text-gray-500 mb-3 uppercase">Ex: MetaMask, Phantom, Trust Wallet</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Ce sunt:</strong> Aplicații pe telefon sau extensii conectate permanent la internet.</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Riscuri:</strong> Vulnerabile la hackeri, viruși și link-uri malițioase.</p>
            <p class="text-sm text-white font-bold mt-3 border-t border-white/10 pt-2">Regula: Ține aici doar bani de cheltuială.</p>
         </div>

         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-cyan-500/20 relative overflow-hidden">
            <div class="absolute top-2 right-2 text-2xl opacity-20">❄️</div>
            <strong class="text-cyan-400 block mb-2 text-lg">B. Cold Wallets (Reci)</strong>
            <p class="text-xs text-gray-500 mb-3 uppercase">Ex: Ledger, Trezor, Tangem</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Ce sunt:</strong> Dispozitive fizice (stick USB) care țin cheile OFFLINE.</p>
            <p class="text-sm text-gray-400 mb-2"><strong>Siguranță:</strong> Hackerul nu poate apăsa butonul fizic de la distanță.</p>
            <p class="text-sm text-white font-bold mt-3 border-t border-white/10 pt-2">Regula: Aici se ține averea (HODL).</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Cele 12 Cuvinte: Seed Phrase</h3>
      <div class="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/30 mb-6 relative">
         <strong class="text-yellow-400 block mb-4 text-xl">⚠️ Regulile de Aur</strong>
         <p class="text-gray-300 mb-4">Când îți creezi un portofel, primești 12-24 de cuvinte. Aceasta este "Cheia Master". Cine are cuvintele, are banii.</p>
         <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-2"><span class="text-red-500 font-bold">1.</span> Nu le scrie niciodată digital (poze, notițe, mail).</li>
            <li class="flex items-start gap-2"><span class="text-green-500 font-bold">2.</span> Scrie-le pe hârtie sau metal și ascunde-le.</li>
            <li class="flex items-start gap-2"><span class="text-white font-bold">3.</span> Niciun "Suport Tehnic" nu îți va cere vreodată cele 12 cuvinte.</li>
         </ul>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Custodial vs. Non-Custodial</h3>
      <ul class="space-y-4 text-gray-300 mb-6">
        <li class="bg-white/5 p-4 rounded-lg">
            <strong>Custodial (Bursa/Exchange):</strong> Când ții banii pe Binance. Ei au cheia. Dacă dau faliment (FTX), pierzi tot. Tu ai doar o promisiune (IOU).
        </li>
        <li class="bg-white/5 p-4 rounded-lg">
            <strong>Non-Custodial (Self-Custody):</strong> Când muți banii pe Ledger. Tu ai cheia. Tu ești responsabil. Dacă pierzi cuvintele, nu există "Reset Password".
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Cum să nu fii jefuit: Igiena Digitală</h3>
      <p class="mb-4 text-gray-300">Securitatea nu este un soft, este un comportament.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Burner Wallets:</strong> Vrei să cumperi un NFT dubios? Folosește un portofel gol, nu pe cel principal.</li>
        <li><strong>Address Poisoning:</strong> Verifică mereu primele și ultimele 4 caractere ale adresei unde trimiți.</li>
        <li><strong>Nu te grăbi:</strong> O tranzacție greșită în crypto este ireversibilă.</li>
      </ul>
    `
  },

  // === 4. TOKENOMICS (ANALIZĂ FUNDAMENTALĂ) ===
  {
    slug: "tokenomics-ghid-market-cap-fdv",
    term: "Tokenomics",
    category: "ANALIZĂ FUNDAMENTALĂ",
    image: "/tokenimicsexplicat.jpg",
    definition: "Matematica din spatele câștigurilor. De ce prețul unei monede este o iluzie și ce contează cu adevărat (Market Cap vs FDV).",
    analogy: "Pizza feliată. O pizza tăiată în 100 de felii nu are mai multă mâncare decât una tăiată în 4. Doar feliile (monedele) par mai mici și mai ieftine.",
    mihaiTake: "Dacă vrei să știi dacă o monedă mai poate face 100x, nu te uita la grafic, uită-te la Market Cap. Un 0.00001$ poate fi mult mai scump decât un 60.000$ dacă există trilioane de monede.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Marea Iluzie: "Unit Bias"</h3>
      <p class="mb-4 text-gray-300">Începem cu greșeala #1 a începătorilor: Prejudecata Unității.</p>
      
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6">
         <strong class="text-red-400 block mb-2">Gândirea greșită:</strong>
         <p class="text-gray-300 italic mb-2">"Bitcoin e prea scump (90.000$), nu pot lua unul întreg. Mai bine iau XRP că e doar 2$ și poate ajunge și el la 90.000$."</p>
         <p class="text-white font-bold border-t border-red-500/20 pt-2 mt-2">Realitatea: Pentru ca XRP să ajungă la prețul Bitcoin, ar trebui să valoreze mai mult decât toți banii de pe planetă.</p>
      </div>
      <p class="text-gray-300 mb-6">Prețul unei singure monede este irelevant fără context. Este ca și cum ai spune că o felie de pizza e "ieftină" fără să știi dacă pizza a fost tăiată în 4 felii sau în 1.000 de felii.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Formula Sfântă: Market Cap</h3>
      <p class="mb-4 text-gray-300">Valoarea reală a unui proiect nu este Prețul, ci Capitalizarea de Piață.</p>
      
      <div class="bg-[#0a0f1e] p-6 rounded-xl border border-blue-500/30 text-center mb-6">
        <p class="text-2xl text-blue-400 font-mono font-bold mb-2">Market Cap = Preț × Monede în Circulație</p>
        <p class="text-gray-400 text-sm">Ex: Bitcoin are preț mare x număr mic. Meme Coins au preț mic x număr infinit.</p>
      </div>
      <p class="text-gray-300 mb-6"><strong>Regula:</strong> Compară Market Cap-ul, nu prețul. Dacă un proiect nou are deja 10 Miliarde $, e greu să mai facă 100x (ar trebui să devină mai mare ca Facebook).</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Cei 3 Mușchetari ai Ofertei (Supply)</h3>
      <p class="mb-4 text-gray-300">Când citești datele pe CoinGecko, trebuie să înțelegi trei termeni critici:</p>
      <ul class="space-y-4 text-gray-300 mb-6">
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-green-400">🟢 Circulating Supply (În Circulație)</strong>
            <p class="text-sm text-gray-400">Câte monede sunt în piață acum. Asta determină prețul actual.</p>
         </li>
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-yellow-400">🟡 Total Supply (Totalul)</strong>
            <p class="text-sm text-gray-400">Câte monede există, dar unele pot fi blocate sau arse.</p>
         </li>
         <li class="bg-white/5 p-4 rounded-lg">
            <strong class="text-red-400">🔴 Max Supply (Maximul)</strong>
            <p class="text-sm text-gray-400">Câte vor exista vreodată. Bitcoin are 21M. Altele au trilioane sau sunt infinite.</p>
         </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. FDV: The Silent Killer</h3>
      <div class="bg-orange-900/10 p-6 rounded-xl border border-orange-500/20 mb-6 relative">
         <strong class="text-orange-400 block mb-2 text-lg">⚠️ Secretul VC-urilor (Venture Capital)</strong>
         <p class="text-gray-300 mb-4"><strong>FDV (Fully Diluted Valuation) = Preț Actual × Max Supply.</strong></p>
         <p class="text-gray-300">Este valoarea proiectului "în viitor", când toate monedele vor fi deblocate. Multe proiecte noi ("Worldcoin") au un Market Cap mic (par ieftine), dar un FDV monstruos. </p>
         <p class="text-white font-bold mt-2">Lecția: Nu cumpăra proiecte cu FDV uriaș și Market Cap mic. Urmează ani de inflație și vânzări agresive.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Alocarea și Vesting-ul</h3>
      <p class="mb-4 text-gray-300">Înainte să cumperi, verifică cine deține "plăcinta".</p>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <strong class="text-green-400 block mb-1">✅ Fair Launch (Bun)</strong>
            <p class="text-sm text-gray-400">Majoritatea monedelor sunt la comunitate (ex: Bitcoin).</p>
         </div>
         <div class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <strong class="text-red-400 block mb-1">❌ VC Owned (Rău)</strong>
            <p class="text-sm text-gray-400">20% echipă, 30% investitori privați, doar 10% public. Când investitorii primesc monedele ("Vesting"), prețul se prăbușește.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Nu fi "Exit Liquidity"</h3>
      <p class="mb-4 text-gray-300">Tokenomics este studiul cererii și ofertei.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
         <li>Dacă oferta crește constant (inflație, deblocări), prețul scade.</li>
         <li>Dacă oferta este fixă sau scade (deflație, ca la BTC/ETH), prețul are șanse să crească.</li>
      </ul>
      <p class="text-white font-bold border-l-4 border-blue-500 pl-4">Învață să citești dincolo de preț. Un 0.00001$ poate fi mult mai scump decât un 60.000$.</p>
    `
  },

  // === 5. RSI (TRADING & CHARTURI) ===
  {
    slug: "rsi-relative-strength-index-explicat",
    term: "RSI (Relative Strength Index)",
    category: "TRADING & CHARTURI",
    image: "/rsiexplicat.jpg",
    definition: "Busola Pieței. Un oscilator care măsoară 'viteza' banilor. Îți spune dacă piața a alergat prea tare (Supra-cumpărat) și trebuie să se odihnească, sau dacă a fost pedepsită prea mult (Supravânzare).",
    analogy: "Turometrul Mașinii. Dacă motorul stă prea mult în zona roșie (peste 70), riscă să se supraîncălzească și trebuie să încetinească. Dacă e subturat (sub 30), are loc de accelerare.",
    mihaiTake: "Nu vinde doar pentru că RSI e sus! Într-un Bull Market, RSI poate sta la 90 săptămâni întregi. Secretul veteranilor nu este nivelul, ci DIVERGENȚA (când prețul urcă, dar RSI coboară).",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este RSI? (Definiția Simplă)</h3>
      <p class="mb-4 text-gray-300">RSI (Relative Strength Index) este un oscilator dezvoltat în 1978 care se mișcă între 0 și 100.</p>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-6">
        <strong class="text-blue-400 block mb-2">Scopul Principal:</strong>
        <p class="text-gray-300">Să identifice condițiile extreme. Ne spune cât de repede se mișcă piața și dacă "s-a întins prea mult".</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Nivelul 1: Citirea de Bază (Începători)</h3>
      <p class="mb-4 text-gray-300">Regula standard este simplă, dar periculoasă dacă e folosită singură:</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Zona de Supra-cumpărare (> 70)</strong>
            <p class="text-sm text-gray-400">Prețul a crescut prea repede. Probabilitate de corecție.</p>
            <p class="text-xs text-white font-bold mt-2">Acțiune: Căutăm Short.</p>
         </div>
         <div class="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Zona de Supravânzare (< 30)</strong>
            <p class="text-sm text-gray-400">Panica a fost prea mare, vânzătorii au obosit.</p>
            <p class="text-xs text-white font-bold mt-2">Acțiune: Căutăm Long.</p>
         </div>
      </div>
      <p class="text-yellow-400 text-sm font-bold border-l-4 border-yellow-500 pl-4 mb-6">⚠️ Atenție: Într-un Bull Market puternic (cum a fost 2021), RSI poate sta peste 70 săptămâni întregi. Nu vinde doar pentru că indicatorul e sus!</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Nivelul 2: Divergențele (Secretul Veteranilor)</h3>
      <p class="mb-4 text-gray-300">Aici se face diferența dintre amatori și profesioniști. RSI-ul este cel mai puternic atunci când <strong>nu este de acord cu prețul</strong>.</p>
      
      <ul class="space-y-4 mb-6">
        <li class="bg-[#0a0f1e] p-4 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-400 block text-lg">🐂 Divergența Bullish (De Cumpărare)</strong>
            <ul class="list-disc pl-5 mt-2 text-gray-400 text-sm">
                <li><strong>Prețul:</strong> Face un minim mai jos (Lower Low) - pare că scade.</li>
                <li><strong>RSI:</strong> Face un minim mai sus (Higher Low) - forța de vânzare scade.</li>
                <li><strong>Semnal:</strong> Motorul se pregătește de urcare.</li>
            </ul>
        </li>
        <li class="bg-[#0a0f1e] p-4 rounded-lg border-l-4 border-red-500">
            <strong class="text-red-400 block text-lg">🐻 Divergența Bearish (De Vânzare)</strong>
            <ul class="list-disc pl-5 mt-2 text-gray-400 text-sm">
                <li><strong>Prețul:</strong> Face un maxim mai sus (Higher High) - pare că rupe norii.</li>
                <li><strong>RSI:</strong> Face un maxim mai jos (Lower High) - cumpărătorii pierd suflu.</li>
                <li><strong>Semnal:</strong> Rechinilor le lipsește convingerea. Urmează prăbușirea.</li>
            </ul>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Nivelul 3: RSI ca Suport și Rezistență</h3>
      <p class="mb-4 text-gray-300">Poți trasa linii de trend direct pe RSI. De asemenea, linia de 50 este crucială:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Peste 50:</strong> Suntem în Uptrend. Orice atingere a liniei de 50 e oportunitate de "Buy the Dip".</li>
        <li><strong>Sub 50:</strong> Suntem în Downtrend. Taurii nu au forță.</li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. RSI Failure Swing (Expert)</h3>
      <p class="mb-4 text-gray-300">O formațiune de precizie descrisă de creatorul Wilder, care ignoră prețul complet:</p>
      <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
        <strong class="text-white">Failure Swing Top (Semnal Sell):</strong>
        <ol class="list-decimal pl-5 mt-2 text-gray-300 text-sm space-y-1">
            <li>RSI urcă peste 70.</li>
            <li>RSI scade sub 70.</li>
            <li>RSI urcă din nou, dar nu atinge vârful anterior (Lower High).</li>
            <li>RSI sparge punctul minim anterior.</li>
        </ol>
        <p class="text-orange-400 text-xs mt-2 font-bold">Trendul s-a rupt înainte ca prețul să o arate!</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Unelte, nu Globuri de Cristal</h3>
      <p class="mb-4 text-gray-300">RSI îți spune "Cât de tare este apăsată pedala de accelerație", nu "Unde merge mașina".</p>
      <p class="text-white font-bold border-l-4 border-blue-500 pl-4">Folosește-l pentru a vedea Divergențele (când prețul minte). Nu îl folosi niciodată singur.</p>
    `
  },

  // === 6. CICLUL PIEȚEI (PSIHOLOGIE & CICLE) ===
  {
    slug: "ciclul-pietei-wyckoff-ghid-faze",
    term: "Ciclul Pieței (Market Cycles)",
    category: "PSIHOLOGIE & CICLE",
    image: "/cicluldepiataacademie.jpg",
    definition: "Harta Secretă a Banilor Mari. Piața nu se mișcă haotic, ci într-un tipar logic orchestrat de 'Smart Money'. Învață cele 4 anotimpuri: Acumulare, Mark-Up, Distribuție, Mark-Down.",
    analogy: "Cele 4 Anotimpuri. Iarna (Acumulare) e plictisitoare dar necesară. Vara (Mark-Up) e caldă și profitabilă. Toamna (Distribuție) e înșelătoare. Iarna Nucleară (Mark-Down) e fatală.",
    mihaiTake: "Piața este un mecanism de transfer al averii de la cei care nu înțeleg aceste 4 faze, către cei care le stăpânesc. Nu fi 'Exit Liquidity'. Cumpără când ești plictisit, vinde când ești euforic.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Introducere: De ce pierzi când piața pare bună?</h3>
      <p class="mb-4 text-gray-300">Ai cumpărat vreodată o monedă pentru că știrile erau fantastice, toată lumea vorbea despre ea, prețul stagna puțin... și apoi s-a prăbușit?</p>
      <p class="mb-4 text-gray-300">Ai vândut vreodată o monedă pentru că "nu făcea nimic" timp de 3 luni, doar ca să o vezi explodând a doua zi după ce ai vândut?</p>
      <p class="mb-6 text-gray-300">Nu ai avut ghinion. Ai fost victima Ciclului de Piață.</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <p class="text-gray-300 font-medium">Piața nu se mișcă haotic. Se mișcă într-un tipar logic, orchestrat de "Smart Money" (Balene, Instituții) pentru a transfera banii din buzunarul "Nerăbdătorilor" în buzunarul "Răbdătorilor".</p>
        <p class="text-blue-400 mt-2 text-sm">Richard Wyckoff a descifrat acest cod acum 100 de ani. Iată cele 4 anotimpuri ale banilor:</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 1: ACUMULAREA (Iarna Plictisitoare)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> După o scădere mare (Bear Market).</li>
        <li><strong>Ce se întâmplă:</strong> Prețul merge lateral (Range). Nu crește, nu scade mult. E liniște. Știrile sunt rele sau inexistente.</li>
        <li><strong>Psihologia:</strong> "Crypto e mort". Retailul (micii investitori) este plictisit, speriat și își vinde monedele în pierdere, doar ca să scape.</li>
        <li><strong>Ce fac Balenele:</strong> CUMPĂRĂ. Ei absorb oferta vândută de micii investitori disperați. Ei construiesc "cauza" pentru viitoarea creștere.</li>
      </ul>
      <p class="text-green-400 font-bold border-l-4 border-green-500 pl-4 mb-8">Lecția: Cumpără când ești plictisit, nu când ești entuziasmat. Acesta este momentul maximului de oportunitate financiară.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 2: MARK-UP (Primăvara / Vara Explozivă)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> Prețul sparge rezistența zonei de acumulare.</li>
        <li><strong>Ce se întâmplă:</strong> Începe trendul ascendent (Uptrend). Prețul face maxime în creștere (Higher Highs).</li>
        <li><strong>Psihologia:</strong> Speranța revine. Apoi Lăcomia. Apoi FOMO (Frica de a pierde ocazia). Știrile devin pozitive.</li>
        <li><strong>Ce fac Balenele:</strong> Țin de monede și încep să vândă puțin câte puțin pe măsură ce prețul urcă.</li>
      </ul>
      <p class="text-green-400 font-bold border-l-4 border-green-500 pl-4 mb-8">Lecția: Aici faci banii. Trend is your friend. Nu vinde prea devreme, dar nici nu intra "all in" la final.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 3: DISTRIBUȚIA (Toamna Înșelătoare)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> La vârful pieței (Top).</li>
        <li><strong>Ce se întâmplă:</strong> Prețul se oprește din creștere și intră iar într-un Range lateral. Volatilitatea e mare.</li>
        <li><strong>Psihologia:</strong> EUFORIE MAXIMĂ. "Bitcoin la 1 Milion!". Toată lumea e geniu. Șoferul de Uber îți dă ponturi crypto.</li>
        <li><strong>Ce fac Balenele:</strong> VÂND TOT. Ei au nevoie de cererea uriașă a mulțimii euforice pentru a-și descărca sacii uriași de monede fără a prăbuși prețul instant.</li>
        <li><strong>Capcana:</strong> Pare o pauză înainte de o nouă creștere. De fapt, este sfârșitul.</li>
      </ul>
      <p class="text-red-400 font-bold border-l-4 border-red-500 pl-4 mb-8">Lecția: Când știrile sunt perfecte, vinde. Distribuția este oglinda Acumulării.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Faza 4: MARK-DOWN (Iarna Nucleară)</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2 text-gray-300">
        <li><strong>Locația:</strong> Prețul sparge suportul distribuției.</li>
        <li><strong>Ce se întâmplă:</strong> Prăbușire. Panic Sell.</li>
        <li><strong>Psihologia:</strong> Negare ("E doar o corecție") -> Frică -> Capitulare ("Vând tot, e țeapă").</li>
        <li><strong>Ce fac Balenele:</strong> Așteaptă cu cash-ul pregătit la baza muntelui.</li>
      </ul>
      <p class="text-red-400 font-bold border-l-4 border-red-500 pl-4 mb-8">Lecția: Nu prinde cuțitul care cade. Așteaptă să înceapă din nou Faza 1.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Cum identifici unde ești ACUM?</h3>
      <p class="mb-4 text-gray-300">Nu ghici. Privește Volumul și Sentimentul.</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Acumulare (CUMPĂRĂ)</strong>
            <p class="text-sm text-gray-400">Preț Jos + Frică/Plictiseală + Volum Constant</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Distribuție (VINDE)</strong>
            <p class="text-sm text-gray-400">Preț Sus + Euforie + Volum Uriaș (dar prețul nu mai crește)</p>
         </div>
      </div>

      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <p class="text-gray-300 italic mb-4">"Piața este un mecanism de transfer al averii de la cei care nu înțeleg aceste 4 faze, către cei care le stăpânesc."</p>
        <p class="text-white font-bold">Tu în ce fază crezi că suntem?</p>
      </div>
    `
  },

  // === 7. MANAGEMENTUL RISCULUI (TRADING) ===
  {
    slug: "managementul-riscului-matematica-supravietuirii",
    term: "Managementul Riscului (Risk Management)",
    category: "TRADING & CHARTURI",
    image: "/managementulriscului.jpg",
    definition: "Matematica Supraviețuirii. Cum să pierzi de 5 ori la rând și totuși să fii pe profit. Secretul nu este să ai dreptate, ci să nu rămâi fără bani.",
    analogy: "Frânele de la mașină. Nu le ai pentru că plănuiești să faci accident, ci pentru a putea opri în siguranță când apare un obstacol neprevăzut. Fără frâne (Stop Loss), viteza te omoară.",
    mihaiTake: "Secretul pe care nu ți-l spune nimeni este că Tradingul nu este despre a avea dreptate. Este despre a nu muri. Dacă capitalul tău ajunge la zero, jocul s-a terminat. Azi învățăm cum să devenim nemuritori în piață.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">Introducere: De ce falimentează traderii buni?</h3>
      <p class="mb-4 text-gray-300">Ai auzit povestea? <em>"Am avut dreptate! Știam că Bitcoin se duce la 100k! Dar m-a lichidat înainte să ajungă acolo..."</em></p>
      <p class="mb-6 text-gray-300">Aceasta este tragedia clasică. Să ai dreptate pe direcție, dar să pierzi banii.</p>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Adevărul Suprem:</strong>
        <p class="text-gray-300">Tradingul nu este despre a avea dreptate. Este despre a nu muri. Dacă capitalul tău ajunge la zero, jocul s-a terminat.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">1. Regula de Aur a Supraviețuirii: 1-2% Per Trade</h3>
      <p class="mb-4 text-gray-300">Aceasta este legea pe care o respectă orice trader de pe Wall Street. Niciodată, sub nicio formă, nu risca mai mult de 1% (maxim 2%) din portofoliul tău total pe o singură tranzacție.</p>

      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Exemplul Corect (1%)</strong>
            <p class="text-sm text-gray-400 mb-2">Ai 10.000$. Riscul tău maxim pe un trade este <strong>100$</strong>.</p>
            <p class="text-sm text-gray-300 border-t border-white/10 pt-2">Dacă pierzi de 20 de ori la rând, încă mai ai 80% din capital. Ești încă în joc.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Exemplul Fatal (10%)</strong>
            <p class="text-sm text-gray-400 mb-2">Dacă riști 10% pe un trade și prinzi o serie proastă de 5 pierderi (se întâmplă oricui), ai pierdut <strong>50% din bani</strong>.</p>
            <p class="text-sm text-gray-300 border-t border-white/10 pt-2">Ca să recuperezi o pierdere de 50%, trebuie să faci un profit de 100%. E matematic greu.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Raportul R:R (Risk to Reward Ratio)</h3>
      <p class="mb-4 text-gray-300">Aici se face diferența dintre amatori și profesioniști. Nu intra niciodată într-o poziție dacă nu poți câștiga de cel puțin 3 ori mai mult decât riști.</p>
      
      <div class="bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500 mb-6">
        <p class="text-xl font-mono text-yellow-400 font-bold mb-2">R:R = 1:3</p>
        <p class="text-gray-300">Risc 100$ ca să câștig 300$.</p>
      </div>

      <p class="mb-4 text-white font-bold">Magia Matematică:</p>
      <p class="mb-4 text-gray-300">Dacă respecți raportul 1:3, poți să PIERZI în 60% din tranzacțiile tale și totuși să faci bani.</p>

      <div class="bg-[#0a0f1e] p-6 rounded-xl border border-white/10 mb-8 font-mono text-sm">
        <p class="text-gray-500 mb-2">// Scenariu: 10 Tranzacții</p>
        <div class="flex justify-between mb-1">
            <span class="text-red-400">6 pierderi x 100$</span>
            <span class="text-red-400">= -600$</span>
        </div>
        <div class="flex justify-between mb-3 border-b border-gray-700 pb-3">
            <span class="text-green-400">4 câștiguri x 300$</span>
            <span class="text-green-400">= +1200$</span>
        </div>
        <div class="flex justify-between font-bold text-lg">
            <span class="text-white">Profit Total</span>
            <span class="text-green-400">= +600$</span>
        </div>
        <p class="text-xs text-gray-500 mt-2 italic">(Deși ai greșit de mai multe ori decât ai avut dreptate!)</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Stop Loss-ul nu este o opțiune, este oxigenul</h3>
      <p class="mb-4 text-gray-300">Mersul fără Stop Loss este ca condusul fără frâne. Poate merge o vreme, dar la prima curbă strânsă (Flash Crash), ai murit.</p>

      <ul class="space-y-4 mb-6">
        <li class="bg-red-900/10 p-4 rounded-lg border border-red-500/20">
            <strong class="text-red-400 block mb-1">❌ Stop Loss Mental? Nu există.</strong>
            <p class="text-sm text-gray-400">Emoțiile te vor bloca. <em>"Lasă că își revine, nu vând acum"</em>. Până te decizi, pierderea devine insuportabilă.</p>
        </li>
        <li class="bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <strong class="text-green-400 block mb-1">✅ Stop Loss Automat</strong>
            <p class="text-sm text-gray-400">Singurul prieten adevărat. Îl pui în momentul în care deschizi tranzacția.</p>
        </li>
      </ul>

      <p class="text-white font-bold mb-2">Unde îl pui?</p>
      <p class="text-gray-300 mb-6">Nu îl pui la o sumă fixă ("Vând dacă pierd 10 dolari"). Îl pui unde <strong>TEZA TA ESTE INVALIDATĂ</strong>. Dacă ai crezut că suportul ține, pune Stop Loss-ul sub suport. Dacă suportul s-a rupt, motivul pentru care ai cumpărat a dispărut. Ieși afară.</p>
    `
  },

  // === 8. LICHIDITATEA (TRADING & MARKET MECHANICS) ===
  {
    slug: "lichiditatea-explicata-orderbook-slippage-amm",
    term: "Lichiditatea (Liquidity)",
    category: "TRADING & CHARTURI",
    image: "/lichiditatea-academie.jpg",
    definition: "Oxigenul Pieței. Capacitatea de a transforma un activ în bani cash instantaneu, fără a-i prăbuși prețul. Diferența dintre a putea vinde 1 milion de dolari într-o secundă (Bitcoin) sau în 10 ani (Imobiliare).",
    analogy: "Paharul cu Apă vs. Oceanul. Dacă arunci o piatră (un ordin de vânzare) într-un pahar, apa sare peste tot (prețul se prăbușește). Dacă arunci aceeași piatră în ocean, nivelul apei nu se schimbă. Bitcoin e Oceanul, Shitcoin-urile sunt Paharul.",
    mihaiTake: "Volumul este vanitate, Lichiditatea este realitate. Poți vedea un token care a crescut 10.000% azi, dar dacă are o lichiditate de 5.000$, acea creștere este o iluzie. Nu poți marca profitul. Nu cumpăra niciodată ceva ce nu poți vinde.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. Ce este Lichiditatea, de fapt?</h3>
      <p class="mb-4 text-gray-300">Mulți confundă Lichiditatea cu Volumul. Sunt diferite.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Volumul:</strong> Câți bani s-au schimbat azi (Trecut).</li>
        <li><strong>Lichiditatea:</strong> Câți bani stau în așteptare în "Carnetul de Ordine" (Prezent și Viitor).</li>
      </ul>
      
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Testul Suprem:</strong>
        <p class="text-gray-300">Ai 100.000$ în Bitcoin. Poți să-i vinzi acum? <strong>DA</strong>, prețul nu se va mișca nici măcar cu 1$.</p>
        <p class="text-gray-300 mt-2">Ai 100.000$ într-un Meme Coin obscur. Poți să-i vinzi acum? <strong>NU</strong>. Dacă încerci, vei prăbuși prețul cu 50% și vei încasa doar jumătate. Asta înseamnă "Lipsă de Lichiditate".</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. The Order Book (Carnetul de Ordine)</h3>
      <p class="mb-4 text-gray-300">Pe o bursă centralizată (Binance), lichiditatea este vizualizată prin Order Book. Sunt "Zidurile" de cumpărare și vânzare.</p>

      <div class="grid md:grid-cols-2 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2">Bid Walls (Cumpărătorii)</strong>
            <p class="text-sm text-gray-400">Ordinele care așteaptă mai jos. Ele sunt "plasa de siguranță". Cu cât sunt mai multe (Deep Liquidity), cu atât e mai greu ca prețul să scadă brusc.</p>
         </div>
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-500/20">
            <strong class="text-red-400 block mb-2">Ask Walls (Vânzătorii)</strong>
            <p class="text-sm text-gray-400">Ordinele care așteaptă mai sus. Ele acționează ca un "tavan". Trebuie să cumperi tot ce vând ei ca să urci prețul.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. Inamicul Tăcut: SLIPPAGE (Alunecarea)</h3>
      <p class="mb-4 text-gray-300">Acesta este modul în care piața te taxează pentru nerăbdare în piețe ilichide.</p>
      
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6">
         <strong class="text-red-400 block mb-2 text-xl">⚠️ Scenariul de Coșmar</strong>
         <p class="text-gray-300 mb-2">Vrei să vinzi rapid (Market Order) token-uri de 10.000$.</p>
         <p class="text-gray-300 mb-2">Dar în Order Book, cumpărătorii sunt așa:</p>
         <ul class="text-sm font-mono text-gray-400 mb-4 bg-black/30 p-2 rounded">
            <li>Gigel vrea de 100$ la prețul de 1.00$</li>
            <li>Costel vrea de 500$ la prețul de 0.98$</li>
            <li>Ionel vrea de 9000$ la prețul de 0.50$</li>
         </ul>
         <p class="text-white font-bold">Rezultat:</p>
         <p class="text-gray-300">Sistemul îți va vinde automat la toți, în ordine. Vei vinde majoritatea token-urilor la 0.50$, pierzând instant jumătate din bani. Acesta este Slippage-ul.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Revoluția DeFi: Liquidity Pools (AMM)</h3>
      <p class="mb-4 text-gray-300">Pe Uniswap sau PancakeSwap nu există Order Book. Există o "Piscină de Lichiditate".</p>
      <p class="mb-6 text-gray-300">Aici, utilizatorii (ca tine) devin "Banca". Tu depui o pereche de token-uri (ex: ETH + USDT) în piscină. Când cineva vrea să facă schimb, ia din piscină și plătește o taxă. Acea taxă ajunge la tine.</p>
      
      <ul class="space-y-4 mb-6">
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-purple-500">
            <strong class="text-purple-400 block mb-1">Conceptul AMM (Automated Market Maker)</strong>
            <p class="text-sm text-gray-400">Un robot matematic care echilibrează balanța. Formula clasică: <em>x * y = k</em>. Dacă iei mult ETH din piscină, robotul crește exponențial prețul ETH rămas pentru a proteja piscina.</p>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">5. Riscul "Rug Pull" prin Lichiditate</h3>
      <p class="mb-4 text-gray-300">Cum dau țeapă escrocii?</p>
      <ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
         <li>Creează un token nou.</li>
         <li>Adaugă lichiditate inițială (pun 10.000$ reali în piscină).</li>
         <li>Lumea cumpără, prețul crește, în piscină se strâng 100.000$ reali.</li>
         <li><strong>Rug Pull:</strong> Escrocul are o funcție secretă prin care <strong>RETRAGE LIQUIDITATEA</strong>.</li>
         <li>El pleacă cu cei 100.000$, iar tu rămâi cu token-uri pe care nu le mai poți schimba nicăieri, pentru că nu mai există "piscină" în care să le vinzi.</li>
      </ol>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Apa adâncă e sigură</h3>
      <p class="mb-4 text-gray-300">Înainte să investești în orice proiect, verifică lichiditatea.</p>
      <p class="text-white font-bold border-l-4 border-yellow-500 pl-4">Nu te uita doar la "Cât pot să câștig?". Întreabă-te: "Dacă fac 1 milion de dolari, există suficienți bani în partea cealaltă ca să pot încasa?"</p>
    `
  },

  // === 9. STABLECOINS (DEFI & FUNDAMENTE) ===
  {
    slug: "stablecoins-ghid-usdt-usdc-dai",
    term: "Stablecoins (Monede Stabile)",
    category: "DEFI & WEB3",
    image: "/stablecoinsacademie.jpg",
    definition: "Ancora de stabilitate în furtuna crypto. Criptomonede concepute să aibă o valoare fixă (de obicei 1$ = 1 Monedă). Sunt puntea dintre banii vechi (Fiat) și banii noi.",
    analogy: "Jetoanele de la Cazino. Când intri în cazino, nu pariezi cu bancnote de lei. Schimbi banii în jetoane de plastic. Un jeton valorează mereu 1 Leu. Le folosești ca să joci, iar la final le schimbi înapoi în bani reali. USDT este jetonul.",
    mihaiTake: "Cash is a Position. Să stai în USDT nu înseamnă că 'nu ești în piață'. Înseamnă că ai ales să fii lunetist. Stablecoins sunt 'praf de pușcă' (Dry Powder). Cine nu are USDT când piața sângerează, este doar un spectator neputincios.",
    fullContent: `
      <h3 class="text-2xl font-bold text-white mt-8 mb-4">1. De ce avem nevoie de "Crypto care nu crește"?</h3>
      <p class="mb-4 text-gray-300">Pare un paradox. De ce ai cumpăra o criptomonedă care nu face 100x?</p>
      <div class="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
        <strong class="text-blue-400 block mb-2 text-lg">Problema Volatilității:</strong>
        <p class="text-gray-300">Vrei să cumperi o cafea cu Bitcoin. Până ajunge comanda, prețul BTC a scăzut cu 5%. Cafeaua a devenit brusc mai scumpă. Avem nevoie de un mediu de schimb stabil.</p>
        <p class="text-gray-300 mt-2">Mai mult, când vinzi Bitcoin pe profit, nu vrei să retragi mereu în bancă (impozite, timp, comisioane). Vrei să parchezi banii digital, gata pentru următoarea oportunitate.</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">2. Cele 3 Tipuri de Stablecoins (Riscuri Diferite)</h3>
      <p class="mb-4 text-gray-300">Nu toate sunt create egal. Dacă nu știi diferența, poți pierde tot (vezi cazul Terra Luna).</p>

      <div class="grid md:grid-cols-1 gap-6 mb-6">
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-green-500/20">
            <strong class="text-green-400 block mb-2 text-lg">A. Fiat-Backed (Susținute de Bani Reali)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: USDT (Tether), USDC (Circle)</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Pentru fiecare 1 USDT emis digital, compania ar trebui să aibă 1$ real (sau echivalent) într-un cont bancar.</p>
            <p class="text-sm text-red-400 mt-2"><strong>Risc:</strong> Centralizare. Compania (Tether) îți poate îngheța contul la cererea autorităților. Nu sunt banii tăi, sunt banii lor digitali.</p>
         </div>
         
         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-yellow-500/20">
            <strong class="text-yellow-400 block mb-2 text-lg">B. Crypto-Backed (Susținute de Crypto)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: DAI</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Nu există o bancă. Blochezi Ethereum într-un Smart Contract și primești DAI. Este supra-colateralizat (blochezi 150$ ETH ca să scoți 100$ DAI).</p>
            <p class="text-sm text-green-400 mt-2"><strong>Avantaj:</strong> Descentralizat. Nimeni nu îți poate îngheța fondurile.</p>
         </div>

         <div class="bg-[#0a0f1e] p-5 rounded-xl border border-red-600/30">
            <strong class="text-red-500 block mb-2 text-lg">C. Algorithmic (Pericol Mortal)</strong>
            <p class="text-xs text-gray-500 mb-2 uppercase">Exemple: UST (Terra - Decedată), USDD</p>
            <p class="text-sm text-gray-300"><strong>Cum funcționează:</strong> Nu au bani în spate. Se bazează pe un algoritm care creează sau distruge monede pentru a menține prețul.</p>
            <p class="text-sm text-white font-bold mt-2">VERDICT: Ferește-te de ele. Când algoritmul intră în "Spirala Morții", valoarea merge la ZERO.</p>
         </div>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">3. USDT vs. USDC: Războiul Titanilor</h3>
      <p class="mb-4 text-gray-300">Ce alegi?</p>
      <ul class="space-y-4 mb-6">
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-400 block mb-1">USDT (Tether) - Regele Volumului</strong>
            <p class="text-sm text-gray-400">Este cel mai vechi și cel mai folosit. Este "Offshore" (necontrolat direct de SUA). Este preferat de traderi și zonele gri ale economiei. Dar auditurile lor sunt mereu controversate.</p>
        </li>
        <li class="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500">
            <strong class="text-blue-400 block mb-1">USDC (Circle) - Regele Reglementării</strong>
            <p class="text-sm text-gray-400">Este "Onshore" (SUA). Susținut de BlackRock și bănci americane. Este cel mai transparent și sigur legal, dar cel mai ușor de cenzurat de guvernul SUA.</p>
        </li>
      </ul>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">4. Riscul de De-Peg (Dezlipire)</h3>
      <div class="bg-red-900/10 p-6 rounded-xl border border-red-500/20 mb-6 relative">
         <strong class="text-red-400 block mb-2 text-xl">⚠️ 1$ nu este mereu 1$</strong>
         <p class="text-gray-300 mb-2">Într-o criză majoră, oamenii vând stablecoins panicat pentru dolari reali. Dacă emitentul nu are lichiditate, prețul scade sub 1$ (0.98$, 0.90$...).</p>
         <p class="text-white font-bold">Lecția: Nu îți ține 100% din avere în stablecoins. Diversifică între USDT, USDC și Fiat (Bancă).</p>
      </div>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Concluzie: Dry Powder</h3>
      <p class="mb-4 text-gray-300">În Crypto, oportunitățile apar când sângele curge pe străzi (scăderi de 30-50%).</p>
      <p class="text-white font-bold border-l-4 border-yellow-500 pl-4">Dacă ești 100% investit, nu poți profita de reduceri. Profesioniștii țin mereu 20-30% din portofoliu în Stablecoins (Dry Powder) pentru a "vâna" aceste momente.</p>
    `
  },

  // === 10. RAPORT LEGISLATIV (ANALIZĂ FUNDAMENTALĂ) ===
  {
    slug: "legislatie-fiscalitate-crypto-romania-2026-raport-complet",
    term: "Taxe crypto 2026: cât plătești și cum faci D212",
    category: "ANALIZĂ FUNDAMENTALĂ", 
    image: "/cryptoromanialege.jpg",  
    definition: "Raportul de cercetare integral privind cadrul legal și fiscal din România în 2026. Analiza exhaustivă a Legii 239/2025, MiCA, OUG 10/2025 și a impozitării de 16%.",
    analogy: "Harta Minată vs. Drumul Asfaltat. Până în 2025, mergeam prin 'junglă' - riscant, dar fără reguli. În 2026, avem un drum asfaltat (MiCA), dar cu taxe de autostradă scumpe (16%) și radare la fiecare pas (ANAF/DAC8). Raportul acesta este 'Codul Rutier' complet pe care trebuie să-l știi ca să nu rămâi fără permis (sau bani).",
    mihaiTake: "Ghidul ăsta e lung, dar merită citit cu calm. Dacă vrei doar partea practică, sari direct la secțiunea 4: cât plătești pe câștigurile din crypto în 2026 (16%), când apare CASS-ul și cum completezi Declarația Unică (D212) până pe 25 mai. Nu e consultanță fiscală, iar pentru situația ta concretă merită o discuție cu un contabil.",
    fullContent: `
      <div class="space-y-6 text-gray-300 text-justify">
        
        <div class="bg-blue-900/20 p-6 rounded-lg border border-blue-700/50 mb-8">
          <h2 class="text-2xl font-bold text-blue-400 mb-4">RAPORT DE CERCETARE: Peisajul Legislativ și Fiscal al Criptoactivelor în România – Orizont Ianuarie 2026</h2>
        </div>

        <h3 class="text-2xl font-bold text-white mt-8 border-b border-gray-700 pb-2">1. Introducere</h3>
        <p>
          Data de 23 ianuarie 2026 marchează o etapă definitorie în evoluția pieței financiare digitale din România, caracterizată prin finalizarea tranziției de la un mediu experimental și permisiv către unul strict reglementat și instituționalizat. Ecosistemul criptoactivelor, privit istoric ca o frontieră a inovației financiare descentralizate, se află acum sub incidența directă a unor mecanisme legislative complexe, rezultate din convergența directivelor europene cu imperativul național de consolidare fiscală. Acest raport își propune să ofere o analiză exhaustivă a cadrului legal, fiscal și operațional aplicabil activelor digitale în România la începutul anului 2026, evidențiind transformările structurale generate de implementarea completă a Regulamentului privind Piețele Criptoactivelor (MiCA) și de intrarea în vigoare a Legii nr. 239/2025.
        </p>
        <p>
          Contextul anului 2026 este dominat de o schimbare de paradigmă la nivelul politicii economice: statul român a abandonat neutralitatea legislativă în favoarea unei abordări duale. Pe de o parte, se urmărește protecția consumatorului și stabilitatea financiară prin mecanisme de supraveghere prudențială extrem de riguroase, implementate prin Ordonanța de Urgență nr. 10/2025. Pe de altă parte, politica fiscală a devenit un instrument activ de descurajare a speculației și de maximizare a veniturilor bugetare, prin majorarea cotei de impozitare a câștigurilor din criptomonede la 16%, aliniind acest sector cu regimul aurului de investiții și al dividendelor, dar dezavantajându-l în raport cu piața de capital tradițională.
        </p>
        <p>
          Prezenta analiză depășește simpla enumerare a normelor juridice, propunându-și să investigheze profunzimea impactului acestor schimbări asupra tuturor actorilor implicați: de la investitorii de retail și "balenele" instituționale, până la furnizorii de servicii de criptoactive (CASP) și dezvoltatorii de tehnologie blockchain. Într-o perioadă în care "conformitatea" a devenit cuvântul de ordine, înțelegerea nuanțată a obligațiilor legale, a mecanismelor de raportare (DAC8/CARF) și a noilor sarcini fiscale (CASS la plafoane extinse) este esențială pentru viabilitatea economică.
        </p>
        <p>
          Vom explora modul în care România, deși a adoptat o poziție pro-europeană prin transpunerea fidelă a MiCA, a ales să suprapună un strat birocratic național specific – implicând avize tehnice de la Autoritatea pentru Digitalizarea României (ADR) și o taxă de supraveghere consistentă – elemente care reconfigurează competitivitatea jurisdicției românești în raport cu alte state membre UE. De asemenea, raportul va detalia fereastra de oportunitate critică a regimului tranzitoriu ("Grandfathering"), care permite operarea temporară a entităților pre-existente doar până în iulie 2026, creând o cursă contracronometru pentru licențiere.
        </p>

        <h3 class="text-2xl font-bold text-white mt-10 border-b border-gray-700 pb-2">2. Încadrare Juridică: Arhitectura Reglementării în 2026</h3>
        <p>
          La începutul anului 2026, cadrul legislativ aplicabil criptoactivelor în România nu mai este fragmentat, ci constituie un sistem coerent, ierarhizat, bazat pe supremația regulamentelor europene și completat de legislația națională de punere în aplicare. Pilonul central al acestui sistem este Regulamentul (UE) 2023/1114 (MiCA), care, deși a intrat în vigoare în etape pe parcursul anilor 2024 și 2025, își produce acum efectele depline asupra tuturor categoriilor de active și furnizori de servicii.
        </p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">2.1. Transpunerea MiCA și Rolul OUG 10/2025</h4>
        <p>
          Deși regulamentele europene sunt direct aplicabile, România a necesitat o intervenție legislativă pentru a desemna autoritățile competente și a stabili regimul sancționatoriu. Acest lucru s-a realizat prin Ordonanța de Urgență nr. 10/2025 (OUG 10/2025), un act normativ fundamental care modifică și completează Legea nr. 129/2019 pentru prevenirea și combaterea spălării banilor.
        </p>
        <p>
          Importanța OUG 10/2025 rezidă în redefinirea statutului juridic al actorilor din piață. Începând cu 2026, Furnizorii de Servicii de Criptoactive (CASP – Crypto-Asset Service Providers) nu mai sunt simple entități comerciale supuse unor obligații de raportare, ci sunt asimilați instituțiilor financiare în sensul legislației AML/CFT (Anti-Money Laundering / Countering the Financing of Terrorism). Această recalificare juridică are consecințe profunde:
        </p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li>CASP-urile intră sub supravegherea directă a Băncii Naționale a României (BNR) și a Autorității de Supraveghere Financiară (ASF) în funcție de tipul de activ.</li>
          <li>Standardele de guvernanță corporativă, audit și control intern impuse sunt identice cu cele din sectorul bancar sau al piețelor de capital tradiționale.</li>
          <li>S-a abrogat Articolul 301 din Legea 129/2019, care prevedea vechiul regim de avizare tehnică la Ministerul Finanțelor, marcând sfârșitul epocii "avizelor tehnice" simple și trecerea la un regim de licențiere completă.</li>
        </ul>

        <h4 class="text-xl font-bold text-blue-400 mt-6">2.2. Arhitectura Instituțională Duală: ASF și BNR</h4>
        <p>
          Spre deosebire de alte jurisdicții care au optat pentru o autoritate unică, România a implementat în 2026 un model de supraveghere "Twin Peaks" (vârfuri gemene), divizând competențele între ASF și BNR în funcție de natura economică a activului digital supravegheat. Această diviziune, clarificată prin legislația secundară emisă la finalul anului 2025, este esențială pentru orice entitate care dorește să se autorizeze.
        </p>

        <div class="ml-4 border-l-2 border-blue-500 pl-4 mt-4">
          <h5 class="font-bold text-white">2.2.1. Autoritatea de Supraveghere Financiară (ASF)</h5>
          <p>ASF a devenit autoritatea competentă principală pentru majoritatea ecosistemului cripto din România. Competențele sale acoperă:</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Autorizarea CASP:</strong> Toate platformele de tranzacționare (exchanges), custozii, firmele de consultanță în investiții cripto și administratorii de portofolii trebuie să obțină licența de la ASF.</li>
            <li><strong>Supravegherea ART (Asset-Referenced Tokens):</strong> Token-urile care se raportează la un coș de active (altele decât o singură monedă fiduciară) sunt sub jurisdicția ASF.</li>
            <li><strong>Crypto-ATM:</strong> O noutate legislativă a anului 2026 este includerea explicită a operatorilor de bancomate cripto (Crypto ATMs) sub supravegherea ASF, impunând cerințe stricte de KYC chiar și pentru tranzacțiile fizice.</li>
            <li><strong>Punct de Contact ESMA:</strong> ASF funcționează ca interfață unică a României cu Autoritatea Europeană pentru Valori Mobiliare și Piețe (ESMA), asigurând pașaportarea licențelor către și dinspre alte state UE.</li>
          </ul>
        </div>

        <div class="ml-4 border-l-2 border-yellow-500 pl-4 mt-4">
          <h5 class="font-bold text-white">2.2.2. Banca Națională a României (BNR)</h5>
          <p>BNR își păstrează rolul de gardian al stabilității monetare, având competențe exclusive asupra activelor care pot influența masa monetară sau pot funcționa ca substitute directe ale monedei naționale.</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supravegherea EMT (E-Money Tokens):</strong> Așa-numitele "stablecoins" care sunt legate de o singură monedă fiduciară (ex. un token peg-uit la RON sau EUR) sunt considerate monedă electronică. Emiterea lor este permisă exclusiv instituțiilor de credit (bănci) sau instituțiilor de monedă electronică, sub supravegherea prudențială a BNR.</li>
            <li><strong>Interfața cu EBA:</strong> BNR colaborează cu Autoritatea Bancară Europeană (EBA) pentru monitorizarea emitenților semnificativi de EMT.</li>
          </ul>
        </div>

        <div class="ml-4 border-l-2 border-purple-500 pl-4 mt-4">
          <h5 class="font-bold text-white">2.2.3. Autoritatea pentru Digitalizarea României (ADR)</h5>
          <p>
            Un element specific birocrației românești, menținut și în 2026, este implicarea ADR. Înainte ca ASF sau BNR să poată emite o licență operațională, solicitantul trebuie să obțină un aviz tehnic de la ADR. Acest aviz certifică robustețea infrastructurii IT, securitatea cibernetică și capacitatea de a rezista atacurilor informatice, aliniindu-se cu Regulamentul DORA (Digital Operational Resilience Act). Deși adaugă un pas suplimentar în procesul de autorizare, acest filtru tehnic este justificat prin riscurile operaționale ridicate specifice industriei blockchain.
          </p>
        </div>

        <h4 class="text-xl font-bold text-blue-400 mt-6">2.3. Regimul Tranzitoriu și Clauza "Grandfathering"</h4>
        <p>
          Una dintre cele mai critice prevederi legale active în ianuarie 2026 este regimul tranzitoriu. Conform Articolului 143(3) din MiCA, transpus în OUG 10/2025, piața se află într-o perioadă de grație limitată.
        </p>
        <p class="font-bold mt-2">Mecanismul de funcționare:</p>
        <p>
          Entitățile care prestau servicii de criptoactive în România conform legislației anterioare (înregistrate la Ministerul Finanțelor/ONPCSB) înainte de data de 30 decembrie 2024 beneficiază de dreptul de a-și continua activitatea fără o licență MiCA completă până în iulie 2026.
        </p>
        <p class="font-bold mt-2">Implicații strategice:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Fereastra de conformare:</strong> Între ianuarie și iulie 2026, aceste entități ("Grandfathered CASPs") sunt obligate să depună dosarul complet de autorizare la ASF.</li>
          <li><strong>Termenul limită (Cliff-edge):</strong> După iulie 2026, dreptul provizoriu de operare încetează automat. Orice entitate care nu a obținut licența MiCA până la acea dată va fi considerată că operează ilegal, riscând sancțiuni penale și blocarea accesului la sistemul bancar și de internet.</li>
          <li><strong>Riscul de blocaj:</strong> Având în vedere complexitatea dosarelor și resursele limitate ale ASF, există un risc real de "gâtuire" a procesului de autorizare în primăvara anului 2026, ceea ce pune presiune pe operatori să acționeze rapid.</li>
        </ul>

        <h4 class="text-xl font-bold text-blue-400 mt-6">2.4. Regula de Călătorie (Travel Rule) și Supravegherea Transferurilor</h4>
        <p>
          România a adoptat o interpretare strictă a "Travel Rule" (Regula de Călătorie), o componentă a standardelor FATF implementată prin Regulamentul (UE) 2023/1113 și OUG 10/2025. Această normă vizează eliminarea anonimatului în tranzacțiile cripto.
        </p>
        <p class="font-bold mt-2">Cerințe Operaționale:</p>
        <p>În 2026, orice transfer de criptoactive inițiat sau primit de un CASP din România trebuie să fie însoțit de date structurate despre:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li><strong>Inițiator (Originator):</strong> Nume, adresă, număr de cont (sau wallet), și date de identificare (CNP/Pașaport).</li>
          <li><strong>Beneficiar:</strong> Nume și număr de cont/wallet.</li>
        </ul>
        <p class="font-bold mt-2">Unhosted Wallets (Portofele Negăzduite):</p>
        <p>
          Legislația românească impune măsuri suplimentare pentru tranzacțiile care implică portofele private (self-custody, cum ar fi Ledger sau Metamask). Pentru transferurile care depășesc pragul de 1.000 EUR, CASP-ul este obligat să verifice dacă clientul său deține sau controlează efectiv acea adresă privată. Această cerință de "proof of ownership" (dovada deținerii) creează fricțiuni operaționale semnificative, obligând utilizatorii să semneze mesaje criptografice sau să efectueze micro-tranzacții de verificare ("Satoshi test").
        </p>
        <p class="font-bold mt-2">Relațiile de Corespondent:</p>
        <p>
          OUG 10/2025 introduce obligații specifice pentru CASP-urile românești care stabilesc relații de corespondent cu entități din afara UE (jurisdicții non-MiCA). Acestea trebuie să efectueze o analiză de due diligence (verificare prealabilă) aprofundată asupra partenerului străin ("Respondent"), verificând calitatea supravegherii AML din țara de origine a acestuia. Este interzisă colaborarea cu "shell banks" sau entități fără prezență fizică și conformitate verificabilă.
        </p>

        <h3 class="text-2xl font-bold text-white mt-10 border-b border-gray-700 pb-2">3. Diferențe Active: Taxonomie și Tratament Specific</h3>
        <p>
          Evoluția legislativă a anului 2026 a eliminat ambiguitatea terminologică. Activele digitale nu mai sunt tratate ca un bloc monolithic, ci sunt clasificate într-o taxonomie precisă care dictează regimul juridic, fiscal și obligațiile emitenților. Această distincție este vitală pentru investitori, deoarece un token poate fi un simplu activ speculativ, un instrument de plată reglementat bancar sau un titlu de valoare.
        </p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">3.1. Criptoactive (Crypto-assets) – Categoria Generală</h4>
        <p>Definite de Art. 3(1)(5) din MiCA, acestea sunt reprezentări digitale ale valorii sau drepturilor, transferabile electronic prin DLT, care nu se încadrează în alte categorii specifice.</p>
        <p><em>Exemple:</em> Bitcoin (BTC), Ethereum (ETH) - în forma lor nativă, fără mecanisme de stabilizare.</p>
        <p><strong>Regim 2026:</strong> Emiterea și tranzacționarea lor sunt reglementate de Titlul II din MiCA. Emitenții (dacă există o entitate centrală) trebuie să publice un "White Paper" notificat ASF, care să includă avertismente clare de risc și detalii tehnice. Pentru Bitcoin, unde nu există un emitent identificabil, responsabilitatea conformității cade pe CASP-urile care listează activul la tranzacționare.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">3.2. Token-uri Referențiate la Active (ART – Asset-Referenced Tokens)</h4>
        <p>Aceasta este o categorie intermediară, vizând token-uri care încearcă să mențină o valoare stabilă prin raportarea la o altă valoare, un drept, sau o combinație a acestora (inclusiv un coș de monede fiduciare).</p>
        <p><em>Caracteristici:</em> Sunt instrumente de plată hibride sau instrumente de investiții cu risc scăzut.</p>
        <p><strong>Regim 2026:</strong> Sunt strict reglementate de Titlul III MiCA. Emitenții trebuie să fie autorizați de ASF în România (sau de autoritatea competentă din statul de origine), să dețină rezerve de active segregate de fondurile proprii și să respecte cerințe de capital prudențial. "Algorithmic stablecoins" care nu au rezerve reale sunt, în practică, interzise sau extrem de dificil de autorizat sub acest regim.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">3.3. Token-uri de Monedă Electronică (EMT – E-Money Tokens)</h4>
        <p>Cunoscute popular ca "stablecoins fiat-backed" (ex. USDC, EURC), acestea sunt active care se raportează la valoarea unei singure monede oficiale.</p>
        <p><strong>Regim 2026:</strong> Sunt considerate, din punct de vedere juridic, monedă electronică. Conform cadrului legal actualizat (Titlul IV MiCA), emiterea lor în România este rezervată exclusiv instituțiilor de credit (bănci) sau instituțiilor emitente de monedă electronică autorizate.</p>
        <p><strong>Supraveghere:</strong> BNR exercită controlul direct. Emitentul trebuie să garanteze răscumpărarea la paritate (1:1) în orice moment. Această cerință a eliminat de pe piața reglementată proiectele de stablecoins emise de entități nereglementate (fără licență bancară/EMI).</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">3.4. Non-Fungible Tokens (NFT) – Zona de Clarificare</h4>
        <p>Statutul NFT-urilor a fost un subiect intens dezbătut, iar anul 2026 aduce clarificări prin practica autorităților, deși textul legii menține anumite nuanțe.</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>NFT-uri Autentice (Artă/Colectibile):</strong> Dacă un NFT este unic și nu fungibil (nu poate fi substituit cu un altul de aceeași valoare standardizată), acesta nu intră sub incidența MiCA. Din punct de vedere juridic, este tratat ca un bun necorporal sau titlu de proprietate intelectuală.</li>
          <li><strong>NFT-uri Fracționate sau Colecții Mari:</strong> Autoritățile române și europene aplică principiul "substance over form" (fondul prevalează asupra formei). Dacă o colecție de 10.000 de NFT-uri este emisă într-o serie standardizată, iar token-urile au caracteristici similare și sunt tranzacționate pe piețe secundare pentru profit, acestea sunt reclasificate ca criptoactive sub MiCA. Aceasta obligă creatorii colecției să redacteze un White Paper și să respecte normele de protecție a consumatorului.</li>
        </ul>

        <h4 class="text-xl font-bold text-blue-400 mt-6">3.5. Instrumente Financiare Tokenizate (Security Tokens)</h4>
        <p>
          Este esențială distincția dintre criptoactivele MiCA și "Security Tokens". Dacă un token acordă drepturi similare acțiunilor (dividende, vot în companie) sau obligațiunilor, acesta este exclus din MiCA și intră sub incidența legislației pieței de capital (MiFID II), supravegheată de ASF.
        </p>
        <p><strong>Regim 2026:</strong> Tranzacționarea lor se poate face doar pe platforme autorizate sub Regimul Pilot DLT (Distributed Ledger Technology Pilot Regime), un cadru de testare reglementat la nivel UE, la care România participă activ.</p>

        <h3 class="text-2xl font-bold text-white mt-10 border-b border-gray-700 pb-2">4. Impozitare: Șocul Fiscal al Anului 2026</h3>
        <p>
          Anul 2026 reprezintă un moment de cotitură în fiscalitatea românească, marcat de intrarea în vigoare a Legii nr. 239/2025 (cunoscută ca Pachetul Fiscal 2 sau "Legea Austerității"), care a modificat substanțial Codul Fiscal (Legea 227/2015). Scopul declarat al acestor modificări este creșterea veniturilor bugetare și descurajarea investițiilor speculative în detrimentul celor productive.
        </p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">4.1. Impozitul pe Venit: Majorarea la 16%</h4>
        <p>Cea mai importantă modificare, aplicabilă veniturilor realizate începând cu 1 ianuarie 2026, este creșterea cotei de impozitare pentru veniturile din transferul de monedă virtuală de la 10% la 16%.</p>
        <p><strong>Baza de Calcul:</strong> Impozitul se calculează pe fiecare tranzacție încheiată cu câștig, ca diferență pozitivă între prețul de vânzare și prețul de achiziție, inclusiv costurile directe aferente tranzacției (comisioane de exchange, taxe de rețea/gas fees). Câștigurile se adună la final de an. Nu este un „câștig net anual”: pierderile din alte tranzacții nu se scad (detalii în secțiunea 4.5).</p>
        <p class="bg-gray-800 p-2 rounded border border-gray-600 font-mono text-sm mt-2">Formula (pe tranzacție): Câștig = Preț vânzare – (Preț achiziție + Costuri directe); Impozit = 16% x suma câștigurilor din an.</p>
        <p class="mt-2"><strong>Determinarea Câștigului:</strong> În lipsa unor norme specifice contrare, se aplică în general metoda FIFO (First-In, First-Out) sau metoda prețului mediu ponderat pentru determinarea costului de achiziție, responsabilitatea calculului revenind investitorului.</p>
        <p><strong>Pragul de 200 / 600 lei:</strong> Câștigul sub 200 lei pe tranzacție nu se impozitează, cu condiția ca totalul câștigurilor din anul fiscal să nu depășească 600 lei (regulă confirmată de ANAF și pentru 2026). Atenție, e o condiție, nu o sumă pe care o scazi: dacă totalul câștigurilor trece de 600 lei, se impozitează toate câștigurile, inclusiv cele mici. Un câștig de 200 lei sau mai mult dintr-o singură tranzacție se impozitează oricum.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">4.2. Contribuția de Asigurări Sociale de Sănătate (CASS)</h4>
        <p>Pe lângă impozitul de 16%, poți datora CASS (10%) dacă veniturile tale din afara salariului, adunate la un loc (câștiguri crypto, dividende, dobânzi, chirii, alte venituri din investiții), ajung la cel puțin 6 salarii minime brute pe an. Salariul și CASS-ul reținut deja de angajator nu intră în calcul, deci și ca salariat poți datora CASS separat pe aceste venituri. Pe câștigurile din crypto nu se datorează CAS (pensie).</p>
        <p class="font-bold mt-2">Ce salariu minim se folosește pentru 2026:</p>
        <p>Salariul minim brut a crescut la 4.325 lei de la 1 iulie 2026, dar pentru contribuțiile pe veniturile din 2026 se folosește salariul minim în vigoare la 1 ianuarie al anului, adică <strong>4.050 lei</strong>, indiferent de modificarea din cursul anului (precizare ANAF).</p>
        <p class="font-bold mt-2">Pragurile CASS pentru veniturile din 2026:</p>
        <ul class="list-disc pl-6 mt-1">
          <li>sub 24.300 lei (sub 6 salarii minime): nu datorezi CASS pe aceste venituri;</li>
          <li>între 24.300 și 48.599 lei (6–12 salarii): CASS = 10% x 24.300 = <strong>2.430 lei</strong>;</li>
          <li>între 48.600 și 97.199 lei (12–24 salarii): CASS = 10% x 48.600 = <strong>4.860 lei</strong>;</li>
          <li>de la 97.200 lei în sus (24 salarii): CASS = 10% x 97.200 = <strong>9.720 lei</strong>, plafonul maxim.</li>
        </ul>
        <p class="mt-2">CASS-ul este o sumă fixă pe treaptă, nu 10% din tot câștigul. Se declară și se plătește tot prin Declarația Unică, până la 25 mai a anului următor.</p>

        <div class="bg-gray-800/80 p-4 rounded-lg border border-red-500/30 mt-4">
          <p class="font-bold text-red-400">Exemplu de Impact (ipotetic):</p>
          <p>Un investitor fără alte venituri în afara salariului are în 2026 câștiguri din crypto de 100.000 lei (peste pragul de 24 de salarii: 24 x 4.050 = 97.200 lei). Va plăti:</p>
          <ul class="list-decimal pl-6 mt-2">
            <li>Impozit: 100.000 x 16% = 16.000 lei.</li>
            <li>CASS (la nivelul a 24 de salarii): 97.200 x 10% = 9.720 lei.</li>
            <li><strong>Total: 25.720 lei</strong> (aprox. 25,7% din câștig).</li>
          </ul>
        </div>
        <p class="mt-2 text-sm text-gray-400">Pentru activitățile independente (PFA) plafonul maxim al bazei CASS a crescut de la 60 la 72 de salarii minime în 2026. Pentru câștigurile din crypto ale unei persoane fizice se aplică treptele de 6, 12 și 24 de salarii de mai sus.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">4.3. Regimul NFT-urilor: Drepturi de Autor vs. Cripto</h4>
        <p>Tratamentul fiscal al NFT-urilor în 2026 depinde strict de natura activității:</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Creatori (Artiști):</strong> Veniturile obținute din vânzarea inițială a NFT-urilor create sunt considerate venituri din drepturi de proprietate intelectuală. Acestea beneficiază de o cotă forfetară de cheltuieli deductibile (40%), aplicându-se impozitul de 10% (sau 16% dacă legea drepturilor de autor nu prevede excepții specifice în noua lege fiscală) asupra venitului net.</li>
          <li><strong>Investitori/Traderi:</strong> Câștigul din revânzarea unui NFT este tratat similar criptomonedelor: venit din alte surse, impozitat cu 16% pe diferența dintre prețul de vânzare și cel de achiziție.</li>
          <li><strong>Royalties (Redevențe):</strong> Veniturile recurente (royalties) primite de creatori la revânzările ulterioare sunt taxate tot ca drepturi de proprietate intelectuală.</li>
        </ul>

        <h4 class="text-xl font-bold text-blue-400 mt-6">4.4. Obligații de Raportare și Transparență (DAC8/CARF)</h4>
        <p>Anul 2026 aduce operaționalizarea deplină a schimbului de informații.</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>DAC8:</strong> Directiva UE obligă toți furnizorii de servicii cripto (chiar și cei din afara UE care au clienți în România) să raporteze tranzacțiile utilizatorilor către autoritățile fiscale.</li>
          <li><strong>ANAF:</strong> Primește automat date despre portofoliile și tranzacțiile rezidenților români. Capacitatea de a încrucișa aceste date cu Declarația Unică este acum automatizată. Riscul nedeclarării este critic, deoarece ANAF poate impozita din oficiu veniturile nedeclarate, aplicând și penalități de nedeclarare.</li>
        </ul>

        <h4 id="d212" class="text-xl font-bold text-blue-400 mt-6">4.5. Pas cu pas: Declarația Unică (formularul 212)</h4>
        <p>Nimeni nu îți reține impozitul pe crypto în România, nici exchange-ul, nici banca. Îl calculezi tu, îl declari și îl plătești o singură dată pe an, prin Declarația Unică (D212), la capitolul I „Date privind veniturile realizate”, la veniturile din alte surse obținute din transferul de monedă virtuală. Contează câștigurile, indiferent dacă platforma e din România sau din străinătate.</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Cota:</strong> 16% pentru câștigurile realizate începând cu 1 ianuarie 2026 (până în 2025 a fost 10%). Modificarea vine din Legea nr. 239/2025.</li>
          <li><strong>Termenul:</strong> declarația și plata, până la 25 mai inclusiv a anului următor. Pentru câștigurile din 2026, termenul este <strong>25 mai 2027</strong>. Pentru câștigurile din 2025 (cota de 10%) termenul a fost 25 mai 2026.</li>
          <li><strong>Cum o depui:</strong> online prin Spațiul Privat Virtual (SPV) ANAF sau pe e-guvernare.ro, ori pe hârtie la ghișeu sau prin poștă.</li>
          <li><strong>În lei:</strong> calculele se fac în lei. Păstrează istoricul tranzacțiilor (exporturi CSV/rapoarte din exchange) ca să poți dovedi prețul de achiziție.</li>
        </ul>

        <p class="font-bold mt-4">Cum se tratează pierderile</p>
        <p>Codul fiscal definește câștigul ca „diferență pozitivă” pe tranzacție. În practică, inclusiv în exemplele din ghidurile ANAF, asta înseamnă că o tranzacție pe pierdere nu se scade din câștigul altei tranzacții, iar pierderile din crypto nu se reportează în anii următori (reportarea pierderilor e prevăzută pentru titluri de valoare, nu pentru moneda virtuală). Poți deci să închei anul pe minus și totuși să datorezi impozit, dacă ai avut și tranzacții pe plus. Dacă ai multe tranzacții sau situații speciale (staking, airdrop, schimb crypto-crypto), verifică tratamentul cu un contabil, pentru că acolo interpretările diferă.</p>

        <div class="bg-gray-800/80 p-4 rounded-lg border border-cyan-500/30 mt-4">
          <p class="font-bold text-cyan-400">Exemplu de calcul (cifre ipotetice, doar pentru ilustrare)</p>
          <p>Andrei are salariu și, în afară de crypto, nu are alte venituri. În 2026 face patru vânzări, cu toate sumele deja transformate în lei:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Tranzacția 1: câștig de 150 lei;</li>
            <li>Tranzacția 2: câștig de 4.850 lei;</li>
            <li>Tranzacția 3: pierdere de 1.000 lei;</li>
            <li>Tranzacția 4: câștig de 25.000 lei.</li>
          </ul>
          <ul class="list-decimal pl-6 mt-2">
            <li>Suma câștigurilor: 150 + 4.850 + 25.000 = <strong>30.000 lei</strong>. Pierderea de 1.000 lei nu se scade.</li>
            <li>Totalul trece de 600 lei, deci și câștigul de 150 lei se impozitează.</li>
            <li>Impozit: 30.000 x 16% = <strong>4.800 lei</strong>.</li>
            <li>CASS: 30.000 lei e între 24.300 și 48.599 lei, deci datorează 2.430 lei.</li>
            <li><strong>Total de plată: 7.230 lei</strong>, cu declarație și plată până pe 25 mai 2027.</li>
          </ul>
          <p class="mt-2 text-sm text-gray-400">Contra-exemplu: dacă în tot anul ar fi avut doar două câștiguri, de 150 și 180 lei (total 330 lei), nu ar fi datorat impozit pe ele.</p>
        </div>
        <p class="mt-2 text-sm italic text-gray-400">Cifrele de mai sus sunt valabile pentru veniturile din 2026, conform informațiilor publicate de ANAF. Legislația fiscală se schimbă des, așa că verifică regulile în vigoare înainte să depui declarația și cere sfatul unui contabil pentru situația ta.</p>

        <h3 class="text-2xl font-bold text-white mt-10 border-b border-gray-700 pb-2">5. Comparații cu Alte Tipuri de Active</h3>
        <p>Politica fiscală a anului 2026 creează un peisaj investițional distorsionat, favorizând anumite clase de active în detrimentul altora. Următoarea analiză comparativă evidențiază poziția dezavantajoasă a criptoactivelor.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">5.1. Criptoactive vs. Piața de Capital (BVB/Acțiuni)</h4>
        <p>Cea mai mare discrepanță se observă între investițiile în cripto și cele pe bursă.</p>
        <ul class="list-disc pl-6 mt-2">
          <li><strong>Cripto:</strong> Impozit 16%. Pierderile nu se compensează cu câștigurile din alte tranzacții și nu se reportează.</li>
          <li><strong>Acțiuni (BVB):</strong>
            <ul class="list-circle pl-6 mt-1">
              <li>Dețineri pe termen lung (> 365 zile): Impozit 3% (majorat de la 1%).</li>
              <li>Dețineri pe termen scurt (< 365 zile): Impozit 6% (majorat de la 3%).</li>
              <li>Impozitul este reținut la sursă de brokerii rezidenți, simplificând birocrația.</li>
            </ul>
          </li>
        </ul>
        <p class="mt-2 text-sm italic">Insight: Un investitor care păstrează acțiuni la o companie românească timp de un an plătește de peste 5 ori mai puțin impozit decât un investitor cripto (3% vs 16%). Aceasta este o formă de politică industrială prin fiscalitate, statul direcționând capitalul populației către companiile locale listate.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">5.2. Criptoactive vs. Aur de Investiții</h4>
        <p>Tratamentul fiscal al acestor două clase a fost unificat în 2026.</p>
        <p><strong>Aur:</strong> Impozitul pe câștigul din aur de investiții a crescut de la 10% la 16% prin Legea 239/2025.</p>
        <p><em>Analiză:</em> Statul consideră ambele active ca fiind "tezaurizări speculative" sau rezerve de valoare pasive, care nu contribuie direct la rulajul economic productiv (spre deosebire de companii), justificând astfel o taxare mai aspră.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">5.3. Criptoactive vs. Titluri de Stat (Fidelis/Tezaur)</h4>
        <p><strong>Titluri de Stat:</strong> Rămân neimpozabile (0% impozit, 0 CASS).</p>
        <p><em>Analiză:</em> Titlurile de stat reprezintă "refugiul fiscal" suprem în 2026. Pentru investitorii conservatori, diferența dintre 0% taxe și 25.7% (cripto cu CASS) este un argument decisiv pentru realocarea portofoliului.</p>

        <h4 class="text-xl font-bold text-blue-400 mt-6">5.4. Tabel Comparativ Sintetic (Fiscalitate 2026)</h4>
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full text-sm text-left text-gray-300 border border-gray-700">
            <thead class="text-xs text-blue-400 uppercase bg-gray-800">
              <tr>
                <th class="px-4 py-3 border-r border-gray-700">Clasa de Active</th>
                <th class="px-4 py-3 border-r border-gray-700">Cota Impozit 2026</th>
                <th class="px-4 py-3 border-r border-gray-700">Reținere la Sursă</th>
                <th class="px-4 py-3 border-r border-gray-700">CASS Aplicabil</th>
                <th class="px-4 py-3">Avantaj Competitiv</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Criptoactive</td>
                <td class="px-4 py-3 border-r border-gray-700">16%</td>
                <td class="px-4 py-3 border-r border-gray-700">Nu (Autoimpunere)</td>
                <td class="px-4 py-3 border-r border-gray-700">Da (Plafonat)</td>
                <td class="px-4 py-3">Potențial de randament ridicat, acces global.</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Acțiuni BVB (>1 an)</td>
                <td class="px-4 py-3 border-r border-gray-700">3%</td>
                <td class="px-4 py-3 border-r border-gray-700">Da</td>
                <td class="px-4 py-3 border-r border-gray-700">Da (Plafonat)</td>
                <td class="px-4 py-3">Cel mai mic impozit pentru active de risc.</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Acțiuni BVB (<1 an)</td>
                <td class="px-4 py-3 border-r border-gray-700">6%</td>
                <td class="px-4 py-3 border-r border-gray-700">Da</td>
                <td class="px-4 py-3 border-r border-gray-700">Da (Plafonat)</td>
                <td class="px-4 py-3">Lichiditate și taxe reduse.</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Aur Fizic</td>
                <td class="px-4 py-3 border-r border-gray-700">16%</td>
                <td class="px-4 py-3 border-r border-gray-700">Nu</td>
                <td class="px-4 py-3 border-r border-gray-700">Da (Plafonat)</td>
                <td class="px-4 py-3">Activ de refugiu tangibil.</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Dividende</td>
                <td class="px-4 py-3 border-r border-gray-700">16%</td>
                <td class="px-4 py-3 border-r border-gray-700">Da</td>
                <td class="px-4 py-3 border-r border-gray-700">Da (Plafonat)</td>
                <td class="px-4 py-3">Venit pasiv, dar dublu impozitat economic.</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="px-4 py-3 font-bold border-r border-gray-700">Titluri de Stat</td>
                <td class="px-4 py-3 border-r border-gray-700 text-green-400">0%</td>
                <td class="px-4 py-3 border-r border-gray-700">N/A</td>
                <td class="px-4 py-3 border-r border-gray-700">Nu</td>
                <td class="px-4 py-3">Eficiență fiscală maximă.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-2xl font-bold text-white mt-10 border-b border-gray-700 pb-2">6. Impactul MiCA și Concluzii</h3>
        
        <h4 class="text-xl font-bold text-blue-400 mt-6">6.1. Impactul MiCA asupra Pieței Locale</h4>
        <p>Implementarea MiCA a generat în România o "selecție naturală" accelerată a furnizorilor de servicii.</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Costuri de Conformare:</strong> Obligația de a menține fonduri proprii (50.000 – 150.000 EUR), de a plăti taxa de supraveghere ASF (0,5% din venituri lunar) și de a angaja personal specializat (ofițeri AML, directori locali) a eliminat micii jucători.</li>
          <li><strong>Protecția Consumatorului:</strong> Investitorii români beneficiază acum de protecție împotriva insolvenței CASP-ului (segregarea fondurilor) și de transparență obligatorie prin White Papers. Riscul de "rug pull" pe proiecte reglementate a scăzut semnificativ.</li>
          <li><strong>Inovație:</strong> Deși barierele de intrare sunt mari, cadrul clar atrage investitori instituționali (bănci, fonduri) care anterior evitau zona gri. Băncile românești încep să exploreze emiterea de EMT (stablecoins) sau servicii de custodie, având cadrul legal BNR deja setat.</li>
        </ul>

        <h4 class="text-xl font-bold text-blue-400 mt-6">6.2. Concluzii și Perspective</h4>
        <p>La data de 23 ianuarie 2026, România a finalizat integrarea criptoactivelor în curentul financiar principal (mainstream), dar cu un cost semnificativ pentru utilizator.</p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Sfârșitul "Vestului Sălbatic":</strong> Epoca tranzacțiilor anonime și a platformelor nereglementate s-a încheiat. Prin OUG 10/2025 și Travel Rule, fiecare satoshi este monitorizat.</li>
          <li><strong>Povara Fiscală:</strong> Creșterea impozitului la 16% și extinderea bazelor de calcul pentru CASS transformă cripto într-o clasă de active scumpă fiscal. Aceasta poate reduce atractivitatea pentru micii investitori, care s-ar putea reorienta spre BVB (impozite de 3-6%) sau Titluri de Stat.</li>
          <li><strong>Presiunea Timpului:</strong> Următoarele 6 luni (până în iulie 2026) sunt critice. Entitățile care operează sub regimul tranzitoriu ("Grandfathering") trebuie să obțină licența MiCA sau să iasă de pe piață. Ne așteptăm la o consolidare a pieței în jurul a 3-4 jucători majori autorizați.</li>
          <li><strong>Supravegherea Agresivă:</strong> Cu ASF și BNR având puteri depline și cu ANAF conectat la fluxurile de date europene (DAC8), conformitatea nu mai este opțională. Strategia optimă pentru 2026 este transparența totală și optimizarea portofoliului ținând cont de noile realități fiscale.</li>
        </ul>
        <p class="font-bold text-white mt-4">În esență, piața cripto din România a devenit mai sigură, mai transparentă, dar semnificativ mai puțin profitabilă din punct de vedere fiscal și mai complexă birocratic. Viitorul aparține entităților care pot naviga acest labirint de reglementări și investitorilor care își pot asuma costurile de conformitate.</p>

      </div>
    `
  }
];

// --- 3. LISTA TERMENI & LINK-URI (INTERCONECTARE) ---
export const terms: Record<string, { def: string, url?: string }> = {
  "Bitcoin": {
    def: "Aur Digital. Rețea descentralizată, limitată la 21 milioane unități.",
    url: "/academie/ce-este-bitcoin-ghid-complet"
  },
  "Ethereum": {
    def: "Platformă de Smart Contracts. Fundația DeFi și Web3.",
    url: "/academie/ce-este-ethereum-ghid-suprem"
  },
  "RSI": {
    def: "Indicator (0-100). Măsoară dacă piața e supra-cumpărată (>70) sau supra-vândută (<30).",
    url: "/academie/rsi-relative-strength-index-explicat"
  },
  "Blockchain": {
    def: "Registru public distribuit, imposibil de falsificat.",
    url: "/academie/ce-este-bitcoin-ghid-complet" 
  },
  "DeFi": {
    def: "Finanțe Descentralizate. Bănci fără bancheri, bazate pe cod.",
    url: "/academie/ce-este-ethereum-ghid-suprem"
  },
  "Wallet": {
    def: "Portofel digital. Nu ține banii, ci cheile tale private.",
    url: "/academie/portofele-crypto-hot-vs-cold-ghid"
  },
  "Cold Wallet": {
    def: "Portofel hardware (offline). Cel mai sigur mod de a păstra crypto.",
    url: "/academie/portofele-crypto-hot-vs-cold-ghid"
  },
  "Halving": {
    def: "Eveniment la 4 ani care reduce inflația Bitcoin la jumătate.",
    url: "/academie/ce-este-bitcoin-ghid-complet"
  },
  "Market Cap": {
    def: "Valoarea totală a unei monede (Preț x Monede în circulație).",
    url: "/academie/tokenomics-ghid-market-cap-fdv"
  },
  "Smart Money": {
    def: "Investitorii instituționali (Balene, Fonduri). Cei care fac piața.",
    url: "/academie/ciclul-pietei-wyckoff-ghid-faze"
  },
  "Acumulare": {
    def: "Faza în care balenele cumpără în liniște, înainte de explozia prețului.",
    url: "/academie/ciclul-pietei-wyckoff-ghid-faze"
  },
  "Lichiditatea": {
    def: "Capacitatea de a vinde rapid fără slippage.",
    url: "/academie/lichiditatea-explicata-orderbook-slippage-amm"
  },
  "Stablecoin": {
    def: "Monedă stabilă (1$ = 1 Coin). Puntea dintre Fiat și Crypto.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  },
  "USDT": {
    def: "Tether. Cel mai popular Stablecoin. Regele volumului.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  },
  "USDC": {
    def: "USD Coin. Stablecoin reglementat în SUA, susținut de bănci.",
    url: "/academie/stablecoins-ghid-usdt-usdc-dai"
  }
};

// --- 4. FUNCȚIA DE PROCESARE TEXT (LINK-URI INTELIGENTE) ---
export function enhanceContent(content: string): string {
  let enhancedContent = content;
  
  // Sortăm termenii după lungime (descrescător) ca să nu înlocuim "Wallet" în interiorul lui "Cold Wallet"
  const sortedTerms = Object.keys(terms).sort((a, b) => b.length - a.length);

  sortedTerms.forEach((term) => {
    const info = terms[term];
    // Regex care caută cuvântul, dar ignoră dacă e deja într-un link sau tag HTML
    const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b(?![^<]*>)`, 'g');
    
    enhancedContent = enhancedContent.replace(regex, (match) => {
      // Dacă avem URL, facem link. Dacă nu, doar tooltip.
      if (info.url) {
        return `
          <a href="${info.url}" class="group relative inline-block text-blue-400 font-medium hover:text-blue-300 transition-colors border-b border-blue-500/30 hover:border-blue-400 cursor-pointer">
            ${match}
            <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-blue-900/95 text-white text-xs rounded-lg shadow-xl border border-blue-500/30 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed normal-case font-normal">
              ${info.def}
              <span class="block mt-2 text-blue-300 font-bold text-[10px] uppercase tracking-wider">Click pentru Ghid Complet →</span>
            </span>
          </a>
        `;
      } else {
        return `
          <span class="group relative cursor-help border-b border-dotted border-gray-500 hover:border-gray-300 text-gray-300 transition-colors">
            ${match}
            <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/95 text-white text-xs rounded-lg shadow-xl border border-gray-700 z-50 backdrop-blur-sm pointer-events-none text-center leading-relaxed">
              ${info.def}
            </span>
          </span>
        `;
      }
    });
  });
  
  return enhancedContent;
} 