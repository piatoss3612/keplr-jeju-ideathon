import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { InitialQualificationClaimed } from "../generated/schema"
import { InitialQualificationClaimed as InitialQualificationClaimedEvent } from "../generated/OrbitRewards/OrbitRewards"
import { handleInitialQualificationClaimed } from "../src/orbit-rewards"
import { createInitialQualificationClaimedEvent } from "./orbit-rewards-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenId = BigInt.fromI32(234)
    let tier = 123
    let amount = BigInt.fromI32(234)
    let newInitialQualificationClaimedEvent =
      createInitialQualificationClaimedEvent(user, tokenId, tier, amount)
    handleInitialQualificationClaimed(newInitialQualificationClaimedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("InitialQualificationClaimed created and stored", () => {
    assert.entityCount("InitialQualificationClaimed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "InitialQualificationClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InitialQualificationClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "InitialQualificationClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tier",
      "123"
    )
    assert.fieldEquals(
      "InitialQualificationClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
