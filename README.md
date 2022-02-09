# vue-template-compiler-compat

Provide compatibility for Vue 2 template compiler.

Note that this is **NOT** an official library of Vue.

## Installation

```shell
npm install --dev vue-template-compiler-compat
```

## Usage

```javascript
const { compile } = require('vue-template-compiler')
const { createCompatModule } = require('vue-template-compiler-compat')

compile('your template here', {
  modules: [
    createCompatModule({
      model: true,
      syntax: true,
    }),
  ],
})
```

### Standalone usage

```javascript
const { compile } = require('vue-template-compiler')

compile('your template here', {
  modules: [
    require('vue-template-compiler-compat/modules/model'),
    require('vue-template-compiler-compat/modules/syntax')
  ],
})
```

### For `vue-loader@<=15`

```javascript
const { createCompatModule } = require('vue-template-compiler-compat')

module.exports = {
  rules: {
    test: /\.vue$/,
    use: [
      {
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            modules: [
              createCompatModule({
                model: true,
                syntax: true,
              }),
            ],
          },
        },
      },
    ],
  },
}
```

## Modules

### `model`

This module compiles the `v-model` syntax from Vue 3 to the format supported by Vue 2.

```vue
<template>
  <Foo v-model:bar="baz"></Foo>
</template>

<!-- will be compiled to -->

<template>
  <Foo v-bind:bar.sync="baz"></Foo>
</template>
```

**It will not affect the `v-model` without argument**. Although `v-model` without argument differs in Vue 3 from Vue 2, we recommend that you use the `model` option to shim at runtime, rather than doing it during compilation.

```javascript
const Foo = {
  // This is set up to ensure consistent behavior with Vue 3
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
}
```

In addition, **it will also ignore any modifiers to the `v-model` that are compiled.** Because the modifier only works for `input` elements in Vue 2, however, `input` does not support `v-model` directives with argument.

For custom modifiers, you can pass them in manually to maintain compatibility between Vue 2 and Vue 3.

```vue
<template>
  <Foo v-model:bar="baz" :model-modifiers="{ qux: true }"></Foo>
</template>
```

#### Solving ESLint Errors

If you are using `eslint-plugin-vue` and extend the `plugin:vue/essential`, you will need to manually turn off the following rules:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'vue/no-v-model-argument': 'off',
  },
}
```

Don't worry, it won't cause significant problems because another rule `vue/valid-v-model` guarantees the legality of the directive.

### `slot`

This module provides compatible syntax of slots for Vue 2.6 and previous versions.

Slot data generated with the `v-slot` syntax is only available via `$scopedSlots` in Vue 2. For some early component libraries (such as [`element-ui`](https://github.com/ElemeFE/element)), this behavior may not be implemented for some components. In these scenarios, we can only use the deprecated `slot` syntax, but this is not conducive to migration to Vue 3.

We chose an edge case that matches the syntax of Vue 2.6 and Vue 3, compiling it to the old `slot` syntax.

```vue
<template>
  <Foo>
    <template #header slot>
      <Bar />
    </template>
  </Foo>
</template>

<!-- will be compiled to -->

<template>
  <Foo>
    <template slot="header">
      <Bar />
    </template>
  </Foo>
</template>
```

Setting the `slot` attribute with empty value on a `template` element with a `v-slot` directive will be ignored in the default compilation syntax. For `v-slot` directives on non-template elements, **this module will not handle them**, since no such compatible syntax exists.

This module works with both the `v-slot` directive and its abbreviation `#`.

#### Why not use a directive modifier such as `v-slot:foo.compat` ?

This is because the `vue-template-compiler` actually supports `.` symbols in slot names, which means that `v-slot:foo.compat` will operate on the `foo.compat` slot by default.

### `syntax`

This module helps templates to support the latest ECMAScript syntax, such as [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) and [Nullish coalescing Operator](https://github.com/tc39/proposal-nullish-coalescing) proposals.

Before you can use it, you need to **make sure** that either [`esbuild`](https://www.npmjs.com/package/esbuild) or [`Babel`](https://www.npmjs.com/package/@babel/core) have been installed in your project. To make it easier to manage versions, `esbuild` or `@babel/core` are not included in the dependencies by default.

```vue
<template>
  <div>{{ foo?.bar }}</div>
</template>

<!-- will be compiled to (for illustration only) -->

<script>
with (this) {
  return (function () {
    return _c('div', [_v(_s(foo == null ? void 0 : foo.bar))]);
  })()
}
</script>
```

```vue
<template>
  <div>{{ foo ?? bar }}</div>
</template>

<!-- will be compiled to (for illustration only) -->

<script>
with (this) {
  return (function () {
    return _c("div", [_v(_s(foo != null ? foo : bar))])
  })()
}
</script>
```

By default, this module **does not inherit any Babel configuration** from the current project.

#### Why `esbuild` is more recommended than Babel?

Simply, to reduce **configuration costs**. When using Babel as a transformer, not only we should care about the preset or plugin you need to use, but that configuration may become obsolete with new syntax.

Nevertheless, we've also made the Babel-based implementation available as `modules/syntax-babel`, which you can use or write your own module based on it. In addition, there is a lower-level `modules/syntax-transform` module that completes the syntax compilation process with the help of a custom transformer.

As a reference, the results of my tests on a huge private project are as follows (For Babel, with only Optional Chaining and Nullish coalescing Operator proposals enabled):

- Without transformer: 328.104s
- Using Babel as transformer: 340.078s (+3.65%)
- Using esbuild as transformer: 338.509s (+3.17%)

*All the above times refer to CPU time, i.e. not considering multi-core performance.*

#### Why not provide it as a custom compiler?

Because `vue-template-compiler` only supports compilers in object format (not module paths in string), which makes it impossible to share this configuration within threads when using the `thread-loader` with the default configuration of the Vue CLI.
