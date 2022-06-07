# SAP CAP Load Test Tool
This tool allows you to excert/simulate load onto your CAP OData service. 

We implemented 3 modes of pushing load onto the backend service: 
1. Sequential processing of all requests
2. Use of OData Batch functionality
3. Parallel/Pool send of requests

<img src="doc/img/cds-load-test.png">

**Notworthy Current Limitations**
- No support for authorizations
- OData Meta data/CSN must be created manually
- Execution type 'batchParallel' not implemented yet

## Use of the app

### Test Environment setup
1. Ensure you followed the installation instructions below. 
2. Configure the test setup.
    - Adjust the configuration file [./config/default.json](./config/default.json)

#### Configuration Settings
- Service.uri - The endpoint for the service to be tested
- Service.entityName - The entity name to be used. You can find the entity name by accessing your .csn file i.e. [./data/meta/refsvc.csn](./data/meta/refsvc.csn)
- Data.useRandom - Indicates if random data should be generated or a provided csv file should be used
- Data.randomData.nrOfGeneratedRecords - If useRandom is set to true, this indicates the number of records that should be created for testing
- Data.csv.fileName - File name of the csv file to be used '
- Test.type - This allows for the configuration of the test type. The list of option is: 
    1. sequential
    2. batchSequential
    3. parallel
    4. batchParallel
- Test.batchSequential.batchSize - Batch Size for execution type batchSequential
- Test.parallel.channelCount - Channel count for execution type parallel
- Test.batchParallel.batchSize - Batch Size for execution type batchParallel
- Test.batchParallel.channelCount - Channel count for execution type batchParallel
- Report.showRecordResponseTable - Flag to show a detailed table of each record response

### Execute the test
To start the execution simply execute `npm start`

## Installation
### Test Tool
The test tool is located in the main directory
1. Clone the repository  `git clone https://github.com/RizInno/cds-load-test.git`
2. Install the dependencies of the client tool 
    1. Execute the dependency installation in the main directory `npm i`

### Test Server
The tool provides a simple test server to evaluate the varying settings. To prepare the server, execute the following:
1. Change to server directory `cd test/refsrv`
2. Execute the dependency installation in the main directory `npm i`



