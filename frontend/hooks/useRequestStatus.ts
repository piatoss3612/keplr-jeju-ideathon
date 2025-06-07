"use client";

import { useQuery } from "@apollo/client";
import {
  GET_USER_REQUEST_STATUS,
  UserRequestStatus,
  getRequestStatusSummary,
  type LoyaltyVerified,
  type RequestSent,
  type RequestFulfilled,
  type RequestProcessed,
} from "@/lib/graphql";

interface RequestStatusSummary {
  hasInitialQualification: boolean;
  totalRequests: number;
  totalFulfillments: number;
  totalProcessed: number;
  totalVerified: number;
  hasPendingRequests: boolean;
  hasReadyToProcessRequests: boolean;
  pendingRequests: RequestSent[];
  readyToProcessRequests: RequestSent[];
  completedRequests: RequestProcessed[];
  latestSent: RequestSent | null;
  latestFulfillment: RequestFulfilled | null;
  latestProcessed: RequestProcessed | null;
  latestVerified: LoyaltyVerified | null;
}

interface UseRequestStatusOptions {
  polling?: boolean;
  pollInterval?: number;
  fetchPolicy?: "cache-first" | "cache-and-network" | "network-only";
}

interface UseRequestStatusReturn {
  data: UserRequestStatus | null;
  summary: RequestStatusSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  // 편의 속성들
  readyToProcessRequests: RequestSent[];
  hasReadyToProcess: boolean;
}

export function useRequestStatus(
  userAddress?: string,
  options: UseRequestStatusOptions = {}
): UseRequestStatusReturn {
  const {
    polling = false,
    pollInterval = 10000,
    fetchPolicy = "cache-and-network",
  } = options;

  const { data, loading, error, refetch } = useQuery<UserRequestStatus>(
    GET_USER_REQUEST_STATUS,
    {
      variables: { userAddress: userAddress?.toLowerCase() },
      skip: !userAddress,
      errorPolicy: "all",
      fetchPolicy,
      pollInterval: polling ? pollInterval : 0,
    }
  );

  const summary = data ? getRequestStatusSummary(data) : null;

  return {
    data: data || null,
    summary,
    isLoading: loading,
    error: error?.message || null,
    refetch,
    // 편의 속성들
    readyToProcessRequests: summary?.readyToProcessRequests || [],
    hasReadyToProcess: summary?.hasReadyToProcessRequests || false,
  };
}

// 편의 함수들 - 같은 useRequestStatus를 다른 옵션으로 사용
export const useRequestStatusPolling = (
  userAddress?: string,
  intervalMs: number = 10000
) =>
  useRequestStatus(userAddress, {
    polling: true,
    pollInterval: intervalMs,
    fetchPolicy: "cache-and-network",
  });

export const usePendingRequests = (userAddress?: string) =>
  useRequestStatus(userAddress, { fetchPolicy: "cache-and-network" });
