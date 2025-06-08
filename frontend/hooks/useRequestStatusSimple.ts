"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// 사용자별 요청 상태를 위한 인터페이스
export interface UserRequestStats {
  totalRequests: number;
  pendingCount: number;
  verifiedCount: number;
  readyToProcessCount: number;
  readyToProcessRequests: UserRequestSent[];
  pendingRequests: UserRequestSent[];
}

// 타입 정의
interface UserRequestSent {
  id: string;
  user: string;
  requestId: string;
  isVerification: boolean;
  blockTimestamp: string;
  transactionHash: string;
}

interface RequestFulfilled {
  id: string;
  internal_id: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface RequestProcessed {
  id: string;
  user: string;
  requestId: string;
  isVerification: boolean;
  blockTimestamp: string;
  transactionHash: string;
}

// 사용자별 요청 상태를 정확히 추적하기 위한 쿼리
const GET_USER_SPECIFIC_REQUESTS = gql`
  query GetUserSpecificRequests($userAddress: String!) {
    # 1. 사용자가 시작한 모든 요청들 (UserRequestSent)
    userRequestSents(
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      requestId
      isVerification
      blockTimestamp
      transactionHash
    }

    # 2. 모든 RequestFulfilled (체인링크 처리 완료)
    requestFulfilleds(
      orderBy: blockTimestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      internal_id
      blockTimestamp
      transactionHash
    }

    # 3. 사용자별 처리 완료 요청들 (사용자가 process 버튼 눌러서 처리한 것들)
    requestProcesseds(
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      requestId
      isVerification
      blockTimestamp
      transactionHash
    }
  }
`;

interface UseRequestStatusSimpleReturn {
  stats: UserRequestStats;
  isLoading: boolean;
  error?: string;
  refetch: () => void;
  isRefetching: boolean;
}

export function useRequestStatusSimple(
  userAddress?: string
): UseRequestStatusSimpleReturn {
  const { data, loading, error, refetch } = useQuery(
    GET_USER_SPECIFIC_REQUESTS,
    {
      variables: { userAddress: userAddress?.toLowerCase() },
      skip: !userAddress,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  // 기본 통계
  const defaultStats: UserRequestStats = {
    totalRequests: 0,
    pendingCount: 0,
    verifiedCount: 0,
    readyToProcessCount: 0,
    readyToProcessRequests: [],
    pendingRequests: [],
  };

  const handleRefetch = () => {
    refetch();
  };

  if (loading || error || !data) {
    return {
      stats: defaultStats,
      isLoading: loading,
      error: error?.message,
      refetch: handleRefetch,
      isRefetching: false,
    };
  }

  const {
    userRequestSents = [],
    requestFulfilleds = [],
    requestProcesseds = [],
  } = data;

  // 타입 캐스팅
  const typedUserRequests = userRequestSents as UserRequestSent[];
  const typedFulfilleds = requestFulfilleds as RequestFulfilled[];
  const typedProcesseds = requestProcesseds as RequestProcessed[];

  // 1. fulfilled된 요청 ID들
  const fulfilledRequestIds = new Set(
    typedFulfilleds.map((req) => req.internal_id)
  );

  // 2. processed된 요청 ID들
  const processedRequestIds = new Set(
    typedProcesseds.map((req) => req.requestId)
  );

  // 계산
  // Total: 사용자가 시작한 전체 요청 수
  const totalRequests = typedUserRequests.length;

  // Pending: UserRequestSent는 있지만 RequestFulfilled가 없는 것들 (체인링크 대기)
  const pendingRequests = typedUserRequests.filter(
    (userReq) => !fulfilledRequestIds.has(userReq.requestId)
  );

  // Ready to Process: UserRequestSent가 있고 RequestFulfilled도 있지만 RequestProcessed가 없는 것들 (사용자 액션 대기)
  const readyToProcessRequests = typedUserRequests.filter(
    (userReq) =>
      fulfilledRequestIds.has(userReq.requestId) &&
      !processedRequestIds.has(userReq.requestId)
  );

  // Verified: requestProcesseds 수 (사용자가 최종 처리 완료)
  const verifiedCount = typedProcesseds.length;

  const stats: UserRequestStats = {
    totalRequests,
    pendingCount: pendingRequests.length,
    verifiedCount,
    readyToProcessCount: readyToProcessRequests.length,
    readyToProcessRequests,
    pendingRequests,
  };

  return {
    stats,
    isLoading: false,
    error: undefined,
    refetch: handleRefetch,
    isRefetching: loading,
  };
}
