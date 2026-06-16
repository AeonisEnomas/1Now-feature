import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCard, IconCar, IconSparkle, IconShare } from '../components/Icons'

export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 className="page-title">{greet}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="page-sub">Create share-ready graphics for your rental business in seconds.</p>
        </div>
      </header>

      <div className="feature-grid">
        <FeatureCard
          to="/settings"
          Icon={IconCard}
          tag="Feature 1 · Settings → Company Info"
          title="Business Card Generator"
          desc="Open your company details and hit Generate Business Card to create a polished, share-ready card."
          cta="Open Company Info"
        />
        <FeatureCard
          to="/fleet"
          Icon={IconCar}
          tag="Feature 2 · Fleet → Car Details"
          title="Car Post Generator"
          desc="Open a vehicle's details and hit Generate Car Post to advertise it with a scroll-stopping ad."
          cta="Open Car Details"
        />
      </div>

      <section className="how">
        <h3 className="how-title">How it works</h3>
        <div className="how-steps">
          <Step n="1" Icon={IconCard} title="Fill your details once" text="Your fields are saved automatically and stay filled next time you log in." />
          <Step n="2" Icon={IconSparkle} title="Generate with AI" text="Describe the look or pick a template — AI designs the graphic for you." />
          <Step n="3" Icon={IconShare} title="Share anywhere" text="Post to WhatsApp, Facebook, X and LinkedIn, or download the image." />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ to, Icon, tag, title, desc, cta }) {
  return (
    <Link to={to} className="feature-card">
      <div className="feature-icon"><Icon width={26} height={26} /></div>
      <span className="chip muted">{tag}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
      <span className="feature-cta">{cta} <span className="arrow">→</span></span>
    </Link>
  )
}

function Step({ n, Icon, title, text }) {
  return (
    <div className="step">
      <div className="step-badge"><Icon width={18} height={18} /><span className="step-n">{n}</span></div>
      <div>
        <div className="step-title">{title}</div>
        <p className="step-text">{text}</p>
      </div>
    </div>
  )
}
