import { useEffect, useRef, useState } from 'react'

const MAX_HISTORY = 40

export function useTelemetry() {
  const [readings, setReadings] = useState({})
  const [filtered, setFiltered] = useState({})
  const [lastAlert, setLastAlert] = useState(null)
  const [history, setHistory] = useState({})   // { [nodeId]: [values...] }
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'telemetry' && msg.nodeId) {
        setReadings((prev) => ({ ...prev, [msg.nodeId]: msg.value }))

        setHistory((prev) => {
          const existing = prev[msg.nodeId] || []
          const next = [...existing, msg.value].slice(-MAX_HISTORY)
          return { ...prev, [msg.nodeId]: next }
        })
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

  return { readings, filtered, lastAlert, history }
}
