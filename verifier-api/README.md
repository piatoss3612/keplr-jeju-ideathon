# Initia Delegation Verification Lambda

AWS Lambda 함수를 사용하여 Initia 네트워크의 delegation을 확인하고 주소를 변환하는 서비스입니다.

## ✨ 주요 기능

- ✅ Bech32 주소 형식 검증
- 🔍 Initia 네트워크 delegation 상태 확인
- 💰 최소 staking 요구사항 검증
- 🔄 Bech32 주소를 Hex 주소로 변환
- 🌐 CORS 지원으로 웹 애플리케이션 통합

## 🏗️ 아키텍처

리팩토링된 코드는 다음과 같은 모듈화된 구조를 가집니다:

```
src/
├── lambda.ts              # 메인 Lambda 핸들러
├── types.ts               # TypeScript 타입 정의
├── config.ts              # 설정 및 상수 관리
├── utils.ts               # 유틸리티 함수들
├── delegation-service.ts  # Delegation 비즈니스 로직
└── local-server.ts        # 로컬 개발용 서버
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 설정

```bash
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 변경하세요
```

### 3. 빌드

```bash
yarn build
```

### 4. 로컬 개발 서버 실행

```bash
# TypeScript로 직접 실행 (개발용)
yarn dev

# 또는 컴파일된 JavaScript로 실행
yarn serve
```

### 5. 테스트

```bash
yarn test
```

## 📡 API 엔드포인트

### GET `/verify`

주어진 주소의 delegation을 확인하고 자격을 검증합니다.

**파라미터:**

- `address` (required): 확인할 bech32 주소

**예시 요청:**

```
GET /verify?address=init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz
```

**성공 응답 (200):**

```json
{
  "bech32Address": "init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz",
  "hexAddress": "0x...",
  "delegationAmount": "5000000",
  "requiredAmount": "5000000",
  "isQualified": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**에러 응답 (400/500):**

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

### GET `/health`

서비스 상태를 확인합니다.

### GET `/config`

현재 설정을 확인합니다 (개발용).

## ⚙️ 설정

환경 변수를 통해 다음 설정을 변경할 수 있습니다:

| 변수명              | 기본값                                               | 설명                         |
| ------------------- | ---------------------------------------------------- | ---------------------------- |
| `VALIDATOR_ADDRESS` | `initvaloper1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx` | 확인할 validator 주소        |
| `ADDRESS_PREFIX`    | `init`                                               | Bech32 주소 prefix           |
| `DENOM`             | `uinit`                                              | Token denomination           |
| `DECIMALS`          | `6`                                                  | Token decimals               |
| `REQUIRED_AMOUNT`   | `5`                                                  | 최소 required staking amount |
| `RPC_ENDPOINT`      | `https://lcd-initia.keplr.app`                       | Initia RPC endpoint          |
| `PORT`              | `3000`                                               | 로컬 서버 포트               |

## 🧪 테스트

테스트는 여러 시나리오를 커버합니다:

- ✅ 정상적인 delegation 확인
- ❌ 잘못된 주소 형식
- ❌ 파라미터 누락
- ❌ 불충분한 delegation
- ⚠️ 네트워크 오류 처리

```bash
# 전체 테스트 실행
yarn test

# 빌드 없이 TypeScript로 직접 테스트 (개발용)
tsx test/lambda-test.ts
```

## 📦 배포

### Serverless Framework로 배포

```bash
# 개발 환경에 배포
yarn build
serverless deploy --stage dev

# 프로덕션 환경에 배포
serverless deploy --stage prod
```

### Serverless Offline으로 로컬 테스트

```bash
yarn offline
```

## 🔧 개발

### 코드 구조

- **types.ts**: 모든 TypeScript 인터페이스와 타입 정의
- **config.ts**: 환경 변수와 상수 관리
- **utils.ts**: 재사용 가능한 유틸리티 함수들
- **delegation-service.ts**: Delegation 관련 비즈니스 로직
- **lambda.ts**: AWS Lambda 진입점 및 요청 처리

### 로깅

구조화된 로깅을 위해 `formatLog` 함수를 사용합니다:

```typescript
import { formatLog } from "./utils.js";

console.log(formatLog("INFO", "Operation completed", { data }));
console.error(formatLog("ERROR", "Operation failed", { error }));
```

### 에러 처리

일관된 에러 응답을 위해 유틸리티 함수들을 사용합니다:

```typescript
import { createErrorResponse, createSuccessResponse } from "./utils.js";

// 에러 응답
return createErrorResponse(400, "Invalid input", "Detailed message");

// 성공 응답
return createSuccessResponse({ data: result });
```

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 라이선스

MIT License

## 🔗 관련 링크

- [Initia Network](https://initia.xyz/)
- [Keplr Wallet](https://www.keplr.app/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Serverless Framework](https://www.serverless.com/)
