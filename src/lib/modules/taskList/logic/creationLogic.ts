import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/modules/undo/logic"
import { createTask } from "$lib/modules/taskList/tasks"
import type { Module } from "$lib/modules/Modules"

type Events = {
    taskCreateNewBelowActiveRequested: void
    taskCreateNewAboveActiveRequested: void
    taskCreateAtIndex: { index: number }
}

const logic: Logic<Events> = {
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
            if (state.tasks.length === 0) {
                state.activeTaskIndex = 0
                state.tasks = [createTask("")]
            } else {
                state.tasks.splice(state.activeTaskIndex + 1, 0, createTask(""))
                state.activeTaskIndex++
            }
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
}

export type Creation = { Events: Events }
export const creation: Module<Creation> = { logic }