import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Camera, Info } from 'lucide-react'
import type { EnvActivityType } from '../envActivityData'
import { ENV_ACTIVITY_CONFIG } from '../envActivityConfig'
import { EnvironmentGuideCard } from './EnvironmentGuideCard'

interface EnvironmentVerifyScreenProps {
  activityType: EnvActivityType
}

function formatFileSize(fileSize: number) {
  if (fileSize >= 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(1)}MB`
  }

  return `${Math.ceil(fileSize / 1024)}KB`
}

export function EnvironmentVerifyScreen({ activityType }: EnvironmentVerifyScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const activityConfig = ENV_ACTIVITY_CONFIG[activityType]

  const fileSizeLabel = useMemo(() => {
    if (!selectedFile) {
      return ''
    }

    return formatFileSize(selectedFile.size)
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]

    if (!nextFile) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(nextFile)
    setSelectedFile(nextFile)
    setPreviewUrl(nextPreviewUrl)
    event.currentTarget.value = ''
  }

  return (
    <div className="space-y-3 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <section className="space-y-1.5 pt-5 pl-2">
        <p className="text-base font-bold text-gray-700">친환경 활동 인증하기</p>
        <p className="text-xs leading-5  font-medium text-gray-500">{activityConfig.subtitle}</p>
      </section>

      <section className="mb-6">
        <button
          type="button"
          onClick={handleOpenFilePicker}
          className="w-full rounded-card px-5 py-8 text-center"
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: '#C4C5DA',
          }}
        >
          {previewUrl ? (
            <div className="w-full">
              <div className="overflow-hidden rounded-[14px] border border-gray-100 bg-gray-50">
                <img
                  src={previewUrl}
                  alt={`${activityConfig.title} 미리보기`}
                  className="h-[220px] w-full object-cover"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-[14px] bg-gray-50 px-4 py-3 text-left">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-700">
                    {selectedFile?.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-500">{fileSizeLabel}</p>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-400">
                  OCR 분석 대기
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
                <Camera size={24} />
              </div>
              <p className="mt-4 pt-3 text-base font-semibold text-gray-900">사진 선택하기</p>
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
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-700 pl-1 pb-2">인증 가이드를 확인해주세요</h3>

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
