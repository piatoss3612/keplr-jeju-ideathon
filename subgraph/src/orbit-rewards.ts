import {
  InitialQualificationClaimed as InitialQualificationClaimedEvent,
  LoyaltyVerificationRequested as LoyaltyVerificationRequestedEvent,
  LoyaltyVerified as LoyaltyVerifiedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestProcessed as RequestProcessedEvent,
  RequestSent as RequestSentEvent,
  ScoreCalculated as ScoreCalculatedEvent,
  ScoreExpired as ScoreExpiredEvent,
  Unpaused as UnpausedEvent
} from "../generated/OrbitRewards/OrbitRewards"
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
} from "../generated/schema"

export function handleInitialQualificationClaimed(
  event: InitialQualificationClaimedEvent
): void {
  let entity = new InitialQualificationClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.tokenId = event.params.tokenId
  entity.tier = event.params.tier
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLoyaltyVerificationRequested(
  event: LoyaltyVerificationRequestedEvent
): void {
  let entity = new LoyaltyVerificationRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLoyaltyVerified(event: LoyaltyVerifiedEvent): void {
  let entity = new LoyaltyVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.newTier = event.params.newTier
  entity.newAmount = event.params.newAmount
  entity.boostPoints = event.params.boostPoints
  entity.currentScore = event.params.currentScore

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferRequested(
  event: OwnershipTransferRequestedEvent
): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestFulfilled(event: RequestFulfilledEvent): void {
  let entity = new RequestFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestProcessed(event: RequestProcessedEvent): void {
  let entity = new RequestProcessed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.requestId = event.params.requestId
  entity.isVerification = event.params.isVerification

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestSent(event: RequestSentEvent): void {
  let entity = new RequestSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleScoreCalculated(event: ScoreCalculatedEvent): void {
  let entity = new ScoreCalculated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.score = event.params.score
  entity.isActive = event.params.isActive

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleScoreExpired(event: ScoreExpiredEvent): void {
  let entity = new ScoreExpired(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.expiredScore = event.params.expiredScore

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
