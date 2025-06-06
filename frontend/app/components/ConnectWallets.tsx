"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import KeplrWalletConnect from "./KeplrWalletConnect";

interface ConnectWalletsProps {
  onBothConnected: () => void;
}

export default function ConnectWallets({
  onBothConnected,
}: ConnectWalletsProps) {
  const { open } = useAppKit();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const keplr = useKeplrContext();

  // 두 지갑 모두 연결된 경우 자동으로 다음 단계로 진행
  const bothConnected = isEvmConnected && keplr.isConnected;

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
          Connect Wallets
        </h2>
        <p className="text-cyan-200 mb-6">
          Connect both EVM and Cosmos wallets <br />
          to generate proofs
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isEvmConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                isEvmConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              EVM Wallet
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
              Cosmos Wallet
            </span>
          </div>
        </div>
        {/* Continue Button */}
        {bothConnected && (
          <div className="text-center">
            <button
              onClick={onBothConnected}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-orbitron"
            >
              🚀 Continue to Proof Generation
            </button>
          </div>
        )}
      </div>

      {/* EVM Wallet Section */}
      <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-6 shadow-lg shadow-purple-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-purple-300 font-orbitron font-medium text-lg">
                EVM Wallet
              </h3>
              <p className="text-purple-200 text-sm">Keplr, MetaMask, etc.</p>
            </div>
          </div>
          {isEvmConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">Connected</span>
            </div>
          )}
        </div>

        {!isEvmConnected ? (
          <button
            onClick={() => open()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔌 Connect EVM Wallet
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-purple-400/20 rounded-lg p-3">
              <p className="text-purple-300 text-xs font-medium mb-1">
                Connected Address
              </p>
              <p className="text-purple-200 text-xs font-jetbrains break-all">
                {evmAddress}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(evmAddress || "")}
                className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 border border-purple-400/20 hover:border-purple-400/40 text-purple-300 py-2 px-4 rounded-lg transition-all duration-300 text-sm"
              >
                📋 Copy Address
              </button>
              <button
                onClick={() => disconnectEvm()}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/20 hover:border-red-400/40 text-red-300 rounded-lg transition-all duration-300 text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cosmos (Keplr) Wallet Section */}
      <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-6 shadow-lg shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌌</div>
            <div>
              <h3 className="text-cyan-300 font-orbitron font-medium text-lg">
                Cosmos Wallet
              </h3>
              <p className="text-cyan-200 text-sm">Keplr for Initia network</p>
            </div>
          </div>
          {keplr.isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">Connected</span>
            </div>
          )}
        </div>

        <KeplrWalletConnect />
      </div>
    </div>
  );
}
