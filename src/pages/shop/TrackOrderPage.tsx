import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { naira, shopApi } from '../../lib/maxhub'

type Tracked = Awaited<ReturnType<typeof shopApi.track>>

function TrackOrderPage() {
  const [params] = useSearchParams()
  const [code, setCode] = useState(params.get('code') || '')
  const [contact, setContact] = useState('')
  const [order, setOrder] = useState<Tracked | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setOrder(null)
    try { setOrder(await shopApi.track(code.trim(), contact.trim())) } catch (err) { setError((err as Error).message) } finally { setBusy(false) }
  }

  const at = order ? (order.stage === 'Cancelled' ? -1 : order.stages.indexOf(order.stage)) : -1

  return (
    <section className="page-section page-top-gap shop">
      <div className="section-heading"><p className="eyebrow">Orders</p><h1>Track your order</h1><p className="intro">Enter your order number and the phone number or email you used.</p></div>
      <form className="track-form" onSubmit={submit}>
        <input required placeholder="Order number, e.g. BMX-WEB-2026-0001" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <input required placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} />
        <button className="btn-solid" disabled={busy}>{busy ? 'Checking…' : 'Track'}</button>
      </form>
      {error && <p className="form-error center">{error}</p>}
      {order && (
        <div className="track-card">
          <p className="track-head"><b>{order.code}</b> · {naira(order.total)} · {order.paymentStatus === 'Paid' ? 'Paid' : 'Payment pending'}</p>
          {order.stage === 'Cancelled' ? <p className="form-error">This order was cancelled.</p> : (
            <ol className="track-steps">
              {order.stages.map((s, i) => <li key={s} className={i <= at ? 'done' : ''}><span />{s === 'New' ? 'Received' : s}</li>)}
            </ol>
          )}
          {order.trackingNo && <p>Dispatch number: <b>{order.trackingNo}</b></p>}
          <ul className="track-items">{order.items.map((i, k) => <li key={k}>{i.qty} × {i.name}</li>)}</ul>
        </div>
      )}
    </section>
  )
}

export default TrackOrderPage
