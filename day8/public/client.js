const canvas = document.createElement('canvas')
const totalElement = document.getElementById('total')
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight - 150

canvas.height = HEIGHT
canvas.width = WIDTH
const BGCOLOR = 'white'
const ACTIVE = 'red'
const INACTIVE = '#eee'
const SUCCESS = 'forestgreen'
const ctx = canvas.getContext('2d')
ctx.fillStyle = BGCOLOR
ctx.fillRect(0,0, WIDTH, HEIGHT)
document.body.appendChild(canvas)
const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
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

function segmentsToBinary(digitSegments) {
  return segmentNames.reduce((total, letter, index) => total + (digitSegments.includes(letter) ? Math.pow(2, index) : 0), 0b0)
}

DIGITS.forEach(digit => console.log(segmentsToBinary(digit).toString(2)))

function solvedDigits(partialSolution) {
  const solvedSegments = Object.keys(partialSolution)
    .filter(letter => partialSolution[letter].length === 1)
  const solvedDigits = DIGITS.reduce((obj, segments, digit) => {
    return {
      ...obj,
      [digit]: segments.every(segment => solvedSegments.includes(segment))
    }
  },{})
}

// const digits = {
//   1: ['c', 'f'],
//   2: ['a', 'c', 'd', 'e', 'g'],
//   3: ['a', 'c', 'd', 'f', 'g'],
//   4: ['b', 'c', 'd', 'f'],
//   5: ['a', 'b', 'd', 'f', 'g'],
//   6: ['a', 'b', 'd', 'e', 'f', 'g'],
//   7: ['a', 'c', 'f'],
//   8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
//   9: ['a', 'b', 'c', 'd', 'f', 'g'],
//   0: ['a', 'b', 'c', 'e', 'f', 'g'],
// }, 

class SevenSegmentDisplay {
  constructor(position, ctx, input = '', colors= {
    BGCOLOR: '#222',
    INACTIVE: '#444',
    ACTIVE: 'white',
  }, scale = 2) {
    this.colors = {...colors}
    this.position = position
    this.ctx = ctx
    this.scale = scale
    this.input = input.split('')
    this.instructions = {
      a: [[1, 0], [4, 0]],
      b: [[0, 1], [0, 4]],
      c: [[5, 1], [5, 4]],
      d: [[1, 5], [4, 5]],
      e: [[0, 6], [0, 9]],
      f: [[5, 6], [5, 9]],
      g: [[1, 10], [4, 10]]
    }
  }

  get value() {
    return DIGITS.findIndex(segments => segments.sort().join('') === this.input.sort().join('')) ?? NaN
  }

  setInput(string) {
    const [x, y] = this.position
    this.input = string.split('').filter(letter => /[abcdefg]/.test(letter))
    this.drawDisplay()
    return this
  }

  applySolution(solution) {
    const solutionMap = Object.keys(solution).reduce((result, key) => ({
      ...result,
      [solution[key]]: key
    }), {})
    this.input = this.input.map(segment => solutionMap[segment])
  }

  setActiveColor(color) {
    this.colors.ACTIVE = color
    return this
  }
  
  drawDisplay() {
    const { ctx, scale, input, position } = this
    const [ x0, y0 ] = position
    ctx.fillStyle = this.colors.BGCOLOR
    ctx.fillRect(x0, y0, 6 * this.scale, 11 * this.scale)
    let start = [0, 0]
    let end = [0, 0]
    
    Object.keys(this.instructions).forEach(letter => {
      ctx.fillStyle = input.includes(letter) ? this.colors.ACTIVE : this.colors.INACTIVE
      const [ x1, y1 ] = this.instructions[letter][0]
      const [ x2, y2 ] = this.instructions[letter][1]
      const horizontal = y1 === y2
      for(let i = 0; i < 4; i++) {
        ctx.fillRect(x0 + x1 * scale + (horizontal ? i * scale : 0), y0 + y1 * scale + (!horizontal ? i * scale : 0), scale, scale)
      }
    })
  }
}


