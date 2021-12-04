const path = require('path')
const { readFile } = require('../utils')

const input = readFile(path.resolve(__dirname, 'input.txt')).split('\n')

const splitBinaries = input.map(binary => {
  return binary.split('').map(x => parseInt(x))
})

const findTotals = (result, splitBinary) => {
  splitBinary.forEach((digit, index) => {
    if (!result[index]) {
      result[index] = [0, 0]
    }
    result[index][digit] += 1
  })
  return result
}

const totals = splitBinaries.reduce(findTotals,[])


const gammaRateBinary = totals.map(counts => {
  return counts[1] > counts[0] ? 1 : 0
})
const epsilonRateBinary = totals.map(counts => {
  return counts[1] < counts[0] ? 1 : 0
})

console.log(gammaRateBinary, epsilonRateBinary)
const gammaRate = parseInt(gammaRateBinary.join(''), 2)
const epsilonRate = parseInt(epsilonRateBinary.join(''), 2)

console.log(gammaRate * epsilonRate)

let oxygenRating = [
  ...splitBinaries
]

let co2Rating = [
  ...splitBinaries
]

let o2RatingTotals = oxygenRating.reduce(findTotals, [])
let co2RatingTotals = co2Rating.reduce(findTotals, [])

let testIndex = 0
while (oxygenRating.length > 1) {
  console.log(oxygenRating.length)
  const commonDigit = o2RatingTotals[testIndex][0] > o2RatingTotals[testIndex][1] ? 0 : 1
  oxygenRating = oxygenRating.filter(splitBinary => splitBinary[testIndex] === commonDigit)
  o2RatingTotals = oxygenRating.reduce(findTotals, [])
  testIndex +=1
}
testIndex = 0
while (co2Rating.length > 1) {
  console.log(co2Rating.length)
  const commonDigit = co2RatingTotals[testIndex][0] <= co2RatingTotals[testIndex][1] ? 0 : 1
  co2Rating = co2Rating.filter(splitBinary => splitBinary[testIndex] === commonDigit)
  co2RatingTotals = co2Rating.reduce(findTotals, [])
  testIndex +=1
}

console.log(parseInt(oxygenRating[0].join(''), 2) * parseInt(co2Rating[0].join(''), 2))