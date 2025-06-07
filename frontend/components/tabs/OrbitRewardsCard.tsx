"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import TabNavigation, { Tab } from "./TabNavigation";
import CyberpunkCard from "../card/CyberpunkCard";
import ConnectWallets from "./ConnectWallets";
import Dashboard from "./Dashboard";
import OrbitRewardsFlow from "../orbit/OrbitRewardsFlow";
import {
  OrbitRewardsProvider,
  useOrbitRewards,
} from "@/context/OrbitRewardsProvider";
import { useOrbitRewardsData } from "@/hooks/useOrbitRewardsData";

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

  // 실제 데이터 가져오기
  const orbitData = useOrbitRewardsData();

  const [activeTab, setActiveTab] = useState<Tab>("connect");

  // Dashboard는 이제 orbitData를 직접 사용합니다

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
            orbitData={orbitData}
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
            onGoToDashboard={() => setActiveTab("dashboard")}
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