const problemInput = data
  .split('\n')
  .map(line => line
    .split(' | ')
    .map(item => item.split(' '))
  )

class DisplayLine {
  constructor(position, [digits, display], ctx, scale = 2, colors = {
    BGCOLOR,
    INACTIVE,
    ACTIVE,
  }) {
    this.colors = {...colors}
    this.position = position
    this.solved = false
    this.ctx = ctx
    this.scale = scale
    const [x0, y0] = this.position
    this.digits = digits.map((input, index) => {
      return new SevenSegmentDisplay([x0 + index * 8 * scale, y0], this.ctx, input, colors, this.scale)
    })
    this.display = display.map((input, index) => {
      return new SevenSegmentDisplay([x0 + (90 + index * 8) * scale, y0], this.ctx, input, colors, this.scale)
    })
    this.drawDisplay()
  }
  
  drawDisplay() {
    const { scale, position } = this
    const [x0, y0] = position
    this.digits.forEach(digit => digit.drawDisplay())
    this.display.forEach(digit => digit.drawDisplay())
    this.ctx.fillStyle = this.colors.ACTIVE
    this.ctx.fillRect(x0 + (81 * scale), y0, this.scale, 11 * this.scale)
  }

  setActiveColor(color) {
    this.colors.ACTIVE = color
    this.digits.forEach(digit => digit.setActiveColor(color))
    this.display.forEach(digit => digit.setActiveColor(color))
    this.drawDisplay()
  }

  applySolution(solution) {
    this.digits.forEach(digit => digit.applySolution(solution))
    this.display.forEach(digit => digit.applySolution(solution))
    if (this.digits.every(didgitDisplay => DIGITS.some(digit => digit.sort().join('') === didgitDisplay.input.sort().join('')))) {
      this.setActiveColor(SUCCESS)
      this.solved = true;
    }
  }

  get value() {
    if (this.solved) {
      return this.display.reduce((total, didget, index) => {
        const power = this.display.length - 1 - index
        console.log(didget.value, didget)
        return total + didget.value * Math.pow(10, power)
      }, 0)
    }
    return NaN
  }
}

const SCALE = 2



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

async function solve(input) {
  
  let solutions = input.map((line, index) => {
    const [digits, displayDigits] = line
    console.log(digits)
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
    console.log('sixSegments', sixSegments)
    let e = sevenSegments.find(letter => !numberNine.includes(letter))
    console.log('e', e)
    console.log('five segments', fiveSegments)
    const numberTwo = fiveSegments.find(digit => digit.includes(e))
    const g = numberTwo.filter(segment => !fourSegments.includes(segment) && !threeSegments.includes(segment) && segment !== e)
    const numberFive = fiveSegments.find(segments => !numberTwo.every(segment => segments.includes(segment)) && !twoSegments.every(segment => segments.includes(segment)))
    const f = twoSegments.find(segment => numberFive.includes(segment))
    const c = cf.find(segment => segment !== f)
    const b = bd.find(letter => !numberTwo.includes(letter))
    const d = bd.find(letter => letter !== b[0])
    const rows = Math.floor(HEIGHT / (14 * SCALE))
    let x = 10 + Math.floor(index / rows)  * 130 * SCALE
    let y = 10 + 14 * SCALE * (index % rows)
    const display = new DisplayLine([x, y], line, ctx, SCALE)
    return {
      digits,
      displayDigits,
      display,
      solution: {
        a,
        b,
        c,
        d,
        e,
        f,
        g
      }
    }
  })
  let total = 0
  for(let solution of solutions) {
    await new Promise((resolve, reject) => {setTimeout(() => resolve(), 10)})
    solution.display.applySolution(solution.solution)
    total += solution.display.value 
    totalElement.innerText = total
  }
}

solve(problemInput)

