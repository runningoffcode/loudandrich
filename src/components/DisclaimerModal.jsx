import { useState, useEffect } from 'react'

const STORAGE_KEY = 'lr-disclaimer-accepted'

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (!accepted) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-modal">
        <h2>Welcome to LOUD & RICH</h2>

        <div className="disclaimer-content">
          <p><strong>Disclaimer & Terms of Use</strong></p>

          <p>
            This website is provided for <strong>entertainment and educational purposes only</strong>.
            By using this site, you acknowledge and agree to the following:
          </p>

          <ul>
            <li>
              <strong>Public Data:</strong> All information displayed on this site is derived from
              publicly available sources including government records, business listings, and
              open data repositories. No private or personal information is collected, stored,
              or displayed.
            </li>
            <li>
              <strong>No Harmful Intent:</strong> This site is not intended to target, discriminate
              against, or harm any individual, group, religious community, or ethnic population.
              The content is presented in a satirical and educational context.
            </li>
            <li>
              <strong>Accuracy:</strong> While we strive for accuracy, we make no warranties or
              guarantees regarding the completeness, reliability, or accuracy of the information
              presented. Data may be outdated or contain errors.
            </li>
            <li>
              <strong>User Responsibility:</strong> You agree to use this site responsibly and
              not for any unlawful, harmful, or discriminatory purposes. You are solely responsible
              for how you use the information provided.
            </li>
            <li>
              <strong>No Liability:</strong> The creators and operators of this site shall not be
              held liable for any damages, claims, or losses arising from the use of this website
              or reliance on its content.
            </li>
          </ul>

          <p className="disclaimer-footer-text">
            By clicking "I Understand & Accept" below, you confirm that you have read, understood,
            and agree to these terms.
          </p>
        </div>

        <button className="disclaimer-accept-btn" onClick={handleAccept}>
          I Understand & Accept
        </button>
      </div>
    </div>
  )
}
