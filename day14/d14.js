const path = require('path')

const { readFile } = require('../utils')

const EXAMPLE = false

const input = readFile(path.resolve(__dirname, EXAMPLE ? 'example.txt' : 'input.txt'))

const [template, ruleBlock] = input.split('\n\n')

const rules = ruleBlock
  .split('\n')
  .map(line => line.split(' -> '))
  .reduce((obj, rule) => {
    return {
      ...obj,
      [rule[0]]: rule[1]
    }
  }, {})
  
console.time('process')
const pairs = {}
for(let i = 0; i < template.length - 1; i++) {
  const rule = template.substring(i, i + 2)
  pairs[rule] = pairs[rule] === undefined ? 1 : pairs[rule] + 1
}

function process(pairs) {
  let result = {}
  Object.keys(pairs).forEach(pair => {
    const insert = rules[pair]
    const pair0 = pair[0] + insert
    const pair1 = insert + pair[1]
    result[pair0] = result[pair0] ? result[pair0] + pairs[pair] : pairs[pair]
    result[pair1] = result[pair1] ? result[pair1] + pairs[pair] : pairs[pair]
  })
  return result
}

let resultPairs = pairs

for(let i = 0; i < 40; i++) {
  resultPairs = process(resultPairs)
}

const calculateCount = pairs => {
  const result = Object.keys(pairs)
  .reduce((obj, pair) => {
    return {
      ...obj,
      [pair[0]]: obj[pair[0]] === undefined ? pairs[pair] : obj[pair[0]] + pairs[pair]
    }
  }, {})
  result[template[template.length - 1]] += 1
  return result
}

console.log(resultPairs)
const count = calculateCount(resultPairs)
console.log(count, Math.max(...Object.values(count)) - Math.min(...Object.values(count)))

console.timeEnd('process')