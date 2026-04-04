import { EnvironmentEntryModal } from './EnvironmentEntryModal'

interface EnvironmentEntryFlowProps {
  open: boolean
  onClose: () => void
}

export function EnvironmentEntryFlow({ open, onClose }: EnvironmentEntryFlowProps) {
  return (
    <EnvironmentEntryModal
      open={open}
      onClose={onClose}
      onSelect={onClose}
    />
  )
}
