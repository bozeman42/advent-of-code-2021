const fs = require('fs')

const readFile = filename => {
  return fs.readFileSync(filename).toString()
}

class Heap {
  constructor(type, arr = []) {
    this.heap = []
    this.pos = 0
    this.type = type
    for (let i = 0; i < arr.length; i++) {
      this.addItem(arr[i])
    }
  }

  addItem(item) {
    let pos = this.pos
    this.pos++
    this.heap.push(item)
    if (pos === 0) return
    while (this.testParent(pos)) {
      this.siftUp(pos)
      pos = this.parent(pos)
    }
  }

  extract() {
    const value = this.heap[0]
    this.heap[0] = this.heap[this.pos -1]
    this.pos--
    this.heap.length -= 1
    this.fixRoot()
    this.fixRoot()
    return value
  }

  fixRoot() {
    let pos = 0
    while(this.childrenViolate(pos)) {
      const siftChild = this.priorityChild(pos)
      const [a, b] = this.children(pos)
      this.siftDown(pos, siftChild)
      pos = siftChild
    }
  }

  value(position) {
    return this.heap[position].value
  }

  item(position) {
    return this.heap[position]
  }

  priorityChild(parent) {
    const [child1, child2] = this.children(parent)
    if (this.item(child1) === undefined && this.item[child2] === undefined) throw new Error('Invalid call of priorityChild')
    if (this.item(child1) === undefined) return child2
    if (this.item(child2) === undefined) return child1
    const sort = this.type === 'min' ? (a, b) => a < b : (a, b) => a > b
    return sort(this.value(child1), this.value(child2)) ? child1 : child2
  }
    
  childrenViolate(pos) {
    let children = this.children(pos)

    return this.heapViolated(this.heap[pos], this.heap[children[0]])
      || this.heapViolated(this.heap[pos], this.heap[children[1]])
  }

  testParent(position) {
    if (position === 0) return false
    const value = this.heap[position].value
    const parent = this.heap[this.parent(position)].value
    return this.heapViolated(parent, value)
  }

  parent(position) {
    return Math.floor((position - 1) / 2)
  }

  children(position) {
    return [2 * position + 1, 2 * position + 2]
  }

  siftDown(parent, child) {
    const temp = this.heap[parent]
    this.heap[parent] = this.heap[child]
    this.heap[child] = temp
  }

  siftUp(position) {
    const parent = this.heap[this.parent(position)]
    this.heap[this.parent(position)] = this.heap[position]
    this.heap[position] = parent
  }

  heapViolated(parent, child) {
    if (parent === undefined || child === undefined) return false
    return this.type === 'min' ? parent.value > child.value : parent.value < child.value
  }
}

class PathFinder {
  constructor(field) {
    this.nodes = this.buildNodes(field)
    this.sourceKey = this.getKey([0,0])
    this.destination = this.getKey([field.length - 1, field.length - 1])
    this.queue = new Heap('min')
  }

  buildNodes(field) {
    let nodes = {}
    for(let y = 0; y < field.length; y++) {
      for(let x = 0;x < field[0].length; x++) {
        nodes[this.getKey([x, y])] = {
          value: Infinity,
          visited: false,
          weight: field[y][x],
          prevKey: undefined,
          key: this.getKey([x, y])
        }
      }
    }
    nodes['0:0'].value = 0
    nodes['0:0'].weight = 0

    return nodes
  }

  getKey([x, y]) {

    return `${x}:${y}`
  }

  getNeighbors(key) {
    const [x, y] = key.split(':').map(x => parseInt(x))
    const up = this.nodes[this.getKey([x, y - 1])]
    const down = this.nodes[this.getKey([x, y + 1])]
    const right = this.nodes[this.getKey([x + 1, y])]
    const left = this.nodes[this.getKey([x - 1, y])]
    
    return [up, down, left, right]
  }

  testVertex(vertexKey){
    const { nodes, queue } = this
    nodes[vertexKey].visited = true
    queue.addItem(nodes[vertexKey])
    console.log('length before', queue.heap.length)
    let latest = null
    let counter = 0
    while(queue.heap.length && queue.heap[0].key !== this.destination) {
      // for(let i = 0; i < 7; i++) {
      const least = queue.extract()
      latest = least
      const neighbors = this.getNeighbors(least.key).filter(item => {  
        return item !== undefined
      })
      this.nodes[least.key].visited = true
      neighbors.forEach(neighbor => {
        if (neighbor.value > least.value + neighbor.weight) {
          this.nodes[neighbor.key].prevKey = least.key
          this.nodes[neighbor.key].value = least.value + neighbor.weight
          this.queue.addItem(this.nodes[neighbor.key])
        }
      })
      counter++
    }
    const destination = queue.extract()
    console.log(counter, destination)
    let key = latest.key
    let path = [key.split(':').map(x => parseInt(x))]
    while (key) {
      console.log(this.nodes[key].key, this.nodes[key].weight, this.nodes[key].value)
      path.push(key.split(':').map(x => parseInt(x)))
      key = this.nodes[key].prevKey
    }
    console.log(path)
  }
}

module.exports = {
  readFile,
  Heap,
  PathFinder
}