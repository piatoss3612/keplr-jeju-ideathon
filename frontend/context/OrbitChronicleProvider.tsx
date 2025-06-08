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
import { OrbitChronicleAbi } from "@/utils/abis";
import { OrbitChronicleAddress } from "@/utils/constants";
import {
  useOrbitChronicleData,
  triggerOrbitDataRefresh,
} from "@/hooks/useOrbitChronicleData";

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

// OrbitChronicleContext interface
interface OrbitChronicleContextType {
  // Eligibility state
  eligibilityData: EligibilityData | null;
  setEligibilityData: (data: EligibilityData | null) => void;
  errorData: ErrorData | null;
  setErrorData: (error: ErrorData | null) => void;
  isChecking: boolean;
  setIsChecking: (checking: boolean) => void;

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
  clearAll: () => void;

  // Helper functions
  isEligible: boolean;
  canRegister: boolean;
  canUpdate: boolean;
  getCurrentTierValue: () => number | null;
}

const OrbitChronicleContext = createContext<
  OrbitChronicleContextType | undefined
>(undefined);

interface OrbitChronicleProviderProps {
  children: ReactNode;
}

export function OrbitChronicleProvider({
  children,
}: OrbitChronicleProviderProps) {
  const { address } = useAccount();
  const orbitData = useOrbitChronicleData();

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
      // Trigger OrbitChronicleData refresh after successful transaction
      triggerOrbitDataRefresh();
    }
  }, [isTransactionSuccess, writeData]);

  React.useEffect(() => {
    if (isTransactionError) {
      setRegistrationStep("error");
      setErrorData({
        error: "Transaction Failed",
        message: "The blockchain transaction failed. Please try again.",
      });
    }
  }, [isTransactionError]);

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

        // Use orbitData to check if user already has NFT
        const hasNFT = orbitData.hasNFT;

        if (hasNFT) {
          // User has NFT, call loyalty verification
          await writeContractAsync({
            address: OrbitChronicleAddress,
            abi: OrbitChronicleAbi,
            functionName: "requestLoyaltyVerification",
            args: [bech32Address],
          });
        } else {
          // User doesn't have NFT, call delegation tier registration
          await writeContractAsync({
            address: OrbitChronicleAddress,
            abi: OrbitChronicleAbi,
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
    [address, orbitData.hasNFT, writeContractAsync]
  );

  const clearAll = useCallback(() => {
    setEligibilityData(null);
    setErrorData(null);
    setIsChecking(false);
    setRegistrationStep("check");
    setRegistrationHash(null);
  }, []);

  // EVM 계정 변경 감지 및 데이터 초기화
  const [previousAddress, setPreviousAddress] = React.useState<
    string | undefined
  >(address);

  React.useEffect(() => {
    if (previousAddress && address && previousAddress !== address) {
      console.log("EVM account changed - clearing OrbitRewards data");
      clearAll();
    }
    setPreviousAddress(address);
  }, [address, previousAddress, clearAll]);

  // Keplr 계정 변경 감지 및 데이터 초기화
  React.useEffect(() => {
    const handleAccountChange = () => {
      console.log("Keplr account changed - clearing OrbitRewards data");
      clearAll();
    };

    window.addEventListener("keplr-account-changed", handleAccountChange);

    return () => {
      window.removeEventListener("keplr-account-changed", handleAccountChange);
    };
  }, [clearAll]);

  // Helper computed values - now using orbitData instead of userStatus
  const isEligible = eligibilityData?.isQualified || false;
  const canRegister = isEligible && !orbitData.hasNFT;
  const canUpdate = isEligible && orbitData.hasNFT && orbitData.scoreActive;

  const getCurrentTierValue = useCallback((): number | null => {
    if (!tierInfo) return null;
    return tierInfo.currentTier;
  }, [tierInfo]);

  const value: OrbitChronicleContextType = {
    // Eligibility state
    eligibilityData,
    setEligibilityData,
    errorData,
    setErrorData,
    isChecking,
    setIsChecking,

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
    clearAll,

    // Helper functions
    isEligible,
    canRegister,
    canUpdate,
    getCurrentTierValue,
  };

  return (
    <OrbitChronicleContext.Provider value={value}>
      {children}
    </OrbitChronicleContext.Provider>
  );
}

export function useOrbitChronicle() {
  const context = useContext(OrbitChronicleContext);
  if (context === undefined) {
    throw new Error(
      "useOrbitChronicle must be used within a OrbitChronicleProvider"
    );
  }
  return context;
}
