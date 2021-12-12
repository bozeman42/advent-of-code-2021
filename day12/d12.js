const fs = require('fs')
const { SourceMap } = require('module')
const path = require('path')

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'))
  .toString()
  .split('\n')
  .map(line => line.split('-'))

// Object will contain each node and the available paths from that node

const nodes = input.reduce((obj, line) => {
  let oneWay = obj.hasOwnProperty(line[0]) ? [...obj[line[0]], line[1]] : [line[1]]
  let otherWay = obj.hasOwnProperty(line[1]) ? [...obj[line[1]], line[0]] : [line[0]]
  return {
    ...obj,
    [line[0]]: oneWay,
    [line[1]]: otherWay,
  }
}, {})

function flattenToPath(arr) {
  const paths = []
  if (arr === undefined || arr === null) return []
  arr.forEach(item => {
    if (typeof item[0] === 'string') {
      paths.push(item)
    } else {
      paths.push(...flattenToPath(item))
    }
  })
  return paths
}

function smallCaveVisitedTwice(path) {
  const smallCavesInPath = path.filter(cave => cave === cave.toLowerCase())
  return smallCavesInPath.filter(cave => {
    return smallCavesInPath.filter(thisCave => cave === thisCave).length > 1
  })
}

function traverse(nodeInput, currentNode, path = ['start']) {
  const nodes = {}
  Object.keys(nodeInput).forEach(node => nodes[node] = [...nodeInput[node]])
  if (currentNode === 'end') return path
  if ((currentNode === currentNode.toLowerCase() && smallCaveVisitedTwice(path)).length || currentNode === 'start') {
    const smallCavesVisited = path.filter(cave => cave === cave.toLowerCase())
    Object.keys(nodes).forEach(node => nodes[node] = nodes[node].filter(availableNode => !smallCavesVisited.includes(availableNode)))
  }
  if (nodes[currentNode].length === 0) return []
  return nodes[currentNode].map(nextNode => traverse(nodes, nextNode, [...path, nextNode]))
}

const result = flattenToPath(traverse(nodes, 'start'))
