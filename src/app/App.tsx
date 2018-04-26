import createHistory from 'history/createBrowserHistory'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { composeStore } from './store/store'
import registerServiceWorker from './registerServiceWorker'

const history = createHistory()
const historyMiddleware = routerMiddleware(history)
const store = composeStore(historyMiddleware)


const PrimaryRoute: React.SFC = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/App.tsx</code> and save to reload.
    </p>
  </div>
)

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