export interface Property {
  id: string
  name: string
  location: string
  city: string
  price: string
  priceValue: number // in Cr for filtering
  beds: number
  baths: number
  area: string
  type: 'Villas' | 'Apartments' | 'Penthouses' | 'Commercial' | 'Land'
  badge?: 'Featured' | 'New' | 'Popular' | 'Luxury'
  image: string
  gallery?: string[]
  description?: string
}

export const BRAND = {
  name: 'NEXORA',
  sub: 'REAL ESTATE',
  tagline: 'A Better Tomorrow Lives Here',
  motto: 'Dream · Invest · Belong',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  hours: 'Mon - Sat, 9 AM - 7 PM',
  email: 'info@nexora.com',
  address: '123, Horizon Tower, Mumbai, India',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  ],
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Properties', href: '#properties' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Locations', href: '#locations' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const

export const HERO_STATS = [
  { value: 250, suffix: '+', label: 'Premium Properties' },
  { value: 15, suffix: '+', label: 'Cities' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
]

export const HERO_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop',
  thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
  story:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  about:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1800&auto=format&fit=crop',
}

export const PROPERTIES: Property[] = [
  {
    id: 'oceanview-villa',
    name: 'Oceanview Villa',
    location: 'Goa, India',
    city: 'Goa',
    price: '₹8.50 Cr',
    priceValue: 8.5,
    beds: 5,
    baths: 5,
    area: '6,200 sq ft',
    type: 'Villas',
    badge: 'Featured',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A clifftop contemporary villa with an infinity edge pool, private beach access and panoramic sunset views over the Arabian Sea.',
  },
  {
    id: 'skyline-apartment',
    name: 'Skyline Apartment',
    location: 'Mumbai, India',
    city: 'Mumbai',
    price: '₹3.20 Cr',
    priceValue: 3.2,
    beds: 3,
    baths: 3,
    area: '2,400 sq ft',
    type: 'Apartments',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Floor-to-ceiling glass, skyline views of the Worli sea link and five-star building amenities in the heart of South Mumbai.',
  },
  {
    id: 'the-palms-villa',
    name: 'The Palms Villa',
    location: 'Bangalore, India',
    city: 'Bangalore',
    price: '₹6.75 Cr',
    priceValue: 6.75,
    beds: 4,
    baths: 4,
    area: '5,000 sq ft',
    type: 'Villas',
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A palm-lined garden estate minutes from the tech corridor — courtyard pool, home theatre and a certified smart-home stack.',
  },
  {
    id: 'elite-penthouse',
    name: 'Elite Penthouse',
    location: 'Delhi, India',
    city: 'Delhi',
    price: '₹12.00 Cr',
    priceValue: 12,
    beds: 4,
    baths: 5,
    area: '7,800 sq ft',
    type: 'Penthouses',
    badge: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'A duplex penthouse crowning Lutyens Delhi — private terrace lounge, outdoor fireplace and concierge-served grand living.',
  },
  {
    id: 'marina-commercial',
    name: 'Marina Trade Tower',
    location: 'Mumbai, India',
    city: 'Mumbai',
    price: '₹22.00 Cr',
    priceValue: 22,
    beds: 0,
    baths: 6,
    area: '14,500 sq ft',
    type: 'Commercial',
    badge: 'Featured',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Grade-A waterfront office floor with dedicated sky lobby, 100% power backup and LEED Gold certification.',
  },
  {
    id: 'riverfront-estate-land',
    name: 'Riverfront Estate Parcel',
    location: 'Pune, India',
    city: 'Pune',
    price: '₹4.80 Cr',
    priceValue: 4.8,
    beds: 0,
    baths: 0,
    area: '1.2 acres',
    type: 'Land',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Riverside gated parcel with clear NA title, 60ft access road and approved plans for a bespoke villa compound.',
  },
  {
    id: 'aurora-sky-villa',
    name: 'Aurora Sky Villa',
    location: 'Bangalore, India',
    city: 'Bangalore',
    price: '₹9.25 Cr',
    priceValue: 9.25,
    beds: 5,
    baths: 5,
    area: '6,800 sq ft',
    type: 'Villas',
    badge: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Hillside villa wrapped in glass and teak — floating decks, lap pool and a sunrise yoga pavilion above the Nandi valley.',
  },
  {
    id: 'celeste-heights',
    name: 'Celeste Heights',
    location: 'Pune, India',
    city: 'Pune',
    price: '₹2.90 Cr',
    priceValue: 2.9,
    beds: 3,
    baths: 3,
    area: '2,150 sq ft',
    type: 'Apartments',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Sunlit 3-bed residences with sky gardens, co-working lounge and a rooftop infinity deck over the Mula river.',
  },
]

export const PROPERTY_CATEGORIES = ['All', 'Villas', 'Apartments', 'Penthouses', 'Commercial', 'Land']

