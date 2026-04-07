import type { EnvActivityType } from './envActivityData'

type GuideTone = 'good' | 'bad'

interface GuideSection {
  tone: GuideTone
  title: string
  items: string[]
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
    subtitle: '당일 이용 내역이 확인되는 전체 화면을 제출해 주세요.',
    uploadCaption: '최대 10MB 이하의 선명한 이미지 파일',
    notice:
      '부적절한 방법으로 인증을 시도할 경우, 포인트 회수 및 서비스 이용에 제한이 있을 수 있습니다. 모든 인증은 관리자의 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '이런 정보가 한 화면에 보여야 해요',
        items: [
          '당일 이용 내역이 보이는 전체 화면을 제출해 주세요.',
          '로고, 상단바, 결제 정보 또는 영수증 정보가 함께 보여야 합니다.',
          '텀블러 할인 또는 개인컵 할인 문구가 꼭 포함되어야 합니다.',
        ],
      },
      {
        tone: 'bad',
        title: '이 경우 반려될 수 있어요',
        items: [
          '할인 문구, 날짜, 시간, 결제 정보 중 하나라도 빠지면 반려될 수 있습니다.',
          '잘린 화면, 흐린 이미지, 과거 내역, 중복 제출 이미지는 인정되지 않습니다.',
        ],
      },
    ],
  },
  'shared-bike': {
    type: 'shared-bike',
    title: '공유 자전거 인증하기',
    subtitle: '대여 완료 또는 이용 내역이 보이는 전체 화면을 제출해 주세요.',
    uploadCaption: '최대 10MB 이하의 선명한 이미지 파일',
    notice:
      '부적절한 방법으로 인증을 시도할 경우, 포인트 회수 및 서비스 이용에 제한이 있을 수 있습니다. 모든 인증은 관리자의 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '이런 정보가 한 화면에 보여야 해요',
        items: [
          '당일 대여 내역이 보이는 전체 화면을 제출해 주세요.',
          '로고, 상단바, 이용 시간, 결제 정보 또는 대여 이력이 함께 보여야 합니다.',
          '자전거 번호, 대여소 정보, 이용 상태 중 실제 이용을 확인할 수 있는 정보가 포함되어야 합니다.',
        ],
      },
      {
        tone: 'bad',
        title: '이 경우 반려될 수 있어요',
        items: [
          '이용 시간, 결제 또는 대여 정보가 빠진 화면은 반려될 수 있습니다.',
          '홈 화면, 지도 화면, 흐린 이미지, 과거 내역, 중복 제출 이미지는 인정되지 않습니다.',
        ],
      },
    ],
  },
  'ev-rental': {
    type: 'ev-rental',
    title: '전기차 대여 인증하기',
    subtitle: '전기차 대여 또는 이용 완료 내역이 보이는 전체 화면을 제출해 주세요.',
    uploadCaption: '최대 10MB 이하의 선명한 이미지 파일',
    notice:
      '부적절한 방법으로 인증을 시도할 경우, 포인트 회수 및 서비스 이용에 제한이 있을 수 있습니다. 모든 인증은 관리자의 검수를 거칩니다.',
    guides: [
      {
        tone: 'good',
        title: '이런 정보가 한 화면에 보여야 해요',
        items: [
          '당일 대여 또는 이용 내역이 보이는 전체 화면을 제출해 주세요.',
          '로고, 상단바, 이용 시간, 결제 정보 또는 대여 이력이 함께 보여야 합니다.',
          '전기차 표시 또는 차량 정보를 확인할 수 있는 내용이 포함되어야 합니다.',
        ],
      },
      {
        tone: 'bad',
        title: '이 경우 반려될 수 있어요',
        items: [
          '전기차 표시, 차량 정보, 이용 시간, 결제 정보 중 하나라도 빠지면 반려될 수 있습니다.',
          '일반 차량 화면, 잘린 캡처, 흐린 이미지, 과거 내역, 중복 제출 이미지는 인정되지 않습니다.',
        ],
      },
    ],
  },
}
