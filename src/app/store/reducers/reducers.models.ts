import { Action } from '../store.models'

export type Reducer<S> = (state: S, action: Action) => S
export type PayloadFunc<S, P> = (state: S, payload: P) => S