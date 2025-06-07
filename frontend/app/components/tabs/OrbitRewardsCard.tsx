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
import { PROVER_ADDRESS } from "@/app/utils/constants";
import { PROVER_ABI } from "@/app/utils/abis";
import {
  ProofGenerationProvider,
  useProofGeneration,
} from "../../../context/ProofGenerationProvider";
import {
  createWebProofRequest,
  expectUrl,
  notarize,
  startPage,
} from "@vlayer/sdk/web_proof";
import { baseSepolia } from "viem/chains";
import {
  BrandedHash,
  createExtensionWebProofProvider,
  createVlayerClient,
} from "@vlayer/sdk";

function OrbitRewardsCardContent() {
  const { address, isConnected } = useAccount();
  const keplr = useKeplrContext();
  const { getCurrentTierValue, eligibilityData } = useProofGeneration();

  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [step, setStep] = useState<ProofStep>("check");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proof, setProof] = useState<BrandedHash<
    typeof PROVER_ABI,
    "proveSpecificTier"
  > | null>(null);

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

    if (!eligibilityData) {
      alert("먼저 자격 확인을 완료해주세요");
      return;
    }

    const tierValue = getCurrentTierValue();
    if (tierValue === null) {
      alert("유효한 티어 정보를 찾을 수 없습니다");
      return;
    }

    try {
      setIsGeneratingProof(true);

      const webProofProvider = createExtensionWebProofProvider({
        token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
      });

      const vlayer = createVlayerClient({
        url: process.env.NEXT_PUBLIC_PROVER_URL,
        token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
        webProofProvider,
      });

      const webProofRequest = createWebProofRequest({
        logoUrl: "/logo.png", // Make sure to add your logo
        steps: [
          startPage(
            `https://keplr-ideathon.vercel.app/verify?address=${keplr.account.address}`,
            "Go to Keplr Verification page"
          ),
          expectUrl(
            `https://keplr-ideathon.vercel.app/verify?address=${keplr.account.address}`,
            "Check if the address is qualified"
          ),
          notarize(
            `https://keplr-ideathon.vercel.app/verify?address=${keplr.account.address}`,
            "GET",
            "Generate Proof of Keplr delegation",
            [
              {
                request: {
                  url_query_except: ["address"],
                },
              },
              {
                response: {
                  json_body_except: [
                    "bech32Address",
                    "hexAddress",
                    "delegationAmount",
                    "requiredAmount",
                    "isQualified",
                    "timestamp",
                  ],
                },
              },
            ]
          ),
        ],
      });

      const proof = await vlayer.proveWeb({
        address: PROVER_ADDRESS,
        proverAbi: PROVER_ABI,
        functionName: "proveSpecificTier",
        chainId: baseSepolia.id,
        args: [webProofRequest, keplr.account.address, BigInt(tierValue)],
      });

      setProof(proof);
    } catch (error) {
      console.error("Failed to call prover:", error);
      alert(
        `Failed to generate proof: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleVerifyProof = () => {
    alert("Proof verified successfully! 🎉");
  };

  const resetCard = () => {
    setStep("check");
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
            isGeneratingProof={isGeneratingProof || !!proof}
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

export default function OrbitRewardsCard() {
  return (
    <ProofGenerationProvider>
      <OrbitRewardsCardContent />
    </ProofGenerationProvider>
  );
}
