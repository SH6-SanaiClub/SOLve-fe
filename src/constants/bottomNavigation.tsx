import { Icons } from '../components/common'
import type { BottomNavigationItem } from '../components/layout/BottomNavigation'
import { ROUTE_PATHS } from './routePaths'

export const BOTTOM_NAVIGATION_ITEMS: BottomNavigationItem[] = [
  { key: 'home', label: '홈', icon: <Icons.Home /> },
  { key: 'shop', label: '포인트샵', icon: <Icons.Shop /> },
  { key: 'finance', label: '금융상품', icon: <Icons.Bank /> },
  { key: 'my', label: '마이페이지', icon: <Icons.MyPage /> },
]

export const BOTTOM_NAVIGATION_ROUTE_BY_KEY = {
  home: ROUTE_PATHS.home,
  shop: ROUTE_PATHS.shop,
  finance: ROUTE_PATHS.finance,
  my: ROUTE_PATHS.my,
} as const
