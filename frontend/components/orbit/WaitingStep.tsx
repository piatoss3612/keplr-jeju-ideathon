"use client";

import React, { useState, useEffect } from "react";

interface WaitingStepProps {
  isWaiting: boolean;
  onCancel: () => void;
  transactionStatus?:
    | "pending"
    | "submitted"
    | "confirming"
    | "verifying"
    | null;
  transactionHash?: string;
}

export default function WaitingStep({
  isWaiting,
  onCancel,
  transactionStatus = null,
  transactionHash,
}: WaitingStepProps) {
  const [loadingDots, setLoadingDots] = useState(".");

  const getCurrentStep = () => {
    switch (transactionStatus) {
      case "pending":
        return -1;
      case "submitted":
        return 0;
      case "confirming":
        return 1;
      case "verifying":
        return 2;
      default:
        return -1;
    }
  };

  const currentStep = getCurrentStep();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 0,
      label: "TRANSACTION SUBMITTED",
      icon: "🚀",
      description: "Blockchain transaction initiated",
      color: "green",
    },
    {
      id: 1,
      label: "AWAITING CONFIRMATION",
      icon: "⏳",
      description: "Network confirmation in progress",
      color: "yellow",
    },
    {
      id: 2,
      label: "CHAINLINK VERIFICATION",
      icon: "🔗",
      description: "Delegation verification process",
      color: "blue",
    },
  ];

  if (currentStep === -1) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl animate-pulse"></div>
        <div className="relative z-10">
          <div className="mb-8">
            <div className="text-7xl mb-6 animate-bounce">👛</div>
            <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent mb-4">
              WALLET APPROVAL REQUIRED{loadingDots}
            </h2>
            <p className="text-orange-200/80 text-lg">
              Please approve the transaction in your wallet
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="text-8xl animate-pulse filter drop-shadow-lg">
                💳
              </div>

              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "2s" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
              </div>
              <div
                className="absolute inset-0 animate-spin"
                style={{
                  animationDuration: "3s",
                  animationDirection: "reverse",
                }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-orange-400/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-2xl animate-bounce">📋</div>
              <h3 className="text-orange-300 font-orbitron font-bold tracking-wider">
                APPROVAL INSTRUCTIONS
              </h3>
            </div>

            <div className="space-y-3 text-orange-200/80">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-orbitron">
                  Check your wallet for pending transaction
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100"></div>
                <span className="text-sm font-orbitron">
                  Review transaction details and gas fees
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></div>
                <span className="text-sm font-orbitron">
                  Click &quot;Confirm&quot; or &quot;Approve&quot; to proceed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 relative">
      <div className="absolute inset-0 rounded-3xl animate-pulse"></div>
      <div className="relative z-10">
        <div className="mb-8">
          <div className="text-7xl mb-6 animate-bounce">⏳</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            PROCESSING TRANSACTION{loadingDots}
          </h2>
          <p className="text-cyan-200/80 text-lg">
            OrbitChronicle protocol initialization in progress
          </p>
          {transactionHash && (
            <p className="text-cyan-300/60 text-sm font-mono mt-2">
              TX: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-400/30 border-t-cyan-400"></div>

            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-cyan-400/20"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
            </div>

            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="text-2xl animate-pulse">🔄</div>
            <h3 className="text-cyan-300 font-orbitron font-bold text-lg tracking-wider">
              PROTOCOL EXECUTION STATUS
            </h3>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = currentStep >= index;
              const isCurrent = currentStep === index;

              const getStepColors = (color: string, isActive: boolean) => {
                if (!isActive) {
                  return {
                    dot: "bg-gray-600 border-gray-500",
                    text: "text-gray-500",
                    glow: "",
                  };
                }

                const colorMap = {
                  green: {
                    dot: "bg-green-400 border-green-300 shadow-lg shadow-green-400/50",
                    text: "text-green-300",
                    glow: "shadow-green-400/30",
                  },
                  yellow: {
                    dot: "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50",
                    text: "text-yellow-300",
                    glow: "shadow-yellow-400/30",
                  },
                  blue: {
                    dot: "bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50",
                    text: "text-blue-300",
                    glow: "shadow-blue-400/30",
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
                  className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl border border-gray-400/20"
                >
                  <div className="relative">
                    <div
                      className={`
                      w-4 h-4 rounded-full border-2 transition-all duration-500
                      ${colors.dot}
                      ${isCurrent ? "animate-pulse scale-110" : ""}
                    `}
                    >
                      {isCurrent && (
                        <div
                          className={`absolute inset-0 rounded-full animate-ping ${colors.glow.replace(
                            "shadow-lg ",
                            "bg-"
                          )}`}
                          style={{ opacity: 0.3 }}
                        ></div>
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
                      {isCurrent && <span className="ml-2">{loadingDots}</span>}
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

        <div className="bg-black/40 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400/70 rounded-2xl p-6 mb-8 transition-all duration-300 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-2xl animate-bounce">⚠️</div>
              <h3 className="text-yellow-300 font-orbitron font-bold tracking-wider">
                CRITICAL NOTICE
              </h3>
            </div>

            <div className="space-y-3 text-yellow-200/80">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-orbitron">
                  Verification process duration: 1-2 minutes
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                <span className="text-sm font-orbitron">
                  Do not close browser window or navigate away
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                <span className="text-sm font-orbitron">
                  Transaction hash will be provided upon completion
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isWaiting && (
          <button
            onClick={onCancel}
            className="group relative overflow-hidden bg-gradient-to-r from-gray-600/20 to-gray-500/20 
                     hover:from-gray-500/30 hover:to-gray-400/30 border border-gray-500/50 hover:border-gray-400/70 
                     text-gray-400 hover:text-gray-300 font-bold py-4 px-8 rounded-2xl transition-all duration-500 
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
                RETURN TO PREVIOUS STEP
              </span>
            </div>
          </button>
        )}

        <div
          className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-20 right-16 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-1 h-1 bg-pink-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    </div>
  );
}
