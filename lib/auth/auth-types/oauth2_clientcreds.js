import AuthorizationMethod from './authorizationmethod.js'
import fetch from 'node-fetch'
import Debug from 'debug'
const debug = Debug('cds-load-test:Parallel')

/**
 * ServiceCrendentials represents an implementation of AuthorizationMethod using the OAuth2 Client Credentials Grant
 */
export default class Oauth2ClientCredentials extends AuthorizationMethod {
  /**
   * Returns the authorization header for the request
   * @returns {Promise} the resulting object has the following structure { "header": {}, "timeout": xxxx }
   */
  getHeaderAndTimeout () {
    // Initialize return container
    const returnAuth = { header: {}, timeout: 1000 }

    return new Promise((resolve, reject) => {
      // Execute call to retrieve token
      fetch(this.config.serviceAuthTokenUri, this._getRequestOptions())
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          } else {
            console.error('Error: ', res.status, res.statusText)
            reject(new Error('Failed to retrieve access token'))
          }
        }
        )
        .then(json => {
          // Update return container
          returnAuth.header.Authorization = json.token_type + ' ' + json.access_token
          returnAuth.timeout = json.expires_in
          resolve(returnAuth)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * Returns the request options for Reuqest call to get the access token
   * @returns {Object} the return structure should look like this: {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: formParams
    }
   */
  _getRequestOptions () {
    // specify form parameters
    const formParams = new URLSearchParams()
    formParams.append('grant_type', this.config.serviceAuthGrantType)
    formParams.append('client_id', this.config.serviceAuthClientId)
    formParams.append('client_secret', this.config.serviceAuthClientSecret)

    // const sCredentials = _destService_credentials.clientid + ':' + _destService_credentials.clientsecret;
    // Assemble the post options
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: formParams
    }

    debug('postOptions: ', postOptions)

    return postOptions
  }
}
