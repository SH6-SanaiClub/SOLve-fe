# AI_RULES.md

# FE 코드 컨벤션

이 문서는 프론트엔드 작업을 수행하는 AI 에이전트(Codex 포함)가 반드시 먼저 읽고 따라야 하는 규칙 문서이다. 프론트엔드 작업 시 아래 규칙을 우선 적용한다.

---

# React

## 1. 디렉토리 구조

```text
src/
├── App.tsx                          👉 앱 진입점 — PWA/네트워크 훅 등록 + 라우터 렌더링 (수정 금지)
├── main.tsx                         👉 React 시작점 — ReactDOM.render 담당 (수정 금지)
├── index.css                        👉 전역 스타일 + 디자인 토큰 (색상, 폰트, 간격 변수 정의)
│
├── routes/                          👉 라우팅 설정 — URL과 페이지 컴포넌트 연결
│   ├── Router.tsx                   👉 전체 라우트 정의 ← 새 페이지 추가 시 반드시 수정
│   ├── ProtectedRoute.tsx           👉 로그인 필요 페이지 보호 — 비로그인 시 /login으로 이동
│   └── PublicOnlyRoute.tsx          👉 로그인 상태에서 접근 차단 — 로그인/회원가입 페이지용
│
├── pages/                           👉 라우팅 단위 페이지 컴포넌트 ← 실제 화면 개발은 여기서
│   ├── PageScaffold.tsx             👉 개발 전 페이지 플레이스홀더 틀 (title, description 표시)
│   ├── NotFoundPage.tsx             👉 404 페이지
│   ├── home/                        👉 메인 대시보드 (ESG 등급, 추천 카드, 주간 활동)
│   │   └── HomePage.tsx
│   ├── auth/                        👉 인증 관련 페이지
│   │   ├── LoginPage.tsx            👉 로그인
│   │   ├── SignupPage.tsx           👉 회원가입
│   │   └── SurveyPage.tsx       👉 회원가입 후 유형 분류 설문
│   ├── activities/                  👉 ESG 활동 관련 페이지 (대시보드 카드 클릭으로 진입)
│   │   ├── ActivitiesPage.tsx       👉 S 활동 진입점 (기부 | 가치가게 | 봉사)
│   │   ├── EnvironmentPage.tsx      👉 E 활동 — 친환경 인증 (OCR 업로드)
│   │   ├── SocialPage.tsx           👉 S 활동 — 사회적 기업 상품관 / 기부 / 봉사
│   │   └── GovernancePage.tsx       👉 G 활동 — 출석 체크 / 오늘의 퀴즈
│   ├── finance/                     👉 금융 상품 관련 페이지
│   │   └── FinancePage.tsx          👉 적금 / 대출 상품 목록 및 상세
│   ├── my/                          👉 마이페이지
│   │   └── MyPage.tsx               👉 내 정보 / 활동 이력 / 포인트 / ESG 등급 히스토리
│   └── chatbot/                     👉 AI 챗봇
│       └── ChatbotPage.tsx          👉 추천 결과 기반 자연어 대화 화면
│
├── components/                      👉 재사용 가능한 UI 컴포넌트
│   ├── common/                      👉 어디서든 사용하는 공통 UI
│   │   ├── Button.tsx               👉 버튼 (primary / outline / sub / gray, 크기 variant)
│   │   ├── Card.tsx                 👉 카드 컨테이너 (클릭 이벤트, 타이틀 옵션)
│   │   ├── Input.tsx                👉 입력창 (라벨, 에러 메시지, 인증 완료 체크 포함)
│   │   └── Icons.tsx                👉 앱 전용 아이콘 모음 (Home, Shop, Bank, MyPage 등)
│   └── layout/                      👉 화면 구조(UI 뼈대) 컴포넌트
│       ├── MainLayout.tsx           👉 전체 페이지 틀 — Header + 콘텐츠 영역 + BottomNav 배치
│       ├── Header.tsx               👉 상단 고정 헤더 (left / title / right 슬롯 구조)
│       └── BottomNavigation.tsx     👉 하단 탭바 (홈 / 포인트샵 / 금융상품 / 마이페이지)
│
├── services/                        👉 서버(API) 통신 레이어
│   ├── apiClient.ts                 👉 Axios 공통 인스턴스 ← API 호출 시 반드시 이것만 사용
│   └── interceptors/                👉 요청/응답 자동 처리 (직접 수정 금지)
│       ├── authInterceptor.ts       👉 요청 시 JWT 토큰 자동 첨부
│       └── errorInterceptor.ts      👉 401 응답 시 자동 로그아웃 + /login 이동
│
├── store/                           👉 전역 상태 관리 (Zustand)
│   ├── authStore.ts                 👉 로그인 상태 / accessToken / 유저 정보 (localStorage 유지)
│   ├── appStore.ts                  👉 앱 공통 상태 — 네트워크 연결 여부, PWA 설치 프롬프트
│   └── index.ts                     👉 store 통합 export — import는 여기서
│
├── hooks/                           👉 커스텀 훅 — 로직 재사용 단위
│   ├── useAuth.ts                   👉 인증 상태 접근용 훅 (user, isAuthenticated, setSession 등)
│   ├── useNetworkStatus.ts          👉 온라인/오프라인 상태 감지
│   └── usePwaInstall.ts             👉 PWA 설치 프롬프트 이벤트 감지 및 처리
│
├── constants/                       👉 앱 전역 상수
│   ├── routePaths.ts                👉 경로 상수 모음 ← 새 페이지 추가 시 반드시 수정
│   └── config.ts                    👉 API URL, timeout 등 앱 설정값 (직접 수정 금지)
│
└── types/                           👉 TypeScript 타입 / 인터페이스 정의
    ├── auth.ts                      👉 인증 관련 타입 (AuthSession 등)
    ├── user.ts                      👉 유저 타입 (UserSummary, UserType, UserGrade 등)
    └── api.ts                       👉 API 공통 응답 타입 (ApiErrorPayload 등)
```

