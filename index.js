const { composeModules } = require('./utils')

function createCompatModule(options = {}) {
  const modules = []
  if (options.model) {
    modules.push(require('./modules/model'))
  }
  if (options.slot) {
    modules.push(require('./modules/slot'))
  }
  if (options.syntax) {
    switch (options.syntax) {
      case 'babel':
        modules.push(require('./modules/syntax-babel'))
        break
      case 'esbuild':
        modules.push(require('./modules/syntax-esbuild'))
        break
      default:
        modules.push(require('./modules/syntax'))
        break
    }
  }
  return composeModules(modules)
}

module.exports = {
  createCompatModule,
}
