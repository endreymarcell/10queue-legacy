import produce from "immer"
import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"

export const state = {
    tasks: writable<Task[]>(defaultTasks),
    isRunning: writable(false),
}

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
            state.tasks.update((value) =>
                produce(value, (draft) => {
                    draft[action.index].title = action.title
                }),
            )
            break
        }
        case "deleteTask": {
            state.tasks.update((value) =>
                produce(value, (draft) => {
                    draft.splice(action.index, 1)
                }),
            )
            break
        }
        case "taskStarted": {
            state.isRunning.set(true)
            break
        }
        case "taskPaused": {
            state.isRunning.set(false)
            break
        }
    }
}
