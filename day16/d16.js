const path = require('path')

const { readFile, padNibble } = require('../utils')

const VERSION_SUBSTRING = [0, 3]
const TYPE_ID_SUBSTRING = [3, 6]
const LENGTH_TYPE_ID_SUBSTRING = [6, 7]
const SUBPACKET_LENGTH_POSITION = 7
const SUBPACKET_TYPE_BIT = 0
const SUBPACKET_BIT_LENGTH = 15
const SUBPACKET_COUNT_LENGTH = 11

const useExample = true

const fileName = useExample ? 'example' : 'input'

const input = readFile(path.resolve(__dirname, `${fileName}.txt`))

class Packet {
  constructor(data) {
    this.data = data
    this.versionTotals = 0
    this.version = null
    this.typeId = null
    this.length = null
    this.subpackets = []
    this.parse()
    this.postPacketData = ''
  }

  static convertHexToBinary(hexString) {
    let result = ''
    hexString.split('').forEach(hexDigit => {
      result += padNibble(parseInt('0x' + hexDigit).toString(2))
    })
    return result
  }

  get value() {
    if (this.typeId === 4) return this._value
    let subpacketValues = this.subpackets.map(subpacket => subpacket.value)
    switch(this.typeId){
      case 0: // add
        return subpacketValues.reduce((a, b) => a + b)
      case 1: // subtract
        return subpacketValues.reduce((a, b) => a * b)
      case 2: // min
        return Math.min(...subpacketValues)
      case 3: // max
        return Math.max(...subpacketValues)
      case 5: // greater than
        return subpacketValues[0] > subpacketValues[1] ? 1 : 0
      case 6: // less than
        return subpacketValues[0] < subpacketValues[1] ? 1 : 0
      case 7: // equal to
        return subpacketValues[0] === subpacketValues[1] ? 1 : 0
      default: throw Error(`Case ${this.typeId} not handled`)
    }

  }

  parse() {
    this.version = parseInt(this.data.substring(...VERSION_SUBSTRING), 2)
    this.versionTotals = this.version
    this.typeId = parseInt(this.data.substring(...TYPE_ID_SUBSTRING), 2)
    this.parsePayload()
  }

  parsePayload() {
    if (this.typeId !== 4) {
      this.lengthTypeId = parseInt(this.data.substring(...LENGTH_TYPE_ID_SUBSTRING))
      const isBitLengthType = this.lengthTypeId === SUBPACKET_TYPE_BIT
      const lengthSize = this.lengthTypeId === SUBPACKET_TYPE_BIT ? SUBPACKET_BIT_LENGTH : SUBPACKET_COUNT_LENGTH
      const lengthEndBit = SUBPACKET_LENGTH_POSITION + lengthSize
      const lengthBits = this.data.substring(SUBPACKET_LENGTH_POSITION, lengthEndBit)
      if (isBitLengthType) {
        const length = parseInt(lengthBits, 2)
        this.length = 7 + lengthSize + length
        let subpacketData = this.data.substring(lengthEndBit, lengthEndBit + length)
        let totalSubpacketLength = 0
        while (totalSubpacketLength !== length) {
          let subpacket = new Packet(subpacketData)
          this.subpackets.push(subpacket)
          const subpacketLength = subpacket.length
          totalSubpacketLength += subpacketLength
          subpacketData = subpacketData.substring(subpacket.length)
        }
      } else if (!isBitLengthType) {
        const subpacketCount = parseInt(lengthBits, 2)
        this.length = 7 + lengthSize
        let subpacketData = this.data.substring(lengthEndBit)
        while (this.subpackets.length < subpacketCount) {
          let subpacket = new Packet(subpacketData)
          subpacketData = subpacketData.substring(subpacket.length)
          this.length += subpacket.length
          this.subpackets.push(subpacket)
        }
      }
      this.versionTotals += this.subpackets.reduce((total, subpacket) => total + subpacket.versionTotals, 0)
    } else {
      this._value = this.parseLiteral(this.data.substring(6))
    }
  }

  parseLiteral(data) {
    let literalDataString = ''
    let count = 0
    let offset = 0
    let shouldContinue = true
    while (shouldContinue) {
      literalDataString += data.substring(offset + 1, offset + 5)
      shouldContinue = data[offset] === '1'
      count++
      offset = 5 * count
    }
    this.length = 6 + offset
    return parseInt(literalDataString, 2)
  }
}

const packet = new Packet(Packet.convertHexToBinary(input))
console.log(packet.value)