'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { mainnet, bsc, polygon, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// ✅ ID-ul tău corect de la Reown
const projectId = 'f09e5e3fbd7859c34fa66ef408846d75';

const config = getDefaultConfig({
  appName: 'Mihai Daniel Website',
  projectId: projectId,
  chains: [mainnet, bsc, polygon, arbitrum, base],
  ssr: true, // Server Side Rendering activat
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#2563eb', // Albastrul brandului tău
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}