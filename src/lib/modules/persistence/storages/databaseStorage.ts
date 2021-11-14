import type { SavableState } from "$lib/modules/taskList/logic/state"
import type { StateStorage } from "./Storage"

function load(): Promise<SavableState> {
    // TODO implement
    throw new Error("not yet implemented")
}

function save(state: SavableState) {
    return window.fetch("/api/tasks", { method: "POST", body: JSON.stringify(state) })
}

export const databaseStorage: StateStorage = { load, save }
