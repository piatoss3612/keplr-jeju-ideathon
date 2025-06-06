"use client";

import { useKeplrContext } from "@/context/KeplrProvider";

export default function KeplrWalletConnect() {
  const { isInstalled, isConnected, account, isLoading, connect, disconnect } =
    useKeplrContext();

  if (!isInstalled) {
    return (
      <div className="bg-slate-900/50 border border-orange-400/40 rounded-xl p-4 shadow-lg shadow-orange-500/10">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h3 className="text-orange-300 font-orbitron font-medium">
            Keplr Wallet Required
          </h3>
          <p className="text-orange-200 text-sm">
            Keplr wallet is required to connect to Cosmos chains
          </p>
          <a
            href="https://www.keplr.app/get"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Install Keplr
          </a>
        </div>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg p-3">
          <p className="text-cyan-300 text-xs font-medium mb-1">
            Connected Address
          </p>
          <p className="text-cyan-200 text-xs font-jetbrains break-all">
            {account.address}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => navigator.clipboard.writeText(account.address)}
            className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-300 py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            📋 Copy Address
          </button>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/20 hover:border-red-400/40 text-red-300 rounded-lg transition-all duration-300 text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Connecting to Initia...
        </div>
      ) : (
        "🌌 Connect Keplr (Initia)"
      )}
    </button>
  );
}
