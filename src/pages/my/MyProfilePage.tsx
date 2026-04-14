import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, InfoRow, Input, SectionHeader } from '../../components/common'
import BottomNavigation from '../../components/layout/BottomNavigation'
import MainLayout from '../../components/layout/MainLayout'
import {
  BOTTOM_NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ROUTE_BY_KEY,
} from '../../constants/bottomNavigation'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { identityVerificationService } from '../../services/identityVerificationService'
import {
  checkMyPassword,
  getMyProfile,
  updateMyEmail,
  updateMyPassword,
  updateMyPhoneNumber,
  withdrawMyAccount,
} from '../../services/userProfileService'
import { clearClientAuthSession } from '../../utils/authSession'
import { ShopHeader } from '../shop/components/ShopHeader'

type EditableField = 'email' | 'phone'

const initialProfile = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  loginId: '',
  joinedAt: '',
}

const fieldLabels: Record<EditableField, string> = {
  email: '이메일',
  phone: '휴대폰 번호',
}

const fieldHelpers: Record<'email', string> = {
  email: '변경할 이메일 주소를 입력해 주세요.',
}

const formatDateLabel = (value: string) => {
  if (!value) {
    return ''
  }

  return value.slice(0, 10).replace(/-/g, '.')
}

const getAlertMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const serverMessage = (error.response?.data as { message?: string } | undefined)?.message?.trim()
    return serverMessage || '처리 중 오류가 발생했습니다.'
  }

  if (error instanceof Error) {
    const message = error.message.trim()
    if (message) {
      return message
    }
  }

  return '처리 중 오류가 발생했습니다.'
}

