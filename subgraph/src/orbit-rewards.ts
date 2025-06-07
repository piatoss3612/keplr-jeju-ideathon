import {
  InitialQualificationClaimed as InitialQualificationClaimedEvent,
  LoyaltyVerificationRequested as LoyaltyVerificationRequestedEvent,
  LoyaltyVerified as LoyaltyVerifiedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestSent as RequestSentEvent,
  ScoreCalculated as ScoreCalculatedEvent,
  ScoreExpired as ScoreExpiredEvent,
  SeasonEnded as SeasonEndedEvent,
  SeasonMilestoneReached as SeasonMilestoneReachedEvent,
  SeasonRewardClaimed as SeasonRewardClaimedEvent,
  SeasonStarted as SeasonStartedEvent
} from "../generated/OrbitRewards/OrbitRewards"
import {
  InitialQualificationClaimed,
  LoyaltyVerificationRequested,
  LoyaltyVerified,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent,
  ScoreCalculated,
  ScoreExpired,
  SeasonEnded,
  SeasonMilestoneReached,
  SeasonRewardClaimed,
  SeasonStarted
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
  entity.seasonalPoints = event.params.seasonalPoints
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

export function handleSeasonEnded(event: SeasonEndedEvent): void {
  let entity = new SeasonEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seasonNumber = event.params.seasonNumber
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSeasonMilestoneReached(
  event: SeasonMilestoneReachedEvent
): void {
  let entity = new SeasonMilestoneReached(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.seasonNumber = event.params.seasonNumber
  entity.milestone = event.params.milestone
  entity.bonus = event.params.bonus

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSeasonRewardClaimed(
  event: SeasonRewardClaimedEvent
): void {
  let entity = new SeasonRewardClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.seasonNumber = event.params.seasonNumber
  entity.totalPoints = event.params.totalPoints
  entity.bonus = event.params.bonus
  entity.specialNftId = event.params.specialNftId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSeasonStarted(event: SeasonStartedEvent): void {
  let entity = new SeasonStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seasonNumber = event.params.seasonNumber
  entity.startTime = event.params.startTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
