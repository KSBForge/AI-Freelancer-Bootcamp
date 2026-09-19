import { useCountUp } from '../../lib/hooks'

export default function StatCounter({
  value,
  suffix = '',
  label,
  dark = true,
  className = '',
}: {
  value: number
  suffix?: string
  label: string
  dark?: boolean
  className?: string
}) {
  const { ref, val } = useCountUp(value, 1800)
  return (
    <div className={className}>
      <div className={`font-display text-[42px] font-medium leading-none sm:text-5xl ${dark ? 'text-ivory' : 'text-ink'}`}>
        <span ref={ref}>{val.toLocaleString('en-IN')}</span>
        {suffix && <span className="text-gradient-gold">{suffix}</span>}
      </div>
      <div className={`mt-2.5 text-[13px] tracking-wide ${dark ? 'text-ivory/60' : 'text-ink/60'}`}>{label}</div>
    </div>
  )
}
