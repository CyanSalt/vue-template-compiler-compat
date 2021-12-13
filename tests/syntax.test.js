const { compile } = require('vue-template-compiler')
const syntax = require('../modules/syntax')

describe('operator', () => {

  it('should work properly', () => {
    expect(
      compile('<div>{{ foo?.bar }}</div>', {
        modules: [syntax],
      }),
    ).toEqual(
      expect.objectContaining({
        render: expect.not.stringContaining('?.'),
        staticRenderFns: expect.not.arrayContaining([
          expect.stringContaining('?.'),
        ]),
      }),
    )

    expect(
      compile('<div>{{ foo ?? bar }}</div>', {
        modules: [syntax],
      }),
    ).toEqual(
      expect.objectContaining({
        render: expect.not.stringContaining('??'),
        staticRenderFns: expect.not.arrayContaining([
          expect.stringContaining('??'),
        ]),
      }),
    )
  })

})
