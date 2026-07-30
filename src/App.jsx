import React, { useEffect, useMemo, useState } from 'react'
import ApplicationCard from './components/ApplicationCard'
import ApplicationForm from './components/ApplicationForm'
import MetricCard from './components/MetricCard'

const STORAGE_KEY = 'careerboard-react-applications'

const sampleApplications = [
  {
    id: '1',
    company: 'Capitec',
    role: 'Graduate Software Developer',
    location: 'Stellenbosch',
    salary: '',
    status: 'Applied',
    appliedDate: '2026-07-24',
    followUpDate: '2026-07-31',
    jobUrl: 'https://careers.capitecbank.co.za/',
    contactName: '',
    contactEmail: '',
    notes: 'Submitted CV, transcript and tailored cover letter.',
    createdAt: '2026-07-24T08:00:00.000Z',
  },
  {
    id: '2',
    company: 'Entelect',
    role: 'Graduate Software Engineer',
    location: 'Johannesburg',
    salary: '',
    status: 'Interview',
    appliedDate: '2026-07-18',
    followUpDate: '2026-07-30',
    jobUrl: 'https://culture.entelect.co.za/',
    contactName: 'Graduate Recruitment',
    contactEmail: '',
    notes: 'Prepare React fundamentals and project walkthrough.',
    createdAt: '2026-07-18T08:00:00.000Z',
  },
]

const filters = ['All', 'Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']

function loadApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : sampleApplications
  } catch {
    return sampleApplications
  }
}

function exportCsv(applications) {
  const headers = [
    'Company',
    'Role',
    'Location',
    'Status',
    'Applied Date',
    'Follow-up Date',
    'Salary',
    'Job URL',
    'Contact',
    'Contact Email',
    'Notes',
  ]

  const escapeCell = (value) =>
    `"${String(value || '').replaceAll('"', '""')}"`

  const rows = applications.map((application) =>
    [
      application.company,
      application.role,
      application.location,
      application.status,
      application.appliedDate,
      application.followUpDate,
      application.salary,
      application.jobUrl,
      application.contactName,
      application.contactEmail,
      application.notes,
    ]
      .map(escapeCell)
      .join(','),
  )

  const blob = new Blob([[headers.join(','), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'careerboard-applications.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [applications, setApplications] = useState(loadApplications)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)

    return {
      total: applications.length,
      interviews: applications.filter((item) => item.status === 'Interview').length,
      offers: applications.filter((item) => item.status === 'Offer').length,
      followUps: applications.filter(
        (item) =>
          item.followUpDate &&
          item.followUpDate <= today &&
          !['Offer', 'Rejected'].includes(item.status),
      ).length,
    }
  }, [applications])

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return applications
      .filter((item) => activeFilter === 'All' || item.status === activeFilter)
      .filter((item) => {
        if (!search) return true

        return [
          item.company,
          item.role,
          item.location,
          item.notes,
        ].some((value) => value.toLowerCase().includes(search))
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [applications, activeFilter, searchTerm])

  function saveApplication(form, id) {
    if (id) {
      setApplications((current) =>
        current.map((item) => (item.id === id ? { ...item, ...form } : item)),
      )
      return
    }

    setApplications((current) => [
      {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
  }

  function deleteApplication(id) {
    if (window.confirm('Delete this application?')) {
      setApplications((current) => current.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          Career<span>Board</span>
        </div>

        <div className="profile">
          <strong>Brandon Munisur</strong>
          <span>Junior Frontend Developer</span>
        </div>

        <div className="sidebar-tip">
          <span>Weekly target</span>
          <strong>25 applications</strong>
          <p>Track quality applications, interviews and follow-ups.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <span className="eyebrow">JOB SEARCH COMMAND CENTRE</span>
            <h1>Application tracker</h1>
            <p>Organise opportunities, follow-ups and interview progress.</p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => exportCsv(applications)}
            >
              Export CSV
            </button>

            <button
              type="button"
              className="button primary"
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              + Add application
            </button>
          </div>
        </header>

        <section className="metrics-grid">
          <MetricCard label="Total applications" value={metrics.total} helper="All tracked opportunities" />
          <MetricCard label="Interviews" value={metrics.interviews} helper="Active interview processes" />
          <MetricCard label="Offers" value={metrics.offers} helper="Successful outcomes" />
          <MetricCard label="Follow-ups due" value={metrics.followUps} helper="Applications needing action" />
        </section>

        <section className="applications-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PIPELINE</span>
              <h2>Your applications</h2>
            </div>
            <span>{filteredApplications.length} results</span>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search company, role, location or notes"
              />
            </label>

            <div className="filter-row">
              <span aria-hidden="true">Filter:</span>
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="application-grid">
            {filteredApplications.length ? (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={(item) => {
                    setEditing(item)
                    setFormOpen(true)
                  }}
                  onDelete={deleteApplication}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No applications found</h3>
                <p>Change your search or add a new application.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <ApplicationForm
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSave={saveApplication}
      />
    </div>
  )
}
