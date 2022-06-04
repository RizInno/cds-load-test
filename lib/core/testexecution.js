
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

        // Starts sequential execution
        await this.sequential()

        // Generate result summary 
        this._generateResults()

        // Output results
        this._outputResultsToConsole()

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

    async sequential() {



        this._results.timeStart = new Date()


        for (let recIndex = 0; recIndex < this._testData.length; recIndex++) {

            let record = this._testData[recIndex]

            let url = Config.uri + '/' + this._entityName
            // console.log('url: ' + url)

            // Start timer 
            let startTime = new Date()

            const response = await fetch(url, {
                method: 'post',
                body: JSON.stringify(record),
                headers: { 'Content-Type': 'application/json' }

            })

            let endTime = new Date()

            this._updateResults4Record(recIndex, startTime, endTime, response)

        }
        this._results.timeEnd = new Date()

    }

    _updateResults4Record(recordIndex, executionStart, executionEnd, fetchResult) {

        console.log('Update Record', recordIndex)
        this._recordResults.push({
            "refIndex": recordIndex,
            "timeStart": executionStart,
            "timeEnd": executionEnd,
            "timeElapsed": executionEnd - executionStart,
            "resOk": fetchResult.ok,
            "resStatus": fetchResult.status,
            "resStatusText": fetchResult.statusText

        })

    }



    async odataBatch() {

    }

    async parallel(numberOfConnections) {

    }
}