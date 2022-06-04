
import fetch from 'node-fetch';
import Config from '../conf/config.js';

export default class TestExecution {
    _testData
    _recordResults = []
    _results = {
        "timeStart": 0,
        "timeEnd": 0,
        "timeElapsed": 0,
        "timeElapsedPerRecord": 0,
        "recordsProcessed": 0,
        "recordsProcessingTimeTotal": 0,
        "recordsProcessingTimeMin": 99999999,
        "recordsProcessingTimeMax": 0,
        "recordsProcessingTimeAvg": 0,
        "recordsProcessingSuccess": 0,
        "recordsProcessingFailure": 0,
        "recordsFailureMsgs": [],
        "runtimeDistribution": {}

    }
    _entityName
    constructor(entityName, dataSet) {

        this._testData = dataSet
        this._entityName = entityName
    }

    async run() {
        console.log('--- TestExecution.run() called ---')

        // Preps the result Array
        this._preResultArray

        // Start the time 
        this._results.timeStart = new Date()

        // Starts sequential execution
        await this.implementation()

        this._results.timeEnd = new Date()

        // Generate result summary 
        this._generateResults()

        // Output results
        this._outputResultsToConsole()

    }

    async implementation(){
        throw new Error('!!! --- You need to implement the method "implementation()" --- !!!')
    }

    _preResultArray() {
        for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {
            this._recordResults.push({})
        }
    }

    _outputResultsToConsole() {
        console.log('--- Record Results ---')
        console.table(this._recordResults)
        
        console.log('--- Results ---')
        console.log(this._results)
    }

    _generateResults() {

        for (let recIndex = 0; recIndex < this._recordResults.length; recIndex++) {

            // Reference current record
            let curRec = this._recordResults[recIndex]

            // Increment number of records processed
            this._results.recordsProcessed++

            // Increase total record processing time
            this._results.recordsProcessingTimeTotal += curRec.timeElapsed

            // Populate distribution view
            if (this._results.runtimeDistribution[curRec.timeElapsed]) {
                this._results.runtimeDistribution[curRec.timeElapsed]++
            } else {
                this._results.runtimeDistribution[curRec.timeElapsed] = 1
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
            }
            else {
                this._results.recordsProcessingFailure++
                this._results.recordsFailureMsgs.push({
                    "code": curRec.resStatus,
                    "text": curRec.resStatusText
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

    _updateResults4Record(recordIndex, executionStart, executionEnd, executionElapsed, fetchResult) {

        console.log('Update Record', recordIndex)
        this._recordResults.push({
            "refIndex": recordIndex,
            "timeStart": executionStart,
            "timeEnd": executionEnd,
            "timeElapsed": executionElapsed,
            "resOk": fetchResult.ok,
            "resStatus": fetchResult.status,
            "resStatusText": fetchResult.statusText

        })

    }



    

    
}