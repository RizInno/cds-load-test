class Config{

    testCycleCount
    uri

    constructor(){
        this.testCycleCount = 3
        this.uri = 'http://localhost:4004/refsvc'
        console.log('--- config constructor called ---') 
    }

    
    

}
export default new Config()