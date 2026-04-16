import type { HTMLAttributes } from 'react'
import { Card, Icons } from '../../../components/common'

interface DashboardActionTileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  description?: string
  descriptionItems?: string[]
  variant?: 'primary' | 'outline'
  size?: 'md' | 'lg'
}

const variantClassNames = {
  primary: {
    card: '!border-primary-400 !bg-primary-400 !text-white',
    description: 'text-primary-200',
    icon: 'text-white',
  },
  outline: {
    card: '!border-primary-500 !bg-white !text-primary-500',
    description: 'text-primary-500',
    icon: 'text-primary-500',
  },
} as const

const sizeClassNames = {
  md: {
    card: '!h-[70px]',
    title: 'text-lg font-semibold',
    description: 'text-base leading-none',
    icon: 24,
  },
  lg: {
    card: '!h-[95px]',
    title: 'text-xl font-bold',
    description: 'text-base leading-none',
    icon: 28,
  },
} as const

export function DashboardActionTile({
  title,
  description,
  descriptionItems,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props
}: DashboardActionTileProps) {
  const variantStyle = variantClassNames[variant]
  const sizeStyle = sizeClassNames[size]

  return (
    <Card
      className={[
        'justify-center overflow-hidden',
        sizeStyle.card,
        variantStyle.card,
        className,
      ].join(' ')}
      {...props}
    >
      <div className="flex min-h-full w-full items-center justify-between gap-4 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden text-left">
          <p className={`leading-none tracking-tight ${sizeStyle.title}`}>{title}</p>
          {descriptionItems?.length ? (
            <div
              className={`mt-1 flex max-w-full flex-wrap items-center gap-x-1 gap-y-0.5 font-medium ${sizeStyle.description} ${variantStyle.description}`}
            >
              {descriptionItems.map((item, index) => (
                <div key={item} className="flex max-w-full items-center gap-1">
                  {index > 0 ? <span aria-hidden="true">|</span> : null}
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          ) : description ? (
            <p className={`mt-1 font-medium ${sizeStyle.description} ${variantStyle.description}`}>
              {description}
            </p>
          ) : null}
        </div>

        <Icons.ArrowRight className={`shrink-0 ${variantStyle.icon}`} size={sizeStyle.icon} />
      </div>
    </Card>
  )
}
