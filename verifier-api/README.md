# 🚀 Initia Delegation Verifier API (Vercel)

**완전 무료** Vercel 플랫폼에서 실행되는 Initia 네트워크 delegation 검증 API입니다.

## ✨ 주요 기능

- 🔍 Initia 네트워크 delegation 상태 확인
- 💰 최소 staking 요구사항 검증
- 🔄 Bech32 주소를 Hex 주소로 변환
- 🌐 자동 HTTPS 및 글로벌 CDN
- 🔧 환경 변수 지원

## 🏗️ 아키텍처

```
verifier-api/
├── api/                    # Vercel Serverless Functions
│   ├── index.ts           # 메인 문서 페이지 (/)
│   ├── verify.ts          # delegation 검증 (/verify)
│   ├── health.ts          # 헬스 체크 (/health)
│   └── config.ts          # 설정 정보 (/config)
├── src/                   # 공통 비즈니스 로직
│   ├── types.ts           # TypeScript 타입 정의
│   ├── config.ts          # 설정 및 상수 관리
│   ├── utils.ts           # 유틸리티 함수들
│   └── delegation-service.ts  # Delegation 비즈니스 로직
├── vercel.json            # Vercel 배포 설정
└── package.json           # Vercel 최적화 의존성
```

## 🚀 빠른 배포

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Add Vercel deployment"
git push origin main
```

### 2. Vercel에 배포

#### 방법 A: Vercel CLI (추천)

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

#### 방법 B: Vercel 웹사이트 (간편)

1. [vercel.com](https://vercel.com) 방문
2. "New Project" 클릭
3. GitHub 계정 연결
4. 레포지토리 선택
5. **자동 배포 완료!** 🎉

### 3. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 설정:

```bash
VALIDATOR_ADDRESS=initvaloper1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx
ADDRESS_PREFIX=init
DENOM=uinit
DECIMALS=6
REQUIRED_AMOUNT=5
RPC_ENDPOINT=https://lcd-initia.keplr.app
```

## 📡 API 엔드포인트

배포 후 제공되는 URL: `https://keplr-ideathon.vercel.app`

### GET `/verify` - 메인 검증 API

주어진 주소의 delegation을 확인하고 자격을 검증합니다.

**요청:**

```
GET https://keplr-ideathon.vercel.app/verify?address=init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz
```

**성공 응답:**

```json
{
  "bech32Address": "init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz",
  "hexAddress": "0x1234567890abcdef...",
  "delegationAmount": "100000",
  "requiredAmount": "5000000",
  "isQualified": false,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**에러 응답:**

```json
{
  "error": "Insufficient staking amount",
  "message": "Required: 5.000000 INIT, Current: 0.100000 INIT"
}
```

### GET `/health` - 헬스 체크

```json
{
  "status": "healthy",
  "platform": "vercel",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### GET `/config` - 설정 정보

```json
{
  "prefix": "init",
  "denom": "uinit",
  "decimals": 6,
  "requiredAmount": 5,
  "rpcEndpoint": "https://lcd-initia.keplr.app",
  "validatorAddress": "initvaloper1qvmhe73us...",
  "platform": "vercel"
}
```

### GET `/` - API 문서

API 사용법과 예시를 제공하는 대화형 문서

## ⚙️ 환경 설정

| 변수명              | 기본값                                               | 설명                         |
| ------------------- | ---------------------------------------------------- | ---------------------------- |
| `VALIDATOR_ADDRESS` | `initvaloper1qvmhe73us6z3h72j06d0sqsxqxt5pa6ak2aczx` | 확인할 validator 주소        |
| `ADDRESS_PREFIX`    | `init`                                               | Bech32 주소 prefix           |
| `DENOM`             | `uinit`                                              | Token denomination           |
| `DECIMALS`          | `6`                                                  | Token decimals               |
| `REQUIRED_AMOUNT`   | `5`                                                  | 최소 required staking amount |
| `RPC_ENDPOINT`      | `https://lcd-initia.keplr.app`                       | Initia RPC endpoint          |

## 🧪 로컬 개발

```bash
# 의존성 설치
yarn install --ignore-engines

# 빌드
yarn build

# Vercel 로컬 개발 서버 실행
yarn dev
```

로컬에서 `http://localhost:3000`으로 접근 가능

## 📊 Vercel 무료 제한사항

- ✅ **무제한 요청** (Fair Use Policy 적용)
- ✅ **100GB 대역폭/월**
- ✅ **10초 함수 실행 시간**
- ✅ **100개 서버리스 함수**
- ✅ **글로벌 CDN**
- ✅ **커스텀 도메인**
- ✅ **자동 HTTPS**

**💡 이 제한은 대부분의 API 사용 사례에 충분합니다!**

## 🔧 개발 가이드

### 새로운 API 엔드포인트 추가

1. `api/` 디렉토리에 새 TypeScript 파일 생성:

```typescript
import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
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

  // 비즈니스 로직 구현
  res.status(200).json({
    message: "Hello from new endpoint",
    timestamp: new Date().toISOString(),
  });
}
```

2. `vercel.json`에 라우트 추가 (필요한 경우):

```json
{
  "routes": [
    {
      "src": "/new-endpoint",
      "dest": "/api/new-endpoint"
    }
  ]
}
```

### 모니터링 및 디버깅

Vercel 대시보드에서 확인 가능한 정보:

- 📊 **Functions** - 각 API 호출 통계
- 🐛 **Real-time Logs** - 실시간 로그 확인
- 📈 **Analytics** - 사용량 및 성능 메트릭
- 🌍 **Edge Network** - 전 세계 CDN 성능

### 커스텀 도메인 연결

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Domains
3. 도메인 추가 후 DNS 설정
4. 자동 HTTPS 인증서 발급

## 🚀 CI/CD 자동화

### GitHub Actions 예시

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: yarn install --ignore-engines

      - name: Build
        run: yarn build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🤝 기여하기

1. 이 레포지토리를 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🔗 관련 링크

- 🌐 [Vercel 공식 문서](https://vercel.com/docs)
- ⚡ [Vercel Serverless Functions](https://vercel.com/docs/functions)
- 🔗 [Initia Network](https://initia.xyz/)
- 👛 [Keplr Wallet](https://www.keplr.app/)
- 📘 [Bech32 Address Format](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)

---

## 🎉 완전 무료로 운영하는 프로덕션 API!

**더 이상 서버 비용 걱정 없이, 전 세계 사용자에게 빠르고 안정적인 API를 제공하세요!**

### Step 3: 배포된 API 테스트

```bash
# 실제 배포된 URL로 테스트
TEST_URL=https://keplr-ideathon.vercel.app yarn test:api
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
curl https://keplr-ideathon.vercel.app/health
curl "https://keplr-ideathon.vercel.app/verify?address=init10alvsy3f0a6vsr7ghjh3rtygrhygavsk3tscgz"
```
