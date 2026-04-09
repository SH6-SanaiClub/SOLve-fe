export interface FinanceHistoryItem {
  id: string
  category: '적금' | '대출'
  title: string
  date: string
  amount: string
  status: string
}

export const savingsHistoryItems: FinanceHistoryItem[] = [
  {
    id: 's1',
    category: '적금',
    title: '그린 스텝업 적금 자동이체',
    date: '2026.04.05',
    amount: '-300,000 원',
    status: '처리 완료',
  },
  {
    id: 's2',
    category: '적금',
    title: '그린 스텝업 적금 자동이체',
    date: '2026.03.05',
    amount: '-300,000 원',
    status: '처리 완료',
  },
  {
    id: 's3',
    category: '적금',
    title: '그린 스텝업 적금 자동이체',
    date: '2026.02.05',
    amount: '-300,000 원',
    status: '처리 완료',
  },
]

export const loanHistoryItems: FinanceHistoryItem[] = [
  {
    id: 'l1',
    category: '대출',
    title: 'ESG 소액대출 원리금 상환',
    date: '2026.04.03',
    amount: '-150,000 원',
    status: '처리 완료',
  },
  {
    id: 'l2',
    category: '대출',
    title: 'ESG 소액대출 원리금 상환',
    date: '2026.03.03',
    amount: '-150,000 원',
    status: '처리 완료',
  },
  {
    id: 'l3',
    category: '대출',
    title: 'ESG 소액대출 실행',
    date: '2026.02.28',
    amount: '+2,000,000 원',
    status: '입금 완료',
  },
]
