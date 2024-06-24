const babel = require('@babel/core')
const trimEnd = require('lodash.trimend')
const transform = require('./code-transform')

module.exports = transform(code => {
  const result = babel.transformSync(`(function(){return ${code}})()`, {
    configFile: false,
    plugins: [
      // Add your plugins here
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  })
  return trimEnd(result.code, ';')
})
