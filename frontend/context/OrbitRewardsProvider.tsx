"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  DelegationTier,
  getTierForAmount,
  getTierName,
  getTierEmoji,
  getTierColorClass,
  getNextTierInfo,
} from "@/utils/tierUtils";
import { OrbitRewardsAbi } from "@/utils/abis";
import { OrbitRewardsAddress } from "@/utils/constants";

// EligibilityData interface (reuse from existing)
export interface EligibilityData {
  bech32Address: string;
  hexAddress: string;
  delegationAmount: string;
  requiredAmount: string;
  isQualified: boolean;
  timestamp: string;
}

// ErrorData interface (reuse from existing)
export interface ErrorData {
  error: string;
  message: string;
}

// User Status from contract
export interface UserStatus {
  hasUserNFT: boolean;
  tokenId: bigint;
  tier: DelegationTier;
  amount: bigint;
  currentScore: bigint;
  boostPoints: bigint;
  scoreActive: boolean;
  nextVerificationTime: bigint;
  verificationCount: bigint;
  seasonPoints: bigint;
  seasonMilestones: bigint;
  seasonsCompleted: bigint;
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

// Registration steps
export type RegistrationStep =
  | "check"
  | "register"
  | "waiting"
  | "success"
  | "error";

// OrbitRewardsContext interface
interface OrbitRewardsContextType {
  // Eligibility state
  eligibilityData: EligibilityData | null;
  setEligibilityData: (data: EligibilityData | null) => void;
  errorData: ErrorData | null;
  setErrorData: (error: ErrorData | null) => void;
  isChecking: boolean;
  setIsChecking: (checking: boolean) => void;

  // Contract state
  userStatus: UserStatus | null;
  isLoadingStatus: boolean;

  // Registration state
  registrationStep: RegistrationStep;
  setRegistrationStep: (step: RegistrationStep) => void;
  isRegistering: boolean;
  registrationHash: string | null;

  // Computed tier information
  tierInfo: TierInfo | null;

  // Actions
  checkEligibility: (keplrAddress: string) => Promise<void>;
  registerOrUpdate: (bech32Address: string) => Promise<void>;
  refreshUserStatus: () => Promise<void>;
  clearAll: () => void;

