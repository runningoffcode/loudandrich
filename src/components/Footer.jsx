export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-loud">LOUD</span>
          <span className="logo-amp">&</span>
          <span className="logo-rich">RICH</span>
        </div>
        <p className="footer-text">
          A community resource locator. All data sourced from OpenStreetMap
          and publicly available directories.
        </p>
        <p className="footer-disclaimer">
          This tool is for informational purposes only. Data may be incomplete or outdated.
        </p>
      </div>
    </footer>
  )
}
