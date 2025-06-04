import { VercelRequest, VercelResponse } from "@vercel/node";

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

  // 환경 감지 로직
  const getEnvironment = () => {
    // localhost 요청 감지
    const host = req.headers.host || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return "development";
    }

    // Vercel 로컬 개발 서버 감지
    if (process.env.VERCEL_ENV === "development") {
      return "development";
    }

    // Vercel 프리뷰 환경
    if (process.env.VERCEL_ENV === "preview") {
      return "preview";
    }

    // Node.js 개발 서버
    if (process.env.NODE_ENV === "development") {
      return "development";
    }

    // 기본값 (Vercel 프로덕션)
    return "production";
  };

  const environment = getEnvironment();

  res.status(200).json({
    status: "healthy",
    platform: "vercel",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment,
    // 디버깅용 추가 정보 (개발환경에서만)
    ...(environment === "development" && {
      debug: {
        host: req.headers.host,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
      },
    }),
  });
}
