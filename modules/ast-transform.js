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
    if (node.attrs) {
      node.attrs.forEach(attr => {
        if (attr.dynamic !== undefined) {
          attr.value = transform(attr.value)
        }
      })
    }
    if (node.children) {
      node.children.forEach(child => {
        if (child.type !== 1) {
          visit(child, transform)
        }
      })
    }
    // Skip error checking
    node.attrsMap = {}
  } else if (node.type === 2) {
    node.expression = transform(node.expression)
  }
}

module.exports = transform => ({
  postTransformNode(el) {
    visit(el, transform)
  },
})
