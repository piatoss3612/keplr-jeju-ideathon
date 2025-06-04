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
    message: "Initia Delegation Verification API",
    platform: "Vercel (Free Tier)",
    version: "1.0.0",
    endpoints: {
      verify: {
        path: "/verify",
        method: "GET",
        description: "Verify delegation and convert address",
        parameters: {
          address: "Required. Bech32 address to verify",
        },
        example: `/verify?address=${config.prefix}10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz`,
      },
      health: {
        path: "/health",
        method: "GET",
        description: "Health check endpoint",
      },
      config: {
        path: "/config",
        method: "GET",
        description: "Current configuration",
      },
    },
    features: [
      "✅ Free hosting on Vercel",
      "✅ Automatic HTTPS",
      "✅ Global CDN",
      "✅ CORS enabled",
      "✅ Environment variables support",
    ],
    documentation: {
      github: "https://github.com/your-repo/initia-verifier-api",
      deployment: "https://vercel.com",
    },
  });
}
