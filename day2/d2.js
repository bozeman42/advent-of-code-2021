const path = require('path')
const { readFile } = require('../utils')

const commands = readFile(path.resolve(__dirname, 'input.txt'))
  .split('\n')
  .map(commandPair => commandPair.split(' '))

const commandEffects = {
  down: 1,
  up: -1
}

const finalPosition = commands.reduce((result, commandPair) => {
  const [x0, y0, aim] = result
  const [commandString, valueString] = commandPair
  const value = parseInt(valueString)
  if (commandString === 'forward') {
    return [
      x0 + value,
      y0 + aim * value,
      aim
    ]
  }
  return [
    x0,
    y0,
    aim + commandEffects[commandString] * value
  ]
}, [0 ,0, 0] )

console.log(finalPosition)
console.log(finalPosition[0] * finalPosition[1])