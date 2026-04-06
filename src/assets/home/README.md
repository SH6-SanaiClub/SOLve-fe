이 폴더는 홈 메인 대시보드 상단 캐릭터 이미지용 경로입니다.

이미지 파일은 아래 이름으로 넣어주세요.

- `main-mascot.png`

권장 사용 방식:

- 파일을 넣은 뒤 `src/pages/home/HomePage.tsx`에서 import 해서 사용합니다.
- 예시:
  - `import mainMascot from '../../assets/home/main-mascot.png'`

주의:

- 현재 레포에는 원본 PNG가 없어서 아직 `src` import 경로로 직접 연결하지 않았습니다.
- 파일이 들어오면 `public` 정적 경로 대신 `src/assets/home/main-mascot.png` import 방식으로 바꾸는 것을 권장합니다.
