import {
  useCallProver,
  useWaitForProvingResult,
  useWebProof,
} from "@vlayer/react";
import { ProveArgs } from "@vlayer/sdk";
import { Abi, ContractFunctionName } from "viem";
import { startPage, expectUrl, notarize } from "@vlayer/sdk/web_proof";
import { baseSepolia } from "viem/chains";
import { PROVER_ADDRESS } from "@/app/utils/constants";
import { PROVER_ABI } from "@/app/utils/abis";

export const useKeplrVerificationProof = (bech32Address: string) => {
  const {
    requestWebProof,
    webProof,
    isPending: isWebProofPending,
    error: webProofError,
  } = useWebProof({
    proverCallCommitment: {
      address: PROVER_ADDRESS,
      proverAbi: PROVER_ABI,
      functionName: "proveSpecificTier",
      commitmentArgs: [],
      chainId: baseSepolia.id,
    },
    logoUrl: "/logo.png",
    steps: [
      startPage(
        `https://keplr-ideathon.vercel.app/verify?address=${bech32Address}`,
        "Go to Keplr Verification page"
      ),
      expectUrl(
        `https://keplr-ideathon.vercel.app/verify?address=${bech32Address}`,
        "Check if the address is qualified"
      ),
      notarize(
        `https://keplr-ideathon.vercel.app/verify?address=${bech32Address}`,
        "GET",
        "Generate Proof of Keplr delegation",
        [
          {
            request: {
              // redact all the headers
              headers_except: [],
            },
          },
        ]
      ),
    ],
  });

  if (webProofError) {
    throw webProofError;
  }

  const vlayerProverConfig: Omit<
    ProveArgs<Abi, ContractFunctionName<Abi>>,
    "args"
  > = {
    address: PROVER_ADDRESS,
    proverAbi: PROVER_ABI,
    chainId: baseSepolia.id,
    functionName: "proveSpecificTier",
  };

  const {
    callProver,
    isPending: isCallProverPending,
    isIdle: isCallProverIdle,
    data: hash,
    error: callProverError,
  } = useCallProver(vlayerProverConfig);

  if (callProverError) {
    throw callProverError;
  }

  const {
    isPending: isWaitingForProvingResult,
    data: result,
    error: waitForProvingResultError,
  } = useWaitForProvingResult(hash);

  if (waitForProvingResultError) {
    throw waitForProvingResultError;
  }

  return {
    requestWebProof,
    webProof,
    hash,
    isPending:
      isWebProofPending || isCallProverPending || isWaitingForProvingResult,
    isCallProverIdle,
    isWaitingForProvingResult,
    isWebProofPending,
    callProver,
    result,
  };
};
