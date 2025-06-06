"use client";

import { wagmiAdapter, projectId, metadata } from "@/config/reown";
import { createAppKit } from "@reown/appkit/react";
import { baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// QueryClient 설정
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// AppKit 모달 생성
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata,
  features: {
    analytics: true, // 분석 기능 활성화 (선택사항)
    email: true, // 이메일 로그인 활성화
    socials: ["google", "github", "discord", "apple"], // 소셜 로그인 옵션
    onramp: false, // 온램프 기능 활성화
  },
  themeMode: "light", // 테마 모드
});

function ReownProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ReownProvider;
