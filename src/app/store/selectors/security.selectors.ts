import { SecurityPaths } from '../reducers/paths'

export const selectSessionToken = store => {
  const path = SecurityPaths.session.token.get()
  return store.security.getIn(path, '')
}

export const selectIsUserAuthenticated = store => {
  const token = selectSessionToken(store)
  return token !== ''
}

export const selectUserId = store => {
  const path = SecurityPaths.session.user.id.get()
  return store.security.getIn(path)
}

export const selectUserFullName = store => {
  const firstName = store.security.getIn(SecurityPaths.session.user.firstName.get())
  const lastName = store.security.getIn(SecurityPaths.session.user.lastName.get())
  return `${firstName} ${lastName}`
}