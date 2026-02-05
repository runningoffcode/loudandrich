import { useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpqjapvv'

export default function RequestModal({ isOpen, onClose }) {
  const [requestText, setRequestText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!requestText.trim() || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: requestText }),
      })

      if (response.ok) {
        setSubmitted(true)
        setRequestText('')
        setTimeout(() => {
          setSubmitted(false)
          onClose()
        }, 2000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Failed to send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="request-modal-overlay" onClick={onClose}>
      <div className="request-modal" onClick={(e) => e.stopPropagation()}>
        <button className="request-modal-close" onClick={onClose}>&times;</button>

        <h2>Special Requests</h2>
        <p className="request-modal-subtitle">
          Request a name to add to Name Stats, a favorite place to add to the map,
          or suggest any other feature!
        </p>

        {submitted ? (
          <div className="request-success">
            <span className="request-success-icon">✓</span>
            <p>Thanks for your request!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Type your request here... (e.g., 'Add the name Moshe to Name Stats' or 'Add Katz's Deli in NYC')"
              rows={5}
              className="request-textarea"
              disabled={submitting}
            />
            {error && <p className="request-error">{error}</p>}
            <button type="submit" className="request-submit-btn" disabled={!requestText.trim() || submitting}>
              {submitting ? 'Sending...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
