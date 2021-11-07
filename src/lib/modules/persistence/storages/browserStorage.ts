import type { SavableState } from "$lib/modules/taskList/logic/state"
import type { StateStorage } from "$lib/modules/persistence/storages/Storage"

const KEY = "10queue-state"

function save(state: SavableState) {
    const serializedState = JSON.stringify(state)
    window.localStorage.setItem(KEY, serializedState)
    return Promise.resolve()
}

function load() {
    const serializedState = window.localStorage.getItem(KEY)
    const state: SavableState = JSON.parse(serializedState)
    if (state === null) {
        throw new Error("No saved state found")
    } else {
        return Promise.resolve(state)
    }
}

export const browserStorage: StateStorage = { save, load }
