import fetch from 'isomorphic-fetch'
import { Map } from 'immutable'
import { selectSessionToken } from '../selectors/security.selectors'
import { setAlert } from './appState.actions'
import { clearSession } from './security.actions'
import getConfig from '../../../utils/config'
import { Dispatch } from 'react-redux'
import { ThunkAction } from '../store.models'

const api = getConfig().api
const apiUrl = `${api.host}:${api.port}/${api.baseUrl}`

const standardHeaders: any = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestMap = Map<Method, Map<string, Promise<any>>>
type BlockedMap = Map<Method, Map<string, number>>

let blockedMap: BlockedMap = Map()
let requestMap: RequestMap = Map()

const blockedCallLimit = 3
const throttledRequestTimeLimit = 100

const blockURL = (method: Method, url: string): void => {
  const count = blockedMap.getIn([method, url], 0) as number
  blockedMap = blockedMap.setIn([method, url], count + 1)
}

const isURLBlocked = (method: Method, url: string): boolean => {
  return blockedMap.getIn([method, url], 0) >= blockedCallLimit
}

const processResponse = (response: Response, method: Method, url: string, dispatch: Dispatch): Promise<any> => {
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

const getEmptyPromise = <R>(): Promise<R> => new Promise<R>(() => {
  // Need to return an empty promise so that only the first promise can be resolved.
  // Otherwise multiple unnecessary rerenders will result.
})

const getFetchPromise = <R>(method: Method, url: string, payload: RequestInit, dispatch: Dispatch): Promise<R> =>
  new Promise<R>(resolve => {
    fetch(`${apiUrl}${url}`, payload)
      .then(response => resolve(processResponse(response, method, url, dispatch)))
      .catch(error => dispatch(setAlert(error.message, error.status)))
  })

const getThrottledFetchPromise = <R>(method: Method, url: string, payload: RequestInit, dispatch: Dispatch): Promise<R> =>
  new Promise<R>(resolve => {
    fetch(`${apiUrl}${url}`, payload)
      .then(response => {
        setTimeout(() => {
          requestMap = requestMap.deleteIn([method, url])
        }, throttledRequestTimeLimit)
        return resolve(processResponse(response, method, url, dispatch))
      })
      .catch(error => {
        dispatch(setAlert(error.message, error.status))
        requestMap = requestMap.deleteIn([method, url])
      })
  })

const getHeaders = (authToken: string, extraHeaders: Record<string, any> = {}): Headers => {
  const authHeader = authToken ? { authorization: authToken } : {}

  const init = {
    ...standardHeaders,
    ...extraHeaders,
    ...authHeader,
  }

  return new Headers(init)
}

export type FetchActionReturn<R> = ThunkAction<Promise<R>>
const requestWithBody = <R>(method: Method, url: string, body: any, extraHeaders: any): FetchActionReturn<R> =>
  (dispatch, getStore): Promise<R> => {
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

    const promise = getFetchPromise<R>(method, url, payload, dispatch)

    return promise
  }

type FetchGetAction<R> = ThunkAction<Promise<R>>
const get = <R>(url: string): FetchGetAction<R> =>
  (dispatch, getStore): Promise<R> => {
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

    const promise = getThrottledFetchPromise<R>(method, url, payload, dispatch)
    requestMap = requestMap.setIn([method, url], promise)

    return promise
  }

export default {
  get,
  post: <R>(url: string, body?: any, extraHeaders?: any): FetchActionReturn<R> => requestWithBody('POST', url, body, extraHeaders),
  put: <R>(url: string, body?: any, extraHeaders?: any): FetchActionReturn<R> => requestWithBody('PUT', url, body, extraHeaders),
  delete: <R>(url: string, body?: any, extraHeaders?: any): FetchActionReturn<R> => requestWithBody('DELETE', url, body, extraHeaders),
}
