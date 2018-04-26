import { AppStore } from '../store.models'

export interface Action<P = {}> {
  type: string
  payload?: P
}

export type ReducingAction<P= {}> = (p?: Partial<P>) => Action<Partial<P>>
export type Dispatch = <R>(asyncAction: ThunkAction<R> | ReducingAction | Action) => R
export type ThunkAction<R = void> = (dispatch: Dispatch, getStore: () => AppStore) => R
