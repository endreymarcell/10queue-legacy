import { createTask } from "$lib/taskList/tasks"
import type { Logic } from "../logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/undo/logic"
import { moveArrayElement } from "$lib/utils"
import { defaultState } from "$lib/taskList/logic/state"
import type { State } from "$lib/taskList/logic/state"
import type { ActivationEvents } from "$lib/taskList/logic/activationLogic"
import { activationLogic } from "$lib/taskList/logic/activationLogic"
import { schedule } from "../logicHelpers"
import { effects } from "$lib/effects"
import { DEFAULT_PAGE_TITLE } from "$lib/const"
import { getStyleForName } from "./taskColors"

type Events = {
    startedEditingTaskTitle: void
    stoppedEditingTaskTitle: { newTitle: string | undefined }
    taskClicked: { index: number }
    taskDeleteRequested: void
    taskStartStopRequested: void
    taskFinishRequested: void
    taskMoveUpRequested: void
    taskMoveDownRequested: void
    taskCreateNewBelowActiveRequested: void
    taskCreateNewAboveActiveRequested: void
    taskCreateAtIndex: { index: number }
} & ActivationEvents

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
            state.isTextInputFocused = false
            if (payload.newTitle !== undefined) {
                if (payload.newTitle === "" && state.isAddingNewTask) {
                    state.tasks.splice(state.activeTaskIndex, 1)
                } else {
                    createUndoPoint(state)
                    const task = state.tasks[state.activeTaskIndex]
                    task.title = payload.newTitle
                    if (state.isAddingNewTask) {
                        task.style = getStyleForName(payload.newTitle)
                    }
                }
            }
            state.isAddingNewTask = false
        },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested"),
        updater: () => state => {
            if (state.isRunning) {
                return
            }
            createUndoPoint(state)
            state.tasks.splice(state.activeTaskIndex, 1)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = undefined
            } else if (state.activeTaskIndex === state.tasks.length) {
                state.activeTaskIndex--
            }
        },
    },
    taskStartStopRequested: {
        action: createAction("taskStartStopRequested"),
        updater: () => state => {
            state.isRunning = !state.isRunning
            state.activeTaskIndex = 0
            const newTitle = state.isRunning ? `10Q: ${state.tasks[state.activeTaskIndex].title}` : DEFAULT_PAGE_TITLE
            schedule(effects.changePageTitle(newTitle))
        },
    },
    taskFinishRequested: {
        action: createAction("taskFinishRequested"),
        updater: () => state => {
            createUndoPoint(state)
            state.tasks.splice(state.activeTaskIndex, 1)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = null
            }
            state.isRunning = false
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
            state.isAddingNewTask = true
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
            state.isAddingNewTask = true
            state.isEditingTaskTitle = true
            state.isTextInputFocused = true
        },
    },
    taskCreateAtIndex: {
        action: createAction("taskCreateAtIndex", index => ({ index })),
        updater: payload => state => {
            if (state.isRunning) {
                return
            }
            if (state.tasks.length === 10) {
                return
            }
            createUndoPoint(state)
            state.activeTaskIndex = payload.index
            state.tasks.splice(payload.index, 0, createTask(""))
            state.isAddingNewTask = true
            state.isEditingTaskTitle = true
            state.isTextInputFocused = true
        },
    },
    ...activationLogic,
}

export type TaskList = { State: State; Events: Events }
export const taskList = { defaultState, logic }
