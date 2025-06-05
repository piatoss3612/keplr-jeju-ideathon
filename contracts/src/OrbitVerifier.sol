// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";

import {OrbitProver} from "./OrbitProver.sol";
import {AddressUtils} from "./AddressUtils.sol";
import {DelegationTier, TierConstants, TierUtils} from "./Types.sol";

/**
 * @title OrbitVerifier
 * @notice Stellar verification contract for Initia delegation proofs with tiered NFT rewards
 * @dev Verifies cosmic proofs from OrbitProver and mints NFTs based on delegation tiers
 * @dev Includes orbital penalty system to maintain navigation discipline
 */
contract OrbitVerifier is Verifier, ERC721 {
    using AddressUtils for string;
    using TierUtils for DelegationTier;
    using TierUtils for uint256;

    // ==================== STATE VARIABLES ====================

    /// @notice Address of the stellar prover contract
    address public immutable prover;

    // Track claimed addresses to prevent double claiming
    mapping(address => bool) public claimedEthAddresses;
    mapping(uint256 => DelegationTier) public tokenTier;
    mapping(uint256 => uint256) public tokenAmount;
    mapping(uint256 => address) public tokenClaimant;

    // Orbital loyalty tracking system (점수 기반 게임화 시스템)
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

    mapping(address => LoyaltyInfo) public loyaltyStatus;
    mapping(address => uint256) public loyaltyMultiplier; // Legacy: 100 = 1x, 200 = 2x

    // Cosmic leaderboard and seasonal tracking
    mapping(address => uint256) public seasonalPoints; // Stellar points for current season
    mapping(uint256 => address) public topPlayers; // Leaderboard rankings
    uint256 public currentSeason = 1; // Current cosmic season number
    uint256 public seasonStartTime; // When current season started

    // Orbital milestones (in days)
    uint256 public constant VERIFICATION_INTERVAL = 7 days; // Re-navigate every 7 days
    uint256 public constant LOYALTY_PERIOD = 21 days; // Full loyalty period
    uint256 public constant MINIMUM_VERIFICATIONS = 3; // At least 3 navigations in 21 days

    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when user tries to claim with someone else's proof
    /// @param expected The expected claimant from proof
    /// @param actual The actual transaction sender
    error UnauthorizedClaimant(address expected, address actual);

    /// @notice Thrown when address has already claimed
    /// @param claimant The address that already claimed
    error AlreadyClaimed(address claimant);

    /// @notice Thrown when trying to claim with invalid address
    error InvalidClaimantAddress();

    /// @notice Thrown when tier value is invalid
    /// @param invalidTier The invalid tier value
    error InvalidTier(uint256 invalidTier);

    /// @notice Thrown when token ID already exists
    /// @param tokenId The existing token ID
    error TokenAlreadyExists(uint256 tokenId);

    /// @notice Thrown when trying to access non-existent token
    /// @param tokenId The non-existent token ID
    error TokenNotFound(uint256 tokenId);

    /// @notice Thrown when verification too early
    /// @param timeRemaining Time remaining until next verification allowed
    error VerificationTooEarly(uint256 timeRemaining);

    /// @notice Thrown when staking amount decreased significantly
    /// @param previousAmount Previous staking amount
    /// @param currentAmount Current staking amount
    error StakingAmountDecreased(uint256 previousAmount, uint256 currentAmount);

    /// @notice Thrown when late verification penalty applies
    /// @param daysLate Number of days late
    /// @param penaltyRate Penalty rate applied (in basis points)
    error LateVerificationPenalty(uint256 daysLate, uint256 penaltyRate);

    /// @notice Thrown when verification window has passed without penalty acceptance
    /// @param daysSinceWindow Days since verification window closed
    error VerificationWindowExpired(uint256 daysSinceWindow);

    // ==================== EVENTS ====================

    event QualificationClaimed(
        address indexed claimer,
        uint256 indexed tokenId,
        DelegationTier tier,
        uint256 amount
    );

    event LoyaltyVerified(
        address indexed user,
        uint256 verificationCount,
        uint256 pointsEarned,
        uint256 totalPoints,
        uint256 newLevel,
        uint256 timestamp
    );

    event LoyaltyBonusClaimed(
        address indexed user,
        uint256 multiplier,
        uint256 bonusTokenId
    );

    event LevelUp(
        address indexed user,
        uint256 previousLevel,
        uint256 newLevel,
        uint256 totalPoints
    );

    event StreakBonus(
        address indexed user,
        uint256 consecutiveWeeks,
        uint256 multiplier
    );

    event PenaltyApplied(
        address indexed user,
        uint256 daysLate,
        uint256 penaltyRate,
        uint256 pointsLost,
        bool streakReset
    );

    event VerificationWindowWarning(
        address indexed user,
        uint256 hoursRemaining
    );

    // Legacy events
    event LoyaltyMilestoneReached(
        address indexed user,
        uint256 milestone,
        uint256 reward
    );

    // ==================== CONSTRUCTOR ====================

    constructor(address _prover) ERC721("OrbitNavigatorNFT", "OND") {
        if (_prover == address(0)) revert InvalidClaimantAddress();
        prover = _prover;
        seasonStartTime = block.timestamp; // Initialize season start time
    }

    // ==================== MAIN CLAIM FUNCTIONS ====================

    /**
     * @notice Claim qualification with automatic tier detection
     * @param proof The proof from OrbitProver.proveQualification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier (0=Asteroid, 1=Moon, 2=Planet, 3=Galaxy)
     * @param amount The delegation amount in wei
     */
    function claimQualification(
        Proof calldata proof,
        address claimant,
        uint256 tier,
        uint256 amount
    ) external onlyVerified(prover, OrbitProver.proveQualification.selector) {
        // vlayer automatically verifies that the proof was generated for the specific bech32Address
        // No proof replay attacks possible - each proof is bound to specific address

        DelegationTier delegationTier = _validateTierAndConvert(tier);
        _claimQualification(claimant, delegationTier, amount);
    }

    /**
     * @notice Claim specific tier qualification
     * @param proof The proof from OrbitProver.proveSpecificTier
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The verified tier (same as requested in prover)
     * @param amount The delegation amount in wei
     */
    function claimSpecificTier(
        Proof calldata proof,
        address claimant,
        uint256 tier,
        uint256 amount
    ) external onlyVerified(prover, OrbitProver.proveSpecificTier.selector) {
        DelegationTier delegationTier = _validateTierAndConvert(tier);
        _claimQualification(claimant, delegationTier, amount);
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @notice Validate tier value and convert to enum
     * @param tier The tier value to validate
     * @return delegationTier The validated delegation tier enum
     */
    function _validateTierAndConvert(
        uint256 tier
    ) internal pure returns (DelegationTier delegationTier) {
        if (tier > 3) revert InvalidTier(tier);
        return TierUtils.uintToTier(tier);
    }

    /**
     * @notice Internal function to handle qualification claiming logic
     * @param claimant The verified Ethereum address from proof
     * @param tier The delegation tier
     * @param amount The delegation amount
     */
    function _claimQualification(
        address claimant,
        DelegationTier tier,
        uint256 amount
    ) internal {
        // Security: claimant must be the transaction sender
        // This ensures only the rightful owner can claim their proof
        if (claimant != msg.sender) {
            revert UnauthorizedClaimant(claimant, msg.sender);
        }

        // Prevent zero address claims
        if (claimant == address(0)) revert InvalidClaimantAddress();

        // Check if already claimed
        if (claimedEthAddresses[claimant]) {
            revert AlreadyClaimed(claimant);
        }

        // Generate unique token ID including timestamp for uniqueness
        uint256 tokenId = uint256(
            keccak256(
                abi.encodePacked(
                    "qualification_",
                    claimant,
                    tier,
                    amount,
                    block.timestamp
                )
            )
        );

        // Ensure token doesn't already exist (extremely unlikely but safe)
        if (_ownerOf(tokenId) != address(0)) {
            revert TokenAlreadyExists(tokenId);
        }

        // Mark as claimed and store metadata
        claimedEthAddresses[claimant] = true;
        tokenTier[tokenId] = tier;
        tokenAmount[tokenId] = amount;
        tokenClaimant[tokenId] = claimant;

        // Initialize loyalty tracking for first-time claimers with point system
        LoyaltyInfo storage loyalty = loyaltyStatus[claimant];
        uint256 tierUint = TierUtils.tierToUint(tier);

        loyalty.firstClaimTimestamp = block.timestamp;
        loyalty.lastVerificationTime = block.timestamp;
        loyalty.verificationCount = 1;
        loyalty.consecutiveWeeks = 1;
        loyalty.currentAmount = amount;
        loyalty.lastTier = tier;
        loyalty.highestTierReached = tierUint;
        loyalty.eligibleForBonus = false; // Legacy field
        loyalty.bonusClaimed = false; // Legacy field

        // Calculate initial points (simplified, no weekend bonus)
        uint256 pointsEarned = TierUtils.calculateTotalPoints(tier, 1);
        loyalty.totalPoints = pointsEarned;

        // Calculate level from points
        (uint256 level, ) = TierUtils.calculateLevel(pointsEarned);
        loyalty.currentLevel = level;

        // Update seasonal points
        seasonalPoints[claimant] = pointsEarned;

        // Mint qualification NFT to the claimant
        _safeMint(claimant, tokenId);

        emit QualificationClaimed(claimant, tokenId, tier, amount);
        emit LoyaltyVerified(
            claimant,
            1,
            pointsEarned,
            pointsEarned,
            level,
            block.timestamp
        );
    }

    // ==================== LOYALTY SYSTEM ====================

    /**
     * @notice Re-verify staking status with penalty system for late verification
     * @param proof The proof from OrbitProver.proveQualification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier
     * @param amount The current delegation amount
     */
    function verifyLoyalty(
        Proof calldata proof,
        address claimant,
        uint256 tier,
        uint256 amount
    ) external onlyVerified(prover, OrbitProver.proveQualification.selector) {
        if (claimant != msg.sender) {
            revert UnauthorizedClaimant(claimant, msg.sender);
        }

        LoyaltyInfo storage loyalty = loyaltyStatus[claimant];

        // Must have claimed initially
        if (loyalty.firstClaimTimestamp == 0) {
            revert InvalidClaimantAddress();
        }

        // Check if staking amount significantly decreased (penalty: >20% decrease)
        if (
            amount <
            (loyalty.currentAmount * TierConstants.STAKING_DECREASE_THRESHOLD) /
                100
        ) {
            revert StakingAmountDecreased(loyalty.currentAmount, amount);
        }

        DelegationTier delegationTier = TierUtils.uintToTier(tier);
        _updateLoyalty(claimant, delegationTier, amount);
    }

    /**
     * @notice Claim 21-day loyalty bonus (special NFT + multiplier)
     */
    function claimLoyaltyBonus() external {
        LoyaltyInfo storage loyalty = loyaltyStatus[msg.sender];

        if (!loyalty.eligibleForBonus) {
            uint256 timeRemaining = (loyalty.firstClaimTimestamp +
                LOYALTY_PERIOD) - block.timestamp;
            revert VerificationTooEarly(timeRemaining);
        }

        if (loyalty.bonusClaimed) {
            revert AlreadyClaimed(msg.sender);
        }

        loyalty.bonusClaimed = true;

        // Award loyalty multiplier
        if (loyaltyMultiplier[msg.sender] == 0) {
            loyaltyMultiplier[msg.sender] = 150; // 1.5x for first loyalty completion
        } else {
            loyaltyMultiplier[msg.sender] += 25; // +0.25x for subsequent completions
            if (loyaltyMultiplier[msg.sender] > 300) {
                // Max 3x multiplier
                loyaltyMultiplier[msg.sender] = 300;
            }
        }

        // Mint special loyalty NFT
        uint256 bonusTokenId = uint256(
            keccak256(
                abi.encodePacked(
                    "loyalty_bonus_",
                    msg.sender,
                    loyalty.verificationCount,
                    block.timestamp
                )
            )
        );

        _safeMint(msg.sender, bonusTokenId);

        // Store special metadata for loyalty NFT
        tokenTier[bonusTokenId] = DelegationTier.Galaxy; // Special loyalty tier
        tokenAmount[bonusTokenId] = loyalty.currentAmount;
        tokenClaimant[bonusTokenId] = msg.sender;

        emit LoyaltyBonusClaimed(
            msg.sender,
            loyaltyMultiplier[msg.sender],
            bonusTokenId
        );
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get NFT metadata by token ID
     * @param tokenId The token ID
     * @return tier The delegation tier
     * @return amount The delegation amount
     * @return tierName The tier name
     * @return claimant The claimant address
     */
    function getTokenMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            DelegationTier tier,
            uint256 amount,
            string memory tierName,
            address claimant
        )
    {
        if (_ownerOf(tokenId) == address(0)) revert TokenNotFound(tokenId);

        tier = tokenTier[tokenId];
        amount = tokenAmount[tokenId];
        tierName = tier.getTierName();
        claimant = tokenClaimant[tokenId];
    }

    /**
     * @notice Get user's loyalty status and progress
     * @param user The user address
     * @return firstClaim When user first claimed
     * @return lastVerification Last verification timestamp
     * @return verificationCount Number of verifications completed
     * @return eligibleForBonus Whether eligible for loyalty bonus
     * @return bonusClaimed Whether loyalty bonus has been claimed
     * @return currentAmount Current staking amount
     */
    function getLoyaltyStatus(
        address user
    )
        external
        view
        returns (
            uint256 firstClaim,
            uint256 lastVerification,
            uint256 verificationCount,
            bool eligibleForBonus,
            bool bonusClaimed,
            uint256 currentAmount
        )
    {
        LoyaltyInfo memory loyalty = loyaltyStatus[user];
        return (
            loyalty.firstClaimTimestamp,
            loyalty.lastVerificationTime,
            loyalty.verificationCount,
            loyalty.eligibleForBonus,
            loyalty.bonusClaimed,
            loyalty.currentAmount
        );
    }

    /**
     * @notice Check when user can next verify their loyalty
     * @param user The user address
     * @return canVerify Whether user can verify now
     * @return nextVerificationTime When user can next verify
     */
    function getNextVerificationTime(
        address user
    ) external view returns (bool canVerify, uint256 nextVerificationTime) {
        LoyaltyInfo memory loyalty = loyaltyStatus[user];
        if (loyalty.firstClaimTimestamp == 0) {
            return (false, 0); // User hasn't claimed initially
        }

        nextVerificationTime =
            loyalty.lastVerificationTime +
            VERIFICATION_INTERVAL;
        canVerify = block.timestamp >= nextVerificationTime;
    }

    /**
     * @notice Get loyalty bonus eligibility information
     * @param user The user address
     * @return eligible Whether eligible for loyalty bonus
     * @return timeRemaining Time remaining until eligible (if not eligible)
     * @return verificationsNeeded Additional verifications needed
     */
    function getLoyaltyBonusEligibility(
        address user
    )
        external
        view
        returns (
            bool eligible,
            uint256 timeRemaining,
            uint256 verificationsNeeded
        )
    {
        LoyaltyInfo memory loyalty = loyaltyStatus[user];

        if (loyalty.firstClaimTimestamp == 0) {
            return (false, 0, 0); // User hasn't claimed initially
        }

        bool timeQualified = block.timestamp >=
            loyalty.firstClaimTimestamp + LOYALTY_PERIOD;
        bool verificationsQualified = loyalty.verificationCount >=
            MINIMUM_VERIFICATIONS;

        eligible =
            timeQualified &&
            verificationsQualified &&
            !loyalty.bonusClaimed;

        timeRemaining = timeQualified
            ? 0
            : (loyalty.firstClaimTimestamp + LOYALTY_PERIOD) - block.timestamp;

        verificationsNeeded = verificationsQualified
            ? 0
            : MINIMUM_VERIFICATIONS - loyalty.verificationCount;
    }

    /**
     * @notice Get user's effective loyalty multiplier
     * @param user The user address
     * @return multiplier The loyalty multiplier (100 = 1x, 200 = 2x)
     */
    function getLoyaltyMultiplier(
        address user
    ) external view returns (uint256 multiplier) {
        return loyaltyMultiplier[user] == 0 ? 100 : loyaltyMultiplier[user];
    }

    /**
     * @notice Check if Ethereum address has claimed
     * @param ethAddress The Ethereum address to check
     * @return Whether the address has claimed
     */
    function hasClaimedEth(address ethAddress) external view returns (bool) {
        return claimedEthAddresses[ethAddress];
    }

    /**
     * @notice Get tier name as string
     * @param tier The tier enum value
     * @return name The tier name
     */
    function getTierName(
        uint256 tier
    ) external pure returns (string memory name) {
        if (tier > 3) revert InvalidTier(tier);
        return TierUtils.uintToTier(tier).getTierName();
    }

    /**
     * @notice Get loyalty system constants
     * @return verificationInterval How often users must verify (7 days)
     * @return loyaltyPeriod Full loyalty period (21 days)
     * @return minimumVerifications Minimum verifications needed (3)
     */
    function getLoyaltyConstants()
        external
        pure
        returns (
            uint256 verificationInterval,
            uint256 loyaltyPeriod,
            uint256 minimumVerifications
        )
    {
        return (VERIFICATION_INTERVAL, LOYALTY_PERIOD, MINIMUM_VERIFICATIONS);
    }

    /**
     * @notice Update loyalty tracking data (optimized to avoid stack too deep)
     * @param claimant The claimant address
     * @param delegationTier The delegation tier
     * @param amount The delegation amount
     */
    function _updateLoyalty(
        address claimant,
        DelegationTier delegationTier,
        uint256 amount
    ) internal {
        LoyaltyInfo storage loyalty = loyaltyStatus[claimant];
        uint256 previousLevel = loyalty.currentLevel;

        // Check verification timing
        (bool canNavigate, uint256 daysLate, bool penaltyApplies) = TierUtils
            .checkNavigationStatus(
                loyalty.lastVerificationTime,
                block.timestamp
            );

        if (!canNavigate) {
            uint256 timeRemaining = (loyalty.lastVerificationTime +
                TierConstants.VERIFICATION_INTERVAL) - block.timestamp;
            revert VerificationTooEarly(timeRemaining);
        }

        // Apply penalty if late
        if (penaltyApplies) {
            _applyPenalty(loyalty, daysLate);
        }

        // Update status
        loyalty.lastVerificationTime = block.timestamp;
        loyalty.verificationCount++;
        loyalty.currentAmount = amount;
        loyalty.lastTier = delegationTier;

        // Update consecutive weeks
        if (!penaltyApplies) {
            loyalty.consecutiveWeeks++;
        } else {
            loyalty.consecutiveWeeks = 1; // Reset on penalty
        }

        // Update highest tier
        uint256 tierValue = delegationTier.tierToUint();
        if (tierValue > loyalty.highestTierReached) {
            loyalty.highestTierReached = tierValue;
        }

        // Calculate points
        uint256 pointsEarned = TierUtils.calculateTotalPoints(
            delegationTier,
            loyalty.consecutiveWeeks
        );

        // Update points and level
        loyalty.totalPoints += pointsEarned;
        seasonalPoints[claimant] += pointsEarned;

        // Calculate level
        (uint256 newLevel, ) = TierUtils.calculateLevel(loyalty.totalPoints);
        loyalty.currentLevel = newLevel;

        // Check legacy eligibility
        _checkLegacyEligibility(loyalty);

        // Emit events
        _emitLoyaltyEvents(
            claimant,
            loyalty,
            previousLevel,
            newLevel,
            pointsEarned
        );
    }

    /**
     * @notice Apply penalty for late verification
     */
    function _applyPenalty(
        LoyaltyInfo storage loyalty,
        uint256 daysLate
    ) internal {
        uint256 penaltyRate = TierUtils.calculatePenalty(daysLate);
        uint256 pointsToLose = (loyalty.totalPoints * penaltyRate) / 10000;

        if (pointsToLose > loyalty.totalPoints) {
            loyalty.totalPoints = 0;
        } else {
            loyalty.totalPoints -= pointsToLose;
        }

        loyalty.consecutiveWeeks = 0; // Reset streak
    }

    /**
     * @notice Check legacy eligibility
     */
    function _checkLegacyEligibility(LoyaltyInfo storage loyalty) internal {
        bool timeQualified = block.timestamp >=
            loyalty.firstClaimTimestamp + LOYALTY_PERIOD;
        bool verificationsQualified = loyalty.verificationCount >=
            MINIMUM_VERIFICATIONS;

        if (
            timeQualified && verificationsQualified && !loyalty.eligibleForBonus
        ) {
            loyalty.eligibleForBonus = true;
        }
    }

    /**
     * @notice Emit loyalty events
     */
    function _emitLoyaltyEvents(
        address claimant,
        LoyaltyInfo storage loyalty,
        uint256 previousLevel,
        uint256 newLevel,
        uint256 pointsEarned
    ) internal {
        // Level up event
        if (newLevel > previousLevel) {
            emit LevelUp(
                claimant,
                previousLevel,
                newLevel,
                loyalty.totalPoints
            );
        }

        // Loyalty verified event
        emit LoyaltyVerified(
            claimant,
            loyalty.verificationCount,
            pointsEarned,
            loyalty.totalPoints,
            newLevel,
            block.timestamp
        );

        // Milestone events
        if (loyalty.verificationCount % 3 == 0) {
            emit LoyaltyMilestoneReached(
                claimant,
                loyalty.verificationCount,
                pointsEarned
            );
        }

        // Streak bonus event
        if (loyalty.consecutiveWeeks > 1) {
            emit StreakBonus(
                claimant,
                loyalty.consecutiveWeeks,
                TierUtils.getStreakMultiplier(loyalty.consecutiveWeeks)
            );
        }
    }
}
