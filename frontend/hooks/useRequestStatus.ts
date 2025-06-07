"use client";

import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_USER_REQUEST_STATUS,
  GET_USER_LATEST_REQUEST_STATUS,
  UserRequestStatus,
  getRequestStatusSummary,
  type LoyaltyVerificationRequested,
  type LoyaltyVerified,
} from "@/lib/graphql";

interface RequestStatusSummary {
  hasInitialQualification: boolean;
  totalRequests: number;
  totalFulfillments: number;
  hasPendingRequests: boolean;
  pendingRequests: LoyaltyVerificationRequested[];
  latestRequest: LoyaltyVerificationRequested | null;
  latestFulfillment: LoyaltyVerified | null;
}

interface UseRequestStatusReturn {
  data: UserRequestStatus | null;
  summary: RequestStatusSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRequestStatus(userAddress?: string): UseRequestStatusReturn {
  const { data, loading, error, refetch } = useQuery<UserRequestStatus>(
    GET_USER_REQUEST_STATUS,
    {
      variables: { userAddress: userAddress?.toLowerCase() },
      skip: !userAddress,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  const summary = data ? getRequestStatusSummary(data) : null;

  return {
    data: data || null,
    summary,
    isLoading: loading,
    error: error?.message || null,
    refetch,
  };
}

// Hook for checking latest status updates
export function useLatestRequestStatus(userAddress?: string) {
  const [getLatestStatus, { data, loading, error }] =
    useLazyQuery<UserRequestStatus>(GET_USER_LATEST_REQUEST_STATUS, {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    });

  const checkLatestStatus = () => {
    if (userAddress) {
      getLatestStatus({
        variables: { userAddress: userAddress.toLowerCase() },
      });
    }
  };

  return {
    data: data || null,
    isLoading: loading,
    error: error?.message || null,
    checkLatestStatus,
  };
}

// Hook for real-time monitoring with polling
export function useRequestStatusPolling(
  userAddress?: string,
  intervalMs: number = 30000,
  enabled: boolean = true
) {
  const { data, loading, error, refetch } = useQuery<UserRequestStatus>(
    GET_USER_REQUEST_STATUS,
    {
      variables: { userAddress: userAddress?.toLowerCase() },
      skip: !userAddress || !enabled,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      pollInterval: enabled ? intervalMs : 0,
    }
  );

  const summary = data ? getRequestStatusSummary(data) : null;

  return {
    data: data || null,
    summary,
    isLoading: loading,
    error: error?.message || null,
    refetch,
  };
}
