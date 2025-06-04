import converter from "bech32-converting";
import { ValidationResult, ErrorResponse } from "./types.js";
import { CORS_HEADERS, HTTP_STATUS } from "./config.js";

// Vercel용 응답 인터페이스 정의
interface VercelResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * 주소 형식 유효성 검사
 */
export function validateAddress(address: string): ValidationResult {
  if (!address) {
    return {
      isValid: false,
      error: "Address parameter is required",
    };
  }

  if (typeof address !== "string") {
    return {
      isValid: false,
      error: "Address must be a string",
    };
  }

  try {
    // bech32 주소 형식 검증 (간단한 검증)
    if (!address.match(/^[a-z0-9]+1[a-z0-9]{38,}$/)) {
      return {
        isValid: false,
        error: "Invalid bech32 address format",
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid address format",
    };
  }
}

/**
 * bech32 주소를 hex로 변환
 */
export function convertAddressToHex(address: string, prefix: string): string {
  try {
    return converter(prefix).toHex(address);
  } catch (error) {
    throw new Error(
      `Failed to convert address to hex: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * API Gateway 응답 생성 (AWS Lambda 호환)
 */
export function createResponse(
  statusCode: number,
  body: Record<string, any>,
  additionalHeaders?: Record<string, string>
): VercelResponse {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...additionalHeaders,
    },
    body: JSON.stringify(body, null, 2),
  };
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(
  statusCode: number,
  error: string,
  message?: string,
  example?: string
): VercelResponse {
  const errorBody: ErrorResponse = {
    error,
    ...(message && { message }),
    ...(example && { example }),
  };

  return createResponse(statusCode, errorBody);
}

/**
 * 성공 응답 생성
 */
export function createSuccessResponse(
  body: Record<string, any>
): VercelResponse {
  return createResponse(HTTP_STATUS.OK, body);
}

/**
 * 로그 메시지 포맷팅
 */
export function formatLog(
  level: "INFO" | "ERROR" | "WARN",
  message: string,
  data?: any
): string {
  const timestamp = new Date().toISOString();
  const baseMessage = `[${timestamp}] ${level}: ${message}`;

  if (data) {
    return `${baseMessage}\nData: ${JSON.stringify(data, null, 2)}`;
  }

  return baseMessage;
}
