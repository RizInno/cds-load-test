
import { readFile } from 'node:fs'
import { fileURLToPath } from 'url';
import path from 'path';
import csv from 'csvtojson'
import Config from '../conf/config.js'
import Generator from './generator.js';



export default class Testdata {

    _metaData
    constructor(metaData) {
        this._metaData = metaData
    }

    async _getFromStaticFile() {
        // -- For now read the static csn and return it

        // Define the file name
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const fname = path.resolve(__dirname, '../../data/test/refsvc.csv')

        console.log('Reading metadata from file: ' + fname)
        console.log('Test Cycle Count: ' + Config.testCycleCount)

        return csv().fromFile(fname)
    }

    async _getRandom(entityName, recordCount) {

        let fieldsMeta = this._metaData.definitions[entityName].elements

        let gen = new Generator()

        let resRows = []

        for (let i = 0; i < recordCount; i++) {

            let resObj = {}
            for (let fieldName in fieldsMeta) {

                let fieldMeta = fieldsMeta[fieldName]
                //console.log(i, fieldName, fieldMeta)

                resObj[fieldName] = gen.getData4CsnType(fieldMeta)
            }
            resRows.push(resObj)
        }

        return resRows

    }


    async obj() {


        if (Config.useRandomData) {
            return this._getRandom('refsvc.TestRecords', Config.RandomDataNrOfGeneratedRecords)
        } else { 
            return this._convertFieldsBasedOnMetaData(await this._getFromStaticFile(), 'refsvc.TestRecords') 
        }
    }


    _convertFieldsBasedOnMetaData(dataSet, entityName) {

        let resultSet = []

        let fieldsMeta = this._metaData.definitions[entityName].elements

        for (let record of dataSet) {

            let result = {}
            for (let field in record) {

                let meta4field = fieldsMeta[field]
                console.log('Field', meta4field)


                if (meta4field.type === 'cds.Boolean') {
                    result[field] = record[field] === 'true'
                }
                else if (['cds.Integer', 'cds.Integer64'].includes(meta4field.type)) {
                    result[field] = parseInt(record[field])
                }
                else if (['cds.DecimalFloat', 'cds.Double'].includes(meta4field.type)) {
                    result[field] = parseFloat(record[field])
                }
                else {
                    result[field] = record[field]
                }



            }
            resultSet.push(result)
        }

        return resultSet

    }


}