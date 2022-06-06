import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'

export default class BatchSequential extends TestExecution {
  async sendBatch (batchRecords) {
    const url = Config.uri + '/$batch'
    // console.log('url: ' + url)

    // Start timer
    const startTime = new Date()

    // Assemble batch body
    const batchBody = { requests: batchRecords }

    console.log('Batch Body is', batchBody)

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(batchBody),
      headers: { 'Content-Type': 'application/json' }

    })

    const endTime = new Date()
    await this.processPatchResponse(startTime, endTime, response)
  }

  async processPatchResponse (startTime, endTime, response) {
    // If overall response comes back as ok
    if (response.ok) {
      const jsonResponse = await response.json()

      // get reference to responses array
      const responses = jsonResponse.responses

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

        /*
                "refIndex": recordIndex,
                "timeStart": executionStart,
                "timeEnd": executionEnd,
                "timeElapsed": executionEnd - executionStart,
                "resOk": fetchResult.ok,
                "resStatus": fetchResult.status,
                "resStatusText": fetchResult.statusText
                */

        this._updateResults4Record(res.id, startTime, endTime, averageElapsedRecordTime, resInput)
      }
    } else {
      throw new Error('Overall Batch Response is in error: ', response.status, response.statusText)
    }
  }

  async implementation () {
    const batchSize = Config.batchSize
    console.log('implementation of batch sequential')

    let batchRecords = []

    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      const record = this._testData[recIndex]

      batchRecords.push(this._wrapInOdataBatchFormat(record, recIndex, this._entityName))

      if (batchRecords.length === batchSize) {
        await this.sendBatch(batchRecords)
        // reset batchRecords
        batchRecords = []
      }
    }

    if (batchRecords.length > 0) {
      await this.sendBatch(batchRecords)
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
