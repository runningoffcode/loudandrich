export default function Hero({ setActiveSection }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-loud">LOUD</span>
          <span className="hero-amp">&</span>
          <span className="hero-rich">RICH</span>
        </h1>
        <p className="hero-subtitle">
          Discover Jewish community resources across the United States
        </p>
        <p className="hero-description">
          Find kosher restaurants, synagogues, Jewish federations, community centers,
          and more — all on an interactive map.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => setActiveSection('map')}>
            Explore the Map
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveSection('names')}>
            Name Statistics
          </button>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">&#127860;</div>
            <h3>Kosher Dining</h3>
            <p>Restaurants & grocery stores</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#9878;</div>
            <h3>Synagogues</h3>
            <p>Temples & Chabad houses</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#127963;</div>
            <h3>Federations</h3>
            <p>Jewish community organizations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#127979;</div>
            <h3>Education</h3>
            <p>Day schools & learning centers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#128142;</div>
            <h3>Jewelry & Judaica</h3>
            <p>Jewish jewelry & Judaica shops</p>
          </div>
        </div>
      </div>
    </section>
  )
}
