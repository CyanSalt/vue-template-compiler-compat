module.exports = {
  root: true,
  extends: [
    '@cyansalt/preset',
  ],
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
