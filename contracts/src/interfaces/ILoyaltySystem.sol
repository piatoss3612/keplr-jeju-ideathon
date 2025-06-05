// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {DelegationTier} from "../Types.sol";

/**
 * @title ILoyaltySystem
 * @notice Interface for the orbital loyalty tracking system
 * @dev Defines loyalty-related functions and data structures
 */
interface ILoyaltySystem {
    // ==================== STRUCTS ====================

    /// @notice Orbital loyalty tracking information
    struct LoyaltyInfo {
        uint256 firstClaimTimestamp; // When navigator first launched
        uint256 lastVerificationTime; // Last time navigator re-verified their staking
        uint256 verificationCount; // Number of times navigated
        uint256 totalPoints; // Total accumulated stellar points
        uint256 currentLevel; // Current cosmic level (calculated from points)
        uint256 consecutiveWeeks; // Consecutive orbits of navigation
        uint256 highestTierReached; // Highest cosmic tier ever reached (0=Asteroid, 3=Galaxy)
        uint256 currentAmount; // Current staking amount
        DelegationTier lastTier; // Last verified cosmic tier
        bool eligibleForBonus; // Whether eligible for 21-day bonus (legacy)
        bool bonusClaimed; // Whether 21-day bonus has been claimed (legacy)
    }

    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when verification is too early
    error VerificationTooEarly(uint256 timeRemaining);

    /// @notice Thrown when staking amount decreased significantly
    error StakingAmountDecreased(uint256 previousAmount, uint256 currentAmount);

    /// @notice Thrown when late verification penalty applies
    error LateVerificationPenalty(uint256 daysLate, uint256 penaltyRate);

    /// @notice Thrown when verification window has passed without penalty acceptance
    error VerificationWindowExpired(uint256 daysSinceWindow);

    // ==================== FUNCTIONS ====================

    /**
     * @notice Update loyalty tracking data
     * @param claimant The claimant address
     * @param delegationTier The delegation tier
     * @param amount The delegation amount
     */
    function updateLoyalty(address claimant, DelegationTier delegationTier, uint256 amount) external;

    /**
     * @notice Get user's loyalty status and progress
     * @param user The user address
     * @return loyalty The complete loyalty information
     */
    function getLoyaltyStatus(address user) external view returns (LoyaltyInfo memory loyalty);

    /**
     * @notice Check when user can next verify their loyalty
     * @param user The user address
     * @return canVerify Whether user can verify now
     * @return nextVerificationTime When user can next verify
     */
    function getNextVerificationTime(address user)
        external
        view
        returns (bool canVerify, uint256 nextVerificationTime);

    /**
     * @notice Get loyalty bonus eligibility information
     * @param user The user address
     * @return eligible Whether eligible for loyalty bonus
     * @return timeRemaining Time remaining until eligible (if not eligible)
     * @return verificationsNeeded Additional verifications needed
     */
    function getLoyaltyBonusEligibility(address user)
        external
        view
        returns (bool eligible, uint256 timeRemaining, uint256 verificationsNeeded);

    /**
     * @notice Get user's effective loyalty multiplier
     * @param user The user address
     * @return multiplier The loyalty multiplier (100 = 1x, 200 = 2x)
     */
    function getLoyaltyMultiplier(address user) external view returns (uint256 multiplier);
}
