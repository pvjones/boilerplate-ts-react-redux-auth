import actionDefs from '../actions/actionDefs'

const setAlert = (state, payload) => state.merge({
  alert: payload,
})

const reducer = (state = {}, action) => {

  switch (action.type) {
    case actionDefs.AppState.Alert:
      return setAlert(state, action.payload)

    default:
      return state
  }
}

export default reducer
