import actionDefs from './actionDefs'

export const setAlert = (message, status) => {
  return {
    type: actionDefs.AppState.Alert,
    payload: {
      status,
      message,
    },
  }
}

export const clearAlert = () => ({
  type: actionDefs.AppState.Alert,
  payload: {},
})

