const dirRE = /^v-|^@|^:|^#/

function visit(node, transform) {
  if (node.type === 1) {
    if (node.ifConditions) {
      node.ifConditions.forEach(condition => {
        condition.exp = transform(condition.exp)
      })
    }
    if (node.for) {
      node.for = transform(node.for)
    }
    for (const name of Object.keys(node.attrsMap)) {
      if (dirRE.test(name)) {
        const value = node.attrsMap[name]
        if (value) {
          node.attrsMap[name] = transform(value)
        }
      }
    }
    if (node.children) {
      node.children.forEach(child => {
        visit(child, transform)
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
