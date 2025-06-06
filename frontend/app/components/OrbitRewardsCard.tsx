"use client";

import { useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

type Tab = "dashboard" | "proof";

export default function OrbitRewardsCard() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [step, setStep] = useState<"connect" | "proof" | "verify">("connect");
  const [delegatorAddress, setDelegatorAddress] = useState("");
  const [validatorAddress, setValidatorAddress] = useState("");
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
    if (!delegatorAddress || !validatorAddress) {
      alert("모든 필드를 입력해주세요");
      return;
    }

    setIsGeneratingProof(true);

    // 시뮬레이션 - 실제로는 vlayer prover 호출
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
    setStep("connect");
    setDelegatorAddress("");
    setValidatorAddress("");
    setProof(null);
  };

  return (
    <div className="relative">
      {/* Tab Navigation - Above the card */}
      <div className="flex justify-center mb-0 relative z-20">
        <div className="flex space-x-1">
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
                  : "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
            }}
          >
            <span className="relative z-10 font-orbitron">🌌 Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-t-xl"></div>
            )}
          </button>
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
                  : "polygon(5% 0, 95% 0, 100% 100%, 0% 100%)",
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
          {activeTab === "dashboard" ? (
            <DashboardContent
              data={dashboardData}
              isConnected={isConnected}
              address={address}
              onConnect={() => open()}
            />
          ) : (
            <ProofContent
              step={step}
              setStep={setStep}
              delegatorAddress={delegatorAddress}
              setDelegatorAddress={setDelegatorAddress}
              validatorAddress={validatorAddress}
              setValidatorAddress={setValidatorAddress}
              isGeneratingProof={isGeneratingProof}
              proof={proof}
              isConnected={isConnected}
              address={address}
              onConnect={() => open()}
              onDisconnect={() => disconnect()}
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
  onConnect,
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
  onConnect: () => void;
}) {
  if (!isConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Connect to View Dashboard
        </h2>
        <p className="text-cyan-200 mb-6">
          Connect your wallet to see your Orbit Rewards status
        </p>
        <button
          onClick={onConnect}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Connect Wallet
        </button>
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
  delegatorAddress,
  setDelegatorAddress,
  validatorAddress,
  setValidatorAddress,
  isGeneratingProof,
  proof,
  isConnected,
  address,
  onConnect,
  onDisconnect,
  onGenerateProof,
  onVerifyProof,
  onReset,
}: {
  step: "connect" | "proof" | "verify";
  setStep: (step: "connect" | "proof" | "verify") => void;
  delegatorAddress: string;
  setDelegatorAddress: (address: string) => void;
  validatorAddress: string;
  setValidatorAddress: (address: string) => void;
  isGeneratingProof: boolean;
  proof: string | null;
  isConnected: boolean;
  address: string | undefined;
  onConnect: () => void;
  onDisconnect: () => void;
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
              step === "connect" ? "text-cyan-300" : "text-gray-400"
            }`}
          >
            Connect
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
                step === "connect" ? "33%" : step === "proof" ? "66%" : "100%",
            }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {step === "connect" && (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
            Connect to Orbit
          </h2>
          <p className="text-cyan-200 mb-6">
            Connect your wallet to start your orbit journey
          </p>

          {!isConnected ? (
            <button
              onClick={onConnect}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                <p className="text-green-300 text-sm mb-1">
                  ✓ Wallet Connected
                </p>
                <p className="text-green-100 font-jetbrains text-xs">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("proof")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Continue
                </button>
                <button
                  onClick={onDisconnect}
                  className="px-4 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "proof" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
              Generate Proof
            </h2>
            <p className="text-cyan-200">
              Enter delegation details to generate zero-knowledge proof
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-2">
                Delegator Address
              </label>
              <input
                type="text"
                value={delegatorAddress}
                onChange={(e) => setDelegatorAddress(e.target.value)}
                placeholder="init1..."
                className="w-full bg-slate-900/70 border border-cyan-400/40 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 shadow-lg shadow-cyan-500/10"
              />
            </div>

            <div>
              <label className="block text-pink-300 text-sm font-medium mb-2">
                Validator Address
              </label>
              <input
                type="text"
                value={validatorAddress}
                onChange={(e) => setValidatorAddress(e.target.value)}
                placeholder="initvaloper1..."
                className="w-full bg-slate-900/70 border border-pink-400/40 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 shadow-lg shadow-pink-500/10"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep("connect")}
              className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={onGenerateProof}
              disabled={
                isGeneratingProof || !delegatorAddress || !validatorAddress
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
