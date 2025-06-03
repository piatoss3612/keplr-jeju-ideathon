export interface DelegationVerificationRequest {
  address: string;
}

export interface DelegationVerificationResponse {
  bech32Address: string;
  hexAddress: string;
  delegationAmount: string;
  requiredAmount: string;
  isQualified: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  example?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DelegationInfo {
  amount: string;
  denom: string;
  isEnough: boolean;
}

export interface AppConfig {
  validatorAddress: string;
  prefix: string;
  denom: string;
  decimals: number;
  requiredAmount: number;
  rpcEndpoint: string;
}
