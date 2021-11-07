import type { SavableState } from "$lib/modules/taskList/logic/state"

export type StateStorage = {
    load: () => Promise<SavableState>
    save: (state: SavableState) => Promise<void>
}
