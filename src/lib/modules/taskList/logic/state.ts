import type { AppState } from "$lib/logic"
import clone from "just-clone"
import { pick } from "$lib/helpers/utils"
import type { Task } from "$lib/modules/taskList/tasks"
import type { Persistence } from "$lib/modules/persistence/logic"
import { persistence } from "$lib/modules/persistence/logic"

export type State = {
    tasks: Task[]
    activeTaskIndex: number | null
    isEditingTaskTitle: boolean
    isRunning: boolean
    isAddingNewTask: boolean
} & Persistence["State"]

export const defaultState: State = {
    tasks: [],
    activeTaskIndex: 0,
    isEditingTaskTitle: false,
    isRunning: false,
    isAddingNewTask: false,
    ...persistence.defaultState,
}

const savableAttributes = ["tasks", "activeTaskIndex", "latestSuccessfulSaveTimestamp"] as const
type SavableAttributesUnion = typeof savableAttributes[number]
export type SavableState = Pick<AppState, SavableAttributesUnion>

export function copySavableState(state: AppState): SavableState {
    return clone(pick(state, savableAttributes))
}
