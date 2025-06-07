// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {DelegationTier} from "../libraries/OrbitUtils.sol";

/**
 * @title IOrbitRewards
 * @notice Main interface for the OrbitRewards system
 * @dev Core interface defining the main functionality
 */
interface IOrbitRewards {
    // ==================== STRUCTS ====================

    /// @notice Token metadata information
    struct TokenMetadata {
        DelegationTier tier;
        uint256 amount;
        string tierName;
        address claimant;
    }

    // ==================== EVENTS ====================

    event QualificationClaimed(address indexed claimer, uint256 indexed tokenId, DelegationTier tier, uint256 amount);

    // ==================== FUNCTIONS ====================

    /**
     * @notice Request delegation tier verification
     * @param bech32Address The bech32 address to verify
     * @return requestId The Chainlink request ID
     */
    function requestDelegationTier(string calldata bech32Address) external returns (bytes32 requestId);

    /**
     * @notice Get NFT metadata by token ID
     * @param tokenId The token ID
     * @return metadata The token metadata
     */
    function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory metadata);

    /**
     * @notice Check if Ethereum address has claimed
     * @param ethAddress The Ethereum address
     * @return claimed Whether the address has claimed
     */
    function hasClaimedEth(address ethAddress) external view returns (bool claimed);

    /**
     * @notice Get tier name as string
     * @param tier The tier value
     * @return name The tier name
     */
    function getTierName(uint256 tier) external pure returns (string memory name);
}
