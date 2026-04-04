export type EnvActivityType = 'tumbler' | 'shared-bike' | 'ev-rental'

export interface EnvActivityItem {
  type: EnvActivityType
  title: string
  point: number
  icon: 'tumbler' | 'bike' | 'car'
}

export const ENV_ACTIVITY_ITEMS: EnvActivityItem[] = [
  {
    type: 'tumbler',
    title: '텀블러 인증하기',
    point: 30,
    icon: 'tumbler',
  },
  {
    type: 'shared-bike',
    title: '공유 자전거 인증하기',
    point: 30,
    icon: 'bike',
  },
  {
    type: 'ev-rental',
    title: '전기차 대여 인증하기',
    point: 30,
    icon: 'car',
  },
]

export function getEnvActivity(activityType: EnvActivityType) {
  return ENV_ACTIVITY_ITEMS.find((activity) => activity.type === activityType) ?? null
}