## 2. 네이밍 규칙 (Naming Conventions)

이름만 보고 역할이 바로 떠오르게 만든다.

#### 요약

### PascalCase

- 컴포넌트
- 컴포넌트 파일

---

### kebab-case

- CSS 클래스

---

### UPPER_CASE

- 상수

---

### camelCase

- 변수
- 함수
- 이벤트 핸들러
- 커스텀 훅
- utils / hooks 파일
- API 파일

---

#### 상세

### 1. 컴포넌트 이름

- **PascalCase**
- **명사 + 역할**
- 예: UserProfile

---

### 2. 파일명

- **컴포넌트: PascalCase / hooks·utils: camelCase**
- 예: UserProfile.tsx, useAuth.ts

---

### 3. 변수명

- **camelCase**
- 예: userName

---

### 4. boolean 변수

- **camelCase**
- **is / has / can prefix**
- 예: isLoading

---

### 5. 함수 이름

- **camelCase**
- **동사로 시작**
- 예: getUser

---

### 6. 이벤트 핸들러

- **camelCase**
- **handle + 동작**
- 예: handleSubmit

---

### 7. 커스텀 훅

- **camelCase**
- **use + 기능**
- 예: useAuth

---

### 8. API 함수 / 파일

- **camelCase**
- **동사 + 대상 / 파일은 camelCase**
- 예: getUser, userApi.ts

---

### 9. CSS 클래스

- **kebab-case**
- 예: user-card

---

### 10. 상수

- **UPPER_CASE**
- 예: API_BASE_URL

---

## 3. 함수 선언 방식

### 컴포넌트

- **arrow function + const**
- 예: `const UserProfile = () => {}`

---

### 일반 함수

- **arrow function**
- 예: `const getUser = () => {}`

---

