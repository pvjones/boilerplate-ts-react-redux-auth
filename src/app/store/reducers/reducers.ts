import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
// import actionDefs from '../actions/actionDefs'
// import securityReducer from './security.reducer'

const appReducer = combineReducers({
  router: routerReducer,
  // security: securityReducer,
})

export default (state: any, action: any) => {
  // if (action.type === actionDefs.Security.Session.Clear) appReducer(undefined, action)
  return appReducer(state, action)
}
