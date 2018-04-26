import fetch from 'isomorphic-fetch'
import { Map } from 'immutable'
import { selectSessionToken } from '../selectors/security.selectors'
import { setAlertError } from './appState.actions'
import { clearSession } from './security.actions'
import getConfig from '../../../utils/config'

const api = getConfig().api
const apiUrl = `${api.host}:${api.port}/${api.baseUrl}`

const standardHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

let blockedMap = Map()
let requestMap = Map()

const blockedCallLimit = 3
const throttledRequestTimeLimit = 100

const blockURL = (method, url) => {
  const count = blockedMap.getIn([method, url], 0)
  blockedMap = blockedMap.setIn([method, url], count + 1)
}

const isURLBlocked = (method, url) => blockedMap.getIn([method, url], 0) >= blockedCallLimit

const processResponse = (response, method, url, dispatch) => {
  if (response.ok) {
    return response.status === 204 ? Promise.resolve('') : response.json()
  }

  if (response.status === 401) {
    blockURL(method, url)
    dispatch(clearSession())
  }

  return response.text()
    .then(error => JSON.parse(error))
    .then(error => {
      blockURL(method, url)
      throw new Error(error.message)
    })
}

const getEmptyPromise = () => new Promise(() => {
  // Need to return an empty promise so that only the first promise can be resolved.
  // Otherwise multiple unnecessary rerenders will result.
})

const getFetchPromise = (method, url, payload, dispatch) => new Promise(resolve => {
  fetch(`${apiUrl}${url}`, payload)
    .then(response => resolve(processResponse(response, method, url, dispatch)))
    .catch(error => dispatch(setAlertError(error.message)))
})

const getThrottledFetchPromise = (method, url, payload, dispatch) => new Promise(resolve => {
  fetch(`${apiUrl}${url}`, payload)
    .then(response => {
      setTimeout(() => {
        requestMap = requestMap.deleteIn([method, url])
      }, throttledRequestTimeLimit)
      return resolve(processResponse(response, method, url, dispatch))
    })
    .catch(error => {
      dispatch(setAlertError(error.message))
      requestMap = requestMap.deleteIn([method, url])
    })
})

const getHeaders = (authToken, extraHeaders = {}) => {
  const authHeader = authToken ? { authorization: authToken } : {}

  const init = {
    ...standardHeaders,
    ...extraHeaders,
    ...authHeader,
  }

  return new Headers(init)
}

const requestWithBody = (method, url, body, extraHeaders) =>
  (dispatch, getStore) => {
    if (isURLBlocked(method, url)) {
      throw new Error(`Blocked attempt on ${url}`)
    }

    const token = selectSessionToken(getStore())
    const headers = getHeaders(token, extraHeaders)
    const bodyProp = body ? { body: JSON.stringify(body) } : {}

    const payload = {
      method,
      headers,
      ...bodyProp,
    }

    const promise = getFetchPromise(method, url, payload, dispatch)

    return promise
  }

const get = url =>
  (dispatch, getStore) => {
    const method = 'GET'

    if (requestMap.getIn([method, url])) {
      return getEmptyPromise()
    }

    const token = selectSessionToken(getStore())
    const headers = getHeaders(token)

    const payload = {
      method,
      headers,
    }

    const promise = getThrottledFetchPromise(method, url, payload, dispatch)
    requestMap = requestMap.setIn([method, url], promise)

    return promise
  }

export default {
  get,
  post: (url, body, extraHeaders) => requestWithBody('POST', url, body, extraHeaders),
  put: (url, body, extraHeaders) => requestWithBody('PUT', url, body, extraHeaders),
  delete: (url, body, extraHeaders) => requestWithBody('DELETE', url, body, extraHeaders),
}