### 이벤트 핸들러

- **arrow function + handle prefix**
- 예: `const handleSubmit = () => {}`

---

### useEffect 내부 함수

- **async 필요 시 내부 함수 선언 + 즉시 호출**

```tsx
useEffect(() => {
  const fetchData = async () => {
    await getData()
  }

  fetchData()
}, [])
```

---

### 커스텀 훅

- **arrow function + use prefix**
- 예: `const useAuth = () => {}`

# SOLve 프론트엔드 개발 가이드

## 📌 시작 전 필독

> 이 문서는 프로젝트를 클론한 팀원이 개발을 시작할 때 반드시 읽어야 하는 가이드입니다.
> React 초보자 기준으로 작성되었습니다.

---

## 1. 프로젝트 시작하기

### 환경 요구사항

- **Node.js 22 LTS** 사용 권장 (Node 23은 일부 패키지 경고 발생 가능)
- npm 10+

### 설치 및 실행

```bash
nvm use
npm install
npm run dev
```

### 환경변수 (.env)

`.env` 파일이 없어도 기본값으로 동작합니다. 필요 시 프로젝트 루트에 `.env` 파일 생성 후 아래 값 사용.

```bash
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT_MS=10000
VITE_ENABLE_DEV_AUTH_BYPASS=true
```

⚠️ `VITE_ENABLE_DEV_AUTH_BYPASS=true` 상태에서는 로그인 없이 모든 페이지에 접근 가능합니다. 로컬 개발 중에는 이 상태로 사용하면 됩니다.

## 2. 프로젝트 폴더 구조

```text
src/
├── App.tsx                  # 앱 진입점 (건드리지 않음)
├── main.tsx                 # React 마운트 엔트리 (건드리지 않음)
├── index.css                # 전역 스타일 + 디자인 토큰
│
├── routes/
│   ├── Router.tsx           # 전체 라우팅 설정 ← 새 페이지 추가 시 수정
│   ├── ProtectedRoute.tsx   # 로그인 필요 페이지 보호
│   └── PublicOnlyRoute.tsx  # 로그인 시 접근 차단 (로그인/회원가입)
│
├── pages/                   # 페이지 단위 컴포넌트 ← 여기에 개발
│   ├── PageScaffold.tsx     # 페이지 기본 틀 (플레이스홀더용)
│   ├── NotFoundPage.tsx
│   ├── home/
│   ├── auth/
│   ├── activities/
│   ├── finance/
│   ├── my/
│   └── chatbot/
│
├── components/
│   ├── common/              # 공통 UI 컴포넌트 (Button, Card, Input 등)
│   └── layout/              # 레이아웃 컴포넌트 (Header, BottomNavigation, MainLayout)
│
├── services/
│   ├── apiClient.ts         # Axios 공통 인스턴스 ← API 호출 시 반드시 사용
│   └── interceptors/        # 인증/에러 인터셉터 (직접 수정 X)
│
├── store/
│   ├── authStore.ts         # 로그인 상태 전역 관리
│   ├── appStore.ts          # 앱 공통 상태 (네트워크, PWA 설치 등)
│   └── index.ts             # store export 통합
│
├── hooks/
│   ├── useAuth.ts           # 인증 상태 접근용 훅
│   ├── useNetworkStatus.ts
│   └── usePwaInstall.ts
│
├── constants/
│   ├── routePaths.ts        # 경로 상수 ← 새 페이지 추가 시 수정
│   └── config.ts            # 앱 설정값 (직접 수정 X)
│
└── types/
    ├── auth.ts              # 인증 관련 타입
    ├── user.ts              # 유저 관련 타입
    └── api.ts               # API 응답 타입
```

## 3. 새 페이지 추가하는 방법 (필수 절차)

새 페이지를 만들 때는 아래 **3단계를 반드시 순서대로** 진행합니다.

### Step 1. `src/constants/routePaths.ts`에 경로 추가

