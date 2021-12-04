const canvas = document.getElementById('canvas')

const [width, height] = [window.innerWidth, window.innerHeight]

canvas.width = width
canvas.height = height

const mapValue = (dataRange, mapRange, value) => {
  return (value - dataRange[0]) / (dataRange[1] - dataRange[0]) * (mapRange[1] - mapRange[0]) + mapRange[0]
}

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'
ctx.fillRect(0,0,width, height)
fetch('/data')
  .then(response => response.json())
  .then(data => {
    const dataMax = data.reduce((max, value) => value > max ? value : max, 0)
    const dataWidth = data.length
    const dataRange = [0, dataMax]
    const widthRange = [0, dataWidth]
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white'
    data.forEach((depth, index) => {
      ctx.fillStyle = data[index] > data[index - 1] ? 'chartreuse' : 'deeppink'
      const x = mapValue(widthRange, [0, width], index)
      const y = mapValue(dataRange, [0, height], depth)
      console.log(x, y)
      ctx.fillRect(x, y, 1, 1)
    })
  })