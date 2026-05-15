// lib/metrics-api.ts

export interface MetricPoint {
  date: string;
  price: number;
  ma2yr: number | null;
  ma2yrMultiplier: number | null;
}

export async function getBitcoinMetrics(): Promise<MetricPoint[]> {
  try {
    // Încercăm BINANCE (Rapid)
    const res = await fetch(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=1000',
      { next: { revalidate: 3600 } }
    );
    
    let prices: number[] = [];
    let dates: number[] = [];

    if (res.ok) {
      const rawData = await res.json();
      prices = rawData.map((d: any) => parseFloat(d[4]));
      dates = rawData.map((d: any) => d[0]);
    } else {
      throw new Error("Binance failed");
    }

    // Procesare date
    const metrics: MetricPoint[] = [];
    const windowSize = 104; // 2 ani în săptămâni

    for (let i = 0; i < prices.length; i++) {
      const dateObj = new Date(dates[i]);
      const date = dateObj.toLocaleDateString('ro-RO', { year: '2-digit', month: 'short' });
      const price = prices[i];

      let ma2yr = null;
      let ma2yrMultiplier = null;

      if (i >= windowSize) {
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
          sum += prices[i - j];
        }
        ma2yr = sum / windowSize;
        ma2yrMultiplier = ma2yr * 5;
      }

      if (i > windowSize) { 
          metrics.push({ date, price, ma2yr, ma2yrMultiplier });
      }
    }

    return metrics;

  } catch (error) {
    console.error("Error fetching metrics, using fallback:", error);
    // Dacă pică tot, returnăm un array gol (nu crash)
    return [];
  }
}