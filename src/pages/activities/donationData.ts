import type { DonationListResponse } from '../../types/donation'

export const donationMockResponse: DonationListResponse = {
  summary: {
    totalDonationAmount: 24580000,
    totalParticipantCount: 12450,
    donationCount: 3,
  },
  donations: [
    {
      donationId: 1,
      name: '잃어버린 산림의 50년',
      description: '산불 피해 지역 희망의 나무 심기',
      targetAmount: 15000000,
      currentAmount: 12500000,
      imageUrl:
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
      participantCount: 2450,
      progressPercentage: 85,
      startDate: '2026-03-01',
      endDate: '2026-05-31',
    },
    {
      donationId: 2,
      name: '유기견에게 따뜻한 겨울을',
      description: '따뜻한 담요와 사료를 함께하기',
      targetAmount: 15000000,
      currentAmount: 12500000,
      imageUrl:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      participantCount: 1750,
      progressPercentage: 85,
      startDate: '2026-03-05',
      endDate: '2026-04-30',
    },
    {
      donationId: 3,
      name: '아동을 위한 건강한 한끼',
      description: '결식 아동 주말 도시락 배달 서비스',
      targetAmount: 15000000,
      currentAmount: 12500000,
      imageUrl:
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80',
      participantCount: 3850,
      progressPercentage: 85,
      startDate: '2026-03-10',
      endDate: '2026-06-15',
    },
  ],
}
