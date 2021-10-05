import produce from "immer"
import { writable } from "svelte/store"
import { defaultTasks } from "./tasks"
import type { Task } from "./tasks"
import type { WritableDraft } from "immer/dist/internal"
import { ActionTypeFromActionCreators, createAction } from "redux-dry-ts-actions"

type State = {
    tasks: Task[];
    isRunning: boolean;
}
const defaultState: State = {
    tasks: defaultTasks,
    isRunning: false
}

export const state = writable<State>(defaultState)

export const actions = {
    taskTitleEdited: createAction('taskTitleEdited', (index: number, title: string) => ({ index, title })),
    taskDeleted: createAction('taskDeleted', (index: number) => ({ index })),
    taskStarted: createAction('taskStarted'),
    taskPaused: createAction('taskPaused'),
}
type Action = ActionTypeFromActionCreators<typeof actions>

export function dispatch(action: Action) {
    // middleware would come here
    handleAction(action)
}

const updateTaskTitle = (payload: { index: number, title: string }) => (draft: WritableDraft<State>) => void (draft.tasks[payload.index].title = payload.title)

function handleAction(action: Action) {
    switch (action.type) {
        case "taskTitleEdited": {
            const updater = updateTaskTitle(action.payload);
            state.update((value) =>
                produce(value, updater),
            )
            break
        }
        case "taskDeleted": {
            state.update((value) =>
                produce(value, (draft) => {
                    draft.tasks.splice(action.payload.index, 1)
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
