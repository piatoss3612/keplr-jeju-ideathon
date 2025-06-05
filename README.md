# 🪐 OrbitRewards: Stellar Staking Verification

## 🚀 Overview

**OrbitRewards** is a revolutionary proof-of-delegation system for Initia blockchain using **vlayer Web Proofs** and **Orbital Penalty System**.

Experience the cosmos of staking rewards where your delegation orbits bring stellar benefits! 🌌

## 🌟 Orbital Verification System

### 🪐 **How Orbits Work**

Like planets in perfect orbit, your staking verification follows a precise cosmic cycle:

1. **Launch Phase**: Prove your delegation and enter orbit 🚀
2. **Orbit Wait**: 7-day orbital period before next verification ⏰
3. **Safe Zone**: 7-day verification window (Day 7-13) 🟢
4. **Cosmic Storm**: After Day 14 - Orbital penalties apply! ⚠️

### 🌌 **Orbital Timeline**

```
Day 0:  🚀 Orbital launch completed
Day 1-6: 🪐 Orbital period (navigation locked)
Day 7-13: ✨ Safe verification zone
Day 14+: ⚡ COSMIC STORM - Points lost + Orbit reset!
```

### ⚡ **Cosmic Penalty System**

#### 🌪️ **Storm Penalties for Late Navigation**

- **1 day late**: -5% stellar points + orbit reset
- **2 days late**: -10% stellar points + orbit reset
- **3 days late**: -15% stellar points + orbit reset
- **4+ days late**: -20% stellar points (max) + orbit reset

#### 🌟 **Stellar Multiplier Constellation**

```
Orbit 1: 1.0x (base stellar energy)
Orbit 2: 1.2x (+20% cosmic boost!)
Orbit 3: 1.5x (+50% stellar power!)
Orbit 4: 2.0x (+100% galactic force!)
Orbit 5+: 2.5x (+150% cosmic mastery!) ✨
```

### 🏆 **Stellar Tiers & Cosmic Points**

| Tier        | Base Points | Orbit 5+ Points | Delegation |
| ----------- | ----------- | --------------- | ---------- |
| 🥉 Asteroid | 1 point     | 2.5 points      | 5+ INIT    |
| 🥈 Comet    | 3 points    | 7.5 points      | 20+ INIT   |
| 🥇 Star     | 8 points    | 20 points       | 100+ INIT  |
| 💎 Galaxy   | 20 points   | 50 points       | 1000+ INIT |

### 🌠 **Cosmic Level System**

- **Levels 1-10**: 100 points each (stellar nursery)
- **Levels 11-20**: 200 points each (star formation)
- **Levels 21+**: 500 points each (galactic core)

## 📋 System Architecture

### 🌐 Mission Control (Vercel API)

- **Production**: `https://keplr-ideathon.vercel.app`
- **Navigation**: `/verify`, `/health`, `/config`
- **Response Time**: 516ms stellar speed

### 🔗 Cosmic Smart Contracts

#### OrbitProver.sol (formerly InitiaProver.sol)

```solidity
// Generate stellar proofs
function proveQualification(WebProof, bech32Address)
    -> (Proof, address, tier, amount)

// Target specific cosmic tier
function proveSpecificTier(WebProof, bech32Address, targetTier)
    -> (Proof, address, tier, amount)
```

#### OrbitVerifier.sol (formerly InitiaVerifier.sol)

```solidity
// Enter orbital system
function claimQualification(Proof, claimant, tier, amount)

// Navigate orbital verification
function verifyLoyalty(Proof, claimant, tier, amount)

// Legacy stellar bonus
function claimLoyaltyBonus() -> Special NFT + Cosmic Multiplier
```

## 🛰️ Navigation Examples

### 1. Orbital Launch

```javascript
// Generate stellar proof
const proof = await orbitProver.proveQualification(webProof, bech32Address);

// Enter orbit
await orbitVerifier.claimQualification(
  proof.proof,
  proof.claimant,
  proof.tier,
  proof.amount
);
```

### 2. Orbital Navigation (Every 7-14 Days)

