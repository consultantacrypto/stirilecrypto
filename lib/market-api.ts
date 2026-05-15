// lib/market-api.ts

export async function getGlobalData() {
  try {
    // Luăm datele globale de la CoinGecko (Gratuit)
    const res = await fetch('https://api.coingecko.com/api/v3/global', { next: { revalidate: 300 } }); // Cache 5 min
    const data = await res.json();
    
    return {
      marketCap: data.data.total_market_cap.usd,
      volume: data.data.total_volume.usd,
      btcDominance: data.data.market_cap_percentage.btc,
      marketCapChange: data.data.market_cap_change_percentage_24h_usd
    };
  } catch (error) {
    console.error("Eroare CoinGecko:", error);
    return null; 
  }
}

export async function getFearGreed() {
  try {
    const res = await fetch('https://api.alternative.me/fng/');
    const data = await res.json();
    return data.data[0]; // Returnează { value: "75", value_classification: "Greed" }
  } catch (error) {
    return { value: "50", value_classification: "Neutral" };
  }
}