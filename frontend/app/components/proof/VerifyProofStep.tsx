"use client";

interface VerifyProofStepProps {
  proof: string;
  onVerifyProof: () => void;
  onReset: () => void;
}

export default function VerifyProofStep({
  proof,
  onVerifyProof,
  onReset,
}: VerifyProofStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🛸</div>
        <h2 className="text-2xl font-bold text-white mb-2">Proof Generated</h2>
        <p className="text-cyan-200">
          Your zero-knowledge proof is ready for verification
        </p>
      </div>

      <div className="bg-slate-800/40 border border-cyan-400/30 rounded-xl p-4">
        <h3 className="text-cyan-300 text-sm font-medium mb-2">
          Generated Proof
        </h3>
        <p className="text-cyan-300 font-mono text-xs break-all bg-slate-800/50 p-3 rounded-lg">
          {proof}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          className="bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
        >
          Reset
        </button>
        <button
          onClick={onVerifyProof}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Verify Proof
        </button>
      </div>
    </div>
  );
}
