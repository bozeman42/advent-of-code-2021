const path = require('path')
const { readFile } = require('../utils')

const DIGITS = [
  ['a', 'b', 'c', 'e', 'f', 'g'],
  ['c', 'f'],
  ['a', 'c', 'd', 'e', 'g'],
  ['a', 'c', 'd', 'f', 'g'],
  ['b', 'c', 'd', 'f'],
  ['a', 'b', 'd', 'f', 'g'],
  ['a', 'b', 'd', 'e', 'f', 'g'],
  ['a', 'c', 'f'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'f', 'g'],
]

const input = readFile(path.resolve(__dirname, 'input.txt'))
  .split('\n')
  .map(line => line
    .split(' | ')
    .map(item => item.split(' '))
  )

class SevenSegmentDisplay {
  constructor(input) {
    this.input = input.split('')
  }

  get value() {
    const value = DIGITS.findIndex(segments => segments.sort().join('') === this.input.sort().join('')) ?? NaN
    return value
  }

  setInput(string) {
    const [x, y] = this.position
    this.input = string.split('').filter(letter => /[abcdefg]/.test(letter))
    return this
  }

  applySolution(solution) {
    const solutionMap = Object.keys(solution).reduce((result, key) => ({
      ...result,
      [solution[key]]: key
    }), {})
    this.input = this.input.map(segment => solutionMap[segment])
  }
}

class DisplayLine {
  constructor([digits, display]) {
    this.solved = false
    this.display = display.map(input => {
      return new SevenSegmentDisplay(input)
    })
  }
  applySolution(solution) {
    this.display.forEach(digit => digit.applySolution(solution))
    this.solved = true
  }

  get value() {
    if (this.solved) {
      return this.display.reduce((total, didget, index) => {
        const power = this.display.length - 1 - index
        return total + didget.value * Math.pow(10, power)
      }, 0)
    }
    return NaN
  }
}

function solvePart1(input) {
  const outputs = input.map(line => line[1])
  const result = outputs
  .flat()
  .filter(signal => {
    const length = signal.length
    return [2, 3, 4, 7].some(value => value === length)
  })
  .length
  return result
}

function solve(input) {
  return input.reduce((total, line) => {
    const [digits] = line
    const twoSegments = digits.find(segments => segments.length === 2).split('')
    const threeSegments = digits.find(segments => segments.length === 3).split('')
    const fourSegments = digits.find(segments => segments.length === 4).split('')
    const fiveSegments = digits.filter(segments => segments.length === 5).map(segments => segments.split(''))
    const sevenSegments = digits.find(segments => segments.length === 7).split('')
    const sixSegments = digits.filter(segments => segments.length === 6).map(segments => segments.split(''))
    const numberNine = sixSegments.find(digit => fourSegments.every(letter => digit.includes(letter)))
    
    let a = threeSegments.find(letter => !twoSegments.includes(letter))
    let cf = threeSegments.filter(letter => letter !== a)
    let bd = fourSegments.filter(letter => !cf.includes(letter))
    let e = sevenSegments.find(letter => !numberNine.includes(letter))
    const numberTwo = fiveSegments.find(digit => digit.includes(e))
    const g = numberTwo.filter(segment => !fourSegments.includes(segment) && !threeSegments.includes(segment) && segment !== e)
    const numberFive = fiveSegments.find(segments => !numberTwo.every(segment => segments.includes(segment)) && !twoSegments.every(segment => segments.includes(segment)))
    const f = twoSegments.find(segment => numberFive.includes(segment))
    const c = cf.find(segment => segment !== f)
    const b = bd.find(letter => !numberTwo.includes(letter))
    const d = bd.find(letter => letter !== b[0])
    const display = new DisplayLine(line)
    display.applySolution({a, b, c, d, e, f, g})
    return total += display.value
  }, 0)
}

console.time('Part 1')
console.log('Part1', solvePart1(input))
console.timeEnd('Part 1')
console.time('Part 2')
console.log('Part 2:', solve(input))
console.timeEnd('Part 2')