export const MyProfilePage = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(initialProfile)
  const [draftProfile, setDraftProfile] = useState(initialProfile)
  const [activeEditor, setActiveEditor] = useState<EditableField | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingEmail, setIsSavingEmail] = useState(false)
  const [isCheckingCurrentPassword, setIsCheckingCurrentPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false)
  const [isWithdrawCompleted, setIsWithdrawCompleted] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [currentPasswordCheck, setCurrentPasswordCheck] = useState<{
    matched: boolean | null
    message: string
  }>({
    matched: null,
    message: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    nextPassword: '',
    nextPasswordConfirm: '',
  })
  const isNextPasswordFilled =
    passwordForm.nextPassword.length > 0 && passwordForm.nextPasswordConfirm.length > 0
  const isNextPasswordMatched =
    isNextPasswordFilled && passwordForm.nextPassword === passwordForm.nextPasswordConfirm
  const isNextPasswordMismatched =
    isNextPasswordFilled && passwordForm.nextPassword !== passwordForm.nextPasswordConfirm
  const isPasswordChangeDisabled =
    isUpdatingPassword ||
    isCheckingCurrentPassword ||
    currentPasswordCheck.matched !== true ||
    !isNextPasswordMatched
  const withdrawCompleteImage = getS3AssetUrl('delete.png')

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getMyProfile()
        const nextProfile = {
          name: response.name,
          email: response.email,
          phone: response.phoneNumber,
          birthDate: formatDateLabel(response.birthdate),
          loginId: response.loginId,
          joinedAt: formatDateLabel(response.joinedAt),
        }

        setProfile(nextProfile)
        setDraftProfile(nextProfile)
      } catch (error) {
        setErrorMessage(getAlertMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [])

  const handleBottomNavigation = (key: string) => {
    const nextPath =
      BOTTOM_NAVIGATION_ROUTE_BY_KEY[key as keyof typeof BOTTOM_NAVIGATION_ROUTE_BY_KEY]

    if (nextPath) {
      navigate(nextPath)
    }
  }

  const handleEditorOpen = (field: EditableField) => {
    if (isLoading) {
      return
    }

    setDraftProfile(profile)
    setActiveEditor(field)
  }

  const handleEditorCancel = () => {
    setDraftProfile(profile)
    setActiveEditor(null)
  }

  const handleProfileSave = async () => {
    if (isSavingEmail) {
      return
    }

    setIsSavingEmail(true)
    setErrorMessage('')

    try {
      const response = await updateMyEmail(draftProfile.email)

      setProfile((currentProfile) => ({
        ...currentProfile,
        email: response.email,
      }))
      setDraftProfile((currentProfile) => ({
        ...currentProfile,
        email: response.email,
      }))
      setActiveEditor(null)
      setSuccessMessage(response.message)
    } catch (error) {
      setErrorMessage(getAlertMessage(error))
    } finally {
      setIsSavingEmail(false)
    }
  }

  const handleStartPhoneVerification = async () => {
    if (isVerifying) {
      return
    }

    setIsVerifying(true)
    setErrorMessage('')

    try {
      const impUid = await identityVerificationService.requestImpUid()
      const response = await updateMyPhoneNumber(impUid)

      setProfile((currentProfile) => ({
        ...currentProfile,
        phone: response.phoneNumber,
      }))
      setDraftProfile((currentProfile) => ({
        ...currentProfile,
        phone: response.phoneNumber,
      }))
      setActiveEditor(null)
    } catch (error) {
      setErrorMessage(getAlertMessage(error))
    } finally {
      setIsVerifying(false)
    }
  }

  const runCurrentPasswordCheck = async (currentPassword: string) => {
    const trimmedPassword = currentPassword.trim()

    if (!trimmedPassword) {
      setCurrentPasswordCheck({
        matched: null,
        message: '',
      })
      return null
    }

    setIsCheckingCurrentPassword(true)

    try {
      const response = await checkMyPassword(trimmedPassword)
      setCurrentPasswordCheck({
        matched: response.matched,
        message: response.message,
      })
      return response.matched
    } catch (error) {
      setErrorMessage(getAlertMessage(error))
      return null
    } finally {
      setIsCheckingCurrentPassword(false)
    }
  }

  const handleCurrentPasswordBlur = async () => {
    await runCurrentPasswordCheck(passwordForm.currentPassword)
  }

  const handlePasswordChange = async () => {
    if (isUpdatingPassword || isCheckingCurrentPassword) {
      return
    }

    if (!passwordForm.currentPassword.trim()) {
      setErrorMessage('현재 비밀번호를 입력해주세요.')
      return
    }

    if (!isNextPasswordMatched) {
      setErrorMessage('새 비밀번호가 일치하지 않습니다.')
      return
    }

    let isCurrentPasswordMatched = currentPasswordCheck.matched === true

    if (!isCurrentPasswordMatched) {
      isCurrentPasswordMatched =
        (await runCurrentPasswordCheck(passwordForm.currentPassword)) === true
    }

    if (!isCurrentPasswordMatched) {
      return
    }

    setIsUpdatingPassword(true)
    setErrorMessage('')

    try {
      const response = await updateMyPassword(
        passwordForm.currentPassword.trim(),
        passwordForm.nextPassword,
        passwordForm.nextPasswordConfirm,
      )

      setPasswordForm({
        currentPassword: '',
        nextPassword: '',
        nextPasswordConfirm: '',
      })
      setCurrentPasswordCheck({
        matched: null,
        message: '',
      })
      setSuccessMessage(response.message)
    } catch (error) {
      setErrorMessage(getAlertMessage(error))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleWithdrawConfirmOpen = () => {
    setIsWithdrawConfirmOpen(true)
  }

  const handleWithdrawConfirmClose = () => {
    setIsWithdrawConfirmOpen(false)
  }

  const handleWithdrawComplete = async () => {
    if (isWithdrawing) {
      return
    }

    setIsWithdrawing(true)
    setErrorMessage('')

    try {
      await withdrawMyAccount()
      setIsWithdrawConfirmOpen(false)
      setIsWithdrawCompleted(true)
    } catch (error) {
      setIsWithdrawConfirmOpen(false)
      setErrorMessage(getAlertMessage(error))
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleMoveToLogin = () => {
    clearClientAuthSession()
    navigate(ROUTE_PATHS.login, { replace: true })
  }

  const renderEditableRow = (field: EditableField, isLast: boolean) => {
    const isEditing = activeEditor === field

    return (
      <div key={field} className={isLast ? '' : 'border-b border-gray-100'}>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-font-sub">{fieldLabels[field]}</p>
            <p className="mt-1 truncate text-sm font-medium text-font-main">{profile[field]}</p>
          </div>

          <Button
            type="button"
            variant="gray"
            size="sm"
            className="shrink-0 !h-8 !rounded-full !px-3 !text-xs !font-medium"
            onClick={() => handleEditorOpen(field)}
          >
            수정
          </Button>
        </div>

        {isEditing ? (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
            {field === 'email' ? (
              <>
                <Input
                  label={fieldLabels[field]}
                  value={draftProfile[field]}
                  onChange={(event) =>
                    setDraftProfile((currentDraft) => ({
                      ...currentDraft,
                      [field]: event.target.value,
                    }))
                  }
                  helperText={fieldHelpers[field]}
                />

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleEditorCancel}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    disabled={isSavingEmail}
                    onClick={() => void handleProfileSave()}
                  >
                    저장
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-control border border-primary-100 bg-white px-4 py-4">
                  <p className="text-sm leading-6 text-font-sub text-center">
                    휴대폰 번호 변경 시 본인인증이 필요합니다.
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleEditorCancel}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    disabled={isVerifying}
                    onClick={handleStartPhoneVerification}
                  >
                    {isVerifying ? '인증 확인 중...' : '본인인증 시작'}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    )
  }

  if (isWithdrawCompleted) {
    return (
      <MainLayout
        header={<ShopHeader title="회원탈퇴 완료" onBack={handleMoveToLogin} />}
        className="bg-bg-light"
      >
        <div className="flex min-h-[calc(100dvh-var(--header-h)-40px)] flex-col pb-32">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex flex-col gap-1">
              <img
                src={withdrawCompleteImage}
                alt="회원탈퇴 완료"
                className="mx-auto h-[230px] w-[230px] object-contain"
              />
              <p className="text-[22px] font-semibold text-font-main -mt-8">회원탈퇴가 완료되었습니다.</p>
              <p className="text-sm leading-6 text-font-sub">이용해주셔서 감사합니다.</p>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 bg-bg-light px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
            <Button type="button" fullWidth onClick={handleMoveToLogin}>
              메인화면으로
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      header={<ShopHeader title="프로필 및 계정 관리" onBack={() => navigate(ROUTE_PATHS.my)} />}
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
        <Card className="!gap-0 !border-0 !px-5 !py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[22px] font-semibold text-primary-500">
              {profile.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1 self-stretch flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-semibold leading-none text-font-main">
                  {isLoading ? '불러오는 중...' : profile.name}
                </p>
                <Badge tone="primary" variant="soft" className="!px-[8px] !py-[4px]">
                  본인인증 완료
                </Badge>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <p className="text-sm text-font-sub">{profile.email || '-'}</p>
                <p className="text-sm text-font-sub">{profile.phone || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="flex flex-col gap-3">
          <SectionHeader title="기본 정보" className="px-1" />

          <Card className="!gap-0 !p-0">
            {renderEditableRow('email', false)}
            {renderEditableRow('phone', true)}
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="계정 정보" className="px-1" />

          <Card className="!gap-5">
            <InfoRow label="아이디" value={profile.loginId || '-'} />
            <InfoRow label="생년월일" value={profile.birthDate || '-'} />
            <InfoRow label="가입일" value={profile.joinedAt || '-'} />
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="비밀번호 변경" className="px-1" />

          <Card className="!gap-0">
            <div className="flex flex-col gap-5">
              <Input
                label="현재 비밀번호"
                type="password"
                placeholder="현재 비밀번호를 입력해 주세요."
                helperText={
                  isCheckingCurrentPassword
                    ? '현재 비밀번호 확인 중...'
                    : currentPasswordCheck.matched
                      ? currentPasswordCheck.message
                      : undefined
                }
                errorText={
                  currentPasswordCheck.matched === false
                    ? currentPasswordCheck.message
                    : undefined
                }
                isVerified={currentPasswordCheck.matched === true}
                value={passwordForm.currentPassword}
                onBlur={() => void handleCurrentPasswordBlur()}
                onChange={(event) => {
                  setPasswordForm((currentForm) => ({
                    ...currentForm,
                    currentPassword: event.target.value,
                  }))
                  setCurrentPasswordCheck({
                    matched: null,
                    message: '',
                  })
                }}
              />
              <Input
                label="새 비밀번호"
                type="password"
                placeholder="새 비밀번호를 입력해 주세요."
                value={passwordForm.nextPassword}
                onChange={(event) =>
                  setPasswordForm((currentForm) => ({
                    ...currentForm,
                    nextPassword: event.target.value,
                  }))
                }
              />
              <Input
                label="새 비밀번호 확인"
                type="password"
                placeholder="새 비밀번호를 다시 입력해 주세요."
                helperText={isNextPasswordMatched ? '새 비밀번호가 일치합니다.' : undefined}
                errorText={
                  isNextPasswordMismatched ? '새 비밀번호가 일치하지 않습니다.' : undefined
                }
                isVerified={isNextPasswordMatched}
                value={passwordForm.nextPasswordConfirm}
                onChange={(event) =>
                  setPasswordForm((currentForm) => ({
                    ...currentForm,
                    nextPasswordConfirm: event.target.value,
                  }))
                }
              />
            </div>

            <Button
              type="button"
              fullWidth
              className="mt-5"
              disabled={isPasswordChangeDisabled}
              onClick={() => void handlePasswordChange()}
            >
              {isUpdatingPassword ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </Card>
        </section>

        <button
          type="button"
          className="mt-1 self-center text-sm font-medium text-red-500"
          onClick={handleWithdrawConfirmOpen}
        >
          회원탈퇴
        </button>
      </div>
      {isWithdrawConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-center text-sm font-medium text-font-main">
              회원탈퇴 하시겠습니까?
            </p>
            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleWithdrawConfirmClose}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                disabled={isWithdrawing}
                onClick={() => void handleWithdrawComplete()}
              >
                {isWithdrawing ? '처리 중...' : '확인'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-center text-sm font-medium text-font-main">{errorMessage}</p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              className="mt-5"
              onClick={() => setErrorMessage('')}
            >
              확인
            </Button>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-center text-sm font-medium text-font-main">{successMessage}</p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              className="mt-5"
              onClick={() => setSuccessMessage('')}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
