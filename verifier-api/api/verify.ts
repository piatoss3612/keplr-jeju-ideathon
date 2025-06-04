import { VercelRequest, VercelResponse } from "@vercel/node";
import { DelegationVerificationResponse } from "../src/types.js";
import { config, HTTP_STATUS } from "../src/config.js";
import {
  validateAddress,
  convertAddressToHex,
  createErrorResponse,
  createSuccessResponse,
  formatLog,
} from "../src/utils.js";
import { DelegationService } from "../src/delegation-service.js";

// Delegation 서비스 인스턴스
const delegationService = new DelegationService();

/**
 * Vercel Function for delegation verification
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // GET 요청만 허용
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
      message: "Only GET requests are supported",
    });
    return;
  }

  console.log(
    formatLog("INFO", "Vercel function invoked", {
      method: req.method,
      url: req.url,
      query: req.query,
    })
  );

  try {
    // 1. 요청 검증
    const address = req.query.address as string;

    if (!address) {
      const errorResponse = createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Address parameter is required",
        "Please provide a valid bech32 address",
        `/verify?address=${config.prefix}10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz`
      );

      res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
      return;
    }

    // 2. 주소 형식 검증
    const validation = validateAddress(address);
    if (!validation.isValid) {
      const errorResponse = createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid address format",
        validation.error
      );

      res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
      return;
    }

    // 3. Delegation 검증
    const verificationResult = await delegationService.verifyDelegation(
      address
    );

    if (!verificationResult.isQualified) {
      const formattedRequired = delegationService.formatDelegationAmount(
        verificationResult.requiredAmount
      );
      const formattedCurrent = delegationService.formatDelegationAmount(
        verificationResult.delegationAmount
      );

      const errorResponse = createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Insufficient staking amount",
        `Required: ${formattedRequired}, Current: ${formattedCurrent}`
      );

      res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
      return;
    }

    // 4. 주소 변환
    const hexAddress = convertAddressToHex(address, config.prefix);

    // 5. 성공 응답 생성
    const response: DelegationVerificationResponse = {
      bech32Address: address,
      hexAddress,
      delegationAmount: verificationResult.delegationAmount,
      requiredAmount: verificationResult.requiredAmount,
      isQualified: verificationResult.isQualified,
      timestamp: new Date().toISOString(),
    };

    console.log(
      formatLog("INFO", "Delegation verification successful", response)
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(formatLog("ERROR", "Vercel function error", { error }));

    // 네트워크 관련 에러 구분
    if (error instanceof Error) {
      if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: "Network error",
          message:
            "Failed to connect to blockchain network. Please try again later.",
        });
        return;
      }

      if (error.message.includes("Delegation not found")) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "No delegation found",
          message: `No delegation found for validator ${config.validatorAddress}`,
        });
        return;
      }
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
