import { createAction } from "redux-dry-ts-actions"
import { createUndoPoint } from "$lib/modules/undo/logic"
import { moveArrayElement } from "$lib/helpers/utils"
import type { Logic } from "$lib/logical/logicHelpers"
import type { Module } from "$lib/logical/Modules"
import { registerDocumentChange } from "../logic"

type Events = {
    taskMoveUpRequested: void
    taskMoveDownRequested: void
}

const logic: Logic<Events> = {
    taskMoveUpRequested: {
        action: createAction("taskMoveUpRequested"),
        handler: () => state => {
            if (state.isRunning) {
                return
            }
            registerDocumentChange(state)
            if (state.activeTaskIndex !== 0) {
                state.tasks = moveArrayElement(state.tasks, state.activeTaskIndex, state.activeTaskIndex - 1)
                state.activeTaskIndex--
            }
        },
    },
    taskMoveDownRequested: {
        action: createAction("taskMoveDownRequested"),
        handler: () => state => {
            if (state.isRunning) {
                return
            }
            registerDocumentChange(state)
            if (state.activeTaskIndex !== state.tasks.length - 1) {
                state.tasks = moveArrayElement(state.tasks, state.activeTaskIndex, state.activeTaskIndex + 1)
                state.activeTaskIndex++
            }
        },
    },
}

const shortcuts = [
    { key: "J", action: logic.taskMoveDownRequested.action, isDisabledDuringTextInput: true },
    { key: "K", action: logic.taskMoveUpRequested.action, isDisabledDuringTextInput: true },
]

export type Moving = { Events: Events }
export const moving: Module<Moving> = { logic, shortcuts }
