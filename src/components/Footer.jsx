export default function Footer({ onMethodologyClick }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="Loud & Rich" className="footer-logo-img" />
        </div>
        <p className="footer-text">
          A community resource locator. All data sourced from OpenStreetMap
          and publicly available directories.
        </p>
        <div className="footer-disclaimer">
          <p>
            This site displays derived statistical data for educational and research purposes only.
            We do not store or display personal information, last names, addresses, or precise coordinates.
          </p>
          <button className="methodology-link" onClick={onMethodologyClick}>
            See our full methodology for more info
          </button>
        </div>
      </div>
    </footer>
  )
}
