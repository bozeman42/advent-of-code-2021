const { resolve } = require('path')
const { readFile } = require('../utils')

const data = readFile(resolve(__dirname, 'input.txt'))
  .split('\n\n') // each scanner section
  .map(scannerData => {
    const [title, ...pointsStrings] = scannerData
      .split('\n')
    const points = pointsStrings
      .map(str => '[' + str + ']')
      .map(string => JSON.parse(string))
    return points
  })
  .map(scanner => {
    return scanner.map(point => {
      return generateFacings(point)
        .reduce((result, facing) => {
          return [...result, ...generateRotations(facing)]
        }, [])
    })
  })
  .map(scanner => {
    // scanner[point][orientation]
    return scanner.reduce((result, point, pointIndex) => {
      point.forEach((orientation, orientationIndex) => {
        if (!Array.isArray(result[orientationIndex])) result[orientationIndex] = []
        result[orientationIndex][pointIndex] = orientation
      })
      return result
    },[])
  })

function generateFacings ([x, y, z]) {
  const yFacing = [x, -z, y]
  const xFacing = [-z, y, x]
  const zNegFacing = [-x, y, -z]
  const xNegFacing = [z, y, -x]
  const yNegFacing = [x, z, -y]
  return [
    [x, y, z],
    yFacing,
    xFacing,
    zNegFacing,
    xNegFacing,
    yNegFacing
  ]
}

function generateRotations ([x0, y0, z0]) {
  let result = [[x0,y0,z0]]
  for(let i = 0; i < 3; i++) {
    const [x, y, z] = result[i]
    result.push([-y,x,z])
  }
  return result
}

function getOffset([x,y,z],[x0,y0,z0]) {
  return [x0 - x, y0 - y, z0 - z]
}

function applyOffset([x0, y0, z0]) {
  return ([x, y, z]) => {
    return [x - x0, y - y0, z - z0]
  }
}

function comparePoints(p1, p2) {
  const [x, y, z] = p1
  const [x0, y0, z0] = p2
  return x === x0 && y === y0 && z === z0
}

function findDistance(p1, p2) {
  const [x1, y1, z1] = p1
  const [x2, y2, z2] = p2
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))
}

// for each scanner, the orientations for each point will be in the same order

const allDistances = data.map(scanner => {
  const points = scanner[0]
  return points.map((point, index, arr) => {
    return arr.map(otherPoint => findDistance(point, otherPoint))
      .filter(x => x !== 0)
  })
})

console.log(allDistances[0])
const scannerPairs = new Set()
allDistances.forEach((scanner, index, arr) => {
  scanner.forEach(point => {
    arr.forEach((otherScanner, otherIndex) => {
      if (index !== otherIndex) {
        otherScanner.forEach((otherPoint, otherPointIndex) => {
          let count = 0
          point.forEach(distance => {
            if (otherPoint.includes(distance)) {
              count++
              if (count >= 11) {
                const lesser = Math.min(index, otherIndex)
                const greater = Math.max(index, otherIndex)
                scannerPairs.add(`${lesser},${greater}`)
              }
            }
          })
        })
      }
    })
  })
})

console.log(scannerPairs)

const graph = Array.from(scannerPairs).reduce((result, pairStr) => {
  const pair = pairStr.split(',').map(x => parseInt(x))
  if (!Array.isArray(result[pair[0]])) {
    result[pair[0]] = []
  }
  result[pair[0]].push(pair[1])

  if (!Array.isArray(result[pair[1]])) {
    result[pair[1]] = []
  }
  result[pair[1]].push(pair[0])

  return result
}, {})

console.log(graph)
const [scannerOne, ...others] = data

let points = scannerOne[0] // points will be the collection of all joined beacons
// console.log(points)

// const distances = points.map((point, index, arr) => {
//   return arr.map(otherPoint => {
//     return findDistance(point, otherPoint)
//   }).sort((a, b) => a - b).filter(x => x !== 0)
// })



const point = points[0]
const otherPoints = others[0][0]
const offset = getOffset(point, otherPoints[0])
const offsetOtherPoints = otherPoints.map(applyOffset(offset))
// console.log(point, otherPoints, getOffset(point, otherPoints[0]),offsetOtherPoints, comparePoints(point, offsetOtherPoints[0]))
/*
 *  others[scanner][orientation][point]
 */
others.forEach((scanner, scannerId, arr) => {
  let orientation = 0
  let offsets = []
  scanner.forEach(orientation => {
    points.forEach((point, pInd, pArr) => {
      orientation.forEach((otherPoint, otherPointIndex, otherPoints) => {
        const offset = getOffset(point, otherPoint)
        const offsetOtherPoints = otherPoints.map(applyOffset(offset))
        
      })
    })
  })
})

