const model = require('./model')
const slot = require('./slot')

module.exports = {
  preTransformNode(el, options) {
    model.preTransformNode(el, options)
    slot.preTransformNode(el, options)
  },
}
