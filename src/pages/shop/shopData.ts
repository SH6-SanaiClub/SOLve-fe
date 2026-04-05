export type ShopCategoryValue = 'all' | 'certificate' | 'education' | 'etc'

export interface ShopTabItem {
  label: string
  value: ShopCategoryValue
}

export interface ShopProduct {
  id: string
  title: string
  category: Exclude<ShopCategoryValue, 'all'>
  price: number
  priceLabel: string
  summary: string
  description: string
  vendor: string
  usageGuideLabel?: string
  imageSrc?: string
  imageAlt?: string
  mediaBackgroundClassName?: string
  mediaTextClassName?: string
  placeholderLabel: string
  placeholderSubLabel?: string
  isPurchased?: boolean
  purchasedAt?: string
  redemptionCode?: string
}

export const shopTabs: ShopTabItem[] = [
  { label: '전체', value: 'all' },
  { label: '자격증', value: 'certificate' },
  { label: '교육권', value: 'education' },
  { label: '기타', value: 'etc' },
]

export const fallbackPointBalance = 12500

export const shopProducts: ShopProduct[] = [
  {
    id: 'toeic-voucher',
    title: 'TOEIC 응시권',
    category: 'certificate',
    price: 12000,
    priceLabel: '12,000 P',
    summary: '어학 자격증 취득을 위한 응시권',
    description:
      '취업 준비에 자주 활용되는 TOEIC 시험 응시권입니다. 구매 후 교환 코드를 확인할 수 있습니다.',
    vendor: 'YBM',
    usageGuideLabel: 'TOEIC',
    mediaBackgroundClassName: 'bg-primary-400',
    mediaTextClassName: 'text-white',
    placeholderLabel: 'TOEIC',
    placeholderSubLabel: 'Test Voucher',
    isPurchased: true,
    purchasedAt: '2026.03.21',
    redemptionCode: 'SOLV-TOEIC-2403',
  },
  {
    id: 'inflearn-pass',
    title: '인프런 강의 할인권',
    category: 'education',
    price: 30000,
    priceLabel: '30,000 P',
    summary: '온라인 강의 수강에 사용할 수 있는 교육 쿠폰',
    description:
      '직무 역량 강화를 위한 교육권입니다. 개발, 데이터, 디자인 등 다양한 강의 결제에 사용할 수 있습니다.',
    vendor: 'Inflearn',
    usageGuideLabel: '인프런(Inflearn)',
    mediaBackgroundClassName: 'bg-gray-100',
    mediaTextClassName: 'text-gray-700',
    placeholderLabel: 'INFLEARN',
    placeholderSubLabel: 'Online Class',
  },
  {
    id: 'photo-coupon',
    title: '취업 증명사진 촬영권',
    category: 'etc',
    price: 15000,
    priceLabel: '15,000 P',
    summary: '이력서 제출용 증명사진 촬영 쿠폰',
    description:
      '스튜디오 제휴 촬영권입니다. 프로필 사진, 증명사진 촬영에 사용할 수 있으며 일부 지점에서만 사용 가능합니다.',
    vendor: 'SOLve Studio',
    usageGuideLabel: 'SOLve Studio',
    mediaBackgroundClassName: 'bg-white',
    mediaTextClassName: 'text-primary-500',
    placeholderLabel: 'PHOTO',
    placeholderSubLabel: 'Studio Coupon',
  },
  {
    id: 'opic-coupon',
    title: 'OPIc 응시 할인권',
    category: 'certificate',
    price: 5000,
    priceLabel: '5,000 P',
    summary: '말하기 시험 응시료 할인 쿠폰',
    description:
      '영어 말하기 시험 준비를 위한 응시 할인권입니다. 구매 후 내역 화면에서 쿠폰 코드를 다시 확인할 수 있습니다.',
    vendor: 'ACTFL',
    usageGuideLabel: '오픽(OPic)',
    mediaBackgroundClassName: 'bg-primary-50',
    mediaTextClassName: 'text-primary-500',
    placeholderLabel: 'OPIC',
    placeholderSubLabel: 'Speaking Test',
    isPurchased: true,
    purchasedAt: '2026.03.26',
    redemptionCode: 'SOLV-OPIC-9821',
  },
]

export const getShopProductById = (productId: string) =>
  shopProducts.find((product) => product.id === productId)

export const getShopCategoryLabel = (category: Exclude<ShopCategoryValue, 'all'>) => {
  const categoryLabelMap = {
    certificate: '자격증',
    education: '교육권',
    etc: '기타',
  } as const

  return categoryLabelMap[category]
}

export const purchasedShopProducts = shopProducts.filter((product) => product.isPurchased)
