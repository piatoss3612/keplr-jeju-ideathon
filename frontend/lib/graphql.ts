import { gql } from "@apollo/client";

// GraphQL endpoint configuration moved to apollo.ts

export interface LoyaltyVerificationRequested {
  id: string;
  user: string;
  requestId: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface LoyaltyVerified {
  id: string;
  user: string;
  newTier: number;
  newAmount: string;
  boostPoints: string;
  currentScore: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface InitialQualificationClaimed {
  id: string;
  user: string;
  tokenId: string;
  tier: number;
  amount: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface RequestSent {
  id: string;
  internal_id: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface RequestFulfilled {
  id: string;
  internal_id: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface RequestProcessed {
  id: string;
  user: string;
  requestId: string;
  isVerification: boolean;
  blockTimestamp: string;
  transactionHash: string;
}

export interface UserRequestStatus {
  requestSents?: RequestSent[];
  requestFulfilleds?: RequestFulfilled[];
  requestProcesseds?: RequestProcessed[];
  loyaltyVerifieds?: LoyaltyVerified[];
  initialQualificationClaimeds?: InitialQualificationClaimed[];
}

// GraphQL 쿼리들
export const GET_USER_REQUEST_STATUS = gql`
  query GetUserRequestStatus($userAddress: String!) {
    # 모든 RequestSent 이벤트들 (초기 등록 + loyalty 갱신 모두 포함)
    requestSents(orderBy: blockTimestamp, orderDirection: desc, first: 100) {
      id
      internal_id
      blockTimestamp
      transactionHash
    }

    # 모든 RequestFulfilled 이벤트들
    requestFulfilleds(
      orderBy: blockTimestamp
      orderDirection: desc
      first: 100
    ) {
      id
      internal_id
      blockTimestamp
      transactionHash
    }

    # 사용자별 처리된 요청들
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

    # 사용자별 최종 검증 완료
    loyaltyVerifieds(
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      newTier
      newAmount
      boostPoints
      currentScore
      blockTimestamp
      transactionHash
    }

    # 초기 등록 확인용
    initialQualificationClaimeds(
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      tokenId
      tier
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

// 이제 GET_USER_REQUEST_STATUS 하나만 사용합니다!

// 유틸리티 함수들
export function hasRequestBeenFulfilled(
  requests: LoyaltyVerificationRequested[] | undefined,
  fulfillments: LoyaltyVerified[] | undefined
): boolean {
  const safeRequests = requests || [];
  const safeFulfillments = fulfillments || [];

  if (safeRequests.length === 0) return false;
  if (safeFulfillments.length === 0) return false;

  const latestRequest = safeRequests[0];
  const latestFulfillment = safeFulfillments[0];

  // 최근 fulfillment가 최근 request보다 나중인지 확인
  return (
    parseInt(latestFulfillment.blockTimestamp) >
    parseInt(latestRequest.blockTimestamp)
  );
}

export function getPendingRequests(
  requests: LoyaltyVerificationRequested[] | undefined,
  fulfillments: LoyaltyVerified[] | undefined
): LoyaltyVerificationRequested[] {
  const safeRequests = requests || [];
  const safeFulfillments = fulfillments || [];

  return safeRequests.filter((request) => {
    // 이 request보다 나중에 fulfill된 것이 있는지 확인
    const hasLaterFulfillment = safeFulfillments.some(
      (fulfillment) =>
        parseInt(fulfillment.blockTimestamp) > parseInt(request.blockTimestamp)
    );
    return !hasLaterFulfillment;
  });
}

// 1. Pending: LoyaltyVerificationRequested가 RequestSent에 있지만 RequestFulfilled에 없는 요청들
export function getPendingRequestsSentNotFulfilled(
  userRequests: LoyaltyVerificationRequested[] | undefined,
  sentRequests: RequestSent[] | undefined,
  fulfilledRequests: RequestFulfilled[] | undefined
): LoyaltyVerificationRequested[] {
  const safeUserRequests = userRequests || [];
  const safeSentRequests = sentRequests || [];
  const safeFulfilledRequests = fulfilledRequests || [];

  return safeUserRequests.filter((request) => {
    // 이 요청이 sent 되었는지 확인
    const isSent = safeSentRequests.some(
      (sent) => sent.internal_id === request.requestId
    );

    // 이 요청이 fulfilled 되었는지 확인
    const isFulfilled = safeFulfilledRequests.some(
      (fulfilled) => fulfilled.internal_id === request.requestId
    );

    return isSent && !isFulfilled;
  });
}

// 2. Ready to Process: RequestFulfilled에 있지만 RequestProcessed에 없는 요청들
export function getReadyToProcessRequestsFulfilledNotProcessed(
  userRequests: LoyaltyVerificationRequested[] | undefined,
  fulfilledRequests: RequestFulfilled[] | undefined,
  processedRequests: RequestProcessed[] | undefined
): LoyaltyVerificationRequested[] {
  const safeUserRequests = userRequests || [];
  const safeFulfilledRequests = fulfilledRequests || [];
  const safeProcessedRequests = processedRequests || [];

  return safeUserRequests.filter((request) => {
    // 이 요청이 fulfilled 되었는지 확인
    const isFulfilled = safeFulfilledRequests.some(
      (fulfilled) => fulfilled.internal_id === request.requestId
    );

    // 이 요청이 이미 처리되었는지 확인
    const isProcessed = safeProcessedRequests.some(
      (processed) => processed.requestId === request.requestId
    );

    return isFulfilled && !isProcessed;
  });
}

// 기존 유틸리티 - 호환성 유지
export function getReadyToProcessRequests(
  userRequests: LoyaltyVerificationRequested[] | undefined,
  fulfilledRequests: RequestFulfilled[] | undefined,
  processedRequests: RequestProcessed[] | undefined
): LoyaltyVerificationRequested[] {
  return getReadyToProcessRequestsFulfilledNotProcessed(
    userRequests,
    fulfilledRequests,
    processedRequests
  );
}

export function getRequestStatusSummary(data: UserRequestStatus) {
  const {
    requestSents,
    requestFulfilleds,
    requestProcesseds,
    loyaltyVerifieds,
    initialQualificationClaimeds,
  } = data;

  // 안전한 배열 접근을 위한 기본값 설정
  const safeSents = requestSents || [];
  const safeFulfilleds = requestFulfilleds || [];
  const safeProcessed = requestProcesseds || [];
  const safeVerifieds = loyaltyVerifieds || [];
  const safeInitialClaims = initialQualificationClaimeds || [];

  // RequestSents 중심의 간단한 3단계 처리 로직
  // 1. Pending: RequestSents but not RequestFulfilled
  const pendingRequests = safeSents.filter((sentRequest) => {
    const isFulfilled = safeFulfilleds.some(
      (fulfilled) => fulfilled.internal_id === sentRequest.internal_id
    );
    return !isFulfilled;
  });

  // 2. Ready to Process: RequestFulfilled but not RequestProcessed
  const readyToProcessRequests = safeSents.filter((sentRequest) => {
    const isFulfilled = safeFulfilleds.some(
      (fulfilled) => fulfilled.internal_id === sentRequest.internal_id
    );
    const isProcessed = safeProcessed.some(
      (processed) => processed.requestId === sentRequest.internal_id
    );
    return isFulfilled && !isProcessed;
  });

  return {
    hasInitialQualification: safeInitialClaims.length > 0,
    totalRequests: safeSents.length,
    totalFulfillments: safeFulfilleds.length,
    totalProcessed: safeProcessed.length,
    totalVerified: safeVerifieds.length,
    hasPendingRequests: pendingRequests.length > 0,
    hasReadyToProcessRequests: readyToProcessRequests.length > 0,
    pendingRequests: pendingRequests,
    readyToProcessRequests: readyToProcessRequests,
    completedRequests: safeProcessed,
    latestSent: safeSents[0] || null,
    latestFulfillment: safeFulfilleds[0] || null,
    latestProcessed: safeProcessed[0] || null,
    latestVerified: safeVerifieds[0] || null,
  };
}
