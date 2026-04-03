import type { ReactNode } from 'react'
import { IconButton, Icons } from '../../../components/common'
import Header from '../../../components/layout/Header'

interface ShopHeaderProps {
  title: string
  onBack: () => void
  right?: ReactNode
}

export const ShopHeader = ({ title, onBack, right }: ShopHeaderProps) => (
  <Header
    bgColor="bg-white"
    left={
      <IconButton
        label="뒤로가기"
        icon={<Icons.Back size={20} />}
        size="sm"
        onClick={onBack}
      />
    }
    title={title}
    right={right}
  />
)
