"use client";

import { useOrbitRewards } from "@/context/OrbitRewardsProvider";

interface ErrorStepProps {
  onRetry: () => void;
  onReset: () => void;
}

export default function ErrorStep({ onRetry, onReset }: ErrorStepProps) {
  const { errorData } = useOrbitRewards();

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
        Registration Failed
      </h2>
      <p className="text-red-200 mb-6">
        Something went wrong during the registration process
      </p>

      {/* Error Details */}
      {errorData && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6">
          <h3 className="text-red-300 font-orbitron font-medium mb-4">
            Error Details
          </h3>

          <div className="space-y-2 text-sm text-left">
            <div>
              <span className="text-gray-400">Error Type:</span>
              <p className="text-red-300 font-medium">{errorData.error}</p>
            </div>
            <div>
              <span className="text-gray-400">Message:</span>
              <p className="text-red-200">{errorData.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common Solutions */}
      <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-6">
        <h3 className="text-yellow-300 font-orbitron font-medium mb-4">
          Common Solutions
        </h3>

        <div className="space-y-2 text-sm text-yellow-200 text-left">
          <p>• 🔄 Try the transaction again</p>
          <p>• 💰 Check if you have enough ETH for gas fees</p>
          <p>• 📡 Verify your wallet connection</p>
          <p>• 🕒 Wait a moment and retry if the network is congested</p>
          <p>• 🔍 Check that your delegation is still valid</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-orbitron"
        >
          🔄 Try Again
        </button>

        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
        >
          ← Start Over
        </button>
      </div>

      {/* Support Info */}
      <div className="bg-slate-900/50 border border-gray-400/30 rounded-xl p-4">
        <p className="text-gray-300 text-sm">
          <strong>Need Help?</strong> If the problem persists, please check the
          browser console for more details or contact support.
        </p>
      </div>
    </div>
  );
}
