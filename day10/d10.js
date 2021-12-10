const path = require('path')
const { readFile } = require('../utils')

const input = readFile(path.resolve(__dirname, 'input.txt'))
  .split('\n')

const pairMap = {
  '(': ')',
  '<': '>',
  '{': '}',
  '[': ']'
}

const ERROR_SCORE = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const COMPLETION_SCORE = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
}

const openings = Object.keys(pairMap)
const closings = Object.values(pairMap)


function parse(line) {
  let validClose = []
  const lineArray = line.split('')
  let position = 0
  let error = false
  do {
    const char = lineArray[position]
    if (openings.includes(char)) validClose.push(pairMap[char])
    else if (closings.includes(char)) {
      const valid = validClose.pop()
      if (char !== valid) {
        error = true
        console.error(`${lineArray.join('')} - Expected ${valid} but found ${char} instead.`)
        return { error, score: ERROR_SCORE[char] }
      }
    }
    position++
  } while (!error && position < lineArray.length)
  let score = 0
  while (validClose.length > 0) {
    const char = validClose.pop()
    const charScore = COMPLETION_SCORE[char]
    score = score * 5 + charScore
  }
  return { error, score }
}

const scores = input.reduce((total, line) => {
  const result = parse(line)
  return {
    errorScore: result.error ? total.errorScore + result.score : total.errorScore,
    completionScores: result.error ? total.completionScores : [
      ...total.completionScores,
      result.score
    ].sort((a, b) => a - b)
  }
}, {
  errorScore: 0,
  completionScores: []
})

console.table({
  'Error score': scores.errorScore,
  'Completion score': scores.completionScores[Math.floor(scores.completionScores.length / 2)]
})
