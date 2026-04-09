import financeMascotImageSrc from '../../assets/finance/finance-mascot.png'
import type { FinanceProduct, FinancialProductType } from '../../types/finance'

const commonNoticeLines = [
  '만기 전 해지 시 약정한 이율보다 낮은 중도해지 금리가 적용됩니다.',
  '우대 금리는 각 조건 충족 시 다음 달 1일부터 만기 전일까지 적용됩니다.',
  '이 예금은 예금자보호법에 따라 1인당 최고 5천만 원까지 보호됩니다.',
]

export const financeSectionLabels: Record<FinancialProductType, string> = {
  SAVINGS: 'ESG 적금 상품',
  LOAN: 'ESG 대출 상품',
}

export const financeProducts: FinanceProduct[] = [
  {
    id: 'esg-master-savings',
    type: 'SAVINGS',
    name: 'ESG 마스터 적금',
    listDescription: '만기까지 900점 유지 성공 시 최고 10% 우대 제공',
    listRateLabel: '연 10.0%',
    heroDescription: '목표를 끝까지 지키면 큰 혜택이 따라와요',
    heroImageSrc: financeMascotImageSrc,
    heroRateSummary: '기본 연 4.0% + 만기 유지 우대 6.0%',
    heroRateHighlight: '최고 연 10.0%',
    detailFields: [
      { label: '가입 대상', value: '제한 없음' },
      { label: '계약 기간', value: '12개월' },
      { label: '가입 금액', value: '300,000원' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription: '만기 시점까지 900점 이상을 유지하면 우대 금리가 적용됩니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '가입하기',
    applyTitle: '적금 가입하기',
    applyFields: [
      { label: '월 납입액', value: '300,000원' },
      { label: '가입 기간', value: '12개월' },
      { label: '적용 금리', value: '최고 연 10.0%' },
    ],
    completion: {
      title: '가입이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 선택을 응원합니다.',
      fields: [
        { label: '가입 상품', value: 'ESG 마스터 적금' },
        { label: '적용 금리', value: '최고 연 10.0%' },
        { label: '월 납입액', value: '300,000원' },
        { label: '만기일', value: '2027.04.08 (12개월)' },
      ],
      primaryActionLabel: '내 적금 확인하기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
  {
    id: 'green-step-up-savings',
    type: 'SAVINGS',
    name: '그린 스텝업 적금',
    listDescription: '점수가 50점 오를 때마다 연 1% 추가',
    listRateLabel: '연 5.0%',
    heroDescription: '내 점수가 자랄수록 금리도 함께 자라나요',
    heroImageSrc: financeMascotImageSrc,
    heroRateSummary: '기본 연 2.0% + 우대 최고 3.0%',
    heroRateHighlight: '최고 연 5.0%',
    detailFields: [
      { label: '가입 대상', value: '제한 없음' },
      { label: '계약 기간', value: '12개월' },
      { label: '가입 금액', value: '300,000원' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription:
      '가입 시점 대비 ESG 총점이 50점씩 오를 때마다 다음 달 추가 금리 1.0%를 제공합니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '가입하기',
    applyTitle: '적금 가입하기',
    applyFields: [
      { label: '월 납입액', value: '300,000원' },
      { label: '가입 기간', value: '12개월' },
      { label: '적용 금리', value: '최고 연 5.0%' },
    ],
    completion: {
      title: '가입이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 가치 있는 선택을 응원합니다.',
      fields: [
        { label: '가입 상품', value: '그린 스텝업 적금' },
        { label: '적용 금리', value: '최고 연 5.2%' },
        { label: '월 납입액', value: '300,000원' },
        { label: '만기일', value: '2027.03.23 (12개월)' },
      ],
      primaryActionLabel: '내 적금 확인하기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
  {
    id: 'earth-guardian-savings',
    type: 'SAVINGS',
    name: '지구 수호대 적금',
    listDescription: '월별 E 영역 목표 달성 시 추가 금리 제공',
    listRateLabel: '연 5.0%',
    heroDescription: '환경 실천을 꾸준히 이어갈수록 혜택도 커집니다',
    heroImageSrc: financeMascotImageSrc,
    heroRateSummary: '기본 연 3.0% + 우대 최고 2.0%',
    heroRateHighlight: '최고 연 5.0%',
    detailFields: [
      { label: '가입 대상', value: '제한 없음' },
      { label: '계약 기간', value: '12개월' },
      { label: '가입 금액', value: '300,000원' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription: '매월 E 영역 목표를 달성하면 다음 달 추가 금리를 제공합니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '가입하기',
    applyTitle: '적금 가입하기',
    applyFields: [
      { label: '월 납입액', value: '300,000원' },
      { label: '가입 기간', value: '12개월' },
      { label: '적용 금리', value: '최고 연 5.0%' },
    ],
    completion: {
      title: '가입이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 선택을 응원합니다.',
      fields: [
        { label: '가입 상품', value: '지구 수호대 적금' },
        { label: '적용 금리', value: '최고 연 5.0%' },
        { label: '월 납입액', value: '300,000원' },
        { label: '만기일', value: '2027.04.08 (12개월)' },
      ],
      primaryActionLabel: '내 적금 확인하기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
  {
    id: 'warm-companion-savings',
    type: 'SAVINGS',
    name: '따뜻한 동행 적금',
    listDescription: '정기 후원 및 사회적 소비 시 최고 0.5%씩 우대',
    listRateLabel: '연 7.0%',
    heroDescription: '좋은 소비와 기부가 쌓일수록 더 높은 금리를 받으세요',
    heroImageSrc: financeMascotImageSrc,
    heroRateSummary: '기본 연 3.0% + 우대 최고 4.0%',
    heroRateHighlight: '최고 연 7.0%',
    detailFields: [
      { label: '가입 대상', value: '제한 없음' },
      { label: '계약 기간', value: '12개월' },
      { label: '가입 금액', value: '300,000원' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription: '기부 및 사회적 소비 결제 기록이 매월 유지되면 우대 금리를 제공합니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '가입하기',
    applyTitle: '적금 가입하기',
    applyFields: [
      { label: '월 납입액', value: '300,000원' },
      { label: '가입 기간', value: '12개월' },
      { label: '적용 금리', value: '최고 연 7.0%' },
    ],
    completion: {
      title: '가입이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 선택을 응원합니다.',
      fields: [
        { label: '가입 상품', value: '따뜻한 동행 적금' },
        { label: '적용 금리', value: '최고 연 7.0%' },
        { label: '월 납입액', value: '300,000원' },
        { label: '만기일', value: '2027.04.08 (12개월)' },
      ],
      primaryActionLabel: '내 적금 확인하기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
  {
    id: 'smart-finance-savings',
    type: 'SAVINGS',
    name: '바른 금융 스마트 적금',
    listDescription: '퀴즈 목표 달성 및 연체 없을 시 추가 금리',
    listRateLabel: '연 5.5%',
    heroDescription: '금융 습관과 꾸준한 실천이 금리 혜택으로 이어집니다',
    heroImageSrc: financeMascotImageSrc,
    heroRateSummary: '기본 연 3.0% + 우대 최고 2.5%',
    heroRateHighlight: '최고 연 5.5%',
    detailFields: [
      { label: '가입 대상', value: '제한 없음' },
      { label: '계약 기간', value: '12개월' },
      { label: '가입 금액', value: '300,000원' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription:
      '매월 G 영역 퀴즈 목표 달성 시 우대 금리를 제공하고, 만기까지 연체와 패널티가 없으면 추가 혜택이 붙습니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '가입하기',
    applyTitle: '적금 가입하기',
    applyFields: [
      { label: '월 납입액', value: '300,000원' },
      { label: '가입 기간', value: '12개월' },
      { label: '적용 금리', value: '최고 연 5.5%' },
    ],
    completion: {
      title: '가입이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 선택을 응원합니다.',
      fields: [
        { label: '가입 상품', value: '바른 금융 스마트 적금' },
        { label: '적용 금리', value: '최고 연 5.5%' },
        { label: '월 납입액', value: '300,000원' },
        { label: '만기일', value: '2027.04.08 (12개월)' },
      ],
      primaryActionLabel: '내 적금 확인하기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
  {
    id: 'esg-micro-loan',
    type: 'LOAN',
    name: 'ESG 소액대출',
    badge: '2030 씬파일러를 위한',
    listDescription: '금융 이력이 부족해도 ESG 점수로 공정하게',
    listRateLabel: '연 6.0% ~ 8.5%',
    heroDescription: '금융 이력이 부족해도 ESG 점수로 공정하게',
    heroImageSrc: financeMascotImageSrc,
    detailFields: [
      { label: '가입 대상', value: 'ESG 점수 750점 이상 고객' },
      { label: '계약 기간', value: '12개월' },
      { label: '최대 한도', value: '3,000,000원' },
      { label: '대출 금리', value: '연 최저 6% ~ 최고 8.5%' },
    ],
    benefitTitle: '우대 조건',
    benefitDescription: 'ESG 점수가 오를 때마다 더 좋은 한도와 금리를 받을 수 있습니다.',
    noticeLines: commonNoticeLines,
    actionLabel: '나의 한도 알아보기',
    userOfferLabel: '현재 850점, 7.0% 금리 적용 중',
    loanTiers: [
      { scoreLabel: '900점 이상', limitLabel: '300만', rateLabel: '연 6.0%' },
      { scoreLabel: '800점 이상', limitLabel: '200만', rateLabel: '연 7.0%' },
      { scoreLabel: '700점 이상', limitLabel: '100만', rateLabel: '연 8.5%' },
    ],
    applyTitle: 'ESG 소액대출 신청하기',
    applyFields: [
      { label: '대출 한도', value: '3,000,000원' },
      { label: '대출 기간', value: '12개월' },
      { label: '대출 금리', value: '연 6.0%' },
    ],
    completion: {
      title: '신청이 완료되었습니다!',
      description: '지속 가능한 내일을 위한 당신의 가치 있는 선택을 응원합니다.',
      fields: [
        { label: '신청 상품', value: 'ESG 소액대출' },
        { label: '확정 금리', value: '연 7.0%' },
        { label: '대출금', value: '2,000,000원' },
        { label: '대출 기간', value: '12개월' },
      ],
      primaryActionLabel: '내 대출 현황 보기',
      secondaryActionLabel: '메인으로 가기',
    },
  },
]

export const savingsProducts = financeProducts.filter((product) => product.type === 'SAVINGS')

export const loanProducts = financeProducts.filter((product) => product.type === 'LOAN')

export const getFinanceProductById = (productId: string) =>
  financeProducts.find((product) => product.id === productId)
