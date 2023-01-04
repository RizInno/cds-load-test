import Config from '../lib/conf/config.js'
import C from '../lib/conf/constants.js'
import assert from 'assert'

describe('Config', () => {
  describe('instanciation()', function () {
    it('should not contain a value for metaFileName', () => {
      assert.equal(Config.metaFileName, undefined)
    })
    it('should not contain a value for serviceAuthType', () => {
      assert.equal(Config.serviceAuthType, undefined)
    })
    it('should not contain a value for serviceAuthTokenUri', () => {
      assert.equal(Config.serviceAuthTokenUri, undefined)
    })
    it('should not contain a value for serviceAuthGrantType', () => {
      assert.equal(Config.serviceAuthGrantType, undefined)
    })
    it('should not contain a value for serviceAuthClientId', () => {
      assert.equal(Config.serviceAuthClientId, undefined)
    })
    it('should not contain a value for serviceAuthClientSecret', () => {
      assert.equal(Config.serviceAuthClientSecret, undefined)
    })
    it('should not contain a value for serviceAuthUsername', () => {
      assert.equal(Config.serviceAuthUsername, undefined)
    })
    it('should not contain a value for serviceAuthPassword', () => {
      assert.equal(Config.serviceAuthPassword, undefined)
    })
    it('should not contain a value for serviceUri', () => {
      assert.equal(Config.serviceUri, undefined)
    })
    it('should not contain a value for servicePath', () => {
      assert.equal(Config.servicePath, undefined)
    })
    it('should not contain a value for serviceEntityName', () => {
      assert.equal(Config.serviceEntityName, undefined)
    })
    it('should not contain a value for dataUseRandomData', () => {
      assert.equal(Config.dataUseRandomData, undefined)
    })
    it('should not contain a value for dataRandomDataNrOfGeneratedRecords', () => {
      assert.equal(Config.dataRandomDataNrOfGeneratedRecords, undefined)
    })
    it('should not contain a value for dataCsvFileName', () => {
      assert.equal(Config.dataCsvFileName, undefined)
    })
    it('should not contain a value for testExecutionType', () => {
      assert.equal(Config.testExecutionType, undefined)
    })
    it('should not contain a value for testBatchsequentialBatchSize', () => {
      assert.equal(Config.testBatchsequentialBatchSize, undefined)
    })
    it('should not contain a value for testParallelChannelcount', () => {
      assert.equal(Config.testParallelChannelcount, undefined)
    })
    it('should not contain a value for testBatchparallelBatchSize', () => {
      assert.equal(Config.testBatchparallelBatchSize, undefined)
    })
    it('should not contain a value for testBatchparallelChannelcount', () => {
      assert.equal(Config.testBatchparallelChannelcount, undefined)
    })
    it('should not contain a value for outputRecordResponseTable', () => {
      assert.equal(Config.outputRecordResponseTable, undefined)
    })
    it('should not contain a value for outputCallDistributionChart', () => {
      assert.equal(Config.outputCallDistributionChart, undefined)
    })
    it('should not contain a value for outputProgress', () => {
      assert.equal(Config.outputProgress, undefined)
    })
    it('should not contain a value for outputSummaryReport', () => {
      assert.equal(Config.outputSummaryReport, undefined)
    })
  })

  describe('setConfiguration() with no config {}', () => {
    it('should throw an exception when called without a configuration', () => {
      assert.throws(() => { Config.setConfiguration() }, Error, 'No configuration provided')
    })
  })

  describe('setConfiguration() with empty config', function () {
    // Set Empty Config
    before(() => {
      Config.setConfiguration({})
    })

    it('should contain default value for metaFileName', () => {
      assert.equal(Config.metaFileName, C.DEFAULT_META_FILENAME)
    })
    it('should contain default value for serviceAuthType', () => {
      assert.equal(Config.serviceAuthType, C.DEFAULT_SERVICE_AUTH_TYPE)
    })
    it('should contain default value for serviceAuthTokenUri', () => {
      assert.equal(Config.serviceAuthTokenUri, C.DEFAULT_SERVICE_AUTH_TOKEN_URI)
    })
    it('should contain default value for serviceAuthGrantType', () => {
      assert.equal(Config.serviceAuthGrantType, C.DEFAULT_SERVICE_AUTH_GRANT_TYPE)
    })
    it('should contain default value for serviceAuthClientId', () => {
      assert.equal(Config.serviceAuthClientId, C.DEFAULT_SERVICE_AUTH_CLIENT_ID)
    })
    it('should contain default value for serviceAuthClientSecret', () => {
      assert.equal(Config.serviceAuthClientSecret, C.DEFAULT_SERVICE_AUTH_CLIENT_SECRET)
    })
    it('should contain default value for serviceAuthUsername', () => {
      assert.equal(Config.serviceAuthUsername, C.DEFAULT_SERVICE_AUTH_USERNAME)
    })
    it('should contain default value for serviceAuthPassword', () => {
      assert.equal(Config.serviceAuthPassword, C.DEFAULT_SERVICE_AUTH_PASSWORD)
    })
    it('should contain default value for serviceUri', () => {
      assert.equal(Config.serviceUri, C.DEFAULT_SERVICE_URI)
    })
    it('should contain default value for servicePath', () => {
      assert.equal(Config.servicePath, C.DEFAULT_SERVICE_SERVICE_PATH)
    })
    it('should contain default value for serviceEntityName', () => {
      assert.equal(Config.serviceEntityName, C.DEFAULT_SERVICE_ENTITY_NAME)
    })
    it('should contain default value for dataUseRandomData', () => {
      assert.equal(Config.dataUseRandomData, C.DEFAULT_DATA_USERANDOM)
    })
    it('should contain default value for dataRandomDataNrOfGeneratedRecords', () => {
      assert.equal(Config.dataRandomDataNrOfGeneratedRecords, C.DEFAULT_DATA_NR_RANDOM_RECORDS)
    })
    it('should contain default value for dataCsvFileName', () => {
      assert.equal(Config.dataCsvFileName, C.DEFAULT_DATA_CSV_FILENAME)
    })
    it('should contain default value for testExecutionType', () => {
      assert.equal(Config.testExecutionType, C.DEFAULT_TEST_EXECUTION_TYPE)
    })
    it('should contain default value for testBatchsequentialBatchSize', () => {
      assert.equal(Config.testBatchsequentialBatchSize, C.DEFAULT_TEST_BATCHSEQUENTIAL_SIZE)
    })
    it('should contain default value for testParallelChannelcount', () => {
      assert.equal(Config.testParallelChannelcount, C.DEFAULT_TEST_PARALLEL_CHANNELCOUNT)
    })
    it('should contain default value for testBatchparallelBatchSize', () => {
      assert.equal(Config.testBatchparallelBatchSize, C.DEFAULT_TEST_BATCHPARALLEL_SIZE)
    })
    it('should contain default value for testBatchparallelChannelcount', () => {
      assert.equal(Config.testBatchparallelChannelcount, C.DEFAULT_TEST_BATCHPARALLEL_CHANNELCOUNT)
    })
    it('should contain default value for outputRecordResponseTable', () => {
      assert.equal(Config.outputRecordResponseTable, C.DEFAULT_REPORT_SHOWRECORDRESPONSETABLE)
    })
    it('should contain default value for outputCallDistributionChart', () => {
      assert.equal(Config.outputCallDistributionChart, C.DEFAULT_REPORT_SHOWDISTRIBUTIONCHART)
    })
    it('should contain default value for outputProgress', () => {
      assert.equal(Config.outputProgress, C.DEFAULT_REPORT_SHOWPROGRESS)
    })
    it('should contain default value for outputSummaryReport', () => {
      assert.equal(Config.outputSummaryReport, C.DEFAULT_REPORT_SHOWSUMMARYREPORT)
    })
  })
})
