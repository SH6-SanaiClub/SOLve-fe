export interface PointShopItem {
  itemId: number
  name: string
  category: string
  requiredPoints: number
  imageUrl: string | null
  description: string
  stock: number
  soldOut: boolean
}

export interface PointShopItemsResponse {
  items: PointShopItem[]
}

export interface PointShopSummary {
  userId: number
  totalPoints: number
}

export interface PointShopPurchaseResult {
  itemId: number
  itemName: string
  usedPoints: number
  remainingPoints: number
  exchangeCode: string
  purchasedAt: string
}

export interface PointShopPurchaseHistoryItem {
  userPointId: number
  itemId: number
  itemName: string
  category: string
  imageUrl: string | null
  usedPoints: number
  pointAfter: number
  exchangeCode: string | null
  purchasedAt: string
}

export interface PointShopPurchaseHistoryResponse {
  purchases: PointShopPurchaseHistoryItem[]
}

export type PointShopItemDetail = PointShopItem
