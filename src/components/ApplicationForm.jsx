import React, { useEffect, useState } from 'react'

const emptyForm = {
  company: '',
  role: '',
  location: '',
  salary: '',
  status: 'Wishlist',
  appliedDate: '',
  followUpDate: '',
  jobUrl: '',
  contactName: '',
  contactEmail: '',
  notes: '',
}

export default function ApplicationForm({
  open,
  editing,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      const { id, createdAt, ...editableFields } = editing
      setForm(editableFields)
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [editing, open])

  if (!open) return null

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()

    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required.')
      return
    }

    onSave(
      {
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        notes: form.notes.trim(),
      },
      editing?.id,
    )

    onClose()
  }

  return (
    <div className="modal-backdrop">
      <section className="modal-card" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <span className="eyebrow">APPLICATION DETAILS</span>
            <h2>{editing ? 'Edit application' : 'Add application'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Company *
              <input value={form.company} onChange={(e) => update('company', e.target.value)} />
            </label>

            <label>
              Role *
              <input value={form.role} onChange={(e) => update('role', e.target.value)} />
            </label>

            <label>
              Location
              <input value={form.location} onChange={(e) => update('location', e.target.value)} />
            </label>

            <label>
              Salary range
              <input value={form.salary} onChange={(e) => update('salary', e.target.value)} />
            </label>

            <label>
              Status
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option>Wishlist</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </label>

            <label>
              Date applied
              <input type="date" value={form.appliedDate} onChange={(e) => update('appliedDate', e.target.value)} />
            </label>

            <label>
              Follow-up date
              <input type="date" value={form.followUpDate} onChange={(e) => update('followUpDate', e.target.value)} />
            </label>

            <label>
              Job URL
              <input type="url" value={form.jobUrl} onChange={(e) => update('jobUrl', e.target.value)} />
            </label>

            <label>
              Contact name
              <input value={form.contactName} onChange={(e) => update('contactName', e.target.value)} />
            </label>

            <label>
              Contact email
              <input type="email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} />
            </label>

            <label className="full-width">
              Notes
              <textarea rows="5" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="button secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button primary">
              Save application
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
