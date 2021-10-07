import { createAction } from "redux-dry-ts-actions"
import type { Logic } from "./eventHelpers"
import type { AppState } from "./state"
import { moveArrayElement } from "./utils"

export type AppEvents = {
    textInputFocusChanged: { event: "focus" | "blur" }
    taskTitleEdited: { index: number; title: string }
    taskClicked: { index: number }
    taskDeleteRequested: { index: number }
    taskStartStopRequested: void
    taskMoveUpRequested: { index: number }
    taskMoveDownRequested: { index: number }
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void

    createUndoPoint: void
    restoreUndoPoint: void
}

// It is safe to modify the state in the updaters because these functions are fed to immer
export const appLogic: Logic<AppEvents> = {
    textInputFocusChanged: {
        action: createAction("textInputFocusChanged", event => ({ event })),
        updater: payload => state => {
            state.isTextInputFocused = payload.event === "focus"
        },
    },
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => state => {
            createUndoPoint(state)
            state.tasks[payload.index].title = payload.title
        },
    },
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        updater: () => state => state,
        // TODO this should not fire when clicking on move up/down arrows because it overwrites the effect of those
        // updater: payload => state => {
        // state.activeTaskIndex = payload.index
        // },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested", index => ({ index })),
        updater: payload => state => {
            createUndoPoint(state)
            state.tasks.splice(payload.index, 1)
            if (state.activeTaskIndex > payload.index) {
                state.activeTaskIndex--
            }
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
            createUndoPoint(state)
            if (payload.index !== 0) {
                state.tasks = moveArrayElement(state.tasks, payload.index, payload.index - 1)
                if (state.activeTaskIndex === payload.index) {
                    state.activeTaskIndex--
                } else if (state.activeTaskIndex === payload.index - 1) {
                    state.activeTaskIndex++
                }
            }
        },
    },
    taskMoveDownRequested: {
        action: createAction("taskMoveDownRequested", index => ({ index })),
        updater: payload => state => {
            createUndoPoint(state)
            if (payload.index !== state.tasks.length - 1) {
                state.tasks = moveArrayElement(state.tasks, payload.index, payload.index + 1)
                if (state.activeTaskIndex === payload.index) {
                    state.activeTaskIndex++
                } else if (state.activeTaskIndex === payload.index - 1) {
                    state.activeTaskIndex--
                }
            }
        },
    },
    taskActivatePreviousRequested: {
        action: createAction("taskActivatePreviousRequested"),
        updater: () => state => {
            if (state.activeTaskIndex !== 0) {
                state.activeTaskIndex--
            }
        },
    },
    taskActivateNextRequested: {
        action: createAction("taskActivateNextRequested"),
        updater: () => state => {
            if (state.activeTaskIndex !== state.tasks.length - 1) {
                state.activeTaskIndex++
            }
        },
    },

    createUndoPoint: {
        action: createAction("createUndoPoint"),
        updater: () => createUndoPoint,
    },
    restoreUndoPoint: {
        action: createAction("restoreUndoPoint"),
        updater: () => state => {
            if (state.undoPoints.length > 0) {
                const lastUndoPoint = state.undoPoints.pop()
                for (const key of Object.keys(lastUndoPoint)) {
                    state[key] = lastUndoPoint[key]
                }
            } else {
                console.log("No more steps to undo")
            }
        },
    },
}

function createUndoPoint(state: AppState) {
    state.undoPoints.push({ tasks: [...state.tasks], activeTaskIndex: state.activeTaskIndex })
}
