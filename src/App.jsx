import { useEffect, useMemo, useState } from 'react'
import DecisionDetail from './components/DecisionDetail.jsx'
import DecisionForm from './components/DecisionForm.jsx'
import DecisionList from './components/DecisionList.jsx'
import { createId, loadDecisions, saveDecisions } from './storage.js'
import './App.css'

export default function App() {
  const [decisions, setDecisions] = useState(() => loadDecisions())
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    saveDecisions(decisions)
  }, [decisions])

  const selected = decisions.find((item) => item.id === selectedId) ?? null

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return decisions
      .filter((item) => (status === 'all' ? true : item.status === status))
      .filter((item) => {
        if (!needle) return true
        return `${item.title} ${item.context} ${item.why}`.toLowerCase().includes(needle)
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [decisions, query, status])

  function handleSave(draft) {
    const now = Date.now()
    const next = {
      id: createId(),
      title: draft.title,
      context: draft.context,
      why: draft.why,
      options: draft.options.map((text) => ({ id: createId(), text })),
      chosenOptionId: null,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    }
    setDecisions((current) => [next, ...current])
    setSelectedId(next.id)
    setView('detail')
  }

  function handleChoose(optionId) {
    setDecisions((current) =>
      current.map((item) => {
        if (item.id !== selectedId) return item
        const alreadyChosen = Boolean(item.chosenOptionId)
        const sameChoice = item.chosenOptionId === optionId
        return {
          ...item,
          chosenOptionId: optionId,
          status: sameChoice ? item.status : alreadyChosen ? 'revisited' : 'chosen',
          updatedAt: Date.now(),
        }
      }),
    )
  }

  function handleStatus(nextStatus) {
    setDecisions((current) =>
      current.map((item) =>
        item.id === selectedId ? { ...item, status: nextStatus, updatedAt: Date.now() } : item,
      ),
    )
  }

  function handleDelete() {
    setDecisions((current) => current.filter((item) => item.id !== selectedId))
    setSelectedId(null)
    setView('list')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Личный архив · 2025</p>
          <h1>Журнал решений</h1>
          <p className="subtitle">Фиксируйте выбор, чтобы потом помнить, почему так сделали.</p>
        </div>
        {view === 'list' ? (
          <button type="button" className="btn" onClick={() => setView('create')}>
            Новое решение
          </button>
        ) : null}
      </header>

      {view === 'list' ? (
        <DecisionList
          items={visible}
          hasAny={decisions.length > 0}
          query={query}
          status={status}
          onQuery={setQuery}
          onStatus={setStatus}
          onOpen={(id) => {
            setSelectedId(id)
            setView('detail')
          }}
          onCreate={() => setView('create')}
        />
      ) : null}

      {view === 'create' ? (
        <DecisionForm onCancel={() => setView('list')} onSave={handleSave} />
      ) : null}

      {view === 'detail' && selected ? (
        <DecisionDetail
          decision={selected}
          onBack={() => setView('list')}
          onChoose={handleChoose}
          onStatus={handleStatus}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  )
}
