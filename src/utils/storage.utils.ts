// todo: Serialize is deleting and overwriting the branch in the store
// anytime something is serialized
const serializeState = (storageType: Storage, state: any, storageLocation: string, dataPath: string[]) => {
  if (!dataPath) {
    storageType[storageLocation] = JSON.stringify(state)
    return state
  }
  storageType[storageLocation] = JSON.stringify(state.getIn(dataPath))
  return state
}

export const serializeStateToSessionStorage = (state: any, storageLocation: string, dataPath: string[]) =>
  serializeState(sessionStorage, state, storageLocation, dataPath)


export const serializeStateToLocalStorage = (state: any, storageLocation: string, dataPath: string[]) =>
  serializeState(localStorage, state, storageLocation, dataPath)


const deserializeState = (storageType: Storage, state: any, storageLocation: string, dataPath: string[]) => {
  try {
    if (storageType[storageLocation]) {
      if (!dataPath) {
        return state.merge(JSON.parse(storageType[storageLocation]))
      }
      return state.mergeIn(dataPath, JSON.parse(storageType[storageLocation]))
    }
  } catch (error) {
    return state
  }
  return state
}

export const deserializeStateFromSessionStorage = (state: any, storageLocation: string, dataPath: string[]) => (
  deserializeState(sessionStorage, state, storageLocation, dataPath)
)

export const deserializeStateFromLocalStorage = (state: any, storageLocation: string, dataPath: string[]) => (
  deserializeState(localStorage, state, storageLocation, dataPath)
)
