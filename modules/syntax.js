function hasModule(mod) {
  try {
    require(mod)
    return true
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
  } catch (err) {
    return false
  }
}

module.exports = (() => {
  if (hasModule('esbuild')) {
    return require('./syntax-esbuild')
  }
  if (hasModule('@babel/core')) {
    return require('./syntax-babel')
  }
  return {}
})()
