class Config{

    testCycleCount
    uri
    useRandomData = true
    RandomDataNrOfGeneratedRecords = 1000
    batchSize = 3
    parallelChannels = 20

    constructor(){
        this.testCycleCount = 3
        this.uri = 'http://localhost:4004/refsvc'
        console.log('--- config constructor called ---') 
    }

    
    

}
export default new Config()