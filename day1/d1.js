const path = require('path')
const { readFile } = require('../utils')

const input = readFile(path.resolve(__dirname, 'input1.txt')).split('\n').map(x => parseInt(x))

const increases = input.reduce((prevValue, item, index) => {
  let result = 0
  if (index > 2) {
    const shared = input[index - 1] + input[index - 2]
    const current = input[index] + shared
    const previous = shared + input[index - 3]

    result += current > previous ? 1 : 0
  }
  return prevValue + result
}, 0)

console.log(increases)