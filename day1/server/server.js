const express = require('express')
const path = require('path')
const { readFile } = require('../../utils')

const app = express()

app.use(express.static('public/'))

const data = readFile(path.resolve(__dirname,'../input1.txt'))

app.get('/data', (req, res) => {
  res.send(data.split('\n').map(x => parseInt(x)))
})

app.listen(5000, () => console.log('listening on port 5000'))
