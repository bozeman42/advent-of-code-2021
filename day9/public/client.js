const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const height = window.innerHeight
const width = window.innerWidth

const SCALE = 12

canvas.width = width
canvas.height = height

const xScale = Math.round(width / 100)
const yScale = Math.round(height / 100)

document.body.appendChild(canvas)

function point(x, y) {
  return `${x},${y}`
}

function nonRecursiveCrawl(x0, y0, basin, data) {
  const queue = []
  queue.push({x: x0, y: y0, basin})
  while (queue.length > 0) {
    const {x, y} = queue.pop()
    if (data[y] === undefined || data[y]?.[x] === undefined || data[y][x] === 9 || basin.has(point(x, y))) continue
    basin.add(point(x, y))
    queue.push({x: x + 1, y, basin})
    queue.push({x: x - 1, y, basin})
    queue.push({x, y: y + 1, basin})
    queue.push({x, y: y - 1, basin})
  }
}

fetch('/data')
  .then(response => response.json())
  .then(data => {
    for(let y = 0; y < data.length; y++) {
      for (let x = 0; x < data.length; x++) {
        let color = `rgb(${(data[x][y] / 9 * 255)},0,0)`
        ctx.fillStyle = color
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
      }
    }
    const width = data[0].length
    const height = data.length

    const DOWN = 1
    const UP = -1
    const RIGHT = 1
    const LEFT = -1
    const lowPoints = []
    const riskScore = data.reduce((total, row, rowIndex) => {
      return total + row
        .reduce((rowTotal, item, columnIndex) => {
          let lowest = true
          if (rowIndex !== 0 && data[rowIndex + UP][columnIndex] <= item) lowest = false
          if (columnIndex !== width - 1 && data[rowIndex][columnIndex + RIGHT] <= item) lowest = false
          if (columnIndex !== 0 && data[rowIndex][columnIndex + LEFT] <= item) lowest = false
          if (rowIndex !== height - 1 && data[rowIndex + DOWN][columnIndex] <= item) lowest = false
          if (lowest) lowPoints.push({
              x: columnIndex,
              y: rowIndex,
              basin: new Set()
            })
          return lowest ? rowTotal + item + 1 : rowTotal
        }, 0)
    }, 0)

    function solvePart2() {
      lowPoints.forEach(({x, y, basin}) => nonRecursiveCrawl(x, y, basin, data))
      const basinSizes = lowPoints
        .map(({basin}) => {
          return basin.size
        })
      lowPoints.sort((a, b) => b.basin.size - a.basin.size)
      const top3points = lowPoints.slice(0, 3)
      top3points.forEach((point, index) => {
        Array.from(point.basin).forEach(point => {
          console.log(point)
          const [x, y] = point.split(',').map(x => parseInt(x))
          console.log(x, y)
          // ctx.fillStyle = 'rgba(0,255,0,.25)'
          // ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
        })
      })
      console.log(basinSizes.sort((a, b) => b - a))
      const top3 = basinSizes.slice(0, 3)
      console.log(top3, top3.reduce((a, b) => a * b, 1))
    }
    solvePart2()
    document.body.onclick = () => {
      canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
    }
    
  })