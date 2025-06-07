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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🌌</div>
        <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
          Connect Your Wallets
        </h2>
        <p className="text-cyan-200 text-lg">
          Connect both EVM and Cosmos wallets to access Orbit Rewards
        </p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            isEvmConnected
              ? "border-green-400/40 bg-green-500/10"
              : "border-purple-400/40 bg-purple-500/10"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">{isEvmConnected ? "✅" : "🔌"}</div>
            <div className="font-orbitron font-medium text-white">
              EVM Wallet
            </div>
            <div
              className={`text-xs ${
                isEvmConnected ? "text-green-300" : "text-purple-300"
              }`}
            >
              {isEvmConnected ? "Connected" : "Not Connected"}
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            keplr.isConnected
              ? "border-green-400/40 bg-green-500/10"
              : "border-cyan-400/40 bg-cyan-500/10"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">
              {keplr.isConnected ? "✅" : "🌌"}
            </div>
            <div className="font-orbitron font-medium text-white">
              Cosmos Wallet
            </div>
            <div
              className={`text-xs ${
                keplr.isConnected ? "text-green-300" : "text-cyan-300"
              }`}
            >
              {keplr.isConnected ? "Connected" : "Not Connected"}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {bothConnected && (
        <div className="text-center ">
          <button
            onClick={onBothConnected}
            className="group relative bg-green-900/30 hover:bg-green-800/40 
                       border border-green-400/40 hover:border-green-400/60 
                       text-green-300 hover:text-green-200 font-bold py-4 px-8 
                       rounded-xl transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-green-400/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                🚀
              </span>
              <span className="font-orbitron">Continue to Dashboard</span>
            </div>
            <div
              className="absolute inset-0 rounded-xl bg-green-400/0 group-hover:bg-green-400/10 
                            transition-all duration-300 pointer-events-none"
            ></div>
          </button>
        </div>
      )}

      {/* EVM Wallet Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-orbitron text-white flex items-center">
          <span className="text-purple-400 mr-2">🔷</span>
          EVM Wallet (Base Sepolia)
        </h3>

        {!isEvmConnected ? (
          <button
            onClick={open}
            className="group relative w-full bg-blue-900/30 hover:bg-blue-800/40 
                     border border-blue-400/40 hover:border-blue-400/60 
                     text-blue-300 hover:text-blue-200 font-semibold py-3 px-6 
                     rounded-xl transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-blue-400/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-base transition-transform duration-300 group-hover:rotate-12">
                🔌
              </span>
              <span className="font-orbitron">Connect EVM Wallet</span>
            </div>
            <div
              className="absolute inset-0 rounded-xl bg-blue-400/0 group-hover:bg-blue-400/10 
                          transition-all duration-300 pointer-events-none"
            ></div>
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
      <div className="space-y-4">
        <h3 className="text-xl font-orbitron text-white flex items-center">
          <span className="text-cyan-400 mr-2">🌌</span>
          Cosmos Wallet (Initia)
        </h3>

        <KeplrWalletConnect />
      </div>
    </div>
  );
}
