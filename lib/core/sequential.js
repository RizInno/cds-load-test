import fetch from 'node-fetch'
import Config from '../conf/config.js'
import TestExecution from './testexecution.js'

export default class Sequential extends TestExecution {
  async implementation () {
    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      const record = this._testData[recIndex]

      const url = Config.uri + '/' + this._entityName
      // console.log('url: ' + url)

      // Start timer
      const startTime = new Date()

      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(record),
        headers: { 'Content-Type': 'application/json' }

      })

      const endTime = new Date()

      this._updateResults4Record(recIndex, startTime, endTime, endTime - startTime, response)
    }
  }
}
