import { readFile } from 'node:fs'
import { fileURLToPath } from 'url'
import path from 'path'
import Debug from 'debug'
const debug = Debug('cds-load-test:Metadata')

export default class Metadata {
  /**
     * Reads the metadata for the test entities
     */
  async csn () {
    return new Promise((resolve, reject) => {
      // -- For now read the static csn and return it

      // Define the file name
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const fname = path.resolve(__dirname, '../../data/meta/refsvc.csn')

      debug('Reading metadata from file: ' + fname)

      // Read the file
      readFile(fname, (err, data) => {
        if (err) reject(err)
        debug(data.toString())
        resolve(JSON.parse(data))
      })
    })
  }
}
