"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// 사용자별 요청 상태를 위한 인터페이스
export interface UserRequestStats {
  totalRequests: number;
  pendingCount: number;
  verifiedCount: number;
  readyToProcessCount: number;
}

// 타입 정의
interface RequestSent {
  id: string;
  internal_id: string;
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
    # 1. 모든 RequestSent (전체 시스템에서 가져와서 사용자 것만 필터링)
    requestSents(orderBy: blockTimestamp, orderDirection: desc, first: 1000) {
      id
      internal_id
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
    requestSents = [],
    requestFulfilleds = [],
    requestProcesseds = [],
  } = data;

  // 타입 캐스팅
  const typedSents = requestSents as RequestSent[];
  const typedFulfilleds = requestFulfilleds as RequestFulfilled[];
  const typedProcesseds = requestProcesseds as RequestProcessed[];

  // 1. 사용자의 requestProcesseds에서 requestId들 추출 (사용자가 관련된 요청들)
  const userRequestIds = new Set(typedProcesseds.map((req) => req.requestId));

  // 2. 사용자와 관련된 requestSents만 필터링 (Total)
  const userSentRequests = typedSents.filter((sent) =>
    userRequestIds.has(sent.internal_id)
  );

  // 3. fulfilled된 요청 ID들
  const fulfilledRequestIds = new Set(
    typedFulfilleds.map((req) => req.internal_id)
  );

  // 4. processed된 요청 ID들
  const processedRequestIds = new Set(
    typedProcesseds.map((req) => req.requestId)
  );

  // 계산
  // Total: 사용자의 전체 요청 수
  const totalRequests = userSentRequests.length;

  // Pending: requestSents 중에서 requestFulfilleds에 없는 것들 (체인링크 대기)
  const pendingRequests = userSentRequests.filter(
    (sent) => !fulfilledRequestIds.has(sent.internal_id)
  );

  // Ready to Process: requestFulfilleds 중에서 requestProcesseds에 없는 것들 (사용자 액션 대기)
  const readyToProcessRequests = userSentRequests.filter(
    (sent) =>
      fulfilledRequestIds.has(sent.internal_id) &&
      !processedRequestIds.has(sent.internal_id)
  );

  // Verified: requestProcesseds 수 (사용자가 최종 처리 완료)
  const verifiedCount = typedProcesseds.length;

  const stats: UserRequestStats = {
    totalRequests,
    pendingCount: pendingRequests.length,
    verifiedCount,
    readyToProcessCount: readyToProcessRequests.length,
  };

  return {
    stats,
    isLoading: false,
    error: undefined,
    refetch: handleRefetch,
    isRefetching: loading,
  };
}
