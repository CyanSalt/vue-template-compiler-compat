const esbuild = require('esbuild')
const trimEnd = require('lodash.trimend')
const transform = require('./code-transform')

module.exports = transform(code => {
  const result = esbuild.transformSync(`(${code})`, {
    target: 'es2019',
  })
  return trimEnd(result.code, ';\n')
})
