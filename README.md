# SOLve Frontend

SOLve 프론트엔드 프로젝트입니다. React, TypeScript, Vite, Tailwind CSS 기반으로 구성되어 있고,
라우팅, 기본 인증 상태 관리, Axios API 클라이언트, 공통 UI 컴포넌트를 포함합니다.

## Requirements

- Node.js `22`
- npm `10+`

홀수 버전 Node.js(예: 23)는 일부 패키지에서 `EBADENGINE` 경고가 날 수 있어 `22 LTS` 사용을 권장합니다.

## Getting Started

```bash
nvm use
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하면 됩니다.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API / Environment

기본 API 프록시는 [vite.config.ts](./vite.config.ts)에서
`/api -> http://localhost:8080`으로 연결되어 있습니다.

환경변수는 선택 사항이며, 없으면 기본값을 사용합니다.

```env
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT_MS=10000
```

실제 기본값은 [config.ts](./src/constants/config.ts)에서 관리합니다.

## Project Notes

- 앱 진입점은 [App.tsx](./src/App.tsx)입니다.
- 라우팅은 [Router.tsx](./src/routes/Router.tsx)에서 관리합니다.
- API 클라이언트는 [apiClient.ts](./src/services/apiClient.ts)에 있습니다.
- 전역 스타일 토큰은 [index.css](./src/index.css)에 있습니다.
