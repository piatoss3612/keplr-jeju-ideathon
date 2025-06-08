"use client";

import { RegistrationStep } from "@/context/OrbitChronicleProvider";

export interface ProgressIndicatorProps {
  currentStep: RegistrationStep;
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const steps = [
    { id: "check", label: "SCAN", icon: "🔍", color: "cyan" },
    { id: "register", label: "REGISTER", icon: "📝", color: "purple" },
    { id: "waiting", label: "PROCESSING", icon: "⏳", color: "yellow" },
    { id: "success", label: "COMPLETE", icon: "✅", color: "green" },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const currentIndex = steps.findIndex((step) => step.id === currentStep);

    if (currentStep === "error") {
      return stepIndex <= currentIndex - 1 ? "completed" : "pending";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepData = steps[currentIndex] || steps[0];

  const getStepColors = (status: string, stepColor: string) => {
    if (status === "completed") {
      return {
        circle:
          "bg-green-400 border-green-300 text-black shadow-lg shadow-green-400/50",
        label: "text-green-300",
        glow: "shadow-green-400/50",
      };
    }
    if (status === "active") {
      const colorMap = {
        cyan: {
          circle:
            "bg-cyan-400 border-cyan-300 text-black shadow-lg shadow-cyan-400/60",
          label: "text-cyan-300",
          glow: "shadow-cyan-400/60",
        },
        purple: {
          circle:
            "bg-purple-400 border-purple-300 text-black shadow-lg shadow-purple-400/60",
          label: "text-purple-300",
          glow: "shadow-purple-400/60",
        },
        yellow: {
          circle:
            "bg-yellow-400 border-yellow-300 text-black shadow-lg shadow-yellow-400/60",
          label: "text-yellow-300",
          glow: "shadow-yellow-400/60",
        },
        green: {
          circle:
            "bg-green-400 border-green-300 text-black shadow-lg shadow-green-400/60",
          label: "text-green-300",
          glow: "shadow-green-400/60",
        },
      };
      return colorMap[stepColor as keyof typeof colorMap] || colorMap.cyan;
    }
    return {
      circle: "bg-gray-700 border-gray-600 text-gray-500",
      label: "text-gray-500",
      glow: "",
    };
  };

  return (
    <div className="mb-8 w-full">
      {/* Enhanced Cyberpunk Progress Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="text-2xl animate-pulse">{currentStepData.icon}</div>
          <h3 className="text-xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
            ORBIT REGISTRATION PROTOCOL
          </h3>
        </div>
        <div className="text-sm text-gray-400 font-orbitron">
          {currentStep === "error"
            ? "⚠️ SYSTEM ERROR DETECTED"
            : `PHASE ${currentIndex + 1} OF ${steps.length} • ${
                currentStepData.label
              }`}
        </div>
      </div>

      {/* Enhanced Step Progress Track */}
      <div className="relative mb-6">
        {/* Main Progress Track */}
        <div className="flex justify-between items-center relative">
          {/* Step Nodes */}
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const colors = getStepColors(status, step.color);
            const isActive = status === "active";
            const isCompleted = status === "completed";

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center z-10"
              >
                {/* Node Circle */}
                <div className="relative">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all duration-500
                      ${colors.circle}
                      ${isActive ? "animate-pulse scale-110" : ""}
                      ${isCompleted ? "scale-105" : ""}
                    `}
                  >
                    {isActive && (
                      <div
                        className={`absolute inset-0 rounded-full animate-ping ${colors.glow.replace(
                          "shadow-lg ",
                          "bg-"
                        )}`}
                        style={{ opacity: 0.3 }}
                      ></div>
                    )}
                    <span className="text-sm font-orbitron relative z-10">
                      {isCompleted ? "✓" : index + 1}
                    </span>
                  </div>
                </div>

                {/* Node Label */}
                <div
                  className={`
                  text-xs font-orbitron font-bold tracking-wider text-center mt-2 transition-all duration-300
                  ${colors.label}
                  ${isActive ? "animate-pulse" : ""}
                `}
                >
                  {step.label}
                </div>

                {/* Active Node Glow Effect */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl animate-pulse"></div>
                )}
              </div>
            );
          })}

          {/* Background Track - positioned to connect node centers */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-gray-700 rounded-full overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600"></div>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 rounded-full transition-all duration-1000 shadow-lg shadow-cyan-400/30"
              style={{
                width: `${Math.max(
                  0,
                  (currentIndex / (steps.length - 1)) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Current Phase Status Card */}
      <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
          <span className="text-cyan-300 font-orbitron text-sm tracking-wider">
            {currentStep === "error"
              ? "ERROR PHASE - TROUBLESHOOTING REQUIRED"
              : `CURRENT PHASE: ${currentStepData.label}`}
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
