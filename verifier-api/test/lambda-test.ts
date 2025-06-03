import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/lambda.js";
import { config } from "../src/config.js";
import { formatLog } from "../src/utils.js";

/**
 * 테스트용 API Gateway 이벤트 생성
 */
const createTestEvent = (address?: string): APIGatewayProxyEvent => {
  return {
    httpMethod: "GET",
    path: "/verify",
    pathParameters: null,
    queryStringParameters: address ? { address } : null,
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
    isBase64Encoded: false,
    requestContext: {} as any,
    resource: "",
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
  };
};

/**
 * 테스트 결과 출력 헬퍼
 */
function logTestResult(testName: string, result: any, error?: any) {
  console.log(`\n📋 ${testName}`);
  console.log("─".repeat(50));

  if (error) {
    console.log("❌ 테스트 실행 중 오류:", error.message);
    return;
  }

  console.log(`상태 코드: ${result.statusCode}`);

  try {
    const body = JSON.parse(result.body);
    console.log("응답 본문:", JSON.stringify(body, null, 2));

    // 성공 응답인 경우 추가 정보 표시
    if (result.statusCode === 200 && body.isQualified) {
      console.log(`✅ 검증 성공 - 자격 조건 충족`);
      console.log(`   주소: ${body.bech32Address}`);
      console.log(`   Hex: ${body.hexAddress}`);
    } else if (result.statusCode === 400) {
      console.log(`⚠️  검증 실패: ${body.error}`);
    }
  } catch (parseError) {
    console.log("응답 파싱 오류:", result.body);
  }
}

/**
 * 메인 테스트 함수
 */
async function runTests() {
  console.log(
    formatLog("INFO", "Lambda 함수 테스트 시작", {
      config: {
        prefix: config.prefix,
        requiredAmount: config.requiredAmount,
        denom: config.denom,
      },
    })
  );

  console.log("\n⚠️  주의사항:");
  console.log(
    "- 실제 Initia 네트워크 API를 호출하므로 네트워크 연결이 필요합니다."
  );
  console.log("- 실제 delegation 상태에 따라 결과가 달라질 수 있습니다.");
  console.log("- 일부 테스트는 의도적으로 실패할 수 있습니다.\n");

  const testCases = [
    {
      name: "✅ 정상적인 bech32 주소로 delegation 확인",
      address: `${config.prefix}10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz`,
      shouldSucceed: "depends", // 실제 delegation 상태에 따라 다름
    },
    {
      name: "❌ address 파라미터 누락",
      address: undefined,
      shouldSucceed: false,
    },
    {
      name: "❌ 빈 문자열 주소",
      address: "",
      shouldSucceed: false,
    },
    {
      name: "❌ 잘못된 형식의 주소",
      address: "invalid_address_format",
      shouldSucceed: false,
    },
    {
      name: "❌ 너무 짧은 주소",
      address: "init1short",
      shouldSucceed: false,
    },
    {
      name: "❌ 잘못된 prefix 주소",
      address: "cosmos1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx",
      shouldSucceed: false,
    },
    {
      name: "⚠️  존재하지 않는 주소 (delegation 없음)",
      address: `${config.prefix}1111111111111111111111111111111111111111`,
      shouldSucceed: false,
    },
  ];

  let successCount = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      const event = createTestEvent(testCase.address);
      const result = await handler(event);

      logTestResult(testCase.name, result);

      // 결과 검증
      if (testCase.shouldSucceed === true && result.statusCode === 200) {
        successCount++;
      } else if (
        testCase.shouldSucceed === false &&
        result.statusCode !== 200
      ) {
        successCount++;
      } else if (testCase.shouldSucceed === "depends") {
        successCount++; // delegation 상태에 따라 달라지므로 항상 성공으로 간주
        console.log(
          "ℹ️  이 테스트는 실제 delegation 상태에 따라 결과가 달라집니다."
        );
      }
    } catch (error) {
      logTestResult(testCase.name, null, error);
    }

    // 테스트 간 간격
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // 테스트 결과 요약
  console.log("\n" + "=".repeat(60));
  console.log("🎯 테스트 결과 요약");
  console.log("=".repeat(60));
  console.log(`총 테스트: ${totalTests}`);
  console.log(`통과: ${successCount}`);
  console.log(`실패: ${totalTests - successCount}`);
  console.log(`성공률: ${((successCount / totalTests) * 100).toFixed(1)}%`);

  if (successCount === totalTests) {
    console.log("\n🎉 모든 테스트가 예상대로 동작했습니다!");
  } else {
    console.log(
      `\n⚠️  ${
        totalTests - successCount
      }개의 테스트가 예상과 다르게 동작했습니다.`
    );
  }

  console.log("\n📝 참고사항:");
  console.log(
    "- delegation이 있는 실제 주소로 테스트하면 더 정확한 결과를 확인할 수 있습니다."
  );
  console.log(
    "- 네트워크 상태나 RPC 엔드포인트 문제로 일시적 실패가 발생할 수 있습니다."
  );
  console.log(
    `- 현재 설정: ${config.requiredAmount} ${config.denom
      .replace("u", "")
      .toUpperCase()} 이상 delegation 필요`
  );
}

/**
 * 테스트 실행
 */
runTests().catch((error) => {
  console.error(formatLog("ERROR", "Test execution failed", { error }));
  process.exit(1);
});
