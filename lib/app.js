import Metadata from './meta/metadata.js';
import Testdata from './data/testdata.js';
import Config from './conf/config.js';
import Sequential from './core/sequential.js';
import Parallel from './core/parallel.js';
import BatchSequential from './core/batchsequential.js';

export default class Application {
    constructor() {
        this.name = 'SAP CAP Load Test'
        Config.testCycleCount = 5
    }

    async run() {
        console.log(this.name)

        // Read service meta data
        const csn = await new Metadata().csn()
        //console.log(csn)

        // read or generate test data
        const testdata = await new Testdata(csn).obj()
        console.log(testdata)

        // execute test runs
        //const testExecution = new Sequential('TestRecords', testdata).run()
        // const testExecution = new BatchSequential('TestRecords', testdata).run()
        const testExecution = new Parallel('TestRecords', testdata).run()

        // write test results

    }

}