export const BEDROOM_OPTS = ['2+', '3+', '4+', '5+']

export const CITIES = ['All Locations', 'Mumbai', 'Goa', 'Bangalore', 'Delhi', 'Pune']

export const PRICE_RANGES = ['Any Budget', 'Under ₹3 Cr', '₹3 - 7 Cr', '₹7 - 12 Cr', '₹12 Cr+']

export const SERVICES = [
  {
    id: 'buy',
    title: 'Buy Property',
    desc: 'Find your perfect home from verified listings.',
    icon: 'home',
  },
  {
    id: 'sell',
    title: 'Sell Property',
    desc: 'Get the best value with expert guidance.',
    icon: 'tag',
  },
  {
    id: 'invest',
    title: 'Real Estate Investment',
    desc: 'Grow your wealth with smart investments.',
    icon: 'chart',
  },
  {
    id: 'rent',
    title: 'Rental Services',
    desc: 'Quality rentals for a better tomorrow.',
    icon: 'handshake',
  },
  {
    id: 'consult',
    title: 'Property Consultation',
    desc: 'Personalized advice from industry experts.',
    icon: 'users',
  },
]

export const STEPS = [
  {
    num: '01',
    title: 'Search',
    desc: 'Explore verified properties that match your needs.',
    icon: 'search',
  },
  {
    num: '02',
    title: 'Visit',
    desc: 'Schedule a visit and experience the property in person.',
    icon: 'calendar',
  },
  {
    num: '03',
    title: 'Finalize',
    desc: 'Get expert assistance with legal and financial paperwork.',
    icon: 'document',
  },
  {
    num: '04',
    title: 'Move In',
    desc: 'Complete the process and step into your new beginning.',
    icon: 'key',
  },
]

export const VALUES = [
  { title: 'Client First', desc: 'Your goals are our priority in every step.', icon: 'diamond' },
  { title: 'Sustainable Living', desc: 'We build for a greener and healthier future.', icon: 'leaf' },
  { title: 'Trusted Expertise', desc: 'Years of experience you can rely on.', icon: 'shield' },
  { title: 'A Better Community', desc: 'Creating spaces that bring people closer.', icon: 'users' },
]

export const AMENITIES = [
  {
    title: 'Infinity Pool',
    desc: 'Relax. Rejuvenate. Repeat.',
    icon: 'pool',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Modern Gym',
    desc: 'Fitness for a better you.',
    icon: 'gym',
    image:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Club House',
    desc: 'Unwind with your community.',
    icon: 'club',
    image:
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Rooftop Garden',
    desc: 'Closer to nature, higher in life.',
    icon: 'leaf',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      'Nexora made our home buying journey so smooth. The entire team was professional, transparent, and truly cared about our needs.',
    name: 'Rahul Mehta',
    location: 'Mumbai, India',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    quote:
      'From the first visit to the final handover, everything was seamless. We could not be happier with our new home.',
    name: 'Priya Sharma',
    location: 'Bangalore, India',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  },
  {
    quote:
      'A trustworthy brand with exceptional properties. Nexora does not just sell homes, they build communities.',
    name: 'Aman Verma',
    location: 'Delhi, India',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    quote:
      'Their investment advisory team found us a commercial asset that outperformed every projection. Truly expert guidance.',
    name: 'Sana Kapoor',
    location: 'Goa, India',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
  },
]

export const LOCATIONS = [
  {
    city: 'Mumbai',
    tagline: 'The City of Opportunities',
    desc: 'Sea-facing towers, star-rated amenities and unmatched career proximity.',
    tags: ['Luxury Living', 'Business Hub', 'High ROI'],
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1400&auto=format&fit=crop',
    x: 27,
    y: 47,
    count: 82,
  },
  {
    city: 'Bangalore',
    tagline: 'Where Innovation Lives',
    desc: 'Garden-city villas and smart homes minutes from the tech corridor.',
    tags: ['Tech Hub', 'Modern Lifestyle', 'Green Spaces'],
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1400&auto=format&fit=crop',
    x: 47,
    y: 77,
    count: 64,
  },
  {
    city: 'Pune',
    tagline: 'A Perfect Balance',
    desc: 'Riverside living with mountain backdrops and rising rental yields.',
    tags: ['Great Connectivity', 'Growing Demand', 'Vibrant Culture'],
    image:
      'https://images.unsplash.com/photo-1624372635310-01d07dc167a1?q=80&w=1400&auto=format&fit=crop',
    x: 31,
    y: 56,
    count: 47,
  },
  {
    city: 'Delhi',
    tagline: 'Heritage Meets Modernity',
    desc: 'Grand boulevards, builder floors and ultra-luxury penthouses.',
    tags: ['Prime Location', 'Excellent Connectivity', 'Endless Possibilities'],
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1400&auto=format&fit=crop',
    x: 39,
    y: 24,
    count: 71,
  },
]
