import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import reducers from './reducers/reducers'

let store: any
let dispatch: any

export const getDispatch = () => dispatch

export const composeStore = (historyMiddleware: any) => {
  store = createStore(reducers, composeWithDevTools(
    applyMiddleware(thunk, historyMiddleware),
  ))

  dispatch = store.dispatch

  return store
}

// setMockDispatch
export const setDispatch = (d: any) => { dispatch = d }
