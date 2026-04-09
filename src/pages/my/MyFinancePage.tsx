import { useNavigate } from 'react-router-dom'
import goodImageSrc from '../../assets/good.png'
import { Badge, Button, Card, InfoRow, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { loanProducts, savingsProducts } from '../finance/financeData'
import { ShopHeader } from '../shop/components/ShopHeader'

export const MyFinancePage = () => {
  const navigate = useNavigate()

  const joinedSavings = savingsProducts[1] ?? savingsProducts[0]
  const joinedLoan = loanProducts[0]

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  return (
    <MainLayout
      header={<ShopHeader title="금융 상품 관리" onBack={() => navigate(ROUTE_PATHS.my)} />}
      nav={
        <BottomNavigation
          items={BOTTOM_NAVIGATION_ITEMS}
          value="my"
          onChange={handleBottomNavigation}
        />
      }
      className="bg-bg-light"
    >
      <div className="mt-5 flex flex-col gap-5 pb-2">
        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">적금 현황</span>}
            right={<span className="text-xs font-medium text-primary-400">1건</span>}
          />

          <Card
            onClick={() => navigate(ROUTE_PATHS.myFinanceSavingsHistory)}
            className="!gap-0 !rounded-control !border-0 !px-5 !py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge tone="primary" variant="soft" className="!px-[8px] !py-[3px]">
                  SAVINGS
                </Badge>
                <p className="mt-3 text-[16px] font-semibold leading-[1.2] text-font-main">
                  {joinedSavings.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-gray-400">최대 금리</p>
                <p className="mt-1 text-[25px] font-bold leading-none text-primary-500">
                  {joinedSavings.listRateLabel.replace('연 ', '')}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <InfoRow
                label={<span className="text-[11px] text-gray-400">월 납입액</span>}
                value={<span className="text-[20px] font-semibold text-gray-700">300,000원</span>}
                className="items-end"
              />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-[11px] text-gray-400">가입일</p>
                <p className="mt-1 text-[12px] font-medium text-gray-600">2024.01.10</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">만기일</p>
                <p className="mt-1 text-[12px] font-medium text-gray-600">2025.01.10</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">대출 관리</span>}
            right={<span className="text-xs font-medium text-primary-400">1건</span>}
          />

          <Card
            onClick={() => navigate(ROUTE_PATHS.myFinanceLoanHistory)}
            className="!gap-0 !rounded-control !border-0 !px-5 !py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge tone="neutral" variant="soft" className="!px-[8px] !py-[3px]">
                  MORTGAGE
                </Badge>
                <p className="mt-3 text-[16px] font-semibold leading-[1.2] text-font-main">
                  {joinedLoan.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-gray-400">금리</p>
                <p className="mt-1 text-[25px] font-bold leading-none text-primary-500">3.2%</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-400">대출액</span>
                <span className="text-[16px] font-semibold text-gray-700">2,000,000 원</span>
              </div>
              <div className="flex flex-col gap-1 items-end text-right">
                <span className="text-[11px] text-gray-400">남은 금액</span>
                <span className="text-[16px] font-semibold text-primary-500">1,850,000 원</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-[11px] text-gray-400">가입일</p>
                <p className="mt-1 text-[12px] font-medium text-gray-600">2024.01.10</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">만기일</p>
                <p className="mt-1 text-[12px] font-medium text-gray-600">2025.01.10</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader
            title={<span className="text-base font-semibold text-font-main">당신을 위한 추천</span>}
          />

          <Card className="!gap-0 !overflow-hidden !rounded-control !border-0 !p-0 shadow-sm">
            <img
              src={goodImageSrc}
              alt="신규 친환경 청년 적금"
              className="h-[170px] w-full object-cover"
            />
            <div className="px-5 py-5">
              <p className="text-[20px] font-semibold leading-[1.2] text-font-main">
                신규 친환경 청년 적금
              </p>
              <p className="mt-3 text-[13px] leading-6 text-font-sub">
                ESG 점수 1점마다 이산화탄소 배출량을 막는 만큼 금리 우대.
                <span className="font-semibold text-primary-500"> 최대 연 6.0%</span> 추가 금리 혜택
              </p>
              <Button
                type="button"
                fullWidth
                className="mt-5 !h-[46px]"
                onClick={() => navigate(ROUTE_PATHS.finance)}
              >
                상세 정보 보기
              </Button>
            </div>
          </Card>
        </section>

      </div>
    </MainLayout>
  )
}
