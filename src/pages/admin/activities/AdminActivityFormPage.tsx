import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Button, Card, Input } from '../../../components/common'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  createActivity,
  createDonation,
  createEcoProduct,
  createVolunteer,
  getAdminActivities,
  getAdminDonation,
  getAdminEcoProducts,
  getAdminVolunteer,
  updateActivity,
  updateDonation,
  updateEcoProduct,
  updateVolunteer,
} from '../../../services/adminApi'
import type { AdminActivityFormType, AdminFormMode } from '../../../types/admin'
import {
  getApiErrorMessage,
  toDatetimeLocalValue,
} from '../../../utils/admin'

const textareaClassName =
  'min-h-[140px] w-full rounded-control border border-border-muted bg-white px-4 py-3 text-base text-font-main outline-none transition-colors focus:border-primary-500'

const isValidType = (value: string | null): value is AdminActivityFormType =>
  value === 'activity' ||
  value === 'donation' ||
  value === 'volunteer' ||
  value === 'eco-product'

const isValidMode = (value: string | null): value is AdminFormMode =>
  value === 'create' || value === 'edit'

export const AdminActivityFormPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const typeParam = searchParams.get('type')
  const modeParam = searchParams.get('mode')
  const idParam = searchParams.get('id')
  const itemId = Number(idParam)
  const type = isValidType(typeParam) ? typeParam : null
  const mode = isValidMode(modeParam) ? modeParam : null

  const [activityName, setActivityName] = useState('')

  const [donationForm, setDonationForm] = useState({
    name: '',
    summary: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    isActive: true,
  })

  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    description: '',
    location: '',
    capacity: '',
    activityDate: '',
    volunteerHour: '',
    organization: '',
    qrToken: '',
    latitude: '',
    longitude: '',
    isActive: true,
  })

  const [ecoProductForm, setEcoProductForm] = useState({
    name: '',
    storeName: '',
    category: '',
    price: '',
    imageUrl: '',
    description: '',
    stock: '',
    isActive: true,
  })

  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const pageTitle = useMemo(() => {
    const modeLabel = mode === 'edit' ? '수정' : '등록'

    if (type === 'activity') {
      return `활동 마스터 ${modeLabel}`
    }

    if (type === 'donation') {
      return `기부 캠페인 ${modeLabel}`
    }

    if (type === 'volunteer') {
      return `봉사 캠페인 ${modeLabel}`
    }

    if (type === 'eco-product') {
      return `가치가게 상품 ${modeLabel}`
    }

    return '활동 폼'
  }, [mode, type])

  useEffect(() => {
    const loadEditTarget = async () => {
      if (!type || mode !== 'edit') {
        setIsLoading(false)
        return
      }

      if (!Number.isFinite(itemId)) {
        setError('수정 대상 ID가 올바르지 않습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        if (type === 'activity') {
          const response = await getAdminActivities()
          const target = response.find((activity) => activity.activityId === itemId)

          if (!target) {
            throw new Error('수정할 활동을 찾지 못했습니다.')
          }

          setActivityName(target.name)
        }

        if (type === 'donation') {
          const target = await getAdminDonation(itemId)

          setDonationForm({
            name: target.name,
            summary: target.summary,
            description: target.description,
            targetAmount: String(target.targetAmount),
            startDate: toDatetimeLocalValue(target.startDate),
            endDate: toDatetimeLocalValue(target.endDate),
            imageUrl: target.imageUrl,
            isActive: target.isActive,
          })
        }

        if (type === 'volunteer') {
          const target = await getAdminVolunteer(itemId)

          setVolunteerForm({
            name: target.name,
            description: target.description,
            location: target.location,
            capacity: String(target.capacity),
            activityDate: toDatetimeLocalValue(target.activityDate),
            volunteerHour: String(target.volunteerHour),
            organization: target.organization,
            qrToken: target.qrToken,
            latitude: String(target.latitude),
            longitude: String(target.longitude),
            isActive: target.isActive,
          })
        }

        if (type === 'eco-product') {
          const response = await getAdminEcoProducts()
          const target = response.find((product) => product.productId === itemId)

          if (!target) {
            throw new Error('수정할 상품을 찾지 못했습니다.')
          }

          setEcoProductForm({
            name: target.name,
            storeName: target.storeName,
            category: target.category,
            price: String(target.price),
            imageUrl: target.imageUrl,
            description: target.description,
            stock: String(target.stock),
            isActive: target.isActive,
          })
        }
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, '수정 대상을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void loadEditTarget()
  }, [itemId, mode, type])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!type || !mode) {
      setError('잘못된 접근입니다.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (type === 'activity') {
        if (mode === 'create') {
          await createActivity({ name: activityName.trim() })
        } else {
          await updateActivity(itemId, { name: activityName.trim() })
        }
      }

      if (type === 'donation') {
        const payload = {
          name: donationForm.name.trim(),
          summary: donationForm.summary.trim(),
          description: donationForm.description.trim(),
          targetAmount: Number(donationForm.targetAmount),
          startDate: donationForm.startDate,
          endDate: donationForm.endDate,
          imageUrl: donationForm.imageUrl.trim(),
          isActive: donationForm.isActive,
        }

        if (mode === 'create') {
          await createDonation(payload)
        } else {
          await updateDonation(itemId, payload)
        }
      }

      if (type === 'volunteer') {
        const payload = {
          name: volunteerForm.name.trim(),
          description: volunteerForm.description.trim(),
          location: volunteerForm.location.trim(),
          capacity: Number(volunteerForm.capacity),
          activityDate: volunteerForm.activityDate,
          volunteerHour: Number(volunteerForm.volunteerHour),
          organization: volunteerForm.organization.trim(),
          qrToken: volunteerForm.qrToken.trim(),
          latitude: Number(volunteerForm.latitude),
          longitude: Number(volunteerForm.longitude),
          isActive: volunteerForm.isActive,
        }

        if (mode === 'create') {
          await createVolunteer(payload)
        } else {
          await updateVolunteer(itemId, payload)
        }
      }

      if (type === 'eco-product') {
        const payload = {
          name: ecoProductForm.name.trim(),
          storeName: ecoProductForm.storeName.trim(),
          category: ecoProductForm.category.trim(),
          price: Number(ecoProductForm.price),
          imageUrl: ecoProductForm.imageUrl.trim(),
          description: ecoProductForm.description.trim(),
          stock: Number(ecoProductForm.stock),
          isActive: ecoProductForm.isActive,
        }

        if (mode === 'create') {
          await createEcoProduct(payload)
        } else {
          await updateEcoProduct(itemId, payload)
        }
      }

      alert(`${pageTitle}을 완료했습니다.`)
      navigate(ROUTE_PATHS.adminActivities)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, `${pageTitle}에 실패했습니다.`))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!type || !mode) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-error">잘못된 폼 접근입니다.</p>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-font-sub">폼 데이터를 불러오는 중입니다.</p>
      </Card>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-font-main">{pageTitle}</h2>
              <Badge tone={mode === 'edit' ? 'neutral' : 'primary'}>
                {mode === 'edit' ? '수정 모드' : '등록 모드'}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-font-sub">
              현재 백엔드 스키마에 맞춰 입력 필드를 노출합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminActivities)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
      </Card>

      {type === 'activity' ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <Input
            label="활동명"
            value={activityName}
            onChange={(event) => setActivityName(event.target.value)}
            placeholder="활동명을 입력하세요"
            required
          />
          <div className="rounded-[18px] bg-primary-50 p-4 text-sm leading-6 text-font-sub">
            활동 마스터는 현재 이름만 관리합니다. 활성/비활성은 스키마 확정 후 분리
            구현하는 쪽이 맞습니다.
          </div>
        </Card>
      ) : null}

      {type === 'donation' ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              label="캠페인명"
              value={donationForm.name}
              onChange={(event) =>
                setDonationForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <Input
              label="요약문"
              value={donationForm.summary}
              onChange={(event) =>
                setDonationForm((current) => ({ ...current, summary: event.target.value }))
              }
              required
            />
            <Input
              label="목표 금액"
              type="number"
              min="0"
              value={donationForm.targetAmount}
              onChange={(event) =>
                setDonationForm((current) => ({
                  ...current,
                  targetAmount: event.target.value,
                }))
              }
              required
            />
            <Input
              label="이미지 URL"
              value={donationForm.imageUrl}
              onChange={(event) =>
                setDonationForm((current) => ({ ...current, imageUrl: event.target.value }))
              }
              required
            />
            <Input
              label="시작일"
              type="datetime-local"
              value={donationForm.startDate}
              onChange={(event) =>
                setDonationForm((current) => ({ ...current, startDate: event.target.value }))
              }
              required
            />
            <Input
              label="종료일"
              type="datetime-local"
              value={donationForm.endDate}
              onChange={(event) =>
                setDonationForm((current) => ({ ...current, endDate: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-font-main">설명</label>
            <textarea
              value={donationForm.description}
              onChange={(event) =>
                setDonationForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={textareaClassName}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-font-main">
            <input
              type="checkbox"
              checked={donationForm.isActive}
              onChange={() =>
                setDonationForm((current) => ({
                  ...current,
                  isActive: !current.isActive,
                }))
              }
              className="h-4 w-4 rounded border-border-muted"
            />
            활성 상태로 저장
          </label>
        </Card>
      ) : null}

      {type === 'volunteer' ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              label="캠페인명"
              value={volunteerForm.name}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <Input
              label="기관명"
              value={volunteerForm.organization}
              onChange={(event) =>
                setVolunteerForm((current) => ({
                  ...current,
                  organization: event.target.value,
                }))
              }
              required
            />
            <Input
              label="장소"
              value={volunteerForm.location}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, location: event.target.value }))
              }
              required
            />
            <Input
              label="활동일"
              type="datetime-local"
              value={volunteerForm.activityDate}
              onChange={(event) =>
                setVolunteerForm((current) => ({
                  ...current,
                  activityDate: event.target.value,
                }))
              }
              required
            />
            <Input
              label="정원"
              type="number"
              min="0"
              value={volunteerForm.capacity}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, capacity: event.target.value }))
              }
              required
            />
            <Input
              label="봉사 시간"
              type="number"
              min="0"
              value={volunteerForm.volunteerHour}
              onChange={(event) =>
                setVolunteerForm((current) => ({
                  ...current,
                  volunteerHour: event.target.value,
                }))
              }
              required
            />
            <Input
              label="QR 토큰"
              value={volunteerForm.qrToken}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, qrToken: event.target.value }))
              }
              required
            />
            <Input
              label="위도"
              type="number"
              step="any"
              value={volunteerForm.latitude}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, latitude: event.target.value }))
              }
              required
            />
            <Input
              label="경도"
              type="number"
              step="any"
              value={volunteerForm.longitude}
              onChange={(event) =>
                setVolunteerForm((current) => ({ ...current, longitude: event.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-font-main">설명</label>
            <textarea
              value={volunteerForm.description}
              onChange={(event) =>
                setVolunteerForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={textareaClassName}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-font-main">
            <input
              type="checkbox"
              checked={volunteerForm.isActive}
              onChange={() =>
                setVolunteerForm((current) => ({
                  ...current,
                  isActive: !current.isActive,
                }))
              }
              className="h-4 w-4 rounded border-border-muted"
            />
            활성 상태로 저장
          </label>
        </Card>
      ) : null}

      {type === 'eco-product' ? (
        <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              label="상품명"
              value={ecoProductForm.name}
              onChange={(event) =>
                setEcoProductForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <Input
              label="가게명"
              value={ecoProductForm.storeName}
              onChange={(event) =>
                setEcoProductForm((current) => ({
                  ...current,
                  storeName: event.target.value,
                }))
              }
              required
            />
            <Input
              label="카테고리"
              value={ecoProductForm.category}
              onChange={(event) =>
                setEcoProductForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              required
            />
            <Input
              label="가격"
              type="number"
              min="0"
              value={ecoProductForm.price}
              onChange={(event) =>
                setEcoProductForm((current) => ({ ...current, price: event.target.value }))
              }
              required
            />
            <Input
              label="재고"
              type="number"
              min="0"
              value={ecoProductForm.stock}
              onChange={(event) =>
                setEcoProductForm((current) => ({ ...current, stock: event.target.value }))
              }
              required
            />
            <Input
              label="이미지 URL"
              value={ecoProductForm.imageUrl}
              onChange={(event) =>
                setEcoProductForm((current) => ({
                  ...current,
                  imageUrl: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-font-main">설명</label>
            <textarea
              value={ecoProductForm.description}
              onChange={(event) =>
                setEcoProductForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={textareaClassName}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-font-main">
            <input
              type="checkbox"
              checked={ecoProductForm.isActive}
              onChange={() =>
                setEcoProductForm((current) => ({
                  ...current,
                  isActive: !current.isActive,
                }))
              }
              className="h-4 w-4 rounded border-border-muted"
            />
            활성 상태로 저장
          </label>
        </Card>
      ) : null}
    </form>
  )
}
