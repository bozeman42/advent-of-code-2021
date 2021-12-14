const express = require('express')
const app = express()

app.use(express.static('public'))


const path = require("path");

const { readFile } = require('../utils')

const [dotInput, foldsInput] = readFile(path.resolve(__dirname, 'input.txt')).split('\n\n')

const dots = dotInput.split('\n').map(line => line.split(',').map(x => parseInt(x)))

const folds = foldsInput.split('\n').map(line => line.split(' ')[2].split('='))

let result = [...dots]
folds.forEach(([axis, valueStr]) => {
  const value = parseInt(valueStr)
  const i = axis === 'x' ? 0 : 1
  const folded = result.map(coord => {
    if (coord[i] < value) return coord
    const newCoord = [...coord]
    newCoord[i] = value - (newCoord[i] - value)
    return newCoord
  })
  result = folded.filter((coord, index) => {
    const dotsStrs = folded.map(x => JSON.stringify(x))
    const coordStr = JSON.stringify(coord)
    return dotsStrs.indexOf(coordStr) === index
  })
})

app.get('/data', (req, res) => {
  res.send(result)
})

app.listen(5000,() => console.log('Listening at http://localhost:5000'))
