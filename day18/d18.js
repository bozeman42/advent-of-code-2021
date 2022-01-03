const { resolve } = require('path')
const { readFile } = require('../utils')

const USE_EXAMPLE = false

const FILENAME = USE_EXAMPLE ? 'example' : 'input'

const SIDES = {
  LEFT: 'left',
  RIGHT: 'right'
}

const EXPLODE_DEPTH = 4
const SPLIT_LIMIT = 10

class Tree {
  constructor(array) {
    this.tree = new TreeNode(array)
    this.test()
  }

  get magnitude() {
    return this.tree.magnitude
  }

  add(tree) {
    return new Tree([this.tree.getArray(), tree.tree.getArray()])
  }

  test() {
    // console.log('TEST INITIATION', JSON.stringify(this.getArray()))
    let actionOccured = false
    actionOccured = this.testForExplosion()
    if (actionOccured) return this.test()
    actionOccured = this.testForSplit()
    if (actionOccured) return this.test()
  }
  
  testForSplit() {
    let stack = []
    let current = {
      side: null,
      tree: this.tree
    }
    let currentSide = SIDES.LEFT
    stack.push(current)
    do {
      while(!current.tree.leaf) {
        currentSide = SIDES.LEFT
        current = {
          tree: current.tree.left,
          side: currentSide
        }
        if (!current.tree.leaf) {
          stack.push(current)
          continue
        }
      }
      // console.log('testing value:', current.tree.value)
      if (current.tree.value >= SPLIT_LIMIT) {
        current.tree.split()
        return true
      } else {
        current = stack.pop()
        current = {
          tree: current.tree.right,
          side: SIDES.RIGHT
        }
        currentSide = SIDES.RIGHT
        if (!current.tree.leaf) stack.push(current)
      }
    } while (stack.length)
    // console.log('testing value:', current.tree.value)
    if (current.tree.value >= SPLIT_LIMIT) {
      current.tree.split()
      return true
    }
    return false
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
        // console.log('Boom!', current.path, JSON.stringify(current.tree.getArray()))
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
        // console.log(JSON.stringify(this.getArray()))
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
    return JSON.stringify(this.tree.getArray())
  }
}

class TreeNode {
  constructor(value) {
    this.leaf = false
    if (Array.isArray(value)) {
      this.left = value[0].constructor.name === 'TreeNode' ? value[0] : new TreeNode(value[0])
      this.right = value[1].constructor.name === 'TreeNode' ? value[1] : new TreeNode(value[1])
      this.value = null
    } else if (value.constructor.name === 'TreeNode') {
      this.left = value.left
      this.right = value.right
      this.leaf = value.leaf
      this.value = value.value
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

  split() {
    const [left, right] = [Math.floor(this.value / 2), Math.ceil(this.value / 2)]
    // console.log('SPLIT', this.value, `[${left},${right}]`)
    this.leaf = false
    this.left = new TreeNode(left)
    this.right = new TreeNode(right)
    this.value = null
  }

  addRight(n) {
    if (this.leaf) return this.value += n
    this.right.addRight(n)
  }

  get magnitude() {
    if (this.leaf) return this.value
    return 3 * this.left.magnitude + 2 * this.right.magnitude
  }

  getArray() {
    if (this.leaf) return this.value
    return [this.left.getArray(), this.right.getArray()]
  }
}



const input = readFile(resolve(__dirname, `${FILENAME}.txt`))
  .split('\n')
  .map(x => new Tree(JSON.parse(x)))

const result = input.reduce((total, pair) => {
  return total.add(pair)
})

console.log(result.magnitude)

const part2Result = input.reduce((max, line, index, arr) => {
  let newMax = max
  arr.forEach((otherLine, otherIndex) => {
    if (otherIndex !==index){
      let sum = line.add(otherLine)
      let value = sum.magnitude
      newMax = Math.max(value, newMax)
    }
  })
  return newMax
}, 0)

console.log('part 2:', part2Result)