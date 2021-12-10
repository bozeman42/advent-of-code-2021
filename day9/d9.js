const express = require('express')
const app = express()

app.use(express.static('public'))


const path = require('path')
const { readFile } = require('../utils')

const input = readFile(path.resolve(__dirname, 'input.txt'))
  .split('\n')
  .map(line => line.split('').map(x => parseInt(x)))

app.get('/data', (req, res) => {
  res.send(input)
})

app.listen(5000, () => console.log('Listening at http://localhost:5000'))

const width = input[0].length
const height = input.length

const DOWN = 1
const UP = -1
const RIGHT = 1
const LEFT = -1
const lowPoints = []
const part1 = input
.reduce((total, row, rowIndex) => {
  return total + row
    .reduce((rowTotal, item, columnIndex) => {
      let lowest = true
      if (rowIndex !== 0 && input[rowIndex + UP][columnIndex] <= item) lowest = false
      if (columnIndex !== width - 1 && input[rowIndex][columnIndex + RIGHT] <= item) lowest = false
      if (columnIndex !== 0 && input[rowIndex][columnIndex + LEFT] <= item) lowest = false
      if (rowIndex !== height - 1 && input[rowIndex + DOWN][columnIndex] <= item) lowest = false
      if (lowest) lowPoints.push({
          x: columnIndex,
          y: rowIndex,
          basin: new Set()
        })
      return lowest ? rowTotal + item + 1 : rowTotal
    }, 0)
}, 0)

function point(x, y) {
  return `${x},${y}`
}

function crawl(x, y, basin) {
  if (input[y] === undefined || input[y][x] === undefined || input[y][x] === 9 || basin.has(point(x, y))) {
    // console.log(input?.[y] === undefined,  input?.[y]?.[x] === undefined, input?.[y]?.[x] === 9, basin.has(point(x, y)))
    return
  }
  basin.add(point(x, y))
  crawl(x + 1, y, basin)
  crawl(x - 1, y, basin)
  crawl(x, y + 1, basin)
  crawl(x, y - 1, basin)
}

console.log(part1)

function solvePart2() {
  lowPoints.forEach(({x, y, basin}) => crawl(x, y, basin))
  const basinSizes = lowPoints
    .map(({basin}) => {
      return basin.size
    })
  basinSizes.sort((a, b) => b - a)
  const top3 = basinSizes.slice(0, 3)
  console.log(top3, top3.reduce((a, b) => a * b, 1))
}

solvePart2()