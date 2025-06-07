// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title Types
 * @notice Common types and constants used across the Initia delegation system
 */

/**
 * @notice Cosmic delegation tier levels based on staking amounts
 */
enum DelegationTier {
    Asteroid, // 5+ INIT
    Comet, // 20+ INIT
    Star, // 100+ INIT
    Galaxy // 1000+ INIT

}

/**
 * @title TierConstants
 * @notice Constants for cosmic delegation tier thresholds and orbital loyalty system
 */
library TierConstants {
    // Cosmic tier thresholds (in wei, INIT has 6 decimals)
    uint256 public constant ASTEROID_THRESHOLD = 5 * 1e6; // 5 INIT
    uint256 public constant COMET_THRESHOLD = 20 * 1e6; // 20 INIT
    uint256 public constant STAR_THRESHOLD = 100 * 1e6; // 100 INIT
    uint256 public constant GALAXY_THRESHOLD = 1000 * 1e6; // 1000 INIT

    // Orbital loyalty system timing constants
    uint256 public constant VERIFICATION_INTERVAL = 7 days; // Must wait 7 days to re-navigate
    uint256 public constant VERIFICATION_WINDOW = 7 days; // 7 days window to navigate (after interval)
    uint256 public constant PENALTY_THRESHOLD = 14 days; // Total 14 days = cosmic storm kicks in

    // Stellar points system constants (simplified)
    uint256 public constant ASTEROID_POINTS = 1; // 1 stellar point per navigation
    uint256 public constant COMET_POINTS = 3; // 3 stellar points per navigation
    uint256 public constant STAR_POINTS = 8; // 8 stellar points per navigation
    uint256 public constant GALAXY_POINTS = 20; // 20 stellar points per navigation

    // Orbital streak multiplier constants (in basis points, 10000 = 1.0x) - simplified
    uint256 public constant STREAK_ORBIT_2 = 12000; // 1.2x (orbit 2)
    uint256 public constant STREAK_ORBIT_3 = 15000; // 1.5x (orbit 3)
    uint256 public constant STREAK_ORBIT_4 = 20000; // 2.0x (orbit 4)
    uint256 public constant STREAK_ORBIT_5_PLUS = 25000; // 2.5x (orbit 5+)

    // Cosmic level system constants (simplified)
    uint256 public constant POINTS_PER_LEVEL_EARLY = 100; // Levels 1-10: 100 stellar points each
    uint256 public constant POINTS_PER_LEVEL_MID = 200; // Levels 11-20: 200 stellar points each
    uint256 public constant POINTS_PER_LEVEL_LATE = 500; // Levels 21+: 500 stellar points each
    uint256 public constant EARLY_LEVELS_END = 10; // First 10 cosmic levels
    uint256 public constant MID_LEVELS_END = 20; // Next 10 cosmic levels

    // Cosmic storm penalty system constants
    uint256 public constant PENALTY_RATE_PER_DAY = 50; // 5% penalty per day late in cosmic storm (500 = 5%)
    uint256 public constant MAX_PENALTY_RATE = 2000; // Max 20% stellar energy loss (2000 = 20%)
    uint256 public constant STREAK_RESET_PENALTY = 1; // Reset orbital streak on penalty (1 = true)
    uint256 public constant MIN_LEVEL_AFTER_PENALTY = 1; // Minimum cosmic level after penalty

    // Legacy constants (for backward compatibility)
    uint256 public constant LOYALTY_PERIOD = 21 days; // Legacy 21-day period
    uint256 public constant MINIMUM_VERIFICATIONS = 3; // Legacy minimum navigations
    uint256 public constant BASE_MULTIPLIER = 100; // 1x (100%)
    uint256 public constant STAKING_DECREASE_THRESHOLD = 80; // 20% decrease allowed in stellar delegation
}

/**
 * @title TierUtils
 * @notice Utility functions for delegation tier operations and loyalty point system
 */
