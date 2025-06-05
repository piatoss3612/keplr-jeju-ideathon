// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title AddressUtils
 * @notice Library for address-related utility functions
 * @dev Provides functions to convert hex strings to addresses and vice versa
 * Based on OpenZeppelin v5.1.0 Strings library with additional address parsing capabilities
 */
library AddressUtils {
    bytes16 private constant HEX_DIGITS = "0123456789abcdef";
    uint8 private constant ADDRESS_LENGTH = 20;

    /**
     * @dev The `value` string doesn't fit in the specified `length`.
     */
    error StringsInsufficientHexLength(uint256 value, uint256 length);

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            assembly ("memory-safe") {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                assembly ("memory-safe") {
                    mstore8(ptr, byte(mod(value, 10), HEX_DIGITS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toStringSigned(int256 value) internal pure returns (string memory) {
        return string.concat(value < 0 ? "-" : "", toString(abs(value)));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        uint256 localValue = value;
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = HEX_DIGITS[localValue & 0xf];
            localValue >>= 4;
        }
        if (localValue != 0) {
            revert StringsInsufficientHexLength(value, length);
        }
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal
     * representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), ADDRESS_LENGTH);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its checksummed ASCII `string` hexadecimal
     * representation, according to EIP-55.
     */
    function toChecksumHexString(address addr) internal pure returns (string memory) {
        bytes memory buffer = bytes(toHexString(addr));

        // hash the hex part of buffer (skip length + 2 bytes, length 40)
        uint256 hashValue;
        assembly ("memory-safe") {
            hashValue := shr(96, keccak256(add(buffer, 0x22), 40))
        }

        for (uint256 i = 41; i > 1; --i) {
            // possible values for buffer[i] are 48 (0) to 57 (9) and 97 (a) to 102 (f)
            if (hashValue & 0xf > 7 && uint8(buffer[i]) > 96) {
                // case shift by xoring with 0x20
                buffer[i] ^= 0x20;
            }
            hashValue >>= 4;
        }
        return string(buffer);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(bytes(a)) == keccak256(bytes(b));
    }

    // ==================== ADDITIONAL ADDRESS PARSING FUNCTIONS ====================

    /**
     * @dev Convert hex string to address
     * @param hexString The hex string to convert (must start with 0x and be 42 chars long)
     * @return The address representation
     */
    function hexStringToAddress(string memory hexString) internal pure returns (address) {
        bytes memory stringBytes = bytes(hexString);
        require(stringBytes.length == 42, "AddressUtils: Invalid address length");
        require(stringBytes[0] == 0x30 && stringBytes[1] == 0x78, "AddressUtils: Must start with 0x");

        uint256 result = 0;
        for (uint256 i = 2; i < 42; i++) {
            result = result * 16 + hexCharToUint(stringBytes[i]);
        }

        return address(uint160(result));
    }

    /**
     * @dev Try to convert hex string to address (non-reverting version)
     * @param hexString The hex string to convert
     * @return success Whether the conversion was successful
     * @return value The parsed address (address(0) if failed)
     */
    function tryParseAddress(string memory hexString) internal pure returns (bool success, address value) {
        bytes memory stringBytes = bytes(hexString);

        // Check basic format
        if (stringBytes.length != 42) return (false, address(0));
        if (stringBytes[0] != 0x30 || stringBytes[1] != 0x78) {
            return (false, address(0));
        }

        uint256 result = 0;
        for (uint256 i = 2; i < 42; i++) {
            uint8 byteValue = uint8(stringBytes[i]);
            if (byteValue >= 48 && byteValue <= 57) {
                result = result * 16 + (byteValue - 48); // 0-9
            } else if (byteValue >= 65 && byteValue <= 70) {
                result = result * 16 + (byteValue - 55); // A-F
            } else if (byteValue >= 97 && byteValue <= 102) {
                result = result * 16 + (byteValue - 87); // a-f
            } else {
                return (false, address(0)); // Invalid hex character
            }
        }

        return (true, address(uint160(result)));
    }

    /**
     * @dev Convert hex character to uint
     * @param char The hex character to convert
     * @return The uint representation
     */
    function hexCharToUint(bytes1 char) internal pure returns (uint256) {
        uint8 byteValue = uint8(char);
        if (byteValue >= 48 && byteValue <= 57) return byteValue - 48; // 0-9
        if (byteValue >= 65 && byteValue <= 70) return byteValue - 55; // A-F
        if (byteValue >= 97 && byteValue <= 102) return byteValue - 87; // a-f
        revert("AddressUtils: Invalid hex character");
    }

    /**
     * @dev Validate if a string is a valid hex address format
     * @param hexString The hex string to validate
     * @return Whether the string is a valid hex address format
     */
    function isValidHexAddress(string memory hexString) internal pure returns (bool) {
        (bool success,) = tryParseAddress(hexString);
        return success;
    }

    /**
     * @dev Legacy function - alias for toHexString(address)
     * @param addr The address to convert
     * @return The hex string representation (with 0x prefix)
     */
    function addressToHexString(address addr) internal pure returns (string memory) {
        return toHexString(addr);
    }

    // ==================== INTERNAL MATH HELPER FUNCTIONS ====================

    /**
     * @dev Return the log in base 10 of a positive value
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256 of a positive value
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Returns the absolute value of a signed integer
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            return uint256(n >= 0 ? n : -n);
        }
    }
}
