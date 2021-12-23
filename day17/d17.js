const { resolve } = require('path')

const { readFile } = require('../utils')

const USE_EXAMPLE = true

const FILENAME = USE_EXAMPLE ? 'example' : 'input'

const input = readFile(resolve(__dirname, `${FILENAME}.txt`))

const [xRange, yRange] = input
  .split(', ')
  .map(range => range
    .substring(2)
    .split('..')
    .map(x => parseInt(x))
    )

const totalXMovement = xVelocity => {
  let x = 0
  let v = xVelocity
  let step = 0
  const solutions = []
  while (v) {
    step++
    x += v
    v--
    if (x >= xRange[0] && x <= xRange[1]) {
      solutions.push({
        initX: xVelocity,
        step,
        terminal: v === 0,
        hit: x
      })
    }
  }
  return solutions
}

const yMovement = yVelocity => {
  let y = 0
  let v = yVelocity > 0 ? 0 - yVelocity - 1 : yVelocity
  let step = yVelocity > 0 ? yVelocity * 2 + 1 : 0
  let peak = 0
  const solutions = []
  while (y >= yRange[0]) {
    step++
    y += v
    v--
    if (v === 0) peak = y
    if (y >= yRange[0] && y <= yRange[1]) {
      solutions.push({
        initY: yVelocity,
        peak,
        step,
        hit: y
      })
    }
  }
  return solutions
}

let xSolutions = []
let ySolutions = []
for(let x = 0; x <= xRange[1]; x++) {
  let xSteps = totalXMovement(x)
  if (xSteps.length) xSolutions.push(...xSteps)
}

for(let y = -100; y < 100; y++) {
  let ySteps = yMovement(y)
  if (ySteps.length) ySolutions.push(...ySteps)
}

function buildSolutions(xSolutions, ySolutions) {
  let solutions = []
  ySolutions.forEach(ySolution => {
    const yStep = ySolution.step
    xSolutions.filter(xSolution => {
      return xSolution.step === yStep || (xSolution.terminal === true && xSolution.step <= yStep)
    }).forEach(xSolution => {
      const validSolution = [xSolution.initX,ySolution.initY]
      if(!solutions.some(existingSolution => {
        return existingSolution[0] === validSolution[0] && existingSolution[1] === validSolution[1]
      })) {
        solutions.push(validSolution)
      }
    })
  })
  return solutions
}

const solutions = buildSolutions(xSolutions, ySolutions)

console.log('Part 2 solution:', solutions.length)