import actionDefs from './actionDefs'
import fetch from './fetch.actions'
import { setAlert } from './appState.actions'
import { Action, ThunkAction } from '../store.models'

export const setSession = (session: any): Action => ({
  type: actionDefs.Security.Session.Set,
  payload: session,
})

export const clearSession = (): Action => ({
  type: actionDefs.Security.Session.Clear,
})

export const signIn = (email: string, password: string): ThunkAction =>
  dispatch => {
    const body = { email, password }

    return dispatch(fetch.post('/auth/login', body))
      .then(session => {
        dispatch(setSession(session))
      })
      .catch(error => {
        throw error
      })
  }

export const signOut = (): ThunkAction =>
  dispatch =>
    dispatch(fetch.post('/auth/logout'))
      .then(() => dispatch(clearSession()))
      .catch(error => dispatch(setAlert(error.message)))

export const registerUser = (email: string, firstName: string, lastName: string, password: string): ThunkAction =>
  dispatch => {
    const body = {
      email,
      firstName,
      lastName,
      password,
    }
    dispatch(fetch.post('/auth/register', body))
      .then(() => 'success')
      .catch(() => 'error')
  }
