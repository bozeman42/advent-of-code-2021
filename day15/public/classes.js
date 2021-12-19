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
  constructor(field, scale, ctx) {
    this.field = field
    this.sourceKey = this.getKey([0,0])
    this.destination = this.getKey([field.length - 1, field[0].length - 1])
    this.queue = new Heap('min')
    this.scale = scale
    this.pathImages = []
    this.ctx = ctx
    this.paths = []
    this.nodes = this.buildNodes(field)
    this.createFieldImage(field)
    this.createEndpointImage()
    this.drawField()
  }

  createFieldImage(field) {
    const buffer = document.createElement('canvas')
    const ctx = buffer.getContext('2d')
    buffer.height = this.field.length * this.scale
    buffer.width = this.field[0].length * this.scale
    field.forEach((line, row) => {
      line.forEach((value, col) => {
        ctx.fillStyle = `rgb(0, 0, ${255 - (255 * value / 9)})`
        ctx.fillRect(col * this.scale, row * this.scale, this.scale, this.scale)
      })
    })
    this.fieldImage = buffer
  }
  
  createEndpointImage() {
    const [x, y] = this.sourceKey.split(':').map(x => parseInt(x))
    const [x2, y2] = this.destination.split(':').map(x => parseInt(x))
    const buffer = document.createElement('canvas')
    const ctx = buffer.getContext('2d')
    buffer.height = this.field.length * this.scale
    buffer.width = this.field[0].length * this.scale
    ctx.beginPath()
    ctx.arc(x * this.scale, y * this.scale, 5 * this.scale, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x2 * this.scale, y2 * this.scale, 5 * this.scale, 0, 2 * Math.PI)
    ctx.fillStyle = 'green'
    ctx.fill()
    this.endPointImage = buffer
  }


  drawEndpoints() {
    this.ctx.drawImage(this.endPointImage,0,0)
  }

  clearPaths() {
    this.pathImages = []
    this.paths = []
  }

  clearQueue() {
    this.queue = new Heap('min')
  }

  setSource(x, y) {
    this.sourceKey = this.getKey([x, y])
    this.createEndpointImage()
  }

  setDestination(x, y) {
    this.destination = this.getKey([x, y])
    this.createEndpointImage()
  }



  go(x, y, x2, y2) {
    this.clearPaths()
    this.clearQueue()
    this.setSource(x, y)
    this.setDestination(x2, y2)
    this.buildNodes()
    this.testVertex(this.getKey([x, y]))
  }

  buildNodes() {
    console.time('build nodes')
    this.nodes = {}
    for(let y = 0; y < this.field.length; y++) {
      for(let x = 0;x < this.field[0].length; x++) {
        this.nodes[this.getKey([x, y])] = {
          value: Infinity,
          visited: false,
          weight: this.field[y][x],
          prevKey: undefined,
          key: this.getKey([x, y])
        }
      }
    }
    this.nodes[this.sourceKey].value = 0
    this.nodes[this.sourceKey].weight = 0
    console.timeEnd('build nodes')
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

  savePath(node) {
    let key = node.key
    const path = [key.split(':').map(x => parseInt(x))]
    while (key) {
      path.push(key.split(':').map(x => parseInt(x)))
      key = this.nodes[key].prevKey
    }
    this.paths.push(path)
  }

  savePathImage(path) {
    const buffer = document.createElement('canvas')
    const ctx = buffer.getContext('2d')
    buffer.height = this.field.length * this.scale
    buffer.width = this.field[0].length * this.scale
    this.renderPath(path, ctx)
    this.pathImages.push(buffer)
  }

  renderPaths() {
    this.paths.forEach(path => this.savePathImage(path))
  }

  renderPath(path, ctx) {
    for(let i = 0; i < path.length; i++) {
      const [x, y] = path[path.length - i - 1]
      ctx.fillStyle = 'rgba(255,0,0, 1)'
      ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale)
    }
  }

  drawPath(i) {
    this.ctx.drawImage(this.pathImages[i],0,0)
  }

  drawField() {
    this.ctx.drawImage(this.fieldImage, 0, 0)
    this.drawEndpoints()
  }

  draw(i) {
    this.drawField()
    this.drawPath(i)
  }

  testVertex(vertexKey){
    const { nodes, queue } = this
    nodes[vertexKey].visited = true
    queue.addItem(nodes[vertexKey])
    let latest = null
    let counter = 0
    while(queue.heap.length && queue.heap[0].key !== this.destination) {
      // for(let i = 0; i < 7; i++) {
      const least = queue.extract()
      if (counter % 100 === 0) {
        least.value
        this.savePath(least)
      }
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
    this.savePath(destination)
    this.renderPaths()
    console.log('Done!', counter)
  }
}

class Layer {
  constructor(width, height) {
    this.canvas = document.createElement('canvas')
    this.ctx = canvas.getContext('2d')
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
  }
}