import { useEffect, useState } from 'react'
import { contactInfo } from '../data/siteContent'

type BagImage = {
  src: string
  alt: string
  name: string
  category: string
}

type BagCarouselProps = {
  title: string
  subtitle: string
  items: BagImage[]
}

function BagCarousel({ title, subtitle, items }: BagCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const visibleItems =
    activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory)

  useEffect(() => {
    if (visibleItems.length <= 1 || paused || lightboxOpen) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleItems.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [visibleItems.length, paused, lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  if (!visibleItems.length) return null

  const current = visibleItems[activeIndex]
  const whatsappText = encodeURIComponent(
    `Hello BeadMax Design, I want to order this bag: ${current.name} (${current.category}).`,
  )
  const whatsappUrl = `https://wa.me/${contactInfo.whatsappNumber.replace('+', '')}?text=${whatsappText}`

  return (
    <section
      className="bag-carousel"
      aria-label="BeadMax bags carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="section-heading">
        <p className="eyebrow">Bag Collection</p>
        <h2>{title}</h2>
        <p className="intro">{subtitle}</p>
      </div>

      <div className="bag-filters" role="tablist" aria-label="Filter bag categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={activeCategory === category ? 'filter-active' : ''}
            onClick={() => {
              setActiveCategory(category)
              setActiveIndex(0)
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="carousel-stage">
        <figure className="carousel-main-frame">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="carousel-main-image"
            onClick={() => setLightboxOpen(true)}
          />
        </figure>

        <aside className="carousel-side-panel">
          <h3>{current.name}</h3>
          <p className="bag-meta">Category: {current.category}</p>
          <p>
            This gallery auto-slides through our handcrafted bags. Hover to pause and use controls
            to explore each style.
          </p>
          <div className="carousel-actions">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((activeIndex - 1 + visibleItems.length) % visibleItems.length)
              }
              aria-label="Show previous bag"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % visibleItems.length)}
              aria-label="Show next bag"
            >
              Next
            </button>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-order-btn">
            Order This Bag on WhatsApp
          </a>
          <button type="button" className="lightbox-open-btn" onClick={() => setLightboxOpen(true)}>
            View Fullscreen
          </button>
        </aside>
      </div>

      <div className="carousel-thumbs" role="tablist" aria-label="Bag gallery thumbnails">
        {visibleItems.map((item, index) => (
          <button
            type="button"
            key={item.src}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? 'thumb-active' : ''}
            aria-label={`Show bag ${index + 1}`}
            aria-selected={index === activeIndex}
          >
            <img src={item.src} alt={item.alt} />
          </button>
        ))}
      </div>

      {lightboxOpen ? (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Bag image preview">
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close preview"
          >
            Close
          </button>
          <img src={current.src} alt={current.alt} className="lightbox-image" />
        </div>
      ) : null}
    </section>
  )
}

export default BagCarousel
