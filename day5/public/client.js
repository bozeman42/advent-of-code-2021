const input = data.split('\n')
  .map(line => {
    return line.split(' -> ')
      .map(string => string.split(','))
      .map(item => ({
        x: item[0],
        y: item[1]
      }))
  })

const p1Input = input
  .filter(line => {
    const [p1, p2] = line
    return p1.x === p2.x || p1.y === p2.y
  })
const p2Input = input

  class Line {
    constructor(endpoints) {
      const [p1, p2] = endpoints
      p1.x = parseInt(p1.x)
      p1.y = parseInt(p1.y)
      p2.x = parseInt(p2.x)
      p2.y = parseInt(p2.y)
      this.points = this.getPoints(p1, p2)
  
    }
  
    getPoints(p1, p2) {
      let result = []
      const { x: x1, y: y1 } = p1
      const { x: x2, y: y2 } = p2
      const xDiff = x2 - x1
      const deltaX = xDiff === 0 ? 0 : xDiff / Math.abs(xDiff)
      const yDiff = y2 - y1
      const deltaY = yDiff === 0 ? 0 : yDiff / Math.abs(yDiff)
      if (deltaX && deltaY) {
        for(let x = x1, y = y1; x !== (x2 + deltaX); x += deltaX, y += deltaY) {
            result.push({ x, y})
        }
      } else if (deltaX) {
        for(let x = x1; x !== (x2 + deltaX); x += deltaX) {
          result.push({ x, y: y1 })
        }
      } else if (deltaY) {
        for(let y = y1; y !== (y2 + deltaY); y += deltaY) {
          result.push({ x: x1, y })
        }
      }
      return result.map(point => `${point.x}:${point.y}`)
    }
  }

const p1Lines = p1Input.map(line => new Line(line))
const p2Lines = p2Input.map(line => new Line(line))

let p1Points = p1Lines
  .reduce((result, line) => {
    line.points.forEach(point => {
      if (result[point] === undefined) {
        result[point] = 0
      }
      result[point]++
    })
    return result
  }, {})

let p2Points = p2Lines
  .reduce((result, line) => {
    line.points.forEach(point => {
      if (result[point] === undefined) {
        result[point] = 0
      }
      result[point]++
    })
    return result
  }, {})

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
ctx.fillRect(0,0,canvas.width, canvas.height)
Object.entries(p2Points).forEach(([key, value]) => {
  ctx.fillStyle = value > 1 ? 'red' : 'green'
  const [x, y] = key.split(':').map(x => parseInt(x))
  ctx.fillRect(x,y,1,1)
})

const p2Answer = Object.entries(p2Points).filter(entry => entry[1] > 1)

console.log(p2Answer)