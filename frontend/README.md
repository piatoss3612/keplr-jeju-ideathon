# vlayer Frontend Integration - Keplr Ideathon

Next.js frontend application integrating vlayer zero-knowledge proofs for Initia blockchain delegation verification.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Prerequisites

Before using vlayer functionality, ensure you have:

1. **Wallet**: MetaMask or compatible Web3 wallet
2. **Testnet ETH**: For transaction fees on supported testnets
3. **vlayer Prover Contract**: Deploy your prover contract and update the address

## 🔧 vlayer Configuration

### Dependencies

All required dependencies are already installed:

```json
{
  "@tanstack/react-query": "^5.80.5",
  "@vlayer/react": "^1.0.2-nightly",
  "wagmi": "^2.15.5",
  "viem": "^2.30.6"
}
```

### Context Providers Setup

The application is configured with required providers in `app/layout.tsx`:

- **WagmiProvider**: Ethereum wallet connection
- **QueryClientProvider**: Data fetching and caching
- **ProofProvider**: vlayer proof generation

### Supported Networks

Currently configured for:

- Base Sepolia (testnet)
- Sepolia (testnet)
- Optimism Sepolia (testnet)
- Foundry (local development)

## 📱 Components

### VlayerDemo

Main component demonstrating vlayer integration:

- **useCallProver**: Initiates proof generation
- **useWaitForProvingResult**: Monitors proof completion
- Form inputs for delegation verification parameters
- Real-time status updates and error handling

### WalletConnect

Wallet connection management:

- Connect/disconnect wallet functionality
- Display connected address
- Support for multiple connectors (MetaMask, injected)

## 🔑 vlayer Hooks Usage

### Basic Proof Generation

```typescript
import { useCallProver, useWaitForProvingResult } from "@vlayer/react";

const { callProver, data: proofHash } = useCallProver({
  address: PROVER_ADDRESS,
  proverAbi: PROVER_ABI,
  functionName: "main",
});

const { data: proof } = useWaitForProvingResult(proofHash);
```

### Environment Configuration

vlayer supports different environments:

```typescript
<ProofProvider
  config={{
    env: "testnet", // dev | testnet | prod
  }}
>
```

### Custom Service URLs

