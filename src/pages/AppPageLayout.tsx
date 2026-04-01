import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icons, IconButton } from '../components/common'
import BottomNavigation from '../components/layout/BottomNavigation'
import Header from '../components/layout/Header'
import MainLayout from '../components/layout/MainLayout'
import { ROUTE_PATHS } from '../constants/routePaths'

interface AppPageLayoutProps {
  title?: string
  currentTab?: 'home' | 'benefits' | 'finance' | 'mypage'
  children: ReactNode
}

const tabPathMap = {
  home: ROUTE_PATHS.home,
  benefits: ROUTE_PATHS.activities,
  finance: ROUTE_PATHS.finance,
  mypage: ROUTE_PATHS.my,
} as const

export function AppPageLayout({ title, currentTab = 'home', children }: AppPageLayoutProps) {
  const navigate = useNavigate()

  return (
    <MainLayout
      header={
        <Header
          bgColor="bg-bg-light"
          left={<span className="text-sh-main text-[20px] font-bold">SOLVE</span>}
          title={title}
          right={
            <div className="flex items-center gap-2">
              <IconButton label="채팅 열기" icon={<Icons.Chat />} />
              <IconButton label="메뉴 열기" icon={<Icons.Menu />} />
            </div>
          }
        />
      }
      nav={
        <BottomNavigation
          value={currentTab}
          onChange={(key) => {
            const path = tabPathMap[key as keyof typeof tabPathMap]

            if (path) {
              navigate(path)
            }
          }}
        />
      }
    >
      {children}
    </MainLayout>
  )
}
