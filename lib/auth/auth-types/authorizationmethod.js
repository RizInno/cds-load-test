import Config from '../../conf/config.js'

/**
 * Authorization base class to get Authorization header(s) and timeout information.
 */
export default class AuthorizationMethod {
  /**
   * Constructor
   */
  constructor () {
    this.config = Config
  }

  /**
   * Determine header and timeout information. In its simplest form it is an Empty authorization header.
   * @returns {Promise} The resulting object has the following structure { "header": {}, "timeout": 999999999 }
   */
  getHeaderAndTimeout () {
    // Initialize return container
    const returnAuth = { header: {}, timeout: 999999999 }

    return new Promise((resolve, reject) => {
      resolve(returnAuth)
    })
  }
}
