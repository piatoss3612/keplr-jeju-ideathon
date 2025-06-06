"use client";

import { useState } from "react";
import { useKeplrContext } from "@/context/KeplrProvider";

interface CheckEligibilityProps {
  onEligibilityConfirmed: () => void;
}

interface EligibilityData {
  bech32Address: string;
  hexAddress: string;
  delegationAmount: string;
  requiredAmount: string;
  isQualified: boolean;
  timestamp: string;
}

interface ErrorData {
  error: string;
  message: string;
}

export default function CheckEligibility({
  onEligibilityConfirmed,
}: CheckEligibilityProps) {
  const keplr = useKeplrContext();
  const [isChecking, setIsChecking] = useState(false);
  const [eligibilityData, setEligibilityData] =
    useState<EligibilityData | null>(null);

  const checkEligibility = async () => {
    if (!keplr.isConnected || !keplr.account) {
      alert("Please connect your Keplr wallet first");
      return;
    }

    try {
      setIsChecking(true);

      const response = await fetch(
        `https://keplr-ideathon.vercel.app/verify?address=${keplr.account.address}`
      );

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorData;
        console.error("Failed to check eligibility:", errorData);
        return;
      }

      const data = (await response.json()) as EligibilityData;

      setEligibilityData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!keplr.isConnected || !keplr.account) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Wallet Required
        </h2>
        <p className="text-orange-200 mb-6">
          Please connect your Keplr wallet to check eligibility
        </p>
        <p className="text-orange-300 text-sm">
          Go to 🔗 Connect tab to connect your Keplr wallet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
          Check Eligibility
        </h2>
        <p className="text-cyan-200 mb-6">
          Verify your delegation status and tier before generating proof
        </p>
      </div>

      {/* Connected Wallet Info */}
      <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌌</div>
            <div>
              <h3 className="text-cyan-300 font-orbitron font-medium">
                Connected Account
              </h3>
              <p className="text-cyan-200 text-sm">{keplr.account.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs">Connected</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg p-3">
          <p className="text-cyan-300 text-xs font-medium mb-1">Address</p>
          <p className="text-cyan-200 text-xs font-jetbrains break-all">
            {keplr.account.address}
          </p>
        </div>
      </div>

      {/* Check Button or Results */}
      {!eligibilityData ? (
        <div className="text-center">
          <button
            onClick={checkEligibility}
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-lg font-orbitron"
          >
            {isChecking ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Checking Delegation Status...
              </div>
            ) : (
              "🔍 Check Delegation Eligibility"
            )}
          </button>

          <p className="text-purple-300 text-xs mt-4">
            This will check your INIT delegation status on Initia network
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Eligibility Results */}
          <div
            className={`border rounded-xl p-6 ${
              eligibilityData.isQualified
                ? "bg-green-500/20 border-green-400/30"
                : "bg-red-500/20 border-red-400/30"
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl mr-3">
                {eligibilityData.isQualified ? "✅" : "❌"}
              </div>
              <div className="text-center">
                <h3
                  className={`text-2xl font-orbitron font-bold ${
                    eligibilityData.isQualified
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {eligibilityData.isQualified ? "Eligible" : "Not Eligible"}
                </h3>
                <p
                  className={`text-sm ${
                    eligibilityData.isQualified
                      ? "text-green-200"
                      : "text-red-200"
                  }`}
                >
                  {eligibilityData.isQualified
                    ? "You can generate delegation proof"
                    : "Insufficient delegation amount"}
                </p>
              </div>
            </div>

            {/* Delegation Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold font-orbitron text-cyan-400">
                  {eligibilityData.delegationAmount}
                </div>
                <div className="text-xs text-cyan-300">INIT Delegated</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold font-orbitron text-pink-400">
                  {eligibilityData.requiredAmount}
                </div>
                <div className="text-xs text-pink-300">Required Amount</div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-lg font-orbitron text-purple-300 mb-1">
                Tier: {eligibilityData.isQualified ? "Silver" : "Bronze"}
              </div>
              <div className="text-sm text-gray-400">
                Minimum requirement: {eligibilityData.requiredAmount} INIT
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setEligibilityData(null);
              }}
              className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl transition-all duration-300"
            >
              Check Again
            </button>

            {eligibilityData.isQualified && (
              <button
                onClick={onEligibilityConfirmed}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-orbitron"
              >
                🚀 Continue to Generate Proof
              </button>
            )}
          </div>

          {!eligibilityData.isQualified && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4">
              <h4 className="text-yellow-300 font-orbitron font-medium mb-2">
                How to become eligible:
              </h4>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>
                  • Delegate at least {eligibilityData.requiredAmount} INIT to
                  validators
                </li>
                <li>• Wait for delegation to be confirmed on-chain</li>
                <li>• Stake with active validators for better tier</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
