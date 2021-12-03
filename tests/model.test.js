const { compile } = require('vue-template-compiler')
const model = require('../modules/model')

describe('model', () => {

  it('should work properly', () => {
    expect(
      compile('<Foo v-model:bar="baz"></Foo>', {
        modules: [model],
      }),
    ).toEqual(
      compile('<Foo v-bind:bar.sync="baz"></Foo>'),
    )
  })

  it('should not compile v-model without arg', () => {
    expect(
      compile('<Foo v-model="baz"></Foo>', {
        modules: [model],
      }),
    ).toEqual(
      compile('<Foo v-model="baz"></Foo>'),
    )
  })

})
