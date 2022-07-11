import AuthorizationMethod from './authorizationmethod.js'

/**
 * BasicAuthentication represents an implementation of AuthorizationMethod
 */
export default class BasicAuthentication extends AuthorizationMethod {
  /**
   * Returns the authorization header for the request using the Basic authentication scheme
   * @returns {Promise} the resulting object has the following structure { "header": {}, "timeout": xxxx }
   */
  getHeaderAndTimeout () {
    // Initialize return container
    const returnAuth = { header: {}, timeout: 1000 }

    return new Promise((resolve, reject) => {
      returnAuth.header.Authorization = 'Basic ' + Buffer.from(this.config.serviceAuthUsername + ':' + this.config.serviceAuthPassword).toString('base64')
      returnAuth.timeout = 9999999999

      resolve(returnAuth)
    })
  }
}
