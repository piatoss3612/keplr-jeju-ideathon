// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract ParseAddressTest is Test {
    using Strings for string;

    /**
     * @dev Test StringUtils parseStringToUint with various inputs
     */
    function test_parseStringToUint() public pure {
        // Test valid number strings
        string memory num1 = "0";
        string memory num2 = "123";
        string memory num3 = "5000000"; // 5 INIT with 6 decimals
        string memory num4 = "1000000000"; // 1000 INIT with 6 decimals
        string memory num5 = "999999999999999999"; // Large number

        (bool success1, uint256 result1) = num1.tryParseUint();
        (bool success2, uint256 result2) = num2.tryParseUint();
        (bool success3, uint256 result3) = num3.tryParseUint();
        (bool success4, uint256 result4) = num4.tryParseUint();
        (bool success5, uint256 result5) = num5.tryParseUint();

        assertTrue(success1);
        assertTrue(success2);
        assertTrue(success3);
        assertTrue(success4);
        assertTrue(success5);

        assertEq(result1, 0);
        assertEq(result2, 123);
        assertEq(result3, 5000000);
        assertEq(result4, 1000000000);
        assertEq(result5, 999999999999999999);

        console.log("String '0' parsed to:", result1);
        console.log("String '123' parsed to:", result2);
        console.log("String '5000000' parsed to:", result3);
        console.log("String '1000000000' parsed to:", result4);
        console.log("String '999999999999999999' parsed to:", result5);
    }

    /**
     * @dev Test parseStringToUint with edge cases
     */
    function test_parseStringToUint_edgeCases() public pure {
        // Test single digit
        string memory singleDigit = "9";
        (bool success1, uint256 result1) = singleDigit.tryParseUint();
        assertTrue(success1);
        assertEq(result1, 9);

        // Test leading zeros (should work fine)
        string memory leadingZeros = "000123";
        (bool success2, uint256 result2) = leadingZeros.tryParseUint();
        assertTrue(success2);
        assertEq(result2, 123);

        // Test all zeros
        string memory allZeros = "0000";
        (bool success3, uint256 result3) = allZeros.tryParseUint();
        assertTrue(success3);
        assertEq(result3, 0);

        console.log("Single digit '9' parsed to:", result1);
        console.log("Leading zeros '000123' parsed to:", result2);
        console.log("All zeros '0000' parsed to:", result3);

        // Test INIT tier thresholds
        string memory asteroidThreshold = "5000000"; // 5 INIT
        string memory cometThreshold = "20000000"; // 20 INIT
        string memory starThreshold = "100000000"; // 100 INIT
        string memory galaxyThreshold = "1000000000"; // 1000 INIT

        (bool success4, uint256 result4) = asteroidThreshold.tryParseUint();
        (bool success5, uint256 result5) = cometThreshold.tryParseUint();
        (bool success6, uint256 result6) = starThreshold.tryParseUint();
        (bool success7, uint256 result7) = galaxyThreshold.tryParseUint();

        assertTrue(success4);
        assertTrue(success5);
        assertTrue(success6);
        assertTrue(success7);
        assertEq(result4, 5 * 1e6);
        assertEq(result5, 20 * 1e6);
        assertEq(result6, 100 * 1e6);
        assertEq(result7, 1000 * 1e6);

        console.log("INIT cosmic tier threshold tests passed");
    }

    function test_parseStringToUint_withChar() public pure {
        string memory input = "123a";
        (bool success, uint256 result) = input.tryParseUint();
        assertFalse(success);
        assertEq(result, 0);
    }

    function test_parseBytesToUint() public pure {
        bytes memory input = hex"35303030303030";
        string memory amountStr = string(input);

        (bool success, uint256 result) = amountStr.tryParseUint();
        assertTrue(success);
        assertEq(result, 5000000);
    }
}
