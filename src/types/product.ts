export interface ValueStoreProduct {
  productId: number
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
