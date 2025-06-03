import { AppConfig } from "./types.js";

export const config: AppConfig = {
  validatorAddress:
    process.env.VALIDATOR_ADDRESS ||
    "initvaloper1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx",
  prefix: process.env.ADDRESS_PREFIX || "init",
  denom: process.env.DENOM || "uinit",
  decimals: parseInt(process.env.DECIMALS || "6"),
  requiredAmount: parseInt(process.env.REQUIRED_AMOUNT || "5"),
  rpcEndpoint: process.env.RPC_ENDPOINT || "https://lcd-initia.keplr.app",
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
} as const;
