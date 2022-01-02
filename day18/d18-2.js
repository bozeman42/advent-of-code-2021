const { resolve } = require('path')
const { readFile } = require('../utils')

const USE_EXAMPLE = true

const FILENAME = USE_EXAMPLE ? 'example' : 'input'

const EXPLODE_DEPTH = 4

class Tree {
  constructor(array) {
    this.tree = new TreeNode(array)
    this.getArray()
    this.test()
  }

  add(tree) {
    this.tree = new TreeNode([this.tree, tree.tree])
    this.test()
    return this
  }

  test() {
    let actionOccured = false
    actionOccured = this.testForExplosion()
    if (actionOccured) return this.test()
    actionOccured = this.testForSplit()
    if (actionOccured) return this.test()
  }
  
  testForSplit() {
    // implement test for split
  }

  testForExplosion() {
    let stack = []
    let explosion = false
    let current = {
      path: '',
      tree: this.tree
    }
    stack.push(current)
    do {
      if (current.tree.leaf && stack.length) current = stack.pop()
      while(!current.tree.leaf) {
        current = {
          path: current.path + '0',
          tree: current.tree.left
        }
        if (!current.tree.leaf) {
          stack.push(current)
          continue
        }
      }
      if (current.path.length > EXPLODE_DEPTH) {
        current = stack.pop()
        const { tree: {left: { value: left }, right: {value: right}}, path } = current
        const parentPosition = path[path.length - 1]
        this.prune(path)
        current = stack.pop()
        if (parentPosition === '0') {
          current.tree.right.addLeft(right)
        } else {
          current.tree.left.addRight(left)
        }
        while (stack.length && current.path[current.path.length - 1] === parentPosition) {
          current = stack.pop()
        }
        if (stack.length) {
          current = stack.pop()
          if (parentPosition === '0') {
            current.tree.left.addRight(left)
          } else {
            current.tree.right.addLeft(right)
          }
        }
        console.log(JSON.stringify(this.getArray()))
        return true
      } else {
        current = stack.pop()
        stack.push(current)
        current = {
          path: current.path + '1',
          tree: current.tree.right
        }
        if (!current.tree.leaf) stack.push(current)
      }
      if (this.getLastPathItem(current) === '1' && current.tree.leaf) {
        while(current.path[current.path.length - 1] === '1') {
          current = stack.pop()
        }
      }
    } while (stack.length)
    return false
  }

  getLastPathItem(item) {
    return item.path[item.path.length - 1]
  }

  prune(path) {
    let current = this.tree
    let i
    for(i = 0; i < path.length - 1; i++) {
      if (path[i] === '0') {
        current = current.left
      } else {
        current = current.right
      }
    }
    path[i] === '0'
      ? current.left = new TreeNode(0)
      : current.right = new TreeNode(0)
  }

  getArray() {
    return this.tree.getArray()
  }
}

class TreeNode {
  constructor(value) {
    this.leaf = false
    if (Array.isArray(value)) {
      this.left = value[0].constructor.name === 'TreeNode' ? value[0] : new TreeNode(value[0])
      this.right = value[1].constructor.name === 'TreeNode' ? value[1] : new TreeNode(value[1])
      this.value = null
    } else {
      this.left = null
      this.right = null
      this.value = value
      if (typeof value === 'number') {
        this.leaf = true
      }
    }
  }

  addLeft(n) {
    if (this.leaf) return this.value += n
    this.left.addLeft(n)
  }

  addRight(n) {
    if (this.leaf) return this.value += n
    this.right.addRight(n)
  }

  getArray() {
    if (this.leaf) return this.value
    return [this.left.getArray(), this.right.getArray()]
  }
}

const input = readFile(resolve(__dirname, `${FILENAME}.txt`))
  .split('\n')
  .map(line => new Tree(JSON.parse(line)))

let result = input.reduce((result, pair) => {
  return result.add(pair)
})

console.log(JSON.stringify(result.getArray()))
