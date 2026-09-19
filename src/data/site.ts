export const BRAND = {
  name: 'SAVORÉ',
  sub: 'RESTAURANT',
  tagline: 'Good Food. Good People. Great Memories.',
  motto: 'Good Food Brings People Together',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  hours: 'Mon - Sun, 11:00 AM - 11:00 PM',
  email: 'hello@savore.in',
  emailHref: 'mailto:hello@savore.in',
  address: '123 Food Street, Jaipur, India',
  mapAddress: '123 Food Street, Jaipur, India',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
    { label: 'Google Maps', href: 'https://maps.google.com', icon: 'pin' },
  ],
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reservation', href: '#reservation' },
  { label: 'Contact', href: '#contact' },
] as const

export const EXPERIENCE_PILLARS = [
  {
    eyebrow: 'Expert Chefs',
    title: 'Passionate culinary professionals',
    desc: 'Trained. Passionate. Creative.',
    icon: 'chef',
  },
  {
    eyebrow: 'Fresh Ingredients',
    title: 'Locally sourced, seasonal, and pure',
    desc: 'Sourced with care, for better taste.',
    icon: 'leaf',
  },
  {
    eyebrow: 'Memorable Experience',
    title: 'Great food, warm ambience, always',
    desc: 'Food, ambience, and people that stay with you.',
    icon: 'heart',
  },
  {
    eyebrow: 'Exceptional Quality',
    title: 'A fine dining experience like no other',
    desc: 'A promise we make with every plate.',
    icon: 'star',
  },
] as const

export const STATS = [
  { value: 5, suffix: '+', label: 'Expert Chefs' },
  { value: 100, suffix: '%', label: 'Fresh Ingredients' },
  { value: 10, suffix: 'K+', label: 'Happy Guests' },
  { value: 4.8, suffix: '', label: 'Average Rating' },
] as const

export const MENU_CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'] as const

export interface MenuItem {
  id: string
  category: (typeof MENU_CATEGORIES)[number]
  name: string
  description: string
  price: string
  rating: number
  image: string
  badge?: string
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'classic-bruschetta',
    category: 'Starters',
    name: 'Classic Bruschetta',
    description: 'Grilled bread, fresh tomatoes, basil, olive oil.',
    price: '₹ 320',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1572695157369-5aff6a24e392?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'truffle-alfredo-pasta',
    category: 'Main Course',
    name: 'Truffle Alfredo Pasta',
    description: 'Creamy sauce, truffle oil, parmesan.',
    price: '₹ 520',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'grilled-salmon',
    category: 'Main Course',
    name: 'Grilled Salmon',
    description: 'Fresh salmon, seasonal vegetables, lemon butter sauce.',
    price: '₹ 780',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'herb-crusted-lamb',
    category: 'Main Course',
    name: 'Herb Crusted Lamb',
    description: 'Tender lamb, herbs, roasted veggies, red wine reduction.',
    price: '₹ 820',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'chocolate-lava-cake',
    category: 'Desserts',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate, warm center, vanilla ice cream.',
    price: '₹ 380',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'classic-tiramisu',
    category: 'Desserts',
    name: 'Classic Tiramisu',
    description: 'Layers of coffee, mascarpone, and love.',
    price: '₹ 420',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'signature-mocktail',
    category: 'Beverages',
    name: 'Signature Mocktail',
    description: 'A refreshing blend of fruits and herbs.',
    price: '₹ 280',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1536935338309-003b851b7b11?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'artisan-coffee',
    category: 'Beverages',
    name: 'Artisan Coffee',
    description: 'Freshly brewed, perfectly crafted.',
    price: '₹ 220',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
  },
]

export const GALLERY_CATEGORIES = ['All', 'Ambience', 'Food', 'Drinks', 'People', 'Events'] as const

export interface GalleryImage {
  id: string
  category: (typeof GALLERY_CATEGORIES)[number]
  title: string
  src: string
  alt: string
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'gallery-ambience-1',
    category: 'Ambience',
    title: 'Candlelit Tables',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    alt: 'Warmly lit restaurant table with wine glasses and a lit candle',
  },
  {
    id: 'gallery-food-1',
    category: 'Food',
    title: 'Plated Excellence',
    src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    alt: 'Gourmet plated dish garnished with microgreens',
  },
  {
    id: 'gallery-drinks-1',
    category: 'Drinks',
    title: 'Signature Cocktail',
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Red cocktail in a crystal glass with fruit garnish',
  },
  {
    id: 'gallery-people-1',
    category: 'People',
    title: 'Chef at Work',
    src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Chef plating food with precision',
  },
  {
    id: 'gallery-events-1',
    category: 'Events',
    title: 'Celebrations',
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
    alt: 'Elegant celebration table setting',
  },
  {
    id: 'gallery-ambience-2',
    category: 'Ambience',
    title: 'Evening Warmth',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    alt: 'Dimly lit restaurant interior with pendant lamps',
  },
  {
    id: 'gallery-food-2',
    category: 'Food',
    title: 'Grilled Salmon',
    src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop',
    alt: 'Grilled salmon fillet with cherry tomatoes',
  },
  {
    id: 'gallery-drinks-2',
    category: 'Drinks',
    title: 'Red Wine Pour',
    src: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?q=80&w=1200&auto=format&fit=crop',
    alt: 'Glass of red wine being poured',
  },
]

export interface Testimonial {
  quote: string
  name: string
  guestType: string
  rating: number
  avatar: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'An unforgettable dining experience! The food, ambience and service were simply perfect.',
    name: 'Aarav Mehta',
    guestType: 'Food Lover',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    quote: 'SAVORÉ is my go-to place for every special occasion. The flavours are exceptional!',
    name: 'Priya Sharma',
    guestType: 'Regular Guest',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  },
  {
    quote: 'Beautiful ambience, delicious food and amazing service. Truly a gem in the city!',
    name: 'Rohan Verma',
    guestType: 'Travel Blogger',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
]

export const CHEW_PHILOSOPHY = {
  title: 'Simple Ingredients. Extraordinary Flavours.',
  body: "We believe in honest food, crafted with care, respect for ingredients, and a drive to create unforgettable dining experiences.",
}

export const NEWSLETTER_CONFIRM = 'Thank you — you\'re on the list.'
