import type { PropsWithChildren, ReactNode } from 'react'
import './styles.css'

interface ShellProps extends PropsWithChildren {
  eyebrow: string
  title: string
  intro: ReactNode
  actions?: ReactNode
}

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Shell({ eyebrow, title, intro, actions, children }: ShellProps) {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        {actions ? <div className="actions">{actions}</div> : null}
      </section>
      {children}
    </main>
  )
}

export function CardGrid({ children }: PropsWithChildren) {
  return <section className="grid two">{children}</section>
}

export function Card({ children, className }: CardProps) {
  return <article className={className ? `card ${className}` : 'card'}>{children}</article>
}
