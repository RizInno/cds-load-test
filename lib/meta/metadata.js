import { readFile, existsSync } from 'node:fs'
import Config from '../conf/config.js'
import path from 'path'
import { fileURLToPath } from 'url'
import Debug from 'debug'
const debug = Debug('cds-load-test:Metadata')

/**
 * Provides functionalities around metadata handling
 */
export default class Metadata {
  /**
     * Reads the metadata for the test entities
     */
  async csn () {
    return new Promise((resolve, reject) => {
      // -- For now read the static csn and return it

      // Make __dirname available in ES6
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)

      // Define the file name
      const fname = path.resolve(__dirname, '../..', Config.metaFileName)

      // Check if file exists
      if (!existsSync(fname)) {
        reject(new Error("Specified file name '" + fname + "' does not exist."))
      }

      debug('Reading metadata from file: ' + fname)

      // Read the file
      readFile(fname, (err, data) => {
        if (err) reject(err)
        debug(data.toString())

        const jsonObj = JSON.parse(data)

        const serviceWithNamespace = (Config.serviceNamespace ? Config.serviceNamespace + '.' : '') + Config.serviceEntityName

        if (!jsonObj.definitions[serviceWithNamespace]) {
          reject(new Error('Entity "' + serviceWithNamespace + '" could not be found in file: ' + fname))
        }
        // Resolve promise
        resolve(jsonObj)
      })
    })
  }
}
