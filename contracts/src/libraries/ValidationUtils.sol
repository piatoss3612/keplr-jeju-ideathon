// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {DelegationTier, TierConstants, TierUtils} from "../Types.sol";
import {AddressUtils} from "./AddressUtils.sol";

/**
 * @title ValidationUtils
 * @notice Validation utilities for the OrbitRewards ecosystem
 * @dev Contains all validation logic for addresses, tiers, and data
 */
library ValidationUtils {
    using AddressUtils for string;

    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when bech32 address format is invalid for orbital navigation
    error InvalidBech32Address(string invalidAddress);

    /// @notice Thrown when cosmic tier value is invalid (must be 0-3)
    error InvalidTierValue(uint256 invalidTier);

    /// @notice Thrown when hex address conversion fails during navigation
    error InvalidHexAddress(string invalidHex);

    /// @notice Thrown when stellar amount string parsing fails
    error InvalidAmountString(string invalidAmount);

    /// @notice Thrown when delegation does not meet minimum qualification requirements for orbital entry
    error DelegationNotQualified(string bech32Address);

    // ==================== VALIDATION FUNCTIONS ====================

    /**
     * @notice Validate bech32 address format for orbital navigation
     * @param bech32Address The bech32 address to validate
     */
    function validateBech32Address(string memory bech32Address) internal pure {
        bytes memory addrBytes = bytes(bech32Address);

        // Check minimum length and prefix
        if (
            addrBytes.length < 5 || addrBytes[0] != "i" || addrBytes[1] != "n" || addrBytes[2] != "i"
                || addrBytes[3] != "t" || addrBytes[4] != "1"
        ) {
            revert InvalidBech32Address(bech32Address);
        }
    }

    /**
     * @notice Validate cosmic tier value range
     * @param tier The tier value to validate
     */
    function validateTierValue(uint256 tier) internal pure {
        if (tier > 3) {
            revert InvalidTierValue(tier);
        }
    }

    /**
     * @notice Validate and convert tier to enum
     * @param tier The tier value to validate and convert
     * @return delegationTier The validated delegation tier enum
     */
    function validateAndConvertTier(uint256 tier) internal pure returns (DelegationTier delegationTier) {
        validateTierValue(tier);
        return TierUtils.uintToTier(tier);
    }

    /**
     * @notice Validate hex address format
     * @param hexAddress The hex address string to validate
     * @return isValid Whether the hex address is valid
     */
    function validateHexAddress(string memory hexAddress) internal pure returns (bool isValid) {
        return hexAddress.isValidHexAddress();
    }

    /**
     * @notice Validate and parse amount string
     * @param amountString The amount string to validate and parse
     * @return amount The parsed amount value
     */
    function validateAndParseAmount(string memory amountString) internal pure returns (uint256 amount) {
        bytes memory amountBytes = bytes(amountString);
        if (amountBytes.length == 0) {
            revert InvalidAmountString(amountString);
        }

        // Use StringUtils from Types.sol to parse
        return _parseStringToUint(amountString);
    }

    /**
     * @notice Validate delegation qualification status
     * @param isQualified Whether the delegation is qualified according to API
     * @param bech32Address The bech32 address for error context
     */
    function validateDelegationQualification(bool isQualified, string memory bech32Address) internal pure {
        if (!isQualified) {
            revert DelegationNotQualified(bech32Address);
        }
    }

    /**
     * @notice Validate hex address and convert to address
     * @param hexAddressString The hex address string to validate and convert
     * @return claimant The converted Ethereum address
     */
    function validateAndConvertHexAddress(string memory hexAddressString) internal pure returns (address claimant) {
        if (!validateHexAddress(hexAddressString)) {
            revert InvalidHexAddress(hexAddressString);
        }
        return hexAddressString.hexStringToAddress();
    }

    /**
     * @notice Check if amount qualifies for target tier
     * @param amount The delegation amount
     * @param targetTier The target tier to check
     * @return qualified Whether the amount qualifies for the tier
     * @return threshold The threshold for the target tier
     */
    function checkTierQualification(uint256 amount, DelegationTier targetTier)
        internal
        pure
        returns (bool qualified, uint256 threshold)
    {
        threshold = TierUtils.getThresholdForTier(targetTier);
        qualified = TierUtils.qualifiesForTier(amount, targetTier);
    }

    // ==================== INTERNAL HELPER FUNCTIONS ====================

    /**
     * @notice Internal function to parse string to uint256 (extracted from StringUtils)
     * @param str The string to parse
     * @return result The parsed uint256 value
     */
    function _parseStringToUint(string memory str) internal pure returns (uint256 result) {
        bytes memory strBytes = bytes(str);

        for (uint256 i = 0; i < strBytes.length; i++) {
            uint8 charCode = uint8(strBytes[i]);
            if (charCode >= 48 && charCode <= 57) {
                // 0-9
                result = result * 10 + (charCode - 48);
            } else {
                revert InvalidAmountString(str);
            }
        }

        return result;
    }
}
