
import Config from '../conf/config.js'
import babar from 'babar'
import cliProgress from 'cli-progress'
import Debug from 'debug'
const debug = Debug('cds-load-test:TestExecution')

export default class TestExecution {
  _progressBar
  _testData
  _recordResults = []
  _udpatedRecords = 0
  _results = {
    nrParallelChannels: 1,
    timeStart: 0,
    timeEnd: 0,
    timeElapsed: 0,
    timeElapsedPerRecord: 0,
    recordsProcessed: 0,
    recordsProcessingTimeTotal: 0,
    recordsProcessingTimeMin: 99999999,
    recordsProcessingTimeMax: 0,
    recordsProcessingTimeAvg: 0,
    recordsProcessingSuccess: 0,
    recordsProcessingFailure: 0,
    recordsFailureMsgs: []
  }

  _runtimeDistribution = {}

  _entityName
  constructor (entityName, dataSet) {
    this._testData = dataSet
    this._entityName = entityName

    this._progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
  }

  async run () {
    debug('--- TestExecution.run() called ---')

    // Initialize Progress bar
    this._progressInitialize(this._testData.length)

    // Start the time
    this._results.timeStart = new Date()

    // Starts sequential execution
    await this.implementation()

    // Stop the clock
    this._results.timeEnd = new Date()

    // Finish the progress bar
    this._progressFinish()

    // Generate result summary
    this._generateResults()

    // Output results
    this._outputResultsToConsole()
  }

  _progressInitialize (recordCount) {
    this._progressBar.start(recordCount, 0)
  }

  _progressUpdate (currentRecord) {
    this._progressBar.update(currentRecord)
  }

  _progressFinish () {
    this._progressBar.stop()
  }

  async implementation () {
    throw new Error('!!! --- You need to implement the method "implementation()" --- !!!')
  }

  /*
  _preResultArray () {
    for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
      this._recordResults.push({})
    }
  }
*/
  _outputResultsToConsole () {
    if (Config.outputRecordResponseTable) {
      console.log('--- Record Results ---')
      console.table(this._recordResults)
    }

    console.log('--- Call Response Time Distribution (x - time per request / y - count of response times ---')
    this._outputCallDistributionChart()

    console.log('--- Results ---')
    console.log(this._results)
  }

  _outputCallDistributionChart () {
    const chartArray = []

    // Convert call distribution to 2D arrray
    for (const key in this._runtimeDistribution) {
      chartArray.push([parseInt(key), this._runtimeDistribution[key]])
    }

    console.log(babar(chartArray))
    // console.log("array is: ", chartArray)
  }

  _generateResults () {
    for (let recIndex = 0; recIndex < this._recordResults.length; recIndex++) {
      // Reference current record
      const curRec = this._recordResults[recIndex]

      // Increment number of records processed
      this._results.recordsProcessed++

      // Increase total record processing time
      this._results.recordsProcessingTimeTotal += curRec.timeElapsed

      // Populate distribution view
      if (this._runtimeDistribution[curRec.timeElapsed]) {
        this._runtimeDistribution[curRec.timeElapsed]++
      } else {
        this._runtimeDistribution[curRec.timeElapsed] = 1
      }

      // update Min and Max if necessary
      if (curRec.timeElapsed < this._results.recordsProcessingTimeMin) {
        this._results.recordsProcessingTimeMin = curRec.timeElapsed
      }
      if (curRec.timeElapsed > this._results.recordsProcessingTimeMax) {
        this._results.recordsProcessingTimeMax = curRec.timeElapsed
      }

      // Increase Success and Failure
      if (curRec.resOk) {
        this._results.recordsProcessingSuccess++
      } else {
        this._results.recordsProcessingFailure++
        this._results.recordsFailureMsgs.push({
          code: curRec.resStatus,
          text: curRec.resStatusText
        })
      }
    }

    // Calculate elapsed time
    this._results.timeElapsed = this._results.timeEnd - this._results.timeStart

    // Calculate Average time
    this._results.recordsProcessingTimeAvg = this._results.recordsProcessingTimeTotal / this._results.recordsProcessed

    // Calculate elapsed time per record
    this._results.timeElapsedPerRecord = this._results.timeElapsed / this._results.recordsProcessed
  }

  _updateResults4Record (recordIndex, executionStart, executionEnd, executionElapsed, fetchResult) {
    this._udpatedRecords++

    // Update progress bar
    this._progressUpdate(this._udpatedRecords)

    debug('Update Record', recordIndex)
    this._recordResults.push({
      refIndex: recordIndex,
      timeStart: executionStart,
      timeEnd: executionEnd,
      timeElapsed: executionElapsed,
      resOk: fetchResult.ok,
      resStatus: fetchResult.status,
      resStatusText: fetchResult.statusText

    })
  }
}
