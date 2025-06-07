// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {OrbitRewards} from "src/OrbitRewards.sol";

import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract OrbitScript is Script {
    using Strings for address;

    string constant JS_SOURCE_PATH = "api-request.js";

    function setUp() public {}

    function run() public {
        // Get Subscription ID from environment variable
        uint256 subscriptionId_uint256 = vm.envUint(
            "FUNCTIONS_SUBSCRIPTION_ID"
        );
        if (subscriptionId_uint256 == 0) {
            revert(
                "FUNCTIONS_SUBSCRIPTION_ID environment variable not set or is 0."
            );
        }
        // Check if the value fits in uint64 before casting
        if (subscriptionId_uint256 > type(uint64).max) {
            revert("FUNCTIONS_SUBSCRIPTION_ID is too large to fit in uint64.");
        }
        uint64 subscriptionId = uint64(subscriptionId_uint256);

        console.log("Using Functions Subscription ID:", subscriptionId);

        // Read JavaScript source code from file
        string memory sourceCode = vm.readFile(JS_SOURCE_PATH);
        if (bytes(sourceCode).length == 0) {
            revert(
                "Failed to read JavaScript source code from file or file is empty."
            );
        }

        vm.startBroadcast();

        OrbitRewards rewards = new OrbitRewards(subscriptionId, sourceCode);

        vm.stopBroadcast();

        address nftContract = rewards.getNFTContract();

        console.log("OrbitRewards deployed to:", address(rewards));
        console.log("OrbitRewardsNFT deployed to:", nftContract);
    }
}
