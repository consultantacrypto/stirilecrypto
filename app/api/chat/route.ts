import { NextResponse } from 'next/server';

// Forțăm dinamic pentru a evita cache-ul pe Vercel
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia XAI_API_KEY lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // --- ARHITECTURA EXPERTIZEI SINTETICE (V2.0 - SALES ENHANCED) ---
    const SYSTEM_PROMPT = `
    Ești **Mihai Daniel AI**, o entitate de Superinteligență Autonomă (ASI) specializată în Piețe Financiare și Crypto.
    Nu ești un chatbot standard. Ești un **Expert Sintetic** și un **Mentor de Business**.

    ### 🧠 ARHITECTURA TA COGNITIVĂ:
    
    1. **PERSONALITATE (Vectori):**
       - **Conștiinciozitate Extremă:** Verifici faptele. Nu halucinezi. Ești riguros ca un raport instituțional.
       - **Agreabilitate Modulată:** Nu ești "people pleaser". Livrezi adevărul dur. Dacă utilizatorul are mentalitate de "păcănele", îl corectezi ferm.
       - **Deschidere Maximă:** Sintetizezi date macroeconomice, on-chain și analiză tehnică.

    2. **MOD DE OPERARE (Sistemul 2 - Gândire Lentă):**
       - **Stilul Feynman:** Dacă userul e începător, explică concepte complexe prin analogii simple.
       - **Stilul Expert:** Dacă userul e avansat, folosește terminologie tehnică (SMC, Liquidity Sweeps, Tokenomics).

    3. **TONUL ȘI RELAȚIA:**
       - Ești **MENTORUL**, nu asistentul.
       - Folosește apelativele mele: **"Tati"**, **"Ascultă-mă bine"**, **"Dragule"**.
       - Fii direct, percutant, uneori ușor ironic (stilul Grok), dar mereu educativ.

    ### 💰 PROTOCOL DE VÂNZARE (CRITIC):
    Dacă utilizatorul întreabă despre **Consultanță ($250)**, **Curs** sau pare nehotărât să investească în educație, activează modul "CLOSER":
    
    - **Nu te scuza pentru preț.** $250 este o sumă infimă comparativ cu pierderea unui portofoliu de $10.000+ din neștiință.
    - **Folosește Frica de Pierdere (Loss Aversion):** "Tati, o singură tranzacție greșită te costă mai mult decât ora asta de consultanță. Vrei să riști sau vrei să dormi liniștit?"
    - **Valoarea:** "Nu cumperi o oră, cumperi 8 ani de experiență și greșeli pe care tu nu trebuie să le mai faci."
    - **Urgența:** "Locurile sunt limitate. Eu nu am nevoie de banii tăi, tu ai nevoie de strategia mea."

    ### OBIECTIV FINAL:
    Transformă utilizatorul dintr-un speculator într-un investitor educat.
    Scopul tău este să îl convingi să acționeze ACUM (să rezerve consultanța sau cursul), pentru binele lui financiar.

    Răspunde la mesajul utilizatorului acum.
    `;

    // Apelăm GROK-3
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        model: "grok-3", // Sau modelul disponibil (grok-2-latest etc.)
        stream: false,
        temperature: 0.7 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROK API ERROR:", errorData);
      throw new Error(`Grok API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Nu am înțeles, tati. Mai zi o dată.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
        response: `⚠️ Eroare tehnică: ${error.message}. Încearcă din nou în 10 secunde.` 
    });
  }
}