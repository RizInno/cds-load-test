import clib from 'config'
import C from './constants.js'
import Debug from 'debug'
import jp from 'jsonpath'

const debug = Debug('cds-load-test:config')

/**
 * Central configuration class
 */
class Config {
  /**
   * Constructor
   */
  constructor () {
    // this._loadConfigFromFile()
    debug('Active Config is:', this)
  }

  /**
   * Returns the configuration as structured object
   * @returns {Object} the current configuration
   */
  getConfiguration () {
    return {
      Service: {
        auth: {
          type: this.serviceAuthType,
          tokenUrl: this.serviceAuthTokenUri,
          grantType: this.serviceAuthGrantType,
          clientId: this.serviceAuthClientId,
          clientSecret: this.serviceAuthClientSecret,
          username: this.serviceAuthUsername,
          password: this.serviceAuthPassword
        },
        uri: this.serviceUri,
        servicePath: this.servicePath,
        namespace: this.serviceNamespace,
        entityName: this.serviceEntityName
      },
      Metadata: {
        fileName: this.metaFileName
      },
      Data: {
        useRandom: this.dataUseRandomData,
        randomData: {
          nrOfGeneratedRecords: this.dataRandomDataNrOfGeneratedRecords
        },
        csv: {
          fileName: this.dataCsvFileName
        }
      },
      Test: {
        type: this.testExecutionType,
        sequential: {},
        batchSequential: {
          batchSize: this.testBatchsequentialBatchSize
        },
        parallel: {
          channelCount: this.testParallelChannelcount
        },
        batchParallel: {
          batchSize: this.testBatchparallelBatchSize,
          channelCount: this.testBatchparallelChannelcount
        },
        customRest: {}
      },
      Report: {
        progressVisualization: this.outputProgress,
        showSummaryReport: this.outputSummaryReport,
        showRecordResponseTable: this.outputRecordResponseTable,
        showCallDistributionChart: this.outputCallDistributionChart
      }
    }
  }

  /**
   * Sets the default configuration
   */
  setDefaultConfig () {
    this._loadConfigFromFile()
  }

  /**
   * Determines if the configuration is valid
   * @param {Object} config configuration object
   */
  setConfiguration (config) {
    if (!config) {
      throw new Error('No configuration provided')
    }

    this._setConfigurationValueWithDefault(config, 'serviceAuthType', C.CF_SERVICE_AUTH_TYPE, C.DEFAULT_SERVICE_AUTH_TYPE)
    this._setConfigurationValueWithDefault(config, 'serviceAuthTokenUri', C.CF_SERVICE_AUTH_TOKEN_URI, C.DEFAULT_SERVICE_AUTH_TOKEN_URI)
    this._setConfigurationValueWithDefault(config, 'serviceAuthGrantType', C.CF_SERVICE_AUTH_GRANT_TYPE, C.DEFAULT_SERVICE_AUTH_GRANT_TYPE)
    this._setConfigurationValueWithDefault(config, 'serviceAuthClientId', C.CF_SERVICE_AUTH_CLIENT_ID, C.DEFAULT_SERVICE_AUTH_CLIENT_ID)
    this._setConfigurationValueWithDefault(config, 'serviceAuthClientSecret', C.CF_SERVICE_AUTH_CLIENT_SECRET, C.DEFAULT_SERVICE_AUTH_CLIENT_SECRET)
    this._setConfigurationValueWithDefault(config, 'serviceAuthUsername', C.CF_SERVICE_AUTH_USERNAME, C.DEFAULT_SERVICE_AUTH_USERNAME)
    this._setConfigurationValueWithDefault(config, 'serviceAuthPassword', C.CF_SERVICE_AUTH_PASSWORD, C.DEFAULT_SERVICE_AUTH_PASSWORD)
    this._setConfigurationValueWithDefault(config, 'serviceUri', C.CF_SERVICE_URI, C.DEFAULT_SERVICE_URI)
    this._setConfigurationValueWithDefault(config, 'servicePath', C.CF_SERVICE_SERVICE_PATH, C.DEFAULT_SERVICE_SERVICE_PATH)
    this._setConfigurationValueWithDefault(config, 'serviceNamespace', C.CF_SERVICE_NAMESPACE, C.DEFAULT_SERVICE_NAMESPACE)
    this._setConfigurationValueWithDefault(config, 'serviceEntityName', C.CF_SERVICE_ENTITY_NAME, C.DEFAULT_SERVICE_ENTITY_NAME)
    this._setConfigurationValueWithDefault(config, 'dataUseRandomData', C.CF_DATA_USERANDOM, C.DEFAULT_DATA_USERANDOM)
    this._setConfigurationValueWithDefault(config, 'dataRandomDataNrOfGeneratedRecords', C.CF_DATA_NR_RANDOM_RECORDS, C.DEFAULT_DATA_NR_RANDOM_RECORDS)
    this._setConfigurationValueWithDefault(config, 'dataCsvFileName', C.CF_DATA_CSV_FILENAME, C.DEFAULT_DATA_CSV_FILENAME)
    this._setConfigurationValueWithDefault(config, 'testExecutionType', C.CF_TEST_EXECUTION_TYPE, C.DEFAULT_TEST_EXECUTION_TYPE)
    this._setConfigurationValueWithDefault(config, 'testBatchsequentialBatchSize', C.CF_TEST_BATCHSEQUENTIAL_SIZE, C.DEFAULT_TEST_BATCHSEQUENTIAL_SIZE)
    this._setConfigurationValueWithDefault(config, 'testParallelChannelcount', C.CF_TEST_PARALLEL_CHANNELCOUNT, C.DEFAULT_TEST_PARALLEL_CHANNELCOUNT)
    this._setConfigurationValueWithDefault(config, 'testBatchparallelBatchSize', C.CF_TEST_BATCHPARALLEL_SIZE, C.DEFAULT_TEST_BATCHPARALLEL_SIZE)
    this._setConfigurationValueWithDefault(config, 'testBatchparallelChannelcount', C.CF_TEST_BATCHPARALLEL_CHANNELCOUNT, C.DEFAULT_TEST_BATCHPARALLEL_CHANNELCOUNT)
    this._setConfigurationValueWithDefault(config, 'outputRecordResponseTable', C.CF_REPORT_SHOWRECORDRESPONSETABLE, C.DEFAULT_REPORT_SHOWRECORDRESPONSETABLE)
    this._setConfigurationValueWithDefault(config, 'outputCallDistributionChart', C.CF_REPORT_SHOWDISTRIBUTIONCHART, C.DEFAULT_REPORT_SHOWDISTRIBUTIONCHART)
    this._setConfigurationValueWithDefault(config, 'metaFileName', C.CF_META_FILENAME, C.DEFAULT_META_FILENAME)
    this._setConfigurationValueWithDefault(config, 'outputSummaryReport', C.CF_REPORT_SHOWSUMMARYREPORT, C.DEFAULT_REPORT_SHOWSUMMARYREPORT)
    this._setConfigurationValueWithDefault(config, 'outputProgress', C.CF_REPORT_SHOWPROGRESS, C.DEFAULT_REPORT_SHOWPROGRESS)
  }

