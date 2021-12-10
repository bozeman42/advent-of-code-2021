const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const height = window.innerHeight
const width = window.innerWidth

const SCALE = 12

canvas.width = width
canvas.height = height

const xScale = Math.round(width / 100)
const yScale = Math.round(height / 100)

document.body.appendChild(canvas)

fetch('/data')
  .then(response => response.json())
  .then(data => {
    for(let y = 0; y < data.length; y++) {
      for (let x = 0; x < data.length; x++) {
        let color = `rgb(${255 - (data[x][y] / 9 * 255)},0,0)`
        ctx.fillStyle = color
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
      }
    }
    document.body.onclick = () => {
      canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
    }
  })