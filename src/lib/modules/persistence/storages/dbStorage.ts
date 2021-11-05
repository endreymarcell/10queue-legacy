import type { SaveableState } from "$lib/modules/taskList/logic/state"

function load() {
    // TODO implement
    throw new Error("not yet implemented")
}

function save(state: SaveableState) {
    // TODO implement
    console.log(state)
    throw new Error("not yet implemented")
}

export const dbStorage = { load, save }
