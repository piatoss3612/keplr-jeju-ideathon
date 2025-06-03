import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DelegationVerificationResponse } from "./types.js";
import { config, HTTP_STATUS } from "./config.js";
import {
  validateAddress,
  convertAddressToHex,
  createErrorResponse,
  createSuccessResponse,
  formatLog,
} from "./utils.js";
import { DelegationService } from "./delegation-service.js";

// Delegation 서비스 인스턴스
const delegationService = new DelegationService();

/**
 * AWS Lambda 핸들러 함수
 * 주어진 주소의 delegation을 확인하고 자격을 검증합니다.
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(
    formatLog("INFO", "Lambda function invoked", {
      httpMethod: event.httpMethod,
      path: event.path,
      queryStringParameters: event.queryStringParameters,
    })
  );

  try {
    // 1. 요청 검증
    const address = event.queryStringParameters?.address;

    if (!address) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Address parameter is required",
        "Please provide a valid bech32 address",
        `/verify?address=${config.prefix}10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz`
      );
    }

    // 2. 주소 형식 검증
    const validation = validateAddress(address);
    if (!validation.isValid) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid address format",
        validation.error
      );
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

      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "Insufficient staking amount",
        `Required: ${formattedRequired}, Current: ${formattedCurrent}`
      );
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
    return createSuccessResponse(response);
  } catch (error) {
    console.error(formatLog("ERROR", "Lambda function error", { error }));

    // 네트워크 관련 에러 구분
    if (error instanceof Error) {
      if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        return createErrorResponse(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Network error",
          "Failed to connect to blockchain network. Please try again later."
        );
      }

      if (error.message.includes("Delegation not found")) {
        return createErrorResponse(
          HTTP_STATUS.BAD_REQUEST,
          "No delegation found",
          `No delegation found for validator ${config.validatorAddress}`
        );
      }
    }

    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};
