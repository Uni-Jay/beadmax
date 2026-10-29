import { useSyncExternalStore } from 'react'
import { NavLink } from 'react-router-dom'
import { cart } from '../lib/maxhub'
import { navLinks } from '../data/siteContent'
import logo from '../assets/images/beadmaxlogo.jpeg'

function Navbar() {
  const count = useSyncExternalStore(cart.subscribe, () => cart.count(), () => 0)
  return (
    <header className="site-header">
      <NavLink to="/" className="brand-lockup" aria-label="Go to BeadMax Design homepage">
        <img src={logo} alt="BeadMax Design" className="brand-mark" />
        <div>
          <p className="brand-name">BeadMax Design</p>
          <p className="brand-tag">Beads • Beauty • Creativity</p>
        </div>
      </NavLink>

      <nav aria-label="Main navigation" className="main-nav">
        {navLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/cart" className={({ isActive }) => `cart-link${isActive ? ' active-link' : ''}`} aria-label={`Basket, ${count} item${count === 1 ? '' : 's'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          {count > 0 && <span className="cart-count">{count}</span>}
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
