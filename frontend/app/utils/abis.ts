export const PROVER_ABI = [
  {
    type: "function",
    name: "API_BASE_URL",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllTierThresholds",
    inputs: [],
    outputs: [
      { name: "asteroid", type: "uint256", internalType: "uint256" },
      { name: "comet", type: "uint256", internalType: "uint256" },
      { name: "star", type: "uint256", internalType: "uint256" },
      { name: "galaxy", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getThresholdForTier",
    inputs: [{ name: "tier", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "threshold", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getTierForAmount",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "tier", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getTierName",
    inputs: [{ name: "tier", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "name", type: "string", internalType: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proof",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proveQualification",
    inputs: [
      {
        name: "webProof",
        type: "tuple",
        internalType: "struct WebProof",
        components: [
          {
            name: "webProofJson",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "bech32Address", type: "string", internalType: "string" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proveSpecificTier",
    inputs: [
      {
        name: "webProof",
        type: "tuple",
        internalType: "struct WebProof",
        components: [
          {
            name: "webProofJson",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "bech32Address", type: "string", internalType: "string" },
      { name: "targetTier", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "qualifiesForTier",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "tier", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "qualified", type: "bool", internalType: "bool" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "setBlock",
    inputs: [{ name: "blockNo", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setChain",
    inputs: [
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "blockNo", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "DelegationNotQualified",
    inputs: [{ name: "bech32Address", type: "string", internalType: "string" }],
  },
  {
    type: "error",
    name: "DelegationNotQualified",
    inputs: [{ name: "bech32Address", type: "string", internalType: "string" }],
  },
  { type: "error", name: "FailedInnerCall", inputs: [] },
  {
    type: "error",
    name: "InsufficientDelegationForTier",
    inputs: [
      { name: "requested", type: "uint256", internalType: "uint256" },
      { name: "required", type: "uint256", internalType: "uint256" },
      { name: "actual", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidAmountString",
    inputs: [{ name: "invalidAmount", type: "string", internalType: "string" }],
  },
  {
    type: "error",
    name: "InvalidAmountString",
    inputs: [{ name: "invalidAmount", type: "string", internalType: "string" }],
  },
  {
    type: "error",
    name: "InvalidBech32Address",
    inputs: [
      { name: "invalidAddress", type: "string", internalType: "string" },
    ],
  },
  {
    type: "error",
    name: "InvalidBech32Address",
    inputs: [
      { name: "invalidAddress", type: "string", internalType: "string" },
    ],
  },
  {
    type: "error",
    name: "InvalidHexAddress",
    inputs: [{ name: "invalidHex", type: "string", internalType: "string" }],
  },
  {
    type: "error",
    name: "InvalidHexAddress",
    inputs: [{ name: "invalidHex", type: "string", internalType: "string" }],
  },
  {
    type: "error",
    name: "InvalidTierValue",
    inputs: [{ name: "invalidTier", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "InvalidTierValue",
    inputs: [{ name: "invalidTier", type: "uint256", internalType: "uint256" }],
  },
] as const;