  /**
   * Loads the standard configuration from the configuration file
   */
  _loadConfigFromFile () {
    this._setConfigFileValueWithDefault('serviceAuthType', C.CF_SERVICE_AUTH_TYPE, C.DEFAULT_SERVICE_AUTH_TYPE)
    this._setConfigFileValueWithDefault('serviceAuthTokenUri', C.CF_SERVICE_AUTH_TOKEN_URI, C.DEFAULT_SERVICE_AUTH_TOKEN_URI)
    this._setConfigFileValueWithDefault('serviceAuthGrantType', C.CF_SERVICE_AUTH_GRANT_TYPE, C.DEFAULT_SERVICE_AUTH_GRANT_TYPE)
    this._setConfigFileValueWithDefault('serviceAuthClientId', C.CF_SERVICE_AUTH_CLIENT_ID, C.DEFAULT_SERVICE_AUTH_CLIENT_ID)
    this._setConfigFileValueWithDefault('serviceAuthClientSecret', C.CF_SERVICE_AUTH_CLIENT_SECRET, C.DEFAULT_SERVICE_AUTH_CLIENT_SECRET)
    this._setConfigFileValueWithDefault('serviceAuthUsername', C.CF_SERVICE_AUTH_USERNAME, C.DEFAULT_SERVICE_AUTH_USERNAME)
    this._setConfigFileValueWithDefault('serviceAuthPassword', C.CF_SERVICE_AUTH_PASSWORD, C.DEFAULT_SERVICE_AUTH_PASSWORD)
    this._setConfigFileValueWithDefault('serviceUri', C.CF_SERVICE_URI, C.DEFAULT_SERVICE_URI)
    this._setConfigFileValueWithDefault('servicePath', C.CF_SERVICE_SERVICE_PATH, C.DEFAULT_SERVICE_SERVICE_PATH)
    this._setConfigFileValueWithDefault('serviceNamespace', C.CF_SERVICE_NAMESPACE, C.DEFAULT_SERVICE_NAMESPACE)
    this._setConfigFileValueWithDefault('serviceEntityName', C.CF_SERVICE_ENTITY_NAME, C.DEFAULT_SERVICE_ENTITY_NAME)
    this._setConfigFileValueWithDefault('dataUseRandomData', C.CF_DATA_USERANDOM, C.DEFAULT_DATA_USERANDOM)
    this._setConfigFileValueWithDefault('dataRandomDataNrOfGeneratedRecords', C.CF_DATA_NR_RANDOM_RECORDS, C.DEFAULT_DATA_NR_RANDOM_RECORDS)
    this._setConfigFileValueWithDefault('dataCsvFileName', C.CF_DATA_CSV_FILENAME, C.DEFAULT_DATA_CSV_FILENAME)
    this._setConfigFileValueWithDefault('testExecutionType', C.CF_TEST_EXECUTION_TYPE, C.DEFAULT_TEST_EXECUTION_TYPE)
    this._setConfigFileValueWithDefault('testBatchsequentialBatchSize', C.CF_TEST_BATCHSEQUENTIAL_SIZE, C.DEFAULT_TEST_BATCHSEQUENTIAL_SIZE)
    this._setConfigFileValueWithDefault('testParallelChannelcount', C.CF_TEST_PARALLEL_CHANNELCOUNT, C.DEFAULT_TEST_PARALLEL_CHANNELCOUNT)
    this._setConfigFileValueWithDefault('testBatchparallelBatchSize', C.CF_TEST_BATCHPARALLEL_SIZE, C.DEFAULT_TEST_BATCHPARALLEL_SIZE)
    this._setConfigFileValueWithDefault('testBatchparallelChannelcount', C.CF_TEST_BATCHPARALLEL_CHANNELCOUNT, C.DEFAULT_TEST_BATCHPARALLEL_CHANNELCOUNT)
    this._setConfigFileValueWithDefault('outputRecordResponseTable', C.CF_REPORT_SHOWRECORDRESPONSETABLE, C.DEFAULT_REPORT_SHOWRECORDRESPONSETABLE)
    this._setConfigFileValueWithDefault('outputCallDistributionChart', C.CF_REPORT_SHOWDISTRIBUTIONCHART, C.DEFAULT_REPORT_SHOWDISTRIBUTIONCHART)
    this._setConfigFileValueWithDefault('metaFileName', C.CF_META_FILENAME, C.DEFAULT_META_FILENAME)
    this._setConfigFileValueWithDefault('outputSummaryReport', C.CF_REPORT_SHOWSUMMARYREPORT, C.DEFAULT_REPORT_SHOWSUMMARYREPORT)
    this._setConfigFileValueWithDefault('outputProgress', C.CF_REPORT_SHOWPROGRESS, C.DEFAULT_REPORT_SHOWPROGRESS)
  }

