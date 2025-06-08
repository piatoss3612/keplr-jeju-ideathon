"use client";

import { useState, useEffect } from "react";
import { useOrbitRewards } from "@/context/OrbitRewardsProvider";

interface ErrorStepProps {
  onReset: () => void;
}

export default function ErrorStep({ onReset }: ErrorStepProps) {
  const { errorData } = useOrbitRewards();
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Glitch effect animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const commonSolutions = [
    {
      icon: "🔄",
      title: "RETRY TRANSACTION",
      description: "Execute the operation again",
      color: "blue",
    },
    {
      icon: "💰",
      title: "CHECK GAS FEES",
      description: "Verify sufficient ETH for gas",
      color: "yellow",
    },
    {
      icon: "📡",
      title: "VERIFY CONNECTION",
      description: "Confirm wallet connectivity",
      color: "green",
    },
    {
      icon: "🕒",
      title: "NETWORK CONGESTION",
      description: "Wait and retry if network busy",
      color: "purple",
    },
    {
      icon: "🔍",
      title: "DELEGATION STATUS",
      description: "Validate delegation remains active",
      color: "cyan",
    },
  ];

  return (
    <div className="text-center space-y-8 relative">
      <div className="absolute inset-0 rounded-3xl"></div>
      <div className="relative z-10">
        {/* Enhanced Error Header */}
        <div className="mb-8">
          <div
            className={`text-7xl mb-6 ${
              glitchEffect ? "animate-pulse" : "animate-bounce"
            }`}
          >
            ❌
          </div>
          <h2
            className={`text-3xl font-bold font-orbitron mb-4 ${
              glitchEffect
                ? "bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse"
                : "bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
            }`}
          >
            SYSTEM ERROR DETECTED
          </h2>
          <p className="text-red-200/80 text-lg">
            Registration protocol encountered an unexpected failure
          </p>
        </div>

        {/* Enhanced Error Details */}
        {errorData && (
          <div className="bg-black/40 backdrop-blur-md border border-red-400/50 hover:border-red-400/70 rounded-2xl p-8 mb-8 transition-all duration-300 shadow-lg shadow-red-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="text-3xl animate-pulse">🚨</div>
                <h3 className="text-red-300 font-orbitron font-bold text-xl tracking-wider">
                  ERROR DIAGNOSTICS
                </h3>
              </div>

              <div className="space-y-6 text-left">
                <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-300 font-orbitron font-bold tracking-wider text-sm">
                      ERROR TYPE
                    </span>
                  </div>
                  <p className="text-red-200 font-bold text-lg bg-black/30 p-3 rounded-lg border border-red-400/20 break-words">
                    {errorData.error}
                  </p>
                </div>

                <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-300 font-orbitron font-bold tracking-wider text-sm">
                      ERROR MESSAGE
                    </span>
                  </div>
                  <p className="text-orange-200 text-sm font-jetbrains bg-black/30 p-3 rounded-lg border border-orange-400/20 break-words leading-relaxed">
                    {errorData.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Common Solutions */}
        <div className="bg-black/40 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400/70 rounded-2xl p-8 mb-8 transition-all duration-300 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-green-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-3xl animate-pulse">🛠️</div>
              <h3 className="text-yellow-300 font-orbitron font-bold text-xl tracking-wider">
                DIAGNOSTIC SOLUTIONS
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonSolutions.map((solution, index) => {
                const getColors = (color: string) => {
                  const colorMap = {
                    blue: "bg-blue-500/10 border-blue-400/20 text-blue-300",
                    yellow:
                      "bg-yellow-500/10 border-yellow-400/20 text-yellow-300",
                    green: "bg-green-500/10 border-green-400/20 text-green-300",
                    purple:
                      "bg-purple-500/10 border-purple-400/20 text-purple-300",
                    cyan: "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
                  };
                  return (
                    colorMap[color as keyof typeof colorMap] || colorMap.blue
                  );
                };

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${getColors(
                      solution.color
                    )}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xl">{solution.icon}</span>
                      <span className="font-orbitron font-bold text-sm tracking-wider">
                        {solution.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 font-orbitron">
                      {solution.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-6">
          <button
            onClick={onReset}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 
                     hover:from-red-400/30 hover:via-orange-400/30 hover:to-yellow-400/30
                     border border-red-400/50 hover:border-red-300/70 
                     text-red-300 hover:text-red-200 font-bold py-6 px-8 
                     rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                     shadow-lg shadow-red-400/25 hover:shadow-red-400/40 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <span className="text-2xl transition-all duration-300 group-hover:rotate-180 group-hover:scale-110">
                🔄
              </span>
              <span className="font-orbitron tracking-wider text-lg">
                RESTART PROTOCOL
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </button>
        </div>

        {/* Enhanced System Status */}
        <div className="bg-black/40 backdrop-blur-md border border-orange-400/30 rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-2xl animate-pulse">⚠️</div>
            <span className="text-orange-300 font-orbitron font-bold tracking-wider">
              SYSTEM STATUS
            </span>
          </div>
          <p className="text-orange-200/80 text-sm font-orbitron text-center">
            Error logged for diagnostics. System remains operational. Safe to
            retry operation or restart protocol initialization.
          </p>
        </div>

        {/* Glitch Effect Elements */}
        {glitchEffect && (
          <>
            <div className="absolute top-10 left-10 w-20 h-1 bg-red-400 animate-pulse"></div>
            <div className="absolute top-20 right-16 w-16 h-1 bg-orange-400 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-12 h-1 bg-yellow-400 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-1 bg-red-400 animate-pulse"></div>
          </>
        )}

        {/* Floating error particles */}
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-32 right-16 w-1 h-1 bg-orange-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-12 w-2 h-2 bg-red-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    </div>
  );
}
