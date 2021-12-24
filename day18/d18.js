const { resolve } = require('path')
const { readFile } = require('../utils')

const USE_EXAMPLE = true

const FILENAME = USE_EXAMPLE ? 'example' : 'input'


class Pair {
  constructor(a, b, depth = 0) {
    this.depth = depth
    const aIsArray = Array.isArray(a)
    const bIsArray = Array.isArray(b)
    this.a = typeof a === 'number'
      ? a
      : new Pair(
          aIsArray
            ? a[0]
            : a.a,
          aIsArray
            ? a[1]
            : a.b,
          depth + 1)
    this.b = typeof b === 'number'
    ? b
    : new Pair(
        bIsArray
          ? b[0]
          : b.a,
        bIsArray
          ? b[1]
          : b.b,
        depth + 1)
    this.testExplode()
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

  testExplode() {
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
    const explosion = this.a.testExplode()
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
    const explosion = this.b.testExplode()
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
  .reduce((result, pair) => {
    return result.add(pair)
  })
console.log(input.magnitude)