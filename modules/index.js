const { composeModules } = require('../utils')
const model = require('./model')
const slot = require('./slot')
const syntax = require('./syntax')

module.exports = composeModules([
  model,
  slot,
  syntax,
])
