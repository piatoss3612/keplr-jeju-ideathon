import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { ChainlinkConfigUpdated } from "../generated/schema"
import { ChainlinkConfigUpdated as ChainlinkConfigUpdatedEvent } from "../generated/OrbitChronicle/OrbitChronicle"
import { handleChainlinkConfigUpdated } from "../src/orbit-chronicle"
import { createChainlinkConfigUpdatedEvent } from "./orbit-chronicle-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let subscriptionId = BigInt.fromI32(234)
    let gasLimit = BigInt.fromI32(234)
    let source = "Example string value"
    let newChainlinkConfigUpdatedEvent = createChainlinkConfigUpdatedEvent(
      subscriptionId,
      gasLimit,
      source
    )
    handleChainlinkConfigUpdated(newChainlinkConfigUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ChainlinkConfigUpdated created and stored", () => {
    assert.entityCount("ChainlinkConfigUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ChainlinkConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "subscriptionId",
      "234"
    )
    assert.fieldEquals(
      "ChainlinkConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gasLimit",
      "234"
    )
    assert.fieldEquals(
      "ChainlinkConfigUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "source",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
