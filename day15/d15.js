const fs = require('fs')
const path = require('path')

const { readFile, Heap, PathFinder } = require('../utils')

const EXAMPLE = false

const input = readFile(path.resolve(__dirname, EXAMPLE ? 'example.txt' : 'input.txt'))
  .split('\n')
  .map(line => line.split('').map(x => parseInt(x)))

const trueSize = []
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let y = 0; y < input.length; y++) {
      if (!trueSize[y + i * input.length]) trueSize[y + i * input.length] = []
      for (let x = 0; x < input[0].length; x++) {
        trueSize[y + i * input.length][x + j * input[0].length] = ((input[y][x] + (i + j - 1)) % 9) + 1
      }
    }
  }
}

fs.writeFileSync(path.resolve(__dirname, 'output'), trueSize.map(line => line.join('')).join('\n'))

function solve(input) {
  let result = []
  
  for (let i = 0; i < input.length; i++) {
    result[i] = []
    for (let j = 0; j < input[0].length; j++) {
      const inputY = input.length - i - 1
      const inputX = input[0].length - j - 1
      const thisValue = input[inputY][inputX]
      const right = result?.[i]?.[j - 1]
      const down = result?.[i - 1]?.[j]
      const options = []
      if (right !== undefined) options.push(right)
      if (down !== undefined) options.push(down)
      const restOfPath = options.length ? Math.min(...options) : 0
      result[i][j] = thisValue + restOfPath
    }
  }

  return result[input.length - 1][input[0].length - 1]
}



const pathFinder = new PathFinder(trueSize)
pathFinder.testVertex('0:0')

