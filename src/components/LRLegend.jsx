import { useState } from 'react'
import { LR_LABELS } from '../utils/lrIndex'

export default function LRLegend() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`lr-legend ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="lr-legend-header" onClick={() => setIsOpen(prev => !prev)}>
        <span className="lr-legend-title">Legend</span>
        <span className={`lr-legend-arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
      </button>
      <div className="lr-legend-gradient-bar">
        {LR_LABELS.map(({ color }) => (
          <span key={color} className="lr-legend-gradient-stop" style={{ background: color }} />
        ))}
      </div>
      {isOpen && (
        <div className="lr-legend-content">
          <div className="lr-legend-scale">
            {LR_LABELS.map(({ label, color, min }) => (
              <div key={label} className="lr-legend-item">
                <span className="lr-legend-swatch" style={{ background: color }}>{min}</span>
                <span className="lr-legend-text">{label} ({min}-{min + 19 > 100 ? 100 : min + 19})</span>
              </div>
            ))}
          </div>
          <div className="lr-legend-note">No color? No data.</div>
        </div>
      )}
    </div>
  )
}
