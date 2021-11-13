import type { Logic } from "$lib/logical/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/modules/undo/logic"
import { defaultState } from "$lib/modules/taskList/logic/state"
import type { State } from "$lib/modules/taskList/logic/state"
import type { Activation } from "$lib/modules/taskList/logic/activationLogic"
import { activation } from "$lib/modules/taskList/logic/activationLogic"
import type { Counter } from "$lib/modules/taskList/logic/counterLogic"
import { counter } from "$lib/modules/taskList/logic/counterLogic"
import { schedule } from "$lib/logical/logicHelpers"
import { effects } from "$lib/effects"
import { DEFAULT_PAGE_TITLE } from "$lib/helpers/const"
import { getStyleForName } from "./taskColors"
import type { Module } from "$lib/logical/Modules"
import type { Creation } from "$lib/modules/taskList/logic/creationLogic"
import { creation } from "$lib/modules/taskList/logic/creationLogic"
import type { Moving } from "$lib/modules/taskList/logic/movingLogic"
import { moving } from "$lib/modules/taskList/logic/movingLogic"
import { isEmpty } from "$lib/helpers/utils"

type Events = {
    startedEditingTaskTitle: void
    stoppedEditingTaskTitle: { newTitle: string }
    taskClicked: { index: number }
    taskDeleteRequested: void
    taskStartStopRequested: void
    taskFinishRequested: void
} & Activation["Events"] &
    Counter["Events"] &
    Creation["Events"] &
    Moving["Events"]

const logic: Logic<Events> = {
    taskClicked: {
        action: createAction("taskClicked", index => ({ index })),
        handler: payload => state => {
            state.activeTaskIndex = payload.index
        },
    },
    startedEditingTaskTitle: {
        action: createAction("startedEditingTaskTitle"),
        handler: () => state => {
            if (state.tasks.length > 0) {
                state.isEditingTaskTitle = true
                state.isTextInputFocused = true
            }
        },
    },
    stoppedEditingTaskTitle: {
        action: createAction("stoppedEditingTaskTitle", newTitle => ({ newTitle })),
        handler: payload => state => {
            state.isEditingTaskTitle = false
            state.isTextInputFocused = false
            if (state.isAddingNewTask) {
                if (isEmpty(payload.newTitle)) {
                    state.tasks.splice(state.activeTaskIndex, 1)
                    state.activeTaskIndex = state.tasks.length > 0 ? state.tasks.length - 1 : null
                } else {
                    const task = state.tasks[state.activeTaskIndex]
                    task.title = payload.newTitle
                    task.style = getStyleForName(payload.newTitle)
                }
                state.isAddingNewTask = false
            } else {
                if (!isEmpty(payload.newTitle)) {
                    registerDocumentChange(state)
                    const task = state.tasks[state.activeTaskIndex]
                    task.title = payload.newTitle
                }
            }
        },
    },
    taskDeleteRequested: {
        action: createAction("taskDeleteRequested"),
        handler: () => state => {
            if (state.isRunning) {
                return
            }
            registerDocumentChange(state)
            state.tasks.splice(state.activeTaskIndex, 1)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = null
            } else if (state.activeTaskIndex === state.tasks.length) {
                state.activeTaskIndex--
            }
        },
    },
    taskStartStopRequested: {
        action: createAction("taskStartStopRequested"),
        handler: () => state => {
            state.isRunning = !state.isRunning
            const task = state.tasks[state.activeTaskIndex]
            let newTitle
            if (state.isRunning) {
                newTitle = `10Q: ${task.title}`
                task.startTimestampOfCurrentRun = Date.now()
                schedule(counter.effects.scheduleNextTick())
            } else {
                newTitle = DEFAULT_PAGE_TITLE
                task.secondsSpentInPreviousRuns += task.secondsSpentInCurrentRun
                task.secondsSpentInCurrentRun = 0
                task.startTimestampOfCurrentRun = null
            }
            state.activeTaskIndex = 0
            schedule(effects.changePageTitle(newTitle))
        },
    },
    taskFinishRequested: {
        action: createAction("taskFinishRequested"),
        handler: () => state => {
            registerDocumentChange(state)
            state.tasks.splice(state.activeTaskIndex, 1)
            if (state.tasks.length === 0) {
                state.activeTaskIndex = null
            }
            state.isRunning = false
        },
    },
    ...activation.logic,
    ...counter.logic,
    ...creation.logic,
    ...moving.logic,
}

export function registerDocumentChange(state) {
    createUndoPoint(state)
    state.isDirty = true
}

export type TaskList = { State: State; Events: Events }
export const taskList: Module<TaskList> = { defaultState, logic }
