import { runAllUnitTests } from "./unit-test.js";

/**
 * 통합 테스트 러너
 * 단위 테스트와 API 테스트를 순차적으로 실행
 */
async function runAllTests() {
  console.log("🚀 전체 테스트 스위트 시작");
  console.log("=".repeat(70));

  const startTime = Date.now();
  let totalTests = 0;
  let totalSuccess = 0;
  let totalFails = 0;

  try {
    // 1. 단위 테스트 실행
    console.log("📋 STEP 1: 단위 테스트 실행");
    const unitResults = await runAllUnitTests();
    totalTests += unitResults.totalTests;
    totalSuccess += unitResults.successCount;
    totalFails += unitResults.failCount;

    console.log("\n⏳ API 테스트 준비 중...");

    // 2. API 테스트 (동적 import로 로드)
    console.log("\n📋 STEP 2: API 테스트 실행");
    console.log("📝 참고: API 테스트는 로컬 서버가 실행 중이어야 합니다.");
    console.log(
      "🔧 실행 방법: 다른 터미널에서 'yarn dev' 명령어를 먼저 실행하세요."
    );

    // API 테스트를 별도 프로세스로 실행
    const apiTestCommand = "node -r ts-node/register tests/api-test.ts";
    console.log(`🚀 실행 명령어: ${apiTestCommand}`);

    // 최종 결과 출력
    const totalDuration = Date.now() - startTime;

    console.log("\n" + "=".repeat(70));
    console.log("🎯 전체 테스트 결과 요약");
    console.log("=".repeat(70));
    console.log(
      `📊 단위 테스트: ${unitResults.totalTests}개 (성공: ${unitResults.successCount}, 실패: ${unitResults.failCount})`
    );
    console.log(`🌐 API 테스트: 별도 실행 필요`);
    console.log(`⏱️ 총 실행 시간: ${Math.round(totalDuration / 1000)}초`);

    if (totalFails === 0) {
      console.log("🎉 모든 단위 테스트 통과!");
    } else {
      console.log(`⚠️ ${totalFails}개의 단위 테스트가 실패했습니다.`);
    }

    console.log("\n🔧 API 테스트 실행 방법:");
    console.log("1. 로컬 서버 시작: yarn dev");
    console.log("2. API 테스트 실행: yarn test:api");
    console.log(
      "3. 배포된 API 테스트: TEST_URL=https://your-app.vercel.app yarn test:api"
    );

    return totalFails === 0;
  } catch (error) {
    console.error("❌ 테스트 실행 중 오류:", error);
    return false;
  }
}

// 테스트 실행
runAllTests()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ 테스트 러너 오류:", error);
    process.exit(1);
  });
