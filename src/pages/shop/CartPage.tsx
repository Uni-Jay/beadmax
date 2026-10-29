import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { cart, naira, shopApi } from '../../lib/maxhub'

const STATES = ['Lagos', 'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara']

type Done = Awaited<ReturnType<typeof shopApi.placeOrder>>

function CartPage() {
  const raw = useSyncExternalStore(cart.subscribe, () => localStorage.getItem('beadmax-cart') || '[]', () => '[]')
  const lines = JSON.parse(raw) as ReturnType<typeof cart.read>
  const [fees, setFees] = useState<Record<string, number>>({ Lagos: 3000, 'Other states': 6000 })
  const [f, setF] = useState({ name: '', phone: '', email: '', deliveryMethod: 'Delivery', state: 'Lagos', city: '', address: '', paymentMethod: 'Bank transfer', note: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<Done | null>(null)

  useEffect(() => { shopApi.settings().then((s) => setFees(s.deliveryFees)).catch(() => undefined) }, [])

  const subtotal = lines.reduce((t, l) => t + l.price * l.qty, 0)
  const delivery = f.deliveryMethod === 'Pick-up' ? 0 : /lagos/i.test(f.state) ? fees.Lagos || 0 : fees['Other states'] || 0
  const set = (patch: Partial<typeof f>) => setF({ ...f, ...patch })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const r = await shopApi.placeOrder({ ...f, items: lines.map((l) => ({ productId: l.productId, qty: l.qty })) })
      cart.clear()
      setDone(r)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError((err as Error).message)
    } finally { setBusy(false) }
  }

  if (done) {
    return (
      <section className="page-section page-top-gap shop">
        <div className="order-done">
          <p className="eyebrow">Thank you</p>
          <h1>Order {done.code} received</h1>
          <p className="intro">We will call or WhatsApp you shortly to confirm. {f.email && 'A copy has been sent to your email.'}</p>
          <p className="done-total">Total: <b>{naira(done.total)}</b></p>
          {done.paymentMethod === 'Bank transfer' && done.bank && (
            <div className="bank-box">
              <p>Please pay by transfer to:</p>
              <p><b>{done.bank.bankName}</b><br />{done.bank.accountName}<br /><b className="acct">{done.bank.accountNumber}</b></p>
              <p>Use <b>{done.code}</b> as the reference.</p>
            </div>
          )}
          <div className="button-row">
            <Link className="btn-solid" to={`/track-order?code=${done.code}`}>Track this order</Link>
            <Link className="btn-outline" to="/shop">Keep shopping</Link>
          </div>
        </div>
      </section>
    )
  }

  if (!lines.length) {
    return (
      <section className="page-section page-top-gap shop">
        <div className="order-done">
          <h1>Your basket is empty</h1>
          <p className="intro">Browse our handmade bags and jewellery.</p>
          <div className="button-row"><Link className="btn-solid" to="/shop">Go to the shop</Link></div>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section page-top-gap shop">
      <div className="section-heading"><p className="eyebrow">Checkout</p><h1>Your basket</h1></div>
      <div className="checkout">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Your details</h2>
          <div className="field-grid">
            <label>Full name<input required value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" /></label>
            <label>Phone / WhatsApp<input required value={f.phone} onChange={(e) => set({ phone: e.target.value })} inputMode="tel" autoComplete="tel" /></label>
            <label className="span-2">Email (for your receipt)<input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /></label>
          </div>
          <h2>Delivery</h2>
          <div className="segmented">
            {['Delivery', 'Pick-up'].map((m) => <button type="button" key={m} className={f.deliveryMethod === m ? 'active' : ''} onClick={() => set({ deliveryMethod: m })}>{m === 'Pick-up' ? 'Pick up in Ikorodu' : 'Deliver to me'}</button>)}
          </div>
          {f.deliveryMethod === 'Delivery' && (
            <div className="field-grid">
              <label>State<select value={f.state} onChange={(e) => set({ state: e.target.value })}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label>City / area<input required value={f.city} onChange={(e) => set({ city: e.target.value })} /></label>
              <label className="span-2">Address<textarea required rows={2} value={f.address} onChange={(e) => set({ address: e.target.value })} autoComplete="street-address" /></label>
            </div>
          )}
          <h2>Payment</h2>
          <div className="segmented">
            <button type="button" className={f.paymentMethod === 'Bank transfer' ? 'active' : ''} onClick={() => set({ paymentMethod: 'Bank transfer' })}>Bank transfer</button>
            {(f.deliveryMethod === 'Pick-up' || /lagos/i.test(f.state)) && (
              <button type="button" className={f.paymentMethod === 'Pay on delivery' ? 'active' : ''} onClick={() => set({ paymentMethod: 'Pay on delivery' })}>{f.deliveryMethod === 'Pick-up' ? 'Pay at pick-up' : 'Pay on delivery'}</button>
            )}
          </div>
          <label className="block">Note for us (optional)<textarea rows={2} value={f.note} onChange={(e) => set({ note: e.target.value })} placeholder="Colour preferences, gift message…" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn-solid wide" disabled={busy}>{busy ? 'Placing your order…' : `Place order · ${naira(subtotal + delivery)}`}</button>
        </form>

        <aside className="summary">
          <h2>Order summary</h2>
          {lines.map((l) => (
            <div key={l.productId} className="summary-line">
              {l.image ? <img src={l.image} alt="" /> : <div className="thumb-empty" />}
              <div className="summary-name">
                <Link to={`/shop/${l.slug}`}>{l.name}</Link>
                <div className="qty small">
                  <button type="button" onClick={() => cart.setQty(l.productId, l.qty - 1)} aria-label="Less">−</button>
                  <span>{l.qty}</span>
                  <button type="button" onClick={() => cart.setQty(l.productId, l.qty + 1)} aria-label="More">+</button>
                  <button type="button" className="link" onClick={() => cart.remove(l.productId)}>Remove</button>
                </div>
              </div>
              <b>{naira(l.price * l.qty)}</b>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>{delivery ? naira(delivery) : 'Free'}</span></div>
          <div className="summary-row total"><span>Total</span><span>{naira(subtotal + delivery)}</span></div>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
