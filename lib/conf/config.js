
class Config {
  constructor () {
    this.testCycleCount = 3
    this.uri = 'http://localhost:4004/refsvc'
    this.useRandomData = true
    this.RandomDataNrOfGeneratedRecords = 1000
    this.parallelChannels = 20
    this.outputRecordResponseTable = false
    this.executionType = 3
  }

  // --- General
  uri // URI for the service to test

  // --- Test Data Parameters
  useRandomData // determine if Random data is called. If false, a csv file is read
  RandomDataNrOfGeneratedRecords // Number of Random records to be generated

  // --- Test Execution
  executionType // Execution Type of Test. Possible values 1-Sequential, 2-BatchSequential, 3-Parallel, 4-BatchParallel

  // Batch Sequential
  batchSize // Batch size

  // Parallel
  parallelChannels // Number of parallel channels

  // --- Report output
  outputRecordResponseTable // Determines if the records details should be output to the console
}
export default new Config()
