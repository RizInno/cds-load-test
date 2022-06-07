import clib from 'config'
import C from './constants.js'
import Debug from 'debug'

const debug = Debug('cds-load-test:config')

/**
 * Central configuration class
 */
class Config {
  /**
   * Constructor
   */
  constructor () {
    this._loadConfigFromFile()
    debug('Active Config is:', this)
  }

  /**
   * Loads the standard configuration from the configuration file
   */
  _loadConfigFromFile () {
    this._setWithDefault('serviceUri', C.CF_SERVICE_URI, 'https:[youserver]/[yourservice]')
    this._setWithDefault('servicePath', C.CF_SERVICE_SERVICE_PATH, 'path')
    this._setWithDefault('serviceEntityName', C.CF_SERVICE_ENTITY_NAME, 'entity')
    this._setWithDefault('dataUseRandomData', C.CF_DATA_USERANDOM, true)
    this._setWithDefault('dataRandomDataNrOfGeneratedRecords', C.CF_DATA_NR_RANDOM_RECORDS, 'https:[youserver]/[yourservice]')
    this._setWithDefault('dataCsvFileName', C.CF_DATA_CSV_FILENAME, 'data/test/refsvc.csv')
    this._setWithDefault('testExecutionType', C.CF_TEST_EXECUTION_TYPE, 'sequential')
    this._setWithDefault('testBatchsequentialBatchSize', C.CF_TEST_BATCHSEQUENTIAL_SIZE, 1000)
    this._setWithDefault('testParallelChannelcount', C.CF_TEST_BATCHPARALLEL_CHANNELCOUNT, 10)
    this._setWithDefault('testBatchparallelBatchSize', C.CF_TEST_BATCHPARALLEL_SIZE, 1000)
    this._setWithDefault('testBatchparallelChannelcount', C.CF_TEST_BATCHPARALLEL_CHANNELCOUNT, 10)
    this._setWithDefault('outputRecordResponseTable', C.CF_REPORT_SHOWRECORDRESPONSETABLE, false)
    this._setWithDefault('outputCallDistributionChart', C.CF_REPORT_SHOWDISTRIBUTIONCHART, false)
    this._setWithDefault('metaFileName', C.CF_META_FILENAME, '[please specify file name]')
  }

  /**
   * Utility function to set the configKey to the value from the configuration file
   * If the config param does not exist in the configuration file, it uses the specified default value
   * @param {String} configKey key in this class
   * @param {String} configFileKey JSON path to configuration value in the config file
   * @param {Object} defaultValue default value for this key
   */
  _setWithDefault (configKey, configFileKey, defaultValue) {
    if (clib.has(configFileKey)) {
      this[configKey] = clib.get(configFileKey)
    } else {
      this[configKey] = defaultValue
    }
  }

  // --- General
  serviceUri // URI for the service to test
  servicePath // Service Path
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
  outputRecordResponseTable // Determines if the records details should be output to the console
  outputCallDistributionChart // Determines if call distribution chart is output
}
export default new Config()
