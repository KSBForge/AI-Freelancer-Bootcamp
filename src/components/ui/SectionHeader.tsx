import { useReveal } from '../../lib/hooks'

interface Props {
  eyebrow: string
  title: React.ReactNode
  sub?: string
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}

export default function SectionHeader({ eyebrow, title, sub, align = 'left', dark = true, className = '' }: Props) {
  const { ref, cls } = useReveal()
  return (
    <div ref={ref} className={`${cls} ${align === 'center' ? 'text-center' : ''} ${className}`}>
      <span className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</span>
      <h2
        className={`mt-5 font-display text-[clamp(34px,4.6vw,58px)] font-medium leading-[1.05] ${dark ? 'text-ivory' : 'text-ink'}`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 max-w-xl text-[15px] leading-relaxed ${dark ? 'text-ivory/60' : 'text-ink/60'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {sub}
        </p>
      )}
    </div>
  )
}
