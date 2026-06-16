import BrandMark from '../components/BrandMark'
import { IconCard, IconCar, IconShare } from '../components/Icons'

/** Shared marketing panel + centered form card for login/signup. */
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-inner">
          <div className="brand light">
            <BrandMark size={40} onColor />
            <div>
              <div className="brand-name">1Now</div>
              <div className="brand-sub">Social Studio</div>
            </div>
          </div>

          <h1 className="auth-headline">
            Turn your fleet into<br />scroll-stopping posts.
          </h1>
          <p className="auth-sub">
            Generate share-ready business cards and car ads in seconds with AI —
            then post to WhatsApp, Facebook, X and LinkedIn.
          </p>

          <ul className="auth-feats">
            <li><span className="feat-ic"><IconCard width={18} height={18} /></span> AI business card generator</li>
            <li><span className="feat-ic"><IconCar width={18} height={18} /></span> AI car advertisement posts</li>
            <li><span className="feat-ic"><IconShare width={18} height={18} /></span> One-tap social sharing</li>
          </ul>
        </div>
        <div className="auth-orb a" />
        <div className="auth-orb b" />
      </div>

      <div className="auth-form-side">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  )
}
