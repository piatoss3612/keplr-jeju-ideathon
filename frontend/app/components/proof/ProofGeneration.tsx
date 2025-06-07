"use client";

import { useKeplrContext } from "@/context/KeplrProvider";
import CheckEligibility from "./CheckEligibility";
import ProgressIndicator from "./ProgressIndicator";
import GenerateProofStep from "./GenerateProofStep";
import VerifyProofStep from "./VerifyProofStep";
import { ProofStep } from "./ProgressIndicator";
import { BrandedHash } from "@vlayer/sdk";
import { PROVER_ABI } from "@/app/utils/abis";

interface ProofGenerationProps {
  step: ProofStep;
  setStep: (step: ProofStep) => void;
  isGeneratingProof: boolean;
  proof: BrandedHash<typeof PROVER_ABI, "proveSpecificTier"> | null;
  keplr: ReturnType<typeof useKeplrContext>;
  onGenerateProof: () => void;
  onVerifyProof: () => void;
  onReset: () => void;
}

export default function ProofGeneration({
  step,
  setStep,
  isGeneratingProof,
  proof,
  keplr,
  onGenerateProof,
  onVerifyProof,
  onReset,
}: ProofGenerationProps) {
  return (
    <div>
      <ProgressIndicator currentStep={step} />

      {step === "check" && (
        <CheckEligibility onEligibilityConfirmed={() => setStep("proof")} />
      )}

      {step === "proof" && (
        <GenerateProofStep
          keplr={keplr}
          isGeneratingProof={isGeneratingProof}
          onGenerateProof={onGenerateProof}
          onBackToCheck={() => setStep("check")}
        />
      )}

      {step === "verify" && proof && (
        <VerifyProofStep
          proof={proof}
          onVerifyProof={onVerifyProof}
          onReset={onReset}
        />
      )}
    </div>
  );
}
