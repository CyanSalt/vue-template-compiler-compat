const { composeModules } = require('../utils')
const model = require('./model')
const operator = require('./operator')
const slot = require('./slot')

module.exports = composeModules([
  model,
  slot,
  operator,
])
