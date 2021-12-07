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
for(let i = 0; i < 9000; i++) {
  fish.generateNewDay()
}
console.log(fish)
console.log(fish.population)