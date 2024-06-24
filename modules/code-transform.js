const { isStandaloneNode } = require('../utils')

module.exports = transform => ({
  postTransformNode(el) {
    if (el.ifConditions && isStandaloneNode(el)) {
      el.ifConditions.forEach(condition => {
        if (condition.exp) {
          condition.exp = transform(condition.exp)
        }
      })
    }
  },
  transformCode(el, code) {
    // Reduce repeated compilation
    if (!isStandaloneNode(el)) return code
    return transform(code)
  },
})
