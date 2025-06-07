"use client";

interface SuccessStepProps {
  transactionHash: string;
  onReset: () => void;
}

export default function SuccessStep({
  transactionHash,
  onReset,
}: SuccessStepProps) {
  const explorerUrl = `https://sepolia.basescan.org/tx/${transactionHash}`;

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">⚡</div>
      <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
        Transaction Submitted!
      </h2>
      <p className="text-blue-200 mb-6">
        Your request has been submitted and is now being processed by Chainlink
        Functions
      </p>

      {/* Processing Animation */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-24 h-24 bg-blue-500/20 border-4 border-blue-400 rounded-full flex items-center justify-center animate-pulse">
          <div className="text-4xl">⏳</div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-slate-900/50 border border-blue-400/40 rounded-xl p-6">
        <h3 className="text-blue-300 font-orbitron font-medium mb-4">
          Transaction Confirmed
        </h3>

        <div className="space-y-3 text-sm">
          <div className="break-all">
            <span className="text-gray-400">Transaction Hash:</span>
            <p className="text-blue-300 font-jetbrains mt-1">
              {transactionHash}
            </p>
          </div>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600/50 hover:bg-blue-600/70 text-blue-200 rounded-lg transition-all duration-300"
          >
            🔗 View on BaseScan
          </a>
        </div>
      </div>

      {/* Processing Status */}
      <div className="bg-yellow-900/40 border border-yellow-400/30 rounded-xl p-6">
        <h3 className="text-yellow-300 font-orbitron font-medium mb-4">
          Processing Status
        </h3>

        <div className="space-y-2 text-sm text-yellow-200 text-left">
          <p>• ⚡ Chainlink Functions is verifying your delegation</p>
          <p>• 🔄 This process typically takes 2-5 minutes</p>
          <p>• 🎖️ Your NFT will be minted after verification completes</p>
          <p>• 📊 Check your dashboard for the final results</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-orange-900/40 border border-orange-400/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-xl">⚠️</div>
          <div>
            <h4 className="text-orange-300 font-medium mb-2">Please Note</h4>
            <p className="text-orange-200 text-sm">
              Your transaction has been confirmed, but the verification process
              is still ongoing. The NFT and rewards will appear once Chainlink
              Functions completes the delegation verification and the fulfill
              transaction is processed.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-orbitron"
        >
          📊 Go to Dashboard
        </button>

        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl transition-all duration-300 font-orbitron"
        >
          ← Start Over
        </button>
      </div>

      {/* Next Steps Message */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4">
        <p className="text-blue-200 text-sm">
          🚀 Your request has been submitted successfully! You can monitor the
          verification progress and check your final results in the dashboard.
          We&apos;ll process your delegation verification through Chainlink
          Functions.
        </p>
      </div>
    </div>
  );
}
