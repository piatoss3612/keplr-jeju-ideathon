// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {DelegationTier, TierConstants, TierUtils} from "../Types.sol";
import {ILoyaltySystem} from "../interfaces/ILoyaltySystem.sol";

/**
 * @title LoyaltySystem
 * @notice Orbital loyalty tracking system library for OrbitRewards
 * @dev Handles all loyalty-related calculations and state management
 */
library LoyaltySystem {
    using TierUtils for DelegationTier;
    using TierUtils for uint256;

    // ==================== CORE FUNCTIONS ====================

    /**
     * @notice Initialize loyalty info for first-time claimers
     * @param loyalty The loyalty info storage reference
     * @param tier The delegation tier
     * @param amount The delegation amount
     */
    function initializeLoyalty(ILoyaltySystem.LoyaltyInfo storage loyalty, DelegationTier tier, uint256 amount)
        internal
    {
        uint256 tierUint = TierUtils.tierToUint(tier);

        loyalty.firstClaimTimestamp = block.timestamp;
        loyalty.lastVerificationTime = block.timestamp;
        loyalty.verificationCount = 1;
        loyalty.consecutiveWeeks = 1;
        loyalty.currentAmount = amount;
        loyalty.lastTier = tier;
        loyalty.highestTierReached = tierUint;
        loyalty.eligibleForBonus = false;
        loyalty.bonusClaimed = false;

        // Calculate initial points
        uint256 pointsEarned = TierUtils.calculateTotalPoints(tier, 1);
        loyalty.totalPoints = pointsEarned;

        // Calculate level from points
        (uint256 level,) = TierUtils.calculateLevel(pointsEarned);
        loyalty.currentLevel = level;
    }

    /**
     * @notice Update loyalty tracking data with penalty system
     * @param loyalty The loyalty info storage reference
     * @param delegationTier The delegation tier
     * @param amount The delegation amount
     * @return pointsEarned The points earned this verification
     * @return penaltyInfo Penalty information (daysLate, penaltyRate, pointsLost, streakReset)
     * @return previousLevel The previous level before update
     * @return newLevel The new level after update
     */
    function updateLoyaltyData(
        ILoyaltySystem.LoyaltyInfo storage loyalty,
        DelegationTier delegationTier,
        uint256 amount
    ) internal returns (uint256 pointsEarned, uint256[4] memory penaltyInfo, uint256 previousLevel, uint256 newLevel) {
        previousLevel = loyalty.currentLevel;

        // Check verification timing
        (bool canNavigate, uint256 daysLate, bool penaltyApplies) =
            TierUtils.checkNavigationStatus(loyalty.lastVerificationTime, block.timestamp);

        if (!canNavigate) {
            uint256 timeRemaining =
                (loyalty.lastVerificationTime + TierConstants.VERIFICATION_INTERVAL) - block.timestamp;
            revert ILoyaltySystem.VerificationTooEarly(timeRemaining);
        }

        // Apply penalty if late
        if (penaltyApplies) {
            penaltyInfo = _applyPenalty(loyalty, daysLate);
            loyalty.consecutiveWeeks = 1; // Reset streak
        } else {
            loyalty.consecutiveWeeks++;
            penaltyInfo = [uint256(0), uint256(0), uint256(0), uint256(0)]; // No penalty
        }

        // Update basic info
        loyalty.lastVerificationTime = block.timestamp;
        loyalty.verificationCount++;
        loyalty.currentAmount = amount;
        loyalty.lastTier = delegationTier;

        // Update highest tier
        uint256 tierValue = delegationTier.tierToUint();
        if (tierValue > loyalty.highestTierReached) {
            loyalty.highestTierReached = tierValue;
        }

        // Calculate points
        pointsEarned = TierUtils.calculateTotalPoints(delegationTier, loyalty.consecutiveWeeks);

        // Update points and level
        loyalty.totalPoints += pointsEarned;

        // Calculate level
        (newLevel,) = TierUtils.calculateLevel(loyalty.totalPoints);
        loyalty.currentLevel = newLevel;

        // Check legacy eligibility
        _checkLegacyEligibility(loyalty);

        return (pointsEarned, penaltyInfo, previousLevel, newLevel);
    }

    /**
     * @notice Check when user can next verify their loyalty
     * @param loyalty The loyalty info
     * @return canVerify Whether user can verify now
     * @return nextVerificationTime When user can next verify
     */
    function getNextVerificationTime(ILoyaltySystem.LoyaltyInfo memory loyalty)
        internal
        view
        returns (bool canVerify, uint256 nextVerificationTime)
    {
        if (loyalty.firstClaimTimestamp == 0) {
            return (false, 0); // User hasn't claimed initially
        }

        nextVerificationTime = loyalty.lastVerificationTime + TierConstants.VERIFICATION_INTERVAL;
        canVerify = block.timestamp >= nextVerificationTime;
    }

    /**
     * @notice Get loyalty bonus eligibility information
     * @param loyalty The loyalty info
     * @return eligible Whether eligible for loyalty bonus
     * @return timeRemaining Time remaining until eligible (if not eligible)
     * @return verificationsNeeded Additional verifications needed
     */
    function getLoyaltyBonusEligibility(ILoyaltySystem.LoyaltyInfo memory loyalty)
        internal
        view
        returns (bool eligible, uint256 timeRemaining, uint256 verificationsNeeded)
    {
        if (loyalty.firstClaimTimestamp == 0) {
            return (false, 0, 0); // User hasn't claimed initially
        }

        bool timeQualified = block.timestamp >= loyalty.firstClaimTimestamp + TierConstants.LOYALTY_PERIOD;
        bool verificationsQualified = loyalty.verificationCount >= TierConstants.MINIMUM_VERIFICATIONS;

        eligible = timeQualified && verificationsQualified && !loyalty.bonusClaimed;

        timeRemaining =
            timeQualified ? 0 : (loyalty.firstClaimTimestamp + TierConstants.LOYALTY_PERIOD) - block.timestamp;

        verificationsNeeded =
            verificationsQualified ? 0 : TierConstants.MINIMUM_VERIFICATIONS - loyalty.verificationCount;
    }

    /**
     * @notice Update loyalty multiplier for bonus claiming
     * @param currentMultiplier The current multiplier value
     * @return newMultiplier The updated multiplier value
     */
    function updateLoyaltyMultiplier(uint256 currentMultiplier) internal pure returns (uint256 newMultiplier) {
        if (currentMultiplier == 0) {
            newMultiplier = 150; // 1.5x for first loyalty completion
        } else {
            newMultiplier = currentMultiplier + 25; // +0.25x for subsequent completions
            if (newMultiplier > 300) {
                // Max 3x multiplier
                newMultiplier = 300;
            }
        }
    }

    // ==================== INTERNAL HELPER FUNCTIONS ====================

    /**
     * @notice Apply penalty for late verification
     * @param loyalty The loyalty info storage reference
     * @param daysLate Number of days late
     * @return penaltyInfo [daysLate, penaltyRate, pointsLost, streakReset]
     */
    function _applyPenalty(ILoyaltySystem.LoyaltyInfo storage loyalty, uint256 daysLate)
        internal
        returns (uint256[4] memory penaltyInfo)
    {
        uint256 penaltyRate = TierUtils.calculatePenalty(daysLate);
        uint256 pointsToLose = (loyalty.totalPoints * penaltyRate) / 10000;

        uint256 pointsLost;
        if (pointsToLose > loyalty.totalPoints) {
            pointsLost = loyalty.totalPoints;
            loyalty.totalPoints = 0;
        } else {
            pointsLost = pointsToLose;
            loyalty.totalPoints -= pointsToLose;
        }

        return [daysLate, penaltyRate, pointsLost, uint256(1)]; // streakReset = 1 (true)
    }

    /**
     * @notice Check legacy eligibility
     * @param loyalty The loyalty info storage reference
     */
    function _checkLegacyEligibility(ILoyaltySystem.LoyaltyInfo storage loyalty) internal {
        bool timeQualified = block.timestamp >= loyalty.firstClaimTimestamp + TierConstants.LOYALTY_PERIOD;
        bool verificationsQualified = loyalty.verificationCount >= TierConstants.MINIMUM_VERIFICATIONS;

        if (timeQualified && verificationsQualified && !loyalty.eligibleForBonus) {
            loyalty.eligibleForBonus = true;
        }
    }

    /**
     * @notice Generate unique token ID for NFT minting
     * @param prefix The prefix for the token ID
     * @param user The user address
     * @param tier The delegation tier
     * @param amount The delegation amount
     * @return tokenId The generated unique token ID
     */
    function generateTokenId(string memory prefix, address user, DelegationTier tier, uint256 amount)
        internal
        view
        returns (uint256 tokenId)
    {
        tokenId = uint256(keccak256(abi.encodePacked(prefix, user, tier, amount, block.timestamp)));
    }
}
