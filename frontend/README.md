# 🌌 OrbitChronicle Frontend

Next.js frontend application for the OrbitChronicle cross-chain loyalty system, featuring **Chainlink Functions** for delegation verification and **Reown AppKit** for advanced wallet connectivity.

## ✨ Key Features

- 🔗 **600+ Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more via Reown AppKit
- 📧 **Social Login**: Google, GitHub, Discord, Apple authentication
- 💰 **On-ramp Integration**: Direct crypto purchase with credit cards
- ⚡ **Real-time Verification**: Chainlink Functions for cross-chain delegation checking
- 🎨 **Immersive UI**: Cyberpunk space-themed interface with animated backgrounds
- 📱 **Mobile Optimized**: Responsive design for all devices
- 🌐 **Multi-chain**: Ethereum, Base Sepolia, and Cosmos ecosystem support

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Prerequisites

1. **Reown Cloud Project**: Create a project at [cloud.reown.com](https://cloud.reown.com) and get your Project ID
2. **Wallet**: MetaMask or any Web3-compatible wallet
3. **Testnet Tokens**: Base Sepolia ETH for transactions

## ⚙️ Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here
```

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── background/           # 🌌 Animated space backgrounds
│   │   │   ├── SpaceBackground.tsx
│   │   │   └── NebulaEffect.tsx
│   │   ├── tabs/                 # 📑 Main navigation and content
│   │   │   ├── Dashboard.tsx
│   │   │   ├── OrbitRewardsCard.tsx
│   │   │   └── TabNavigation.tsx
│   │   ├── orbit/                # ⚡ Delegation verification flow
│   │   │   ├── OrbitRewardsFlow.tsx
│   │   │   ├── CheckEligibility.tsx
│   │   │   ├── RegisterStep.tsx
│   │   │   └── SuccessStep.tsx
│   │   └── ui/                   # 🎨 Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── LoadingSpinner.tsx
│   ├── config/
│   │   └── reown.ts              # Reown AppKit configuration
│   ├── context/
│   │   ├── ReownProvider.tsx     # Wallet connection provider
│   │   └── OrbitRewardsProvider.tsx  # Application state management
│   ├── hooks/
│   │   ├── useOrbitRewards.ts    # Custom hooks for rewards logic
│   │   └── useChainlinkVerification.ts  # Chainlink Functions integration
│   ├── utils/
│   │   ├── api.ts                # API utility functions
│   │   ├── format.ts             # Data formatting helpers
│   │   └── constants.ts          # Application constants
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles and animations
├── public/
│   ├── favicon.ico               # Optimized favicon
│   └── assets/                   # Static assets
└── package.json
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet Connection**: Reown AppKit + Wagmi
- **State Management**: React Context + TanStack Query
- **Animations**: Framer Motion
- **Verification**: Chainlink Functions
- **Deployment**: Vercel

## 🎯 Core Components

### ReownProvider

Provides wallet connection functionality across the entire app:

```tsx
import { ReownProvider } from "./context/ReownProvider";

export default function RootLayout({ children }) {
  return <ReownProvider>{children}</ReownProvider>;
}
```

### OrbitRewardsFlow

Main component for delegation verification and NFT rewards:

```tsx
import { OrbitRewardsFlow } from "./components/orbit/OrbitRewardsFlow";

// Features:
// - Multi-step verification process
// - Real-time status updates
// - Error handling and retry logic
// - Success animations
```

### SpaceBackground

Immersive animated background:

```tsx
import { SpaceBackground } from "./components/background/SpaceBackground";

// Features:
// - Parallax star field
// - Floating particles
// - Gradient animations
// - Performance optimized
```

## 🔗 Wallet Integration

### Reown AppKit Features

```tsx
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

function WalletButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <button onClick={() => (isConnected ? disconnect() : open())}>
      {isConnected ? `Disconnect ${address?.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}
```

### Web Components (Global HTML Elements)

```html
<!-- Basic connect button -->
<appkit-button />

<!-- Network selection -->
<appkit-network-button />

<!-- Account info -->
<appkit-account-button />
```

## ⚡ Chainlink Functions Integration

### Verification Process

```tsx
import { useChainlinkVerification } from "../hooks/useChainlinkVerification";

function VerificationComponent() {
  const { verifyDelegation, isLoading, error, result } =
    useChainlinkVerification();

  const handleVerify = async () => {
    await verifyDelegation({
      delegatorAddress: "init1...",
      validatorAddress: "initvaloper1...",
      minAmount: "1000000", // 1 INIT
    });
  };

  return (
    <button onClick={handleVerify} disabled={isLoading}>
      {isLoading ? "Verifying..." : "Verify Delegation"}
    </button>
  );
}
```

## 🎨 UI/UX Features

### Cyberpunk Theme

- Dark space-themed color palette
- Neon accent colors (purple, gold, cyan)
- Glowing borders and shadows
- Smooth transitions and animations

### Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Progressive Web App features

### Accessibility

- WCAG 2.1 compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support

## 🧪 Development

### Adding New Components

```bash
# Create new component
mkdir -p app/components/my-feature
touch app/components/my-feature/MyComponent.tsx
touch app/components/my-feature/index.ts
```

### Testing Locally

```bash
# Run development server
yarn dev

# Run type checking
yarn type-check

# Run linting
yarn lint

# Build for production
yarn build
```

### Environment Variables

| Variable                       | Description            | Required |
| ------------------------------ | ---------------------- | -------- |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown Cloud Project ID | ✅       |

## 🌐 Supported Networks

- **Base Sepolia** (84532) - Primary testnet

Network configuration is managed in `app/config/reown.ts`.

## 📱 Mobile Experience

- Progressive Web App (PWA) support
- Optimized for mobile wallets
- Touch gestures and interactions
- Offline capability for static content

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
yarn build
vercel --prod
```

### Manual Deployment

```bash
# Build static files
yarn build
yarn export

# Deploy build files to your hosting provider
```

## 🔧 Customization

### Theme Configuration

Edit `tailwind.config.js` to customize colors, spacing, and animations:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        "orbit-purple": "#8A2BE2",
        "orbit-gold": "#FFD700",
        "space-dark": "#0d0d1a",
      },
    },
  },
};
```

### Animation Customization

Modify animations in `app/globals.css`:

```css
@keyframes orbit-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-orbit {
  animation: orbit-spin 20s linear infinite;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**

   - Check Reown Project ID configuration
   - Verify network compatibility
   - Ensure wallet is unlocked

2. **Verification Not Working**

   - Confirm Chainlink Functions API is accessible
   - Check delegator address format (bech32)
   - Verify network connection

3. **UI Not Loading**
   - Clear browser cache
   - Check console for JavaScript errors
   - Verify all environment variables are set

### Debug Mode

Enable debug logging in development:

```typescript
// In your component
console.log("Debug info:", { address, isConnected, chainId });
```

## 📚 Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chainlink Functions Guide](https://docs.chain.link/chainlink-functions)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is part of the Keplr Ideathon submission and is licensed under the MIT License.

---

**🌌 Built with love for the Cosmos ecosystem using Chainlink Functions and Reown AppKit**
