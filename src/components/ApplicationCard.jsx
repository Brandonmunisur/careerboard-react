import React from 'react'

function formatDate(value) {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export default function ApplicationCard({ application, onEdit, onDelete }) {
  return (
    <article className="application-card">
      <header>
        <div>
          <h3>{application.role}</h3>
          <p>{application.company}</p>
        </div>
        <span className={`badge badge-${application.status.toLowerCase()}`}>
          {application.status}
        </span>
      </header>

      <div className="meta">
        <span>📍 {application.location || 'Location not specified'}</span>
        <span>📅 Applied: {formatDate(application.appliedDate)}</span>
        <span>⏰ Follow-up: {formatDate(application.followUpDate)}</span>
        {application.contactEmail && <span>✉️ {application.contactEmail}</span>}
      </div>

      {application.notes && (
        <p className="notes">{application.notes}</p>
      )}

      <footer>
        <div>
          {application.jobUrl && (
            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
              View listing ↗
            </a>
          )}
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onEdit(application)}
            aria-label={`Edit ${application.company}`}
          >
            Edit
          </button>

          <button
            type="button"
            className="icon-button danger"
            onClick={() => onDelete(application.id)}
            aria-label={`Delete ${application.company}`}
          >
            Delete
          </button>
        </div>
      </footer>
    </article>
  )
}
