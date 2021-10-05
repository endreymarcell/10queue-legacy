import produce from "immer"
import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"

type State = {
    tasks: Task[];
    isRunning: boolean;
}
const defaultState: State = {
    tasks: defaultTasks,
    isRunning: false
}

export const state = writable<State>(defaultState)

type Action =
    | { type: "taskTitleEdited"; index: number; title: string }
    | { type: "deleteTask"; index: number }
    | { type: "taskStarted" }
    | { type: "taskPaused" }

export function dispatch(action: Action) {
    // middleware would come here
    handleAction(action)
}

function handleAction(action: Action) {
    switch (action.type) {
        case "taskTitleEdited": {
            state.update((value) =>
                produce(value, (draft) => {
                    draft.tasks[action.index].title = action.title
                }),
            )
            break
        }
        case "deleteTask": {
            state.update((value) =>
                produce(value, (draft) => {
                    draft.tasks.splice(action.index, 1)
                }),
            )
            break
        }
        case "taskStarted": {
            state.update((value) =>
                produce(value, (draft) => {
                    draft.isRunning = true
                }),
            )
            break
        }
        case "taskPaused": {
            state.update((value) =>
                produce(value, (draft) => {
                    draft.isRunning = false
                }),
            )
            break
        }
    }
}
