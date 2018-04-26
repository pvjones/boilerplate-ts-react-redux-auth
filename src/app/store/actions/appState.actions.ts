import actionDefs from './actionDefs'
import { Action } from './actions.models'

export const setAlert = (message: string, status?: number): Action => {
  return {
    type: actionDefs.AppState.Alert,
    payload: {
      status,
      message,
    },
  }
}

export const clearAlert = (): Action => ({
  type: actionDefs.AppState.Alert,
  payload: {},
})

