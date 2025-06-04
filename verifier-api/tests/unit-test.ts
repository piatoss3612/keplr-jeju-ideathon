import {
  validateAddress,
  convertAddressToHex,
  formatLog,
} from "../src/utils.js";
import { DelegationService } from "../src/delegation-service.js";

/**
 * 단위 테스트 결과 인터페이스
 */
interface UnitTestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

/**
 * 테스트 실행 헬퍼
 */
function runUnitTest(
  name: string,
  testFn: () => void | Promise<void>
): Promise<UnitTestResult> {
  return new Promise(async (resolve) => {
    const startTime = Date.now();

    try {
      await testFn();
      resolve({
        name,
        success: true,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      resolve({
        name,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
    }
  });
}

/**
 * 어설션 헬퍼
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEquals(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, but got ${actual}`);
  }
}

/**
 * 단위 테스트 케이스들
 */
const unitTests = [
  // validateAddress 테스트
  {
    name: "validateAddress - 유효한 주소",
    test: () => {
      const result = validateAddress(
        "init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz"
      );
      assert(result.isValid, "Valid address should return isValid: true");
    },
  },
  {
    name: "validateAddress - 빈 주소",
    test: () => {
      const result = validateAddress("");
      assert(!result.isValid, "Empty address should return isValid: false");
      assertEquals(result.error, "Address parameter is required");
    },
  },
  {
    name: "validateAddress - 잘못된 형식",
    test: () => {
      const result = validateAddress("invalid");
      assert(!result.isValid, "Invalid format should return isValid: false");
      assertEquals(result.error, "Invalid bech32 address format");
    },
  },
  {
    name: "validateAddress - 너무 짧은 주소",
    test: () => {
      const result = validateAddress("init1short");
      assert(!result.isValid, "Short address should return isValid: false");
    },
  },

  // convertAddressToHex 테스트
  {
    name: "convertAddressToHex - 유효한 변환",
    test: () => {
      const hex = convertAddressToHex(
        "init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz",
        "init"
      );
      assert(hex.startsWith("0x"), "Hex address should start with 0x");
      assert(hex.length > 10, "Hex address should have reasonable length");
    },
  },
  {
    name: "convertAddressToHex - 잘못된 주소로 에러",
    test: () => {
      try {
        convertAddressToHex("invalid", "init");
        throw new Error("Should have thrown an error");
      } catch (error) {
        assert(error instanceof Error, "Should throw an Error");
        assert(
          error.message.includes("Failed to convert"),
          "Error message should be descriptive"
        );
      }
    },
  },

  // formatLog 테스트
  {
    name: "formatLog - 기본 로그",
    test: () => {
      const log = formatLog("INFO", "Test message");
      assert(log.includes("INFO"), "Log should contain level");
      assert(log.includes("Test message"), "Log should contain message");
      assert(log.includes("T"), "Log should contain timestamp");
    },
  },
  {
    name: "formatLog - 데이터가 있는 로그",
    test: () => {
      const data = { test: "value" };
      const log = formatLog("ERROR", "Test error", data);
      assert(log.includes("ERROR"), "Log should contain level");
      assert(log.includes("Test error"), "Log should contain message");
      assert(log.includes('"test"'), "Log should contain data");
    },
  },

  // DelegationService 테스트 (생성자만)
  {
    name: "DelegationService - 인스턴스 생성",
    test: () => {
      const service = new DelegationService();
      assert(service instanceof DelegationService, "Should create instance");

      const serviceWithEndpoint = new DelegationService("https://test.com");
      assert(
        serviceWithEndpoint instanceof DelegationService,
        "Should create instance with custom endpoint"
      );
    },
  },
  {
    name: "DelegationService - formatDelegationAmount",
    test: () => {
      const service = new DelegationService();
      const formatted = service.formatDelegationAmount("5000000");
      assert(formatted.includes("5"), "Should format amount correctly");
      assert(formatted.includes("INIT"), "Should include token symbol");
    },
  },
];

/**
 * 모든 단위 테스트 실행
 */
async function runAllUnitTests() {
  console.log("🧪 단위 테스트 시작");
  console.log("─".repeat(50));

  const results: UnitTestResult[] = [];

  for (const unitTest of unitTests) {
    const result = await runUnitTest(unitTest.name, unitTest.test);
    results.push(result);

    const status = result.success ? "✅" : "❌";
    const duration = `${result.duration}ms`;
    console.log(`${status} ${result.name} (${duration})`);

    if (!result.success && result.error) {
      console.log(`   💥 ${result.error}`);
    }
  }

  // 결과 요약
  const totalTests = results.length;
  const successCount = results.filter((r) => r.success).length;
  const failCount = totalTests - successCount;
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + r.duration, 0) / totalTests
  );

  console.log("\n" + "=".repeat(50));
  console.log("🎯 단위 테스트 결과");
  console.log("=".repeat(50));
  console.log(`📊 총 테스트: ${totalTests}`);
  console.log(`✅ 성공: ${successCount}`);
  console.log(`❌ 실패: ${failCount}`);
  console.log(`⏱️ 평균 실행 시간: ${avgDuration}ms`);
  console.log(`📈 성공률: ${((successCount / totalTests) * 100).toFixed(1)}%`);

  return { totalTests, successCount, failCount };
}

// 단독 실행 시
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runAllUnitTests()
    .then(({ failCount }) => {
      if (failCount > 0) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ 단위 테스트 실행 중 오류:", error);
      process.exit(1);
    });
}

export { runAllUnitTests };
