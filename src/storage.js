const STORAGE_KEY = 'decision-journal.v1'

export function loadDecisions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveDecisions(decisions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions))
}

export function createId() {
  return crypto.randomUUID()
}
