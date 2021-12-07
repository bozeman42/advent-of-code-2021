const express = require('express')

const path = require('path')
const { readFile } = require('../utils')

const app = express()

app.use(express.static('public'))

const input = readFile(path.resolve(__dirname, 'input.txt'))
.split(',')
.map(x => parseInt(x))


app.get('/data', (req, res) => {
  res.send(input)
})

app.listen(5000, () => console.log('listening on http://localhost:5000'))
const average = (values) => {
  return values.reduce((acc, value) => acc + value) / values.length
}

const totalDistance = (target, values) => {
  return values.reduce((acc, value) => {
    return acc + Math.abs(value - target)
  }, 0)
}
console.log(average(input))
console.log(totalDistance(350, input))
console.log(input.sort((a, b) => a - b)[499])

console.log(input.filter(value => value < 479).length)