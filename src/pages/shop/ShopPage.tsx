import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { naira, shopApi, type Product } from '../../lib/maxhub'

function ShopPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const [q, setQ] = useState(params.get('q') || '')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let live = true
    setState('loading')
    shopApi.products({ category, q: params.get('q') || '' })
      .then((r) => { if (!live) return; setProducts(r.data); setCategories(r.categories); setState('ready') })
      .catch(() => live && setState('error'))
    return () => { live = false }
  }, [category, params])

  const featured = useMemo(() => products.filter((p) => p.featured), [products])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (q.trim()) next.set('q', q.trim()); else next.delete('q')
    setParams(next)
  }

  return (
    <section className="page-section page-top-gap shop">
      <div className="section-heading">
        <p className="eyebrow">Shop</p>
        <h1>Handmade pieces, ready to wear</h1>
        <p className="intro">Every piece is made by hand in our Ikorodu studio. Order online and we deliver across Lagos and Nigeria, or pick up from us.</p>
      </div>

      <div className="shop-toolbar">
        <div className="shop-chips" role="tablist" aria-label="Categories">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => setParams(new URLSearchParams())}>All</button>
          {categories.map((c) => (
            <button key={c.name} className={category === c.name ? 'chip active' : 'chip'} onClick={() => setParams(new URLSearchParams({ category: c.name }))}>
              {c.name} <span>{c.count}</span>
            </button>
          ))}
        </div>
        <form onSubmit={search} className="shop-search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search colour, material…" aria-label="Search the shop" />
        </form>
      </div>

      {state === 'loading' && <div className="shop-grid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="product-card skeleton" />)}</div>}
      {state === 'error' && <p className="shop-empty">We couldn't load the shop just now. Please refresh, or <Link to="/contact">contact us</Link> to order.</p>}
      {state === 'ready' && !products.length && <p className="shop-empty">No pieces here yet — check back soon, or <Link to="/contact">ask us for a custom design</Link>.</p>}

      {state === 'ready' && !category && !params.get('q') && featured.length > 0 && (
        <>
          <h2 className="shop-subhead">Featured</h2>
          <div className="shop-grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          <h2 className="shop-subhead">All pieces</h2>
        </>
      )}
      {state === 'ready' && products.length > 0 && (
        <div className="shop-grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </section>
  )
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/shop/${p.slug}`} className="product-card">
      <div className="product-photo">
        {p.images[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : <div className="photo-empty">BeadMax</div>}
        {!p.inStock && <span className="badge sold">Sold out</span>}
        {p.inStock && p.compareAtPrice && p.compareAtPrice > p.price && <span className="badge sale">Sale</span>}
      </div>
      <div className="product-info">
        <p className="product-cat">{p.category}</p>
        <h3>{p.name}</h3>
        <p className="product-price">
          {naira(p.price)}
          {p.compareAtPrice && p.compareAtPrice > p.price && <s>{naira(p.compareAtPrice)}</s>}
        </p>
      </div>
    </Link>
  )
}

export default ShopPage
