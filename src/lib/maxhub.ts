/**
 * Live data from MaxHub (BeadMax's company workspace): the shop catalogue,
 * orders and job openings. Products and jobs are managed in MaxHub and
 * appear here automatically.
 */
export const MAXHUB_API: string =
  (import.meta.env.VITE_MAXHUB_API as string | undefined) || 'https://maxhub-backend.onrender.com/api/public'

export interface Product {
  id: number
  code: string
  slug: string
  name: string
  category: string
  description?: string | null
  material?: string | null
  colour?: string | null
  size?: string | null
  unit: string
  price: number
  compareAtPrice?: number | null
  currency: string
  images: string[]
  inStock: boolean
  stock: number
  madeToOrder: boolean
  leadTimeDays?: number | null
  featured: boolean
}

export interface Job {
  code: string
  title: string
  brandName?: string
  description?: string
  jobType?: string
  positions?: number
  location?: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  experience?: string
  qualifications?: string
  skills?: string
  benefits?: string
  postedDate?: string
  closingDate?: string
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MAXHUB_API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body?.success === false) throw new Error(body?.message || 'Something went wrong. Please try again.')
  return body as T
}

export const naira = (n: number) => `₦${Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`

export const shopApi = {
  products: (params: { category?: string; q?: string } = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()
    return call<{ data: Product[]; categories: { name: string; count: number }[] }>(`/shop/beadmax/products${qs ? `?${qs}` : ''}`)
  },
  product: (slug: string) => call<{ data: Product }>(`/shop/beadmax/products/${encodeURIComponent(slug)}`).then((r) => r.data),
  settings: () => call<{ data: { deliveryFees: Record<string, number>; bank: { bankName: string; accountName: string; accountNumber: string } | null; whatsapp?: string; email?: string; paymentMethods: string[] } }>('/shop/beadmax/settings').then((r) => r.data),
  placeOrder: (order: Record<string, unknown>) => call<{ data: { code: string; total: number; deliveryFee: number; paymentMethod: string; bank: { bankName: string; accountName: string; accountNumber: string } | null } }>('/shop/beadmax/orders', { method: 'POST', body: JSON.stringify(order) }).then((r) => r.data),
  track: (code: string, contact: string) => call<{ data: { code: string; stage: string; paymentStatus: string; trackingNo?: string; total: number; items: { name: string; qty: number }[]; placedAt: string; stages: string[] } }>(`/shop/beadmax/orders/${encodeURIComponent(code)}?contact=${encodeURIComponent(contact)}`).then((r) => r.data),
}

export const jobsApi = {
  list: (brand: string) => call<{ data: Job[] }>(`/jobs?brand=${brand}`).then((r) => r.data),
  apply: (code: string, form: Record<string, string>) => call<{ message: string }>(`/jobs/${encodeURIComponent(code)}/apply`, { method: 'POST', body: JSON.stringify(form) }),
}

// ── Basket (kept in this browser) ───────────────────────────────────────────
export interface CartLine { productId: number; slug: string; name: string; price: number; image?: string; qty: number; max: number }
const KEY = 'beadmax-cart'
const listeners = new Set<() => void>()

export const cart = {
  read(): CartLine[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  },
  write(lines: CartLine[]) {
    try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* private mode */ }
    listeners.forEach((l) => l())
  },
  add(p: Product, qty = 1) {
    const lines = cart.read()
    const max = p.madeToOrder ? 20 : Math.max(1, p.stock)
    const found = lines.find((l) => l.productId === p.id)
    if (found) found.qty = Math.min(max, found.qty + qty)
    else lines.push({ productId: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0], qty: Math.min(max, qty), max })
    cart.write(lines)
  },
  setQty(productId: number, qty: number) {
    cart.write(cart.read().map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, Math.min(l.max, qty)) } : l)))
  },
  remove(productId: number) { cart.write(cart.read().filter((l) => l.productId !== productId)) },
  clear() { cart.write([]) },
  count() { return cart.read().reduce((t, l) => t + l.qty, 0) },
  subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn) } },
}
