const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const dimension = Math.min(window.innerHeight - 10, window.innerWidth - 10)

canvas.height = dimension
canvas.width = dimension



ctx.fillStyle = 'black'
ctx.fillRect(0,0,dimension,dimension)
document.body.appendChild(canvas)

class Board {
  constructor(board) {
    this.board = board
    this.indexBoard(this.board)
  }

  drawBoard(ctx, x0, y0, scale) {
    const winner = this.testBoard()
    ctx.fillStyle = winner ? 'black' : 'whitesmoke'
    ctx.strokeStyle = 'green'
    if (winner) {
      ctx.rect(x0, y0, 2 + 11 * scale, 2 + 11 * scale)
      ctx.stroke()
    }
    ctx.fillRect(x0, y0, 2 + 11 * scale, 2 + 11 * scale)
    for(let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = this.index[this.board[i][j]].selected ? 'green' : 'darkgray'
        ctx.fillRect(scale + x0 + 2 * (scale * j), scale + y0 + 2 * (scale * i), scale, scale)
      }
    }
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

function drawBoards(boards, scale) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      boards[10 * i + j].drawBoard(ctx, (2 * scale) + j * ((2 * scale) + 11 * scale), (2 * scale) + i * ((2 * scale) + 11 * scale), scale)
    }
  }
}

function checkWinner(boards) {
  return boards.some(board => board.testBoard())
}


const boards = rawBoards.map(rawBoard => new Board(rawBoard))
const scale = dimension / 132
console.log(scale)
function callNumber(number) {
  boards.forEach(board => {
    board.callNumber(number)
  })
}
let draw = 0
const token = setInterval(() => {
  callNumber(drawOrder[draw])
  drawBoards(boards, scale)
  if (checkWinner(boards)) {
    clearInterval(token)
  }
  draw++
}, 250)
