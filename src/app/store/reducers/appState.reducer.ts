import { Map } from 'immutable'
import actionDefs from '../actions/actionDefs'
import { AppStateState, Reducer, Action, PayloadFunc } from '../store.models'

const setAlert: PayloadFunc<AppStateState, any> = (state, payload) => state.merge({
  alert: payload,
})

const reducer: Reducer<AppStateState> = (state = Map(), action: Action) => {

  switch (action.type) {
    case actionDefs.AppState.Alert:
      return setAlert(state, action.payload)

    default:
      return state
  }
}

export default reducer
