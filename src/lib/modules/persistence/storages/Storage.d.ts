import type { SaveableState } from "$lib/modules/taskList/logic/state"

export type StateStorage = {
    load: () => Promise<SaveableState>
    save: (state: SaveableState) => Promise<void>
}
