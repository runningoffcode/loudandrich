export default function Navbar({ activeSection, setActiveSection, onRequestClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => setActiveSection('map')}>
          <img src="/logo.png" alt="Loud & Rich" className="nav-logo-img" />
        </button>
        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === 'names' ? 'active' : ''}`}
            onClick={() => setActiveSection('names')}
          >
            Name Stats
          </button>
          <button
            className="nav-link request-btn"
            onClick={onRequestClick}
          >
            Request
          </button>
        </div>
      </div>
    </nav>
  )
}
