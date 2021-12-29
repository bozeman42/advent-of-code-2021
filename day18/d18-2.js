const { resolve } = require('path')
const { readFile } = require('../utils')

const USE_EXAMPLE = true

const FILENAME = USE_EXAMPLE ? 'example' : 'input'

const EXPLODE_DEPTH = 5

class Tree {
  constructor(array) {
    this.tree = new TreeNode('', array)
    this.getArray()
  }

  add(tree) {
    return new Tree([this.tree.getArray(), tree.getArray()])
  }

  getArray() {
    return this.tree.getArray()
  }
}

class TreeNode {
  constructor(path, value) {
    this.path = path
    if (Array.isArray(value)) {
      this.left = new TreeNode(path + 0, value[0])
      this.right = new TreeNode(path + 1, value[1])
      this.value = null
      this.leaf = false
    } else {
      this.left = null
      this.right = null
      this.value = value
      this.leaf = true
    }
  }

  getArray() {
    if (this.leaf) return this.value
    return [this.left.getArray(), this.right.getArray()]
  }
}

const input = readFile(resolve(__dirname, `${FILENAME}.txt`))
  .split('\n')
  .map(line => new Tree(JSON.parse(line)))

console.log(input)

let result = input.reduce((result, pair) => {
  return result.add(pair)
})

console.log(result.tree)
