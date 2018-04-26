import { fromJS, Map } from 'immutable'
import { serializeStateToLocalStorage, deserializeStateFromLocalStorage } from '../../../utils/storage.utils'
import actionDefs from '../actions/actionDefs'

const setSession = (state, payload) =>
  state.merge(fromJS({ session: payload }))

const reducer = (state = deserializeSession(), action) => {
  switch (action.type) {
    case actionDefs.Security.Session.Set:
      return serializeSession(setSession(state, action.payload))

    case actionDefs.Security.Session.Clear:
      return serializeSession(Map())

    default:
      return state
  }
}

export default reducer

const serializeSession = state =>
  serializeStateToLocalStorage(state, 'userSession', ['session'])

const deserializeSession = () =>
  deserializeStateFromLocalStorage(Map(), 'userSession', ['session'])
