import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Button, Card, Input } from '../../../components/common'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import {
  createFinancialProduct,
  getAdminFinancialProducts,
  updateFinancialProduct,
} from '../../../services/adminApi'
import type { AdminFormMode } from '../../../types/admin'
import { getApiErrorMessage } from '../../../utils/admin'

const textareaClassName =
  'min-h-[140px] w-full rounded-control border border-border-muted bg-white px-4 py-3 text-base text-font-main outline-none transition-colors focus:border-primary-500'

const isValidMode = (value: string | null): value is AdminFormMode =>
  value === 'create' || value === 'edit'

export const AdminFinanceFormPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode')
  const idParam = searchParams.get('id')
  const mode = isValidMode(modeParam) ? modeParam : null
  const productId = Number(idParam)

  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    type: 'LOAN' as 'LOAN' | 'SAVINGS',
    baseRate: '',
    maxRate: '',
    description: '',
    durationMonths: '',
    monthlyPaymentAmount: '',
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(
    () => `금융 상품 ${mode === 'edit' ? '수정' : '등록'}`,
    [mode],
  )

  useEffect(() => {
    const loadProduct = async () => {
      if (mode !== 'edit') {
        setIsLoading(false)
        return
      }

      if (!Number.isFinite(productId)) {
        setError('수정 대상 ID가 올바르지 않습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const response = await getAdminFinancialProducts()
        const target = response.find((product) => product.finProductId === productId)

        if (!target) {
          throw new Error('수정할 금융 상품을 찾지 못했습니다.')
        }

        setForm({
          name: target.name,
          subtitle: target.subtitle ?? '',
          type: target.type,
          baseRate: String(target.baseRate),
          maxRate: String(target.maxRate),
          description: target.description,
          durationMonths: String(target.durationMonths),
          monthlyPaymentAmount:
            target.monthlyPaymentAmount === null ? '' : String(target.monthlyPaymentAmount),
          isActive: target.isActive,
        })
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, '수정 대상을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void loadProduct()
  }, [mode, productId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!mode) {
      setError('잘못된 접근입니다.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),
        type: form.type,
        baseRate: Number(form.baseRate),
        maxRate: Number(form.maxRate),
        description: form.description.trim(),
        durationMonths: Number(form.durationMonths),
        monthlyPaymentAmount: form.monthlyPaymentAmount
          ? Number(form.monthlyPaymentAmount)
          : null,
        isActive: form.isActive,
      }

      if (mode === 'create') {
        await createFinancialProduct(payload)
      } else {
        await updateFinancialProduct(productId, payload)
      }

      alert(`${title}을 완료했습니다.`)
      navigate(ROUTE_PATHS.adminFinance)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, `${title}에 실패했습니다.`))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mode) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-error">잘못된 폼 접근입니다.</p>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="items-center !py-16 text-center">
        <p className="text-sm font-medium text-font-sub">금융 상품 데이터를 불러오는 중입니다.</p>
      </Card>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-font-main">{title}</h2>
              <Badge tone={mode === 'edit' ? 'neutral' : 'primary'}>
                {mode === 'edit' ? '수정 모드' : '등록 모드'}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-font-sub">
              금리와 기간, 월 납입금, 활성 상태를 설정합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminFinance)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
      </Card>

      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <Input
            label="상품명"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <Input
            label="서브타이틀"
            value={form.subtitle}
            onChange={(event) =>
              setForm((current) => ({ ...current, subtitle: event.target.value }))
            }
          />

          <div className="flex flex-col gap-[6px]">
            <label className="text-sm font-medium text-font-main">상품 유형</label>
            <select
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  type: event.target.value as 'LOAN' | 'SAVINGS',
                }))
              }
              className="h-[48px] rounded-control border border-border-muted bg-white px-4 text-base text-font-main outline-none transition-colors focus:border-primary-500"
            >
              <option value="LOAN">LOAN</option>
              <option value="SAVINGS">SAVINGS</option>
            </select>
          </div>

          <Input
            label="기간(개월)"
            type="number"
            min="1"
            value={form.durationMonths}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                durationMonths: event.target.value,
              }))
            }
            required
          />
          <Input
            label="기본 금리"
            type="number"
            step="0.01"
            min="0"
            value={form.baseRate}
            onChange={(event) =>
              setForm((current) => ({ ...current, baseRate: event.target.value }))
            }
            required
          />
          <Input
            label="최대 금리"
            type="number"
            step="0.01"
            min="0"
            value={form.maxRate}
            onChange={(event) =>
              setForm((current) => ({ ...current, maxRate: event.target.value }))
            }
            required
          />
          <Input
            label="월 납입 금액"
            type="number"
            min="0"
            value={form.monthlyPaymentAmount}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                monthlyPaymentAmount: event.target.value,
              }))
            }
            helperText="대출 상품은 비워둘 수 있습니다."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-font-main">설명</label>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            className={textareaClassName}
            required
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-font-main">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={() =>
              setForm((current) => ({ ...current, isActive: !current.isActive }))
            }
            className="h-4 w-4 rounded border-border-muted"
          />
          활성 상태로 저장
        </label>
      </Card>
    </form>
  )
}
