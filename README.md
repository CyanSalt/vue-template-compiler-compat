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

compile('your template here', {
  modules: require('vue-template-compiler-compat').modules,
})
```

### Standalone usage

```javascript
const { compile } = require('vue-template-compiler')

compile('your template here', {
  modules: [
    require('vue-template-compiler-compat/modules/model'),
    require('vue-template-compiler-compat/modules/slot')
  ],
})
```

### For `vue-loader@<=15`

```javascript
module.exports = {
  rules: {
    test: /\.vue$/,
    use: [
      {
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            modules: require('vue-template-compiler-compat').modules,
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

#### Why don't we use a directive modifier such as `v-slot:foo.compat` ?

This is because the `vue-template-compiler` actually supports `.` symbols in slot names, which means that `v-slot:foo.compat` will operate on the `foo.compat` slot by default.

### `operator`

This module helps templates to support [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) and [Nullish coalescing Operator](https://github.com/tc39/proposal-nullish-coalescing) proposals.

Before you can use it, you need to **make sure** that `@babel/core` and the corresponding plugins (`@babel/plugin-proposal-optional-chaining` and `@babel/plugin-proposal-nullish-coalescing-operator`) have been installed in your project.

```vue
<template>
  <div>{{ foo?.bar }}</div>
</template>

<!-- will be compiled to (for illustration only) -->

<script>
with (this) {
  return (function () {
    var _foo;
    return _c('div', [_v(_s((_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar))]);
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
    var _foo;
    return _c('div', [_v(_s((_foo = foo) !== null && _foo !== void 0 ? _foo : bar))]);
  })()
}
</script>
```

By default, this module **does not inherit any Babel configuration** from the current project.

#### Customizing Babel

We implicitly expose a more basic `_babel` module to customize the behavior of transforming templates with Babel in detail.

```javascript
const babel = require('vue-template-compiler-compat/modules/_babel')

const myModule = babel({
  iife: true,
  transformOptions: {},
})
```

This function supports the following options:

- `iife`: When specified as `true`, the code will be wrapped with [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and passed to Babel. This is required for plugins that will generate additional variable declarations.

- `transformOptions`: The option object passed to Babel. By default, Babel always recognizes the configuration file in the current project. If you want to prevent this behavior, you can specify `transformOptions.configFile` as `false`.

Note that the interpolation of `vue-template-compiler` dictates that any plugins that generate **global statements cannot be supported** here, such as polyfills of `core-js`. You can use some alternatives, such as [vue-template-babel-compiler](https://github.com/JuniorTour/vue-template-babel-compiler), but we can't guarantee that they will work correctly.
