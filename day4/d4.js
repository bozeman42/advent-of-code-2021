const { resolve } = require('path')
const { readFile } = require('../utils')

const [
  drawOrderString,
  ...boardStrings
] = readFile(resolve(__dirname, 'input.txt')).split('\n\n')

const drawOrder = drawOrderString.split(',').map(x => parseInt(x))

const rawBoards = boardStrings.map(boardString => {
  const rows = boardString
    .split('\n')
    .map(rowString => {
      return rowString
      .trim()
      .split(/\s+/)
      .map(x => parseInt(x))
    })
    return rows
  })
  
  class Board {
    constructor(board) {
      this.board = board
      this.indexBoard(this.board)
    }
    
  indexBoard() {
    this.rows = []
    this.columns = []
    this.index = this.board
    .reduce((result, row, rowIndex) => {
      row.forEach((item, columnIndex) => {
        result[item] = {
          row: rowIndex,
          column: columnIndex,
          selected: false,
          value: item
        }
        if (!this.rows[rowIndex]) this.rows[rowIndex] = []
        this.rows[rowIndex].push(item)
        if (!this.columns[columnIndex]) this.columns[columnIndex] = []
        this.columns[columnIndex].push(item)
      })
      return result
    }, {})
  }
  
  testRow(index) {
    return this.rows[index].every(value => this.index[value].selected)
  }
  
  testColumn(index) { 
    return this.columns[index].every(value => this.index[value].selected)
  }
  
  testRows() {
    return this.rows.some((row, index) => this.testRow(index))
  }
  
  testColumns() {
    return this.columns.some((column, index) => this.testColumn(index))
  }
  
  testBoard() {
    return this.testRows() || this.testColumns()
  }
  
  callNumber(number) {
    if (this.index.hasOwnProperty(number)) {
      this.index[number].selected = true
      if (this.testBoard()) {
        return true
      }
    }
    return false
  }
  
  calculateScore(number) {
    const sumOfUnselected = Object.keys(this.index)
    .reduce((total, key) => {
      if (!this.index[key].selected) {
        return total += this.index[key].value
      }
      return total
    }, 0)
    return sumOfUnselected * number
  }
}

const boards = rawBoards.map(board => new Board(board))

// let draw = 0
// let winner = false
// let winningBoard = null
// while (!winner) {
//   const numberDrawn = drawOrder[draw]
//   winner = boards.some(board => {
//     winningBoard = board
//     return board.callNumber(numberDrawn)
//   })
//   if (winner) {
//     console.log('Winner!', winningBoard.calculateScore(numberDrawn))
//   }
//   draw++
// }


// draw = 0
// winner = false
// let newBoards = [
//   ...boards,
// ]
// while (!winner) {
//   const numberDrawn = drawOrder[draw]
//   if (newBoards.length > 1) {
//     newBoards = newBoards.filter(board => !board.callNumber(numberDrawn))
//   } else {
//     winner = newBoards[0].callNumber(numberDrawn)
//     if (winner) {
//       console.log('Winner', newBoards[0].calculateScore(numberDrawn))
//     }
//   }
//   draw++
// }

module.exports = {
  rawBoards,
  drawOrder
}
