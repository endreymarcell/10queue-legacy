import type { Task } from "$lib/taskList/tasks"
import { defaultTasks } from "$lib/taskList/tasks"
import type { Logic } from "../logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/undo/logic"
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
    taskTitleEdited: { title: string }
    taskClicked: { index: number }
    taskDeleteRequested: void
    taskStartStopRequested: void
    taskMoveUpRequested: void
    taskMoveDownRequested: void
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void
}

const logic: Logic<Events> = {
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        updater: payload => state => {
            state.activeTaskIndex = payload.index
        },
    },
    taskTitleEdited: {
        action: createAction("taskTitleEdited", title => ({ title })),
        updater: payload => state => {
            createUndoPoint(state)
            state.tasks[state.activeTaskIndex].title = payload.title
        },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested"),
        updater: () => state => {
            createUndoPoint(state)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = undefined
            } else if (state.activeTaskIndex === state.tasks.length - 1) {
                console.log("yes")
                state.activeTaskIndex--
            }
            state.tasks.splice(state.activeTaskIndex, 1)
        },
    },
    taskStartStopRequested: {
        action: createAction("taskStartStopRequested"),
        updater: () => state => {
            state.isRunning = !state.isRunning
        },
    },
    taskMoveUpRequested: {
        action: createAction("taskMoveUpRequested"),
        updater: () => state => {
            createUndoPoint(state)
            if (state.activeTaskIndex !== 0) {
                state.tasks = moveArrayElement(state.tasks, state.activeTaskIndex, state.activeTaskIndex - 1)
                state.activeTaskIndex--
            }
        },
    },
    taskMoveDownRequested: {
        action: createAction("taskMoveDownRequested"),
        updater: () => state => {
            createUndoPoint(state)
            if (state.activeTaskIndex !== state.tasks.length - 1) {
                state.tasks = moveArrayElement(state.tasks, state.activeTaskIndex, state.activeTaskIndex + 1)
                state.activeTaskIndex++
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
