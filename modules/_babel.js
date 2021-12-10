const babel = require('@babel/core')

function trimEnd(string, char) {
  let index = string.length
  do {
    const end = index - 1
    if (string[end] !== char) break
    index = end
  } while (index > 0)
  return string.slice(0, index)
}

module.exports = ({ iife, transformOptions }) => ({
  transformCode(el, code) {
    let input = code
    if (iife) {
      input = `(function(){return ${input}})()`
    }
    const result = babel.transformSync(input, transformOptions)
    let output = result.code
    if (iife) {
      output = trimEnd(output, ';')
    }
    return output
  },
})
