const { resolve } = require('path')
const { readFile } = require('../utils')

const USE_EXAMPLE = true

const FILENAME = USE_EXAMPLE ? 'example' : 'input'


class Pair {
  constructor(a, b, depth = 0) {
    this.depth = depth
    const aIsArray = Array.isArray(a)
    const bIsArray = Array.isArray(b)
    if (typeof a === 'number') {
      this.a = a
    } else if (aIsArray) {
      this.a = new Pair(a[0], a[1], depth + 1)
    } else {
      this.a = new Pair(a.a, a.b, depth + 1)
    }
    if (typeof b === 'number') {
      this.b = b
    } else if (bIsArray) {
      this.b = new Pair(b[0], b[1], depth + 1)
    } else {
      this.b = new Pair(b.a, b.b, depth + 1)
    }
    if (this.depth === 0) {
      this.testAExplode()
      this.testBExplode()
    }
  }
  
  add(pair) {
    let result = new Pair(this, pair)
    result.setDepth(this.depth)
    return result
  }
  
  setDepth(n) {
    if (typeof this.a !== 'number') this.a.setDepth(n + 1)
    if (typeof this.b !== 'number') this.b.setDepth(n + 1)
  }

  explode() {
    if (this.depth === 4) {
      console.log('explode', this.a, this.b)
      return {
        explodes: true,
        a: this.a,
        aSpread: false,
        b: this.b,
        bSpread: false
      }
    }
    const aData = this.testAExplode()
    const bData = this.testBExplode()
    const explosionBelow = aData.explodes || bData.explodes
    return {
      ...aData,
      ...bData,
      explodes: explosionBelow
    }
  }

  addA(n)  {
    if (typeof this.a === 'number') {
      this.a += n
    } else {
      this.a.addA(n)
    }
  }

  addB(n)  {
    if (typeof this.b === 'number') {
      this.b += n
    } else {
      this.b.addB(n)
    }
  }

  testAExplode() {
    if (typeof this.a === 'number') return  { explodes: false }
    const explosion = this.a.explode()
    if (!explosion.explodes) return  { explodes: false }
    if (typeof this.b === 'number' && !explosion.bSpread) {
      this.b = this.b + explosion.b
      return {
        ...explosion,
        bSpread: true,
      }
    }
    this.b.addA(explosion.b)
    return {
      ...explosion,
      bSpread: true,
    }
  }

  testBExplode() {
    if (typeof this.b === 'number') return  { explodes: false }
    const explosion = this.b.explode()
    if (!explosion.explodes) return  { explodes: false }
    if (typeof this.a === 'number' && !explosion.aSpread) {
      this.a = this.a + explosion.a
      return {
        ...explosion,
        aSpread: true,
      }
    }
    this.a.addB(explosion.a)
    return {
      ...explosion,
      aSpread: true,
    }
  }

  get magnitude() {
    let magA = typeof this.a === 'number' ? this.a : this.a.magnitude
    let magB = typeof this.b === 'number' ? this.b : this.b.magnitude
    return 3 * magA + 2 * magB
  }
}

const input = readFile(resolve(__dirname, `${FILENAME}.txt`))
  .split('\n')
  .map(line => JSON.parse(line))
  .map(item => new Pair(item[0], item[1], 0))
  // .reduce((result, pair) => {
  //   return result.add(pair)
  // })

Pair.prototype.toString = function () {
  return `[${this.a},${this.b}]`
}

console.log(input.toString())