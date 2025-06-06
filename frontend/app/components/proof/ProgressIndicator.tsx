"use client";

type ProofStep = "check" | "proof" | "verify";

interface ProgressIndicatorProps {
  currentStep: ProofStep;
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const steps = [
    { id: "check" as ProofStep, label: "Check Eligibility" },
    { id: "proof" as ProofStep, label: "Generate" },
    { id: "verify" as ProofStep, label: "Verify" },
  ];

  const getProgress = () => {
    switch (currentStep) {
      case "check":
        return "33%";
      case "proof":
        return "66%";
      case "verify":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step) => (
          <span
            key={step.id}
            className={`text-sm font-medium ${
              currentStep === step.id
                ? step.id === "check"
                  ? "text-cyan-300"
                  : step.id === "proof"
                  ? "text-pink-300"
                  : "text-purple-300"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
      <div className="w-full bg-slate-800/60 rounded-full h-2 shadow-inner">
        <div
          className="bg-gradient-to-r from-cyan-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
          style={{ width: getProgress() }}
        ></div>
      </div>
    </div>
  );
}

export type { ProofStep };
