import { useEffect, useRef, useState } from 'react'

// Tracks live values keyed by nodeId — this makes it work for ANY
// sensor/filter/action combination on the canvas, not just one
// hardcoded example. Whatever node the backend says a reading
// belongs to, that's the node we update.
export function useTelemetry() {
  const [readings, setReadings] = useState({})
  const [filtered, setFiltered] = useState({})
  const [lastAlert, setLastAlert] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'telemetry' && msg.nodeId) {
        setReadings((prev) => ({ ...prev, [msg.nodeId]: msg.value }))
      }

      if (msg.type === 'filtered' && msg.nodeId) {
        setFiltered((prev) => ({ ...prev, [msg.nodeId]: msg.value }))
      }

      if (msg.type === 'alert') {
        setLastAlert({ ...msg, id: Date.now() })
      }
    }

    ws.onerror = (err) => console.error('WebSocket error:', err)
    return () => ws.close()
  }, [])

  return { readings, filtered, lastAlert }
}
