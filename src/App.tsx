import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './layout/SiteLayout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import TeamPage from './pages/TeamPage'
import ShopPage from './pages/shop/ShopPage'
import ProductPage from './pages/shop/ProductPage'
import CartPage from './pages/shop/CartPage'
import TrackOrderPage from './pages/shop/TrackOrderPage'
import Careers from './components/Careers'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/careers" element={<div className="page-section page-top-gap" style={{ ['--brand-accent' as string]: '#5b1326' }}><Careers brand="BM" title="Careers at BeadMax" intro="Join our studio and vocational school — designers, trainers, sales and customer care. See our open roles below." /></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
