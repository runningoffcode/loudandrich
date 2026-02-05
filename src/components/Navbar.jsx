export default function Navbar({ activeSection, setActiveSection }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => setActiveSection('map')}>
          <span className="logo-loud">LOUD</span>
          <span className="logo-amp">&</span>
          <span className="logo-rich">RICH</span>
        </button>
        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === 'names' ? 'active' : ''}`}
            onClick={() => setActiveSection('names')}
          >
            Name Stats
          </button>
        </div>
      </div>
    </nav>
  )
}
