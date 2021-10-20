import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/modules/undo/logic"
import { defaultState } from "$lib/modules/taskList/logic/state"
import type { State } from "$lib/modules/taskList/logic/state"
import type { Activation } from "$lib/modules/taskList/logic/activationLogic"
import { activation } from "$lib/modules/taskList/logic/activationLogic"
import type { Counter } from "$lib/modules/taskList/logic/counterLogic"
import { counter } from "$lib/modules/taskList/logic/counterLogic"
import { schedule } from "$lib/helpers/logicHelpers"
import { effects } from "$lib/effects"
import { DEFAULT_PAGE_TITLE } from "$lib/helpers/const"
import { getStyleForName } from "./taskColors"
import type { Module } from "$lib/modules/Modules"
import type { Creation } from "$lib/modules/taskList/logic/creationLogic"
import { creation } from "$lib/modules/taskList/logic/creationLogic"
import type { Moving } from "$lib/modules/taskList/logic/movingLogic"
import { moving } from "$lib/modules/taskList/logic/movingLogic"

type Events = {
    startedEditingTaskTitle: void
    stoppedEditingTaskTitle: { newTitle: string | undefined }
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
        updater: payload => state => {
            state.activeTaskIndex = payload.index
        },
    },
    startedEditingTaskTitle: {
        action: createAction("startedEditingTaskTitle"),
        updater: () => state => {
            if (state.tasks.length > 0) {
                state.isEditingTaskTitle = true
                state.isTextInputFocused = true
            }
        },
    },
    stoppedEditingTaskTitle: {
        action: createAction("stoppedEditingTaskTitle", newTitle => ({ newTitle })),
        updater: payload => state => {
            state.isEditingTaskTitle = false
            state.isTextInputFocused = false
            if (payload.newTitle === undefined || payload.newTitle === "") {
                if (state.isAddingNewTask) {
                    state.tasks.splice(state.activeTaskIndex, 1)
                }
            } else {
                createUndoPoint(state)
                const task = state.tasks[state.activeTaskIndex]
                task.title = payload.newTitle
                if (state.isAddingNewTask) {
                    task.style = getStyleForName(payload.newTitle)
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
                state.activeTaskIndex = null
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
            schedule(counter.effects.scheduleNextTick())
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
    ...activation.logic,
    ...counter.logic,
    ...creation.logic,
    ...moving.logic,
}

export type TaskList = { State: State; Events: Events }
export const taskList: Module<TaskList> = { defaultState, logic }