library TierUtils {
    /**
     * @notice Get the appropriate tier for a given amount
     * @param amount The delegation amount
     * @return tier The delegation tier
     */
    function getTierForAmount(uint256 amount) internal pure returns (DelegationTier tier) {
        if (amount >= TierConstants.GALAXY_THRESHOLD) {
            return DelegationTier.Galaxy;
        }
        if (amount >= TierConstants.STAR_THRESHOLD) return DelegationTier.Star;
        if (amount >= TierConstants.COMET_THRESHOLD) {
            return DelegationTier.Comet;
        }
        if (amount >= TierConstants.ASTEROID_THRESHOLD) {
            return DelegationTier.Asteroid;
        }
        revert("Amount too low for any tier");
    }

    /**
     * @notice Get base points for a tier (without multipliers)
     * @param tier The delegation tier
     * @return points Base points for navigation
     */
    function getBasePointsForTier(DelegationTier tier) internal pure returns (uint256 points) {
        if (tier == DelegationTier.Asteroid) {
            return TierConstants.ASTEROID_POINTS;
        }
        if (tier == DelegationTier.Comet) return TierConstants.COMET_POINTS;
        if (tier == DelegationTier.Star) return TierConstants.STAR_POINTS;
        if (tier == DelegationTier.Galaxy) return TierConstants.GALAXY_POINTS;
        revert("Invalid tier");
    }

    /**
     * @notice Calculate streak multiplier based on consecutive orbits
     * @param consecutiveOrbits Number of consecutive orbits of navigation
     * @return multiplier Multiplier in basis points (10000 = 1.0x)
     */
    function getStreakMultiplier(uint256 consecutiveOrbits) internal pure returns (uint256 multiplier) {
        if (consecutiveOrbits >= 5) return TierConstants.STREAK_ORBIT_5_PLUS;
        if (consecutiveOrbits == 4) return TierConstants.STREAK_ORBIT_4;
        if (consecutiveOrbits == 3) return TierConstants.STREAK_ORBIT_3;
        if (consecutiveOrbits == 2) return TierConstants.STREAK_ORBIT_2;
        return TierConstants.BASE_MULTIPLIER; // Orbit 1 or 0
    }

    /**
     * @notice Calculate total points including tier and streak bonuses (simplified)
     * @param tier The delegation tier
     * @param consecutiveOrbits Consecutive orbits of navigation
     * @return totalPoints Total points earned
     */
    function calculateTotalPoints(DelegationTier tier, uint256 consecutiveOrbits)
        internal
        pure
        returns (uint256 totalPoints)
    {
        uint256 basePoints = getBasePointsForTier(tier);
        uint256 multiplier = getStreakMultiplier(consecutiveOrbits);

        // Apply streak multiplier (multiplier is in basis points)
        totalPoints = (basePoints * multiplier) / 10000;

        return totalPoints;
    }

    /**
     * @notice Calculate penalty for late navigation
     * @param daysLate Number of days late beyond the navigation window
     * @return penaltyRate Penalty rate in basis points (500 = 5%)
     */
    function calculatePenalty(uint256 daysLate) internal pure returns (uint256 penaltyRate) {
        if (daysLate == 0) return 0;

        penaltyRate = daysLate * TierConstants.PENALTY_RATE_PER_DAY;
        if (penaltyRate > TierConstants.MAX_PENALTY_RATE) {
            penaltyRate = TierConstants.MAX_PENALTY_RATE;
        }

        return penaltyRate;
    }

    /**
     * @notice Check if navigation is within allowed window
     * @param lastNavigationTime Last navigation timestamp
     * @param currentTime Current timestamp
     * @return canNavigate Whether navigation is allowed
     * @return daysLate How many days late (0 if not late)
     * @return penaltyApplies Whether penalty should be applied
     */
    function checkNavigationStatus(uint256 lastNavigationTime, uint256 currentTime)
        internal
        pure
        returns (bool canNavigate, uint256 daysLate, bool penaltyApplies)
    {
        uint256 timeSinceLastNavigation = currentTime - lastNavigationTime;

        // Can navigate after VERIFICATION_INTERVAL (7 days)
        if (timeSinceLastNavigation < TierConstants.VERIFICATION_INTERVAL) {
            return (false, 0, false);
        }

        // Within navigation window (7-14 days): OK
        if (timeSinceLastNavigation <= TierConstants.PENALTY_THRESHOLD) {
            return (true, 0, false);
        }

        // Beyond penalty threshold (>14 days): penalty applies
        daysLate = (timeSinceLastNavigation - TierConstants.PENALTY_THRESHOLD) / 86400;
        return (true, daysLate, true);
    }

    /**
     * @notice Calculate level from total points
     * @param totalPoints Total accumulated points
     * @return level Current level
     * @return pointsToNextLevel Points needed for next level
     */
    function calculateLevel(uint256 totalPoints) internal pure returns (uint256 level, uint256 pointsToNextLevel) {
        level = 1;
        uint256 pointsUsed = 0;

        // Levels 1-10: 100 points each
        if (totalPoints < 1000) {
            level = (totalPoints / TierConstants.POINTS_PER_LEVEL_EARLY) + 1;
            if (level > 10) level = 10;
            pointsUsed = (level - 1) * TierConstants.POINTS_PER_LEVEL_EARLY;
            pointsToNextLevel = (level <= 10) ? TierConstants.POINTS_PER_LEVEL_EARLY - (totalPoints - pointsUsed) : 0;
        }
        // Levels 11-20: 200 points each
        else if (totalPoints < 3000) {
            // 1000 + (10 * 200) = 3000
            level = 11 + ((totalPoints - 1000) / TierConstants.POINTS_PER_LEVEL_MID);
            if (level > 20) level = 20;
            pointsUsed = 1000 + ((level - 11) * TierConstants.POINTS_PER_LEVEL_MID);
            pointsToNextLevel = (level <= 20) ? TierConstants.POINTS_PER_LEVEL_MID - (totalPoints - pointsUsed) : 0;
        }
        // Levels 21+: 500 points each
        else {
            level = 21 + ((totalPoints - 3000) / TierConstants.POINTS_PER_LEVEL_LATE);
            pointsUsed = 3000 + ((level - 21) * TierConstants.POINTS_PER_LEVEL_LATE);
            pointsToNextLevel = TierConstants.POINTS_PER_LEVEL_LATE - (totalPoints - pointsUsed);
        }

        return (level, pointsToNextLevel);
    }

    /**
     * @notice Get tier name as string
     * @param tier The delegation tier
     * @return name The tier name
     */
    function getTierName(DelegationTier tier) internal pure returns (string memory name) {
        if (tier == DelegationTier.Asteroid) return "Asteroid";
        if (tier == DelegationTier.Comet) return "Comet";
        if (tier == DelegationTier.Star) return "Star";
        if (tier == DelegationTier.Galaxy) return "Galaxy";
        revert("Invalid tier");
    }

    /**
     * @notice Get threshold for a specific tier
     * @param tier The delegation tier
     * @return threshold The minimum amount required for the tier
     */
    function getThresholdForTier(DelegationTier tier) internal pure returns (uint256 threshold) {
        if (tier == DelegationTier.Asteroid) {
            return TierConstants.ASTEROID_THRESHOLD;
        }
        if (tier == DelegationTier.Comet) return TierConstants.COMET_THRESHOLD;
        if (tier == DelegationTier.Star) return TierConstants.STAR_THRESHOLD;
        if (tier == DelegationTier.Galaxy) {
            return TierConstants.GALAXY_THRESHOLD;
        }
        revert("Invalid tier");
    }

    /**
     * @notice Check if amount qualifies for a specific tier
     * @param amount The delegation amount
     * @param tier The target tier
     * @return qualified Whether the amount qualifies for the tier
     */
    function qualifiesForTier(uint256 amount, DelegationTier tier) internal pure returns (bool qualified) {
        return amount >= getThresholdForTier(tier);
    }

    /**
     * @notice Get tier as uint256
     * @param tier The delegation tier
     * @return tierValue The tier as uint256 (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     */
    function tierToUint(DelegationTier tier) internal pure returns (uint256 tierValue) {
        return uint256(tier);
    }

    /**
     * @notice Convert uint256 to tier
     * @param tierValue The tier value (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return tier The delegation tier
     */
    function uintToTier(uint256 tierValue) internal pure returns (DelegationTier tier) {
        require(tierValue <= 3, "Invalid tier value");
        return DelegationTier(tierValue);
    }
}
