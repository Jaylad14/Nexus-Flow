import { useEffect, useRef, useState } from 'react'

// Connects to the backend WebSocket and tracks the latest
// reading per sensorId. Returns a live-updating object like:
// { "turbine-04.temperature": 78.2 }
export function useTelemetry() {
  const [readings, setReadings] = useState({})
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'telemetry') {
        setReadings((prev) => ({
          ...prev,
          [msg.sensorId]: msg.value,
        }))
      }
    }

    ws.onerror = (err) => console.error('WebSocket error:', err)

    return () => ws.close()
  }, [])

  return readings
}
