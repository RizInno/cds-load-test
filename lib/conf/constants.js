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
  static CF_REPORT_SHOWRECORDRESPONSETABLE = 'Report.showRecordResponseTable'
  static CF_REPORT_SHOWDISTRIBUTIONCHART = 'Report.showCallDistributionChart'
}
