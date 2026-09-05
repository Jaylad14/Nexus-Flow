const fetch = require('node-fetch')
const Alert = require('../models/Alert')

async function fireSMS(node, value, broadcast) {
  console.log(`📱 SMS to ${node.data.target || 'unknown'}: value hit ${value}`)
  await Alert.create({ nodeId: node.id, nodeLabel: node.data.label, actionType: 'sms', value, status: 'active' })
  broadcast({ type: 'alert', actionType: 'sms', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

// Genuinely sends an HTTP POST to whatever URL is set in the node's
// "target" field. If the request fails (bad URL, network issue),
// it's logged but doesn't crash the engine — one failed delivery
// shouldn't stop the whole rule from running.
async function fireWebhook(node, value, broadcast) {
  const url = node.data.target
  console.log(`🔗 Webhook firing to ${url || 'no URL set'} with value ${value}`)

  if (url && url.startsWith('http')) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: node.data.label,
          value,
          triggeredAt: new Date().toISOString(),
        }),
      })
      console.log(`✅ Webhook delivered — status ${res.status}`)
    } catch (err) {
      console.error(`❌ Webhook delivery failed: ${err.message}`)
    }
  } else {
    console.log('⚠️  No valid URL set on this Webhook node — skipping real delivery')
  }

  await Alert.create({ nodeId: node.id, nodeLabel: node.data.label, actionType: 'webhook', value, status: 'active' })
  broadcast({ type: 'alert', actionType: 'webhook', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

async function fireShutoff(node, value, broadcast) {
  console.log(`🛑 SHUTOFF triggered on ${node.data.label} at value ${value}`)
  await Alert.create({ nodeId: node.id, nodeLabel: node.data.label, actionType: 'shutoff', value, status: 'active' })
  broadcast({ type: 'alert', actionType: 'shutoff', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

async function fireAction(actionLabel, node, value, broadcast) {
  if (actionLabel === 'SMS alert') return fireSMS(node, value, broadcast)
  if (actionLabel === 'Webhook') return fireWebhook(node, value, broadcast)
  if (actionLabel === 'Shutoff valve') return fireShutoff(node, value, broadcast)
  return fireSMS(node, value, broadcast)
}

module.exports = { fireAction }
