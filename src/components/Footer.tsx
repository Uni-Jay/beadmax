import { Link } from 'react-router-dom'
import { contactInfo } from '../data/siteContent'
import logo from '../assets/images/beadmaxlogo.jpeg'

function Footer() {
  const whatsappText = encodeURIComponent(contactInfo.whatsappDefaultMessage)
  const whatsappAutomationLink = `${contactInfo.whatsappLink}?text=${whatsappText}`

  return (
    <footer className="site-footer">
      <section className="footer-grid">
        <article>
          <img src={logo} alt="BeadMax Design" className="footer-logo" />
          <h3>BeadMax Design</h3>
          <p>
            Handcrafted jewelry, beaded bags, and vocational training built with premium
            craftsmanship and purpose.
          </p>
        </article>

        <article>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </article>

        <article>
          <h3>Contact</h3>
          <p className="footer-address">{contactInfo.address}</p>
          <ul>
            {contactInfo.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone}`}>{phone}</a>
              </li>
            ))}
            <li>
              <a
                href={whatsappAutomationLink}
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                aria-label={`Open WhatsApp ${contactInfo.whatsappNumber}`}
                title={`WhatsApp ${contactInfo.whatsappNumber}`}
              >
                <span>{contactInfo.whatsappNumber}</span>
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M19.1 4.9A9.8 9.8 0 0 0 12 2C6.5 2 2 6.4 2 11.9c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4a9.9 9.9 0 0 0 4.8 1.2c5.5 0 10-4.4 10-9.9 0-2.6-1-5.1-2.9-7ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 20 11.9 8 8 0 0 1 12 20Zm4.5-5.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.7-.8.8-.2.2-.3.2-.5.1-.2-.1-1-.4-1.8-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5.3-.5c.1-.1 0-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.2-.9.9-.9 2.1 0 1.2.9 2.3 1 2.5.1.2 1.8 2.7 4.3 3.8.6.3 1.1.5 1.4.6.6.2 1.2.2 1.6.1.5-.1 1.3-.6 1.5-1.1.2-.5.2-1 .2-1.1 0-.1-.2-.2-.4-.3Z" />
                </svg>
                <span className="sr-only">WhatsApp</span>
              </a>
            </li>
            <li>
              <a
                href={contactInfo.instagramLink}
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                aria-label={`Open Instagram ${contactInfo.instagramHandle}`}
                title={`Instagram ${contactInfo.instagramHandle}`}
              >
                <span>{contactInfo.instagramHandle}</span>
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm8.3 1.8H7.9A4.1 4.1 0 0 0 3.8 7.9v8.2c0 2.3 1.8 4.1 4.1 4.1h8.2c2.3 0 4.1-1.8 4.1-4.1V7.9c0-2.3-1.8-4.1-4.1-4.1Zm.9 2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </li>
          </ul>
        </article>
      </section>

      <p className="copyright">© {new Date().getFullYear()} BeadMax Design. All rights reserved.</p>
    </footer>
  )
}

export default Footer
