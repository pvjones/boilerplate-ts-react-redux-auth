import { List, Map, Iterable } from 'immutable'
import { RouterState } from 'react-router-redux'

interface ModeledMap<M> extends Map<string, any> {
  toJS(): M
  toList(): List<ModeledMap<M>>
  get<K extends keyof M>(key: K, notSetValue?: M[K]): M[K]
  getIn<T>(searchKeyPath: string[] | Iterable<any, any>, notSetValue?: T): T
}

export type AppStateState = ModeledMap<{
  alert: ModeledMap<{
    message: string
    status: number
  }>
}>

export type SecurityState = ModeledMap<{
  session: ModeledMap<{
  }>,
}>

export interface AppStore {
  appState?: AppStateState
  router?: RouterState
  security?: SecurityState
}

export * from './actions/actions.models'
export * from './reducers/reducers.models'