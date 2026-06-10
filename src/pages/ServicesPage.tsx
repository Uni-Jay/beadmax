import { Link } from 'react-router-dom'
import BagCarousel from '../components/BagCarousel'
import { bagCollection, services } from '../data/siteContent'

const servicePromises = [
  'Premium materials and careful finishing',
  'Clear delivery timelines and updates',
  'Flexible local and international fulfillment',
]

const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    text: 'We understand your style, use case, and product preference.',
  },
  {
    step: '02',
    title: 'Design and Material Selection',
    text: 'We align bead colors, textures, and structure with your concept.',
  },
  {
    step: '03',
    title: 'Production and Delivery',
    text: 'Your order is handcrafted, quality-checked, and delivered safely.',
  },
]

function ServicesPage() {
  return (
    <section className="page-section page-top-gap">
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h1>Professional Creative Services</h1>
        <p className="intro">
          Every order at BeadMax is treated as a design project with clear quality standards and
          dedicated finishing.
        </p>
      </div>

      <div className="feature-grid full-grid">
        {services.map((service) => (
          <article key={service.title} className="glass-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>{service.highlight}</span>
          </article>
        ))}
      </div>

      <div className="service-promises">
        {servicePromises.map((promise) => (
          <p key={promise}>{promise}</p>
        ))}
      </div>

      <section className="process-panel" aria-label="How we work">
        <h2>How We Work</h2>
        <div className="process-grid">
          {processSteps.map((item) => (
            <article key={item.step} className="process-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bag-gallery" aria-label="Beaded bags showcase">
        <BagCarousel
          title="Handcrafted Bag Showcase"
          subtitle="Explore our premium beaded bag catalog through an automatic rotating gallery."
          items={bagCollection}
        />
      </section>

      <div className="cta-strip">
        <h2>Need a custom order?</h2>
        <p>Tell us what you need and we will guide you from concept to delivery.</p>
        <Link to="/contact" className="btn-solid">
          Request Quote
        </Link>
      </div>
    </section>
  )
}

export default ServicesPage
