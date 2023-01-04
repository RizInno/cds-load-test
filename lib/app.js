import Metadata from './meta/metadata.js'
import Testdata from './data/testdata.js'
import Config from './conf/config.js'
import Sequential from './core/sequential.js'
import Parallel from './core/parallel.js'
import BatchSequential from './core/batchsequential.js'
import CustomRest from './core/customRest.js'

import Debug from 'debug'

const debug = Debug('cds-load-test:app')

/**
 * Application entry point
 */
export default class Application {
  /**
   * Constructor
   * @param {Object} config - configuration object
   */
  constructor (config) {
    // Set config if provided
    if (config) {
      Config.setConfiguration(config)
    } else {
      Config.setConfiguration({})
    }

    this.name = 'SAP CAP Load Test'
  }

  /**
   * Get config
   */
  get config () {
    return Config.getConfiguration()
  }

  /**
   * Set config
   */
  set config (config) {
    Config.setConfiguration(config)
  }

  /**
   * Runs the test with the afore specified configuration
   * @returns {Object} - test results
   */
  async run () {
    debug('Config for run is:', Config)

    // Read service meta data
    const csn = await new Metadata().csn()
    // console.log(csn)

    // read or generate test data
    const testdata = await new Testdata(csn).obj()

    // Define test execution type
    let testExecutionResults = {}

    // execute test runs
    switch (Config.testExecutionType) {
      case 'sequential':
        testExecutionResults = await new Sequential(testdata).run()
        break
      case 'batchSequential':
        testExecutionResults = await new BatchSequential(testdata).run()
        break
      case 'parallel':
        testExecutionResults = await new Parallel(testdata).run()
        break
      case 'customRest':
        testExecutionResults = await new CustomRest(testdata).run()
        break
      case 'batchParallel': throw new Error('Execution type "Batch Parallel" is not implemented yet.')
      default:
        throw new Error('Execution type ', Config.testExecutionType, ' is not implemented.')
    }

    return testExecutionResults
  }
}
