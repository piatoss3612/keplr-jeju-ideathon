"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import TabNavigation, { Tab } from "./TabNavigation";
import CyberpunkCard from "../card/CyberpunkCard";
import ConnectWallets from "./ConnectWallets";
import Dashboard, { DashboardData } from "./Dashboard";
import ProofGeneration from "../proof/ProofGeneration";
import { ProofStep } from "../proof/ProgressIndicator";

export default function OrbitRewardsCard() {
  const { address, isConnected } = useAccount();
  const keplr = useKeplrContext();

  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [step, setStep] = useState<ProofStep>("check");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proof, setProof] = useState<string | null>(null);

  // Mock dashboard data
  const dashboardData: DashboardData = {
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
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <CyberpunkCard>
        {activeTab === "connect" && (
          <ConnectWallets onBothConnected={() => setActiveTab("dashboard")} />
        )}

        {activeTab === "dashboard" && (
          <Dashboard
            data={dashboardData}
            isConnected={isConnected}
            address={address}
            keplr={keplr}
          />
        )}

        {activeTab === "proof" && (
          <ProofGeneration
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
      </CyberpunkCard>
    </div>
  );
}
