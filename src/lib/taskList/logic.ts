import type { Task } from "$lib/taskList/tasks"
import { defaultTasks } from "$lib/taskList/tasks"
import type { Logic } from "$lib/eventHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/undo"
import { moveArrayElement } from "$lib/utils"

type State = {
    tasks: Task[]
    activeTaskIndex: number | undefined
    isRunning: boolean
}

const defaultState = {
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isRunning: false,
}

type Events = {
    taskTitleEdited: { index: number; title: string }
    taskClicked: { index: number }
    taskDeleteRequested: { index: number }
    taskStartStopRequested: void
    taskMoveUpRequested: { index: number }
    taskMoveDownRequested: { index: number }
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void
}

const logic: Logic<Events> = {
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        updater: () => state => state,
        // TODO this should not fire when clicking on move up/down arrows because it overwrites the effect of those
        // updater: payload => state => {
        // state.activeTaskIndex = payload.index
        // },
    },
    taskTitleEdited: {
        action: createAction("taskTitleEdited", (index, title) => ({ index, title })),
        updater: payload => state => {
            createUndoPoint(state)
            state.tasks[payload.index].title = payload.title
        },
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
}

export type TaskList = { State: State; Events: Events }
export const taskList = { defaultState, logic }
