import { type FormEvent, useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient'
import { PageScaffold } from '../PageScaffold'

interface TestItem {
  id?: number
  name: string
  description: string
}

export function HomePage() {
  const [items, setItems] = useState<TestItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchItems = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.get<TestItem[]>('/test')
      setItems(response.data)
    } catch (fetchError) {
      console.error(fetchError)
      setError('백엔드 연결 또는 데이터 조회에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchItems()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !description.trim()) {
      setError('이름과 설명을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await apiClient.post<TestItem>('/test', {
        name: name.trim(),
        description: description.trim(),
      })
      setName('')
      setDescription('')
      await fetchItems()
    } catch (submitError) {
      console.error(submitError)
      setError('데이터 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageScaffold
      title="메인 대시보드"
      description="등급, 점수, AI 추천, 금융 추천을 연결하는 메인 화면 자리입니다."
    >
      <section className="rounded-card border border-gray-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-font-main">백엔드 연결 테스트</h2>
            <p className="mt-1 text-sm text-font-sub">
              `/api/test` 조회 및 등록 결과를 임시로 출력하는 영역입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchItems()}
            className="rounded-control bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? '불러오는 중...' : '새로고침'}
          </button>
        </div>

        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="name"
            className="rounded-control border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="description"
            className="rounded-control border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            className="rounded-control bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {items.length === 0 && !isLoading ? (
            <div className="rounded-control border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-font-sub">
              조회된 데이터가 없습니다.
            </div>
          ) : null}

          {items.map((item, index) => (
            <article
              key={item.id ?? `${item.name}-${index}`}
              className="rounded-control border border-gray-200 bg-gray-50 px-4 py-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary-500">
                  {item.id ? `ID ${item.id}` : `ROW ${index + 1}`}
                </span>
                <h3 className="text-base font-semibold text-font-main">{item.name}</h3>
              </div>
              <p className="mt-2 text-sm text-font-sub">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageScaffold>
  )
}
