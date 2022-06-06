import Metadata from './meta/metadata.js'
import Testdata from './data/testdata.js'
import Config from './conf/config.js'
import Sequential from './core/sequential.js'
import Parallel from './core/parallel.js'
import BatchSequential from './core/batchsequential.js'
import Debug from 'debug'

const debug = Debug('cds-load-test:app')

export default class Application {
  constructor () {
    this.name = 'SAP CAP Load Test'
    Config.testCycleCount = 5
  }

  async run () {
    debug('Config for run is:', Config)

    // Read service meta data
    const csn = await new Metadata().csn()
    // console.log(csn)

    // read or generate test data
    const testdata = await new Testdata(csn).obj()
    debug(testdata)

    // execute test runs
    switch (Config.executionType) {
      case 1:
        new Sequential('TestRecords', testdata).run()
        break
      case 2:
        new BatchSequential('TestRecords', testdata).run()
        break
      case 3:
        new Parallel('TestRecords', testdata).run()
        break
      // eslint-disable-next-line no-undef
      case 4: throw new Exception('Execution type "4 - Batch Parallel" is not implemented yet.')
      default:
        // eslint-disable-next-line no-undef
        throw new Exception('Execution type ', Config.executionType, ' is not implemented.')
    }
    // write test results
  }
}
