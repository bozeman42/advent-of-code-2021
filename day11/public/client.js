const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

document.body.appendChild(canvas)

const SCALE = Math.min(window.innerHeight, window.innerWidth) / 10

canvas.width = SCALE * 10
canvas.height = SCALE * 10

let input = `8258741254
3335286211
8468661311
6164578353
2138414553
1785385447
3441133751
3586862837
7568272878
6833643144`.split('\n').map(row => row.split('').map(x => parseInt(x)))

function drawInput() {
  input.forEach((row, y) => {
    row.forEach((value, x) => {
      ctx.fillStyle = `rgb(${50 * (value / 9)},${50 * (value / 9)},${150 * (value / 9)})`
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    })
  })
}

async function step() {
  input = raiseEnergyOne()
  await new Promise((resolve, reject) => setTimeout(() => resolve()))
  drawInput()
  const flashSet = await calculateFlashes()
  const flashes = Array.from(flashSet)
  const flashCount = flashes.length
  flashes.forEach(flash => {
    const [x, y] = unhash(flash)
    input[y][x] = 0
  })
  await new Promise((resolve, reject) => setTimeout(() => resolve()))
  drawInput()
  
  return flashCount
}

function logInput() {
  console.log(input.map(row => row.join('')).join('\n'), '\n')
}

function raiseEnergyOne() {
  return input.map(row => row.map(octapus => octapus + 1))
}

function hash(x, y) {
  return `${x}:${y}`
}

function unhash(hash) {
  return hash.split(':').map(x => parseInt(x))
}

function increaseSurrounding(x, y) {
  for(let i = (y > 0 ? y - 1 : 0); i <= (input[y + 1] === undefined ? y : y + 1); i += 1) {
    for(let j = (x > 0 ? x - 1 : x); j <= (input[i][x + 1] === undefined ? x : x + 1); j += 1) {
      if (!(i === y && j === x)) input[i][j] = input[i][j] + 1
    }
  }
}

async function calculateFlashes() {
  let queue = []
  let flashed = new Set()
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const octapus = input[y][x]
      if (octapus === 10 && !flashed.has(hash(x, y))) {
        queue.push([x, y])
      }
    }
  }
  while (queue.length) {
    const [x, y] = queue.pop()
    if (input?.[y]?.[x] === undefined || flashed.has(hash(x, y)) || input[y][x] < 10) continue
    flashed.add(hash(x, y))
    increaseSurrounding(x, y)
    drawInput()
    queue.push([x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1])
    await new Promise((resolve, reject) => setTimeout(() => resolve()))
  }
  return flashed
}

let count = 1
async function run() {
  for(let i = 0; i < 400; i++) {
    await step()
  }
}
run()
console.log(count)