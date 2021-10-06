import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"

export type Events = {
    taskTitleEdited: { index: number; title: string }
    taskDeleted: { index: number }
    taskStarted: void
    taskPaused: void
}

export const logic: Logic = {
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => draft => {
            draft.tasks[payload.index].title = payload.title
        },
    },
    taskDeleted: {
        action: createAction("taskDeleted", index => ({ index })),
        updater: payload => draft => {
            draft.tasks.splice(payload.index, 1)
        },
    },
    taskStarted: {
        action: createAction("taskStarted"),
        updater: () => draft => {
            draft.isRunning = true
        },
    },
    taskPaused: {
        action: createAction("taskPaused"),
        updater: () => draft => {
            draft.isRunning = false
        },
    },
}
