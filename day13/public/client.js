const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 500
canvas.height = 500

document.body.appendChild(canvas)

const SCALE = 10

fetch('/data')
  .then(response => response.json())
  .then(data => {
    data.forEach(point => ctx.fillRect(point[0] * SCALE, point[1] * SCALE, SCALE, SCALE))
  })