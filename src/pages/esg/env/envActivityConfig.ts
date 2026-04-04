import type { EnvActivityType } from './envActivityData'

type GuideTone = 'good' | 'bad'

interface GuideSection {
  tone: GuideTone
  title: string
  items: string[]
  previewLabel: string
}

export interface EnvActivityConfig {
  type: EnvActivityType
  title: string
  subtitle: string
  uploadCaption: string
  notice: string
  guides: GuideSection[]
}

export const ENV_ACTIVITY_CONFIG: Record<EnvActivityType, EnvActivityConfig> = {
  tumbler: {
    type: 'tumbler',
    title: '텀블러 인증하기',
    subtitle: '활동을 인증하고 점수와 포인트를 획득하세요.',
    uploadCaption: '최대 10MB 이하의 이미지 파일',
    notice:
      '부적절한 방식으로 인증을 시도할 경우 포인트 회수 및 서비스 이용에 제한이 있을 수 있습니다. 모든 인증은 관리자 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '올바른 예시 (O)',
        items: [
          '- 오늘의 날짜와 시간이 명확히 적힌 사진',
          '- 텀블러 할인 내역이 표시된 영수증 사진',
        ],
        previewLabel: '텀블러 할인 내역이 보이는 영수증 예시',
      },
      {
        tone: 'bad',
        title: '잘못된 예시 (X)',
        items: [
          '- 과거에 촬영했거나 날짜 확인이 어려운 사진',
          '- 중복으로 제출된 동일 영수증 재사용 사진',
        ],
        previewLabel: '날짜가 보이지 않거나 흐린 이미지',
      },
    ],
  },
  'shared-bike': {
    type: 'shared-bike',
    title: '공유 자전거 인증하기',
    subtitle: '활동을 인증하고 점수와 포인트를 획득하세요.',
    uploadCaption: '최대 10MB 이하의 이미지 파일',
    notice:
      '대여 내역이 명확하지 않거나 동일한 이미지가 반복 제출되면 반려될 수 있습니다. 모든 인증은 관리자 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '올바른 예시 (O)',
        items: [
          '- 대여 시간과 반납 시간이 함께 보이는 이용 내역',
          '- 자전거 번호 또는 이용 금액이 보이는 캡처 이미지',
        ],
        previewLabel: '이용 시간과 자전거 정보가 보이는 캡처',
      },
      {
        tone: 'bad',
        title: '잘못된 예시 (X)',
        items: [
          '- 자전거 이용 여부를 확인할 수 없는 홈 화면 캡처',
          '- 이용 날짜가 지나거나 중복 제출된 이미지',
        ],
        previewLabel: '이용 정보가 빠진 화면 캡처',
      },
    ],
  },
  'ev-rental': {
    type: 'ev-rental',
    title: '전기차 대여 인증하기',
    subtitle: '활동을 인증하고 점수와 포인트를 획득하세요.',
    uploadCaption: '최대 10MB 이하의 이미지 파일',
    notice:
      '전기차 이용 여부가 확인되지 않거나 일반 차량 이용 내역이면 반려될 수 있습니다. 모든 인증은 관리자 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '올바른 예시 (O)',
        items: [
          '- 전기차 대여 시간과 차량 정보가 함께 보이는 화면',
          '- 결제 정보와 대여 이력이 동시에 확인되는 영수증',
        ],
        previewLabel: '차량 정보와 대여 시간이 보이는 화면',
      },
      {
        tone: 'bad',
        title: '잘못된 예시 (X)',
        items: [
          '- 일반 차량이거나 차량 종류를 확인할 수 없는 이미지',
          '- 날짜가 잘렸거나 중복 제출된 이미지',
        ],
        previewLabel: '차량 종류가 보이지 않는 흐린 이미지',
      },
    ],
  },
}