```typescript
<ProofProvider
  config={{
    proverUrl: "https://your-prover.vlayer.xyz",
    notaryUrl: "https://your-notary.vlayer.xyz",
    wsProxyUrl: "wss://your-wsproxy.vlayer.xyz",
  }}
>
```

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── VlayerDemo.tsx      # Main vlayer demonstration
│   │   └── WalletConnect.tsx   # Wallet connection component
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── package.json
└── README.md
```

## 🔨 Development

### Setting Up Your Prover

1. Deploy your vlayer prover contract
2. Update `PROVER_ADDRESS` in `VlayerDemo.tsx`
3. Update `PROVER_ABI` with your contract's ABI
4. Test with valid Initia addresses

### Testing Flow

1. Connect wallet using WalletConnect component
2. Enter valid Initia delegator address (bech32 format)
3. Enter validator address to verify against
4. Set minimum delegation amount
5. Click "Verify Delegation" to generate proof
6. Monitor proof generation status
7. View completed proof data

## 📚 Resources

- [vlayer Documentation](https://book.vlayer.xyz/)
- [vlayer React Hooks](https://book.vlayer.xyz/javascript/react-hooks.html)
- [Wagmi Documentation](https://wagmi.sh/)
- [Initia Documentation](https://docs.initia.xyz/)

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**

   - Ensure MetaMask is installed and unlocked
   - Switch to a supported network

2. **Proof Generation Failed**

   - Verify prover contract address is correct
   - Check network connectivity
   - Ensure valid input parameters

3. **TypeScript Errors**
   - Update type definitions for your specific prover ABI
   - Ensure all required props are provided

### Development Tips

- Use browser console to monitor vlayer hook states
- Test with known valid Initia addresses first
- Check network requests in DevTools for debugging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is part of the Keplr Ideathon submission.

# Initia Delegation Verifier with Reown AppKit

Initia 블록체인 delegation을 검증하는 dApp으로, **Reown AppKit**을 사용하여 고급 지갑 연결 기능을 제공합니다.

## ✨ Reown AppKit 주요 기능

- 🔗 **600개 이상의 지갑 지원**: MetaMask, WalletConnect, Coinbase Wallet 등
- 📧 **이메일/소셜 로그인**: Google, GitHub, Discord, Apple 등으로 간편 로그인
- 💰 **온램프 기능**: 신용카드로 암호화폐 직접 구매
- 🌐 **멀티체인 지원**: Ethereum, Arbitrum, Sepolia 등
- 🎨 **커스터마이징 가능한 UI**: 브랜드에 맞는 디자인
- 📱 **모바일 최적화**: 반응형 디자인

## 🚀 시작하기

### 1. 환경 설정

1. **Reown Cloud 프로젝트 생성**

   - [cloud.reown.com](https://cloud.reown.com)에서 계정 생성
   - 새 프로젝트 생성 후 Project ID 복사

2. **환경 변수 설정**
   ```bash
   cp env.example .env.local
   # .env.local 파일에서 NEXT_PUBLIC_REOWN_PROJECT_ID 설정
   ```

### 2. 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

## 🏗️ 프로젝트 구조

```
frontend/
├── app/
│   ├── components/
│   │   ├── ReownWalletConnect.tsx    # Reown AppKit 지갑 연결 컴포넌트
│   │   └── VlayerDemo.tsx           # vlayer 검증 컴포넌트
│   ├── layout.tsx                   # 루트 레이아웃
│   └── page.tsx                     # 메인 페이지
├── config/
│   └── reown.ts                     # Reown AppKit 설정
├── context/
│   └── ReownProvider.tsx            # Reown Provider
└── env.example                      # 환경 변수 예시
```

## 🔧 기술 스택

- **프론트엔드**: Next.js 15, React 19, TypeScript
- **지갑 연결**: Reown AppKit, Wagmi
- **스타일링**: Tailwind CSS
- **상태 관리**: TanStack Query
- **검증**: vlayer (Zero-Knowledge Proofs)

## 🎯 주요 컴포넌트

### ReownWalletConnect

```tsx
import ReownWalletConnect from "./components/ReownWalletConnect";

// 사용법
<ReownWalletConnect />;
```

### Web Components (글로벌 HTML 요소)

```tsx
// 기본 연결 버튼
<appkit-button />

// 네트워크 선택 버튼
<appkit-network-button />
```

### Hooks 사용

```tsx
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

function MyComponent() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  return <button onClick={() => open()}>지갑 연결</button>;
}
```

## 🌐 지원 네트워크

- Ethereum Mainnet
- Arbitrum
- Sepolia Testnet

네트워크 추가는 `config/reown.ts`에서 설정할 수 있습니다.

## 📖 Reown AppKit 추가 기능

### 1. 이메일/소셜 로그인

- Google, GitHub, Discord, Apple 계정으로 로그인
- 별도 지갑 설치 없이 Web3 앱 사용 가능

### 2. 스마트 계정 (Smart Accounts)

- 가스비 후원 기능
- 배치 트랜잭션 지원

### 3. 온램프 (On-ramp)

- 신용카드로 암호화폐 직접 구매
- Coinbase Pay 통합

### 4. 분석 및 모니터링

- 사용자 행동 분석
- 지갑 연결 통계

## 🔗 유용한 링크

- [Reown AppKit 문서](https://docs.reown.com/appkit/overview)
- [Reown Cloud Dashboard](https://cloud.reown.com)
- [GitHub 예제](https://github.com/reown/web-examples)
- [Discord 커뮤니티](https://discord.com/invite/reown)

## 🆚 기존 WalletConnect와의 차이점

| 기능        | 기존 WalletConnect | Reown AppKit            |
| ----------- | ------------------ | ----------------------- |
| 지갑 지원   | 제한적             | 600개 이상              |
| 로그인 방식 | 지갑만             | 지갑 + 이메일/소셜      |
| UI/UX       | 기본적             | 고급, 커스터마이징 가능 |
| 온램프      | 없음               | 내장                    |
| 스마트 계정 | 없음               | 지원                    |
| 분석 기능   | 제한적             | 상세 분석               |

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

---

**Made with ❤️ using Reown AppKit**
