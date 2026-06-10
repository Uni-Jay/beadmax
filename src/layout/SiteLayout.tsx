import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CustomerChatbot from '../components/CustomerChatbot'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="site-shell">
      <div className="ambient-glow ambient-left" aria-hidden="true"></div>
      <div className="ambient-glow ambient-right" aria-hidden="true"></div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CustomerChatbot />
    </div>
  )
}

export default SiteLayout
