const API_URL = 'http://localhost:5000/api'

// Creates a new graph, or updates an existing one if graphId is provided.
// Returns the saved graph document (including its MongoDB _id).
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
