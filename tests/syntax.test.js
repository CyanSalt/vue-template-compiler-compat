const { describe, expect, it } = require('@jest/globals')
const { compile } = require('vue-template-compiler')
const syntax = require('../modules/syntax')

describe('syntax', () => {

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
        errors: [],
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
        errors: [],
      }),
    )
  })

})
