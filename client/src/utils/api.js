const API_URL = 'http://localhost:5000/api'

export async function saveGraph(graphId, payload) {
  const url = graphId ? `${API_URL}/graphs/${graphId}` : `${API_URL}/graphs`
  const method = graphId ? 'PUT' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to save graph')
  }
  return res.json()
}

export async function loadLatestGraph() {
  const res = await fetch(`${API_URL}/graphs`)
  if (!res.ok) return null
  const list = await res.json()
  if (!list.length) return null
  const full = await fetch(`${API_URL}/graphs/${list[0]._id}`)
  if (!full.ok) return null
  return full.json()
}

export async function overrideTemperature(value) {
  const res = await fetch(`${API_URL}/telemetry/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  if (!res.ok) throw new Error('Override failed')
  return res.json()
}

export async function setThreshold(value) {
  const res = await fetch(`${API_URL}/rules/threshold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  if (!res.ok) throw new Error('Failed to update threshold')
  return res.json()
}
