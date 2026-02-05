import { useState } from 'react'

const NAME_DATA = {
  Barbara: {
    totalUS: 2457949,
    per100k: 770.86,
    rank: 10,
    gender: 'Female',
    origin: 'Greek — from "barbaros" (foreign)',
    peakYear: 1947,
    peakBabies: 94419,
    meaning: 'A classic name with Greek origins. Barbara was one of the most popular baby names in the mid-20th century United States.',
    topStates: [
      { state: 'California', count: 194539 },
      { state: 'New York', count: 170893 },
      { state: 'Pennsylvania', count: 113267 },
      { state: 'Ohio', count: 96543 },
      { state: 'Illinois', count: 95721 },
      { state: 'Texas', count: 89432 },
      { state: 'Florida', count: 87654 },
      { state: 'Michigan', count: 72341 },
      { state: 'New Jersey', count: 68923 },
      { state: 'Massachusetts', count: 54321 },
    ],
    highestPerCapita: 'West Virginia (1,289 per 100k)',
    demographics: {
      White: 80.9,
      Black: 12.3,
      Hispanic: 3.7,
      Asian: 1.0,
      'Two or More': 1.4,
      'Native American': 0.6,
    },
    trend: [
      { decade: '1930s', popularity: 'Rising rapidly' },
      { decade: '1940s', popularity: 'Peak (#2 name)' },
      { decade: '1950s', popularity: 'Still top 10' },
      { decade: '1960s', popularity: 'Declining' },
      { decade: '1970s+', popularity: 'Steep decline' },
    ],
  },
  Alon: {
    totalUS: 1086,
    per100k: 0.37,
    rank: null,
    gender: 'Male',
    origin: 'Hebrew — meaning "oak tree"',
    peakYear: 2016,
    peakBabies: 31,
    meaning: 'A Hebrew name meaning "oak tree," symbolizing strength and endurance. Common in Israel but rare in the United States.',
    topStates: [
      { state: 'California', count: 266 },
      { state: 'New York', count: 189 },
      { state: 'New Jersey', count: 87 },
      { state: 'Florida', count: 76 },
      { state: 'Texas', count: 62 },
      { state: 'Illinois', count: 48 },
      { state: 'Massachusetts', count: 41 },
      { state: 'Maryland', count: 38 },
      { state: 'Pennsylvania', count: 35 },
      { state: 'Connecticut', count: 29 },
    ],
    highestPerCapita: 'New Jersey (0.98 per 100k)',
    demographics: {
      White: 72.4,
      Hispanic: 8.1,
      Asian: 11.2,
      Black: 3.8,
      'Two or More': 3.5,
      'Native American': 1.0,
    },
    trend: [
      { decade: '1970s', popularity: 'First recorded' },
      { decade: '1980s', popularity: 'Very rare' },
      { decade: '1990s', popularity: 'Slight increase' },
      { decade: '2000s', popularity: 'Slowly growing' },
      { decade: '2010s', popularity: 'Peak usage' },
    ],
  },
}

export default function NameStats() {
  const [activeName, setActiveName] = useState('Barbara')
  const data = NAME_DATA[activeName]

  const maxStateCount = data.topStates[0].count

  return (
    <section className="names-section">
      <div className="names-header">
        <h1>Name Statistics</h1>
        <p>Explore how popular these names are across the United States using public census and SSA data.</p>
      </div>

      <div className="names-tabs">
        {Object.keys(NAME_DATA).map(name => (
          <button
            key={name}
            className={`name-tab ${activeName === name ? 'active' : ''}`}
            onClick={() => setActiveName(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="names-content">
        <div className="name-hero-card">
          <h2 className="name-title">{activeName}</h2>
          <p className="name-origin">{data.origin}</p>
          <p className="name-meaning">{data.meaning}</p>
          <div className="name-quick-stats">
            <div className="quick-stat">
              <span className="stat-number">{data.totalUS.toLocaleString()}</span>
              <span className="stat-label">People in US</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.per100k}</span>
              <span className="stat-label">Per 100k Americans</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.rank ? `#${data.rank}` : 'Rare'}</span>
              <span className="stat-label">Popularity Rank</span>
            </div>
            <div className="quick-stat">
              <span className="stat-number">{data.peakYear}</span>
              <span className="stat-label">Peak Year</span>
            </div>
          </div>
        </div>

        <div className="names-grid">
          <div className="names-card">
            <h3>Top States</h3>
            <p className="card-subtitle">Highest per capita: {data.highestPerCapita}</p>
            <div className="state-bars">
              {data.topStates.map(({ state, count }) => (
                <div key={state} className="state-bar-row">
                  <span className="state-name">{state}</span>
                  <div className="state-bar-track">
                    <div
                      className="state-bar-fill"
                      style={{ width: `${(count / maxStateCount) * 100}%` }}
                    />
                  </div>
                  <span className="state-count">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="names-card">
            <h3>Demographics</h3>
            <div className="demo-bars">
              {Object.entries(data.demographics)
                .sort(([, a], [, b]) => b - a)
                .map(([group, pct]) => (
                  <div key={group} className="demo-row">
                    <span className="demo-label">{group}</span>
                    <div className="demo-bar-track">
                      <div className="demo-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="demo-pct">{pct}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="names-card">
            <h3>Popularity Over Time</h3>
            <div className="trend-list">
              {data.trend.map(({ decade, popularity }) => (
                <div key={decade} className="trend-row">
                  <span className="trend-decade">{decade}</span>
                  <span className="trend-status">{popularity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="names-source">
        Data sourced from U.S. Census Bureau and Social Security Administration public records.
      </div>
    </section>
  )
}
