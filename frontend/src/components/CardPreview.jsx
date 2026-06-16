import { forwardRef } from 'react'
import { IconPhone, IconMail, IconGlobe, IconPin, IconArrow } from './Icons'

/* ============================================================
   Renders a design "spec" into a share-ready graphic.
   Business cards are portrait; car posts are landscape ads.
   Every template is its OWN layout (not a recolor).
   forwardRef exposes the node for PNG export.
   ============================================================ */

const FONT_SERIF = "'Georgia', 'Times New Roman', serif"
const CONTACT_ICON = { phone: IconPhone, email: IconMail, web: IconGlobe, address: IconPin }
const initial = (s) => (s || '?').trim().charAt(0).toUpperCase()

function palette(theme, accent) {
  switch (theme) {
    case 'dark':     return { text: '#fff', muted: 'rgba(255,255,255,.66)', line: 'rgba(255,255,255,.16)', chipBg: 'rgba(255,255,255,.1)', chipText: '#fff', accent }
    case 'elegant':  return { text: '#2a211b', muted: 'rgba(42,33,27,.58)', line: 'rgba(42,33,27,.18)', chipBg: '#fff', chipText: '#7a4a32', accent }
    default:         return { text: '#1a1410', muted: '#6b7280', line: 'rgba(26,20,16,.1)', chipBg: '#F4F5F7', chipText: '#475569', accent }
  }
}

function Logo({ spec, size = 60, onColor, accent, line }) {
  if (spec.logo) {
    return (
      <div className="logo-tile" style={{ width: size, height: size, background: onColor ? 'rgba(255,255,255,.95)' : '#fff', borderColor: line || 'transparent' }}>
        <img src={spec.logo} alt="" crossOrigin="anonymous" />
      </div>
    )
  }
  return (
    <div className="logo-tile mono" style={{ width: size, height: size, background: onColor ? 'rgba(255,255,255,.18)' : accent }}>
      {initial(spec.headline)}
    </div>
  )
}

