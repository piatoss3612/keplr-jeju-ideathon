import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  InitialQualificationClaimed,
  LoyaltyVerificationRequested,
  LoyaltyVerified,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestFulfilled,
  RequestProcessed,
  RequestSent,
  ScoreCalculated,
  ScoreExpired,
  SeasonEnded,
  SeasonMilestoneReached,
  SeasonRewardClaimed,
  SeasonStarted
} from "../generated/OrbitRewards/OrbitRewards"

export function createInitialQualificationClaimedEvent(
  user: Address,
  tokenId: BigInt,
  tier: i32,
  amount: BigInt
): InitialQualificationClaimed {
  let initialQualificationClaimedEvent =
    changetype<InitialQualificationClaimed>(newMockEvent())

  initialQualificationClaimedEvent.parameters = new Array()

  initialQualificationClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  initialQualificationClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  initialQualificationClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tier",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tier))
    )
  )
  initialQualificationClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return initialQualificationClaimedEvent
}

export function createLoyaltyVerificationRequestedEvent(
  user: Address,
  requestId: Bytes
): LoyaltyVerificationRequested {
  let loyaltyVerificationRequestedEvent =
    changetype<LoyaltyVerificationRequested>(newMockEvent())

  loyaltyVerificationRequestedEvent.parameters = new Array()

  loyaltyVerificationRequestedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  loyaltyVerificationRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )

  return loyaltyVerificationRequestedEvent
}

export function createLoyaltyVerifiedEvent(
  user: Address,
  newTier: i32,
  newAmount: BigInt,
  boostPoints: BigInt,
  currentScore: BigInt
): LoyaltyVerified {
  let loyaltyVerifiedEvent = changetype<LoyaltyVerified>(newMockEvent())

  loyaltyVerifiedEvent.parameters = new Array()

  loyaltyVerifiedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  loyaltyVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "newTier",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newTier))
    )
  )
  loyaltyVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "newAmount",
      ethereum.Value.fromUnsignedBigInt(newAmount)
    )
  )
  loyaltyVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "boostPoints",
      ethereum.Value.fromUnsignedBigInt(boostPoints)
    )
  )
  loyaltyVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "currentScore",
      ethereum.Value.fromUnsignedBigInt(currentScore)
    )
  )

  return loyaltyVerifiedEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent =
    changetype<OwnershipTransferRequested>(newMockEvent())

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestProcessedEvent(
  user: Address,
  requestId: Bytes,
  isVerification: boolean
): RequestProcessed {
  let requestProcessedEvent = changetype<RequestProcessed>(newMockEvent())

  requestProcessedEvent.parameters = new Array()

  requestProcessedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  requestProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  requestProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "isVerification",
      ethereum.Value.fromBoolean(isVerification)
    )
  )

  return requestProcessedEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}

export function createScoreCalculatedEvent(
  user: Address,
  score: BigInt,
  seasonalPoints: BigInt,
  isActive: boolean
): ScoreCalculated {
  let scoreCalculatedEvent = changetype<ScoreCalculated>(newMockEvent())

  scoreCalculatedEvent.parameters = new Array()

  scoreCalculatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  scoreCalculatedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )
  scoreCalculatedEvent.parameters.push(
    new ethereum.EventParam(
      "seasonalPoints",
      ethereum.Value.fromUnsignedBigInt(seasonalPoints)
    )
  )
  scoreCalculatedEvent.parameters.push(
    new ethereum.EventParam("isActive", ethereum.Value.fromBoolean(isActive))
  )

  return scoreCalculatedEvent
}

export function createScoreExpiredEvent(
  user: Address,
  expiredScore: BigInt
): ScoreExpired {
  let scoreExpiredEvent = changetype<ScoreExpired>(newMockEvent())

  scoreExpiredEvent.parameters = new Array()

  scoreExpiredEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  scoreExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "expiredScore",
      ethereum.Value.fromUnsignedBigInt(expiredScore)
    )
  )

  return scoreExpiredEvent
}

export function createSeasonEndedEvent(
  seasonNumber: BigInt,
  endTime: BigInt
): SeasonEnded {
  let seasonEndedEvent = changetype<SeasonEnded>(newMockEvent())

  seasonEndedEvent.parameters = new Array()

  seasonEndedEvent.parameters.push(
    new ethereum.EventParam(
      "seasonNumber",
      ethereum.Value.fromUnsignedBigInt(seasonNumber)
    )
  )
  seasonEndedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return seasonEndedEvent
}

export function createSeasonMilestoneReachedEvent(
  user: Address,
  seasonNumber: BigInt,
  milestone: BigInt,
  bonus: BigInt
): SeasonMilestoneReached {
  let seasonMilestoneReachedEvent =
    changetype<SeasonMilestoneReached>(newMockEvent())

  seasonMilestoneReachedEvent.parameters = new Array()

  seasonMilestoneReachedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  seasonMilestoneReachedEvent.parameters.push(
    new ethereum.EventParam(
      "seasonNumber",
      ethereum.Value.fromUnsignedBigInt(seasonNumber)
    )
  )
  seasonMilestoneReachedEvent.parameters.push(
    new ethereum.EventParam(
      "milestone",
      ethereum.Value.fromUnsignedBigInt(milestone)
    )
  )
  seasonMilestoneReachedEvent.parameters.push(
    new ethereum.EventParam("bonus", ethereum.Value.fromUnsignedBigInt(bonus))
  )

  return seasonMilestoneReachedEvent
}

export function createSeasonRewardClaimedEvent(
  user: Address,
  seasonNumber: BigInt,
  totalPoints: BigInt,
  bonus: BigInt,
  specialNftId: BigInt
): SeasonRewardClaimed {
  let seasonRewardClaimedEvent = changetype<SeasonRewardClaimed>(newMockEvent())

  seasonRewardClaimedEvent.parameters = new Array()

  seasonRewardClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  seasonRewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "seasonNumber",
      ethereum.Value.fromUnsignedBigInt(seasonNumber)
    )
  )
  seasonRewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPoints",
      ethereum.Value.fromUnsignedBigInt(totalPoints)
    )
  )
  seasonRewardClaimedEvent.parameters.push(
    new ethereum.EventParam("bonus", ethereum.Value.fromUnsignedBigInt(bonus))
  )
  seasonRewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "specialNftId",
      ethereum.Value.fromUnsignedBigInt(specialNftId)
    )
  )

  return seasonRewardClaimedEvent
}

export function createSeasonStartedEvent(
  seasonNumber: BigInt,
  startTime: BigInt
): SeasonStarted {
  let seasonStartedEvent = changetype<SeasonStarted>(newMockEvent())

  seasonStartedEvent.parameters = new Array()

  seasonStartedEvent.parameters.push(
    new ethereum.EventParam(
      "seasonNumber",
      ethereum.Value.fromUnsignedBigInt(seasonNumber)
    )
  )
  seasonStartedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )

  return seasonStartedEvent
}
