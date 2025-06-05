// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";
import {AddressUtils} from "./AddressUtils.sol";
import {DelegationTier, TierConstants, TierUtils, StringUtils} from "./Types.sol";

/**
 * @title OrbitProver
 * @notice Stellar proof generation contract for Initia delegation verification using vlayer Web Proofs
 * @dev Generates cosmic proofs for qualified delegations with automatic tier detection
 */
contract OrbitProver is Prover {
    using WebProofLib for WebProof;
    using WebLib for Web;
    using AddressUtils for string;
    using TierUtils for uint256;
    using TierUtils for DelegationTier;
    using StringUtils for string;

    // ==================== CONSTANTS ====================

    /// @notice Mission Control API endpoint for delegation verification
    string public constant API_BASE_URL =
        "https://keplr-ideathon.vercel.app/verify";

    // ==================== CUSTOM ERRORS ====================

    /// @notice Thrown when delegation does not meet minimum qualification requirements for orbital entry
    error DelegationNotQualified(string bech32Address);

    /// @notice Thrown when delegation amount is insufficient for requested cosmic tier
    /// @param requested The requested tier level
    /// @param required The minimum amount required for the tier
    /// @param actual The actual delegation amount
    error InsufficientDelegationForTier(
        uint256 requested,
        uint256 required,
        uint256 actual
    );

    /// @notice Thrown when cosmic tier value is invalid (must be 0-3)
    /// @param invalidTier The invalid tier value provided
    error InvalidTierValue(uint256 invalidTier);

    /// @notice Thrown when bech32 address format is invalid for orbital navigation
    /// @param invalidAddress The invalid bech32 address
    error InvalidBech32Address(string invalidAddress);

    /// @notice Thrown when hex address conversion fails during navigation
    /// @param invalidHex The invalid hex address string
    error InvalidHexAddress(string invalidHex);

    /// @notice Thrown when stellar amount string parsing fails
    /// @param invalidAmount The invalid amount string
    error InvalidAmountString(string invalidAmount);

    // ==================== MAIN ORBITAL FUNCTIONS ====================

    /**
     * @notice Prove delegation qualification for orbital entry with automatic cosmic tier detection
     * @param webProof The Web Proof containing the HTTPS session transcript
     * @param bech32Address The bech32 address to verify (automatically bound to proof)
     * @return proof The generated stellar proof (bound to this specific bech32Address)
     * @return claimant The Ethereum address corresponding to the hexAddress
     * @return tier The cosmic qualification tier (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return amount The delegation amount in wei (INIT has 6 decimals)
     */
    function proveQualification(
        WebProof calldata webProof,
        string memory bech32Address
    ) public returns (Proof memory, address, uint256, uint256) {
        // Validate bech32 address format for orbital navigation
        _validateBech32Address(bech32Address);

        // The Web Proof automatically binds to the specific URL with bech32Address
        // This prevents proof replay attacks - proof is only valid for this address
        Web memory web = webProof.verify(
            string.concat(API_BASE_URL, "?address=", bech32Address)
        );

        // Extract and validate stellar delegation data
        (uint256 amount, address claimant) = _extractAndValidateData(
            web,
            bech32Address
        );

        // Determine cosmic tier based on stellar amount
        DelegationTier delegationTier = amount.getTierForAmount();
        uint256 tier = delegationTier.tierToUint();

        return (proof(), claimant, tier, amount);
    }

    /**
     * @notice Prove specific cosmic tier qualification for targeted orbital entry
     * @param webProof The Web Proof containing the HTTPS session transcript
     * @param bech32Address The bech32 address to verify (automatically bound to proof)
     * @param targetTier The target cosmic tier to prove (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     * @return proof The generated stellar proof (bound to this specific bech32Address and tier)
     * @return claimant The Ethereum address corresponding to the hexAddress
     * @return tier The verified cosmic tier (same as targetTier)
     * @return amount The delegation amount in wei
     */
    function proveSpecificTier(
        WebProof calldata webProof,
        string memory bech32Address,
        uint256 targetTier
    ) public returns (Proof memory, address, uint256, uint256) {
        // Validate inputs for cosmic navigation
        _validateBech32Address(bech32Address);
        _validateTierValue(targetTier);

        // Verify the Web Proof for this specific stellar address
        Web memory web = webProof.verify(
            string.concat(API_BASE_URL, "?address=", bech32Address)
        );

        // Extract and validate stellar delegation data
        (uint256 amount, address claimant) = _extractAndValidateData(
            web,
            bech32Address
        );

        // Verify navigator qualifies for the requested cosmic tier
        DelegationTier requestedTier = TierUtils.uintToTier(targetTier);
        if (!TierUtils.qualifiesForTier(amount, requestedTier)) {
            revert InsufficientDelegationForTier(
                targetTier,
                TierUtils.getThresholdForTier(requestedTier),
                amount
            );
        }

        return (proof(), claimant, targetTier, amount);
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @notice Validate bech32 address format
     * @param bech32Address The bech32 address to validate
     */
    function _validateBech32Address(string memory bech32Address) internal pure {
        bytes memory addrBytes = bytes(bech32Address);

        // Check minimum length and prefix
        if (
            addrBytes.length < 5 ||
            addrBytes[0] != "i" ||
            addrBytes[1] != "n" ||
            addrBytes[2] != "i" ||
            addrBytes[3] != "t" ||
            addrBytes[4] != "1"
        ) {
            revert InvalidBech32Address(bech32Address);
        }
    }

    /**
     * @notice Validate tier value range
     * @param tier The tier value to validate
     */
    function _validateTierValue(uint256 tier) internal pure {
        if (tier > 3) {
            revert InvalidTierValue(tier);
        }
    }

    /**
     * @notice Extract and validate data from web proof response
     * @param web The verified web response
     * @param bech32Address The original bech32 address for error reporting
     * @return amount The delegation amount
     * @return claimant The Ethereum address
     */
    function _extractAndValidateData(
        Web memory web,
        string memory bech32Address
    ) internal view returns (uint256 amount, address claimant) {
        // Check if delegation is qualified
        if (!web.jsonGetBool("isQualified")) {
            revert DelegationNotQualified(bech32Address);
        }

        // Extract and parse delegation amount
        string memory amountString = web.jsonGetString("delegationAmount");

        // Validate amount string before parsing
        bytes memory amountBytes = bytes(amountString);
        if (amountBytes.length == 0) {
            revert InvalidAmountString(amountString);
        }

        // Parse amount (parseStringToUint handles validation internally)
        amount = amountString.parseStringToUint();

        // Extract and convert hex address
        string memory hexAddressString = web.jsonGetString("hexAddress");

        // Validate hex address format before conversion
        if (!hexAddressString.isValidHexAddress()) {
            revert InvalidHexAddress(hexAddressString);
        }

        // Convert hex string to address
        claimant = hexAddressString.hexStringToAddress();

        return (amount, claimant);
    }

    // ==================== PUBLIC VIEW FUNCTIONS ====================

    /**
     * @notice Get the appropriate tier for a given amount
     * @param amount The delegation amount
     * @return tier The tier level (0=Asteroid, 1=Comet, 2=Star, 3=Galaxy)
     */
    function getTierForAmount(
        uint256 amount
    ) public pure returns (uint256 tier) {
        return amount.getTierForAmount().tierToUint();
    }

    /**
     * @notice Get tier name as string
     * @param tier The tier level
     * @return name The tier name
     */
    function getTierName(
        uint256 tier
    ) public pure returns (string memory name) {
        _validateTierValue(tier);
        return TierUtils.uintToTier(tier).getTierName();
    }

    /**
     * @notice Get threshold for a specific tier
     * @param tier The tier level
     * @return threshold The minimum amount required for the tier
     */
    function getThresholdForTier(
        uint256 tier
    ) public pure returns (uint256 threshold) {
        _validateTierValue(tier);
        return TierUtils.getThresholdForTier(TierUtils.uintToTier(tier));
    }

    /**
     * @notice Check if amount qualifies for a specific tier
     * @param amount The delegation amount
     * @param tier The target tier level
     * @return qualified Whether the amount qualifies for the tier
     */
    function qualifiesForTier(
        uint256 amount,
        uint256 tier
    ) public pure returns (bool qualified) {
        _validateTierValue(tier);
        return TierUtils.qualifiesForTier(amount, TierUtils.uintToTier(tier));
    }

    /**
     * @notice Get all tier thresholds
     * @return asteroid Asteroid tier threshold (5 INIT)
     * @return comet Comet tier threshold (20 INIT)
     * @return star Star tier threshold (100 INIT)
     * @return galaxy Galaxy tier threshold (1000 INIT)
     */
    function getAllTierThresholds()
        public
        pure
        returns (uint256 asteroid, uint256 comet, uint256 star, uint256 galaxy)
    {
        return (
            TierConstants.ASTEROID_THRESHOLD,
            TierConstants.COMET_THRESHOLD,
            TierConstants.STAR_THRESHOLD,
            TierConstants.GALAXY_THRESHOLD
        );
    }
}
