import NodeCache from 'node-cache'
import AuthorizationMethod from './auth-types/authorizationmethod.js'
import BasicAuthentication from './auth-types/basic_authentication.js'
import OAuth2ClientCredentials from './auth-types/oauth2_clientcreds.js'
import Config from '../conf/config.js'
import Debug from 'debug'
const debug = Debug('cds-load-test:AuthCache')
/**
 * Authorization cache
 */
class AuthCache {
  // Key in node cache
  AUTHORIZATION_HEADER_KEY = 'AuthorizationHeader'

  constructor () {
    this._authCache = new NodeCache()
  }

  /**
   * Returns the necessary call header to that system
   * @returns {Promise} the header information
   */
  getHeader () {
    return new Promise((resolve, reject) => {
      const headerValue = this._authCache.get(this.AUTHORIZATION_HEADER_KEY)

      if (headerValue) {
        resolve(headerValue)
      } else {
        // Handle miss or timeout
        this._getHeaderAndTimeout()
          .then((newHeaderAndTimeOutValue) => {
            // Output new values
            debug('New header and timeout value: ', newHeaderAndTimeOutValue)
            // Reset cache value
            this._authCache.set(this.AUTHORIZATION_HEADER_KEY, newHeaderAndTimeOutValue.header, newHeaderAndTimeOutValue.timeout)
            // Return the header
            resolve(newHeaderAndTimeOutValue.header)
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  }

  /** Returns authorization Header */
  _getHeaderAndTimeout () {
    if (Config.serviceAuthType === 'none') {
      return new AuthorizationMethod().getHeaderAndTimeout()
    } else if (Config.serviceAuthType === 'basic') {
      return new BasicAuthentication().getHeaderAndTimeout()
    } else if (Config.serviceAuthType === 'oauth2') {
      return new OAuth2ClientCredentials().getHeaderAndTimeout()
    } else {
      throw new Error('Unknown authorization type: ' + Config.serviceAuthType)
    }
  }
}
const AuthCacheInstance = new AuthCache()

export default AuthCacheInstance
