const { compile } = require('vue-template-compiler')
const slot = require('../modules/slot')

describe('slot', () => {

  it('should work properly', () => {
    expect(
      compile('<Foo><template v-slot:bar slot><Qux /></template></Foo>', {
        modules: [slot],
      }),
    ).toEqual(
      compile('<Foo><template slot="bar"><Qux /></template></Foo>'),
    )
  })

  it('should not compile v-slot without an empty slot attr', () => {
    expect(
      compile('<Foo><template v-slot:bar><Qux /></template></Foo>', {
        modules: [slot],
      }),
    ).toEqual(
      compile('<Foo><template v-slot:bar><Qux /></template></Foo>'),
    )

    expect(
      compile('<Foo><template v-slot:bar slot="baz"><Qux /></template></Foo>', {
        modules: [slot],
      }),
    ).toEqual(
      compile('<Foo><template v-slot:bar slot="baz"><Qux /></template></Foo>'),
    )
  })

  it('should also compile v-slot without arg', () => {
    expect(
      compile('<Foo><template v-slot slot><Qux /></template></Foo>', {
        modules: [slot],
      }),
    ).toEqual(
      compile('<Foo><template slot="default"><Qux /></template></Foo>'),
    )
  })

})
