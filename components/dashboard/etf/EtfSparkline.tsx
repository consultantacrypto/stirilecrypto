'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { EtfSnapshot } from '@/lib/etf/types';

interface EtfSparklineProps {
  data: EtfSnapshot[];
  color: string;
}

export function EtfSparkline({ data, color }: EtfSparklineProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="net_flow_m"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
