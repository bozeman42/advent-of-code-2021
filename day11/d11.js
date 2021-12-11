const express = require('express')
const app = express()

app.use(express.static('public'))

const states = []

const path = require('path')
const { readFile } = require('../utils')

const data = readFile(path.resolve(__dirname, 'input.txt'))
  .split('\n')
  .map(line => line.split('').map(x => parseInt(x)))

let input = data

function step() {
  input = raiseEnergyOne()
  const flashSet = calculateFlashes()
  const flashes = Array.from(flashSet)
  const flashCount = flashes.length
  flashes.forEach(flash => {
    const [x, y] = unhash(flash)
    input[y][x] = 0
  })
  return flashCount
}

function logInput() {
  console.log(input.map(row => row.join('')).join('\n'), '\n')
}

function raiseEnergyOne() {
  return input.map(row => row.map(octapus => octapus + 1))
}

function hash(x, y) {
  return `${x}:${y}`
}

function unhash(hash) {
  return hash.split(':').map(x => parseInt(x))
}

function increaseSurrounding(x, y) {
  for(let i = (y > 0 ? y - 1 : 0); i <= (input[y + 1] === undefined ? y : y + 1); i += 1) {
    for(let j = (x > 0 ? x - 1 : x); j <= (input[i][x + 1] === undefined ? x : x + 1); j += 1) {
      if (!(i === y && j === x)) input[i][j] = input[i][j] + 1
    }
  }
}

function calculateFlashes() {
  let queue = []
  let flashed = new Set()
  input.forEach((row, y) => row.forEach((octapus, x) => {
    if (octapus === 10 && !flashed.has(hash(x, y))) {
      queue.push([x, y])
    }
    while (queue.length) {
      const [x, y] = queue.pop()
      if (input?.[y]?.[x] === undefined || flashed.has(hash(x, y)) || input[y][x] < 10) continue
      flashed.add(hash(x, y))
      increaseSurrounding(x, y)
      queue.push([x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1])
    }
  }))
  return flashed
}

let count = 1
while (step() !== 100) {
  count ++
}

console.log(count)