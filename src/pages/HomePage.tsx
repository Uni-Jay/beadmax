import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BagCarousel from '../components/BagCarousel'
import logo from '../assets/images/beadmaxlogo.jpeg'
import heroVideo from '../assets/video/beadmaxvideo.mp4'
import { bagCollection, services, trainingTracks } from '../data/siteContent'

function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const unmute = () => {
      const video = heroVideoRef.current
      if (video) {
        video.muted = false
      }
      window.removeEventListener('scroll', unmute)
      window.removeEventListener('click', unmute)
      window.removeEventListener('keydown', unmute)
      window.removeEventListener('touchstart', unmute)
    }

    window.addEventListener('scroll', unmute, { passive: true })
    window.addEventListener('click', unmute)
    window.addEventListener('keydown', unmute)
    window.addEventListener('touchstart', unmute, { passive: true })

    return () => {
      window.removeEventListener('scroll', unmute)
      window.removeEventListener('click', unmute)
      window.removeEventListener('keydown', unmute)
      window.removeEventListener('touchstart', unmute)
    }
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="hero-panel">
          <video
            ref={heroVideoRef}
            className="hero-video"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <img src={logo} alt="BeadMax Design logo" className="hero-logo" />
            <p className="eyebrow">Ikorodu, Lagos • Local and International Delivery</p>
            <h1>Luxury Craftsmanship in Beads and Design</h1>
            <p className="intro">
              BeadMax creates statement jewelry and premium beaded bags inspired by timeless
              elegance, while raising future creators through Beadmax Vocational School.
            </p>
            <div className="button-row">
              <Link to="/services" className="btn-solid">
                Explore Services
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">What We Do</p>
          <h2>Designed For Style, Built For Value</h2>
        </div>
        <div className="feature-grid">
          {services.slice(0, 3).map((service) => (
            <article key={service.title} className="glass-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span>{service.highlight}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="stats-strip" aria-label="Company strengths">
          <article>
            <h3>Custom Craft</h3>
            <p>Tailored designs for personal and event styling.</p>
          </article>
          <article>
            <h3>Global Reach</h3>
            <p>Reliable local and international fulfillment support.</p>
          </article>
          <article>
            <h3>Vocational Impact</h3>
            <p>Practical training for creators at Beadmax Vocational School.</p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <BagCarousel
          title="Signature Beaded Bag Showcase"
          subtitle="A rotating preview of selected handcrafted pieces from our collection."
          items={bagCollection}
        />
      </section>

      <section className="page-section accent-surface">
        <div className="section-heading">
          <p className="eyebrow">Beadmax Vocational School</p>
          <h2>Practical Creative Training</h2>
        </div>
        <ul className="track-grid">
          {trainingTracks.map((track) => (
            <li key={track}>{track}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default HomePage
