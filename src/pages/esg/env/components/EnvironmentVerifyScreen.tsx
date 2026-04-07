import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Camera, Info } from 'lucide-react'
import type { EnvActivityType } from '../envActivityData'
import { ENV_ACTIVITY_CONFIG } from '../envActivityConfig'
import { EnvironmentGuideCard } from './EnvironmentGuideCard'

interface EnvironmentVerifyScreenProps {
  activityType: EnvActivityType
  onFileSelectedChange?: (file: File | null) => void
}

const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024

export function EnvironmentVerifyScreen({
  activityType,
  onFileSelectedChange,
}: EnvironmentVerifyScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const activityConfig = ENV_ACTIVITY_CONFIG[activityType]

  useEffect(() => {
    onFileSelectedChange?.(selectedFile)
  }, [onFileSelectedChange, selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]
    event.currentTarget.value = ''

    if (!nextFile) {
      return
    }

    if (!nextFile.type.startsWith('image/')) {
      clearSelection()
      setValidationMessage('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    if (nextFile.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      clearSelection()
      setValidationMessage('사진 크기가 너무 큽니다.')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(nextFile)
    setSelectedFile(nextFile)
    setPreviewUrl(nextPreviewUrl)
    setValidationMessage(null)
  }

  return (
    <div className="space-y-3 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <section className="space-y-1.5 pt-5 pl-2">
        <p className="text-base font-bold text-gray-700">친환경 활동 인증하기</p>
        <p className="text-xs leading-5 font-medium text-gray-500">{activityConfig.subtitle}</p>
      </section>

      <section className="mb-6">
        <button
          type="button"
          onClick={handleOpenFilePicker}
          className={`w-full rounded-card text-center ${previewUrl ? 'p-4' : 'px-5 py-8'}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: '#C4C5DA',
          }}
        >
          {previewUrl ? (
            <div className="w-full">
              <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-[14px] border border-gray-100 bg-gray-50">
                <img
                  src={previewUrl}
                  alt={`${activityConfig.title} 미리보기`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
                <Camera size={24} />
              </div>
              <p className="mt-1 pt-3 text-base font-semibold text-gray-900">사진 선택하기</p>
              <p className="mt-2 text-xs font-medium text-gray-500">
                {activityConfig.uploadCaption}
              </p>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {validationMessage ? (
          <p className="mt-3 px-1 text-xs font-medium text-red-500">{validationMessage}</p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h3 className="pl-2 pb-1 text-base font-bold text-gray-700">인증 가이드를 확인해주세요</h3>

        {activityConfig.guides.map((guide) => (
          <EnvironmentGuideCard
            key={guide.title}
            guide={guide}
          />
        ))}
      </section>

      <section className="rounded-card bg-primary-50 px-4 py-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-gray-600">
            <Info size={16} />
          </div>
          <p className="text-[11px] leading-5 font-medium text-gray-600">
            {activityConfig.notice}
          </p>
        </div>
      </section>
    </div>
  )
}
