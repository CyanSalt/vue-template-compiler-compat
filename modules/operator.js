const babel = require('./_babel')

module.exports = babel({
  iife: true,
  transformOptions: {
    configFile: false,
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  },
})
