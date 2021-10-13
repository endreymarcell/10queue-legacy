import type { Task } from "$lib/taskList/tasks"
import { createTask, defaultTasks } from "$lib/taskList/tasks"
import type { Logic } from "../logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/undo/logic"
import { moveArrayElement } from "$lib/utils"

type State = {
    tasks: Task[]
    activeTaskIndex: number | undefined
    isEditingTaskTitle: boolean
    isRunning: boolean
}

const defaultState: State = {
    tasks: defaultTasks,
    activeTaskIndex: 0,
    isEditingTaskTitle: false,
    isRunning: false,
}

type Events = {
    startedEditingTaskTitle: void
    stoppedEditingTaskTitle: { newTitle: string | undefined }
    taskClicked: { index: number }
    taskDeleteRequested: void
    taskStartStopRequested: void
    taskMoveUpRequested: void
    taskMoveDownRequested: void
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void
    taskCreateNewBelowActiveRequested: void
    taskCreateNewAboveActiveRequested: void
    taskActiveteFirstRequested: void
    taskActivateLastRequested: void
}

const logic: Logic<Events> = {
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        updater: payload => state => {
            state.activeTaskIndex = payload.index
        },
    },
    startedEditingTaskTitle: {
        action: createAction("startedEditingTaskTitle"),
        updater: () => state => {
            state.isEditingTaskTitle = true
            state.isTextInputFocused = true
        },
    },
    stoppedEditingTaskTitle: {
        action: createAction("stoppedEditingTaskTitle", newTitle => ({ newTitle })),
        updater: payload => state => {
            state.isEditingTaskTitle = false
            if (payload.newTitle !== undefined) {
                createUndoPoint(state)
                state.tasks[state.activeTaskIndex].title = payload.newTitle
                state.isTextInputFocused = false
            }
        },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            createUndoPoint(state)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = undefined
            } else if (state.activeTaskIndex === state.tasks.length - 1) {
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
            if (state.isRunning) {
                return
            }
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
            if (state.isRunning) {
                return
            }
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
            if (state.isRunning) {
                return
            }
            if (state.activeTaskIndex !== 0) {
                state.activeTaskIndex--
            }
        },
    },
    taskActivateNextRequested: {
        action: createAction("taskActivateNextRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            if (state.activeTaskIndex !== state.tasks.length - 1) {
                state.activeTaskIndex++
            }
        },
    },
    taskActiveteFirstRequested: {
        action: createAction("taskActiveteFirstRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            state.activeTaskIndex = 0
        },
    },
    taskActivateLastRequested: {
        action: createAction("taskActivateLastRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            state.activeTaskIndex = state.tasks.length - 1
        },
    },
    taskCreateNewBelowActiveRequested: {
        action: createAction("taskCreateNewBelowActiveRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            if (state.tasks.length === 10) {
                return
            }
            createUndoPoint(state)
            state.tasks.splice(state.activeTaskIndex + 1, 0, createTask(""))
            state.activeTaskIndex++
            state.isEditingTaskTitle = true
            state.isTextInputFocused = true
        },
    },
    taskCreateNewAboveActiveRequested: {
        action: createAction("taskCreateNewAboveActiveRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            if (state.tasks.length === 10) {
                return
            }
            createUndoPoint(state)
            state.tasks.splice(state.activeTaskIndex, 0, createTask(""))
            state.isEditingTaskTitle = true
            state.isTextInputFocused = true
        },
    },
}

export type TaskList = { State: State; Events: Events }
export const taskList = { defaultState, logic }
