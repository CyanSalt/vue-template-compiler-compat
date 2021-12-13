const esbuild = require('esbuild')
const trimEnd = require('lodash.trimend')
const { isStandaloneNode } = require('../utils')

module.exports = {
  transformCode(el, code) {
    // Reduce repeated compilation
    if (!isStandaloneNode(el)) return code
    const result = esbuild.transformSync(code, {
      target: 'es2019',
    })
    return trimEnd(result.code, ';\n')
  },
}
