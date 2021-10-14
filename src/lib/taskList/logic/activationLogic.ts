import type { Shortcut } from "$lib/keyboardShortcuts/logic"
import type { Logic } from "$lib/logicHelpers"
import { createAction } from "redux-dry-ts-actions"

export type ActivationEvents = {
    taskActivatePreviousRequested: void
    taskActivateNextRequested: void
    taskActiveteFirstRequested: void
    taskActivateLastRequested: void
}

export const activationLogic: Logic<ActivationEvents> = {
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
}

export const activationShortcuts: Shortcut[] = [
    { key: "j", action: activationLogic.taskActivateNextRequested.action, isDisabledDuringTextInput: true },
    { key: "k", action: activationLogic.taskActivatePreviousRequested.action, isDisabledDuringTextInput: true },
    { key: "g", action: activationLogic.taskActiveteFirstRequested.action, isDisabledDuringTextInput: true },
    { key: "G", action: activationLogic.taskActivateLastRequested.action, isDisabledDuringTextInput: true },
]
