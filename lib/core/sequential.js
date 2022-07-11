import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'
import AuthCache from '../auth/auth-cache.js'

/**
 * Simplest implementation of the send function using sequential approach
 */
export default class Sequential extends TestExecution {
  /**
   * Implementation of the parent functionality
   */
  async implementation () {
    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      const record = this._testData[recIndex]

      // Assemble URL
      const url = Config.serviceUri + '/' + Config.servicePath + '/' + Config.serviceEntityName

      // Attach authorization header if applicable
      const requestHeaders = await AuthCache.getHeader()

      // add content type to headers
      requestHeaders['Content-Type'] = 'application/json'

      // Start timer
      const startTime = new Date()

      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(record),
        headers: requestHeaders

      })

      // Stop the clock
      const endTime = new Date()
      // Call update results function
      this._updateResults4Record(recIndex, startTime, endTime, endTime - startTime, response)
    }
  }
}
