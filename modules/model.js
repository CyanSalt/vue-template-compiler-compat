const { setAttr, deleteAttr } = require('../utils')

module.exports = {
  preTransformNode(el) {
    for (const attr of el.attrsList) {
      const matches = attr.name.match(/^v-model:([^.]+)/)
      if (matches) {
        setAttr(el, `v-bind:${matches[1]}.sync`, attr.value)
        deleteAttr(el, attr.name)
      }
    }
  },
}
