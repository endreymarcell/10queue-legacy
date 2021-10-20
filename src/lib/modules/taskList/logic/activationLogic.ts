import type { Shortcut } from "$lib/modules/keyboardShortcuts/logic"
import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import type { Module } from "$lib/modules/Modules"

type Events = {
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void
    taskActivateFirstRequested: void
    taskActivateLastRequested: void
}

const logic: Logic<Events> = {
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
    taskActivateFirstRequested: {
        action: createAction("taskActivateFirstRequested"),
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
}

const shortcuts: Shortcut[] = [
    { key: "j", action: logic.taskActivateNextRequested.action, isDisabledDuringTextInput: true },
    { key: "k", action: logic.taskActivatePreviousRequested.action, isDisabledDuringTextInput: true },
    { key: "g", action: logic.taskActivateFirstRequested.action, isDisabledDuringTextInput: true },
    { key: "G", action: logic.taskActivateLastRequested.action, isDisabledDuringTextInput: true },
]

export type Activation = { Events: Events }
export const activation: Module<Activation> = { logic, shortcuts }
