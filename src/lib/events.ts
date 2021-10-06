import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"
import { moveArrayElement } from "./utils"

export type Events = {
    textInputFocusChanged: { event: "focus" | "blur" }
    taskTitleEdited: { index: number; title: string }
    taskClicked: { index: number }
    taskDeleteRequested: { index: number }
    taskStartStopRequested: void
    taskMoveUpRequested: { index: number }
    taskMoveDownRequested: { index: number }
}

// It is safe to modify the state in the updaters because these functions are fed to immer
export const logic: Logic = {
    textInputFocusChanged: {
        action: createAction("textInputFocusChanged", event => ({ event })),
        updater: payload => state => {
            state.isTextInputFocused = payload.event === "focus" ? true : false
        },
    },
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => state => {
            state.tasks[payload.index].title = payload.title
        },
    },
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        updater: payload => state => {
            state.activeTaskIndex = payload.index
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
    taskMoveUpRequested: {
        action: createAction("taskMoveUpRequested", index => ({ index })),
        updater: payload => state => {
            if (payload.index !== 0) {
                state.tasks = moveArrayElement(state.tasks, payload.index, payload.index - 1)
            }
        },
    },
    taskMoveDownRequested: {
        action: createAction("taskMoveDownRequested", index => ({ index })),
        updater: payload => state => {
            if (payload.index !== 9) {
                state.tasks = moveArrayElement(state.tasks, payload.index, payload.index + 1)
            }
        },
    },
}
