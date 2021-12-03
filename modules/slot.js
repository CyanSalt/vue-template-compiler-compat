const { setAttr, deleteAttr } = require('../utils')

module.exports = {
  preTransformNode(el) {
    if (el.tag !== 'template') return
    for (const attr of el.attrsList) {
      let slot
      if (attr.name === 'v-slot') {
        slot = 'default'
      } else {
        const matches = attr.name.match(/^(?:v-slot:|#)([^.]+)/)
        if (matches) {
          slot = matches[1]
        }
      }
      if (slot && attr.value === '' && el.attrsMap.slot === '') {
        setAttr(el, 'slot', slot)
        deleteAttr(el, attr.name)
      }
    }
  },
}
