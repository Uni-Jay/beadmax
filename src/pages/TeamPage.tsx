import { team } from '../data/siteContent'

function TeamPage() {
  return (
    <section className="page-section page-top-gap">
      <div className="section-heading">
        <p className="eyebrow">Our Team</p>
        <h1>The People Behind BeadMax</h1>
        <p className="intro">
          We are a focused creative team combining design direction, quality production, and
          practical training excellence.
        </p>
      </div>

      <div className="team-grid">
        {team.map((member) => (
          <article key={member.role} className="team-card">
            <div className="avatar-badge" aria-hidden="true" style={{ background: member.color }}>
              {member.initials}
            </div>
            <h2>{member.role}</h2>
            <h3>{member.name}</h3>
            <p className="team-phone">
              <a href={`tel:${member.phone.replace(/\s+/g, '')}`}>{member.phone}</a>
            </p>
            <p>{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TeamPage
