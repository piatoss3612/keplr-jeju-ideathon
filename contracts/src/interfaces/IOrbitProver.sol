// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title IOrbitProver
 * @notice Interface for stellar proof generation in the OrbitRewards ecosystem
 * @dev Defines core proving functions for delegation verification
 */
interface IOrbitProver {
    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when delegation does not meet minimum qualification requirements for orbital entry
    error DelegationNotQualified(string bech32Address);

    /// @notice Thrown when delegation amount is insufficient for requested cosmic tier
    error InsufficientDelegationForTier(
        uint256 requested,
        uint256 required,
        uint256 actual
    );

    /// @notice Thrown when cosmic tier value is invalid (must be 0-3)
    error InvalidTierValue(uint256 invalidTier);

    /// @notice Thrown when bech32 address format is invalid for orbital navigation
    error InvalidBech32Address(string invalidAddress);

    /// @notice Thrown when hex address conversion fails during navigation
    error InvalidHexAddress(string invalidHex);

    /// @notice Thrown when stellar amount string parsing fails
    error InvalidAmountString(string invalidAmount);

    // ==================== MAIN FUNCTIONS ====================

    /**
     * @notice Prove delegation qualification for orbital entry with automatic cosmic tier detection
     * @param bech32Address The bech32 address to verify (automatically bound to proof)
     * @return claimant The Ethereum address corresponding to the hexAddress
     * @return tier The cosmic qualification tier (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return amount The delegation amount in wei (INIT has 6 decimals)
     */
    function proveQualification(
        string memory bech32Address
    ) external returns (address, uint256, uint256);

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
    ) external returns (address, uint256, uint256);

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get the appropriate tier for a given amount
     * @param amount The delegation amount
     * @return tier The tier level (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     */
    function getTierForAmount(
        uint256 amount
    ) external pure returns (uint256 tier);

    /**
     * @notice Get tier name as string
     * @param tier The tier level
     * @return name The tier name
     */
    function getTierName(
        uint256 tier
    ) external pure returns (string memory name);

    /**
     * @notice Get threshold for a specific tier
     * @param tier The tier level
     * @return threshold The minimum amount required for the tier
     */
    function getThresholdForTier(
        uint256 tier
    ) external pure returns (uint256 threshold);

    /**
     * @notice Check if amount qualifies for a specific tier
     * @param amount The delegation amount
     * @param tier The target tier level
     * @return qualified Whether the amount qualifies for the tier
     */
    function qualifiesForTier(
        uint256 amount,
        uint256 tier
    ) external pure returns (bool qualified);

    /**
     * @notice Get all tier thresholds
     * @return asteroid Asteroid tier threshold (5 INIT)
     * @return comet Comet tier threshold (20 INIT)
     * @return star Star tier threshold (100 INIT)
     * @return galaxy Galaxy tier threshold (1000 INIT)
     */
    function getAllTierThresholds()
        external
        pure
        returns (uint256 asteroid, uint256 comet, uint256 star, uint256 galaxy);
}