function Contacts({ items, accent, color, chipBg }) {
  return (
    <div className="contacts">
      {(items || []).map((c, i) => {
        const Ic = CONTACT_ICON[c.type] || IconGlobe
        return (
          <div className="contact" key={i} style={{ color }}>
            <span className="contact-ic" style={{ background: chipBg, color: accent }}><Ic width={13} height={13} /></span>
            <span className="contact-val">{c.value}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ===================== Business card (portrait) ===================== */
function BusinessCard({ spec }) {
  const p = palette(spec.theme, spec.accent)
  const grad = `linear-gradient(145deg, ${spec.accent}, ${spec.accent2})`

  // HEADER — bold accent band up top with logo + name, contacts below on white.
  if (spec.layout === 'header') {
    return (
      <div className="poster card header" style={{ background: '#fff', color: '#1a1410' }}>
        <div className="hd-band" style={{ background: grad }}>
          <div className="hd-orb" />
          <div className="hd-row">
            <Logo spec={spec} size={58} onColor accent="#fff" line="rgba(255,255,255,.45)" />
            <div className="hd-id">
              <h2 className="bc-name clamp2" style={{ color: '#fff' }}>{spec.headline}</h2>
              {spec.subheadline && <div className="hd-sub">{spec.subheadline}</div>}
            </div>
          </div>
        </div>
        <div className="hd-body">
          {spec.tagline && <div className="bc-tag" style={{ color: spec.accent }}>“{spec.tagline}”</div>}
          <div className="hairline" style={{ background: p.line }} />
          <Contacts items={spec.contacts} accent={spec.accent} color="#1a1410" chipBg="#FFF1E8" />
        </div>
      </div>
    )
  }

  // SIDEBAR — accent rail with logo + vertical wordmark, content on the right.
  if (spec.layout === 'sidebar') {
    return (
      <div className="poster card sidebar" style={{ background: '#fff', color: '#1a1410' }}>
        <div className="sb-rail" style={{ background: grad }}>
          <Logo spec={spec} size={66} onColor accent="#fff" line="rgba(255,255,255,.4)" />
          <div className="sb-vert">CAR RENTAL</div>
        </div>
        <div className="sb-main">
          <h2 className="bc-name">{spec.headline}</h2>
          <div className="bc-sub" style={{ color: p.muted }}>{spec.subheadline}</div>
          {spec.tagline && <div className="bc-tag" style={{ color: spec.accent }}>“{spec.tagline}”</div>}
          <div className="hairline" style={{ background: p.line }} />
          <Contacts items={spec.contacts} accent={spec.accent} color="#1a1410" chipBg="#F4F5F7" />
        </div>
      </div>
    )
  }

  // EDITORIAL — cream, centered serif, hairlines, generous air.
  if (spec.layout === 'editorial') {
    return (
      <div className="poster card editorial" style={{ background: 'linear-gradient(165deg,#FFF8F2,#FCE9DA)', color: '#2a211b' }}>
        <Logo spec={spec} size={54} accent={spec.accent} line={p.line} />
        {spec.subheadline && <div className="ed-eyebrow" style={{ color: spec.accent }}>{spec.subheadline}</div>}
        <h2 className="bc-name serif" style={{ fontFamily: FONT_SERIF }}>{spec.headline}</h2>
        <div className="hairline center" style={{ background: spec.accent }} />
        {spec.tagline && <div className="bc-tag serif" style={{ color: p.muted, fontFamily: FONT_SERIF }}>{spec.tagline}</div>}
        <div className="ed-contacts">
          <Contacts items={spec.contacts} accent={spec.accent} color={p.text} chipBg="#fff" />
        </div>
      </div>
    )
  }

  // ONYX — dark, oversized translucent monogram watermark, premium.
  return (
    <div className="poster card onyx" style={{ background: 'linear-gradient(165deg,#241c16,#100b08)', color: '#fff' }}>
      <span className="onyx-mark">{initial(spec.headline)}</span>
      <Logo spec={spec} size={56} onColor accent={spec.accent} line="rgba(255,255,255,.18)" />
      <div className="onyx-body">
        <h2 className="bc-name">{spec.headline}</h2>
        <div className="accent-bar" style={{ background: spec.accent }} />
        <div className="bc-sub" style={{ color: p.muted }}>{spec.subheadline}</div>
        {spec.tagline && <div className="bc-tag" style={{ color: spec.accent }}>“{spec.tagline}”</div>}
      </div>
      <div className="hairline" style={{ background: p.line }} />
      <Contacts items={spec.contacts} accent={spec.accent} color="#fff" chipBg="rgba(255,255,255,.1)" />
    </div>
  )
}

/* ===================== Car post (premium landscape ad) ===================== */
function CarPost({ spec }) {
  const p = palette(spec.theme === 'overlay' ? 'dark' : spec.theme, spec.accent)
  const grad = `linear-gradient(120deg, ${spec.accent}, ${spec.accent2})`
  const Img = ({ className }) =>
    spec.image
      ? <img className={className} src={spec.image} alt="" crossOrigin="anonymous" />
      : <div className={className + ' ph'} style={{ background: grad }} />
  const Specs = ({ glass }) => (
    <div className="cp-specs">
      {(spec.highlights || []).slice(0, 4).map((h, i) => (
        <span className={'cp-chip' + (glass ? ' glass' : ' solid')} key={i}>{h}</span>
      ))}
    </div>
  )
  const Badge = () => spec.badge ? (
    <span className="cp-badge" style={{ background: spec.accent }}><span className="cp-badge-dot" />{spec.badge}</span>
  ) : null
  const Brand = ({ light }) => (
    <div className="cp-brandrow" style={{ color: light ? 'rgba(255,255,255,.82)' : p.muted }}>
      <span className="cp-brand-key" style={{ background: spec.accent }} />
      FOR RENT{spec.location ? <><span className="cp-dotsep">•</span><IconPin width={12} height={12} /> {spec.location}</> : ''}
    </div>
  )
  const Price = ({ color, className = '' }) => spec.price ? (
    <div className={'cp-price ' + className} style={{ color }}>{spec.price}<span className="cp-unit">/day</span></div>
  ) : null
  const Cta = ({ className = '' }) => (
    <span className={'cp-cta ' + className} style={className.includes('glass') ? undefined : { background: spec.accent }}>
      {spec.cta || 'Book Now'} <IconArrow width={15} height={15} />
    </span>
  )

  // SPOTLIGHT — cinematic full-bleed hero.
  if (spec.layout === 'spotlight') {
    return (
      <div className="poster post spotlight" style={{ background: '#0d1016', color: '#fff' }}>
        <Img className="sp-img" />
        <div className="sp-grad" />
        <div className="sp-top"><Brand light /><Badge /></div>
        <div className="sp-content">
          {spec.tagline && <div className="cp-kicker">{spec.tagline}</div>}
          <h2 className="cp-title xl">{spec.headline}</h2>
          <Specs glass />
          <div className="cp-cluster">
            <Price color="#fff" className="big" />
            <Cta />
          </div>
        </div>
      </div>
    )
  }

  // BANNER — hero image fading into a premium dark detail bar.
  if (spec.layout === 'banner') {
    return (
      <div className="poster post banner" style={{ background: 'linear-gradient(160deg,#211a15,#100b08)', color: '#fff' }}>
        <div className="bn-image"><Img className="bn-img" /><div className="bn-fade" /><Badge /></div>
        <div className="bn-bar">
          <div className="bn-left">
            <Brand light />
            <h2 className="cp-title">{spec.headline}</h2>
            <Specs glass />
          </div>
          <div className="bn-right">
            <Price color={spec.accent} className="big" />
            <Cta />
          </div>
        </div>
      </div>
    )
  }

  // SHOWCASE — bold editorial colour panel + framed image.
  if (spec.layout === 'showcase') {
    return (
      <div className="poster post showcase" style={{ background: grad, color: '#fff' }}>
        <div className="sc-panel">
          <Brand light />
          <h2 className="cp-title xl">{spec.headline}</h2>
          <Specs glass />
          <Price color="#fff" className="huge" />
          <Cta className="glass" />
        </div>
        <div className="sc-image"><Img className="sc-img" /><Badge /></div>
      </div>
    )
  }

  // SPLIT — hero image + clean detail panel with a price tag.
  return (
    <div className="poster post split" style={{ background: '#fff', color: p.text }}>
      <div className="cp-image"><Img className="cp-img" /><Badge /></div>
      <div className="cp-panel">
        <Brand />
        <h2 className="cp-title" style={{ color: p.text }}>{spec.headline}</h2>
        <Specs />
        <div className="cp-pricetag" style={{ background: 'rgba(255,106,43,.1)' }}>
          <Price color={spec.accent} className="big" />
          {spec.tagline && <span className="cp-tagmini" style={{ color: p.muted }}>{spec.tagline}</span>}
        </div>
        <Cta className="block" />
      </div>
    </div>
  )
}

const CardPreview = forwardRef(function CardPreview({ spec }, ref) {
  if (!spec) return null
  const isCar = spec.type === 'car_post'
  return (
    <div ref={ref} className={'poster-wrap' + (isCar ? ' landscape' : '')}>
      {isCar ? <CarPost spec={spec} /> : <BusinessCard spec={spec} />}
    </div>
  )
})

export default CardPreview
