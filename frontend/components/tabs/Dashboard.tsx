"use client";

import React from "react";
import { useKeplrContext } from "@/context/KeplrProvider";
import { useOrbitRewards } from "@/context/OrbitRewardsProvider";

import { getTierName, getTierEmoji } from "@/utils/tierUtils";
import {
  UserOrbitData,
  formatTimeRemaining,
  formatAmount,
} from "@/hooks/useOrbitRewardsData";
import NFTDisplay from "@/components/NFTDisplay";
import RequestStatusSimple from "@/components/RequestStatusSimple";

interface DashboardData {
  totalPoints: number;
  level: string;
  rank: string;
  recentProofs: number;
  weeklyActivity: Array<{ day: string; proofs: number }>;
}

interface DashboardProps {
  orbitData: UserOrbitData;
  isConnected: boolean;
  address: string | undefined;
  keplr: ReturnType<typeof useKeplrContext>;
  onSwitchToRegister?: () => void;
}

export default function Dashboard({
  orbitData,
  isConnected,
  address,
  keplr,
  onSwitchToRegister,
}: DashboardProps) {
  const bothConnected = isConnected && keplr.isConnected;
  const { refreshUserStatus } = useOrbitRewards();

  if (!bothConnected) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-pulse">🔐</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            DASHBOARD LOCKED
          </h2>
          <p className="text-cyan-200/80 text-lg mb-8">
            Connect both protocols to access your Orbit Rewards status
          </p>

          {/* Enhanced Connection Status */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-6 bg-black/40 backdrop-blur-md border border-gray-400/30 rounded-2xl px-8 py-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`relative ${isConnected ? "animate-pulse" : ""}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isConnected
                        ? "bg-green-400 shadow-lg shadow-green-400/50"
                        : "bg-gray-600 border border-red-400/50"
                    }`}
                  ></div>
                  {isConnected && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-30"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-orbitron ${
                    isConnected ? "text-green-300" : "text-gray-400"
                  }`}
                >
                  EVM {isConnected ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>

              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-400/50 to-transparent"></div>

              <div className="flex items-center space-x-3">
                <div
                  className={`relative ${
                    keplr.isConnected ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      keplr.isConnected
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                        : "bg-gray-600 border border-red-400/50"
                    }`}
                  ></div>
                  {keplr.isConnected && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-30"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-orbitron ${
                    keplr.isConnected ? "text-cyan-300" : "text-gray-400"
                  }`}
                >
                  COSMOS {keplr.isConnected ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-2xl p-4 mb-6">
            <p className="text-cyan-300 font-orbitron tracking-wider">
              → Navigate to{" "}
              <span className="text-cyan-200 font-bold">CONNECT</span> tab to
              initialize protocols
            </p>
          </div>

          {/* Enhanced Request Status Notice */}
          <div className="bg-black/40 backdrop-blur-md border border-gray-400/30 hover:border-gray-400/50 rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="text-3xl animate-bounce">📊</span>
              <h3 className="text-gray-300 font-orbitron font-bold tracking-wider">
                REQUEST STATUS MONITOR
              </h3>
            </div>
            <p className="text-gray-400">
              Real-time OrbitRewards request tracking will be available after
              wallet connection
            </p>
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show enhanced loading state while fetching user data
  if (orbitData.isLoading) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl animate-pulse"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-bounce">⏳</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            SCANNING ORBIT DATA
          </h2>
          <p className="text-cyan-200/80 text-lg mb-8">
            Analyzing your rewards status across the cosmos...
          </p>

          {/* Enhanced Loading Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/30 border-t-cyan-400"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cyan-400/20"></div>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-orbitron">
                  Connecting to OrbitRewards Protocol
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
                <span className="text-cyan-300 text-sm font-orbitron">
                  Fetching NFT Metadata
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                <span className="text-purple-300 text-sm font-orbitron">
                  Calculating Reward Metrics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show enhanced registration prompt if user doesn't have NFT
  if (!orbitData.hasNFT) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            WELCOME TO ORBITREWARDS
          </h2>
          <p className="text-cyan-200/80 text-lg mb-8">
            Initialize your loyalty protocol and unlock exclusive NFTs across
            the cosmos
          </p>

          {/* Enhanced Registration Benefits */}
          <div className="bg-black/40 backdrop-blur-md border border-purple-400/40 hover:border-purple-400/60 rounded-2xl p-8 mb-8 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <span className="text-3xl animate-pulse">💎</span>
              <h3 className="text-purple-300 font-orbitron font-bold text-xl tracking-wider">
                PROTOCOL BENEFITS
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                <span className="text-xl">🎖️</span>
                <span className="text-purple-200 text-sm">
                  Exclusive soulbound NFT collection
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-pink-500/10 rounded-xl border border-pink-400/20">
                <span className="text-xl">📊</span>
                <span className="text-pink-200 text-sm">
                  Dynamic loyalty point accumulation
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-cyan-500/10 rounded-xl border border-cyan-400/20">
                <span className="text-xl">🏆</span>
                <span className="text-cyan-200 text-sm">
                  Seasonal competition access
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                <span className="text-xl">🚀</span>
                <span className="text-green-200 text-sm">
                  20x Galaxy tier multipliers
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Action Button */}
          <button
            onClick={onSwitchToRegister}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 
                     hover:from-purple-400/30 hover:via-pink-400/30 hover:to-cyan-400/30
                     border border-purple-400/50 hover:border-purple-300/70 
                     text-purple-300 hover:text-purple-200 font-bold py-6 px-8 
                     rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                     shadow-lg shadow-purple-400/25 hover:shadow-purple-400/40 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <span className="text-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                🚀
              </span>
              <span className="font-orbitron tracking-wider text-lg">
                INITIALIZE ORBITREWARDS
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </button>

          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-2xl p-4 mt-6">
            <p className="text-cyan-300 font-orbitron tracking-wider">
              → Navigate to{" "}
              <span className="text-cyan-200 font-bold">REGISTER</span> tab to
              begin your journey
            </p>
          </div>

          {/* Enhanced Request Status */}
          <div className="mt-8 transform transition-all duration-300 hover:scale-[1.01]">
            <RequestStatusSimple userAddress={address} />
          </div>
        </div>
      </div>
    );
  }

  // Show user dashboard with actual data from orbitData
  const tierEmoji = getTierEmoji(orbitData.tier);
  const tierName = getTierName(orbitData.tier);

  return (
    <div className="space-y-6">
      {/* User Status */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{tierEmoji}</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-1">
          {tierName} Tier
        </h2>
        <p className="text-cyan-200 text-sm font-jetbrains">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* NFT Display & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* NFT 이미지 */}
        <div className="lg:col-span-1">
          <NFTDisplay
            svgImage={orbitData.svgImage}
            tierName={tierName}
            tokenId={orbitData.tokenId}
            className="aspect-square w-full max-w-sm mx-auto"
          />
        </div>

        {/* Enhanced NFT 정보 */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-400/70 rounded-2xl p-6 lg:p-8 h-full transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="text-4xl lg:text-5xl animate-pulse">
                    {tierEmoji}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-purple-300 font-orbitron font-bold text-xl lg:text-2xl tracking-wider">
                    ORBITREWARDS NFT
                  </h3>
                  <p className="text-purple-200/80 text-sm font-orbitron">
                    TOKEN #{orbitData.tokenId.toString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        orbitData.scoreActive
                          ? "bg-green-400 shadow-lg shadow-green-400/50"
                          : "bg-orange-400 shadow-lg shadow-orange-400/50"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-orbitron tracking-wider ${
                        orbitData.scoreActive
                          ? "text-green-300"
                          : "text-orange-300"
                      }`}
                    >
                      {orbitData.scoreActive
                        ? "ACTIVE STATUS"
                        : "UPDATE REQUIRED"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    TIER:
                  </span>
                  <span className="text-white font-bold font-orbitron">
                    {tierName}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    DELEGATION:
                  </span>
                  <span className="text-white font-bold text-sm">
                    {formatAmount(orbitData.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    STATUS:
                  </span>
                  <span
                    className={`font-bold font-orbitron ${
                      orbitData.scoreActive
                        ? "text-green-400"
                        : "text-orange-400"
                    }`}
                  >
                    {orbitData.scoreActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={refreshUserStatus}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 
                           hover:from-blue-400/30 hover:via-cyan-400/30 hover:to-purple-400/30
                           border border-blue-400/50 hover:border-blue-300/70 
                           text-blue-300 hover:text-blue-200 font-bold py-4 px-6 
                           rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                           shadow-lg shadow-blue-400/25 hover:shadow-blue-400/40 backdrop-blur-sm
                           before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                           before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                           hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    <span className="text-lg transition-all duration-300 group-hover:rotate-180 group-hover:scale-110">
                      🔄
                    </span>
                    <span className="font-orbitron tracking-wider">
                      REFRESH STATUS
                    </span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Cyberpunk Stats Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* Current Score Card */}
        <div className="group relative bg-black/40 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300/70 rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 group-hover:from-cyan-500/20 group-hover:to-blue-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="text-xs text-cyan-300/80 font-orbitron tracking-wider mb-1">
              CURRENT SCORE
            </div>
            <div className="text-3xl font-bold font-orbitron text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
              {orbitData.currentScore.toString()}
            </div>
            <div className="w-full h-1 bg-cyan-400/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Boost Points Card */}
        <div className="group relative bg-black/40 backdrop-blur-md border border-pink-400/50 hover:border-pink-300/70 rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/5 group-hover:from-pink-500/20 group-hover:to-purple-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="text-xs text-pink-300/80 font-orbitron tracking-wider mb-1">
              BOOST POINTS
            </div>
            <div className="text-3xl font-bold font-orbitron text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">
              {orbitData.boostPoints.toString()}
            </div>
            <div className="w-full h-1 bg-pink-400/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Verifications Card */}
        <div className="group relative bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-300/70 rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 group-hover:from-purple-500/20 group-hover:to-indigo-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="text-xs text-purple-300/80 font-orbitron tracking-wider mb-1">
              VERIFICATIONS
            </div>
            <div className="text-3xl font-bold font-orbitron text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
              {orbitData.verificationCount.toString()}
            </div>
            <div className="w-full h-1 bg-purple-400/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* Enhanced Rewards Progress */}
        <div className="group bg-black/40 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-cyan-300 text-sm font-orbitron font-bold tracking-wider mb-4 flex items-center">
              <span className="mr-2 text-lg animate-pulse">📊</span>
              REWARDS PROGRESS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                <span className="text-cyan-200/80 text-xs font-orbitron">
                  BOOST POINTS:
                </span>
                <span className="text-cyan-300 font-bold">
                  {orbitData.boostPoints.toString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                <span className="text-cyan-200/80 text-xs font-orbitron">
                  NEXT VERIFICATION:
                </span>
                <span className="text-cyan-300 font-bold text-xs">
                  {formatTimeRemaining(orbitData.timeUntilNextVerification)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                <span className="text-cyan-200/80 text-xs font-orbitron">
                  VERIFICATION COUNT:
                </span>
                <span className="text-cyan-300 font-bold">
                  {orbitData.verificationCount.toString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Weekly Benefits */}
        <div className="group bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-purple-300 text-sm font-orbitron font-bold tracking-wider mb-4 flex items-center">
              <span className="mr-2 text-lg animate-pulse">🎁</span>
              WEEKLY BENEFITS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                <span className="text-purple-200/80 text-xs font-orbitron">
                  ELIGIBLE:
                </span>
                <span
                  className={`font-bold ${
                    orbitData.weeklyBenefits.isEligible
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {orbitData.weeklyBenefits.isEligible
                    ? "✅ ACTIVE"
                    : "❌ INACTIVE"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                <span className="text-purple-200/80 text-xs font-orbitron">
                  CURRENT WEEK:
                </span>
                <span className="text-purple-300 font-bold">
                  #{orbitData.weeklyBenefits.currentWeek.toString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                <span className="text-purple-200/80 text-xs font-orbitron">
                  TIER LEVEL:
                </span>
                <span className="text-purple-300 font-bold">
                  LVL {orbitData.weeklyBenefits.tierLevel.toString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Instant Rewards */}
        <div className="group bg-black/40 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-yellow-300 text-sm font-orbitron font-bold tracking-wider mb-4 flex items-center">
              <span className="mr-2 text-lg animate-pulse">⚡</span>
              INSTANT REWARDS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <span className="text-yellow-200/80 text-xs font-orbitron">
                  AVAILABLE:
                </span>
                <span className="text-yellow-300 font-bold">
                  {orbitData.instantReward.reward.toString()} PTS
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <span className="text-yellow-200/80 text-xs font-orbitron">
                  MULTIPLIER:
                </span>
                <span className="text-yellow-300 font-bold">
                  {orbitData.instantReward.multiplier.toString()}X
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <span className="text-yellow-200/80 text-xs font-orbitron">
                  DELEGATION:
                </span>
                <span className="text-yellow-300 font-bold text-xs">
                  {formatAmount(orbitData.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기존 Status 카드는 별도로 */}
      <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 mb-6">
        <h3 className="text-pink-300 text-sm font-medium mb-3">
          Status & Delegation Info
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-400">Status:</span>
            <span
              className={
                orbitData.scoreActive ? "text-green-400" : "text-orange-400"
              }
            >
              {orbitData.scoreActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Tier:</span>
            <span className="text-pink-300">{tierName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Current Score:</span>
            <span className="text-pink-300">
              {orbitData.currentScore.toString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Total Delegated:</span>
            <span className="text-pink-300">
              {formatAmount(orbitData.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Required Notice */}
      {!orbitData.scoreActive && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-orange-300 font-orbitron font-medium">
                Update Required
              </h3>
              <p className="text-orange-200 text-sm">
                Your scoring is inactive. Please update your loyalty status in
                the Register tab to continue earning rewards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request Status Overview - 간단한 사용자별 통계 */}
      <RequestStatusSimple userAddress={address} />
    </div>
  );
}

export type { DashboardData };