  // Helper functions
  isEligible: boolean;
  canRegister: boolean;
  canUpdate: boolean;
  getCurrentTierValue: () => number | null;
}

const OrbitRewardsContext = createContext<OrbitRewardsContextType | undefined>(
  undefined
);

interface OrbitRewardsProviderProps {
  children: ReactNode;
}

export function OrbitRewardsProvider({ children }: OrbitRewardsProviderProps) {
  const { address } = useAccount();

  // Eligibility state
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Registration state
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("check");
  const [registrationHash, setRegistrationHash] = useState<string | null>(null);

  // Contract hooks
  const {
    writeContractAsync,
    isPending: isRegistering,
    data: writeData,
  } = useWriteContract();

  const {
    data: userStatusData,
    isLoading: isLoadingStatus,
    refetch: refetchUserStatus,
  } = useReadContract({
    address: OrbitRewardsAddress,
    abi: OrbitRewardsAbi,
    functionName: "getUserStatus",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: hasNFTData, refetch: refetchHasNFT } = useReadContract({
    address: OrbitRewardsAddress,
    abi: OrbitRewardsAbi,
    functionName: "hasNFT",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Wait for transaction receipt
  const {
    isLoading: isWaitingForReceipt,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Handle transaction success/error
  React.useEffect(() => {
    if (isTransactionSuccess && writeData) {
      setRegistrationStep("success");
      setRegistrationHash(writeData);
      // Refresh user status after successful transaction
      setTimeout(() => {
        refetchUserStatus();
        refetchHasNFT();
      }, 2000);
    }
  }, [isTransactionSuccess, writeData, refetchUserStatus, refetchHasNFT]);

  React.useEffect(() => {
    if (isTransactionError) {
      setRegistrationStep("error");
      setErrorData({
        error: "Transaction Failed",
        message: "The blockchain transaction failed. Please try again.",
      });
    }
  }, [isTransactionError]);

  // Parse user status
  const userStatus: UserStatus | null = React.useMemo(() => {
    if (!userStatusData || !Array.isArray(userStatusData)) return null;

    const [
      hasUserNFT,
      tokenId,
      tier,
      amount,
      currentScore,
      boostPoints,
      scoreActive,
      nextVerificationTime,
      verificationCount,
      seasonPoints,
      seasonMilestones,
      seasonsCompleted,
    ] = userStatusData;

    return {
      hasUserNFT,
      tokenId,
      tier: tier as DelegationTier,
      amount,
      currentScore,
      boostPoints,
      scoreActive,
      nextVerificationTime,
      verificationCount,
      seasonPoints,
      seasonMilestones,
      seasonsCompleted,
    };
  }, [userStatusData]);

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

  // Actions
  const checkEligibility = useCallback(async (keplrAddress: string) => {
    try {
      setIsChecking(true);
      setErrorData(null);

      const response = await fetch(
        `https://keplr-ideathon.vercel.app/verify?address=${keplrAddress}`
      );

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorData;
        setErrorData(errorData);
        return;
      }

      const data = (await response.json()) as EligibilityData;
      setEligibilityData(data);

      if (data.isQualified) {
        setRegistrationStep("register");
      }
    } catch (error) {
      console.error(error);
      setErrorData({
        error: "Network Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to connect to verification service",
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  const registerOrUpdate = useCallback(
    async (bech32Address: string) => {
      if (!address) {
        setErrorData({
          error: "Wallet Not Connected",
          message: "Please connect your wallet first",
        });
        return;
      }

      try {
        setRegistrationStep("waiting");
        setErrorData(null);

        // Check if user already has NFT
        const hasNFT = Boolean(hasNFTData);

        if (hasNFT) {
          // User has NFT, call loyalty verification
          await writeContractAsync({
            address: OrbitRewardsAddress,
            abi: OrbitRewardsAbi,
            functionName: "requestLoyaltyVerification",
            args: [bech32Address],
          });
        } else {
          // User doesn't have NFT, call delegation tier registration
          await writeContractAsync({
            address: OrbitRewardsAddress,
            abi: OrbitRewardsAbi,
            functionName: "requestDelegationTier",
            args: [bech32Address],
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setRegistrationStep("error");
        setErrorData({
          error: "Registration Failed",
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    },
    [address, hasNFTData, writeContractAsync]
  );

  const refreshUserStatus = useCallback(async () => {
    await refetchUserStatus();
    await refetchHasNFT();
  }, [refetchUserStatus, refetchHasNFT]);

  const clearAll = useCallback(() => {
    setEligibilityData(null);
    setErrorData(null);
    setIsChecking(false);
    setRegistrationStep("check");
    setRegistrationHash(null);
  }, []);

  // Helper computed values
  const isEligible = eligibilityData?.isQualified || false;
  const canRegister = isEligible && !userStatus?.hasUserNFT;
  const canUpdate =
    isEligible &&
    Boolean(userStatus?.hasUserNFT) &&
    Boolean(userStatus?.scoreActive);

  const getCurrentTierValue = useCallback((): number | null => {
    if (!tierInfo) return null;
    return tierInfo.currentTier;
  }, [tierInfo]);

  const value: OrbitRewardsContextType = {
    // Eligibility state
    eligibilityData,
    setEligibilityData,
    errorData,
    setErrorData,
    isChecking,
    setIsChecking,

    // Contract state
    userStatus,
    isLoadingStatus,

    // Registration state
    registrationStep,
    setRegistrationStep,
    isRegistering: isRegistering || isWaitingForReceipt,
    registrationHash,

    // Computed tier information
    tierInfo,

    // Actions
    checkEligibility,
    registerOrUpdate,
    refreshUserStatus,
    clearAll,

    // Helper functions
    isEligible,
    canRegister,
    canUpdate,
    getCurrentTierValue,
  };

  return (
    <OrbitRewardsContext.Provider value={value}>
      {children}
    </OrbitRewardsContext.Provider>
  );
}

export function useOrbitRewards() {
  const context = useContext(OrbitRewardsContext);
  if (context === undefined) {
    throw new Error(
      "useOrbitRewards must be used within a OrbitRewardsProvider"
    );
  }
  return context;
}
