import React from 'react'
import { connect } from 'react-redux'
import { selectIsUserAuthenticated } from '../../store/selectors/security.selectors'
import { Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom'

const AuthenticatedRoute: React.SFC<MergedProps> = ({
  redirectIfAuthenticated,
  isAuthenticated,
  component,
  render,
  redirectPath = '/login',
  location,
  ...other
}) => {
  const redirect = (from: any) => (
    <Redirect
      to={{
        pathname: redirectPath,
        state: { from },
      }}
    />
  )

  const getRenderFunc = () => {
    const shouldRedirect = redirectIfAuthenticated ? isAuthenticated : !isAuthenticated
    if (shouldRedirect) {
      return () => redirect(location.pathname)
    }
    if (component) {
      return (routeProps: any) => React.createElement(component, routeProps)
    }
    return render
  }

  return (
    <Route
      {...other}
      render={getRenderFunc()}
    />
  )
}

const mapStoreToProps = store => ({
  isAuthenticated: selectIsUserAuthenticated(store),
})


export default withRouter(
  connect<StoreProps>(mapStoreToProps)(
    AuthenticatedRoute,
  ),
)

export interface OwnProps {
  redirectIfAuthenticated: boolean
  component?: React.ReactType
  render?: (props: RouteComponentProps<{}>) => React.ReactNode
  redirectPath?: string
}

interface StoreProps {
  isAuthenticated: boolean
}

type MergedProps = OwnProps & StoreProps & RouteComponentProps<{}>
