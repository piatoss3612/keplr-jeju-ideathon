"use client";

import { useState } from "react";
import { useCallProver, useWaitForProvingResult } from "@vlayer/react";
import WalletConnect from "./WalletConnect";
import { PROVER_ADDRESS } from "../utils/constants";
import { PROVER_ABI } from "../utils/abis";

export default function VlayerDemo() {
  const [delegatorAddress, setDelegatorAddress] = useState("");
  const [validatorAddress, setValidatorAddress] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("5000000"); // 5 INIT tokens

  // useCallProver hook to initiate proving
  const {
    callProver,
    data: proofHash,
    status: proverStatus,
    error: proverError,
    isIdle: isProverIdle,
    isPending: isProverPending,
    isReady: isProverReady,
    isError: isProverError,
  } = useCallProver({
    address: PROVER_ADDRESS,
    proverAbi: PROVER_ABI,
    functionName: "main",
  });

  // useWaitForProvingResult hook to wait for proof completion
  const {
    data: proof,
    error: proofError,
    status: proofStatus,
    isIdle: isProofIdle,
    isPending: isProofPending,
    isReady: isProofReady,
    isError: isProofError,
  } = useWaitForProvingResult(proofHash);

  const handleProve = async () => {
    if (!delegatorAddress || !validatorAddress) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await callProver([
        delegatorAddress,
        validatorAddress,
        BigInt(minimumAmount),
      ]);
    } catch (error) {
      console.error("Failed to call prover:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        vlayer Initia Delegation Verification
      </h2>

      {/* Wallet Connection */}
      <div className="mb-6">
        <WalletConnect />
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delegator Address (Bech32)
          </label>
          <input
            type="text"
            value={delegatorAddress}
            onChange={(e) => setDelegatorAddress(e.target.value)}
            placeholder="init1..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validator Address (Bech32)
          </label>
          <input
            type="text"
            value={validatorAddress}
            onChange={(e) => setValidatorAddress(e.target.value)}
            placeholder="initvaloper1..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Amount (micro INIT)
          </label>
          <input
            type="text"
            value={minimumAmount}
            onChange={(e) => setMinimumAmount(e.target.value)}
            placeholder="5000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleProve}
        disabled={isProverPending || isProofPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProverPending
          ? "Initiating Proof..."
          : isProofPending
          ? "Generating Proof..."
          : "Verify Delegation"}
      </button>

      {/* Status Display */}
      <div className="mt-6 space-y-3">
        {/* Prover Status */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Prover Status:</h3>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                isProverIdle
                  ? "bg-gray-200 text-gray-600"
                  : isProverPending
                  ? "bg-yellow-200 text-yellow-800"
                  : isProverReady
                  ? "bg-green-200 text-green-800"
                  : isProverError
                  ? "bg-red-200 text-red-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {proverStatus}
            </span>
            {proofHash && (
              <span className="text-xs text-gray-500 font-mono break-all">
                Hash: {proofHash.hash.slice(0, 16)}...
              </span>
            )}
          </div>
          {proverError && (
            <p className="text-red-600 text-sm mt-2">
              Error: {proverError.message}
            </p>
          )}
        </div>

        {/* Proof Status */}
        {proofHash && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Proof Status:</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isProofIdle
                    ? "bg-gray-200 text-gray-600"
                    : isProofPending
                    ? "bg-yellow-200 text-yellow-800"
                    : isProofReady
                    ? "bg-green-200 text-green-800"
                    : isProofError
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {proofStatus}
              </span>
            </div>
            {proofError && (
              <p className="text-red-600 text-sm mt-2">
                Error: {proofError.message}
              </p>
            )}
            {proof ? (
              <div className="mt-2">
                <p className="text-green-600 text-sm font-semibold">
                  ✓ Proof Generated Successfully!
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    View Proof Data
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(proof, null, 2)}
                  </pre>
                </details>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Make sure you have a wallet connected (MetaMask)</li>
          <li>Enter a valid Initia delegator address (bech32 format)</li>
          <li>Enter the validator address you want to verify</li>
          <li>Set the minimum delegation amount (default: 5 INIT)</li>
          <li>Click &quot;Verify Delegation&quot; to generate a proof</li>
        </ol>
        <p className="text-xs text-blue-600 mt-2">
          Note: You need to deploy your vlayer prover contract and update the
          PROVER_ADDRESS constant.
        </p>
      </div>
    </div>
  );
}
