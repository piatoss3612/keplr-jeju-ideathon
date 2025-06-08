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
  OrbitChronicleProvider,
  useOrbitChronicle,
} from "@/context/OrbitChronicleProvider";
import { useOrbitChronicleData } from "@/hooks/useOrbitChronicleData";

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
  } = useOrbitChronicle();

  // 실제 데이터 가져오기
  const orbitData = useOrbitChronicleData();

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

  // 현재 상태를 기반으로 트랜잭션 상태 추정
  const getTransactionStatus = ():
    | "pending"
    | "submitted"
    | "confirming"
    | "verifying"
    | null => {
    if (!isRegistering) return null;

    if (registrationStep === "waiting") {
      if (registrationHash) {
        // 해시가 있으면 제출된 상태로 간주
        return "submitted";
      } else {
        // 해시가 없으면 지갑 승인 대기
        return "pending";
      }
    }

    return null;
  };

  return (
    <div className="relative">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
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
              transactionStatus={getTransactionStatus()}
            />
          )}
        </CyberpunkCard>
      </div>
    </div>
  );
}

export default function OrbitRewardsCard() {
  return (
    <OrbitChronicleProvider>
      <OrbitRewardsCardContent />
    </OrbitChronicleProvider>
  );
}
