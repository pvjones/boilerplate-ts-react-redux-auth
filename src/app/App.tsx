import createHistory from 'history/createBrowserHistory'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { composeStore } from './store/store'
import registerServiceWorker from './registerServiceWorker'
import PrimaryRoute from './components/PrimaryRoute'

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = composeStore(historyMiddleware)

const render = (Component: any) => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path='/' component={Component} />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  )
}

render(PrimaryRoute)
registerServiceWorker()