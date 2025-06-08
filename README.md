<div align="center">

<h1>🪐 OrbitChronicle</h1>

<img src="assets/orbit_logo.svg" alt="OrbitChronicle Logo" width="120" height="120">

<h3>Cross-Chain Loyalty System</h3>
<p><strong>LOYALTY ACROSS THE COSMOS</strong></p>
<p>Revolutionary blockchain loyalty system connecting Cosmos and EVM ecosystems using Chainlink Functions</p>

<p>Experience delegation verification with live tracking, IPFS-enhanced NFTs, and instant rewards in a stunning cyberpunk interface! 🌌</p>

<a href="https://keplr-jeju-ideathon.vercel.app/">🚀 Live Demo</a>
·
<a href="https://keplr-ideathon.vercel.app/">📊 Interactive Slides</a>
·
<a href="https://youtu.be/AyYbSVEyesA?feature=shared">🎥 Video Presentation</a>

</div>

## Table of Contents

- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Delegation Tiers](#delegation-tiers)
- [Tech Stack](#tech-stack)
- [Video Presentation](#video-presentation)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Design Philosophy](#design-philosophy)

## ⭐ Key Features

- 🔗 **Chainlink Oracle**: Automated cross-chain delegation verification
- 🎨 **Dynamic NFTs**: Tier-based soulbound tokens with IPFS graphics
- 📊 **Live Dashboard**: Real-time status and benefit tracking with cyberpunk styling
- ⚡ **Instant Rewards**: Weekly benefits and immediate gratification
- 🌌 **Immersive UI**: Space-themed background with orbit rings and nebula effects
- 🎮 **Smooth Animations**: Tab navigation with sliding indicators and state transitions

## 🚀 How It Works

```mermaid
graph LR
    A[👤 User] --> B[📝 Request Verification]
    B --> C[🔗 Chainlink Functions]
    C --> D[🌌 Cosmos Data]
    D --> E[✅ Mint/Update NFT]
    E --> F[🎁 Earn Rewards]
```

1. **Connect** both EVM and Cosmos wallets through our sleek interface
2. **Verify** your delegation status via Chainlink oracle with real-time progress tracking
3. **Receive** tier-based soulbound NFT with enhanced visual feedback
4. **Enjoy** weekly benefits and instant rewards in our immersive dashboard

## 🏆 Delegation Tiers

| 🪨 Asteroid   | ☄️ Comet      | ⭐ Star       | 🌌 Galaxy     |
| ------------- | ------------- | ------------- | ------------- |
| 5+ INIT       | 20+ INIT      | 100+ INIT     | 1000+ INIT    |
| Basic rewards | 2x multiplier | 3x multiplier | 5x multiplier |

## 🛠️ Tech Stack

- **Contracts**: Solidity on Base Sepolia
- **Oracle**: Chainlink Functions
- **Frontend**: Next.js + wagmi + Keplr + Framer Motion
- **Indexing**: The Graph Protocol
- **Storage**: IPFS for premium graphics
- **Styling**: Tailwind CSS with cyberpunk theme
- **Animations**: Advanced CSS effects and transitions

### 🔄 Technical Evolution

Initially planned to use **vlayer** for on-chain ZK proof verification, but switched to **Chainlink Functions** due to service stability issues. This pivot enabled more reliable cross-chain delegation verification while maintaining the same user experience.

## 🎥 Video Presentation

[![OrbitChronicle Presentation](https://img.youtube.com/vi/AyYbSVEyesA/0.jpg)](https://youtu.be/AyYbSVEyesA?feature=shared)

## 🌟 Live Demo

- **App**: [keplr-jeju-ideathon.vercel.app](https://keplr-jeju-ideathon.vercel.app)
- **Presentation Slides**: [keplr-ideathon.vercel.app](https://keplr-ideathon.vercel.app)
- **Contracts**: Base Sepolia
  - OrbitChronicle: [0x5F131D2C6ea405d8e57845a409CcE5B168176634](https://sepolia.basescan.org/address/0x5F131D2C6ea405d8e57845a409CcE5B168176634)
  - OrbitChronicleNFT: [0x3D14794D6bC6B67E4C335F922AE0DeBfE4dFC648](https://sepolia.basescan.org/address/0x3D14794D6bC6B67E4C335F922AE0DeBfE4dFC648)

## 📁 Project Structure

```
keplr-ideathon/
├── assets/          # 🎨 NFT designs & examples
├── contracts/       # 🔷 Solidity smart contracts
├── verifier-api/    # 🌐 Chainlink Functions runtime
├── subgraph/        # 📊 The Graph indexer
└── frontend/        # 💻 Next.js web app
    ├── components/  # 🧩 UI components
    │   ├── background/  # 🌌 Space background effects
    │   ├── tabs/        # 📑 Navigation and cards
    │   └── orbit/       # ⚡ Registration flow
    └── app/         # 📄 Next.js app router
```

### 📖 Detailed Documentation

Each directory contains comprehensive documentation for developers:

- **[Frontend Documentation](./frontend/README.md)** - Next.js setup, React components, wallet integration, and UI development guide
- **[Smart Contracts Documentation](./contracts/README.md)** - Solidity contracts, Foundry usage, deployment instructions, and ABI generation
- **[Verifier API Documentation](./verifier-api/README.md)** - Chainlink Functions implementation, Vercel deployment, API endpoints, and testing guide
- **[Assets Documentation](./assets/README.md)** - NFT designs, SVG examples, IPFS integration, and visual identity guidelines

💡 **Pro tip**: Check out these detailed READMEs to understand the implementation details, setup instructions, and architecture decisions for each component!

## 🎯 Design Philosophy

**Trust Cosmos's Built-in Mechanisms**

Instead of complex enforcement, we leverage:

- ⏳ 21-day unbonding period (natural commitment)
- 🔒 Redelegation cooldowns (anti-gaming)
- 📸 Moment-in-time verification (achievement recognition)

**Focus on Immediate Value & User Experience**

- 🎁 Weekly benefits over long-term accumulation
- ⚡ Instant rewards and tier upgrades
- 🏆 Active participation over passive holding
- 🌌 Immersive interface that makes DeFi feel like the future

---

**🪐 Built for Keplr Ideathon** | **✨ Powered by Chainlink Functions** | **📄 [MIT License](LICENSE)**
