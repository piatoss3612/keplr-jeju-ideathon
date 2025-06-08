"use client";

import { useKeplrContext } from "@/context/KeplrProvider";
import { useOrbitChronicle } from "@/context/OrbitChronicleProvider";
import { useOrbitChronicleData } from "@/hooks/useOrbitChronicleData";

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
  const { eligibilityData, tierInfo, canRegister, canUpdate } =
    useOrbitChronicle();
  const orbitData = useOrbitChronicleData();

  if (!eligibilityData || !tierInfo) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-yellow-500/5 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            NO ELIGIBILITY DATA
          </h2>
          <p className="text-orange-200/80 text-lg mb-8">
            Eligibility verification required before registration
          </p>

          <button
            onClick={onBackToCheck}
            className="group relative overflow-hidden bg-gradient-to-r from-gray-600/20 to-gray-500/20 
                     hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/50 hover:border-gray-400/70 
                     text-gray-400 hover:text-gray-300 font-bold py-4 px-8 rounded-2xl transition-all duration-500 
                     transform hover:scale-[1.02] shadow-lg shadow-gray-500/20 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-lg transition-all duration-300 group-hover:-rotate-12">
                ←
              </span>
              <span className="font-orbitron tracking-wider">
                RETURN TO SCANNER
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const isUpdate = orbitData.hasNFT;
  const actionText = isUpdate
    ? "UPDATE LOYALTY STATUS"
    : "REGISTER FOR ORBITCHRONICLE";
  const descriptionText = isUpdate
    ? "Refresh loyalty verification to continue earning rewards"
    : "Initialize with current delegation tier to start earning rewards";

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="text-7xl mb-6 animate-pulse">
          {isUpdate ? "🔄" : "📝"}
        </div>
        <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          {actionText}
        </h2>
        <p className="text-purple-200/80 text-lg">{descriptionText}</p>
      </div>

      {/* Enhanced Tier Information Card */}
      <div className="bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-400/70 rounded-2xl p-8 transition-all duration-300 shadow-lg shadow-purple-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative mr-4">
              <div className="text-5xl animate-pulse">{tierInfo.tierEmoji}</div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-orbitron font-bold text-purple-300 tracking-wider mb-2">
                {tierInfo.tierName} TIER
              </h3>
              <p className="text-purple-200/80">
                Your delegation classification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6 text-center">
              <span className="text-purple-200/80 text-sm font-orbitron tracking-wider block mb-2">
                DELEGATION AMOUNT
              </span>
              <p className="text-white font-jetbrains font-bold text-xl">
                {(
                  Number(eligibilityData.delegationAmount) / 1_000_000
                ).toLocaleString()}{" "}
                INIT
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6 text-center">
              <span className="text-purple-200/80 text-sm font-orbitron tracking-wider block mb-2">
                TIER MULTIPLIER
              </span>
              <p className="text-purple-300 font-jetbrains font-bold text-xl">
                {tierInfo.currentTier === 0
                  ? "1X"
                  : tierInfo.currentTier === 1
                  ? "3X"
                  : tierInfo.currentTier === 2
                  ? "8X"
                  : "20X"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Current Status (for updates) */}
      {isUpdate && orbitData && (
        <div className="bg-black/40 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="text-3xl animate-pulse">🎖️</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-cyan-300 font-orbitron font-bold text-lg tracking-wider">
                CURRENT NFT STATUS
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                <span className="text-cyan-200/80 text-xs font-orbitron tracking-wider block mb-1">
                  TOKEN ID
                </span>
                <p className="text-cyan-300 font-bold">
                  #{orbitData.tokenId.toString()}
                </p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                <span className="text-cyan-200/80 text-xs font-orbitron tracking-wider block mb-1">
                  CURRENT SCORE
                </span>
                <p className="text-cyan-300 font-bold">
                  {orbitData.currentScore.toString()} PTS
                </p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                <span className="text-cyan-200/80 text-xs font-orbitron tracking-wider block mb-1">
                  STATUS
                </span>
                <p
                  className={`font-bold font-orbitron ${
                    orbitData.scoreActive ? "text-green-400" : "text-orange-400"
                  }`}
                >
                  {orbitData.scoreActive ? "ACTIVE" : "INACTIVE"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced What Happens Next */}
      <div className="bg-black/40 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="text-3xl animate-pulse">ℹ️</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-yellow-300 font-orbitron font-bold text-lg tracking-wider">
              PROTOCOL EXECUTION SEQUENCE
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-200 text-sm font-orbitron">
                Chainlink Functions request will verify delegation
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <span className="text-yellow-200 text-sm font-orbitron">
                Verification process typically takes 1-2 minutes
              </span>
            </div>
            {isUpdate ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                  <span className="text-yellow-200 text-sm font-orbitron">
                    Loyalty status refreshed for another 14 days
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-yellow-200 text-sm font-orbitron">
                    Scoring reactivated if currently inactive
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                  <span className="text-yellow-200 text-sm font-orbitron">
                    NFT minted to wallet upon successful verification
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-yellow-200 text-sm font-orbitron">
                    Loyalty point accumulation begins immediately
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="space-y-6">
        <button
          onClick={onRegisterOrUpdate}
          disabled={isRegistering || (!canRegister && !canUpdate)}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 
                   hover:from-green-400/30 hover:via-emerald-400/30 hover:to-cyan-400/30
                   disabled:from-gray-600/20 disabled:via-gray-500/20 disabled:to-gray-600/20
                   border border-green-400/50 hover:border-green-300/70 disabled:border-gray-500/30
                   text-green-300 hover:text-green-200 disabled:text-gray-500 font-bold py-6 px-8 
                   rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:cursor-not-allowed 
                   shadow-lg shadow-green-400/25 hover:shadow-green-400/40 disabled:shadow-none backdrop-blur-sm
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                   before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                   hover:before:translate-x-[100%] before:transition-transform before:duration-700 disabled:before:hidden"
        >
          <div className="relative z-10 flex items-center justify-center space-x-4">
            {isRegistering ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-400 border-t-transparent"></div>
                <span className="font-orbitron tracking-wider">
                  {isUpdate ? "UPDATING LOYALTY..." : "REGISTERING..."}
                </span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                  {isUpdate ? "🔄" : "🚀"}
                </span>
                <span className="font-orbitron tracking-wider text-lg">
                  {isUpdate ? "UPDATE LOYALTY" : "REGISTER NOW"}
                </span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </>
            )}
          </div>
        </button>

        <button
          onClick={onBackToCheck}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-gray-600/20 to-gray-500/20 
                   hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/50 hover:border-gray-400/70 
                   text-gray-400 hover:text-gray-300 font-bold py-4 px-6 rounded-2xl transition-all duration-500 
                   transform hover:scale-[1.02] shadow-lg shadow-gray-500/20 backdrop-blur-sm
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                   before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                   hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        >
          <div className="relative z-10 flex items-center justify-center space-x-3">
            <span className="text-lg transition-all duration-300 group-hover:-rotate-12">
              ←
            </span>
            <span className="font-orbitron tracking-wider">
              BACK TO ELIGIBILITY CHECK
            </span>
          </div>
        </button>
      </div>

      {/* Enhanced Disable Reason */}
      {!canRegister && !canUpdate && (
        <div className="bg-black/40 backdrop-blur-md border border-orange-400/50 hover:border-orange-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="text-3xl animate-bounce">⚠️</div>
              <div>
                <h3 className="text-orange-300 font-orbitron font-bold tracking-wider mb-2">
                  ACTION NOT AVAILABLE
                </h3>
                <p className="text-orange-200/80">
                  {!eligibilityData.isQualified
                    ? "Delegation requirements not met"
                    : orbitData?.hasNFT && orbitData?.scoreActive
                    ? "Loyalty status is already active"
                    : "Unable to proceed at this time"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
