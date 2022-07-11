import fetch from 'node-fetch'
import Debug from 'debug'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'
import AuthCache from '../auth/auth-cache.js'
const debug = Debug('cds-load-test:Parallel')

/**
 * Test Execution implementation for parallel implementation
 */
export default class Parallel extends TestExecution {
  _requestCounter // Counter for the requests
  _requestCount // Total expected request count

  /**
   * Implementation of the parent class
   * @returns {Promise} Promise to capture all channels
   */
  async implementation () {
    // Set result values for parallel channels
    this._results.nrParallelChannels = Config.testParallelChannelcount

    this._resetRequestIndex()

    const channelList = []

    for (let ch = 0; ch < Config.testParallelChannelcount; ch++) {
      // console.log('Ch', ch +1  )
      channelList.push(this.channel(ch + 1))
    }

    return Promise.all(channelList)
  }

  /**
   * Send request to server
   * @param {int} recIndex index of the record in the source data set
   * @param {Object} record record to be send to the server
   */
  async _sendRequest (recIndex, record) {
    const url = Config.serviceUri + '/' + Config.servicePath + '/' + Config.serviceEntityName
    // console.log('url: ' + url)

    // Attach authorization header if applicable
    const requestHeaders = await AuthCache.getHeader()

    // add content type to headers
    requestHeaders['Content-Type'] = 'application/json'

    // Start timer
    const startTime = new Date()

    // Send request to the server
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(record),
      headers: requestHeaders

    })

    // Stop the clock
    const endTime = new Date()
    // Updates the result information
    this._updateResults4Record(recIndex, startTime, endTime, endTime - startTime, response)
  }

  /**
   * Represents a channel to send requests through
   * @param {int} channelNr Channel Number
   */
  async channel (channelNr) {
    // Retrieves the next available request index
    let requestIndex = this._getNextRequestIndex()

    // Loop through all requests
    while (requestIndex !== null) {
      debug('Channel: ', channelNr, 'Request: ', requestIndex)

      // Send request to server
      await this._sendRequest(requestIndex, this._testData[requestIndex])

      // Request next index
      requestIndex = this._getNextRequestIndex()
    }
  }

  /**
     * Returns the next available request id
     * @returns
     */
  _getNextRequestIndex () {
    if (this._requestCounter === this._requestCount) {
      return null
    } else {
      const retValue = this._requestCounter
      this._requestCounter++
      return retValue
    }
  }

  /**
   * reset the request index
   */
  _resetRequestIndex () {
    // Reset counter
    this._requestCounter = 0
    this._requestCount = this._testData.length
  }
}
