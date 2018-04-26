import React from 'react'
import { Switch } from 'react-router-dom'
import AuthenticatedRoute from './Routing/AuthenticatedRoute'
import Login from './Views/Login'
import Register from './Views/Register'
import Home from './Views/Home'

const PrimaryRoute: React.SFC = () => (
  <Switch>
    <AuthenticatedRoute
      path='/login'
      render={() => <Login />}
      redirectPath='/'
      redirectIfAuthenticated
    />
    <AuthenticatedRoute
      path='/register'
      render={() => <Register />}
      redirectPath='/'
      redirectIfAuthenticated
    />
    <AuthenticatedRoute
      path='/'
      render={() => <Home />}
    />
  </Switch>
)

export default PrimaryRoute
