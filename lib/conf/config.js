class Config{

    testCycleCount
    uri
    useRandomData = false
    RandomDataNrOfGeneratedRecords = 5
    batchSize = 3

    constructor(){
        this.testCycleCount = 3
        this.uri = 'http://localhost:4004/refsvc'
        console.log('--- config constructor called ---') 
    }

    
    

}
export default new Config()