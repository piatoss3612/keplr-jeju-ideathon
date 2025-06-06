"use client";

import { useKeplrContext } from "@/context/KeplrProvider";

interface GenerateProofStepProps {
  keplr: ReturnType<typeof useKeplrContext>;
  isGeneratingProof: boolean;
  onGenerateProof: () => void;
  onBackToCheck: () => void;
}

export default function GenerateProofStep({
  keplr,
  isGeneratingProof,
  onGenerateProof,
  onBackToCheck,
}: GenerateProofStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Generate Proof
        </h2>
        <p className="text-cyan-200">
          Generate zero-knowledge proof for your delegation
        </p>
      </div>

      {/* Wallet Selection */}
      <div className="space-y-4">
        {keplr.isConnected && keplr.account ? (
          <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🌌</div>
                <div>
                  <h3 className="text-cyan-300 font-orbitron font-medium">
                    Keplr Wallet Connected
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
              <p className="text-cyan-300 text-xs font-medium mb-1">
                Delegator Address
              </p>
              <p className="text-cyan-200 text-xs font-jetbrains break-all">
                {keplr.account.address}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-orange-400/40 rounded-xl p-4">
            <div className="text-center space-y-4">
              <div className="text-4xl">🌌</div>
              <h3 className="text-orange-300 font-orbitron font-medium">
                Keplr Wallet Required
              </h3>
              <p className="text-orange-200 text-sm">
                Please connect your Keplr wallet to generate proof
              </p>
              <p className="text-orange-200 text-sm">
                Please go to the Connect tab to connect your Keplr wallet first
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onBackToCheck}
          className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 rounded-xl transition-all duration-300"
        >
          Back to Check
        </button>
        <button
          onClick={onGenerateProof}
          disabled={isGeneratingProof || !keplr.isConnected || !keplr.account}
          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          {isGeneratingProof ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            "Generate Proof"
          )}
        </button>
      </div>
    </div>
  );
}
