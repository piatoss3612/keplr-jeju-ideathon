import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  InitialQualificationClaimed,
  LoyaltyVerificationRequested,
  LoyaltyVerified,
  OwnershipTransferRequested,
  OwnershipTransferred,
  Paused,
  RequestFulfilled,
  RequestProcessed,
  RequestSent,
  ScoreCalculated,
  ScoreExpired,
  Unpaused
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

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
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

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
