import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Tabs } from '../../../components/common'
import {
  getAdminActivityFormPath,
  ROUTE_PATHS,
} from '../../../constants/routePaths'
import {
  deleteDonation,
  deleteEcoProduct,
  deleteVolunteer,
  getAdminActivities,
  getAdminDonation,
  getAdminDonations,
  getAdminEcoProducts,
  getAdminVolunteer,
  getAdminVolunteers,
  toggleDonationStatus,
  toggleEcoProductStatus,
  toggleVolunteerStatus,
} from '../../../services/adminApi'
import type {
  AdminActivity,
  AdminActivityFormType,
  AdminDonation,
  AdminEcoProduct,
  AdminVolunteer,
} from '../../../types/admin'
import {
  formatDateTime,
  formatNumber,
  getApiErrorMessage,
} from '../../../utils/admin'

const tabItems = [
  { label: '활동 마스터', value: 'activity' },
  { label: '기부 캠페인', value: 'donation' },
  { label: '봉사 캠페인', value: 'volunteer' },
  { label: '가치가게', value: 'eco-product' },
] as const

export const AdminActivitiesPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminActivityFormType>('activity')
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [donations, setDonations] = useState<AdminDonation[]>([])
  const [volunteers, setVolunteers] = useState<AdminVolunteer[]>([])
  const [ecoProducts, setEcoProducts] = useState<AdminEcoProduct[]>([])
  const [selectedDonation, setSelectedDonation] = useState<AdminDonation | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<AdminVolunteer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCurrentTab = async (tab: AdminActivityFormType) => {
    setIsLoading(true)
    setError('')

    try {
      if (tab === 'activity') {
        const response = await getAdminActivities()
        setActivities(response)
      }

      if (tab === 'donation') {
        const response = await getAdminDonations()
        setDonations(response)
      }

      if (tab === 'volunteer') {
        const response = await getAdminVolunteers()
        setVolunteers(response)
      }

      if (tab === 'eco-product') {
        const response = await getAdminEcoProducts()
        setEcoProducts(response)
      }
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError, '목록을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchCurrentTab(activeTab)
  }, [activeTab])

  const handleSelectDonation = async (donationId: number) => {
    try {
      const response = await getAdminDonation(donationId)
      setSelectedDonation(response)
    } catch (fetchError) {
      alert(getApiErrorMessage(fetchError, '기부 상세 정보를 불러오지 못했습니다.'))
    }
  }

  const handleSelectVolunteer = async (volunteerId: number) => {
    try {
      const response = await getAdminVolunteer(volunteerId)
      setSelectedVolunteer(response)
    } catch (fetchError) {
      alert(getApiErrorMessage(fetchError, '봉사 상세 정보를 불러오지 못했습니다.'))
    }
  }

  const handleToggleDonationStatus = async (donation: AdminDonation) => {
    try {
      await toggleDonationStatus(donation.donationId, !donation.isActive)
      if (selectedDonation?.donationId === donation.donationId) {
        setSelectedDonation(null)
      }
      await fetchCurrentTab('donation')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '기부 상태 변경에 실패했습니다.'))
    }
  }

  const handleToggleVolunteerStatus = async (volunteer: AdminVolunteer) => {
    try {
      await toggleVolunteerStatus(volunteer.volunteerId, !volunteer.isActive)
      if (selectedVolunteer?.volunteerId === volunteer.volunteerId) {
        setSelectedVolunteer(null)
      }
      await fetchCurrentTab('volunteer')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '봉사 상태 변경에 실패했습니다.'))
    }
  }

  const handleToggleEcoProductStatus = async (product: AdminEcoProduct) => {
    try {
      await toggleEcoProductStatus(product.productId, !product.isActive)
      await fetchCurrentTab('eco-product')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '상품 상태 변경에 실패했습니다.'))
    }
  }

  const handleDeleteDonation = async (donationId: number) => {
    if (!window.confirm('이 기부 캠페인을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteDonation(donationId)
      if (selectedDonation?.donationId === donationId) {
        setSelectedDonation(null)
      }
      await fetchCurrentTab('donation')
      alert('기부 캠페인을 삭제했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '기부 캠페인 삭제에 실패했습니다.'))
    }
  }

  const handleDeleteVolunteer = async (volunteerId: number) => {
    if (!window.confirm('이 봉사 캠페인을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteVolunteer(volunteerId)
      if (selectedVolunteer?.volunteerId === volunteerId) {
        setSelectedVolunteer(null)
      }
      await fetchCurrentTab('volunteer')
      alert('봉사 캠페인을 삭제했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '봉사 캠페인 삭제에 실패했습니다.'))
    }
  }

  const handleDeleteEcoProduct = async (productId: number) => {
    if (!window.confirm('이 가치가게 상품을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteEcoProduct(productId)
      await fetchCurrentTab('eco-product')
      alert('가치가게 상품을 삭제했습니다.')
    } catch (submitError) {
      alert(getApiErrorMessage(submitError, '가치가게 상품 삭제에 실패했습니다.'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-main">ESG 활동 관리</h2>
            <p className="mt-1 text-sm text-font-sub">
              활동 마스터, 기부, 봉사, 가치가게 데이터를 각각 관리합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                navigate(getAdminActivityFormPath({ type: activeTab, mode: 'create' }))
              }
            >
              등록하기
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminDashboard)}>
              대시보드
            </Button>
          </div>
        </div>

        <Tabs
          items={tabItems.map((item) => ({ label: item.label, value: item.value }))}
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value as AdminActivityFormType)
            setSelectedDonation(null)
            setSelectedVolunteer(null)
          }}
        />
      </Card>

      {activeTab === 'activity' ? (
        <Card className="gap-3 !rounded-[20px] border-border-muted !p-5">
          <Badge tone="neutral" className="w-fit !px-3 !py-2 text-sm">
            참고
          </Badge>
          <p className="text-sm leading-6 text-font-sub">
            현재 백엔드 스키마에는 활동 마스터의 활성/비활성 컬럼이 없습니다. 이 탭에서는
            활동명 등록과 수정만 지원합니다.
          </p>
        </Card>
      ) : null}

      <Card className="gap-0 overflow-hidden !rounded-[20px] border-border-muted !p-0">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            목록을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-error">{error}</div>
        ) : activeTab === 'activity' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">활동명</th>
                  <th className="px-5 py-4 font-medium">검증 횟수</th>
                  <th className="px-5 py-4 font-medium">등록일</th>
                  <th className="px-5 py-4 font-medium">수정일</th>
                  <th className="px-5 py-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.activityId} className="border-t border-border-muted text-sm">
                    <td className="px-5 py-4 font-medium text-font-main">{activity.name}</td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(activity.verificationCount)}
                    </td>
                    <td className="px-5 py-4 text-font-sub">{formatDateTime(activity.createdAt)}</td>
                    <td className="px-5 py-4 text-font-sub">{formatDateTime(activity.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            getAdminActivityFormPath({
                              type: 'activity',
                              mode: 'edit',
                              id: activity.activityId,
                            }),
                          )
                        }
                      >
                        수정
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'donation' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">이름</th>
                  <th className="px-5 py-4 font-medium">목표 금액</th>
                  <th className="px-5 py-4 font-medium">모금 금액</th>
                  <th className="px-5 py-4 font-medium">참여자</th>
                  <th className="px-5 py-4 font-medium">상태</th>
                  <th className="px-5 py-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.donationId} className="border-t border-border-muted text-sm">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-font-main">{donation.name}</p>
                        <p className="mt-1 text-xs text-font-sub">{donation.summary}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(donation.targetAmount)}원
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(donation.currentAmount)}원
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(donation.participantCount)}명
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={donation.isActive ? 'success' : 'neutral'}>
                        {donation.isActive ? '활성' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleSelectDonation(donation.donationId)}
                        >
                          상세
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              getAdminActivityFormPath({
                                type: 'donation',
                                mode: 'edit',
                                id: donation.donationId,
                              }),
                            )
                          }
                        >
                          수정
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleToggleDonationStatus(donation)}
                        >
                          {donation.isActive ? '비활성' : '활성'}
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleDeleteDonation(donation.donationId)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'volunteer' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">이름</th>
                  <th className="px-5 py-4 font-medium">활동일</th>
                  <th className="px-5 py-4 font-medium">정원</th>
                  <th className="px-5 py-4 font-medium">신청 인원</th>
                  <th className="px-5 py-4 font-medium">상태</th>
                  <th className="px-5 py-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.volunteerId} className="border-t border-border-muted text-sm">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-font-main">{volunteer.name}</p>
                        <p className="mt-1 text-xs text-font-sub">{volunteer.organization}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatDateTime(volunteer.activityDate)}
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(volunteer.capacity)}명
                    </td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(volunteer.currentEnrolled)}명
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={volunteer.isActive ? 'success' : 'neutral'}>
                        {volunteer.isActive ? '활성' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleSelectVolunteer(volunteer.volunteerId)}
                        >
                          상세
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              getAdminActivityFormPath({
                                type: 'volunteer',
                                mode: 'edit',
                                id: volunteer.volunteerId,
                              }),
                            )
                          }
                        >
                          수정
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleToggleVolunteerStatus(volunteer)}
                        >
                          {volunteer.isActive ? '비활성' : '활성'}
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleDeleteVolunteer(volunteer.volunteerId)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-font-sub">
                  <th className="px-5 py-4 font-medium">상품명</th>
                  <th className="px-5 py-4 font-medium">가게명</th>
                  <th className="px-5 py-4 font-medium">카테고리</th>
                  <th className="px-5 py-4 font-medium">가격</th>
                  <th className="px-5 py-4 font-medium">재고</th>
                  <th className="px-5 py-4 font-medium">상태</th>
                  <th className="px-5 py-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {ecoProducts.map((product) => (
                  <tr key={product.productId} className="border-t border-border-muted text-sm">
                    <td className="px-5 py-4 font-medium text-font-main">{product.name}</td>
                    <td className="px-5 py-4 text-font-main">{product.storeName}</td>
                    <td className="px-5 py-4 text-font-main">{product.category}</td>
                    <td className="px-5 py-4 text-font-main">
                      {formatNumber(product.price)}원
                    </td>
                    <td className="px-5 py-4 text-font-main">{formatNumber(product.stock)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={product.isActive ? 'success' : 'neutral'}>
                        {product.isActive ? '활성' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              getAdminActivityFormPath({
                                type: 'eco-product',
                                mode: 'edit',
                                id: product.productId,
                              }),
                            )
                          }
                        >
                          수정
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleToggleEcoProductStatus(product)}
                        >
                          {product.isActive ? '비활성' : '활성'}
                        </Button>
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => void handleDeleteEcoProduct(product.productId)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {activeTab === 'donation' && selectedDonation ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-font-main">{selectedDonation.name}</h3>
              <p className="mt-1 text-sm text-font-sub">{selectedDonation.summary}</p>
            </div>
            <Badge tone={selectedDonation.isActive ? 'success' : 'neutral'}>
              {selectedDonation.isActive ? '활성' : '비활성'}
            </Badge>
          </div>

          <p className="text-sm leading-6 text-font-main">{selectedDonation.description}</p>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[18px] bg-primary-50 p-4">
              <p className="text-sm text-font-sub">목표 금액</p>
              <p className="mt-2 text-xl font-bold text-font-main">
                {formatNumber(selectedDonation.targetAmount)}원
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">모금 금액</p>
              <p className="mt-2 text-xl font-bold text-font-main">
                {formatNumber(selectedDonation.currentAmount)}원
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">시작일</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {formatDateTime(selectedDonation.startDate)}
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">종료일</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {formatDateTime(selectedDonation.endDate)}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-font-main">
              참여자 목록 ({formatNumber(selectedDonation.participantCount)})
            </h4>
            <div className="mt-3 overflow-x-auto rounded-[18px] border border-border-muted">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-font-sub">
                    <th className="px-4 py-3 font-medium">아이디</th>
                    <th className="px-4 py-3 font-medium">이름</th>
                    <th className="px-4 py-3 font-medium">금액</th>
                    <th className="px-4 py-3 font-medium">참여일</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDonation.participants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-sm text-font-sub"
                      >
                        참여자가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    selectedDonation.participants.map((participant) => (
                      <tr
                        key={`${participant.userId}-${participant.createdAt}`}
                        className="border-t border-border-muted text-sm"
                      >
                        <td className="px-4 py-3 text-font-main">{participant.loginId}</td>
                        <td className="px-4 py-3 text-font-main">{participant.name}</td>
                        <td className="px-4 py-3 text-font-main">
                          {formatNumber(participant.amount)}원
                        </td>
                        <td className="px-4 py-3 text-font-sub">
                          {formatDateTime(participant.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : null}

      {activeTab === 'volunteer' && selectedVolunteer ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-font-main">{selectedVolunteer.name}</h3>
              <p className="mt-1 text-sm text-font-sub">{selectedVolunteer.organization}</p>
            </div>
            <Badge tone={selectedVolunteer.isActive ? 'success' : 'neutral'}>
              {selectedVolunteer.isActive ? '활성' : '비활성'}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[18px] bg-primary-50 p-4">
              <p className="text-sm text-font-sub">활동일</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {formatDateTime(selectedVolunteer.activityDate)}
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">장소</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {selectedVolunteer.location}
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">정원</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {formatNumber(selectedVolunteer.capacity)}명
              </p>
            </div>
            <div className="rounded-[18px] border border-border-muted bg-white p-4">
              <p className="text-sm text-font-sub">봉사 시간</p>
              <p className="mt-2 text-sm font-semibold text-font-main">
                {formatNumber(selectedVolunteer.volunteerHour)}시간
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-font-main">{selectedVolunteer.description}</p>

          <div>
            <h4 className="text-base font-semibold text-font-main">
              신청자 목록 ({formatNumber(selectedVolunteer.participantCount)})
            </h4>
            <div className="mt-3 overflow-x-auto rounded-[18px] border border-border-muted">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-font-sub">
                    <th className="px-4 py-3 font-medium">아이디</th>
                    <th className="px-4 py-3 font-medium">이름</th>
                    <th className="px-4 py-3 font-medium">상태</th>
                    <th className="px-4 py-3 font-medium">출석 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVolunteer.participants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-sm text-font-sub"
                      >
                        신청자가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    selectedVolunteer.participants.map((participant) => (
                      <tr
                        key={`${participant.userId}-${participant.createdAt}`}
                        className="border-t border-border-muted text-sm"
                      >
                        <td className="px-4 py-3 text-font-main">{participant.loginId}</td>
                        <td className="px-4 py-3 text-font-main">{participant.name}</td>
                        <td className="px-4 py-3 text-font-main">{participant.status}</td>
                        <td className="px-4 py-3 text-font-sub">
                          {participant.checkInAt
                            ? `${formatDateTime(participant.checkInAt)} / ${formatDateTime(participant.checkOutAt)}`
                            : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
