import { Card } from '../../../components/common'

interface ShopProductCardProps {
  title: string
  priceLabel: string
  imageSrc?: string
  imageAlt?: string
  mediaBackgroundClassName?: string
  mediaTextClassName?: string
  placeholderLabel: string
  placeholderSubLabel?: string
  onClick?: () => void
}

export const ShopProductCard = ({
  title,
  priceLabel,
  imageSrc,
  imageAlt,
  mediaBackgroundClassName = 'bg-primary-100',
  mediaTextClassName = 'text-primary-500',
  placeholderLabel,
  placeholderSubLabel,
  onClick,
}: ShopProductCardProps) => (
  <Card
    onClick={onClick}
    className="h-full !gap-0 !overflow-hidden !rounded-control !border-gray-100 !p-0 [&>div:last-child]:flex [&>div:last-child]:h-full [&>div:last-child]:flex-1 [&>div:last-child]:flex-col"
  >
    <div
      className={`relative flex h-[159px] w-full items-center justify-center overflow-hidden ${mediaBackgroundClassName}`}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={imageAlt ?? title} className="h-full w-full object-cover" />
      ) : (
        <div className={`px-[var(--space-4)] text-center ${mediaTextClassName}`}>
          <p className="text-2xl font-bold leading-none tracking-[-0.04em]">{placeholderLabel}</p>
          {placeholderSubLabel ? (
            <p className="mt-[var(--space-2)] text-xs font-medium">{placeholderSubLabel}</p>
          ) : null}
        </div>
      )}
    </div>

    <div className="flex flex-1 flex-col px-[var(--space-3)] py-[14px]">
      <div className="flex min-h-[46px] flex-1 flex-col">
        <p className="line-clamp-2 text-sm font-medium leading-[1.2] text-gray-700">{title}</p>
        <p className="pt-[var(--space-2)] text-base font-semibold leading-[1.2] text-gray-700">
          {priceLabel}
        </p>
      </div>
    </div>
  </Card>
)
