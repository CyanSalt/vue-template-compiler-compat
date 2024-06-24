const esbuild = require('esbuild')
const trimEnd = require('lodash.trimend')
const transform = require('./ast-transform')

module.exports = transform(code => {
  try {
    // eslint-disable-next-line no-new-func
    new Function(`return ${code}`)
    return code
  } catch {
    const result = esbuild.transformSync(`(${code})`, {
      loader: 'ts',
    })
    return trimEnd(result.code, ';\n')
  }
})
