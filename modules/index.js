const { composeModules } = require('../utils')
const model = require('./model')
const slot = require('./slot')

module.exports = composeModules([
  model,
  slot,
])
