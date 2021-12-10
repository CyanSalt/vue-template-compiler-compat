function setAttr(el, name, value) {
  const index = el.attrsList.findIndex(item => item.name === name)
  if (index !== -1) {
    el.attrsList[index].value = value
  } else {
    el.attrsList.push({ name, value })
  }
  el.attrsMap[name] = value
}

function deleteAttr(el, name) {
  const index = el.attrsList.findIndex(item => item.name === name)
  if (index !== -1) {
    el.attrsList.splice(index, 1)
  }
  delete el.attrsMap[name]
}

function pluckModuleFunction(modules, key) {
  return modules ? modules.map(m => m[key]).filter(fn => fn) : []
}

function composeModules(modules) {
  const mod = {}
  const preTransformNodeFns = pluckModuleFunction(modules, 'preTransformNode')
  if (preTransformNodeFns.length) {
    mod.preTransformNode = function (el, options) {
      for (let i = 0; i < preTransformNodeFns.length; i++) {
        el = preTransformNodeFns[i](el, options) || el
      }
      return el
    }
  }
  const transformNodeFns = pluckModuleFunction(modules, 'transformNode')
  if (transformNodeFns.length) {
    mod.transformNode = function (el, options) {
      for (let i = 0; i < transformNodeFns.length; i++) {
        el = transformNodeFns[i](el, options) || el
      }
      return el
    }
  }
  const postTransformNodeFns = pluckModuleFunction(modules, 'postTransformNode')
  if (postTransformNodeFns.length) {
    mod.postTransformNode = function (el, options) {
      for (let i = 0; i < postTransformNodeFns.length; i++) {
        postTransformNodeFns[i](el, options)
      }
    }
  }
  const transformCodeFns = pluckModuleFunction(modules, 'transformCode')
  if (transformCodeFns.length) {
    mod.transformCode = function (el, code) {
      for (let i = 0; i < transformCodeFns.length; i++) {
        code = transformCodeFns[i](el, code)
      }
      return code
    }
  }
  const genDataFns = pluckModuleFunction(modules, 'genData')
  if (genDataFns.length) {
    mod.genData = function (el) {
      let data = ''
      for (let i = 0; i < genDataFns.length; i++) {
        data += genDataFns[i](el)
      }
      return data
    }
  }
  return mod
}

module.exports = {
  setAttr,
  deleteAttr,
  composeModules,
}
