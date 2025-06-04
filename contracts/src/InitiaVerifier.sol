// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";

import {InitiaProver} from "./InitiaProver.sol";
import {AddressUtils} from "./AddressUtils.sol";

/**
 * @title InitiaVerifier
 * @notice Verifier contract for Initia delegation proofs with NFT rewards
 * @dev Verifies proofs from InitiaProver and mints NFTs for qualified delegators
 */
contract InitiaVerifier is Verifier, ERC721 {
    using AddressUtils for string;

    address public prover;

    // Track claimed addresses to prevent double claiming
    mapping(string => bool) public claimedBech32Addresses;
    mapping(address => bool) public claimedEthAddresses;
    mapping(string => uint256) public bech32ToTokenId;

    // Events
    event QualificationClaimed(address indexed claimer, string bech32Address, uint256 tokenId);

    constructor(address _prover) ERC721("InitiaDelegatorNFT", "IDNFT") {
        prover = _prover;
    }

    /**
     * @notice Verify qualification proof and mint NFT
     * @param proof The proof from InitiaProver
     * @param bech32Address The verified bech32 address
     */
    function claimQualification(Proof calldata proof, string memory bech32Address)
        public
        onlyVerified(prover, InitiaProver.proveQualification.selector)
    {
        address claimant = msg.sender;

        require(!claimedBech32Addresses[bech32Address], "Already claimed for this bech32 address");
        require(!claimedEthAddresses[claimant], "Already claimed for this Ethereum address");

        uint256 tokenId = uint256(keccak256(abi.encodePacked("qualification_", bech32Address)));
        require(_ownerOf(tokenId) == address(0), "Qualification token already minted");

        // Mark as claimed
        claimedBech32Addresses[bech32Address] = true;
        claimedEthAddresses[claimant] = true;
        bech32ToTokenId[bech32Address] = tokenId;

        // Mint qualification NFT to the caller
        _safeMint(claimant, tokenId);

        emit QualificationClaimed(claimant, bech32Address, tokenId);
    }

    /**
     * @notice Verify hex address against claimer (using library)
     * @param hexAddress The hex address to verify
     * @param claimer The expected address
     * @return Whether they match
     */
    function verifyHexAddress(string memory hexAddress, address claimer) public pure returns (bool) {
        if (!hexAddress.isValidHexAddress()) {
            return false;
        }
        return hexAddress.hexStringToAddress() == claimer;
    }

    /**
     * @notice Check if bech32 address has claimed
     * @param bech32Address The bech32 address to check
     * @return Whether the address has claimed
     */
    function hasClaimedBech32(string memory bech32Address) external view returns (bool) {
        return claimedBech32Addresses[bech32Address];
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
     * @notice Get token ID for bech32 address
     * @param bech32Address The bech32 address
     * @return tokenId The associated token ID
     */
    function getTokenId(string memory bech32Address) external view returns (uint256) {
        return bech32ToTokenId[bech32Address];
    }
}
