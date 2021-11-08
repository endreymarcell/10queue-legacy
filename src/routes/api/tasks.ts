import { createTask } from "$lib/modules/taskList/tasks"
import type { SavableState } from "$lib/modules/taskList/logic/state"

function getSavedState(): SavableState {
    return {
        tasks: ["dummy tasks", "just to test the load() function", "replace with actual DB call"].map(createTask),
        activeTaskIndex: 0,
        latestLoadOrSaveTimestamp: Date.now(),
    }
}

export async function get() {
    return {
        body: {
            savedState: getSavedState(),
        },
    }
}
