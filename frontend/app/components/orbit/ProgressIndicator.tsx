"use client";

import { RegistrationStep } from "@/context/OrbitRewardsProvider";

export interface ProgressIndicatorProps {
  currentStep: RegistrationStep;
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const steps = [
    { id: "check", label: "Check", icon: "🔍" },
    { id: "register", label: "Register", icon: "📝" },
    { id: "waiting", label: "Processing", icon: "⏳" },
    { id: "success", label: "Complete", icon: "✅" },
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

  return (
    <div className="mb-4 w-full">
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-3 relative px-1">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);

          return (
            <div key={step.id} className="flex flex-col items-center z-10">
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 mb-1
                  ${
                    status === "completed"
                      ? "bg-green-500 text-white"
                      : status === "active"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-600 text-gray-400"
                  }
                `}
              >
                <span className="text-[10px]">
                  {status === "completed" ? "✓" : index + 1}
                </span>
              </div>

              {/* Step Label */}
              <div
                className={`
                  text-[10px] font-medium text-center transition-all duration-300 leading-tight max-w-12
                  ${
                    status === "completed"
                      ? "text-green-400"
                      : status === "active"
                      ? "text-purple-400"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </div>
            </div>
          );
        })}

        {/* Connection line background */}
        <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-600 -z-10">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
            style={{
              width: `${Math.max(
                0,
                (currentIndex / (steps.length - 1)) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Current step info */}
      <div className="text-center">
        <span className="text-xs text-gray-400">
          {currentStep === "error"
            ? "❌ Registration Failed"
            : `Step ${currentIndex + 1} of ${steps.length}`}
        </span>
      </div>
    </div>
  );
}
