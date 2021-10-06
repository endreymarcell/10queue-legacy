import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"

export type Events = {
    taskTitleEdited: { index: number; title: string }
    taskDeleted: { index: number }
    taskStarted: void
    taskPaused: void
}

// It is safe to modify the state in the updaters because these functions are fed to immer
export const logic: Logic = {
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => state => {
            state.tasks[payload.index].title = payload.title
        },
    },
    taskDeleted: {
        action: createAction("taskDeleted", index => ({ index })),
        updater: payload => state => {
            state.tasks.splice(payload.index, 1)
        },
    },
    taskStarted: {
        action: createAction("taskStarted"),
        updater: () => state => {
            state.isRunning = true
        },
    },
    taskPaused: {
        action: createAction("taskPaused"),
        updater: () => state => {
            state.isRunning = false
        },
    },
}
