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
  const isDecimal = value % 1 !== 0
  const { ref, val } = useCountUp(Math.round(value * 10), 1800)
  const display =
    isDecimal ? (val / 10).toFixed(1) : val.toLocaleString('en-IN')

  return (
    <div className={className}>
      <div className={`font-display text-[42px] font-medium leading-none sm:text-5xl ${dark ? 'text-ivory' : 'text-ink'}`}>
        <span ref={ref}>{display}</span>
        {suffix && <span className="text-gradient-gold">{suffix}</span>}
      </div>
      <div className={`mt-2.5 text-[13px] tracking-wide ${dark ? 'text-ivory/60' : 'text-ink/60'}`}>{label}</div>
    </div>
  )
}
