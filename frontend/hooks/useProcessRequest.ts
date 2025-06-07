"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { OrbitRewardsAbi } from "@/utils/abis";
import { OrbitRewardsAddress } from "@/utils/constants";
import { baseSepolia } from "viem/chains";

interface UseProcessRequestReturn {
  processRequest: (requestId: string) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  transactionHash: string | null;
  reset: () => void;
}

export function useProcessRequest(): UseProcessRequestReturn {
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const {
    writeContractAsync,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}` | undefined,
  });

  const processRequest = async (requestId: string) => {
    try {
      setError(null);
      setTransactionHash(null);

      const hash = await writeContractAsync({
        abi: OrbitRewardsAbi,
        address: OrbitRewardsAddress,
        functionName: "processRequest",
        args: [requestId as `0x${string}`],
        chainId: baseSepolia.id,
      });

      setTransactionHash(hash);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process request"
      );
      throw err;
    }
  };

  const reset = () => {
    setError(null);
    setTransactionHash(null);
    resetWrite();
  };

  return {
    processRequest,
    isLoading: isWritePending || isConfirming,
    isSuccess,
    error,
    transactionHash,
    reset,
  };
}
