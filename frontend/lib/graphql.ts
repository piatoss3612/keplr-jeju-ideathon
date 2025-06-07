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

export interface UserRequestStatus {
  loyaltyVerificationRequesteds: LoyaltyVerificationRequested[];
  loyaltyVerifieds: LoyaltyVerified[];
  initialQualificationClaimeds: InitialQualificationClaimed[];
}

import { gql } from "@apollo/client";

// GraphQL 쿼리들
export const GET_USER_REQUEST_STATUS = gql`
  query GetUserRequestStatus($userAddress: String!) {
    loyaltyVerificationRequesteds(
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      requestId
      blockTimestamp
      transactionHash
    }

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

export const GET_USER_LATEST_REQUEST_STATUS = gql`
  query GetUserLatestRequestStatus($userAddress: String!) {
    loyaltyVerificationRequesteds(
      first: 1
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      requestId
      blockTimestamp
      transactionHash
    }

    loyaltyVerifieds(
      first: 1
      where: { user: $userAddress }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      newTier
      newAmount
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_USER_REQUESTS_AFTER_TIME = gql`
  query GetUserRequestsAfterTime($userAddress: String!, $timestamp: String!) {
    loyaltyVerificationRequesteds(
      where: { user: $userAddress, blockTimestamp_gte: $timestamp }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      requestId
      blockTimestamp
      transactionHash
    }

    loyaltyVerifieds(
      where: { user: $userAddress, blockTimestamp_gte: $timestamp }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      user
      newTier
      newAmount
      blockTimestamp
      transactionHash
    }
  }
`;

// 유틸리티 함수들
export function hasRequestBeenFulfilled(
  requests: LoyaltyVerificationRequested[],
  fulfillments: LoyaltyVerified[]
): boolean {
  if (requests.length === 0) return false;
  if (fulfillments.length === 0) return false;

  const latestRequest = requests[0];
  const latestFulfillment = fulfillments[0];

  // 최근 fulfillment가 최근 request보다 나중인지 확인
  return (
    parseInt(latestFulfillment.blockTimestamp) >
    parseInt(latestRequest.blockTimestamp)
  );
}

export function getPendingRequests(
  requests: LoyaltyVerificationRequested[],
  fulfillments: LoyaltyVerified[]
): LoyaltyVerificationRequested[] {
  return requests.filter((request) => {
    // 이 request보다 나중에 fulfill된 것이 있는지 확인
    const hasLaterFulfillment = fulfillments.some(
      (fulfillment) =>
        parseInt(fulfillment.blockTimestamp) > parseInt(request.blockTimestamp)
    );
    return !hasLaterFulfillment;
  });
}

export function getRequestStatusSummary(data: UserRequestStatus) {
  const {
    loyaltyVerificationRequesteds,
    loyaltyVerifieds,
    initialQualificationClaimeds,
  } = data;

  return {
    hasInitialQualification: initialQualificationClaimeds.length > 0,
    totalRequests: loyaltyVerificationRequesteds.length,
    totalFulfillments: loyaltyVerifieds.length,
    hasPendingRequests: !hasRequestBeenFulfilled(
      loyaltyVerificationRequesteds,
      loyaltyVerifieds
    ),
    pendingRequests: getPendingRequests(
      loyaltyVerificationRequesteds,
      loyaltyVerifieds
    ),
    latestRequest: loyaltyVerificationRequesteds[0] || null,
    latestFulfillment: loyaltyVerifieds[0] || null,
  };
}
