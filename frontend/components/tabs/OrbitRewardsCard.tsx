"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import TabNavigation, { Tab } from "./TabNavigation";
import CyberpunkCard from "../card/CyberpunkCard";
import ConnectWallets from "./ConnectWallets";
import Dashboard, { DashboardData } from "./Dashboard";
import OrbitRewardsFlow from "../orbit/OrbitRewardsFlow";
import {
  OrbitRewardsProvider,
  useOrbitRewards,
} from "@/context/OrbitRewardsProvider";

function OrbitRewardsCardContent() {
  const { address, isConnected } = useAccount();
  const keplr = useKeplrContext();
  const {
    registrationStep,
    setRegistrationStep,
    isRegistering,
    registrationHash,
    registerOrUpdate,
    clearAll,
  } = useOrbitRewards();

  const [activeTab, setActiveTab] = useState<Tab>("connect");

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

  const handleRegisterOrUpdate = async () => {
    if (!keplr.isConnected || !keplr.account) {
      alert("Keplr wallet must be connected first");
      return;
    }

    try {
      await registerOrUpdate(keplr.account.address);
    } catch (error) {
      console.error("Failed to register/update:", error);
    }
  };

  const resetCard = () => {
    clearAll();
    setRegistrationStep("check");
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
            onSwitchToRegister={() => setActiveTab("proof")}
          />
        )}

        {activeTab === "proof" && (
          <OrbitRewardsFlow
            step={registrationStep}
            setStep={setRegistrationStep}
            isRegistering={isRegistering}
            registrationHash={registrationHash}
            keplr={keplr}
            onRegisterOrUpdate={handleRegisterOrUpdate}
            onReset={resetCard}
          />
        )}
      </CyberpunkCard>
    </div>
  );
}

export default function OrbitRewardsCard() {
  return (
    <OrbitRewardsProvider>
      <OrbitRewardsCardContent />
    </OrbitRewardsProvider>
  );
}
