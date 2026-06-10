import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { contactInfo } from '../data/siteContent'

type ContactFormData = {
  fullName: string
  phone: string
  email: string
  service: string
  message: string
}

const initialForm: ContactFormData = {
  fullName: '',
  phone: '',
  email: '',
  service: '',
  message: '',
}

function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialForm)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const whatsappQuoteText = encodeURIComponent(contactInfo.whatsappDefaultMessage)
  const whatsappQuoteLink = `${contactInfo.whatsappLink}?text=${whatsappQuoteText}`
  const whatsappReceiptText = encodeURIComponent(
    'Hello BeadMax Vocational School, I have completed registration and I am sending my payment receipt for confirmation.',
  )
  const whatsappReceiptLink = `${contactInfo.whatsappLink}?text=${whatsappReceiptText}`
  const whatsappFormText = encodeURIComponent(
    [
      'Hello BeadMax Design, I need assistance with:',
      `Service: ${formData.service || 'Not specified'}`,
      `Name: ${formData.fullName || 'Not specified'}`,
      `Phone: ${formData.phone || 'Not specified'}`,
      `Email: ${formData.email || 'Not specified'}`,
      `Message: ${formData.message || 'No additional details yet'}`,
    ].join('\n'),
  )
  const whatsappFormLink = `${contactInfo.whatsappLink}?text=${whatsappFormText}`

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim().length > 2 &&
      formData.phone.trim().length > 7 &&
      formData.email.includes('@') &&
      formData.service.trim().length > 1 &&
      formData.message.trim().length > 8
    )
  }, [formData])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) return

    const recipients = contactInfo.emails.join(',')
    const subject = encodeURIComponent(`New BeadMax enquiry: ${formData.service}`)
    const body = encodeURIComponent(
      [
        `Full Name: ${formData.fullName}`,
        `Phone Number: ${formData.phone}`,
        `Email Address: ${formData.email}`,
        `Service Interest: ${formData.service}`,
        '',
        'Project Details:',
        formData.message,
        '',
        'Note: Cost price varies based on design and quantity. Please contact us directly for final quote.',
      ].join('\n'),
    )

    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`

    setIsSubmitted(true)
    setFormData(initialForm)
  }

  return (
    <section className="page-section page-top-gap">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Visit or Call BeadMax Design</h1>
        <p className="intro">
          Send your request and our team will respond with consultation, timelines, and pricing.
        </p>
        <div className="contact-actions">
          <a className="btn-solid" href={whatsappQuoteLink} target="_blank" rel="noreferrer">
            Chat on WhatsApp
          </a>
          <a className="btn-outline" href={`tel:${contactInfo.whatsappNumber}`}>
            Call +2348060886447
          </a>
          <a className="btn-outline" href={contactInfo.instagramLink} target="_blank" rel="noreferrer">
            Instagram {contactInfo.instagramHandle}
          </a>
        </div>
      </div>

      <div className="contact-page-grid">
        <aside className="contact-sidebar">
          <article className="contact-info-card contact-hero-card">
            <p className="contact-kicker">Customer Support</p>
            <h2>Let Us Assist You Fast</h2>
            <p>
              Reach us directly for bag orders, jewelry requests, and vocational training support.
            </p>
            <div className="contact-quick-list">
              <a href={whatsappQuoteLink} target="_blank" rel="noreferrer">
                WhatsApp: {contactInfo.whatsappNumber}
              </a>
              {contactInfo.phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`}>
                  Call: {phone}
                </a>
              ))}
              {contactInfo.emails.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  Email: {email}
                </a>
              ))}
            </div>
          </article>

          <article className="contact-info-card">
            <h3>Visit Our Office</h3>
            <p>{contactInfo.address}</p>
            <p>Live support hours: Monday-Friday, 8:00am-5:00pm.</p>
          </article>

          <article className="contact-info-card">
            <h3>Training and Pricing</h3>
            <p>Training fee: NGN 150,000 for 3 months with flexible timetable.</p>
            <p>Cost price varies by design and quantity. Contact us directly for final pricing.</p>
          </article>

          <article className="contact-info-card">
            <h3>Instagram</h3>
            <p>
              <a href={contactInfo.instagramLink} target="_blank" rel="noreferrer">
                Follow us on Instagram: {contactInfo.instagramHandle}
              </a>
            </p>
          </article>
        </aside>

        <div className="contact-main">
          <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
            <h2>Request a Consultation</h2>
            <p className="form-note">
              Fill this form to open your mail client with a complete request draft to our team.
            </p>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => {
                    setFormData((current) => ({ ...current, fullName: event.target.value }))
                    setIsSubmitted(false)
                  }}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label>
                Phone Number
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => {
                    setFormData((current) => ({ ...current, phone: event.target.value }))
                    setIsSubmitted(false)
                  }}
                  placeholder="e.g. +2348000000000"
                  required
                />
              </label>
              <label>
                Email Address
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => {
                    setFormData((current) => ({ ...current, email: event.target.value }))
                    setIsSubmitted(false)
                  }}
                  placeholder="yourname@email.com"
                  required
                />
              </label>
              <label>
                Service Interest
                <select
                  value={formData.service}
                  onChange={(event) => {
                    setFormData((current) => ({ ...current, service: event.target.value }))
                    setIsSubmitted(false)
                  }}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Bespoke Jewelry">Bespoke Jewelry</option>
                  <option value="Beaded Bags">Beaded Bags</option>
                  <option value="Vocational Training">Vocational Training</option>
                  <option value="Bulk/Corporate Orders">Bulk/Corporate Orders</option>
                </select>
              </label>
              <label className="full-width">
                Project Details
                <textarea
                  value={formData.message}
                  onChange={(event) => {
                    setFormData((current) => ({ ...current, message: event.target.value }))
                    setIsSubmitted(false)
                  }}
                  placeholder="Tell us what you want, preferred colors, quantity, and timeline."
                  rows={5}
                  required
                />
              </label>
            </div>

            <div className="form-action-row">
              <button type="submit" className="btn-solid contact-submit" disabled={!isFormValid}>
                Send Request by Email
              </button>
              <a
                className="btn-outline whatsapp-form-btn"
                href={whatsappFormLink}
                target="_blank"
                rel="noreferrer"
              >
                Send Details on WhatsApp
              </a>
            </div>

            {isSubmitted ? (
              <p className="form-success">
                Great. Your mail draft has been prepared. Send it to complete your request.
              </p>
            ) : null}
          </form>

          <article className="contact-info-card contact-mini-card">
            <h3>Training Registration</h3>
            <p>
              Fill our vocational school Google Form and send your receipt to +2348060886447 for
              confirmation.
            </p>
            <div className="mini-action-row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScP9ouLRKyZ4CR97ygDdKWWZZ3_6FE-F87zoILzo46CW58nqg/viewform?usp=header"
                target="_blank"
                rel="noreferrer"
              >
                Open Registration Form
              </a>
              <a href={whatsappReceiptLink} target="_blank" rel="noreferrer">
                Send Receipt on WhatsApp
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
