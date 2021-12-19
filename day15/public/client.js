const useExample = false

const input = (useExample ? example : data)
  .split('\n')
  .map(line => line.split('').map(x => parseInt(x)))

const trueSize = []
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let y = 0; y < input.length; y++) {
      if (!trueSize[y + i * input.length]) trueSize[y + i * input.length] = []
      for (let x = 0; x < input[0].length; x++) {
        trueSize[y + i * input.length][x + j * input[0].length] = ((input[y][x] + (i + j - 1)) % 9) + 1
      }
    }
  }
}
const usedData = trueSize


// for (let i = 1; i < 499; i++) {
//   usedData[i][498] = 10000
//   usedData[498][i] = 10000
// }



const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let x = 0
let y = 0
let x2 = 499
let y2 = 499

const SCALE = 1

const SIDE = 500 * SCALE

canvas.width = SIDE
canvas.height = SIDE

const xInput = document.getElementById('x')
const yInput = document.getElementById('y')
const x2Input = document.getElementById('x2')
const y2Input = document.getElementById('y2')
const xOutput = document.getElementById('x-start')
const yOutput = document.getElementById('y-start')
const x2Output = document.getElementById('x-end')
const y2Output = document.getElementById('y-end')


xInput.value = x
yInput.value = y
xOutput.innerText = x
yOutput.innerText = y
x2Input.value = 499
y2Input.value = 499
x2Output.innerText = x2
y2Output.innerText = y2

xInput.oninput = e => {
  x = parseInt(e.target.value)
  xOutput.innerText = x
  pathFinder.setSource(x, y)
  pathFinder.drawField()
}

yInput.oninput = e => {
  y = parseInt(e.target.value)
  yOutput.innerText = y
  pathFinder.setSource(x, y)
  pathFinder.drawField()
}
x2Input.oninput = e => {
  x2 = parseInt(e.target.value)
  x2Output.innerText = x2
  pathFinder.setDestination(x2, y2)
  pathFinder.drawField()
}
y2Input.oninput = e => {
  y2 = parseInt(e.target.value)
  y2Output.innerText = y2
  pathFinder.setDestination(x2, y2)
  pathFinder.drawField()
}

const goButton = document.getElementById('go')



const pathFinder = new PathFinder(usedData, SCALE, ctx)
// pathFinder.testVertex('0:0')
let counter = 0
function animate() {
  if (counter >= pathFinder.pathImages.length) return
  pathFinder.draw(counter)
  console.log('pew', counter)
  counter++
  requestAnimationFrame(animate)
}

goButton.onclick = () => {
  counter = 0
  if (x === x2 && y === y2) {
    alert('Start and end must not be the same point.')
    return
  }
  goButton.disabled = true
  setTimeout(() => {
    pathFinder.go(x, y, x2, y2)
    animate()
    goButton.disabled = false
  }, 10)
}