"use client";

import { useKeplrContext } from "@/context/KeplrProvider";
import { formatUnits } from "viem";
import {
  getTierName,
  formatInitAmount as formatTierAmount,
} from "@/utils/tierUtils";
import { useOrbitRewards } from "@/context/OrbitRewardsProvider";

interface CheckEligibilityProps {
  onEligibilityConfirmed: () => void;
}

export default function CheckEligibility({
  onEligibilityConfirmed,
}: CheckEligibilityProps) {
  const keplr = useKeplrContext();
  const {
    eligibilityData,
    errorData,
    isChecking,
    tierInfo,
    userStatus,
    isLoadingStatus,
    checkEligibility,
    clearAll,
  } = useOrbitRewards();

  const formatInitAmount = (amount: string) => {
    return formatUnits(BigInt(amount), 6).toString();
  };

  const handleCheckEligibility = async () => {
    if (!keplr.isConnected || !keplr.account) {
      alert("Please connect your Keplr wallet first");
      return;
    }

    await checkEligibility(keplr.account.address);
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
          Verify your delegation status and tier before registration
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

      {/* Current NFT Status */}
      {!isLoadingStatus && userStatus && (
        <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">🎖️</div>
            <h3 className="text-purple-300 font-orbitron font-medium">
              Current Status
            </h3>
          </div>

          {userStatus.hasUserNFT ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-200 text-sm">NFT Holder</span>
                <span className="text-green-400 text-sm">✅ Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 text-sm">Current Score</span>
                <span className="text-purple-300 text-sm">
                  {userStatus.currentScore.toString()} pts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 text-sm">Status</span>
                <span
                  className={`text-sm ${
                    userStatus.scoreActive
                      ? "text-green-400"
                      : "text-orange-400"
                  }`}
                >
                  {userStatus.scoreActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 text-sm">
                  Seasons Completed
                </span>
                <span className="text-purple-300 text-sm">
                  {userStatus.seasonsCompleted.toString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-orange-300 text-sm">
              No NFT found - Ready to register!
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {errorData && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl mr-3">❌</div>
            <div className="text-center">
              <h3 className="text-2xl font-orbitron font-bold text-red-300">
                {errorData.error}
              </h3>
              <p className="text-sm text-red-200">{errorData.message}</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-red-600/50 hover:bg-red-600/70 text-red-200 rounded-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Check Button or Results */}
      {!eligibilityData && !errorData && (
        <div className="text-center">
          <button
            onClick={handleCheckEligibility}
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
      )}

      {/* Eligibility Results */}
      {eligibilityData && (
        <div className="space-y-6">
          {/* Eligibility Status */}
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
                  {eligibilityData.isQualified ? "Eligible!" : "Not Eligible"}
                </h3>
                <p
                  className={`text-sm ${
                    eligibilityData.isQualified
                      ? "text-green-200"
                      : "text-red-200"
                  }`}
                >
                  {eligibilityData.isQualified
                    ? "You meet the delegation requirements"
                    : "Insufficient delegation amount"}
                </p>
              </div>
            </div>

            {/* Delegation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Current Delegation:</span>
                <p className="text-white font-jetbrains">
                  {formatInitAmount(eligibilityData.delegationAmount)} INIT
                </p>
              </div>
              <div>
                <span className="text-gray-400">Required Amount:</span>
                <p className="text-white font-jetbrains">
                  {formatInitAmount(eligibilityData.requiredAmount)} INIT
                </p>
              </div>
            </div>
          </div>

          {/* Tier Information */}
          {tierInfo && eligibilityData.isQualified && (
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-3">{tierInfo.tierEmoji}</div>
                <div className="text-center">
                  <h3 className="text-2xl font-orbitron font-bold text-purple-300">
                    {tierInfo.tierName} Tier
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Your current delegation tier
                  </p>
                </div>
              </div>

              {/* Next Tier Info */}
              {tierInfo.nextTier && tierInfo.requiredAmount && (
                <div className="mt-4 p-4 bg-purple-800/30 border border-purple-400/20 rounded-lg">
                  <p className="text-purple-200 text-sm mb-2">
                    Next tier:{" "}
                    <span className="font-medium">
                      {getTierName(tierInfo.nextTier)}
                    </span>
                  </p>
                  <p className="text-purple-300 text-xs">
                    Need {formatTierAmount(tierInfo.requiredAmount)} INIT more
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          {eligibilityData.isQualified && (
            <div className="text-center">
              <button
                onClick={onEligibilityConfirmed}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-orbitron"
              >
                🚀 Continue to Registration
              </button>
            </div>
          )}

          {/* Try Again Button for Non-Eligible */}
          {!eligibilityData.isQualified && (
            <div className="text-center">
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
              >
                Check Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
