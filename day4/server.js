const express = require('express')
const path = require('path')

const boards = require(path.resolve(__dirname, 'd4.js'))

const app = express()

app.use(express.static('public'))

app.get('/data', (req, res) => {
  res.send(boards)
})

app.listen(5000, () => console.log('Listening on port 5000'))
