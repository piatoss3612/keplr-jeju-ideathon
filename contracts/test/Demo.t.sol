// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {AddressUtils} from "../src/AddressUtils.sol";

contract ParseAddressTest is Test {
    using AddressUtils for string;
    using AddressUtils for address;
    using AddressUtils for uint256;
    using AddressUtils for int256;

    /**
     * @dev Test different methods to convert hex string to address
     */
    function test_addressConversion() public {
        string memory hexAddressString = "0x157D19957d4047Fb8601783805a54EF6ae80eaD7";

        // Method 1: Using vm.parseAddress (Foundry cheatcode - best for tests)
        address result1 = vm.parseAddress(hexAddressString);
        console.log("Method 1 (vm.parseAddress):", result1);

        // Method 2: Using AddressUtils library
        address result2 = hexAddressString.hexStringToAddress();
        console.log("Method 2 (AddressUtils library):", result2);

        // Method 3: Using AddressUtils tryParseAddress
        (bool success, address result3) = AddressUtils.tryParseAddress(hexAddressString);
        require(success, "tryParseAddress failed");
        console.log("Method 3 (AddressUtils.tryParseAddress):", result3);

        // Verify all methods give the same result
        assertEq(result1, result2);
        assertEq(result2, result3);

        // Expected address
        address expected = 0x157D19957d4047Fb8601783805a54EF6ae80eaD7;
        assertEq(result1, expected);
        assertEq(result2, expected);
        assertEq(result3, expected);
    }

    /**
     * @dev Test AddressUtils tryParseAddress with various inputs
     */
    function test_tryParseAddress() public {
        // Test valid addresses
        string memory validAddr1 = "0x157D19957d4047Fb8601783805a54EF6ae80eaD7";
        string memory validAddr2 = "0x157d19957d4047fb8601783805a54ef6ae80ead7"; // lowercase
        string memory validAddr3 = "0x157D19957D4047FB8601783805A54EF6AE80EAD7"; // uppercase

        (bool success1, address addr1) = AddressUtils.tryParseAddress(validAddr1);
        (bool success2, address addr2) = AddressUtils.tryParseAddress(validAddr2);
        (bool success3, address addr3) = AddressUtils.tryParseAddress(validAddr3);

        assertTrue(success1);
        assertTrue(success2);
        assertTrue(success3);

        // All should parse to the same address
        assertEq(addr1, addr2);
        assertEq(addr2, addr3);

        console.log("Parsed address 1:", addr1);
        console.log("Parsed address 2:", addr2);
        console.log("Parsed address 3:", addr3);

        // Test invalid addresses
        string memory invalidAddr1 = "invalid";
        string memory invalidAddr2 = "0x123"; // too short
        string memory invalidAddr3 = "0xGGGD19957d4047Fb8601783805a54EF6ae80eaD7"; // invalid hex
        string memory invalidAddr4 = "157D19957d4047Fb8601783805a54EF6ae80eaD7"; // missing 0x

        (bool success4, address addr4) = AddressUtils.tryParseAddress(invalidAddr1);
        (bool success5, address addr5) = AddressUtils.tryParseAddress(invalidAddr2);
        (bool success6, address addr6) = AddressUtils.tryParseAddress(invalidAddr3);
        (bool success7, address addr7) = AddressUtils.tryParseAddress(invalidAddr4);

        assertFalse(success4);
        assertFalse(success5);
        assertFalse(success6);
        assertFalse(success7);

        // Invalid addresses should return address(0)
        assertEq(addr4, address(0));
        assertEq(addr5, address(0));
        assertEq(addr6, address(0));
        assertEq(addr7, address(0));

        console.log("Invalid parsing results (should all be false):");
        console.log("Success 4:", success4, "Address 4:", addr4);
        console.log("Success 5:", success5, "Address 5:", addr5);
        console.log("Success 6:", success6, "Address 6:", addr6);
        console.log("Success 7:", success7, "Address 7:", addr7);
    }

    /**
     * @dev Test string utility functions from AddressUtils
     */
    function test_stringUtils() public {
        // Test number to string conversion
        uint256 testNumber = 12345;
        string memory numberAsString = AddressUtils.toString(testNumber);
        console.log("Number as string:", numberAsString);

        // Test signed number to string conversion
        int256 positiveNumber = 6789;
        int256 negativeNumber = -6789;
        string memory positiveString = AddressUtils.toStringSigned(positiveNumber);
        string memory negativeString = AddressUtils.toStringSigned(negativeNumber);
        console.log("Positive number as string:", positiveString);
        console.log("Negative number as string:", negativeString);

        // Test hex string conversion
        uint256 hexNumber = 255;
        string memory hexString = AddressUtils.toHexString(hexNumber);
        console.log("Number as hex:", hexString);

        // Test fixed length hex string
        string memory fixedHexString = AddressUtils.toHexString(hexNumber, 4);
        console.log("Number as fixed hex:", fixedHexString);
    }

    /**
     * @dev Test address conversion functions
     */
    function test_addressConversions() public {
        address testAddr = 0x157D19957d4047Fb8601783805a54EF6ae80eaD7;

        // Test address to hex string conversion
        string memory addrAsHex = AddressUtils.toHexString(testAddr);
        console.log("Address as hex string:", addrAsHex);

        // Test checksum hex string conversion
        string memory checksumHex = AddressUtils.toChecksumHexString(testAddr);
        console.log("Address as checksum hex:", checksumHex);

        // Test legacy function
        string memory legacyHex = AddressUtils.addressToHexString(testAddr);
        console.log("Legacy address conversion:", legacyHex);

        // All should be the same (non-checksum versions)
        assertTrue(AddressUtils.equal(addrAsHex, legacyHex));
    }

    /**
     * @dev Test round trip: address -> string -> address
     */
    function test_roundTripConversion() public {
        address originalAddr = 0x157D19957d4047Fb8601783805a54EF6ae80eaD7;

        // Convert address to string using AddressUtils
        string memory hexFromUtils = AddressUtils.toHexString(originalAddr);
        console.log("From AddressUtils:", hexFromUtils);

        // Parse back using AddressUtils tryParseAddress
        (bool success, address parsedBack) = AddressUtils.tryParseAddress(hexFromUtils);
        assertTrue(success);
        console.log("Parsed back with tryParseAddress:", parsedBack);

        // Should be the same
        assertEq(originalAddr, parsedBack);

        // Test with hexStringToAddress (reverting version)
        address parsedByHexString = hexFromUtils.hexStringToAddress();
        assertEq(originalAddr, parsedByHexString);

        // Test with vm.parseAddress
        address parsedByVm = vm.parseAddress(hexFromUtils);
        assertEq(originalAddr, parsedByVm);
    }

    /**
     * @dev Test string equality function
     */
    function test_stringEquality() public {
        string memory str1 = "hello world";
        string memory str2 = "hello world";
        string memory str3 = "hello world!";

        assertTrue(AddressUtils.equal(str1, str2));
        assertFalse(AddressUtils.equal(str1, str3));
        assertFalse(AddressUtils.equal(str2, str3));

        console.log("String equality test passed");
    }

    /**
     * @dev Test validation functions
     */
    function test_validation() public {
        string memory validAddr = "0x157D19957d4047Fb8601783805a54EF6ae80eaD7";
        string memory invalidAddr = "0x123";

        assertTrue(AddressUtils.isValidHexAddress(validAddr));
        assertFalse(AddressUtils.isValidHexAddress(invalidAddr));

        console.log("Address validation test passed");
    }

    /**
     * @dev Test edge cases and error conditions
     */
    function test_edgeCases() public {
        // Test with zero address
        address zeroAddr = address(0);
        string memory zeroHex = AddressUtils.toHexString(zeroAddr);
        console.log("Zero address as hex:", zeroHex);

        (bool success, address parsed) = AddressUtils.tryParseAddress(zeroHex);
        assertTrue(success);
        assertEq(parsed, zeroAddr);

        // Test very large numbers
        uint256 maxUint = type(uint256).max;
        string memory maxString = AddressUtils.toString(maxUint);
        console.log("Max uint256 as string length:", bytes(maxString).length);

        // Test checksum with zero address
        string memory zeroChecksum = AddressUtils.toChecksumHexString(zeroAddr);
        console.log("Zero address checksum:", zeroChecksum);
    }
}
