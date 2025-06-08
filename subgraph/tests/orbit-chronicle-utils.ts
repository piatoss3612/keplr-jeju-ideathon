import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  ChainlinkConfigUpdated,
  GasLimitUpdated,
  InitialQualificationClaimed,
  LoyaltyVerified,
  OwnershipTransferRequested,
  OwnershipTransferred,
  Paused,
  RequestFulfilled,
  RequestProcessed,
  RequestSent,
  ScoreCalculated,
  ScoreExpired,
  SourceCodeUpdated,
  SubscriptionIdUpdated,
  Unpaused,
  UserRequestSent
} from "../generated/OrbitChronicle/OrbitChronicle"

export function createChainlinkConfigUpdatedEvent(
  subscriptionId: BigInt,
  gasLimit: BigInt,
  source: string
): ChainlinkConfigUpdated {
  let chainlinkConfigUpdatedEvent =
    changetype<ChainlinkConfigUpdated>(newMockEvent())

  chainlinkConfigUpdatedEvent.parameters = new Array()

  chainlinkConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "subscriptionId",
      ethereum.Value.fromUnsignedBigInt(subscriptionId)
    )
  )
  chainlinkConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "gasLimit",
      ethereum.Value.fromUnsignedBigInt(gasLimit)
    )
  )
  chainlinkConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("source", ethereum.Value.fromString(source))
  )

  return chainlinkConfigUpdatedEvent
}

export function createGasLimitUpdatedEvent(
  newGasLimit: BigInt
): GasLimitUpdated {
  let gasLimitUpdatedEvent = changetype<GasLimitUpdated>(newMockEvent())

  gasLimitUpdatedEvent.parameters = new Array()

  gasLimitUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newGasLimit",
      ethereum.Value.fromUnsignedBigInt(newGasLimit)
    )
  )

  return gasLimitUpdatedEvent
}

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

export function createSourceCodeUpdatedEvent(
  newSource: string
): SourceCodeUpdated {
  let sourceCodeUpdatedEvent = changetype<SourceCodeUpdated>(newMockEvent())

  sourceCodeUpdatedEvent.parameters = new Array()

  sourceCodeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newSource", ethereum.Value.fromString(newSource))
  )

  return sourceCodeUpdatedEvent
}

export function createSubscriptionIdUpdatedEvent(
  newSubscriptionId: BigInt
): SubscriptionIdUpdated {
  let subscriptionIdUpdatedEvent =
    changetype<SubscriptionIdUpdated>(newMockEvent())

  subscriptionIdUpdatedEvent.parameters = new Array()

  subscriptionIdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newSubscriptionId",
      ethereum.Value.fromUnsignedBigInt(newSubscriptionId)
    )
  )

  return subscriptionIdUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUserRequestSentEvent(
  user: Address,
  requestId: Bytes,
  isVerification: boolean
): UserRequestSent {
  let userRequestSentEvent = changetype<UserRequestSent>(newMockEvent())

  userRequestSentEvent.parameters = new Array()

  userRequestSentEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userRequestSentEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  userRequestSentEvent.parameters.push(
    new ethereum.EventParam(
      "isVerification",
      ethereum.Value.fromBoolean(isVerification)
    )
  )

  return userRequestSentEvent
}
