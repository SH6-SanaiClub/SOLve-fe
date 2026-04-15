import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Button, Card, Input } from '../../../components/common'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import { createItem, getAdminItems, updateItem } from '../../../services/adminApi'
import type { AdminFormMode } from '../../../types/admin'
import { getApiErrorMessage } from '../../../utils/admin'

const textareaClassName =
  'min-h-[140px] w-full rounded-control border border-border-muted bg-white px-4 py-3 text-base text-font-main outline-none transition-colors focus:border-primary-500'

const isValidMode = (value: string | null): value is AdminFormMode =>
  value === 'create' || value === 'edit'

export const AdminShopFormPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode')
  const idParam = searchParams.get('id')
  const mode = isValidMode(modeParam) ? modeParam : null
  const itemId = Number(idParam)

  const [form, setForm] = useState({
    name: '',
    category: '',
    requiredPoints: '',
    imageUrl: '',
    description: '',
    stock: '',
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(
    () => `포인트샵 상품 ${mode === 'edit' ? '수정' : '등록'}`,
    [mode],
  )

  useEffect(() => {
    const loadItem = async () => {
      if (mode !== 'edit') {
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
        const response = await getAdminItems()
        const target = response.find((item) => item.itemId === itemId)

        if (!target) {
          throw new Error('수정할 상품을 찾지 못했습니다.')
        }

        setForm({
          name: target.name,
          category: target.category,
          requiredPoints: String(target.requiredPoints),
          imageUrl: target.imageUrl ?? '',
          description: target.description,
          stock: String(target.stock),
          isActive: target.isActive,
        })
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, '수정 대상을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void loadItem()
  }, [itemId, mode])

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
        category: form.category.trim(),
        requiredPoints: Number(form.requiredPoints),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        stock: Number(form.stock),
        isActive: form.isActive,
      }

      if (mode === 'create') {
        await createItem(payload)
      } else {
        await updateItem(itemId, payload)
      }

      alert(`${title}을 완료했습니다.`)
      navigate(ROUTE_PATHS.adminShop)
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
        <p className="text-sm font-medium text-font-sub">상품 데이터를 불러오는 중입니다.</p>
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
              포인트샵 아이템 메타데이터와 재고 상태를 함께 관리합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.adminShop)}>
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
            label="카테고리"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            required
          />
          <Input
            label="필요 포인트"
            type="number"
            min="0"
            value={form.requiredPoints}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                requiredPoints: event.target.value,
              }))
            }
            required
          />
          <Input
            label="재고"
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
            required
          />
          <Input
            label="이미지 URL"
            value={form.imageUrl}
            onChange={(event) =>
              setForm((current) => ({ ...current, imageUrl: event.target.value }))
            }
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
