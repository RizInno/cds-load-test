import { v4 } from 'uuid'

/**
 * Random Data Generator
 */
export default class Generator {
  /**
   * Provides implementation for varying data types
   * @param {Object} csnType field meta data
   * @returns {Object} random value for this field type
   */
  getData4CsnType (csnType) {
    if (csnType.type === 'cds.String' || csnType.type === 'cds.LargeString' || csnType.type === 'User') {
      return this.getString(csnType)
    } else if (csnType.type === 'cds.Boolean') {
      return this.getBoolean()
    } else if (csnType.type === 'cds.Integer' || csnType.type === 'cds.Integer64') {
      return this.getInteger(csnType)
    } else if (csnType.type === 'cds.DecimalFloat' || csnType.type === 'cds.Double' || csnType.type === 'cds.Decimal') {
      return this.getFloat(csnType)
    } else if (csnType.type === 'cds.Timestamp' || csnType.type === 'cds.DateTime') {
      return this.getTimeStamp()
    } else if (csnType.type === 'cds.Date') {
      return this.getDate()
    } else if (csnType.type === 'cds.Time') {
      return this.getTime()
    } else if (csnType.type === 'cds.UUID') {
      return this.getUUID()
    } else {
      throw new Error('Random Data Generation for ' + csnType.type + ' not implemented yet.')
    }
  }

  /**
   * Provides a UUID
   * @returns {String} well formed UUID
   */
  getUUID () {
    return v4()
  }

  /**
   * Provides a random DateTime in format '2021-06-27T14:52:23Z'
   * @returns {String} random value
   */
  getDateTime () {
    return this.getTimeStamp().slice(0, 19) + 'Z'
  }

  /**
   * provides a random time in format '07:59:59'
   * @returns {String} random value
   */
  getTime () {
    return this.getTimeStamp().slice(11, 19)
  }

  /**
   * Returns a random date in format '2021-06-27'
   * @returns {String} random value
   *
   */
  getDate () {
    return this.getTimeStamp().slice(0, 10)
  }

  /**
   * Provides a random timestamp in format '2021-06-27T14:52:23.123Z'
   * @returns {String} a TimeStamp in ISO String format
   */
  getTimeStamp () {
    const start = new Date(1950, 1, 1)
    const end = new Date(2050, 1, 1)

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
  }

  /**
   * Return a random float by dividing two random integer values with each other
   * @param {Object} csnType Meta data
   * @returns {float} random floating point value
   */
  getFloat (csnType) {
    return this._getRandomInt(-5000, 5000) / this._getRandomInt(-5000, 5000)
  }

  /**
   * Provides a random boolean value
   * @returns {Boolean} random value
   */
  getBoolean () {
    if (this._getRandomInt(0, 1) === 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Returns an Integer
   * @param {*} csnType meta data for Integer or Integer64
   * @returns {BigInt} random Integer
   */
  getInteger (csnType) {
    // Default lower and upper boundaries
    const lower = -2147483648
    const upper = 2147483647

    return this._getRandomInt(lower, upper)
  }

  /**
   * Returns a random String based on the length provided in the type definition of csnType. It will use 5000 characters as the default max length
   * @param {Object} csnType field meta data
   * @returns {String} a random String
   */
  getString (csnType) {
    const length = csnType.length || 5000
    //    console.log("length is", length)

    let s = ''

    for (let z = 0; z < this._getRandomInt(5, length); z++) {
      s += this._getRandomChar()
    }

    //  console.log('String ', s)
    return s
  }

  /**
   * Returns a random Unicode character between start and end
   * @returns {String} a random character
   */
  _getRandomChar () {
    const unicodeStartChar = 65 // unicode value for 'a'
    const unicodeEndChar = 122 // unicode value for 'Z'

    return String.fromCharCode(this._getRandomInt(unicodeStartChar, unicodeEndChar))
  }

  /**
   * Returns a random integer between the values of floor and ceiling
   * @param {int} floor lowest possible value
   * @param {int} ceiling highest possible value
   * @returns {int} a random number
   */
  _getRandomInt (floor, ceiling) {
    return floor + Math.floor(Math.random() * (ceiling - floor + 1))
  }
}
