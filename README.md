# SAP CAP Load Test Tool
This tool allows you to excert/simulate load onto your CAP OData service. 

We implemented 3 modes of pushing load onto the backend service: 
1. Sequential processing of all requests
2. Use of OData Batch functionality
3. Parallel/Pool send of requests
4. Custom REST service to allow for custom processing of requests

<img src="doc/img/cds-load-test.png">

**Benchmark**
- Performance results can be found [here](doc/performance_results.md)


**Notworthy Current Limitations**
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
- Service.auth.type - The authentication type to be used. There are three options available: 
    1. none - In case the service does not require any authentication.
    2. basic - In case the service requires basic authentication.
    3. oauth2 - In case the service requires OAuth2 authentication 
    *!!! At the moment only client credentials are supported !!!*
        - **You can find the necessary information in the service key to the bound XSUAA service**
- Service.auth.tokenUrl - You can find the token URL in the service key to the bound XSUAA service or in the application bindings. This value is usually a combination of the value specified in credentials.url and the string '/oauth/token' and should look like this: https://sap-test.authentication.us10.hana.ondemand.com/oauth/token
- Service.auth.grantType - Only "client_credentials" is supported at the moment
- Service.auth.clientId - The client id to be used.
- Service.auth.clientSecret - The client id to be used.
- Service.auth.username - The username to be used for authentication.
- Service.auth.password - The password to be used for authentication.
- Data.useRandom - Indicates if random data should be generated or a provided csv file should be used
- Data.randomData.nrOfGeneratedRecords - If useRandom is set to true, this indicates the number of records that should be created for testing
- Data.csv.fileName - File name of the csv file to be used '
- Test.type - This allows for the configuration of the test type. The list of option is: 
    1. sequential
    2. batchSequential
    3. parallel
    4. batchParallel - not implemented yet
    5. customRest
- Test.batchSequential.batchSize - Batch Size for execution type batchSequential
- Test.parallel.channelCount - Channel count for execution type parallel
- Test.batchParallel.batchSize - Batch Size for execution type batchParallel
- Test.batchParallel.channelCount - Channel count for execution type batchParallel
- Report.showRecordResponseTable - Flag to show a detailed table of each record response

### Execute the test
To start the execution simply execute `npm start`

#### Testing the refernce service on the BTP
To deploy the reference service to the BTP, perform the following steps:
1. Change to the reference server directory `cd test/refsvc`
2. Run `npm install`
3. Run `mbt build` to build the reference service and create the MTA.
4. Deploy the mta using the following command: `cf deploy ./mta_archives/riz.inno.cds-lt_1.0.0.mtar`. The deployment process will provide you with a reference to the endpoint for the reference server. it should look something like this
```log
...
Scaling application "refsrv-srv" to "1" instances... 
Staging application "refsrv-db-deployer"...
Staging application "refsrv-srv"...
Application "refsrv-srv" staged
Starting application "refsrv-srv"...
Application "refsrv-db-deployer" staged
Application "refsrv-srv" started and available at "[your endpoint].hana.ondemand.com"
Executing task "deploy" on application "refsrv-db-deployer"...
Skipping deletion of services, because the command line option "--delete-services" is not specified.
Process finished.
Use "cf dmol -i b79b533e-e737-11ec-908d-eeee0a8a55c8" to download the logs of the process.```
```

5. Use the endpoint information you get from the deployment to configure the test environment default.json (you can find it in the config directory).

## Installation
### Test Tool
The test tool is located in the main directory
1. Clone the repository  `git clone https://github.com/RizInno/cds-load-test.git`
2. Install the dependencies of the client tool 
    1. Execute the dependency installation in the main directory `npm i`

### Test Server
The reference server implementation can be found here [https://github.com/RizInno/cds-load-refsrv](https://github.com/RizInno/cds-load-refsrv)
The tool provides a simple test server to evaluate the varying settings. 

## MassChange Service
To add the mass change service that allows for test option 'customRest', you have to add the following REST service to your implementation:

```cds
@protocol: 'rest'
service MassChangeService {
    
    @open
    type AnyArray {};
    
    action insertAll(insEntity : String, insArray: AnyArray) returns AnyArray;
 
}
```
...together with the handler..
```node
const cds = require('@sap/cds')

/**
 * Implementation of the Mass Change service handler
 */
class MassChangeService extends cds.ApplicationService {

    async init() {

        const namespace = 'riz.cds.lt' // Namespace defintion
        const serviceName = 'ReferenceService' // Service name

        // Connect to the service
        const srv = await cds.connect.to(serviceName);

        /**
         * Event handler for 'insertAll' action
         */
        this.on('insertAll', async (req) => {

            // Get reference to the entity defintion for the entity specified in the action
            const entity = srv.entities(namespace)[req.data.insEntity]

            // Assemble the Insert query
            const ins = INSERT.into(entity).entries(req.data.insArray)
            
            // Execute the query
            const res = await srv.run(ins)

            // Return results
            return {"value":res}
        })

        // ensure to call super.init()
        await super.init()
    }

}
module.exports = MassChangeService
```
### Patch to prevent "Payload too large error"
in order to prevent a "Payload too large error" we need to increase the possible payload via a patch. You can find the temporary patch in the directory [./test/refsrv/patches/@sap+cds+6.0.3.patch](./test/refsrv/patches/@sap+cds+6.0.3.patch)

*Please also see: https://answers.sap.com/questions/13675664/cap-nodejs-rest-adapter-usage-with-large-json-obje.html*


## Challenges
When trying to run an initial test with parameters: 

Data.randomData.nrOfGeneratedRecords = 100000
Test.type = parallel
Test.parallel.channelCount = 100

The BTP will assume it is a DOS attach and usually shuts down the server temproarily at around 1,000 requests.
