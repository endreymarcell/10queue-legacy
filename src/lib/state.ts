import produce from "immer"
import { Writable, writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"
import type { WritableDraft } from "immer/dist/internal"

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

const updateTaskTitle = (index: number, title: string) => (draft: WritableDraft<State>) => void (draft.tasks[index].title = title)

function handleAction(action: Action) {
    switch (action.type) {
        case "taskTitleEdited": {
            const updater = updateTaskTitle(action.index, action.title);
            state.update((value) =>
                produce(value, updater),
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
