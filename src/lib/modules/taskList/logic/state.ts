import type { AppState } from "$lib/logic"
import clone from "just-clone"
import { pick } from "$lib/helpers/utils"
import type { Task } from "$lib/modules/taskList/tasks"

export type State = {
    tasks: Task[]
    activeTaskIndex: number | null
    isEditingTaskTitle: boolean
    isRunning: boolean
    isAddingNewTask: boolean
}

export const defaultState: State = {
    tasks: [],
    activeTaskIndex: 0,
    isEditingTaskTitle: false,
    isRunning: false,
    isAddingNewTask: false,
}

const saveableAttributes = ["tasks", "activeTaskIndex"] as const
type SaveableAttributesUnion = typeof saveableAttributes[number]
export type SaveableState = Pick<AppState, SaveableAttributesUnion>

export function copySaveableState(state: AppState): SaveableState {
    return clone(pick(state, saveableAttributes))
}
