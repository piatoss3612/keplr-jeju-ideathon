"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import KeplrWalletConnect from "../keplr/KeplrWalletConnect";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface ConnectWalletsProps {
  onBothConnected: () => void;
}

export default function ConnectWallets({
  onBothConnected,
}: ConnectWalletsProps) {
  const { openConnectModal: open } = useConnectModal();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const keplr = useKeplrContext();

  const bothConnected = isEvmConnected && keplr.isConnected;

  return (
    <div className="space-y-6">
      {/* Header with Inline Status */}
      <div className="text-center space-y-4 relative">
        <div className="text-6xl mb-4 animate-pulse">🌌</div>
        <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Connect Your Wallets
        </h2>
        <p className="text-cyan-200/80 text-lg">
          Connect both wallets to access Orbit Chronicle
        </p>

        {/* Compact Cyberpunk Status Bar */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-2xl px-6 py-3">
            {/* EVM Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`relative ${isEvmConnected ? "animate-pulse" : ""}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isEvmConnected
                      ? "bg-green-400 shadow-lg shadow-green-400/50"
                      : "bg-gray-600 border border-purple-400/50"
                  }`}
                ></div>
                {isEvmConnected && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-30"></div>
                )}
              </div>
              <span
                className={`text-sm font-orbitron ${
                  isEvmConnected ? "text-green-300" : "text-gray-400"
                }`}
              >
                EVM
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>

            {/* Cosmos Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`relative ${
                  keplr.isConnected ? "animate-pulse" : ""
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    keplr.isConnected
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      : "bg-gray-600 border border-cyan-400/50"
                  }`}
                ></div>
                {keplr.isConnected && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-30"></div>
                )}
              </div>
              <span
                className={`text-sm font-orbitron ${
                  keplr.isConnected ? "text-cyan-300" : "text-gray-400"
                }`}
              >
                COSMOS
              </span>
            </div>

            {/* Overall Status */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>
            <div
              className={`text-xs font-orbitron px-2 py-1 rounded-full ${
                bothConnected
                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {bothConnected ? "READY" : "PENDING"}
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Continue Button */}
      {bothConnected && (
        <div className="text-center">
          <button
            onClick={onBothConnected}
            className="group relative overflow-hidden bg-gradient-to-r from-green-500/20 to-cyan-500/20 
                       hover:from-green-400/30 hover:to-cyan-400/30 
                       border border-green-400/50 hover:border-green-300/70 
                       text-green-300 hover:text-green-200 font-bold py-4 px-8 
                       rounded-2xl transition-all duration-500 transform hover:scale-105 
                       shadow-lg shadow-green-400/25 hover:shadow-green-400/40 backdrop-blur-sm
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                       before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                       hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                🚀
              </span>
              <span className="font-orbitron tracking-wider text-lg">
                INITIALIZE DASHBOARD
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>
      )}

      {/* EVM Wallet Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-orbitron bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center">
          <span className="text-purple-400 mr-3 animate-pulse">⚡</span>
          EVM
          <span className="text-xs ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30">
            BASE SEPOLIA
          </span>
        </h3>

        {!isEvmConnected ? (
          <button
            onClick={open}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 
                     hover:from-purple-400/30 hover:via-blue-400/30 hover:to-indigo-400/30
                     border border-purple-400/50 hover:border-purple-300/70 
                     text-purple-300 hover:text-purple-200 font-semibold py-4 px-6 
                     rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                     shadow-lg shadow-purple-400/25 hover:shadow-purple-400/40 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-lg transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                🔌
              </span>
              <span className="font-orbitron tracking-wider">
                CONNECT EVM WALLET
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-black/40 backdrop-blur-md border border-green-400/30 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-green-300 text-xs font-orbitron font-medium tracking-wider">
                    ✅ CONNECTED ADDRESS
                  </p>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                </div>
                <p className="text-green-200 text-xs font-jetbrains break-all bg-black/30 p-2 rounded-lg border border-green-400/20">
                  {evmAddress}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(evmAddress || "")}
                className="group flex-1 bg-gradient-to-r from-slate-700/50 to-purple-700/30 hover:from-slate-600/60 hover:to-purple-600/40 
                         border border-purple-400/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 
                         py-3 px-4 rounded-xl transition-all duration-300 text-sm font-orbitron tracking-wider"
              >
                <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                  📋
                </span>
                COPY ADDRESS
              </button>
              <button
                onClick={() => disconnectEvm()}
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
        )}
      </div>

      {/* Cosmos (Keplr) Wallet Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center">
          <span className="text-cyan-400 mr-3 animate-pulse">🌌</span>
          COSMOS
          <span className="text-xs ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
            INITIA NETWORK
          </span>
        </h3>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <KeplrWalletConnect />
        </div>
      </div>
    </div>
  );
}
