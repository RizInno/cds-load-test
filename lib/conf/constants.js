/**
 * These constants represent the JSON path in the configuration JSON file
 */
export default class Constants {
  static CF_SERVICE_AUTH_TYPE = 'Service.auth.type'
  static CF_SERVICE_AUTH_TOKEN_URI = 'Service.auth.tokenUrl'
  static CF_SERVICE_AUTH_GRANT_TYPE = 'Service.auth.grantType'
  static CF_SERVICE_AUTH_CLIENT_ID = 'Service.auth.clientId'
  static CF_SERVICE_AUTH_CLIENT_SECRET = 'Service.auth.clientSecret'
  static CF_SERVICE_AUTH_USERNAME = 'Service.auth.username'
  static CF_SERVICE_AUTH_PASSWORD = 'Service.auth.password'
  static CF_SERVICE_URI = 'Service.uri'
  static CF_SERVICE_SERVICE_PATH = 'Service.servicePath'
  static CF_SERVICE_NAMESPACE = 'Service.namespace'
  static CF_SERVICE_ENTITY_NAME = 'Service.entityName'
  static CF_META_FILENAME = 'Metadata.fileName'
  static CF_DATA_USERANDOM = 'Data.useRandom'
  static CF_DATA_NR_RANDOM_RECORDS = 'Data.randomData.nrOfGeneratedRecords'
  static CF_DATA_CSV_FILENAME = 'Data.csv.fileName'
  static CF_TEST_EXECUTION_TYPE = 'Test.type'
  static CF_TEST_BATCHSEQUENTIAL_SIZE = 'Test.batchSequential.batchSize'
  static CF_TEST_PARALLEL_CHANNELCOUNT = 'Test.parallel.channelCount'
  static CF_TEST_BATCHPARALLEL_CHANNELCOUNT = 'Test.batchParallel.channelCount'
  static CF_TEST_BATCHPARALLEL_SIZE = 'Test.batchParallel.batchSize'
  static CF_TEST_CUSTOM_SERVICE_AND_ACTION = 'Test.customRest.massChangeServiceAndAction'
  static CF_REPORT_SHOWRECORDRESPONSETABLE = 'Report.showRecordResponseTable'
  static CF_REPORT_SHOWDISTRIBUTIONCHART = 'Report.showCallDistributionChart'
  static CF_REPORT_SHOWSUMMARYREPORT = 'Report.showSummaryReport'
  static CF_REPORT_SHOWPROGRESS = 'Report.progressVisualization'

  static DEFAULT_SERVICE_AUTH_TYPE = '[none|basic|oauth2]'
  static DEFAULT_SERVICE_AUTH_TOKEN_URI = 'https:[yourAuthserver]/oauth/token'
  static DEFAULT_SERVICE_AUTH_GRANT_TYPE = 'client_credentials'
  static DEFAULT_SERVICE_AUTH_CLIENT_ID = '[serviceKeyClientId]'
  static DEFAULT_SERVICE_AUTH_CLIENT_SECRET = '[serviceKeyClientSecret]'
  static DEFAULT_SERVICE_AUTH_USERNAME = '[YourUsername]'
  static DEFAULT_SERVICE_AUTH_PASSWORD = '[YourPassword]'
  static DEFAULT_SERVICE_URI = 'https:[yourserver]/[yourservice]'
  static DEFAULT_SERVICE_SERVICE_PATH = 'path'
  static DEFAULT_SERVICE_NAMESPACE = 'riz.example.namespace'
  static DEFAULT_SERVICE_ENTITY_NAME = 'entity'
  static DEFAULT_META_FILENAME = '[please specify file name]'
  static DEFAULT_DATA_USERANDOM = true
  static DEFAULT_DATA_NR_RANDOM_RECORDS = 5
  static DEFAULT_DATA_CSV_FILENAME = 'data/test/refsvc.csv'
  static DEFAULT_TEST_EXECUTION_TYPE = 'sequential'
  static DEFAULT_TEST_BATCHSEQUENTIAL_SIZE = 1000
  static DEFAULT_TEST_PARALLEL_CHANNELCOUNT = 10
  static DEFAULT_TEST_BATCHPARALLEL_CHANNELCOUNT = 10
  static DEFAULT_TEST_BATCHPARALLEL_SIZE = 1000
  static DEFAULT_TEST_CUSTOM_SERVICE_AND_ACTION = '[customRestServicePath]/[customRestAction]'
  static DEFAULT_REPORT_SHOWRECORDRESPONSETABLE = false
  static DEFAULT_REPORT_SHOWDISTRIBUTIONCHART = false
  static DEFAULT_REPORT_SHOWSUMMARYREPORT = true
  static DEFAULT_REPORT_SHOWPROGRESS = '[bar|console|none]'
}