```javascript
// Navigate within safe orbital window
const navigationProof = await orbitProver.proveQualification(
  webProof,
  bech32Address
);

// Maintain orbit
await orbitVerifier.verifyLoyalty(
  navigationProof.proof,
  navigationProof.claimant,
  navigationProof.tier,
  navigationProof.amount
);
```

### 3. Check Orbital Status

```javascript
// Check navigation window
const canNavigate = await orbitVerifier.getNextVerificationTime(userAddress);

// Check cosmic status
const status = await orbitVerifier.getLoyaltyStatus(userAddress);
console.log(
  `Cosmic Level: ${status.currentLevel}, Stellar Points: ${status.totalPoints}`
);
```

## 🔍 Navigation Console

### Orbital Timing

```solidity
function getNextVerificationTime(address navigator) external view returns (
    bool canNavigate,
    uint256 nextOrbitalWindow
);
```

### Cosmic Status

```solidity
function getLoyaltyStatus(address navigator) external view returns (
    uint256 firstLaunch,
    uint256 lastNavigation,
    uint256 orbitalCount,
    uint256 stellarPoints,
    uint256 cosmicLevel,
    uint256 consecutiveOrbits,
    uint256 currentDelegation
);
```

## 🌌 Cosmic Game Mechanics

### 💫 **Stellar Engagement Forces**

1. **Orbital Urgency**: 7-day window creates cosmic tension
2. **Constellation Protection**: Preserve your stellar streak!
3. **Point Gravitation**: Avoid losing accumulated cosmic energy
4. **Galactic Progression**: Clear advancement through the cosmos

### 🌟 **Cosmic Psychology**

- **Instant Gratification**: Stellar points awarded immediately
- **Progressive Mastery**: Higher tiers unlock cosmic power
- **Orbital Consistency**: Regular navigation builds stellar mastery
- **Cosmic Consequences**: Penalty system prevents orbital decay

### 🛸 **Navigator Experience**

```
🟢 Stellar Navigator: Perfect orbits → Stellar streak → Cosmic mastery
🟡 Occasional Drifter: Minor penalties → Learns orbital discipline
🔴 Lost in Space: Major penalties → Strong gravitational pull to return
```

## 🏗️ Cosmic Architecture Benefits

### ✅ **Orbital Simplicity**

- No complex space missions or cosmic achievements
- Clear 7-day orbital cycles that navigators understand
- Binary outcomes: perfect orbit vs. cosmic storm

### ✅ **Stellar Psychology**

- Loss aversion (cosmic storms) stronger than gain motivation
- Clear orbital deadlines create urgency
- Constellation building creates habits

### ✅ **Galactic Robustness**

- vlayer Web Proof security across the cosmos
- Efficient cosmic penalty calculations
- Gas-optimized stellar verification

## 🎉 Cosmic Innovations

1. **Orbital Penalty System**: Cosmic storms drive consistent navigation
2. **7-Day Orbital Cycles**: Simple, memorable cosmic timing
3. **Progressive Storm System**: Escalating cosmic consequences
4. **Stellar Constellation Building**: Powerful motivation for orbital discipline
5. **Crystal Clear Cosmic Value**: Immediate understanding of stellar benefits

## 🌠 Example Navigator Journey

### Orbits 1-4: Building Stellar Momentum

```
Orbit 1: 20 Galaxy points (1.0x) = 20 stellar points
Orbit 2: 20 Galaxy points (1.2x) = 24 stellar points
Orbit 3: 20 Galaxy points (1.5x) = 30 stellar points
Orbit 4: 20 Galaxy points (2.0x) = 40 stellar points
Total: 114 stellar points → Cosmic Level 2
```

### Orbit 5: Cosmic Choice

```
Option A - Perfect Navigation: 20 × 2.5x = 50 stellar points! 🌟
Option B - 2 Days in Cosmic Storm:
  - Lose 10% stellar energy (-11.4 points)
  - Gain base energy only (20 × 1.0x = 20 points)
  - Orbital reset to Orbit 1 💫
```

---

**🪐 Built for Keplr Ideathon** | **✨ Powered by vlayer Web Proofs** | **🌌 Optimized for Cosmic Engagement**
