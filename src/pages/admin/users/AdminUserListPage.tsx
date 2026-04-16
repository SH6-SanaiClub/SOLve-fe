import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Input } from '../../../components/common'
import { getAdminUserDetailPath } from '../../../constants/routePaths'
import { getAdminUsers } from '../../../services/adminApi'
import type { AdminPageResponse, AdminUserListItem } from '../../../types/admin'
import { formatDateTime, formatNumber, getApiErrorMessage } from '../../../utils/admin'

const DEFAULT_PAGE_SIZE = 20

export const AdminUserListPage = () => {
  const navigate = useNavigate()
  const [usersPage, setUsersPage] = useState<AdminPageResponse<AdminUserListItem> | null>(null)
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getAdminUsers({
          page,
          size: DEFAULT_PAGE_SIZE,
          keyword: keyword.trim() || undefined,
        })

        setUsersPage(response)
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, '사용자 목록을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUsers()
  }, [keyword, page])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(0)
    setKeyword(keywordInput.trim())
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 !rounded-[20px] border-border-muted !p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-font-main">사용자 목록</h2>
            <p className="mt-1 text-sm text-font-sub">
              로그인 아이디, 이름, 이메일 기준으로 사용자 검색이 가능합니다.
            </p>
          </div>

          <form className="flex w-full gap-3 lg:max-w-[440px]" onSubmit={handleSearchSubmit}>
            <Input
              placeholder="아이디, 이름, 이메일 검색"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="shrink-0">
              <span className="flex items-center gap-2">
                <Search size={16} />
                검색
              </span>
            </Button>
          </form>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] bg-primary-50 p-4">
            <p className="text-sm text-font-sub">총 사용자</p>
            <p className="mt-2 text-2xl font-bold text-font-main">
              {formatNumber(usersPage?.totalElements ?? 0)}
            </p>
          </div>
          <div className="rounded-[18px] border border-border-muted bg-white p-4">
            <p className="text-sm text-font-sub">현재 페이지</p>
            <p className="mt-2 text-2xl font-bold text-font-main">
              {(usersPage?.page ?? 0) + 1}
            </p>
          </div>
          <div className="rounded-[18px] border border-border-muted bg-white p-4">
            <p className="text-sm text-font-sub">페이지 크기</p>
            <p className="mt-2 text-2xl font-bold text-font-main">
              {formatNumber(usersPage?.numberOfElements ?? 0)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden !rounded-[20px] border-border-muted !p-0">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            사용자 목록을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-error">{error}</div>
        ) : !usersPage || usersPage.content.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-font-sub">
            조회된 사용자가 없습니다.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-font-sub">
                    <th className="px-5 py-4 font-medium">아이디</th>
                    <th className="px-5 py-4 font-medium">이름</th>
                    <th className="px-5 py-4 font-medium">이메일</th>
                    <th className="px-5 py-4 font-medium">점수</th>
                    <th className="px-5 py-4 font-medium">등급</th>
                    <th className="px-5 py-4 font-medium">유형</th>
                    <th className="px-5 py-4 font-medium">상태</th>
                    <th className="px-5 py-4 font-medium">가입일</th>
                    <th className="px-5 py-4 font-medium">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {usersPage.content.map((user) => (
                    <tr key={user.userId} className="border-t border-border-muted text-sm">
                      <td className="px-5 py-4 font-medium text-font-main">{user.loginId}</td>
                      <td className="px-5 py-4 text-font-main">{user.name}</td>
                      <td className="px-5 py-4 text-font-sub">{user.email}</td>
                      <td className="px-5 py-4 text-font-main">
                        {formatNumber(user.totalScore)}
                      </td>
                      <td className="px-5 py-4 text-font-main">{user.currentGrade}</td>
                      <td className="px-5 py-4 text-font-main">{user.userType}</td>
                      <td className="px-5 py-4">
                        <Badge tone={user.isActive ? 'success' : 'neutral'}>
                          {user.isActive ? '활성' : '비활성'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-font-sub">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(getAdminUserDetailPath(user.userId))}
                        >
                          상세
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-font-sub">
                총 {formatNumber(usersPage.totalElements)}명 중 {formatNumber(usersPage.numberOfElements)}
                명 표시
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="gray"
                  size="sm"
                  onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
                  disabled={!usersPage.hasPrevious}
                >
                  이전
                </Button>
                <span className="px-3 text-sm font-medium text-font-main">
                  {usersPage.page + 1} / {Math.max(usersPage.totalPages, 1)}
                </span>
                <Button
                  variant="gray"
                  size="sm"
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={!usersPage.hasNext}
                >
                  다음
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
