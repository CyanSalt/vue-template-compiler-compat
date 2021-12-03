module.exports = {
  root: true,
  extends: [
    '@cyansalt',
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
