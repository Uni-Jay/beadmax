import { NavLink } from 'react-router-dom'
import { navLinks } from '../data/siteContent'
import logo from '../assets/images/beadmaxlogo.jpeg'

function Navbar() {
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
      </nav>
    </header>
  )
}

export default Navbar
