export interface ValueStoreProduct {
  productId: number
  storeName: string
  name: string
  category: string
  price: number
  imageUrl: string
  description: string
  stock: number
  soldOut: boolean
}

export interface ValueStoreProductListResponse {
  products: ValueStoreProduct[]
}

export type ValueStoreProductDetail = ValueStoreProduct

export interface ValueStorePurchaseHistoryItem {
  purchaseId: number
  productId: number
  name: string
  storeName: string
  category: string
  amount: number
  imageUrl: string
  deliveryAddress: string
  orderedAt: string
}

export interface ValueStorePurchaseHistoryResponse {
  purchases: ValueStorePurchaseHistoryItem[]
}