```tsx
export const ROUTE_PATHS = {
  // 기존 경로들...
  
  // 새로 추가
  shopEsg: '/shop/esg',
  shopReward: '/shop/reward',
} as const
```

⚠️ 경로 문자열을 페이지 파일에 직접 하드코딩하지 마세요. 반드시 `ROUTE_PATHS` 상수를 사용해야 합니다.

### Step 2. `src/pages/` 하위에 페이지 파일 생성

src/pages/shop/EsgShopPage.tsx   ← 이런 식으로 도메인별 폴더 생성

```tsx
// src/pages/shop/EsgShopPage.tsx
import { PageScaffold } from '../PageScaffold'

export function EsgShopPage() {
  return (
    <PageScaffold
      title="ESG 상품관"
      description="사회적 기업 상품 구매 화면입니다."
    />
  )
}
```

**페이지 파일 기본 구조 (실제 개발 시)**

```tsx
// src/pages/shop/EsgShopPage.tsx
import { MainLayout } from '../../components/layout/MainLayout'
import { Header } from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'

export function EsgShopPage() {
  return (
    <MainLayout
      header={<Header title="ESG 상품관" />}
      nav={<BottomNavigation />}
    >
      {/* 여기에 페이지 내용 작성 */}
    </MainLayout>
  )
}
```

### Step 3. `src/routes/Router.tsx`에 라우트 연결

```tsx
import { EsgShopPage } from '../pages/shop/EsgShopPage'

// ProtectedRoute 안에 추가
<Route path={ROUTE_PATHS.shopEsg} element={<EsgShopPage />} />
```

**로그인 필요 여부에 따라 위치 구분:**

```tsx
{/* 로그인 없이 접근 가능 (로그인, 회원가입) */}
<Route element={<PublicOnlyRoute />}>
  <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
</Route>

{/* 로그인 필요 (대부분의 페이지) */}
<Route element={<ProtectedRoute />}>
  <Route path={ROUTE_PATHS.home} element={<HomePage />} />
  <Route path={ROUTE_PATHS.shopEsg} element={<EsgShopPage />} />
</Route>
```

## 4. 페이지 간 이동 방법

### 버튼/이벤트로 이동 (useNavigate)

```tsx
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'

export function SomeComponent() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate(ROUTE_PATHS.shopEsg)}>
      ESG 상품관으로 이동
    </button>
  )
}
```

### 링크로 이동 (Link)

```tsx
import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'

<Link to={ROUTE_PATHS.activities}>활동 페이지로 이동</Link>
```

### 뒤로가기

```tsx
const navigate = useNavigate()

<button onClick={() => navigate(-1)}>뒤로가기</button>
```

## 5. API 호출 방법

### 기본 원칙

> `axios`를 직접 import해서 쓰지 말고, 반드시 `apiClient`를 사용하세요.
> 토큰 자동 첨부, 401 에러 처리가 모두 자동으로 처리됩니다.

### 기본 사용 예시

```tsx
import { apiClient } from '../../services/apiClient'

const response = await apiClient.get('/esg/score')
const data = response.data

const postResponse = await apiClient.post('/activities/environment', {
  activityType: 'TUMBLER',
  imageUrl: 'https://...'
})
```

### 권장 패턴 — services 레이어 분리

페이지 컴포넌트 안에 API 호출 코드를 길게 작성하지 말고, `services/` 에 함수로 분리하세요.

```tsx
// src/services/esgService.ts
import { apiClient } from './apiClient'

export async function getEsgScore() {
  const response = await apiClient.get('/esg/score')
  return response.data
}

export async function submitEnvironmentActivity(payload: { activityType: string }) {
  const response = await apiClient.post('/activities/environment', payload)
  return response.data
}
```

```tsx
// 페이지에서 사용
import { getEsgScore } from '../../services/esgService'

const score = await getEsgScore()
```

### 에러 처리

