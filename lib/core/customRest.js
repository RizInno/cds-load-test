import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'
import Debug from 'debug'
import AuthCache from '../auth/auth-cache.js'

const debug = Debug('cds-load-test:customRest')

/**
 * This implementation of Test Execution sends a custom Rest request to the service.
 */
export default class CustomRest extends TestExecution {
  /**
   * Implementation of the Parent method
   */
  async implementation () {
    debug('implementation of customRest implementation')

    const url = Config.serviceUri + '/mass-change/insertAll'

    // Assemble custom body
    const customBody = {
      insEntity: Config.serviceEntityName,
      insArray: this._testData
    }

    // Attach authorization header if applicable
    const requestHeaders = await AuthCache.getHeader()

    // add content type to headers
    requestHeaders['Content-Type'] = 'application/json'

    // Start timer
    const startTime = new Date()

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(customBody),
      headers: requestHeaders
    })

    // Stop the clock
    const endTime = new Date()
    debug('Response Object', response)

    debug('Call', startTime, endTime, endTime - startTime, 'Record count', this._testData.length)

    const averageElapsedRecordTime = (endTime - startTime) / this._testData.length

    const resInput = {}
    resInput.ok = (response.status > 199 && response.status < 300)
    resInput.status = response.status

    if (resInput.ok) {
      resInput.statusText = ''
    } else {
      if (response.body.error) {
        resInput.statusText = response.body.error.message
      } else if (response.statusText) {
        resInput.statusText = response.statusText
      }
    }

    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      // Call update results function
      this._updateResults4Record(recIndex, startTime, endTime, averageElapsedRecordTime, resInput)
    }
  }
}
