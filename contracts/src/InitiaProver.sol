// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";
import {AddressUtils} from "./AddressUtils.sol";

/**
 * @title InitiaProver
 * @notice Prover contract for Initia delegation verification using vlayer Web Proofs
 * @dev Only generates proofs for qualified delegations
 */
contract InitiaProver is Prover {
    using WebProofLib for WebProof;
    using WebLib for Web;
    using AddressUtils for string;

    // API endpoint for delegation verification
    string constant API_BASE_URL = "https://keplr-ideathon.vercel.app/verify";

    // Custom error for better gas efficiency
    error DelegationNotQualified();

    /**
     * @notice Prove delegation qualification
     * @param webProof The Web Proof containing the HTTPS session transcript
     * @param bech32Address The bech32 address to verify
     * @return proof The generated proof (only if qualified)
     * @return bech32Address The verified bech32 address
     * @return claimant The Ethereum address corresponding to the hexAddress
     */
    function proveQualification(WebProof calldata webProof, string memory bech32Address)
        public
        returns (Proof memory, string memory, address)
    {
        Web memory web = webProof.verify(string.concat(API_BASE_URL, "?address=", bech32Address));

        // Only generate proof if delegation is qualified
        if (!web.jsonGetBool("isQualified")) {
            revert DelegationNotQualified();
        }

        // Convert hex string to address using AddressUtils
        string memory hexAddressString = web.jsonGetString("hexAddress");
        address claimant = hexAddressString.hexStringToAddress();

        return (proof(), web.jsonGetString("bech32Address"), claimant);
    }
}
