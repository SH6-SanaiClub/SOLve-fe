# 공통 컴포넌트 사용 규칙

## 폴더 구분
- `src/components/common`
  여러 화면에서 반복해서 쓰는 기본 단위만 둡니다.
- `src/components/layout`
  화면 뼈대에 해당하는 컴포넌트만 둡니다.
- `src/components/patterns`
  공통이지만 화면 단위에 가까운 패턴을 둡니다.

## common에 넣는 기준
- 화면 2개 이상에서 같은 역할로 반복되면 `common` 후보입니다.
- 도메인 데이터 구조가 다르면 `common`으로 올리지 않습니다.
- 피그마에 없는 variant는 먼저 만들지 않습니다.

## 현재 common 컴포넌트
- `Button`
  기본 CTA, 보조 버튼, 아웃라인 버튼
- `IconButton`
  헤더의 뒤로가기, 채팅, 메뉴처럼 아이콘만 누르는 버튼
- `Input`
  기본 입력 필드
  성공 상태는 `isVerified`, 에러 상태는 `errorText`로 표시
- `Tabs`
  상단 탭 전환
- `Badge`
  상태, 카테고리, 포인트 표시
- `ProgressBar`
  진행률 표시
- `Checkbox`
  약관 동의, 다중 선택
- `Radio`
  단일 선택
- `SelectableCard`
  카드 전체를 눌러 선택하는 UI
- `InfoRow`
  `라벨 - 값` 형태 요약 정보
- `SectionHeader`
  섹션 제목과 우측 메타 정보

## patterns 컴포넌트
- `ResultState`
  완료, 실패, 신청 결과 같은 화면 패턴

## Input 사용 규칙
- `Input`은 입력창과 상태 표시만 담당합니다.
- 중복 확인, 비밀번호 일치 확인, 인증 API 호출은 바깥 컴포넌트에서 처리합니다.
- 검증이 끝난 뒤에만 `isVerified`를 넘깁니다.
- 실패 문구가 있으면 `errorText`를 넘깁니다.

## className 사용 규칙
- `className`은 여백이나 배치 보정 정도만 덮습니다.
- 높이, 색, radius 같은 기본 규칙은 컴포넌트 내부 스타일을 우선합니다.
- 공통 컴포넌트 안에는 `기부`, `적금`, `ESG` 같은 기능 이름을 넣지 않습니다.

## App.tsx
- `src/App.tsx`는 공통 컴포넌트 확인용 샘플입니다.
- 기능 화면 구현은 각 도메인 폴더에서 진행합니다.
