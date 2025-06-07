"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  DelegationTier,
  getTierForAmount,
  getTierName,
  getTierEmoji,
  getTierColorClass,
  getNextTierInfo,
} from "../app/utils/tierUtils";
import { ProofEnv, ProofProvider } from "@vlayer/react";

// EligibilityData interface
export interface EligibilityData {
  bech32Address: string;
  hexAddress: string;
  delegationAmount: string;
  requiredAmount: string;
  isQualified: boolean;
  timestamp: string;
}

// ErrorData interface
export interface ErrorData {
  error: string;
  message: string;
}

// Tier information derived from eligibility data
export interface TierInfo {
  currentTier: DelegationTier;
  tierName: string;
  tierEmoji: string;
  tierColorClass: string;
  nextTier: DelegationTier | null;
  requiredAmount: number | null;
  remainingAmount: number | null;
}

// ProofGenerationContext interface
interface ProofGenerationContextType {
  // Eligibility state
  eligibilityData: EligibilityData | null;
  setEligibilityData: (data: EligibilityData | null) => void;
  errorData: ErrorData | null;
  setErrorData: (error: ErrorData | null) => void;
  isChecking: boolean;
  setIsChecking: (checking: boolean) => void;

  // Computed tier information
  tierInfo: TierInfo | null;

  // Helper functions
  clearAll: () => void;
  isEligible: boolean;
  getCurrentTierValue: () => number | null; // For callProver targetTier parameter
}

const ProofGenerationContext = createContext<
  ProofGenerationContextType | undefined
>(undefined);

interface ProofGenerationProviderProps {
  children: ReactNode;
}

export function ProofGenerationProvider({
  children,
}: ProofGenerationProviderProps) {
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Compute tier information from eligibility data
  const tierInfo: TierInfo | null = React.useMemo(() => {
    if (!eligibilityData) return null;

    try {
      const currentTier = getTierForAmount(eligibilityData.delegationAmount);
      const tierName = getTierName(currentTier);
      const tierEmoji = getTierEmoji(currentTier);
      const tierColorClass = getTierColorClass(currentTier);
      const nextTierInfo = getNextTierInfo(eligibilityData.delegationAmount);

      return {
        currentTier,
        tierName,
        tierEmoji,
        tierColorClass,
        nextTier: nextTierInfo.nextTier,
        requiredAmount: nextTierInfo.requiredAmount,
        remainingAmount: nextTierInfo.remainingAmount,
      };
    } catch {
      return null;
    }
  }, [eligibilityData]);

  const clearAll = () => {
    setEligibilityData(null);
    setErrorData(null);
    setIsChecking(false);
  };

  const isEligible = eligibilityData?.isQualified || false;

  const getCurrentTierValue = (): number | null => {
    if (!tierInfo) return null;
    return tierInfo.currentTier;
  };

  const value: ProofGenerationContextType = {
    eligibilityData,
    setEligibilityData,
    errorData,
    setErrorData,
    isChecking,
    setIsChecking,
    tierInfo,
    clearAll,
    isEligible,
    getCurrentTierValue,
  };

  return (
    <ProofProvider config={{ env: ProofEnv.DEV }}>
      <ProofGenerationContext.Provider value={value}>
        {children}
      </ProofGenerationContext.Provider>
    </ProofProvider>
  );
}

export function useProofGeneration() {
  const context = useContext(ProofGenerationContext);
  if (context === undefined) {
    throw new Error(
      "useProofGeneration must be used within a ProofGenerationProvider"
    );
  }
  return context;
}
