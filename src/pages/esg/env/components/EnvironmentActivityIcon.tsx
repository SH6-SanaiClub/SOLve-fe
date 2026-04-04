import { Icons } from '../../../../components/common'
import type { EnvActivityItem } from '../envActivityData'

interface EnvironmentActivityIconProps {
  icon: EnvActivityItem['icon']
}

export function EnvironmentActivityIcon({ icon }: EnvironmentActivityIconProps) {
  const IconComponent =
    icon === 'tumbler' ? Icons.Tumbler : icon === 'bike' ? Icons.Bicycle : Icons.EvCharger

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-primary-400 shadow-sm">
      <IconComponent size={24} strokeWidth={2.1} />
    </div>
  )
}
