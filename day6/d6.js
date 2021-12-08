const path = require('path')
const { readFile } = require('../utils')

const input = readFile(path.resolve(__dirname, 'input.txt'))
  .split(',')
  .map(x => parseInt(x))


class FishPopulation{
  constructor(fishArray) {
    this.pop = this.generateInitialPop(fishArray)
  }
  generateInitialPop(fishArray) {
    return fishArray.reduce((pop, fish) => {
      pop[fish]++
      return pop
    }, [0n,0n,0n,0n,0n,0n,0n,0n,0n])
  }
  generateNewDay() {
    const newPop = [0n,0n,0n,0n,0n,0n,0n,0n]
    this.pop.forEach((fish, fishTimer) => {
      if (fishTimer === 0) {
        newPop[8] = fish
        newPop[6] = fish
      } else {
        newPop[fishTimer - 1] += fish
      }
    })
    this.pop = newPop
  }

  get population() {
    return this.pop.reduce((a, b) => a + b)
  }
}


let fish = new FishPopulation(input)
console.log(fish)
console.time('4 million generations')
for(let i = 0; i < 4000000; i++) {
  if (i % 100000 === 0) {
    console.timeEnd('100,000 generations')
    console.log(i)
    console.time('100,000 generations')
  }
  fish.generateNewDay()
}
// console.log(fish)
console.timeEnd('4 million generations')
console.log(fish.population)