```tsx
try {
  const data = await getEsgScore()
} catch (error) {
  console.error(error)
}
```

> 401 에러는 인터셉터가 자동으로 처리합니다 (로그아웃 후 로그인 페이지 이동). 직접 처리하지 않아도 됩니다.

## 6. 전역 상태(Zustand) 사용 방법

### 언제 Zustand를 쓰나요?

| 상황 | 사용할 것 |
| --- | --- |
| 로그인한 유저 정보가 필요할 때 | `useAuth()` 훅 |
| 이 페이지에서만 쓰는 입력값, 토글 상태 | `useState` |
| 여러 페이지에 걸쳐 공유되는 상태 | Zustand store |

> 로컬 상태로 충분한 값까지 Zustand에 올리지 마세요. 오히려 관리가 복잡해집니다.

### 로그인 유저 정보 사용 (useAuth 훅)

```tsx
import { useAuth } from '../../hooks/useAuth'

export function MyPage() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div>
      <p>{user?.name}님 안녕하세요</p>
      <p>현재 등급: {user?.currentGrade}</p>
      <p>보유 포인트: {user?.totalPoints}p</p>
    </div>
  )
}
```

### 로그인 처리 (setSession)

```tsx
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { setSession } = useAuth()

  const handleLogin = async () => {
    const response = await apiClient.post('/auth/login', { id, password })
    
    setSession({
      accessToken: response.data.accessToken,
      user: response.data.user,
    })
  }
}
```

### 로그아웃 처리 (clearSession)

```tsx
const { clearSession } = useAuth()

<button onClick={clearSession}>로그아웃</button>
```

### 새 전역 상태가 필요할 때

1. 정말 여러 페이지에서 공유되어야 하는 값인지 먼저 판단
2. 성격에 맞는 store 파일에 추가 (`authStore` = 인증, `appStore` = 앱 전역 UI)
3. 완전히 새로운 도메인이면 새 store 파일 생성 후 `store/index.ts`에 export 추가

## 7. 공통 컴포넌트 사용 방법

### 사용 가능한 공통 컴포넌트

| 컴포넌트 | 위치 | 용도 |
| --- | --- | --- |
| `Button` | `components/common/Button` | 버튼 (primary / outline / sub / gray) |
| `Card` | `components/common/Card` | 카드 컨테이너 |
| `Input` | `components/common/Input` | 텍스트 입력 |
| `Icons` | `components/common/Icons` | 아이콘 모음 |
| `MainLayout` | `components/layout/MainLayout` | 페이지 전체 레이아웃 틀 |
| `Header` | `components/layout/Header` | 상단 헤더 |
| `BottomNavigation` | `components/layout/BottomNavigation` | 하단 탭바 |

### 기본 페이지 레이아웃 구조

```tsx
import { MainLayout } from '../../components/layout/MainLayout'
import { Header } from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { useNavigate } from 'react-router-dom'

export function SomePage() {
  const navigate = useNavigate()

  return (
    <MainLayout
      header={
        <Header
          left={<button onClick={() => navigate(-1)}>←</button>}
          title="페이지 제목"
        />
      }
      nav={<BottomNavigation />}
    >
      {/* 페이지 내용 */}
    </MainLayout>
  )
}
```

### 스타일 토큰 사용

직접 색상 코드를 쓰지 말고 `index.css`에 정의된 토큰을 사용하세요.

```tsx
<p className="text-font-main">메인 텍스트</p>
<p className="text-font-sub">서브 텍스트</p>
<div className="bg-primary-500">메인 컬러 배경</div>
<div className="bg-bg-light">배경색</div>
```

금지 예시:

```tsx
<p style={{ color: '#334155' }}>텍스트</p>
<div className="bg-[#0046FF]">배경</div>
```

## 8. 타입(TypeScript) 사용 방법

### 기존 타입 활용

```tsx
import type { UserSummary, UserType, UserGrade } from '../../types/user'
import type { AuthSession } from '../../types/auth'
```

