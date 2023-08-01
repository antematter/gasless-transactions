"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygonMumbai, hardhat } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const inter = Inter({ subsets: ["latin"] });

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id == polygonMumbai.id) {
          return {
            http: process.env.NEXT_PUBLIC_RPC_URL as string,
          };
        } else
          return {
            http: chain.rpcUrls.public.http[0],
            webSocket: chain.rpcUrls.public.webSocket?.[0],
          };
      },
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>Gasless Transactions</title>
      <body className={inter.className}>
        <WagmiConfig config={config}>{children}</WagmiConfig>
      </body>
    </html>
  );
}