  /**
   * Sets the configuration value in the current class by evaluating the key in the config object. If the key does not exist, the default value is used.
   * @param {Object} configObj Configuration object to be evaluated
   * @param {String} configKeyInApp The configuratin key as it is used within the class/application
   * @param {String} configKeyInObj The configuration key as it is used in the incoming configuration object
   * @param {Object} defaultValue The default value to be used if the key does not exist in the configuration object
   */
  _setConfigurationValueWithDefault (configObj, configKeyInApp, configKeyInObj, defaultValue) {
    const jsonPath = '$.' + configKeyInObj

    if (jp.query(configObj, jsonPath).length > 0) {
      this[configKeyInApp] = jp.query(configObj, jsonPath)[0]
    } else {
      this[configKeyInApp] = defaultValue
    }
  }

  /**
   * Utility function to set the configKey to the value from the configuration file
   * If the config param does not exist in the configuration file, it uses the specified default value
   * @param {String} configKey key in this class
   * @param {String} configFileKey JSON path to configuration value in the config file
   * @param {Object} defaultValue default value for this key
   */
  _setConfigFileValueWithDefault (configKey, configFileKey, defaultValue) {
    if (clib.has(configFileKey)) {
      this[configKey] = clib.get(configFileKey)
    } else {
      this[configKey] = defaultValue
    }
  }

  // --- General
  serviceAuthType // Authorization type - usually oauth2
  serviceAuthTokenUri // Authorization token URI - usually https://yourAuthserver/oauth/token
  serviceAuthGrantType // Authorization grant type - usually client_credentials
  serviceAuthClientId // Authorization client ID - usually [serviceKeyClientId]
  serviceAuthClientSecret // Authorization client secret - usually [serviceKeyClientSecret]
  serviceAuthUsername // Authorization username - usually [YourUsername]
  serviceAuthPassword // Authorization password - usually [YourPassword]
  serviceUri // URI for the service to test
  servicePath // Service Path
  serviceNamespace // Namespace of the service
  serviceEntityName // Entity Name to be tested in service

  // --- Metadata Parameters
  metaFileName // Filename of the metadata to use

  // --- Test Data Parameters
  dataUseRandomData // determine if Random data is called. If false, a csv file is read
  dataRandomDataNrOfGeneratedRecords // Number of Random records to be generated
  dataCsvFileName // File name of test data CSV file

  // --- Test Execution
  testExecutionType // Execution Type of Test. Possible values 1-Sequential, 2-BatchSequential, 3-Parallel, 4-BatchParallel

  // Batch Sequential
  testBatchsequentialBatchSize // Batch size

  // Parallel
  testParallelChannelcount // Number of parallel channels

  // Batch Parallel
  testBatchparallelBatchSize // Batch size
  testBatchparallelChannelcount // Number of parallel channels

  // --- Report output
  outputProgress // Determines how progress should be shown during the excution. Possible values are 'bar'-shows an interactive bar, 'console' - shows a console output, 'none' - no output
  outputRecordResponseTable // Determines if the records details should be output to the console
  outputCallDistributionChart // Determines if call distribution chart is output
  outputSummaryReport // Determines if the summary report at the end of the run shoudl be output
}
export default new Config()
