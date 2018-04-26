import actionDefs from './actionDefs'
import fetch from './fetch.actions'
import { setAlertError } from './appState.actions'

export const setSession = session => ({
  type: actionDefs.Security.Session.Set,
  payload: session,
})

export const clearSession = () => ({
  type: actionDefs.Security.Session.Clear,
})

export const signIn = (email, password) =>
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

export const signOut = () =>
  dispatch =>
    dispatch(fetch.post('/auth/logout'))
      .then(() => dispatch(clearSession()))
      .catch(error => dispatch(setAlertError(error.message)))

export const registerUser = (email, firstName, lastName, password) =>
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


export const setUserDetails = user => ({
  type: actionDefs.Security.Permissions.SetUserDetails,
  payload: user,
})

export const fetchUserById = id =>
  dispatch =>
    dispatch(fetch.get(`/users/${id}`))
      .then(response => {
        dispatch(setUserDetails(response))
      })
