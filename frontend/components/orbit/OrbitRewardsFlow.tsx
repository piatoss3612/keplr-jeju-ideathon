"use client";

import { useKeplrContext } from "@/context/KeplrProvider";
import CheckEligibility from "./CheckEligibility";
import ProgressIndicator from "./ProgressIndicator";
import RegisterStep from "./RegisterStep";
import WaitingStep from "./WaitingStep";
import SuccessStep from "./SuccessStep";
import ErrorStep from "./ErrorStep";
import { RegistrationStep } from "@/context/OrbitRewardsProvider";

interface OrbitRewardsFlowProps {
  step: RegistrationStep;
  setStep: (step: RegistrationStep) => void;
  isRegistering: boolean;
  registrationHash: string | null;
  keplr: ReturnType<typeof useKeplrContext>;
  onRegisterOrUpdate: () => void;
  onReset: () => void;
  onGoToDashboard: () => void;
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
}: OrbitRewardsFlowProps) {
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
        />
      )}

      {step === "success" && registrationHash && (
        <SuccessStep
          transactionHash={registrationHash}
          onReset={onReset}
          onGoToDashboard={onGoToDashboard}
        />
      )}

      {step === "error" && <ErrorStep onRetry={onReset} onReset={onReset} />}
    </div>
  );
}
