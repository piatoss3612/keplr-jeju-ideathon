import { config } from "../src/config.js";

// 테스트할 API URL (로컬 또는 배포된 URL)
const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: string;
  duration?: number;
}

/**
 * HTTP 요청 헬퍼 함수
 */
async function fetchAPI(
  endpoint: string,
  params?: Record<string, string>
): Promise<{ statusCode: number; data: any; duration: number }> {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const startTime = Date.now();

  try {
    const response = await fetch(url.toString());
    const duration = Date.now() - startTime;
    const data = await response.json();

    return {
      statusCode: response.status,
      data,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    throw {
      statusCode: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    };
  }
}

/**
 * 테스트 케이스들
 */
const testCases = [
  {
    name: "✅ Root endpoint - API 문서",
    endpoint: "/",
    expectedStatus: 200,
    validate: (data: any) => {
      return (
        data.message && data.platform === "Vercel (Free Tier)" && data.endpoints
      );
    },
  },
  {
    name: "✅ Health check",
    endpoint: "/health",
    expectedStatus: 200,
    validate: (data: any) => {
      return data.status === "healthy" && data.platform === "vercel";
    },
  },
  {
    name: "✅ Config endpoint",
    endpoint: "/config",
    expectedStatus: 200,
    validate: (data: any) => {
      return data.prefix && data.denom && data.platform === "vercel";
    },
  },
  {
    name: "❌ Verify without address parameter",
    endpoint: "/verify",
    expectedStatus: 400,
    validate: (data: any) => {
      return data.error === "Address parameter is required";
    },
  },
  {
    name: "❌ Verify with invalid address format",
    endpoint: "/verify",
    params: { address: "invalid_address" },
    expectedStatus: 400,
    validate: (data: any) => {
      return data.error === "Invalid address format";
    },
  },
  {
    name: "❌ Verify with too short address",
    endpoint: "/verify",
    params: { address: "init1short" },
    expectedStatus: 400,
    validate: (data: any) => {
      return data.error === "Invalid address format";
    },
  },
  {
    name: "⚠️ Verify with valid format address (delegation may not exist)",
    endpoint: "/verify",
    params: {
      address: `${config.prefix}10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz`,
    },
    expectedStatus: [200, 400, 500], // 실제 delegation 상태에 따라 다름
    validate: (data: any) => {
      // 성공 시 필수 필드 확인, 실패 시 error 필드 확인
      return data.bech32Address || data.error;
    },
  },
  {
    name: "⚠️ Verify with different chain address",
    endpoint: "/verify",
    params: { address: "cosmos1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx" },
    expectedStatus: [400, 500], // 네트워크 에러 또는 delegation 없음
    validate: (data: any) => {
      return data.error;
    },
  },
];

/**
 * 단일 테스트 실행
 */
async function runTest(testCase: any): Promise<TestResult> {
  const startTime = Date.now();

  try {
    const result = await fetchAPI(testCase.endpoint, testCase.params);
    const duration = Date.now() - startTime;

    // 상태 코드 확인
    const expectedStatuses = Array.isArray(testCase.expectedStatus)
      ? testCase.expectedStatus
      : [testCase.expectedStatus];

    const statusOk = expectedStatuses.includes(result.statusCode);

    // 데이터 검증
    const dataValid = testCase.validate ? testCase.validate(result.data) : true;

    return {
      name: testCase.name,
      success: statusOk && dataValid,
      statusCode: result.statusCode,
      response: result.data,
      duration: result.duration,
    };
  } catch (error: any) {
    return {
      name: testCase.name,
      success: false,
      statusCode: error.statusCode || 0,
      error: error.error || error.message || "Unknown error",
      duration: Date.now() - startTime,
    };
  }
}

/**
 * 테스트 결과 출력
 */
function logTestResult(result: TestResult) {
  console.log(`\n📋 ${result.name}`);
  console.log("─".repeat(70));

  if (result.success) {
    console.log(`✅ 성공 (${result.duration}ms)`);
  } else {
    console.log(`❌ 실패 (${result.duration}ms)`);
  }

  console.log(`상태 코드: ${result.statusCode}`);

  if (result.error) {
    console.log(`오류: ${result.error}`);
  } else if (result.response) {
    console.log(`응답: ${JSON.stringify(result.response, null, 2)}`);
  }
}

/**
 * 전체 테스트 실행
 */
async function runAllTests() {
  console.log("🚀 Vercel API 테스트 시작");
  console.log(`🌐 테스트 URL: ${BASE_URL}`);
  console.log("─".repeat(70));

  const results: TestResult[] = [];

  for (const testCase of testCases) {
    const result = await runTest(testCase);
    results.push(result);
    logTestResult(result);

    // 테스트 간 간격
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // 결과 요약
  const totalTests = results.length;
  const successCount = results.filter((r) => r.success).length;
  const failCount = totalTests - successCount;
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + (r.duration || 0), 0) / totalTests
  );

  console.log("\n" + "=".repeat(70));
  console.log("🎯 테스트 결과 요약");
  console.log("=".repeat(70));
  console.log(`📊 총 테스트: ${totalTests}`);
  console.log(`✅ 성공: ${successCount}`);
  console.log(`❌ 실패: ${failCount}`);
  console.log(`⏱️ 평균 응답 시간: ${avgDuration}ms`);
  console.log(`📈 성공률: ${((successCount / totalTests) * 100).toFixed(1)}%`);

  if (successCount === totalTests) {
    console.log("\n🎉 모든 테스트 통과!");
  } else {
    console.log(`\n⚠️ ${failCount}개의 테스트가 실패했습니다.`);
  }

  console.log("\n📝 참고사항:");
  console.log(
    "- ⚠️ 표시된 테스트는 실제 네트워크 상태에 따라 결과가 달라질 수 있습니다."
  );
  console.log("- 로컬 테스트: yarn test:local");
  console.log(
    "- 배포된 API 테스트: TEST_URL=https://your-app.vercel.app yarn test"
  );

  // 실패한 테스트가 있으면 exit code 1
  if (failCount > 0) {
    process.exit(1);
  }
}

// 테스트 실행
runAllTests().catch((error) => {
  console.error("❌ 테스트 실행 중 오류:", error);
  process.exit(1);
});
