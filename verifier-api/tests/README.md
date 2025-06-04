# 🧪 Verifier API 테스트 가이드

이 문서는 Initia Delegation Verifier API의 다양한 테스트 방법을 설명합니다.

## 📋 테스트 종류

### 1. 🔧 단위 테스트 (Unit Tests)

비즈니스 로직 함수들의 개별 동작을 검증합니다.

```bash
# 단위 테스트만 실행
yarn test:unit
```

**테스트 대상:**

- `validateAddress()` - 주소 검증 로직
- `convertAddressToHex()` - 주소 변환 로직
- `formatLog()` - 로그 포맷팅
- `DelegationService` - 서비스 인스턴스 생성

### 2. 🌐 API 테스트 (Integration Tests)

실제 API 엔드포인트의 동작을 검증합니다.

```bash
# 로컬 서버 테스트 (서버가 실행 중이어야 함)
yarn test:local

# 배포된 API 테스트
TEST_URL=https://your-app.vercel.app yarn test:api
```

**테스트 엔드포인트:**

- `GET /` - API 문서 페이지
- `GET /health` - 헬스 체크
- `GET /config` - 설정 정보
- `GET /verify` - delegation 검증 (다양한 케이스)

### 3. 🚀 통합 테스트 (Full Test Suite)

```bash
# 단위 테스트 + API 테스트 가이드
yarn test
```

## 🔧 테스트 실행 방법

### Step 1: 단위 테스트 실행

```bash
cd verifier-api
yarn test:unit
```

**예상 결과:**

```
🧪 단위 테스트 시작
──────────────────────────────────────────────────
✅ validateAddress - 유효한 주소 (0ms)
✅ validateAddress - 빈 주소 (0ms)
✅ convertAddressToHex - 유효한 변환 (2ms)
...
🎯 단위 테스트 결과
📊 총 테스트: 10
✅ 성공: 10
📈 성공률: 100.0%
```

### Step 2: 로컬 API 테스트

#### 2-1. 로컬 서버 시작

```bash
# 터미널 1에서 (백그라운드 실행)
yarn dev
```

#### 2-2. 서버 준비 확인

```bash
# 터미널 2에서 (별도 터미널)
curl http://localhost:3000/health
```

**예상 응답:**

```json
{
  "status": "healthy",
  "platform": "vercel",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2-3. API 테스트 실행

```bash
# 터미널 2에서 계속
yarn test:local
```

### Step 3: 배포된 API 테스트

```bash
# 실제 배포된 URL로 테스트
TEST_URL=https://your-app.vercel.app yarn test:api
```

## 🧪 수동 테스트 방법

### 1. 브라우저 테스트

```bash
# 로컬 서버 시작 후
open http://localhost:3000
```

### 2. cURL 테스트

```bash
# 헬스 체크
curl http://localhost:3000/health

# 설정 확인
curl http://localhost:3000/config

# 유효한 주소 테스트
curl "http://localhost:3000/verify?address=init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz"

# 잘못된 주소 테스트
curl "http://localhost:3000/verify?address=invalid"
```

### 3. 배포된 API 테스트

```bash
# 배포 URL로 동일한 테스트
curl https://your-app.vercel.app/health
curl "https://your-app.vercel.app/verify?address=init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz"
```

## 📊 테스트 결과 해석

### ✅ 성공 케이스

- 상태 코드 200
- 예상된 JSON 응답 구조
- 필수 필드 존재

### ❌ 실패 케이스 (예상됨)

- **주소 없음**: 400 에러, "Address parameter is required"
- **잘못된 형식**: 400 에러, "Invalid address format"
- **네트워크 에러**: 500 에러, RPC 연결 실패

### ⚠️ 가변 케이스

- **실제 delegation 확인**: 네트워크 상태에 따라 결과 다름
- **RPC 응답 시간**: 네트워크 상황에 따라 변동

## 🚨 문제 해결

### 문제 1: Vercel 로컬 서버가 시작되지 않음

```bash
# 포트 충돌 확인
lsof -i :3000

# 캐시 정리
yarn clean
yarn install --ignore-engines

# 다시 시도
yarn dev
```

### 문제 2: 단위 테스트 실패

```bash
# TypeScript 컴파일 확인
yarn build

# 의존성 재설치
rm -rf node_modules yarn.lock
yarn install --ignore-engines
```

### 문제 3: API 테스트 실패

```bash
# 네트워크 연결 확인
ping lcd-initia.keplr.app

# 환경 변수 확인
echo $RPC_ENDPOINT
```

## 📝 테스트 확장 방법

### 새로운 단위 테스트 추가

`tests/unit-test.ts`에 테스트 케이스 추가:

```typescript
{
  name: "새로운 테스트",
  test: () => {
    const result = yourFunction("input");
    assert(result.expected, "Expected behavior");
  }
}
```

### 새로운 API 테스트 추가

`tests/api-test.ts`에 테스트 케이스 추가:

```typescript
{
  name: "새로운 API 테스트",
  endpoint: "/new-endpoint",
  expectedStatus: 200,
  validate: (data) => data.field === "expected"
}
```

## 🎯 테스트 자동화

### GitHub Actions 예시

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: yarn install --ignore-engines
      - run: yarn test:unit
      - run: yarn build
```

### Vercel 배포 후 자동 테스트

```bash
# 배포 완료 후 자동 테스트
vercel --prod && TEST_URL=$(vercel ls --scope=team | grep Production | awk '{print $2}') yarn test:api
```

---

## 🎉 완료 체크리스트

- [ ] ✅ 단위 테스트 모두 통과
- [ ] 🌐 로컬 API 테스트 통과
- [ ] 🚀 배포 API 테스트 통과
- [ ] 📖 수동 브라우저 테스트 확인
- [ ] 🔧 오류 케이스 동작 확인

모든 체크리스트가 완료되면 프로덕션 배포 준비 완료입니다! 🎊
