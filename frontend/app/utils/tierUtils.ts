/**
 * @title TierUtils
 * @notice Utility functions for delegation tier calculations based on smart contract TierConstants
 */

// Cosmic delegation tier levels based on staking amounts
export enum DelegationTier {
  Asteroid = 0, // 5+ INIT
  Comet = 1, // 20+ INIT
  Star = 2, // 100+ INIT
  Galaxy = 3, // 1000+ INIT
}

// Cosmic tier thresholds (in wei, INIT has 6 decimals)
export const TIER_CONSTANTS = {
  ASTEROID_THRESHOLD: 5 * 1e6, // 5 INIT
  COMET_THRESHOLD: 20 * 1e6, // 20 INIT
  STAR_THRESHOLD: 100 * 1e6, // 100 INIT
  GALAXY_THRESHOLD: 1000 * 1e6, // 1000 INIT

  // Stellar points system constants
  ASTEROID_POINTS: 1, // 1 stellar point per navigation
  COMET_POINTS: 3, // 3 stellar points per navigation
  STAR_POINTS: 8, // 8 stellar points per navigation
  GALAXY_POINTS: 20, // 20 stellar points per navigation
} as const;

/**
 * Get the appropriate tier for a given amount
 * @param amount The delegation amount in wei (microINIT)
 * @return tier The delegation tier
 */
export function getTierForAmount(amount: string | number): DelegationTier {
  const amountNum = typeof amount === "string" ? parseInt(amount) : amount;

  if (amountNum >= TIER_CONSTANTS.GALAXY_THRESHOLD) {
    return DelegationTier.Galaxy;
  }
  if (amountNum >= TIER_CONSTANTS.STAR_THRESHOLD) {
    return DelegationTier.Star;
  }
  if (amountNum >= TIER_CONSTANTS.COMET_THRESHOLD) {
    return DelegationTier.Comet;
  }
  if (amountNum >= TIER_CONSTANTS.ASTEROID_THRESHOLD) {
    return DelegationTier.Asteroid;
  }
  throw new Error("Amount too low for any tier");
}

/**
 * Get base points for a tier (without multipliers)
 * @param tier The delegation tier
 * @return points Base points for navigation
 */
export function getBasePointsForTier(tier: DelegationTier): number {
  switch (tier) {
    case DelegationTier.Asteroid:
      return TIER_CONSTANTS.ASTEROID_POINTS;
    case DelegationTier.Comet:
      return TIER_CONSTANTS.COMET_POINTS;
    case DelegationTier.Star:
      return TIER_CONSTANTS.STAR_POINTS;
    case DelegationTier.Galaxy:
      return TIER_CONSTANTS.GALAXY_POINTS;
    default:
      throw new Error("Invalid tier");
  }
}

/**
 * Get tier name as string
 * @param tier The delegation tier
 * @return name The tier name
 */
export function getTierName(tier: DelegationTier): string {
  switch (tier) {
    case DelegationTier.Asteroid:
      return "Asteroid";
    case DelegationTier.Comet:
      return "Comet";
    case DelegationTier.Star:
      return "Star";
    case DelegationTier.Galaxy:
      return "Galaxy";
    default:
      throw new Error("Invalid tier");
  }
}

/**
 * Get threshold for a specific tier
 * @param tier The delegation tier
 * @return threshold The minimum amount required for the tier
 */
export function getThresholdForTier(tier: DelegationTier): number {
  switch (tier) {
    case DelegationTier.Asteroid:
      return TIER_CONSTANTS.ASTEROID_THRESHOLD;
    case DelegationTier.Comet:
      return TIER_CONSTANTS.COMET_THRESHOLD;
    case DelegationTier.Star:
      return TIER_CONSTANTS.STAR_THRESHOLD;
    case DelegationTier.Galaxy:
      return TIER_CONSTANTS.GALAXY_THRESHOLD;
    default:
      throw new Error("Invalid tier");
  }
}

/**
 * Check if amount qualifies for a specific tier
 * @param amount The delegation amount in wei (microINIT)
 * @param tier The target tier
 * @return qualified Whether the amount qualifies for the tier
 */
export function qualifiesForTier(
  amount: string | number,
  tier: DelegationTier
): boolean {
  const amountNum = typeof amount === "string" ? parseInt(amount) : amount;
  return amountNum >= getThresholdForTier(tier);
}

/**
 * Get tier emoji
 * @param tier The delegation tier
 * @return emoji The tier emoji
 */
export function getTierEmoji(tier: DelegationTier): string {
  switch (tier) {
    case DelegationTier.Asteroid:
      return "☄️";
    case DelegationTier.Comet:
      return "💫";
    case DelegationTier.Star:
      return "⭐";
    case DelegationTier.Galaxy:
      return "🌌";
    default:
      return "❓";
  }
}

/**
 * Get tier color class for styling
 * @param tier The delegation tier
 * @return colorClass The CSS color class
 */
export function getTierColorClass(tier: DelegationTier): string {
  switch (tier) {
    case DelegationTier.Asteroid:
      return "text-orange-400";
    case DelegationTier.Comet:
      return "text-blue-400";
    case DelegationTier.Star:
      return "text-yellow-400";
    case DelegationTier.Galaxy:
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
}

/**
 * Get next tier and required amount to reach it
 * @param currentAmount The current delegation amount in wei (microINIT)
 * @return nextTierInfo Information about the next tier
 */
export function getNextTierInfo(currentAmount: string | number): {
  currentTier: DelegationTier;
  nextTier: DelegationTier | null;
  requiredAmount: number | null;
  remainingAmount: number | null;
} {
  const amountNum =
    typeof currentAmount === "string" ? parseInt(currentAmount) : currentAmount;

  try {
    const currentTier = getTierForAmount(amountNum);

    // Already at the highest tier
    if (currentTier === DelegationTier.Galaxy) {
      return {
        currentTier,
        nextTier: null,
        requiredAmount: null,
        remainingAmount: null,
      };
    }

    const nextTier = currentTier + 1;
    const requiredAmount = getThresholdForTier(nextTier);
    const remainingAmount = requiredAmount - amountNum;

    return {
      currentTier,
      nextTier,
      requiredAmount,
      remainingAmount,
    };
  } catch {
    // Amount is too low for any tier
    return {
      currentTier: DelegationTier.Asteroid,
      nextTier: DelegationTier.Asteroid,
      requiredAmount: TIER_CONSTANTS.ASTEROID_THRESHOLD,
      remainingAmount: TIER_CONSTANTS.ASTEROID_THRESHOLD - amountNum,
    };
  }
}

/**
 * Format amount from wei to INIT with proper decimals
 * @param amount Amount in wei (microINIT)
 * @return formatted Formatted amount string
 */
export function formatInitAmount(amount: string | number): string {
  const amountNum = typeof amount === "string" ? parseInt(amount) : amount;
  return (amountNum / 1e6).toFixed(6);
}
