"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import ConnectWallets from "./ConnectWallets";
import CheckEligibility from "./CheckEligibility";

type Tab = "connect" | "dashboard" | "proof";

export default function OrbitRewardsCard() {
  const { address, isConnected } = useAccount();
  const keplr = useKeplrContext();

  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [step, setStep] = useState<"check" | "proof" | "verify">("check");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proof, setProof] = useState<string | null>(null);

  // Mock dashboard data
  const dashboardData = {
    totalPoints: 1247,
    level: "Cosmic Explorer",
    rank: "#42",
    recentProofs: 7,
    weeklyActivity: [
      { day: "Mon", proofs: 2 },
      { day: "Tue", proofs: 1 },
      { day: "Wed", proofs: 3 },
      { day: "Thu", proofs: 0 },
      { day: "Fri", proofs: 1 },
      { day: "Sat", proofs: 0 },
      { day: "Sun", proofs: 0 },
    ],
  };

  const handleGenerateProof = async () => {
    if (!keplr.isConnected || !keplr.account) {
      alert("Keplr 지갑을 먼저 연결해주세요");
      return;
    }

    setIsGeneratingProof(true);

    // 시뮬레이션 - 실제로는 vlayer prover를 Keplr 주소로 호출
    setTimeout(() => {
      setProof("0x" + Math.random().toString(16).substring(2, 50) + "...");
      setIsGeneratingProof(false);
      setStep("verify");
    }, 3000);
  };

  const handleVerifyProof = () => {
    alert("Proof verified successfully! 🎉");
  };

  const resetCard = () => {
    setStep("check");
    setProof(null);
  };

  return (
    <div className="relative">
      {/* Tab Navigation - Above the card */}
      <div className="flex justify-center mb-0 relative z-20">
        <div className="flex space-x-1">
          {/* Connect Tab */}
          <button
            onClick={() => setActiveTab("connect")}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 relative border-t border-l border-r backdrop-blur-xl ${
              activeTab === "connect"
                ? "bg-gradient-to-r from-slate-900/95 to-purple-900/95 text-white border-pink-400/40 shadow-lg"
                : "bg-slate-900/60 text-pink-300 hover:text-white hover:bg-slate-800/80 border-pink-400/20"
            }`}
            style={{
              clipPath:
                activeTab === "connect"
                  ? "none"
                  : "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
          >
            <span className="relative z-10 font-orbitron">🔗 Connect</span>
            {activeTab === "connect" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-t-xl"></div>
            )}
          </button>

          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 relative border-t border-l border-r backdrop-blur-xl ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-slate-900/95 to-purple-900/95 text-white border-pink-400/40 shadow-lg"
                : "bg-slate-900/60 text-pink-300 hover:text-white hover:bg-slate-800/80 border-pink-400/20"
            }`}
            style={{
              clipPath:
                activeTab === "dashboard"
                  ? "none"
                  : "polygon(10% 0, 90% 0, 90% 100%, 10% 100%)",
            }}
          >
            <span className="relative z-10 font-orbitron">🌌 Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-t-xl"></div>
            )}
          </button>

          {/* Generate Proof Tab */}
          <button
            onClick={() => setActiveTab("proof")}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 relative border-t border-l border-r backdrop-blur-xl ${
              activeTab === "proof"
                ? "bg-gradient-to-r from-slate-900/95 to-purple-900/95 text-white border-pink-400/40 shadow-lg"
                : "bg-slate-900/60 text-pink-300 hover:text-white hover:bg-slate-800/80 border-pink-400/20"
            }`}
            style={{
              clipPath:
                activeTab === "proof"
                  ? "none"
                  : "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          >
            <span className="relative z-10 font-orbitron">
              ⚡ Generate Proof
            </span>
            {activeTab === "proof" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-t-xl"></div>
            )}
          </button>
        </div>
      </div>

      {/* 사이버펑크 메인 카드 */}
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl border border-pink-400/40 shadow-2xl relative overflow-hidden">
        {/* 사이버펑크 카드 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-2xl"></div>
        {/* 네온 글로우 효과 */}
        <div className="absolute inset-0 rounded-2xl shadow-inner shadow-pink-500/25"></div>
        {/* 추가 사이버펑크 글로우 */}
        <div className="absolute inset-px bg-gradient-to-br from-cyan-500/5 to-pink-500/5 rounded-2xl"></div>

        {/* Tab Content */}
        <div className="p-8 relative z-10">
          {activeTab === "connect" && (
            <ConnectWallets onBothConnected={() => setActiveTab("proof")} />
          )}

          {activeTab === "dashboard" && (
            <DashboardContent
              data={dashboardData}
              isConnected={isConnected}
              address={address}
              keplr={keplr}
            />
          )}

          {activeTab === "proof" && (
            <ProofContent
              step={step}
              setStep={setStep}
              isGeneratingProof={isGeneratingProof}
              proof={proof}
              keplr={keplr}
              onGenerateProof={handleGenerateProof}
              onVerifyProof={handleVerifyProof}
              onReset={resetCard}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function DashboardContent({
  data,
  isConnected,
  address,
  keplr,
}: {
  data: {
    totalPoints: number;
    level: string;
    rank: string;
    recentProofs: number;
    weeklyActivity: Array<{ day: string; proofs: number }>;
  };
  isConnected: boolean;
  address: string | undefined;
  keplr: ReturnType<typeof useKeplrContext>;
}) {
  const bothConnected = isConnected && keplr.isConnected;

  if (!bothConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Connect Wallets to View Dashboard
        </h2>
        <p className="text-cyan-200 mb-6">
          Please connect both EVM and Cosmos wallets to see your Orbit Rewards
          status
        </p>

        {/* Connection Status */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                isConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              EVM Wallet {isConnected ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                keplr.isConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                keplr.isConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              Cosmos Wallet {keplr.isConnected ? "✓" : "✗"}
            </span>
          </div>
        </div>

        <p className="text-cyan-300 text-sm">
          Go to 🔗 Connect tab to connect your wallets
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Status */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🌟</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-1">
          {data.level}
        </h2>
        <p className="text-cyan-200 text-sm font-jetbrains">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 text-center shadow-lg shadow-cyan-500/10">
          <div className="text-2xl font-bold font-orbitron text-cyan-400">
            {data.totalPoints}
          </div>
          <div className="text-xs text-cyan-300">Total Points</div>
        </div>
        <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 text-center shadow-lg shadow-pink-500/10">
          <div className="text-2xl font-bold font-orbitron text-pink-400">
            {data.rank}
          </div>
          <div className="text-xs text-pink-300">Global Rank</div>
        </div>
        <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-4 text-center shadow-lg shadow-purple-500/10">
          <div className="text-2xl font-bold font-orbitron text-purple-400">
            {data.recentProofs}
          </div>
          <div className="text-xs text-purple-300">Proofs Generated</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 shadow-lg shadow-cyan-500/10">
        <h3 className="text-cyan-300 text-sm font-medium mb-3">
          Weekly Activity
        </h3>
        <div className="flex justify-between items-end h-20">
          {data.weeklyActivity.map((day, index: number) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div
                className="bg-gradient-to-t from-cyan-500 to-pink-400 rounded-t w-6 transition-all duration-300 shadow-sm shadow-cyan-500/30"
                style={{ height: `${Math.max(8, day.proofs * 15)}px` }}
              ></div>
              <span className="text-xs text-cyan-300">
                {day.day.slice(0, 1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 shadow-lg shadow-pink-500/10">
        <h3 className="text-pink-300 text-sm font-medium mb-3">
          Recent Achievements
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-white text-sm">First Proof Generated</div>
              <div className="text-pink-300 text-xs">2 days ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🎯</span>
            <div>
              <div className="text-white text-sm">Weekly Goal Achieved</div>
              <div className="text-pink-300 text-xs">5 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Proof Generation Component
function ProofContent({
  step,
  setStep,
  isGeneratingProof,
  proof,
  keplr,
  onGenerateProof,
  onVerifyProof,
  onReset,
}: {
  step: "check" | "proof" | "verify";
  setStep: (step: "check" | "proof" | "verify") => void;
  isGeneratingProof: boolean;
  proof: string | null;
  keplr: ReturnType<typeof useKeplrContext>;
  onGenerateProof: () => void;
  onVerifyProof: () => void;
  onReset: () => void;
}) {
  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span
            className={`text-sm font-medium ${
              step === "check" ? "text-cyan-300" : "text-gray-400"
            }`}
          >
            Check Eligibility
          </span>
          <span
            className={`text-sm font-medium ${
              step === "proof" ? "text-pink-300" : "text-gray-400"
            }`}
          >
            Generate
          </span>
          <span
            className={`text-sm font-medium ${
              step === "verify" ? "text-purple-300" : "text-gray-400"
            }`}
          >
            Verify
          </span>
        </div>
        <div className="w-full bg-slate-800/60 rounded-full h-2 shadow-inner">
          <div
            className="bg-gradient-to-r from-cyan-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
            style={{
              width:
                step === "check" ? "33%" : step === "proof" ? "66%" : "100%",
            }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {step === "check" && (
        <CheckEligibility onEligibilityConfirmed={() => setStep("proof")} />
      )}

      {step === "proof" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
              Generate Proof
            </h2>
            <p className="text-cyan-200">
              Generate zero-knowledge proof for your delegation
            </p>
          </div>

          {/* Wallet Selection */}
          <div className="space-y-4">
            {keplr.isConnected && keplr.account ? (
              <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🌌</div>
                    <div>
                      <h3 className="text-cyan-300 font-orbitron font-medium">
                        Keplr Wallet Connected
                      </h3>
                      <p className="text-cyan-200 text-sm">
                        {keplr.account.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs">Connected</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg p-3">
                  <p className="text-cyan-300 text-xs font-medium mb-1">
                    Delegator Address
                  </p>
                  <p className="text-cyan-200 text-xs font-jetbrains break-all">
                    {keplr.account.address}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-orange-400/40 rounded-xl p-4">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🌌</div>
                  <h3 className="text-orange-300 font-orbitron font-medium">
                    Keplr Wallet Required
                  </h3>
                  <p className="text-orange-200 text-sm">
                    Please connect your Keplr wallet to generate proof
                  </p>
                  <div className="text-center">
                    <p className="text-orange-200 text-sm mb-4">
                      Please go back to the Connect step to connect your Keplr
                      wallet
                    </p>
                    <p className="text-orange-200 text-sm">
                      Please go to the Connect tab to connect your Keplr wallet
                      first
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep("check")}
              className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl transition-all duration-300"
            >
              Back to Check
            </button>
            <button
              onClick={onGenerateProof}
              disabled={
                isGeneratingProof || !keplr.isConnected || !keplr.account
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isGeneratingProof ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                "Generate Proof"
              )}
            </button>
          </div>
        </div>
      )}

      {step === "verify" && proof && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🛸</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Proof Generated
            </h2>
            <p className="text-cyan-200">
              Your zero-knowledge proof is ready for verification
            </p>
          </div>

          <div className="bg-slate-800/40 border border-cyan-400/30 rounded-xl p-4">
            <h3 className="text-cyan-300 text-sm font-medium mb-2">
              Generated Proof
            </h3>
            <p className="text-cyan-300 font-mono text-xs break-all bg-slate-800/50 p-3 rounded-lg">
              {proof}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Reset
            </button>
            <button
              onClick={onVerifyProof}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Verify Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
