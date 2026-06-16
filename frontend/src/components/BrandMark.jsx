/* The site logo — same SVG as the favicon, so the brand stays consistent.
   `onColor` wraps it in a white tile for use on the orange auth hero. */
export default function BrandMark({ size = 40, onColor = false }) {
  const img = <img src="/favicon.svg" width={size} height={size} alt="1Now" className="brand-mark" />
  return onColor ? <span className="brand-mark-bg">{img}</span> : img
}