### 새 타입 추가 시

`src/types/` 폴더에 도메인별로 파일을 추가하세요.

```tsx
// src/types/esg.ts
export interface EsgScore {
  totalScore: number
  grade: UserGrade
  categoryScores: {
    environment: number
    social: number
    governance: number
  }
}
```

## 9. 개발 시 자주 하는 실수 & 주의사항

### ❌ 경로 하드코딩 금지

```tsx
navigate('/activities/environment')
```

올바른 방식:

```tsx
import { ROUTE_PATHS } from '../../constants/routePaths'
navigate(ROUTE_PATHS.activityEnvironment)
```

### ❌ axios 직접 import 금지

```tsx
import axios from 'axios'
const res = await axios.get('/api/...')
```

올바른 방식:

```tsx
import { apiClient } from '../../services/apiClient'
const res = await apiClient.get('/esg/score')
```

### ❌ App.tsx에 페이지 내용 직접 작성 금지

`App.tsx`는 앱 엔트리 역할만 유지한다. 페이지 내용은 반드시 `pages/`에 작성한다.

### ❌ 환경변수 직접 코드에 박기 금지

```tsx
const BASE_URL = 'http://localhost:8080/api'
```

이미 `apiClient`에 설정되어 있으므로 `apiClient`만 사용한다.

### ⚠️ PWA 캐시 이슈

수정했는데 화면에 반영이 안 될 때 → 브라우저 개발자도구 → Application → Service Workers → `Unregister` 후 캐시 삭제

## 10. 현재 개발 가능 상태 요약

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| 페이지 개발 | ✅ 바로 가능 | `VITE_ENABLE_DEV_AUTH_BYPASS=true`로 인증 우회 |
| API 연동 | ✅ 백엔드 준비되면 바로 가능 | `apiClient` 사용 |
| 공통 컴포넌트 | ✅ 사용 가능 | `components/common`, `components/layout` |
| 라우팅 추가 | ✅ 가능 | `routePaths.ts` + `Router.tsx` 수정 |
| 로그인 기능 | 🔧 개발 필요 | `setSession()` 연결만 하면 됨 |
| ESG 전역 상태 | 🔧 개발 시 추가 | 대시보드 개발 시점에 store 추가 |

## 11. 작업 브랜치 규칙 (권장)

> 공통 컴포넌트 브랜치와 충돌 방지를 위해 `pages/`, `services/`, `store/` 영역 위주로 작업하고, `components/common`과 `components/layout` 수정이 필요하면 팀 내 협의 후 진행하세요.

## 12. AI 에이전트 작업 규칙

AI 에이전트는 아래 규칙을 반드시 지켜야 한다.

1. 작업 전 반드시 `AI_RULES.md`를 먼저 읽고 따른다.
2. 기존 구조를 임의로 바꾸지 않는다.
3. 새 페이지 추가 시 반드시 다음 3개를 함께 검토한다.
   - `src/constants/routePaths.ts`
   - `src/pages/...`
   - `src/routes/Router.tsx`
4. API 호출 시 `axios`를 직접 사용하지 않고 `apiClient`만 사용한다.
5. 페이지에서 API 로직을 길게 작성하지 않고 `services/`로 분리한다.
6. 경로 문자열 하드코딩을 금지하고 `ROUTE_PATHS` 상수를 사용한다.
7. `App.tsx`, `main.tsx`, `services/interceptors/*`, `constants/config.ts`는 특별한 요청이 없는 한 수정하지 않는다.
8. 스타일 작성 시 인라인 스타일과 하드코딩 색상값을 지양하고, 기존 디자인 토큰과 공통 컴포넌트를 우선 사용한다.
9. 전역 상태가 꼭 필요한 경우에만 Zustand store를 사용한다.
10. 코드 생성 시 TypeScript 타입을 우선 맞추고, `any` 사용을 최소화한다.

