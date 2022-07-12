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
  constructor () {
    this.name = 'SAP CAP Load Test'
  }

  async run () {
    debug('Config for run is:', Config)

    // Read service meta data
    const csn = await new Metadata().csn()
    // console.log(csn)

    // read or generate test data
    const testdata = await new Testdata(csn).obj()

    // execute test runs
    switch (Config.testExecutionType) {
      case 'sequential':
        new Sequential(testdata).run()
        break
      case 'batchSequential':
        new BatchSequential(testdata).run()
        break
      case 'parallel':
        new Parallel(testdata).run()
        break
      case 'customRest':
        new CustomRest(testdata).run()
        break
      case 'batchParallel': throw new Error('Execution type "Batch Parallel" is not implemented yet.')
      default:
        throw new Error('Execution type ', Config.testExecutionType, ' is not implemented.')
    }
  }
}
