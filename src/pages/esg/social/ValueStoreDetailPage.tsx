import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, IconButton } from '../../../components/common'
import { Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'
import MainLayout from '../../../components/layout/MainLayout'
import {
  ROUTE_PATHS,
  getValueStoreProductPaymentPath,
} from '../../../constants/routePaths'
import useReturnNavigation from '../../../hooks/useReturnNavigation'
import { getValueStoreProductDetail } from '../../../services/productService'
import type { ValueStoreProductDetail } from '../../../types/product'

type ProductDescriptionBlockObject = {
  type?: string
  value?: string
  url?: string
  imageUrl?: string
}

type ParsedDescriptionBlock =
  | { type: 'image'; value: string }
  | { type: 'text'; value: string }

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('ko-KR').format(price)}원`

const resolveImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl
  const normalizedImageUrl = imageUrl.startsWith('/')
    ? imageUrl
    : `/${imageUrl}`

  if (
    normalizedBaseUrl.startsWith('http://') ||
    normalizedBaseUrl.startsWith('https://')
  ) {
    return `${normalizedBaseUrl}${normalizedImageUrl}`
  }

  return normalizedImageUrl
}

const normalizeParsedDescriptionArray = (
  parsed: unknown,
): ParsedDescriptionBlock[] => {
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.reduce<ParsedDescriptionBlock[]>((acc, block) => {
    if (!block || typeof block !== 'object') {
      return acc
    }

    const { type, value, url, imageUrl } = block as ProductDescriptionBlockObject
    const normalizedType = type?.trim().toLowerCase()
    const normalizedValue = value?.trim()

    if (normalizedType === 'text' && normalizedValue) {
      acc.push({ type: 'text', value: normalizedValue })
      return acc
    }

    if (normalizedType === 'image') {
      const imageValue = imageUrl?.trim() || url?.trim() || normalizedValue

      if (imageValue) {
        acc.push({ type: 'image', value: imageValue })
      }
    }

    return acc
  }, [])
}

const parseDescriptionBlocks = (description: string): ParsedDescriptionBlock[] => {
  const trimmedDescription = description.replace(/^\uFEFF/, '').trim()

  if (!trimmedDescription) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmedDescription) as unknown
    return normalizeParsedDescriptionArray(parsed)
  } catch {
    const arrayStartIndex = trimmedDescription.indexOf('[')
    const arrayEndIndex = trimmedDescription.lastIndexOf(']')

    if (arrayStartIndex >= 0 && arrayEndIndex > arrayStartIndex) {
      const arrayText = trimmedDescription
        .slice(arrayStartIndex, arrayEndIndex + 1)
        .trim()

      try {
        const parsedArray = JSON.parse(arrayText) as unknown
        return normalizeParsedDescriptionArray(parsedArray)
      } catch {
        return []
      }
    }

    return []
  }
}

export function ValueStoreDetailPage() {
  const navigate = useNavigate()
  const { goBack } = useReturnNavigation(ROUTE_PATHS.activitySocialStore)
  const { productId } = useParams()
  const parsedProductId = Number(productId)
  const [productDetail, setProductDetail] =
    useState<ValueStoreProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProductDetail = useCallback(async () => {
    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      setProductDetail(null)
      setError('올바른 상품 정보가 아니에요.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await getValueStoreProductDetail(parsedProductId)
      setProductDetail(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError('상품 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }, [parsedProductId])

  useEffect(() => {
    void fetchProductDetail()
  }, [fetchProductDetail])

  const isSoldOut = Boolean(productDetail?.soldOut)
  const descriptionBlocks = productDetail
    ? parseDescriptionBlocks(productDetail.description)
    : []
  const hasTextBlock = descriptionBlocks.some((block) => block.type === 'text')
  const hasImageBlock = descriptionBlocks.some((block) => block.type === 'image')
  let hasRenderedBrandStoryTitle = false
  let hasRenderedProductDescriptionTitle = false

  return (
    <MainLayout
      header={
        <Header
          left={
            <IconButton
              label="뒤로가기"
              icon={<Icons.Back className="text-font-main" />}
              onClick={goBack}
            />
          }
          title="가치가게"
        />
      }
    >
      {error ? (
        <section className="mx-[-16px] flex min-h-[calc(100vh-var(--header-h)-48px)] items-center bg-gray-50 px-4 pb-6">
          <div className="w-full rounded-card border border-red-100 bg-white px-5 py-6 text-center shadow-card">
            <h2 className="text-lg font-semibold text-font-main">
              상품 정보를 불러오지 못했어요
            </h2>
            <p className="mt-2 text-sm leading-6 text-font-sub">{error}</p>
            <Button
              className="mt-5"
              fullWidth
              onClick={() => void fetchProductDetail()}
            >
              다시 시도
            </Button>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-[-16px] min-h-[calc(100vh-var(--header-h)-48px)] bg-gray-50 pb-[118px]">
            {isLoading ? (
              <>
                <div className="h-[402px] animate-pulse bg-primary-100" />
                <div className="px-4 pt-6">
                  <div className="space-y-4">
                    <div className="h-6 w-16 animate-pulse rounded-badge bg-primary-50" />
                    <div className="h-7 w-3/4 animate-pulse rounded-full bg-gray-300" />
                    <div className="h-8 w-28 animate-pulse rounded-full bg-gray-300" />
                    <div className="h-px w-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-5 w-20 animate-pulse rounded-full bg-gray-300" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-5/6 animate-pulse rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              </>
            ) : productDetail ? (
              <>
                <section className="h-[402px] overflow-hidden bg-primary-100">
                  <img
                    src={resolveImageUrl(productDetail.imageUrl)}
                    alt={productDetail.name}
                    className="h-full w-full object-cover"
                  />
                </section>

                <section>
                  <div className="bg-white px-[20px] pt-[18px] pb-3">
                    <div className="space-y-[10px]">
                      <p className="text-[13px] leading-[120%] font-semibold tracking-[-0.02em] text-gray-500">
                        {productDetail.storeName}
                      </p>
                      <div className="mx-[-20px] h-px bg-gray-200/70" />

                      <div className="space-y-4">
                        <div className="space-y-[6px]">
                          <Badge
                            tone="primary"
                            className="px-[6px] py-[2px] text-xs font-medium tracking-[-0.02em]"
                          >
                            {productDetail.category}
                          </Badge>
                          <h2 className="w-full text-[16px] leading-[120%] font-semibold text-gray-600">
                            {productDetail.name}
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <p
                            className={`text-[20px] leading-[120%] font-bold ${
                              isSoldOut
                                ? 'text-gray-400 line-through'
                                : 'text-font-main'
                            }`}
                          >
                            {formatPrice(productDetail.price)}
                          </p>
                          {isSoldOut ? (
                            <span className="text-sm leading-[120%] font-semibold text-error">
                              품절
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-[20px] pt-0">
                    {descriptionBlocks.length > 0 ? (
                      <div>
                        {descriptionBlocks.map((block, index) => {
                          if (block.type === 'text') {
                            return (
                              <div
                                key={`product-description-text-${index}`}
                                className="space-y-0"
                              >
                                {!hasRenderedBrandStoryTitle && hasTextBlock ? (
                                  (() => {
                                    hasRenderedBrandStoryTitle = true
                                    return (
                                      <div className="space-y-3 pt-4">
                                        <p className="text-[18px] leading-[28px] font-semibold text-gray-600">
                                          Brand Story
                                        </p>
                                        <div className="h-px w-[22px] bg-gray-600" />
                                      </div>
                                    )
                                  })()
                                ) : null}
                                <p className="py-3 whitespace-pre-line text-base leading-[26px] font-normal text-gray-500">
                                  {block.value}
                                </p>
                              </div>
                            )
                          }

                          return (
                            <div key={`product-description-image-${index}`}>
                              {!hasRenderedProductDescriptionTitle && hasImageBlock ? (
                                (() => {
                                  hasRenderedProductDescriptionTitle = true
                                  return (
                                    <div className="space-y-3 pb-4">
                                      <div className="h-px w-full bg-gray-200/70" />
                                      <p className="text-[18px] leading-[28px] font-semibold text-gray-600">
                                        상품 설명
                                      </p>
                                    </div>
                                  )
                                })()
                              ) : null}
                              <img
                                src={resolveImageUrl(block.value)}
                                alt={`${productDetail.name} 상세 이미지 ${index + 1}`}
                                className="w-full object-cover"
                              />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="space-y-[11px] pt-4">
                        <p className="whitespace-pre-line text-base leading-[26px] font-normal text-gray-500">
                          {productDetail.description}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <section className="flex min-h-[calc(100vh-var(--header-h)-48px)] items-center px-4 pb-6">
                <div className="w-full rounded-card border border-gray-200 bg-white px-5 py-6 text-center shadow-card">
                  <h2 className="text-lg font-semibold text-font-main">
                    상품 정보를 찾을 수 없어요
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-font-sub">
                    존재하지 않거나 삭제된 상품입니다.
                  </p>
                </div>
              </section>
            )}
          </section>

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
            <section className="pointer-events-auto mx-auto w-full max-w-[600px] bg-white px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
              <Button
                fullWidth
                disabled={isLoading || isSoldOut || !productDetail}
                className="!h-[48px]"
                onClick={() =>
                  productDetail
                    ? navigate(getValueStoreProductPaymentPath(productDetail.productId))
                    : undefined
                }
              >
                {isSoldOut ? '품절' : '구매하기'}
              </Button>
            </section>
          </div>
        </>
      )}
    </MainLayout>
  )
}
