const { compile } = require('vue-template-compiler')
const operator = require('../modules/operator')

describe('operator', () => {

  it('should work properly', () => {
    expect(
      compile('<div>{{ foo?.bar }}</div>', {
        modules: [operator],
      }).render,
    ).toEqual(
      expect.not.stringContaining('?.'),
    )

    expect(
      compile('<div>{{ foo ?? bar }}</div>', {
        modules: [operator],
      }).render,
    ).toEqual(
      expect.not.stringContaining('??'),
    )
  })

})
