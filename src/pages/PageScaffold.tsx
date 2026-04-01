import type { ReactNode } from 'react'

interface PageScaffoldProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageScaffold({ title, description, children }: PageScaffoldProps) {
  return (
    <div className="app-shell">
      <section className="page-card flex flex-col gap-4">
        <span className="text-sm font-semibold text-primary-500">SOLve</span>
        <h1 className="text-2xl font-bold text-font-main">{title}</h1>
        <p className="text-base text-font-sub">{description}</p>
        {children}
      </section>
    </div>
  )
}
