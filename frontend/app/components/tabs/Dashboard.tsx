"use client";

import React from "react";
import { useKeplrContext } from "@/context/KeplrProvider";
import { useOrbitRewards } from "@/context/OrbitRewardsProvider";
import { useRequestStatus } from "@/hooks/useRequestStatus";
import { getTierName, getTierEmoji } from "@/utils/tierUtils";

interface DashboardData {
  totalPoints: number;
  level: string;
  rank: string;
  recentProofs: number;
  weeklyActivity: Array<{ day: string; proofs: number }>;
}

interface DashboardProps {
  data: DashboardData;
  isConnected: boolean;
  address: string | undefined;
  keplr: ReturnType<typeof useKeplrContext>;
  onSwitchToRegister?: () => void;
}

export default function Dashboard({
  isConnected,
  address,
  keplr,
  onSwitchToRegister,
}: DashboardProps) {
  const bothConnected = isConnected && keplr.isConnected;
  const { userStatus, isLoadingStatus, refreshUserStatus } = useOrbitRewards();

  // GraphQL data for request status
  const {
    summary: requestSummary,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useRequestStatus(address);

  if (!bothConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Connect Wallets to View Dashboard
        </h2>
        <p className="text-cyan-200 mb-6">
          Please connect both EVM and Cosmos wallets to see your Orbit Rewards
          status
        </p>

        {/* Connection Status */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                isConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              EVM Wallet {isConnected ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                keplr.isConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                keplr.isConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              Cosmos Wallet {keplr.isConnected ? "✓" : "✗"}
            </span>
          </div>
        </div>

        <p className="text-cyan-300 text-sm">
          Go to 🔗 Connect tab to connect your wallets
        </p>
      </div>
    );
  }

  // Show loading state while fetching user data
  if (isLoadingStatus) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Loading Your Orbit Rewards Status
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
      </div>
    );
  }

  // Show registration prompt if user doesn't have NFT
  if (!userStatus?.hasUserNFT) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Welcome to OrbitRewards!
        </h2>
        <p className="text-cyan-200 mb-6">
          You haven&apos;t registered for OrbitRewards yet. Register now to
          start earning points and unlock exclusive NFTs!
        </p>

        {/* Registration Benefits */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-xl p-6 mb-6">
          <h3 className="text-purple-300 font-orbitron font-medium mb-4">
            Benefits of Joining
          </h3>
          <div className="space-y-2 text-sm text-purple-200 text-left">
            <p>• 🎖️ Receive exclusive soulbound NFTs</p>
            <p>• 📊 Earn loyalty points based on your delegation</p>
            <p>• 🏆 Participate in seasonal competitions</p>
            <p>• 🚀 Get tier-based multipliers (up to 20x for Galaxy tier)</p>
            <p>• 💎 Unlock milestone bonuses and rewards</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onSwitchToRegister}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-orbitron"
        >
          🚀 Register for OrbitRewards
        </button>

        <p className="text-cyan-300 text-sm">
          Click above to go to the Register tab and get started!
        </p>
      </div>
    );
  }

  // Show user dashboard with actual data
  const tierEmoji = getTierEmoji(userStatus.tier);
  const tierName = getTierName(userStatus.tier);

  return (
    <div className="space-y-6">
      {/* User Status */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{tierEmoji}</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-1">
          {tierName} Tier
        </h2>
        <p className="text-cyan-200 text-sm font-jetbrains">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* NFT Status */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-xl p-4 lg:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-3xl lg:text-4xl">{tierEmoji}</div>
            <div>
              <h3 className="text-purple-300 font-orbitron font-medium text-lg">
                OrbitRewards NFT #{userStatus.tokenId.toString()}
              </h3>
              <p className="text-purple-200 text-sm">
                {userStatus.scoreActive ? "🟢 Active" : "🟡 Needs Update"}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshUserStatus}
              className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 text-purple-200 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 text-center shadow-lg shadow-cyan-500/10">
          <div className="text-2xl font-bold font-orbitron text-cyan-400">
            {userStatus.currentScore.toString()}
          </div>
          <div className="text-xs text-cyan-300">Total Score</div>
        </div>
        <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 text-center shadow-lg shadow-pink-500/10">
          <div className="text-2xl font-bold font-orbitron text-pink-400">
            {userStatus.seasonPoints.toString()}
          </div>
          <div className="text-xs text-pink-300">Season Points</div>
        </div>
        <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-4 text-center shadow-lg shadow-purple-500/10">
          <div className="text-2xl font-bold font-orbitron text-purple-400">
            {userStatus.seasonsCompleted.toString()}
          </div>
          <div className="text-xs text-purple-300">Seasons Completed</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4">
          <h3 className="text-cyan-300 text-sm font-medium mb-3">
            Rewards Progress
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Boost Points:</span>
              <span className="text-cyan-300">
                {userStatus.boostPoints.toString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Season Milestones:</span>
              <span className="text-cyan-300">
                {userStatus.seasonMilestones.toString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Verification Count:</span>
              <span className="text-cyan-300">
                {userStatus.verificationCount.toString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4">
          <h3 className="text-pink-300 text-sm font-medium mb-3">
            Status & Next Update
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span
                className={
                  userStatus.scoreActive ? "text-green-400" : "text-orange-400"
                }
              >
                {userStatus.scoreActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tier:</span>
              <span className="text-pink-300">{tierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delegation:</span>
              <span className="text-pink-300">
                {(Number(userStatus.amount) / 1_000_000).toLocaleString()} INIT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Required Notice */}
      {!userStatus.scoreActive && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-orange-300 font-orbitron font-medium">
                Update Required
              </h3>
              <p className="text-orange-200 text-sm">
                Your scoring is inactive. Please update your loyalty status in
                the Register tab to continue earning rewards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request Status Section */}
      <div className="bg-slate-900/50 border border-green-400/40 rounded-xl p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-green-300 font-orbitron font-medium text-lg">
            🔄 Request Status
          </h3>
          <button
            onClick={refetchRequests}
            disabled={isLoadingRequests}
            className="px-3 py-1 bg-green-600/50 hover:bg-green-600/70 text-green-200 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50"
          >
            {isLoadingRequests ? "..." : "🔄"}
          </button>
        </div>

        {isLoadingRequests ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
            <span className="text-green-300 text-sm">
              Loading request status...
            </span>
          </div>
        ) : requestSummary ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/30 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-400">
                  {requestSummary.totalRequests}
                </div>
                <div className="text-xs text-green-300">Total Requests</div>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-400">
                  {requestSummary.totalFulfillments}
                </div>
                <div className="text-xs text-green-300">Fulfilled</div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  requestSummary.hasPendingRequests
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-green-400"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  requestSummary.hasPendingRequests
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {requestSummary.hasPendingRequests
                  ? "Requests Pending"
                  : "All Requests Fulfilled"}
              </span>
            </div>

            {/* Pending Requests */}
            {requestSummary.pendingRequests.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-yellow-400 font-medium text-sm">
                  Pending Requests:
                </h4>
                {requestSummary.pendingRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="bg-yellow-900/20 border border-yellow-400/20 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-yellow-300 text-sm font-mono">
                          ID: {request.requestId}
                        </p>
                        <p className="text-yellow-200 text-xs">
                          {new Date(
                            parseInt(request.blockTimestamp) * 1000
                          ).toLocaleString()}
                        </p>
                      </div>
                      <a
                        href={`https://basescan.org/tx/${request.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                      >
                        View ↗
                      </a>
                    </div>
                  </div>
                ))}
                {requestSummary.pendingRequests.length > 3 && (
                  <p className="text-yellow-300 text-xs">
                    ...and {requestSummary.pendingRequests.length - 3} more
                    pending
                  </p>
                )}
              </div>
            )}

            {/* Latest Fulfillment */}
            {requestSummary.latestFulfillment && (
              <div className="bg-green-900/20 border border-green-400/20 p-3 rounded-lg">
                <h4 className="text-green-400 font-medium text-sm mb-2">
                  Latest Fulfillment:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Tier:</span>
                    <span className="text-green-300 ml-1">
                      {requestSummary.latestFulfillment.newTier}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="text-green-300 ml-1">
                      {requestSummary.latestFulfillment.currentScore}
                    </span>
                  </div>
                </div>
                <p className="text-green-200 text-xs mt-1">
                  {new Date(
                    parseInt(requestSummary.latestFulfillment.blockTimestamp) *
                      1000
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No request data available</p>
        )}
      </div>
    </div>
  );
}

export type { DashboardData };
