import fetch from 'node-fetch';
import Config from '../conf/config.js';
import TestExecution from './testexecution.js';

export default class Parallel extends TestExecution {

    _requestCounter
    _requestCount

    async sendRequest(recIndex, record) {
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

        this._updateResults4Record(recIndex, startTime, endTime, endTime - startTime, response)
    }

    async channel(channelNr) {

            //console.log('Channel Entry', channelNr)
            let requestIndex = this.getNextRequestIndex()

            //console.log('RequestIndex', channelNr, requestIndex)

            while (requestIndex !== null){
    
                // console.log("Channel: ", channelNr, "Request: ",requestIndex)
                
                await this.sendRequest(requestIndex, this._testData[requestIndex])
    
                // Request next index
                requestIndex = this.getNextRequestIndex()
            }


        //this.sendRequest()


    }

    /**
     * Returns the next available request id
     * @returns 
     */
    getNextRequestIndex() {

        if (this._requestCounter == this._requestCount) {
            return null
        } else {
            let retValue = this._requestCounter
            this._requestCounter++
            return retValue
        }

    }

    resetRequestIndex() {
        // Reset counter
        this._requestCounter = 0
        this._requestCount = this._testData.length

    }


    async implementation() {

        // Set result values for parallel channels
        this._results.nrParallelChannels = Config.parallelChannels

        this.resetRequestIndex()

        let channelList = []

        for (let ch = 0; ch < Config.parallelChannels; ch++){

            //console.log('Ch', ch +1  )
            channelList.push(this.channel(ch+1))
        }

        return Promise.all(channelList)

    }

}