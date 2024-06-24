const { describe, expect, it } = require('@jest/globals')
const { compile } = require('vue-template-compiler')
const typescript = require('../modules/typescript')

describe('operator', () => {

  it('should work properly', () => {
    expect(
      compile('<div>{{ foo!.bar }}</div>', {
        modules: [typescript],
      }),
    ).toEqual(
      expect.objectContaining({
        render: expect.not.stringContaining('!.'),
        staticRenderFns: expect.not.arrayContaining([
          expect.stringContaining('!.'),
        ]),
      }),
    )

    expect(
      compile('<div>{{ foo as (string | number) }}</div>', {
        modules: [typescript],
      }),
    ).toEqual(
      expect.objectContaining({
        render: expect.not.stringContaining('number'),
        staticRenderFns: expect.not.arrayContaining([
          expect.stringContaining('number'),
        ]),
      }),
    )
  })

})
