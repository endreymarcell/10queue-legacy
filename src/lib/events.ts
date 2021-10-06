import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"

export type Events = {
    taskTitleEdited: { index: number; title: string }
    taskDeleteRequested: { index: number }
    taskStartStopRequested: void
}

// It is safe to modify the state in the updaters because these functions are fed to immer
export const logic: Logic = {
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => state => {
            state.tasks[payload.index].title = payload.title
        },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested", index => ({ index })),
        updater: payload => state => {
            state.tasks.splice(payload.index, 1)
        },
    },
    taskStartStopRequested: {
        action: createAction("taskStartStopRequested"),
        updater: () => state => {
            state.isRunning = !state.isRunning
        },
    },
}
