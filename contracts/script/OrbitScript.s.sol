// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {OrbitProver} from "src/OrbitProver.sol";
import {OrbitVerifier} from "src/OrbitVerifier.sol";
import {AddressUtils} from "src/libraries/AddressUtils.sol";

contract OrbitScript is Script {
    using AddressUtils for address;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        OrbitProver prover = new OrbitProver();
        OrbitVerifier verifier = new OrbitVerifier(address(prover));

        vm.stopBroadcast();

        updateEnvFile(address(prover), address(verifier));
    }

    function updateEnvFile(address proverAddress, address verifierAddress) internal {
        string memory proverAddressStr = proverAddress.toHexString();
        string memory verifierAddressStr = verifierAddress.toHexString();

        // Read result.json file
        string memory envPath = "result.json";

        try vm.readFile(envPath) returns (string memory) {
            console.log("Updating result.json file with new contract addresses...");

            // Create sed commands to update the addresses
            string[] memory sedCommands = new string[](4);

            // Update prover address
            sedCommands[0] = "jq";
            sedCommands[1] = ".";
            sedCommands[2] =
                string(abi.encodePacked("s/proverAddress/0x[a-fA-F0-9]*/proverAddress=", proverAddressStr, "/"));
            sedCommands[3] = envPath;

            vm.ffi(sedCommands);

            // Update verifier address
            sedCommands[2] =
                string(abi.encodePacked("s/verifierAddress/0x[a-fA-F0-9]*/verifierAddress=", verifierAddressStr, "/"));

            vm.ffi(sedCommands);

            console.log("Successfully updated json file!");
            console.log("New proverAddress:", proverAddressStr);
            console.log("New verifierAddress:", verifierAddressStr);
        } catch {
            console.log("Warning: Could not update json file automatically.");
            console.log("Please manually update the following addresses in result.json:");
            console.log("proverAddress=", proverAddressStr);
            console.log("verifierAddress=", verifierAddressStr);
        }
    }
}
