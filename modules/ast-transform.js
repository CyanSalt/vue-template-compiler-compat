const { setAttr } = require('../utils')

const dirRE = /^v-|^@|^:|^#/

function visit(node, transform) {
  if (node.type === 1) {
    if (node.ifConditions) {
      node.ifConditions.forEach(condition => {
        if (condition.exp) {
          condition.exp = transform(condition.exp)
        }
      })
    }
    if (node.for) {
      node.for = transform(node.for)
    }
    for (const { name, value } of node.attrsList) {
      if (dirRE.test(name)) {
        setAttr(node, name, transform(value))
      }
    }
    if (node.children) {
      node.children.forEach(child => {
        if (child.type !== 1) {
          visit(child, transform)
        }
      })
    }
  } else if (node.type === 2) {
    node.expression = transform(node.expression)
  }
}

module.exports = transform => ({
  transformNode(el) {
    visit(el, transform)
  },
})
