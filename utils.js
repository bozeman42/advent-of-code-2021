const fs = require('fs')

const readFile = filename => {
  return fs.readFileSync(filename).toString()
}

module.exports = {
  readFile
}