import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'
import Debug from 'debug'

const debug = Debug('cds-load-test:batchsequential')

/**
 * This implementation of Test Execution sends OData Batches to the backend service
 */
export default class BatchSequential extends TestExecution {
  /**
   * Implementation of the Parent method
   */
  async implementation () {
    const batchSize = Config.testBatchsequentialBatchSize
    debug('implementation of batch sequential')

    let batchRecords = []

    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      const record = this._testData[recIndex]

      batchRecords.push(this._wrapInOdataBatchFormat(record, recIndex, Config.serviceEntityName))

      if (batchRecords.length === batchSize) {
        await this._sendBatch(batchRecords)
        // reset batchRecords
        batchRecords = []
      }
    }

    if (batchRecords.length > 0) {
      await this._sendBatch(batchRecords)
    }
  }

  /**
   * Sends the batch records provided as combined batch
   * @param {Array} batchRecords batch of records that should be sent in one go
   */
  async _sendBatch (batchRecords) {
    const url = Config.serviceUri + '/' + Config.servicePath + '/$batch'
    // console.log('url: ' + url)

    // Assemble batch body
    const batchBody = { requests: batchRecords }

    // Debug output
    debug('Batch Body is', batchBody)

    // Start timer
    const startTime = new Date()

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(batchBody),
      headers: { 'Content-Type': 'application/json' }

    })

    const endTime = new Date()
    await this._processBatchResponse(startTime, endTime, response)
  }

  /**
   * Process Batch response information
   * @param {Date} startTime The start time of the batch request
   * @param {Date} endTime The end time of batch request
   * @param {Object} response the node-fetch response
   */
  async _processBatchResponse (startTime, endTime, response) {
    // If overall response comes back as ok
    if (response.ok) {
      const jsonResponse = await response.json()

      // get reference to responses array
      const responses = jsonResponse.responses

      debug('Batch', startTime, endTime, endTime - startTime, 'Record count', responses.length)

      // Calculate average processing time per record
      const averageElapsedRecordTime = (endTime - startTime) / responses.length

      // Loop through responses
      for (const res of responses) {
        // console.log(res)
        // console.log(res.id, res.headers, res.body)

        const resInput = {}
        resInput.ok = (res.status > 199 && res.status < 300)
        resInput.status = res.status

        if (resInput.ok) {
          resInput.statusText = ''
        } else {
          resInput.statusText = res.body.error.message
        }

        // Update information for the individual record
        this._updateResults4Record(res.id, startTime, endTime, averageElapsedRecordTime, resInput)
      }
    } else {
      throw new Error('Overall Batch Response is in error: ', response.status, response.statusText)
    }
  }

  /**
  * Wraps the raw row data into an OData Batch format
  * @param {Object} row The content to be sent to target
  * @param {BigInteger} id row index
  * @param {String} entityName entity Name
  * @returns {Object} The row wrapped in the OData Batch format
  */
  _wrapInOdataBatchFormat (row, id, entityName) {
    return {
      id: '' + id,
      method: 'POST',
      url: entityName,
      headers: {
        'content-type': 'application/json',
        'odata-version': '4.0'
      },
      body: row
    }
  }
}
