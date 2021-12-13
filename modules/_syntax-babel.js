const babel = require('@babel/core')
const trimEnd = require('lodash.trimend')
const { isStandaloneNode } = require('../utils')

module.exports = {
  transformCode(el, code) {
    // Reduce repeated compilation
    if (!isStandaloneNode(el)) return code
    const result = babel.transformSync(`(function(){return ${code}})()`, {
      configFile: false,
      plugins: [
        // Add your plugins here
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
      ],
    })
    return trimEnd(result.code, ';')
  },
}
