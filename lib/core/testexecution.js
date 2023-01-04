
import Config from '../conf/config.js'
import babar from 'babar'
import cliProgress from 'cli-progress'
import Debug from 'debug'
const debug = Debug('cds-load-test:TestExecution')

/**
 * Base TestExecution Class
 * This class represents the core of the load test
 */
export default class TestExecution {
  _testData // Contains the test data used to test the OData service
  _recordResults = [] // Array of results aliging through a reference index to the _testData array
  _results = {
    nrParallelChannels: 1,
    nrRecordsInBatch: 1,
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
  } // Overall result structure

  _runtimeDistribution = {} // Object to represent the runtime call duration distribution
  _progressBar // Progress Bar object
  _udpatedRecords = 0 // Number of updated records

  /**
   * Construcor
   * @param {Array} dataSet to use as test dataset for the performance test
   */
  constructor (dataSet) {
    this._testData = dataSet // assign test data set

    // Define the parameters of the progress bar
    this._progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
  }

  /**
   * core run function
   */
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

    // Return results
    return { summary: this._results, details: this._recordResults, testData: this._testData }
  }

  /**
   * framework implementation of the core function
   */
  async implementation () {
    throw new Error('!!! --- You need to implement the method "implementation()" --- !!!')
  }

  /**
   * Updates the internal result record array
   * @param {int} recordIndex reference to index in the _testData array
   * @param {Date} executionStart Execution start time for record
   * @param {Date} executionEnd Execution end time for record
   * @param {int} executionElapsed (estimated in case of batch processing) elapsed execution time in milliseconds
   * @param {Object} fetchResult fetch result object
   */
  _updateResults4Record (recordIndex, executionStart, executionEnd, executionElapsed, fetchResult) {
    // Increment number of updated records
    this._udpatedRecords++

    // Update progress bar
    this._progressUpdate(this._udpatedRecords)

    // Add result record to result array
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

  /**
   * Generate the summary results
   */
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

  /**
   * Initializes the progress bar
   * @param {int} recordCount Record count that is expected
   */
  _progressInitialize (recordCount) {
    if (Config.outputProgress === 'bar') {
      this._progressBar.start(recordCount, 0)
    } else if (Config.outputProgress === 'console') {
      console.log('--- Progress - total count:', recordCount, ' ---')
    } else {
      debug('Progress output disabled')
    }
  }

  /**
   * Update progress bar with the current progress
   * @param {int} currentRecord progress in processing
   */
  _progressUpdate (currentRecord) {
    if (Config.outputProgress === 'bar') {
      this._progressBar.update(currentRecord)
    } else if (Config.outputProgress === 'console') {
      console.log('Records processed:', currentRecord)
    }
  }

  /**
   * Indicate the finish of the progress
   */
  _progressFinish () {
    if (Config.outputProgress === 'bar') {
      this._progressBar.stop()
    } else if (Config.outputProgress === 'console') {
      console.log('Records processing - Finished')
    }
  }

  /**
   * Generate final output to the console
   */
  _outputResultsToConsole () {
    if (Config.outputRecordResponseTable) {
      console.log('--- Record Results ---')
      console.table(this._recordResults)
    }

    if (Config.outputCallDistributionChart) {
      console.log('--- Call Response Time Distribution (x - time per request / y - count of response times ---')
      this._outputCallDistributionChart()
    }
    if (Config.outputSummaryReport) {
      console.log('--- Results ---')
      console.log(this._results)
    }
  }

  /**
   * output call distribution chart
   */
  _outputCallDistributionChart () {
    const chartArray = []

    // Convert call distribution to 2D arrray
    for (const key in this._runtimeDistribution) {
      chartArray.push([parseInt(key), this._runtimeDistribution[key]])
    }

    // Output call distribution chart
    console.log(babar(chartArray))
  }
}
