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
              <p className="text-red-300 font-medium break-words overflow-wrap-anywhere">
                {errorData.error}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Message:</span>
              <p className="text-red-200 break-words overflow-wrap-anywhere font-jetbrains text-xs leading-relaxed">
                {errorData.message}
              </p>
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
          className="group relative w-full bg-orange-900/30 hover:bg-orange-800/40 
                     border border-orange-400/40 hover:border-orange-400/60 
                     text-orange-300 hover:text-orange-200 font-semibold py-4 px-6 
                     rounded-xl transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-orange-400/20 backdrop-blur-sm font-orbitron"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg transition-transform duration-300 group-hover:rotate-180">
              🔄
            </span>
            <span>Try Again</span>
          </div>
          <div
            className="absolute inset-0 rounded-xl bg-orange-400/0 group-hover:bg-orange-400/10 
                          transition-all duration-300 pointer-events-none"
          ></div>
        </button>

        <button
          onClick={onReset}
          className="group relative w-full bg-gray-900/30 hover:bg-gray-800/40 
                     border border-gray-400/40 hover:border-gray-400/60 
                     text-gray-300 hover:text-gray-200 px-6 py-3 
                     rounded-xl transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-gray-400/20 backdrop-blur-sm font-orbitron"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-base transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Start Over</span>
          </div>
          <div
            className="absolute inset-0 rounded-xl bg-gray-400/0 group-hover:bg-gray-400/10 
                          transition-all duration-300 pointer-events-none"
          ></div>
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
