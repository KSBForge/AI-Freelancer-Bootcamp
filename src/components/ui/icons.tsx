import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (props: P) => ({
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
)
export const IconTag = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </svg>
)
export const IconHandshake = (p: P) => (
  <svg {...base(p)}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.8-.8L11 3 5 6 2 12l4 4" />
    <path d="m8.7 8.3 3.3 3.3a1 1 0 1 1-1.4 1.4L8.5 10.8" />
  </svg>
)
export const IconUsers = (p: P) => (
  <svg {...base(p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)
export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
export const IconDocument = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h4" />
  </svg>
)
export const IconKey = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="m11 12 9-9" />
    <path d="m17 6 3 3" />
    <path d="m14 9 2 2" />
  </svg>
)
export const IconDiamond = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
    <path d="M2 9h20" />
    <path d="m9 3 3 6 3-6" />
    <path d="m9 9 3 12 3-12" />
  </svg>
)
export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 10-10 3 5 4 9 3 12a7 7 0 0 1-6 5Z" />
    <path d="M4 21c3-5 8-9 12-11" />
  </svg>
)
export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" />
    <path d="m9 11.5 2 2 4-4" />
  </svg>
)
export const IconPool = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
    <path d="M2 20c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
    <path d="M8 13V4a2 2 0 0 1 4 0" />
    <path d="M8 8h4" />
  </svg>
)
export const IconGym = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 6.5v11M17.5 6.5v11" />
    <path d="M3 9v6M21 9v6" />
    <path d="M6.5 12h11" />
  </svg>
)
export const IconClub = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21h18" />
    <path d="M5 21V8l7-5 7 5v13" />
    <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
  </svg>
)
export const IconStar = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z" />
  </svg>
)
export const IconHeart = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 14c1.5-1.4 3-3 3-5a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 2 1.5 3.6 3 5l6 6Z" />
  </svg>
)
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </svg>
)
export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)
export const IconPlay = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
  </svg>
)
export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
export const IconBed = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 18v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6" />
    <path d="M2 18h20" />
    <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
  </svg>
)
export const IconBath = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" />
    <path d="M6 12V5a2 2 0 0 1 4 0" />
    <path d="M7 21l-1 1M17 21l1 1" />
  </svg>
)
export const IconArea = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M4 9h5V4M20 15h-5v5" />
  </svg>
)
export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z" />
  </svg>
)
export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
)
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />
  </svg>
)
export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
export const IconLocation = (p: P) => IconPin
export const IconQuote = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M10 8c-3 .5-5 2.7-5 6v2h5v-6H7.5C7.8 9 9 8.4 10 8.2V8Zm9 0c-3 .5-5 2.7-5 6v2h5v-6h-2.5c.3-1 1.5-1.6 2.5-1.8V8Z" />
  </svg>
)
export const IconFilter = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" />
  </svg>
)
export const IconChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export const IconChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)
export const IconCube = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 2 8 4.5v9L12 22l-8-6.5v-9L12 2Z" />
    <path d="M12 22V11M12 11 4 6.5M12 11l8-4.5" />
  </svg>
)
export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)
export const IconFacebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 9h3V5.5h-3A3.5 3.5 0 0 0 10.5 9v2.5H8V15h2.5v6.5H14V15h3l.5-3.5H14V9Z" />
  </svg>
)
export const IconLinkedin = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M7.5 10.5V17M7.5 7.6v.1" />
    <path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
  </svg>
)
export const IconYoutube = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
  </svg>
)

export const ICONS: Record<string, (p: P) => JSX.Element> = {
  home: IconHome,
  tag: IconTag,
  chart: IconChart,
  handshake: IconHandshake,
  users: IconUsers,
  search: IconSearch,
  calendar: IconCalendar,
  document: IconDocument,
  key: IconKey,
  diamond: IconDiamond,
  leaf: IconLeaf,
  shield: IconShield,
  pool: IconPool,
  gym: IconGym,
  club: IconClub,
  pin: IconPin,
}
