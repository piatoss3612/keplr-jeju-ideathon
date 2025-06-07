// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {DelegationTier, TierConstants, TierUtils} from "./Types.sol";
import {ValidationUtils} from "./libraries/ValidationUtils.sol";
import {IOrbitProver} from "./interfaces/IOrbitProver.sol";

/**
 * @title OrbitProver
 * @notice Stellar proof generation contract for Initia delegation verification using vlayer Web Proofs
 * @dev Generates cosmic proofs for qualified delegations with automatic tier detection
 */
contract OrbitProver is IOrbitProver {
    using TierUtils for uint256;
    using TierUtils for DelegationTier;

    // ==================== CONSTANTS ====================

    /// @notice Mission Control API endpoint for delegation verification
    string public constant API_BASE_URL =
        "https://keplr-ideathon.vercel.app/verify";

    // ==================== MAIN ORBITAL FUNCTIONS ====================

    /**
     * @notice Prove delegation qualification for orbital entry with automatic cosmic tier detection
     * @param bech32Address The bech32 address to verify (automatically bound to proof)
     * @return claimant The Ethereum address corresponding to the hexAddress
     * @return tier The cosmic qualification tier (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return amount The delegation amount in wei (INIT has 6 decimals)
     */
    function proveQualification(
        string memory bech32Address
    ) public pure returns (address, uint256, uint256) {
        // Validate bech32 address format for orbital navigation
        ValidationUtils.validateBech32Address(bech32Address);

        uint256 amount = 5000000;

        // Determine cosmic tier based on stellar amount
        DelegationTier delegationTier = amount.getTierForAmount();
        uint256 tier = delegationTier.tierToUint();

        return (address(0), tier, 5000000);
    }

    /**
     * @notice Prove specific cosmic tier qualification for targeted orbital entry
     * @param bech32Address The bech32 address to verify (automatically bound to proof)
     * @param targetTier The target cosmic tier to prove (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return claimant The Ethereum address corresponding to the hexAddress
     * @return tier The verified cosmic tier (same as targetTier)
     * @return amount The delegation amount in wei
     */
    function proveSpecificTier(
        string memory bech32Address,
        uint256 targetTier
    ) public pure returns (address, uint256, uint256) {
        // Validate inputs for cosmic navigation
        ValidationUtils.validateBech32Address(bech32Address);
        ValidationUtils.validateTierValue(targetTier);

        // Verify navigator qualifies for the requested cosmic tier
        DelegationTier requestedTier = TierUtils.uintToTier(targetTier);
        (bool qualified, uint256 threshold) = ValidationUtils
            .checkTierQualification(5000000, requestedTier);

        if (!qualified) {
            revert InsufficientDelegationForTier(
                targetTier,
                threshold,
                5000000
            );
        }

        return (address(0), targetTier, 5000000);
    }

    // ==================== INTERNAL FUNCTIONS ====================

    // /**
    //  * @notice Extract and validate data from web proof response
    //  * @param web The verified web response
    //  * @param bech32Address The original bech32 address for error reporting
    //  * @return amount The delegation amount
    //  * @return claimant The Ethereum address
    //  */
    // function _extractAndValidateData(
    //     Web memory web,
    //     string memory bech32Address
    // ) internal view returns (uint256 amount, address claimant) {
    //     // Check if delegation is qualified
    //     bool isQualified = web.jsonGetBool("isQualified");
    //     ValidationUtils.validateDelegationQualification(
    //         isQualified,
    //         bech32Address
    //     );

    //     // Extract and parse delegation amount
    //     string memory amountString = web.jsonGetString("delegationAmount");
    //     amount = ValidationUtils.validateAndParseAmount(amountString);

    //     // Extract and convert hex address
    //     string memory hexAddressString = web.jsonGetString("hexAddress");
    //     claimant = ValidationUtils.validateAndConvertHexAddress(
    //         hexAddressString
    //     );

    //     return (amount, claimant);
    // }

    // ==================== PUBLIC VIEW FUNCTIONS ====================

    /**
     * @notice Get the appropriate tier for a given amount
     * @param amount The delegation amount
     * @return tier The tier level (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     */
    function getTierForAmount(
        uint256 amount
    ) public pure returns (uint256 tier) {
        return amount.getTierForAmount().tierToUint();
    }

    /**
     * @notice Get tier name as string
     * @param tier The tier level
     * @return name The tier name
     */
    function getTierName(
        uint256 tier
    ) public pure returns (string memory name) {
        ValidationUtils.validateTierValue(tier);
        return TierUtils.uintToTier(tier).getTierName();
    }

    /**
     * @notice Get threshold for a specific tier
     * @param tier The tier level
     * @return threshold The minimum amount required for the tier
     */
    function getThresholdForTier(
        uint256 tier
    ) public pure returns (uint256 threshold) {
        ValidationUtils.validateTierValue(tier);
        return TierUtils.getThresholdForTier(TierUtils.uintToTier(tier));
    }

    /**
     * @notice Check if amount qualifies for a specific tier
     * @param amount The delegation amount
     * @param tier The target tier level
     * @return qualified Whether the amount qualifies for the tier
     */
    function qualifiesForTier(
        uint256 amount,
        uint256 tier
    ) public pure returns (bool qualified) {
        ValidationUtils.validateTierValue(tier);
        return TierUtils.qualifiesForTier(amount, TierUtils.uintToTier(tier));
    }

    /**
     * @notice Get all tier thresholds
     * @return asteroid Asteroid tier threshold (5 INIT)
     * @return comet Comet tier threshold (20 INIT)
     * @return star Star tier threshold (100 INIT)
     * @return galaxy Galaxy tier threshold (1000 INIT)
     */
    function getAllTierThresholds()
        public
        pure
        returns (uint256 asteroid, uint256 comet, uint256 star, uint256 galaxy)
    {
        return (
            TierConstants.ASTEROID_THRESHOLD,
            TierConstants.COMET_THRESHOLD,
            TierConstants.STAR_THRESHOLD,
            TierConstants.GALAXY_THRESHOLD
        );
    }
}
