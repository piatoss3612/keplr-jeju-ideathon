"use client";

import { useState, useEffect } from "react";

interface SuccessStepProps {
  transactionHash: string;
  onReset: () => void;
  onGoToDashboard: () => void;
}

export default function SuccessStep({
  transactionHash,
  onReset,
  onGoToDashboard,
}: SuccessStepProps) {
  const [processingStep, setProcessingStep] = useState(0);
  const [celebrationPhase, setCelebrationPhase] = useState(0);

  const explorerUrl = `https://sepolia.basescan.org/tx/${transactionHash}`;

  // Animate processing steps
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Celebration animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCelebrationPhase((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const processingSteps = [
    {
      id: 0,
      label: "TRANSACTION CONFIRMED",
      icon: "⚡",
      description: "Blockchain transaction successfully processed",
      color: "green",
    },
    {
      id: 1,
      label: "CHAINLINK VERIFICATION",
      icon: "🔗",
      description: "Oracle delegation verification in progress",
      color: "blue",
    },
    {
      id: 2,
      label: "NFT MINTING QUEUE",
      icon: "🎖️",
      description: "Smart contract preparing NFT generation",
      color: "purple",
    },
    {
      id: 3,
      label: "REWARDS ACTIVATION",
      icon: "🚀",
      description: "Loyalty protocol initialization complete",
      color: "cyan",
    },
  ];

  const celebrations = ["🎉", "✨", "🎊", "💫"];

  return (
    <div className="text-center space-y-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl animate-pulse"></div>
      <div className="relative z-10">
        {/* Enhanced Celebration Header */}
        <div className="mb-8">
          <div className="text-7xl mb-6 animate-bounce">⚡</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            TRANSACTION SUBMITTED!
          </h2>
          <p className="text-green-200/80 text-lg">
            OrbitRewards protocol activation initiated successfully
          </p>
        </div>

        {/* Enhanced Processing Animation */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            {/* Main success indicator */}
            <div className="w-28 h-28 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 border-4 border-green-400 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-green-400/50">
              <div className="text-5xl animate-pulse">
                {celebrations[celebrationPhase]}
              </div>
            </div>

            {/* Pulsing rings */}
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-green-400/30"></div>
            <div
              className="absolute inset-0 animate-ping rounded-full border-4 border-blue-400/20"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Orbiting celebration elements */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">
                🎉
              </div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s", animationDirection: "reverse" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl">
                ✨
              </div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "5s" }}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl">
                🎊
              </div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "6s", animationDirection: "reverse" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl">
                💫
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Transaction Details */}
        <div className="bg-black/40 backdrop-blur-md border border-green-400/50 hover:border-green-400/70 rounded-2xl p-8 mb-8 transition-all duration-300 shadow-lg shadow-green-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-3xl animate-pulse">⚡</div>
              <h3 className="text-green-300 font-orbitron font-bold text-xl tracking-wider">
                TRANSACTION CONFIRMED
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4">
                <span className="text-green-200/80 text-sm font-orbitron tracking-wider block mb-2">
                  TRANSACTION HASH
                </span>
                <p className="text-green-300 font-jetbrains text-xs break-all bg-black/30 p-3 rounded-lg border border-green-400/20">
                  {transactionHash}
                </p>
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                         hover:from-blue-400/30 hover:to-purple-400/30 border border-blue-400/50 hover:border-blue-300/70 
                         text-blue-300 hover:text-blue-200 font-bold py-4 px-6 rounded-2xl transition-all duration-500 
                         transform hover:scale-[1.02] shadow-lg shadow-blue-400/25 hover:shadow-blue-400/40 backdrop-blur-sm
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                         before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                         hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <div className="relative z-10 flex items-center space-x-3">
                  <span className="text-lg transition-all duration-300 group-hover:rotate-12">
                    🔗
                  </span>
                  <span className="font-orbitron tracking-wider">
                    VIEW ON BASESCAN
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Processing Status */}
        <div className="bg-black/40 backdrop-blur-md border border-blue-400/50 hover:border-blue-400/70 rounded-2xl p-8 mb-8 transition-all duration-300 shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-3xl animate-pulse">🔄</div>
              <h3 className="text-blue-300 font-orbitron font-bold text-xl tracking-wider">
                PROCESSING STATUS
              </h3>
            </div>

            <div className="space-y-4">
              {processingSteps.map((step, index) => {
                const isActive = processingStep >= index;
                const isCurrent = processingStep === index;

                const getStepColors = (color: string, isActive: boolean) => {
                  if (!isActive) {
                    return {
                      dot: "bg-gray-600 border-gray-500",
                      text: "text-gray-500",
                      bg: "bg-gray-500/5 border-gray-500/20",
                    };
                  }

                  const colorMap = {
                    green: {
                      dot: "bg-green-400 border-green-300 shadow-lg shadow-green-400/50",
                      text: "text-green-300",
                      bg: "bg-green-500/10 border-green-400/20",
                    },
                    blue: {
                      dot: "bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50",
                      text: "text-blue-300",
                      bg: "bg-blue-500/10 border-blue-400/20",
                    },
                    purple: {
                      dot: "bg-purple-400 border-purple-300 shadow-lg shadow-purple-400/50",
                      text: "text-purple-300",
                      bg: "bg-purple-500/10 border-purple-400/20",
                    },
                    cyan: {
                      dot: "bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50",
                      text: "text-cyan-300",
                      bg: "bg-cyan-500/10 border-cyan-400/20",
                    },
                  };

                  return (
                    colorMap[color as keyof typeof colorMap] || colorMap.green
                  );
                };

                const colors = getStepColors(step.color, isActive);

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-500 ${colors.bg}`}
                  >
                    <div className="relative">
                      <div
                        className={`
                        w-4 h-4 rounded-full border-2 transition-all duration-500
                        ${colors.dot}
                        ${isCurrent ? "animate-pulse scale-110" : ""}
                      `}
                      >
                        {isCurrent && processingStep < 3 && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/30"></div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-left">
                      <div
                        className={`font-orbitron font-bold text-sm tracking-wider ${
                          colors.text
                        } ${isCurrent ? "animate-pulse" : ""}`}
                      >
                        {step.label}
                        {isCurrent && processingStep < 3 && (
                          <span className="ml-2">...</span>
                        )}
                        {isActive && processingStep >= 3 && (
                          <span className="ml-2">✓</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {step.description}
                      </div>
                    </div>

                    <div className="text-xl">{isActive ? step.icon : "⚪"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Important Notice */}
        <div className="bg-black/40 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400/70 rounded-2xl p-6 mb-8 transition-all duration-300 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-start space-x-4">
              <div className="text-3xl animate-bounce">⚠️</div>
              <div className="text-left flex-1">
                <h4 className="text-yellow-300 font-orbitron font-bold tracking-wider mb-3">
                  VERIFICATION IN PROGRESS
                </h4>
                <div className="space-y-2 text-yellow-200/80 text-sm">
                  <p className="font-orbitron">
                    • Transaction confirmed on blockchain successfully
                  </p>
                  <p className="font-orbitron">
                    • Chainlink Functions performing delegation verification
                  </p>
                  <p className="font-orbitron">
                    • NFT and rewards will appear after verification completes
                  </p>
                  <p className="font-orbitron">
                    • Estimated completion time: 2-5 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-6">
          <button
            onClick={onGoToDashboard}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 
                     hover:from-blue-400/30 hover:via-purple-400/30 hover:to-cyan-400/30
                     border border-blue-400/50 hover:border-blue-300/70 
                     text-blue-300 hover:text-blue-200 font-bold py-6 px-8 
                     rounded-2xl transition-all duration-500 transform hover:scale-[1.02] 
                     shadow-lg shadow-blue-400/25 hover:shadow-blue-400/40 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <span className="text-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                📊
              </span>
              <span className="font-orbitron tracking-wider text-lg">
                ACCESS DASHBOARD
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </button>

          <button
            onClick={onReset}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-gray-600/20 to-gray-500/20 
                     hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/50 hover:border-gray-400/70 
                     text-gray-400 hover:text-gray-300 font-bold py-4 px-6 rounded-2xl transition-all duration-500 
                     transform hover:scale-[1.02] shadow-lg shadow-gray-500/20 backdrop-blur-sm
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                     before:via-white/10 before:to-transparent before:translate-x-[-100%] 
                     hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span className="text-lg transition-all duration-300 group-hover:-rotate-12">
                ←
              </span>
              <span className="font-orbitron tracking-wider">
                START NEW REGISTRATION
              </span>
            </div>
          </button>
        </div>

        {/* Enhanced Success Message */}
        <div className="bg-black/40 backdrop-blur-md border border-green-400/30 rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-2xl animate-pulse">🚀</div>
            <span className="text-green-300 font-orbitron font-bold tracking-wider">
              MISSION ACCOMPLISHED
            </span>
          </div>
          <p className="text-green-200/80 text-sm font-orbitron text-center">
            Your OrbitRewards registration has been submitted successfully!
            Monitor verification progress and access your rewards through the
            dashboard.
          </p>
        </div>

        {/* Floating celebration particles */}
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-32 right-16 w-1 h-1 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-12 w-2 h-2 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
}
