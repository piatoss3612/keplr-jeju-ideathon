// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

import {OrbitProver} from "./OrbitProver.sol";
import {ValidationUtils} from "./libraries/ValidationUtils.sol";
import {LoyaltySystem} from "./libraries/LoyaltySystem.sol";
import {DelegationTier, TierConstants, TierUtils} from "./Types.sol";
import {IOrbitVerifier} from "./interfaces/IOrbitVerifier.sol";
import {ILoyaltySystem} from "./interfaces/ILoyaltySystem.sol";

/**
 * @title OrbitVerifier
 * @notice Stellar verification contract for Initia delegation proofs with tiered NFT rewards
 * @dev Verifies cosmic proofs from OrbitProver and mints NFTs based on delegation tiers
 * @dev Includes orbital penalty system to maintain navigation discipline
 */
contract OrbitVerifier is ERC721, IOrbitVerifier {
    using ValidationUtils for uint256;
    using ValidationUtils for string;
    using TierUtils for DelegationTier;
    using TierUtils for uint256;

    // ==================== STATE VARIABLES ====================

    /// @notice Address of the stellar prover contract
    address public immutable prover;

    // Core tracking mappings
    mapping(address => bool) public claimedEthAddresses;
    mapping(uint256 => DelegationTier) public tokenTier;
    mapping(uint256 => uint256) public tokenAmount;
    mapping(uint256 => address) public tokenClaimant;

    // Loyalty system
    mapping(address => ILoyaltySystem.LoyaltyInfo) public loyaltyStatus;
    mapping(address => uint256) public loyaltyMultiplier; // Legacy: 100 = 1x, 200 = 2x

    // Seasonal tracking
    mapping(address => uint256) public seasonalPoints;
    mapping(uint256 => address) public topPlayers;
    uint256 public currentSeason = 1;
    uint256 public seasonStartTime;

    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when verification too early
    /// @param timeRemaining Time remaining until next verification allowed
    error VerificationTooEarly(uint256 timeRemaining);

    /// @notice Thrown when staking amount decreased significantly
    /// @param previousAmount Previous staking amount
    /// @param currentAmount Current staking amount
    error StakingAmountDecreased(uint256 previousAmount, uint256 currentAmount);

    // ==================== EVENTS (From ILoyaltySystem) ====================
    // Note: These events are also defined in ILoyaltySystem interface
    // but Solidity requires re-declaration in implementing contracts

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

    event LoyaltyMilestoneReached(
        address indexed user,
        uint256 milestone,
        uint256 reward
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

    event LevelUp(
        address indexed user,
        uint256 previousLevel,
        uint256 newLevel,
        uint256 totalPoints
    );

    // ==================== CONSTRUCTOR ====================

    constructor(address _prover) ERC721("OrbitNavigatorNFT", "OND") {
        if (_prover == address(0)) revert InvalidClaimantAddress();
        prover = _prover;
        seasonStartTime = block.timestamp;
    }

    function tokenURI(
        uint256
    ) public view virtual override returns (string memory) {
        return
            "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/bafkreigcz7at4vvsb27zzl4njmplthcdzn5vgtblv4akne2mr3aarsarqy";
    }

    // ==================== MAIN CLAIM FUNCTIONS ====================

    /**
     * @notice Claim qualification with automatic tier detection
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @param amount The delegation amount in wei
     */
    function claimQualification(
        address claimant,
        uint256 tier,
        uint256 amount
    ) external {
        DelegationTier delegationTier = tier.validateAndConvertTier();
        _claimQualification(claimant, delegationTier, amount);
    }

    /**
     * @notice Claim specific tier qualification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The verified tier (same as requested in prover)
     * @param amount The delegation amount in wei
     */
    function claimSpecificTier(
        address claimant,
        uint256 tier,
        uint256 amount
    ) external {
        DelegationTier delegationTier = tier.validateAndConvertTier();
        _claimQualification(claimant, delegationTier, amount);
    }

    /**
     * @notice Re-verify staking status with penalty system for late verification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier
     * @param amount The current delegation amount
     */
    function verifyLoyalty(
        address claimant,
        uint256 tier,
        uint256 amount
    ) external {
        if (claimant != msg.sender) {
            revert UnauthorizedClaimant(claimant, msg.sender);
        }

        ILoyaltySystem.LoyaltyInfo storage loyalty = loyaltyStatus[claimant];

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

        DelegationTier delegationTier = tier.validateAndConvertTier();
        (
            uint256 pointsEarned,
            uint256[4] memory penaltyInfo,
            uint256 previousLevel,
            uint256 newLevel
        ) = LoyaltySystem.updateLoyaltyData(loyalty, delegationTier, amount);

        // Update seasonal points
        seasonalPoints[claimant] += pointsEarned;

        // Emit penalty event if applicable
        if (penaltyInfo[0] > 0) {
            // daysLate > 0
            emit PenaltyApplied(
                claimant,
                penaltyInfo[0], // daysLate
                penaltyInfo[1], // penaltyRate
                penaltyInfo[2], // pointsLost
                penaltyInfo[3] == 1 // streakReset
            );
        }

        // Emit level up event if applicable
        if (newLevel > previousLevel) {
            emit LevelUp(
                claimant,
                previousLevel,
                newLevel,
                loyalty.totalPoints
            );
        }

        // Emit events
        _emitLoyaltyEvents(claimant, loyalty, pointsEarned);
    }

    /**
     * @notice Claim 21-day loyalty bonus (special NFT + multiplier)
     */
    function claimLoyaltyBonus() external {
        ILoyaltySystem.LoyaltyInfo storage loyalty = loyaltyStatus[msg.sender];

        (bool eligible, uint256 timeRemaining, ) = LoyaltySystem
            .getLoyaltyBonusEligibility(loyalty);

        if (!eligible) {
            if (timeRemaining > 0) {
                revert VerificationTooEarly(timeRemaining);
            } else {
                revert AlreadyClaimed(msg.sender);
            }
        }

        loyalty.bonusClaimed = true;

        // Update loyalty multiplier
        loyaltyMultiplier[msg.sender] = LoyaltySystem.updateLoyaltyMultiplier(
            loyaltyMultiplier[msg.sender]
        );

        // Mint special loyalty NFT
        uint256 bonusTokenId = LoyaltySystem.generateTokenId(
            "loyalty_bonus_",
            msg.sender,
            DelegationTier.Galaxy,
            loyalty.currentAmount
        );

        _safeMint(msg.sender, bonusTokenId);

        // Store special metadata for loyalty NFT
        tokenTier[bonusTokenId] = DelegationTier.Galaxy;
        tokenAmount[bonusTokenId] = loyalty.currentAmount;
        tokenClaimant[bonusTokenId] = msg.sender;

        emit LoyaltyBonusClaimed(
            msg.sender,
            loyaltyMultiplier[msg.sender],
            bonusTokenId
        );
    }

    // ==================== INTERNAL FUNCTIONS ====================

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
        // Security validations
        if (claimant != msg.sender) {
            revert UnauthorizedClaimant(claimant, msg.sender);
        }
        if (claimant == address(0)) revert InvalidClaimantAddress();
        if (claimedEthAddresses[claimant]) revert AlreadyClaimed(claimant);

        // Generate unique token ID
        uint256 tokenId = LoyaltySystem.generateTokenId(
            "qualification_",
            claimant,
            tier,
            amount
        );

        // Ensure token doesn't already exist
        if (_ownerOf(tokenId) != address(0)) {
            revert TokenAlreadyExists(tokenId);
        }

        // Mark as claimed and store metadata
        claimedEthAddresses[claimant] = true;
        tokenTier[tokenId] = tier;
        tokenAmount[tokenId] = amount;
        tokenClaimant[tokenId] = claimant;

        // Initialize loyalty tracking
        ILoyaltySystem.LoyaltyInfo storage loyalty = loyaltyStatus[claimant];
        LoyaltySystem.initializeLoyalty(loyalty, tier, amount);

        // Update seasonal points
        seasonalPoints[claimant] = loyalty.totalPoints;

        // Mint qualification NFT
        _safeMint(claimant, tokenId);

        emit QualificationClaimed(claimant, tokenId, tier, amount);
        emit LoyaltyVerified(
            claimant,
            1,
            loyalty.totalPoints,
            loyalty.totalPoints,
            loyalty.currentLevel,
            block.timestamp
        );
    }

    /**
     * @notice Emit loyalty-related events
     * @param user The user address
     * @param loyalty The loyalty info
     * @param pointsEarned Points earned this verification
     */
    function _emitLoyaltyEvents(
        address user,
        ILoyaltySystem.LoyaltyInfo storage loyalty,
        uint256 pointsEarned
    ) internal {
        emit LoyaltyVerified(
            user,
            loyalty.verificationCount,
            pointsEarned,
            loyalty.totalPoints,
            loyalty.currentLevel,
            block.timestamp
        );

        // Milestone events
        if (loyalty.verificationCount % 3 == 0) {
            emit LoyaltyMilestoneReached(
                user,
                loyalty.verificationCount,
                pointsEarned
            );
        }

        // Streak bonus event
        if (loyalty.consecutiveWeeks > 1) {
            emit StreakBonus(
                user,
                loyalty.consecutiveWeeks,
                TierUtils.getStreakMultiplier(loyalty.consecutiveWeeks)
            );
        }
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get NFT metadata by token ID
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
        ILoyaltySystem.LoyaltyInfo memory loyalty = loyaltyStatus[user];
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
     */
    function getNextVerificationTime(
        address user
    ) external view returns (bool canVerify, uint256 nextVerificationTime) {
        return LoyaltySystem.getNextVerificationTime(loyaltyStatus[user]);
    }

    /**
     * @notice Get loyalty bonus eligibility information
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
        return LoyaltySystem.getLoyaltyBonusEligibility(loyaltyStatus[user]);
    }

    /**
     * @notice Get user's effective loyalty multiplier
     */
    function getLoyaltyMultiplier(
        address user
    ) external view returns (uint256 multiplier) {
        return loyaltyMultiplier[user] == 0 ? 100 : loyaltyMultiplier[user];
    }

    /**
     * @notice Check if Ethereum address has claimed
     */
    function hasClaimedEth(address ethAddress) external view returns (bool) {
        return claimedEthAddresses[ethAddress];
    }

    /**
     * @notice Get tier name as string
     */
    function getTierName(
        uint256 tier
    ) external pure returns (string memory name) {
        return tier.validateAndConvertTier().getTierName();
    }

    /**
     * @notice Get loyalty system constants
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
        return (
            TierConstants.VERIFICATION_INTERVAL,
            TierConstants.LOYALTY_PERIOD,
            TierConstants.MINIMUM_VERIFICATIONS
        );
    }
}
