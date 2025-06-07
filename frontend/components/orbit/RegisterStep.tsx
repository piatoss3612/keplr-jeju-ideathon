"use client";

import { useKeplrContext } from "@/context/KeplrProvider";
import { useOrbitRewards } from "@/context/OrbitRewardsProvider";

interface RegisterStepProps {
  keplr: ReturnType<typeof useKeplrContext>;
  isRegistering: boolean;
  onRegisterOrUpdate: () => void;
  onBackToCheck: () => void;
}

export default function RegisterStep({
  isRegistering,
  onRegisterOrUpdate,
  onBackToCheck,
}: RegisterStepProps) {
  const { eligibilityData, tierInfo, userStatus, canRegister, canUpdate } =
    useOrbitRewards();

  if (!eligibilityData || !tierInfo) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          No Eligibility Data
        </h2>
        <p className="text-orange-200 mb-6">
          Please go back and check your eligibility first
        </p>
        <button
          onClick={onBackToCheck}
          className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
        >
          ← Back to Check
        </button>
      </div>
    );
  }

  const isUpdate = userStatus?.hasUserNFT;
  const actionText = isUpdate
    ? "Update Loyalty Status"
    : "Register for OrbitRewards";
  const descriptionText = isUpdate
    ? "Refresh your loyalty verification to continue earning rewards"
    : "Register with your current delegation tier to start earning rewards";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{isUpdate ? "🔄" : "📝"}</div>
        <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
          {actionText}
        </h2>
        <p className="text-cyan-200 mb-6">{descriptionText}</p>
      </div>

      {/* Tier Information Card */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">{tierInfo.tierEmoji}</div>
          <div className="text-center">
            <h3 className="text-2xl font-orbitron font-bold text-purple-300">
              {tierInfo.tierName} Tier
            </h3>
            <p className="text-purple-200 text-sm">Your delegation tier</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 text-sm">
          <div className="text-center">
            <span className="text-gray-400 block">Delegation Amount</span>
            <p className="text-white font-jetbrains text-lg">
              {(
                Number(eligibilityData.delegationAmount) / 1_000_000
              ).toLocaleString()}{" "}
              INIT
            </p>
          </div>
          <div className="text-center">
            <span className="text-gray-400 block">Tier Multiplier</span>
            <p className="text-purple-300 font-jetbrains text-lg">
              {tierInfo.currentTier === 0
                ? "1x"
                : tierInfo.currentTier === 1
                ? "3x"
                : tierInfo.currentTier === 2
                ? "8x"
                : "20x"}
            </p>
          </div>
        </div>
      </div>

      {/* Current Status (for updates) */}
      {isUpdate && userStatus && (
        <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">📊</div>
            <h3 className="text-cyan-300 font-orbitron font-medium">
              Current Progress
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Score</span>
              <p className="text-cyan-300 font-jetbrains">
                {userStatus.currentScore.toString()} points
              </p>
            </div>
            <div>
              <span className="text-gray-400">Season Points</span>
              <p className="text-cyan-300 font-jetbrains">
                {userStatus.seasonPoints.toString()} points
              </p>
            </div>
            <div>
              <span className="text-gray-400">Seasons Completed</span>
              <p className="text-cyan-300 font-jetbrains">
                {userStatus.seasonsCompleted.toString()}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Status</span>
              <p
                className={`font-jetbrains ${
                  userStatus.scoreActive ? "text-green-400" : "text-orange-400"
                }`}
              >
                {userStatus.scoreActive ? "Active" : "Needs Update"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What Happens Next */}
      <div className="bg-slate-900/50 border border-yellow-400/40 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-2xl">ℹ️</div>
          <h3 className="text-yellow-300 font-orbitron font-medium">
            What Happens Next
          </h3>
        </div>

        <div className="space-y-2 text-sm text-yellow-200">
          <p>
            • A Chainlink Functions request will be sent to verify your
            delegation
          </p>
          <p>• The verification process typically takes 1-2 minutes</p>
          {isUpdate ? (
            <>
              <p>• Your loyalty status will be refreshed for another 14 days</p>
              <p>• Your scoring will be reactivated if currently inactive</p>
            </>
          ) : (
            <>
              <p>
                • An NFT will be minted to your wallet upon successful
                verification
              </p>
              <p>• You&apos;ll start earning loyalty points immediately</p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onRegisterOrUpdate}
          disabled={isRegistering || (!canRegister && !canUpdate)}
          className="group relative w-full bg-green-900/30 hover:bg-green-800/40 
                     disabled:bg-gray-600/20 border border-green-400/40 
                     hover:border-green-400/60 disabled:border-gray-500/40 
                     text-green-300 hover:text-green-200 disabled:text-gray-400 
                     font-semibold py-4 px-6 rounded-xl transition-all duration-300 
                     transform hover:scale-105 disabled:hover:scale-100 
                     disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 
                     backdrop-blur-sm font-orbitron"
        >
          {isRegistering ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-300 mr-3"></div>
              {isUpdate ? "Updating Loyalty..." : "Registering..."}
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                {isUpdate ? "🔄" : "🚀"}
              </span>
              <span>{isUpdate ? "Update Loyalty" : "Register Now"}</span>
            </div>
          )}
          {!isRegistering && (
            <div
              className="absolute inset-0 rounded-xl bg-green-400/0 group-hover:bg-green-400/10 
                            transition-all duration-300 pointer-events-none"
            ></div>
          )}
        </button>

        <button
          onClick={onBackToCheck}
          className="w-full px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
        >
          ← Back to Check Eligibility
        </button>
      </div>

      {/* Disable Reason */}
      {!canRegister && !canUpdate && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-orange-300 font-orbitron font-medium">
                Action Not Available
              </h3>
              <p className="text-orange-200 text-sm">
                {!eligibilityData.isQualified
                  ? "You don&apos;t meet the delegation requirements"
                  : userStatus?.hasUserNFT && userStatus?.scoreActive
                  ? "Your loyalty status is already active"
                  : "Unable to proceed at this time"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
