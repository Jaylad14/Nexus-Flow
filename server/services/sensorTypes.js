const PROFILES = {
  Temperature: { base: 71, min: 68, max: 84, step: 1.2, unit: 'C' },
  Pressure:    { base: 4.2, min: 3.5, max: 6.0, step: 0.15, unit: 'bar' },
  RPM:         { base: 1500, min: 1200, max: 1900, step: 40, unit: 'rpm' },
}

function getProfile(label) {
  return PROFILES[label] || PROFILES.Temperature
}

const overrides = {}

function setOverride(nodeId, value) {
  overrides[nodeId] = Number(value)
}

function createGenerator(label, nodeId) {
  const profile = getProfile(label)
  let current = profile.base
  let direction = 1

  return function next() {
    if (overrides[nodeId] !== undefined) {
      current = overrides[nodeId]
      delete overrides[nodeId]
      return current
    }

    const spike = Math.random() < 0.15
    const magnitude = spike ? Math.random() * profile.step * 3 : Math.random() * profile.step
    current += magnitude * direction
    current = Math.round(current * 100) / 100

    if (current > profile.max) direction = -1
    if (current < profile.min) direction = 1

    return current
  }
}

module.exports = { createGenerator, getProfile, setOverride }
