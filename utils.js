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

module.exports = {
  setAttr,
  deleteAttr,
}
