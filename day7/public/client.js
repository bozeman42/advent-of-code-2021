const targetInput = document.getElementById('target')
const targetDisplay = document.getElementById('target-display')
const output = document.getElementById('output')
console.log(targetDisplay)
targetDisplay.innerText = targetInput.value 

let target = parseInt(targetInput.value)

const fuelConsumption = (distance) => {
  return (distance * (distance + 1)) / 2
}

const totalDistance = (target, values) => {
  return values.reduce((acc, value) => {
    let distance = Math.abs(value - target)
    return acc + fuelConsumption(distance)
  }, 0)
}


fetch('/data')
  .then(response => response.json())
  .then(data => {
    targetInput.oninput = e => {
      target = parseInt(e.target.value)
      targetDisplay.innerText = e.target.value
      const value = totalDistance(target, data)
      const right = totalDistance(target + 1, data) < value
      const left = totalDistance(target - 1, data) < value

      output.innerText = `${value} ${right ? '->' : ''}${left ? '<-' : ''}${!right && !left ? 'X' : ''}`
    }
  })