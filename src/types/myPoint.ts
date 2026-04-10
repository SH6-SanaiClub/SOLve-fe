export interface MyPointSummary {
  userId: number
  totalPoints: number
}

export interface MyPointHistoryItem {
  userPointId: number
  title: string
  reason: string
  changedAmount: number
  pointAfter: number
  createdAt: string
}

export interface MyPointHistoryResponse {
  histories: MyPointHistoryItem[]
}
