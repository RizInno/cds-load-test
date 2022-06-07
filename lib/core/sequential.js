import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'

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

      // Start timer
      const startTime = new Date()

      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(record),
        headers: { 'Content-Type': 'application/json' }

      })

      // Stop the clock
      const endTime = new Date()
      // Call update results function
      this._updateResults4Record(recIndex, startTime, endTime, endTime - startTime, response)
    }
  }
}
