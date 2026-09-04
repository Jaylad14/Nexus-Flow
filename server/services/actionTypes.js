const Alert = require('../models/Alert')



async function fireSMS(node, value, broadcast) {
  console.log(`📱 SMS to ${node.data.target || 'unknown'}: value hit ${value}`)
  await Alert.create({ sensorId: node.id, value, threshold: 0, status: 'active' })
  broadcast({ type: 'alert', actionType: 'sms', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

async function fireWebhook(node, value, broadcast) {
  console.log(`🔗 Webhook fired: ${node.data.target || 'no URL set'} with value ${value}`)
  await Alert.create({ sensorId: node.id, value, threshold: 0, status: 'active' })
  broadcast({ type: 'alert', actionType: 'webhook', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

async function fireShutoff(node, value, broadcast) {
  console.log(`🛑 SHUTOFF triggered on ${node.data.label} at value ${value}`)
  await Alert.create({ sensorId: node.id, value, threshold: 0, status: 'active' })
  broadcast({ type: 'alert', actionType: 'shutoff', nodeId: node.id, label: node.data.label, value, timestamp: new Date() })
}

async function fireAction(actionLabel, node, value, broadcast) {
  if (actionLabel === 'SMS alert') return fireSMS(node, value, broadcast)
  if (actionLabel === 'Webhook') return fireWebhook(node, value, broadcast)
  if (actionLabel === 'Shutoff valve') return fireShutoff(node, value, broadcast)
  return fireSMS(node, value, broadcast)
}

module.exports = { fireAction }
