import { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "../src/config.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    prefix: config.prefix,
    denom: config.denom,
    decimals: config.decimals,
    requiredAmount: config.requiredAmount,
    rpcEndpoint: config.rpcEndpoint,
    // 보안상 validator 주소는 일부만 표시
    validatorAddress: config.validatorAddress.slice(0, 20) + "...",
    platform: "vercel",
  });
}
