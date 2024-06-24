const esbuild = require('esbuild')
const trimEnd = require('lodash.trimend')
const transform = require('./syntax-transform')

module.exports = transform(code => {
  const result = esbuild.transformSync(`(function(){return ${code}})()`, {
    loader: 'ts',
  })
  return trimEnd(result.code, ';\n')
})
