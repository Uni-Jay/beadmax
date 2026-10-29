import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cart, naira, shopApi, type Product } from '../../lib/maxhub'

function ProductPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setP(null); setError(''); setPhoto(0); setQty(1)
    shopApi.product(slug).then(setP).catch((e) => setError(e.message))
  }, [slug])

  if (error) return <section className="page-section page-top-gap shop"><p className="shop-empty">{error}. <Link to="/shop">Back to the shop</Link></p></section>
  if (!p) return <section className="page-section page-top-gap shop"><div className="product-detail skeleton-detail" /></section>

  const max = p.madeToOrder ? 20 : Math.max(0, p.stock)
  const add = (go?: boolean) => {
    cart.add(p, qty)
    if (go) navigate('/cart')
    else { setAdded(true); setTimeout(() => setAdded(false), 2500) }
  }

  return (
    <section className="page-section page-top-gap shop">
      <nav className="crumbs"><Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(p.category)}`}>{p.category}</Link></nav>
      <div className="product-detail">
        <div className="gallery">
          <div className="gallery-main">
            {p.images[photo] ? <img src={p.images[photo]} alt={p.name} /> : <div className="photo-empty">BeadMax</div>}
          </div>
          {p.images.length > 1 && (
            <div className="gallery-thumbs">
              {p.images.map((u, i) => (
                <button key={u} onClick={() => setPhoto(i)} className={i === photo ? 'active' : ''} aria-label={`Photo ${i + 1}`}><img src={u} alt="" /></button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <p className="product-cat">{p.category}</p>
          <h1 className="detail-title">{p.name}</h1>
          <p className="detail-price">
            {naira(p.price)}
            {p.compareAtPrice && p.compareAtPrice > p.price && <s>{naira(p.compareAtPrice)}</s>}
          </p>
          {p.description && <p className="detail-desc">{p.description}</p>}
          <dl className="detail-specs">
            {p.material && <><dt>Material</dt><dd>{p.material}</dd></>}
            {p.colour && <><dt>Colour</dt><dd>{p.colour}</dd></>}
            {p.size && <><dt>Size</dt><dd>{p.size}</dd></>}
            <dt>Availability</dt>
            <dd>{p.stock > 0 ? (p.stock <= 3 ? `Only ${p.stock} left` : 'In stock') : p.madeToOrder ? `Made to order${p.leadTimeDays ? ` — about ${p.leadTimeDays} days` : ''}` : 'Sold out'}</dd>
          </dl>

          {max > 0 ? (
            <>
              <div className="qty-row">
                <span>Quantity</span>
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Less">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="More">+</button>
                </div>
              </div>
              <div className="button-row left">
                <button className="btn-solid" onClick={() => add(true)}>Buy now</button>
                <button className="btn-outline" onClick={() => add()}>{added ? 'Added to basket ✓' : 'Add to basket'}</button>
              </div>
            </>
          ) : (
            <div className="button-row left"><Link className="btn-solid" to="/contact">Ask us to make one</Link></div>
          )}
          <p className="detail-note">Delivery across Lagos and Nigeria · Pick-up from our Ikorodu studio · Questions? <Link to="/contact">Talk to us</Link></p>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
