"use client";

import { useAccount } from "wagmi";
import { useKeplrContext } from "@/context/KeplrProvider";
import CheckEligibility from "./CheckEligibility";
import ProgressIndicator from "./ProgressIndicator";
import RegisterStep from "./RegisterStep";
import WaitingStep from "./WaitingStep";
import SuccessStep from "./SuccessStep";
import ErrorStep from "./ErrorStep";
import { RegistrationStep } from "@/context/OrbitChronicleProvider";

interface OrbitRewardsFlowProps {
  step: RegistrationStep;
  setStep: (step: RegistrationStep) => void;
  isRegistering: boolean;
  registrationHash: string | null;
  keplr: ReturnType<typeof useKeplrContext>;
  onRegisterOrUpdate: () => void;
  onReset: () => void;
  onGoToDashboard: () => void;
  transactionStatus?:
    | "pending"
    | "submitted"
    | "confirming"
    | "verifying"
    | null;
}

export default function OrbitRewardsFlow({
  step,
  setStep,
  isRegistering,
  registrationHash,
  keplr,
  onRegisterOrUpdate,
  onReset,
  onGoToDashboard,
  transactionStatus,
}: OrbitRewardsFlowProps) {
  const { isConnected } = useAccount();
  const bothConnected = isConnected && keplr.isConnected;

  if (!bothConnected) {
    return (
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-pulse">🔐</div>
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            REGISTRATION LOCKED
          </h2>
          <p className="text-cyan-200/80 text-lg mb-8">
            Connect both protocols to access OrbitChronicle registration
          </p>

          {/* Enhanced Connection Status */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-6 bg-black/40 backdrop-blur-md border border-gray-400/30 rounded-2xl px-8 py-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`relative ${isConnected ? "animate-pulse" : ""}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isConnected
                        ? "bg-green-400 shadow-lg shadow-green-400/50"
                        : "bg-gray-600 border border-red-400/50"
                    }`}
                  ></div>
                  {isConnected && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-30"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-orbitron ${
                    isConnected ? "text-green-300" : "text-gray-400"
                  }`}
                >
                  EVM {isConnected ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>

              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-400/50 to-transparent"></div>

              <div className="flex items-center space-x-3">
                <div
                  className={`relative ${
                    keplr.isConnected ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      keplr.isConnected
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                        : "bg-gray-600 border border-red-400/50"
                    }`}
                  ></div>
                  {keplr.isConnected && (
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-30"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-orbitron ${
                    keplr.isConnected ? "text-cyan-300" : "text-gray-400"
                  }`}
                >
                  COSMOS {keplr.isConnected ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-2xl p-4 mb-6">
            <p className="text-cyan-300 font-orbitron tracking-wider">
              → Navigate to{" "}
              <span className="text-cyan-200 font-bold">CONNECT</span> tab to
              initialize protocols
            </p>
          </div>

          {/* Enhanced Registration Notice */}
          <div className="bg-black/40 backdrop-blur-md border border-gray-400/30 hover:border-gray-400/50 rounded-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="text-3xl animate-bounce">🚀</span>
              <h3 className="text-gray-300 font-orbitron font-bold tracking-wider">
                ORBITCHRONICLE REGISTRATION
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Dual-protocol verification required for NFT minting and loyalty
              system access
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-xl border border-purple-400/20">
                <span className="text-xl">🎖️</span>
                <span className="text-purple-200 text-sm font-orbitron">
                  Soulbound NFT Collection
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-cyan-500/10 rounded-xl border border-cyan-400/20">
                <span className="text-xl">📊</span>
                <span className="text-cyan-200 text-sm font-orbitron">
                  Dynamic Loyalty Rewards
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressIndicator currentStep={step} />

      {step === "check" && (
        <CheckEligibility onEligibilityConfirmed={() => setStep("register")} />
      )}

      {step === "register" && (
        <RegisterStep
          keplr={keplr}
          isRegistering={isRegistering}
          onRegisterOrUpdate={onRegisterOrUpdate}
          onBackToCheck={() => setStep("check")}
        />
      )}

      {step === "waiting" && (
        <WaitingStep
          isWaiting={isRegistering}
          onCancel={() => setStep("register")}
          transactionStatus={transactionStatus}
          transactionHash={registrationHash || undefined}
        />
      )}

      {step === "success" && registrationHash && (
        <SuccessStep
          transactionHash={registrationHash}
          onReset={onReset}
          onGoToDashboard={onGoToDashboard}
        />
      )}

      {step === "error" && <ErrorStep onReset={onReset} />}
    </div>
  );
}
