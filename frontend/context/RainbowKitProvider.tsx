"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import {
  getDefaultConfig,
  RainbowKitProvider as RainbowKitProviderBase,
} from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";
import "@rainbow-me/rainbowkit/styles.css";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_REOWN_PROJECT_ID가 설정되지 않았습니다. env.example을 참고하여 .env.local 파일을 생성하세요."
  );
}
// QueryClient 설정
const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Orbit Rewards",
  projectId: projectId,
  chains: [baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

if (!projectId) {
  throw new Error("Project ID is not defined");
}

function RainbowKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(config, cookies);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProviderBase>{children}</RainbowKitProviderBase>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RainbowKitProvider;
