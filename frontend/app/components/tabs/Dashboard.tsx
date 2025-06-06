"use client";

import React from "react";
import { useKeplrContext } from "@/context/KeplrProvider";

interface DashboardData {
  totalPoints: number;
  level: string;
  rank: string;
  recentProofs: number;
  weeklyActivity: Array<{ day: string; proofs: number }>;
}

interface DashboardProps {
  data: DashboardData;
  isConnected: boolean;
  address: string | undefined;
  keplr: ReturnType<typeof useKeplrContext>;
}

export default function Dashboard({
  data,
  isConnected,
  address,
  keplr,
}: DashboardProps) {
  const bothConnected = isConnected && keplr.isConnected;

  if (!bothConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
          Connect Wallets to View Dashboard
        </h2>
        <p className="text-cyan-200 mb-6">
          Please connect both EVM and Cosmos wallets to see your Orbit Rewards
          status
        </p>

        {/* Connection Status */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-gray-600"
              }`}
            ></div>
            <span
              className={`text-sm ${
                isConnected ? "text-green-300" : "text-gray-400"
              }`}
            >
              EVM Wallet {isConnected ? "✓" : "✗"}
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
              Cosmos Wallet {keplr.isConnected ? "✓" : "✗"}
            </span>
          </div>
        </div>

        <p className="text-cyan-300 text-sm">
          Go to 🔗 Connect tab to connect your wallets
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Status */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🌟</div>
        <h2 className="text-2xl font-bold font-orbitron text-white mb-1">
          {data.level}
        </h2>
        <p className="text-cyan-200 text-sm font-jetbrains">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 text-center shadow-lg shadow-cyan-500/10">
          <div className="text-2xl font-bold font-orbitron text-cyan-400">
            {data.totalPoints}
          </div>
          <div className="text-xs text-cyan-300">Total Points</div>
        </div>
        <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 text-center shadow-lg shadow-pink-500/10">
          <div className="text-2xl font-bold font-orbitron text-pink-400">
            {data.rank}
          </div>
          <div className="text-xs text-pink-300">Global Rank</div>
        </div>
        <div className="bg-slate-900/50 border border-purple-400/40 rounded-xl p-4 text-center shadow-lg shadow-purple-500/10">
          <div className="text-2xl font-bold font-orbitron text-purple-400">
            {data.recentProofs}
          </div>
          <div className="text-xs text-purple-300">Proofs Generated</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-slate-900/50 border border-cyan-400/40 rounded-xl p-4 shadow-lg shadow-cyan-500/10">
        <h3 className="text-cyan-300 text-sm font-medium mb-3">
          Weekly Activity
        </h3>
        <div className="flex justify-between items-end h-20">
          {data.weeklyActivity.map((day, index: number) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div
                className="bg-gradient-to-t from-cyan-500 to-pink-400 rounded-t w-6 transition-all duration-300 shadow-sm shadow-cyan-500/30"
                style={{ height: `${Math.max(8, day.proofs * 15)}px` }}
              ></div>
              <span className="text-xs text-cyan-300">
                {day.day.slice(0, 1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-slate-900/50 border border-pink-400/40 rounded-xl p-4 shadow-lg shadow-pink-500/10">
        <h3 className="text-pink-300 text-sm font-medium mb-3">
          Recent Achievements
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-white text-sm">First Proof Generated</div>
              <div className="text-pink-300 text-xs">2 days ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🎯</span>
            <div>
              <div className="text-white text-sm">Weekly Goal Achieved</div>
              <div className="text-pink-300 text-xs">5 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { DashboardData };
