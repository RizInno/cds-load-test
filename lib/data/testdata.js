
import path from 'path'
import csv from 'csvtojson'
import Config from '../conf/config.js'
import Generator from './generator.js'
import Debug from 'debug'
const debug = Debug('cds-load-test:Testdata')

/**
 * Class to read or generate test data
 */
export default class Testdata {
  _metaData // MetaData

  /**
   * Constructor
   * @param {Object} metaData SAP CSN
   */
  constructor (metaData) {
    this._metaData = metaData
  }

  /**
   * Provides the test data array
   * @returns {Array} Testdata Array
   */
  async obj () {
    let testData = []

    // Determine if random or existing data should be used
    if (Config.dataUseRandomData) {
      debug('Generate Random Data')
      testData = this._getRandom()
    } else {
      debug('Read data from csv file')
      testData = await this._convertFieldsBasedOnMetaData(await this._getFromStaticFile(), Config.servicePath + '.' + Config.serviceEntityName)
    }

    debug(testData)
    return testData
  }

  /**
   * Reads the test data from the CSV file specified in the config file
   * @returns {Array} Test Records
   */
  async _getFromStaticFile () {
    // -- For now read the static csn and return it

    // Define the file name
    const fname = path.resolve(Config.dataCsvFileName)

    debug('Reading metadata from file: ' + fname)
    return csv().fromFile(fname)
  }

  /**
   * Generates a list of random records based on the metadata
   * @returns {Array} Array of random records
   */
  _getRandom () {
    const fieldsMeta = this._metaData.definitions[Config.servicePath + '.' + Config.serviceEntityName].elements

    const gen = new Generator()

    const resRows = []

    debug('Creating', Config.dataRandomDataNrOfGeneratedRecords, 'records with meta info:', fieldsMeta)
    for (let i = 0; i < Config.dataRandomDataNrOfGeneratedRecords; i++) {
      const resObj = {}
      for (const fieldName in fieldsMeta) {
        const fieldMeta = fieldsMeta[fieldName]

        resObj[fieldName] = gen.getData4CsnType(fieldMeta)
      }
      resRows.push(resObj)
    }
    return resRows
  }

  /**
   * Converts the String based csv record to the correct target format identified by the entity name
   * that is used to lookup the meta data for that entity in the CSN
   * @param {Array[Object]} dataSet list of records containing the csv records
   * @param {*} entityName CSN entity name
   * @returns {Array[Object]} well formed test data array
   */
  _convertFieldsBasedOnMetaData (dataSet, entityName) {
    const resultSet = []

    const fieldsMeta = this._metaData.definitions[entityName].elements

    for (const record of dataSet) {
      const result = {}
      for (const field in record) {
        const meta4field = fieldsMeta[field]
        debug('Field', meta4field)

        if (meta4field.type === 'cds.Boolean') {
          result[field] = record[field] === 'true'
        } else if (['cds.Integer', 'cds.Integer64'].includes(meta4field.type)) {
          result[field] = parseInt(record[field])
        } else if (['cds.DecimalFloat', 'cds.Double'].includes(meta4field.type)) {
          result[field] = parseFloat(record[field])
        } else {
          result[field] = record[field]
        }
      }
      resultSet.push(result)
    }

    return resultSet
  }
}
