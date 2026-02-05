export default function Methodology({ onBack }) {
  return (
    <section className="methodology-page">
      <div className="methodology-container">
        <button className="methodology-back" onClick={onBack}>
          ← Back to Map
        </button>

        <h1>Methodology & Data Sources</h1>

        <div className="methodology-section">
          <h2>Data Sources</h2>
          <p>
            LOUD & RICH aggregates publicly available data from the following sources:
          </p>
          <ul>
            <li>
              <strong>OpenStreetMap (OSM)</strong> — Community-contributed geographic data including
              places of worship, restaurants, schools, and community centers tagged with relevant
              attributes.
            </li>
            <li>
              <strong>Public Business Directories</strong> — Publicly listed business information
              for kosher establishments and Jewish community organizations.
            </li>
          </ul>
        </div>

        <div className="methodology-section">
          <h2>LR Index Calculation</h2>
          <p>
            The LR (Loud & Rich) Index provides a relative density score for Jewish community
            resources in a given area. Here's how it works:
          </p>
          <ol>
            <li>
              <strong>Hexagonal Grid</strong> — We use Uber's H3 hexagonal grid system to divide
              the map into consistent geographic cells.
            </li>
            <li>
              <strong>Category Weighting</strong> — Different types of locations are weighted
              based on their significance to community infrastructure:
              <ul>
                <li>Synagogues, Jewish Schools, Community Centers: 5 points</li>
                <li>Kosher Restaurants, Kosher Grocery Stores: 3 points</li>
                <li>Other Jewish-owned businesses: 1-2 points</li>
              </ul>
            </li>
            <li>
              <strong>Spatial Smoothing</strong> — Neighboring hexagons contribute 30% of their
              score to adjacent cells, creating smoother transitions between areas.
            </li>
            <li>
              <strong>Normalization</strong> — Final scores are normalized to a 0-100 scale,
              where 100 represents the highest density areas.
            </li>
          </ol>
        </div>

        <div className="methodology-section">
          <h2>Privacy & Data Handling</h2>
          <p>
            We take privacy seriously. This site:
          </p>
          <ul>
            <li>Does <strong>NOT</strong> collect, store, or display personal information</li>
            <li>Does <strong>NOT</strong> show last names, home addresses, or precise coordinates of individuals</li>
            <li>Only displays aggregated, publicly available business and organization data</li>
            <li>Does <strong>NOT</strong> track users or sell data to third parties</li>
          </ul>
        </div>

        <div className="methodology-section">
          <h2>Limitations</h2>
          <p>
            Please be aware of the following limitations:
          </p>
          <ul>
            <li>
              <strong>Incomplete Data</strong> — Not all Jewish community resources are represented.
              Many businesses and organizations may not be listed in our data sources.
            </li>
            <li>
              <strong>Data Accuracy</strong> — Information may be outdated. Businesses close,
              move, or change ownership. Always verify before visiting.
            </li>
            <li>
              <strong>Coverage Gaps</strong> — Some regions have better data coverage than others
              based on OpenStreetMap contributor activity.
            </li>
            <li>
              <strong>Not an Endorsement</strong> — Inclusion on this map does not constitute
              an endorsement or verification of kashrut or religious affiliation.
            </li>
          </ul>
        </div>

        <div className="methodology-section">
          <h2>Disclaimer</h2>
          <p>
            This site displays derived statistical data for <strong>educational and research
            purposes only</strong>. The information provided is not intended to be used for
            any discriminatory purposes. We believe in celebrating and supporting diverse
            communities.
          </p>
          <p>
            If you believe any information is inaccurate or should be removed, please contact
            us and we will review it promptly.
          </p>
        </div>

        <div className="methodology-section">
          <h2>Open Source</h2>
          <p>
            This project is open source. You can view the code, report issues, or contribute
            on GitHub.
          </p>
        </div>
      </div>
    </section>
  )
}
