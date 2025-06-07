"use client";

interface WaitingStepProps {
  isWaiting: boolean;
  onCancel: () => void;
}

export default function WaitingStep({ isWaiting, onCancel }: WaitingStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">⏳</div>
      <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
        Processing Transaction
      </h2>
      <p className="text-cyan-200 mb-6">
        Please wait while we process your request...
      </p>

      {/* Loading Animation */}
      <div className="flex items-center justify-center mb-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400"></div>
      </div>

      {/* Status Messages */}
      <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-6">
        <div className="space-y-4 text-sm text-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Transaction submitted to blockchain</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Waiting for confirmation...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Chainlink Functions will verify your delegation</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4">
        <p className="text-yellow-200 text-sm">
          <strong>Note:</strong> The verification process may take 1-2 minutes.
          Please do not close this window or navigate away.
        </p>
      </div>

      {!isWaiting && (
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
