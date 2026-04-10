import { useState } from 'react'
import { Badge, Card } from '../../../../components/common'
import type { ValueStoreProduct } from '../../../../types/product'

interface ValueStoreProductCardProps {
  product: ValueStoreProduct
  onClick?: (productId: number) => void
}

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('ko-KR').format(price)}원`

export const ValueStoreProductCard = ({
  product,
  onClick,
}: ValueStoreProductCardProps) => {
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <Card
      className="gap-0 overflow-hidden rounded-control !p-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      onClick={onClick ? () => onClick(product.productId) : undefined}
    >
      <div className="h-[159px] overflow-hidden rounded-t-control bg-primary-100">
        {hasImageError ? (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-100 to-primary-300 px-4 text-center text-sm font-semibold text-white">
            가치가게
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <div className="bg-white px-3 py-[14px]">
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[2px]">
            <p className="text-[12px] leading-[120%] font-medium tracking-[-0.02em] text-gray-400">
              {product.storeName}
            </p>
            <div className="min-h-[34px]">
              <p className="line-clamp-2 text-sm leading-[120%] font-medium tracking-[-0.02em] text-gray-700">
                {product.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p
                className={`text-base leading-[120%] font-semibold tracking-[-0.02em] ${
                  product.soldOut
                    ? 'text-gray-400 line-through'
                    : 'text-gray-700'
                }`}
              >
                {formatPrice(product.price)}
              </p>
              {product.soldOut ? (
                <span className="text-sm leading-[120%] font-semibold tracking-[-0.02em] text-error">
                  품절
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <Badge
              tone="primary"
              className="px-[6px] py-[2px] text-xs font-medium tracking-[-0.02em]"
            >
              {product.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
