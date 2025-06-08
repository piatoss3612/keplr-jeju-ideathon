"use client";

import { useKeplrContext } from "@/context/KeplrProvider";

export default function KeplrWalletConnect() {
  const { isInstalled, isConnected, account, isLoading, connect, disconnect } =
    useKeplrContext();

  if (!isInstalled) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-orange-400/40 hover:border-orange-400/60 rounded-2xl p-6 shadow-lg shadow-orange-500/20 transition-all duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
        <div className="relative z-10 text-center space-y-4">
          <div className="text-5xl animate-bounce">⚠️</div>
          <h3 className="text-orange-300 font-orbitron font-bold tracking-wider text-lg">
            KEPLR PROTOCOL REQUIRED
          </h3>
          <p className="text-orange-200/80 text-sm">
            Keplr wallet extension required for Cosmos chain access
          </p>
          <a
            href="https://www.keplr.app/get"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block relative overflow-hidden bg-gradient-to-r from-orange-500/30 to-red-500/30 
                     hover:from-orange-400/40 hover:to-red-400/40 border border-orange-400/50 hover:border-orange-300/70 
                     text-orange-300 hover:text-orange-200 font-bold py-3 px-6 rounded-2xl 
                     transition-all duration-500 transform hover:scale-105 shadow-lg shadow-orange-400/25 hover:shadow-orange-400/40
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-lg transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                🚀
              </span>
              <span className="font-orbitron tracking-wider">
                INSTALL KEPLR
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="space-y-3">
        <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-cyan-300 text-xs font-orbitron font-medium tracking-wider">
                ✅ COSMOS CONNECTED
              </p>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
            </div>
            <p className="text-cyan-200 text-xs font-jetbrains break-all bg-black/30 p-2 rounded-lg border border-cyan-400/20">
              {account.address}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigator.clipboard.writeText(account.address)}
            className="group flex-1 bg-gradient-to-r from-slate-700/50 to-cyan-700/30 hover:from-slate-600/60 hover:to-cyan-600/40 
                     border border-cyan-400/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 
                     py-3 px-4 rounded-xl transition-all duration-300 text-sm font-orbitron tracking-wider"
          >
            <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
              📋
            </span>
            COPY ADDRESS
          </button>
          <button
            onClick={disconnect}
            className="group px-4 py-3 bg-gradient-to-r from-red-600/20 to-red-500/30 hover:from-red-500/30 hover:to-red-400/40 
                     border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 
                     rounded-xl transition-all duration-300 text-sm font-orbitron tracking-wider"
          >
            <span className="mr-1 transition-transform duration-300 group-hover:rotate-12">
              ⚡
            </span>
            DISCONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isLoading}
      className="group relative w-full overflow-hidden bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 
               hover:from-cyan-400/30 hover:via-blue-400/30 hover:to-purple-400/30
               disabled:from-gray-600/20 disabled:via-gray-500/20 disabled:to-gray-600/20
               border border-cyan-400/50 hover:border-cyan-300/70 disabled:border-gray-500/30
               text-cyan-300 hover:text-cyan-200 disabled:text-gray-500 font-semibold py-4 px-6 
               rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:cursor-not-allowed 
               shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 disabled:shadow-none backdrop-blur-sm
               before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
               before:via-white/10 before:to-transparent before:translate-x-[-100%] 
               hover:before:translate-x-[100%] before:transition-transform before:duration-700 disabled:before:hidden"
    >
      <div className="relative z-10 flex items-center justify-center space-x-3">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
            <span className="font-orbitron tracking-wider">
              CONNECTING TO INITIA...
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </>
        ) : (
          <>
            <span className="text-lg transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
              🌌
            </span>
            <span className="font-orbitron tracking-wider">
              CONNECT KEPLR WALLET
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </>
        )}
      </div>
    </button>
  );
}
