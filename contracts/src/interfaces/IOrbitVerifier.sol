// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {DelegationTier} from "../Types.sol";

/**
 * @title IOrbitVerifier
 * @notice Interface for stellar verification in the OrbitRewards ecosystem
 * @dev Defines core verification functions for delegation proofs and NFT minting
 */
interface IOrbitVerifier {
    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when user tries to claim with someone else's proof
    error UnauthorizedClaimant(address expected, address actual);

    /// @notice Thrown when address has already claimed
    error AlreadyClaimed(address claimant);

    /// @notice Thrown when trying to claim with invalid address
    error InvalidClaimantAddress();

    /// @notice Thrown when tier value is invalid
    error InvalidTier(uint256 invalidTier);

    /// @notice Thrown when token ID already exists
    error TokenAlreadyExists(uint256 tokenId);

    /// @notice Thrown when trying to access non-existent token
    error TokenNotFound(uint256 tokenId);

    // ==================== EVENTS ====================

    event QualificationClaimed(address indexed claimer, uint256 indexed tokenId, DelegationTier tier, uint256 amount);

    // ==================== MAIN FUNCTIONS ====================

    /**
     * @notice Claim qualification with automatic tier detection
     * @param proof The proof from OrbitProver.proveQualification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @param amount The delegation amount in wei
     */
    function claimQualification(Proof calldata proof, address claimant, uint256 tier, uint256 amount) external;

    /**
     * @notice Claim specific tier qualification
     * @param proof The proof from OrbitProver.proveSpecificTier
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The verified tier (same as requested in prover)
     * @param amount The delegation amount in wei
     */
    function claimSpecificTier(Proof calldata proof, address claimant, uint256 tier, uint256 amount) external;

    /**
     * @notice Re-verify staking status with penalty system for late verification
     * @param proof The proof from OrbitProver.proveQualification
     * @param claimant The verified Ethereum address (automatically bound to proof)
     * @param tier The delegation tier
     * @param amount The current delegation amount
     */
    function verifyLoyalty(Proof calldata proof, address claimant, uint256 tier, uint256 amount) external;

    /**
     * @notice Claim 21-day loyalty bonus (special NFT + multiplier)
     */
    function claimLoyaltyBonus() external;

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get NFT metadata by token ID
     * @param tokenId The token ID
     * @return tier The delegation tier
     * @return amount The delegation amount
     * @return tierName The tier name
     * @return claimant The claimant address
     */
    function getTokenMetadata(uint256 tokenId)
        external
        view
        returns (DelegationTier tier, uint256 amount, string memory tierName, address claimant);

    /**
     * @notice Check if Ethereum address has claimed
     * @param ethAddress The Ethereum address to check
     * @return Whether the address has claimed
     */
    function hasClaimedEth(address ethAddress) external view returns (bool);

    /**
     * @notice Get tier name as string
     * @param tier The tier enum value
     * @return name The tier name
     */
    function getTierName(uint256 tier) external pure returns (string memory name);
}
