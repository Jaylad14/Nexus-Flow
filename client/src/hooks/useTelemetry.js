import { useEffect, useRef, useState } from 'react'

// Connects to the backend WebSocket and tracks:
// - readings: raw sensor values, per sensorId
// - filtered: smoothed (moving average) values, per sensorId
// - lastAlert: the most recent threshold-crossing event, or null
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

      if (msg.type === 'telemetry') {
        setReadings((prev) => ({ ...prev, [msg.sensorId]: msg.value }))
      }

      if (msg.type === 'filtered') {
        setFiltered((prev) => ({ ...prev, [msg.sensorId]: msg.value }))
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
