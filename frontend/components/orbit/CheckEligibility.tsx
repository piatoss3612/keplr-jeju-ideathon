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
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            WALLET REQUIRED
          </h2>
          <p className="text-orange-200/80 text-lg mb-8">
            Keplr wallet connection required for eligibility verification
          </p>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-4">
            <p className="text-orange-300 font-orbitron tracking-wider">
              → Navigate to{" "}
              <span className="text-orange-200 font-bold">CONNECT</span> tab to
              initialize Keplr
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="text-7xl mb-6 animate-pulse">🔍</div>
        <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          ELIGIBILITY SCANNER
        </h2>
        <p className="text-cyan-200/80 text-lg">
          Verify delegation status and tier classification
        </p>
      </div>

      {/* Enhanced Connected Wallet Info */}
      <div className="bg-black/40 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="text-3xl animate-pulse">🌌</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h3 className="text-cyan-300 font-orbitron font-bold text-lg tracking-wider">
                  COSMOS PROTOCOL
                </h3>
                <p className="text-cyan-200/80 text-sm font-orbitron">
                  {keplr.account.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-green-300 text-sm font-orbitron tracking-wider">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4">
            <p className="text-cyan-300/80 text-xs font-orbitron tracking-wider mb-2">
              WALLET ADDRESS
            </p>
            <p className="text-cyan-200 text-xs font-jetbrains break-all bg-black/30 p-2 rounded-lg border border-cyan-400/20">
              {keplr.account.address}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Current NFT Status */}
      {!isLoadingStatus && userStatus && (
        <div className="bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-400/70 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="text-3xl animate-pulse">🎖️</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-purple-300 font-orbitron font-bold text-lg tracking-wider">
                CURRENT STATUS
              </h3>
            </div>

            {userStatus.hasUserNFT ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    NFT HOLDER:
                  </span>
                  <span className="text-green-400 font-bold font-orbitron">
                    ✅ VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    CURRENT SCORE:
                  </span>
                  <span className="text-purple-300 font-bold">
                    {userStatus.currentScore.toString()} PTS
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    STATUS:
                  </span>
                  <span
                    className={`font-bold font-orbitron ${
                      userStatus.scoreActive
                        ? "text-green-400"
                        : "text-orange-400"
                    }`}
                  >
                    {userStatus.scoreActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                  <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                    SEASONS:
                  </span>
                  <span className="text-purple-300 font-bold">
                    {userStatus.seasonsCompleted.toString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4">
                <p className="text-orange-300 font-orbitron tracking-wider text-center">
                  🚀 NO NFT DETECTED - READY FOR INITIALIZATION
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {errorData && (
        <div className="bg-black/40 backdrop-blur-md border border-red-400/50 hover:border-red-400/70 rounded-2xl p-8 transition-all duration-300 shadow-lg shadow-red-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl mr-4 animate-bounce">❌</div>
              <div className="text-center">
                <h3 className="text-2xl font-orbitron font-bold text-red-300 tracking-wider mb-2">
                  {errorData.error}
                </h3>
                <p className="text-red-200/80">{errorData.message}</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={clearAll}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500/20 to-orange-500/20 
                         hover:from-red-400/30 hover:to-orange-400/30 border border-red-400/50 hover:border-red-300/70 
                         text-red-300 hover:text-red-200 font-bold py-4 px-8 rounded-2xl transition-all duration-500 
                         transform hover:scale-[1.02] shadow-lg shadow-red-400/25 hover:shadow-red-400/40 backdrop-blur-sm
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                         before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                         hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-lg transition-all duration-300 group-hover:rotate-12">
                    🔄
                  </span>
                  <span className="font-orbitron tracking-wider">
                    RETRY SCAN
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Check Button */}
      {!eligibilityData && !errorData && (
        <div className="text-center space-y-6">
          <button
            onClick={handleCheckEligibility}
            disabled={isChecking}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 
                     hover:from-cyan-400/30 hover:via-purple-400/30 hover:to-pink-400/30
                     disabled:from-gray-600/20 disabled:via-gray-500/20 disabled:to-gray-600/20
                     border border-cyan-400/50 hover:border-cyan-300/70 disabled:border-gray-500/30
                     text-cyan-300 hover:text-cyan-200 disabled:text-gray-500 font-bold py-6 px-8 
                     rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:cursor-not-allowed 
                     shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 disabled:shadow-none backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700 disabled:before:hidden"
          >
            <div className="relative z-10 flex items-center justify-center space-x-4">
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyan-400 border-t-transparent"></div>
                  <span className="font-orbitron tracking-wider">
                    SCANNING DELEGATION STATUS...
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    🔍
                  </span>
                  <span className="font-orbitron tracking-wider text-lg">
                    SCAN DELEGATION ELIGIBILITY
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </>
              )}
            </div>
          </button>

          <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4">
            <p className="text-purple-300 text-sm font-orbitron tracking-wider text-center">
              INITIA NETWORK DELEGATION VERIFICATION PROTOCOL
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Eligibility Results */}
      {eligibilityData && (
        <div className="space-y-8">
          {/* Enhanced Eligibility Status */}
          <div
            className={`bg-black/40 backdrop-blur-md rounded-2xl p-8 transition-all duration-300 shadow-lg relative overflow-hidden ${
              eligibilityData.isQualified
                ? "border border-green-400/50 hover:border-green-400/70 shadow-green-500/20"
                : "border border-red-400/50 hover:border-red-400/70 shadow-red-500/20"
            }`}
          >
            <div
              className={`absolute inset-0 ${
                eligibilityData.isQualified
                  ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5"
                  : "bg-gradient-to-br from-red-500/10 to-orange-500/5"
              }`}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="text-5xl mr-4 animate-bounce">
                  {eligibilityData.isQualified ? "✅" : "❌"}
                </div>
                <div className="text-center">
                  <h3
                    className={`text-3xl font-orbitron font-bold tracking-wider mb-2 ${
                      eligibilityData.isQualified
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {eligibilityData.isQualified ? "ELIGIBLE!" : "NOT ELIGIBLE"}
                  </h3>
                  <p
                    className={`${
                      eligibilityData.isQualified
                        ? "text-green-200/80"
                        : "text-red-200/80"
                    }`}
                  >
                    {eligibilityData.isQualified
                      ? "Delegation requirements satisfied"
                      : "Insufficient delegation detected"}
                  </p>
                </div>
              </div>

              {/* Enhanced Delegation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border ${
                    eligibilityData.isQualified
                      ? "bg-green-500/10 border-green-400/20"
                      : "bg-red-500/10 border-red-400/20"
                  }`}
                >
                  <span
                    className={`text-xs font-orbitron tracking-wider ${
                      eligibilityData.isQualified
                        ? "text-green-200/80"
                        : "text-red-200/80"
                    }`}
                  >
                    CURRENT DELEGATION:
                  </span>
                  <p className="text-white font-jetbrains font-bold text-lg">
                    {formatInitAmount(eligibilityData.delegationAmount)} INIT
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    eligibilityData.isQualified
                      ? "bg-green-500/10 border-green-400/20"
                      : "bg-red-500/10 border-red-400/20"
                  }`}
                >
                  <span
                    className={`text-xs font-orbitron tracking-wider ${
                      eligibilityData.isQualified
                        ? "text-green-200/80"
                        : "text-red-200/80"
                    }`}
                  >
                    REQUIRED AMOUNT:
                  </span>
                  <p className="text-white font-jetbrains font-bold text-lg">
                    {formatInitAmount(eligibilityData.requiredAmount)} INIT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tier Information */}
          {tierInfo && eligibilityData.isQualified && (
            <div className="bg-black/40 backdrop-blur-md border border-purple-400/50 hover:border-purple-400/70 rounded-2xl p-8 transition-all duration-300 shadow-lg shadow-purple-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative mr-4">
                    <div className="text-5xl animate-pulse">
                      {tierInfo.tierEmoji}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-orbitron font-bold text-purple-300 tracking-wider mb-2">
                      {tierInfo.tierName} TIER
                    </h3>
                    <p className="text-purple-200/80">
                      Current delegation classification
                    </p>
                  </div>
                </div>

                {/* Next Tier Progression */}
                {tierInfo.nextTier && tierInfo.requiredAmount && (
                  <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                        NEXT TIER:
                      </span>
                      <span className="text-purple-300 font-bold font-orbitron">
                        {getTierName(tierInfo.nextTier)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200/80 text-sm font-orbitron tracking-wider">
                        REQUIRED:
                      </span>
                      <span className="text-purple-300 font-bold text-sm">
                        +{formatTierAmount(tierInfo.requiredAmount)} INIT
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          {eligibilityData.isQualified ? (
            <div className="text-center">
              <button
                onClick={onEligibilityConfirmed}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 
                         hover:from-green-400/30 hover:via-emerald-400/30 hover:to-cyan-400/30
                         border border-green-400/50 hover:border-green-300/70 
                         text-green-300 hover:text-green-200 font-bold py-6 px-8 
                         rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                         shadow-lg shadow-green-400/25 hover:shadow-green-400/40 backdrop-blur-sm
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                         before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                         hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <div className="relative z-10 flex items-center justify-center space-x-4">
                  <span className="text-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    🚀
                  </span>
                  <span className="font-orbitron tracking-wider text-lg">
                    PROCEED TO REGISTRATION
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={clearAll}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-600/20 to-gray-500/20 
                         hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/50 hover:border-gray-400/70 
                         text-gray-400 hover:text-gray-300 font-bold py-4 px-8 rounded-2xl transition-all duration-500 
                         transform hover:scale-[1.02] shadow-lg shadow-gray-500/20 backdrop-blur-sm
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                         before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                         hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-lg transition-all duration-300 group-hover:rotate-12">
                    🔄
                  </span>
                  <span className="font-orbitron tracking-wider">
                    SCAN AGAIN
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
