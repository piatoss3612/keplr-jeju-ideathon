import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { baseSepolia } from "@reown/appkit/networks";

// Reown Cloud에서 발급받은 Project ID
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_REOWN_PROJECT_ID가 설정되지 않았습니다. env.example을 참고하여 .env.local 파일을 생성하세요."
  );
}

// Wagmi Adapter 설정
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  networks: [baseSepolia],
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;

// 앱 메타데이터
export const metadata = {
  name: "Initia Delegation Verifier",
  description: "Initia 블록체인 delegation을 검증하는 dApp",
  url: "https://your-domain.com", // 실제 도메인으로 변경하세요
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};
