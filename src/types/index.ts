// ============================================================
// C1PH3R FSOCIETY — Core Type Definitions
// ============================================================

// --- Products ---
export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  long_description?: string
  price: number          // USD
  price_inr?: number     // INR (for Razorpay)
  compare_at_price?: number
  images: string[]
  category: ProductCategory
  tags: string[]
  stock: number
  sku: string
  weight_grams?: number
  specs?: Record<string, string>
  features?: string[]
  legal_disclaimer?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type ProductCategory =
  | 'ble-tools'
  | 'wifi-tools'
  | 'rf-tools'
  | 'multi-tools'
  | 'educational'
  | 'accessories'

// --- Orders ---
export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentProvider = 'paypal' | 'razorpay'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product: Product
  quantity: number
  unit_price: number
  total_price: number
}

export interface ShippingAddress {
  full_name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

export interface Order {
  id: string
  order_number: string
  customer_id?: string
  customer_email: string
  customer_name: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: 'USD' | 'INR'
  status: OrderStatus
  payment_status: PaymentStatus
  payment_provider?: PaymentProvider
  payment_id?: string
  coupon_code?: string
  shipping_address: ShippingAddress
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

// --- Cart ---
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  coupon?: Coupon
}

// --- Coupons ---
export type CouponType = 'percentage' | 'fixed'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  min_order?: number
  max_uses?: number
  uses: number
  expires_at?: string
  is_active: boolean
}

// --- Customers ---
export interface Customer {
  id: string
  email: string
  full_name: string
  phone?: string
  orders_count: number
  total_spent: number
  created_at: string
  last_order_at?: string
}

// --- Blog ---
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  author: string
  tags: string[]
  categories: string[]
  is_published: boolean
  published_at?: string
  reading_time?: number
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
}

// --- Research Projects ---
export interface ResearchProject {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  images: string[]
  video_url?: string
  github_url?: string
  tags: string[]
  category: ResearchCategory
  status: 'ongoing' | 'completed' | 'published'
  published_at?: string
  created_at: string
}

export type ResearchCategory =
  | 'ble-security'
  | 'wifi-security'
  | 'rf-research'
  | 'embedded-systems'
  | 'robotics'
  | 'educational'

// --- Speaking ---
export interface SpeakingEvent {
  id: string
  title: string
  event_name: string
  event_type: 'conference' | 'workshop' | 'webinar' | 'podcast' | 'demo'
  date: string
  location?: string
  is_online: boolean
  description: string
  video_url?: string
  slides_url?: string
  event_url?: string
  cover_image?: string
  tags: string[]
  created_at: string
}

// --- Media ---
export interface MediaItem {
  id: string
  title: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  description?: string
  category: MediaCategory
  tags: string[]
  created_at: string
}

export type MediaCategory =
  | 'conference'
  | 'workshop'
  | 'product'
  | 'research'
  | 'demo'
  | 'misc'

// --- Contact ---
export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  inquiry_type: 'general' | 'business' | 'speaking' | 'support' | 'wholesale'
  is_read: boolean
  created_at: string
}

// --- Site Settings ---
export interface SiteSettings {
  site_name: string
  tagline: string
  description: string
  contact_email: string
  contact_phone?: string
  address?: string
  instagram_url?: string
  github_url?: string
  twitter_url?: string
  linkedin_url?: string
  youtube_url?: string
  upi_id?: string
  razorpay_enabled: boolean
  paypal_enabled: boolean
  maintenance_mode: boolean
  announcement_banner?: string
  banner_enabled: boolean
}

// --- Admin ---
export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'editor'
  name: string
  created_at: string
}

// --- API Responses ---
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// --- Shipping ---
export interface ShippingRate {
  id: string
  name: string
  carrier: string
  estimated_days: string
  price: number
  currency: 'USD' | 'INR'
  countries: string[]   // ISO codes, ['*'] = worldwide
}
