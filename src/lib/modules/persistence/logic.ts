import { logger } from "$lib/helpers/logger"
import { createEffect, dispatch, schedule } from "$lib/logical/logicHelpers"
import type { Logic } from "$lib/logical/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { appLogic } from "$lib/logic"
import { copySavableState } from "$lib/modules/taskList/logic/state"
import type { SavableState } from "$lib/modules/taskList/logic/state"
import type { Module } from "$lib/logical/Modules"
import { browserStorage } from "$lib/modules/persistence/storages/browserStorage"

type State = {
    isDirty: boolean
    latestLoadOrSaveTimestamp: number
}

const defaultState: State = {
    isDirty: false,
    latestLoadOrSaveTimestamp: null,
}

const effects = {
    save: (state: SavableState) =>
        createEffect(
            state => browserStorage.save(state),
            [state],
            [logic.saveSucceeded.action, logic.saveFailed.action],
        ),
    load: () => createEffect(() => browserStorage.load(), [], [logic.loadSucceeded.action, logic.loadFailed.action]),
    setupAutoSave: () => createEffect(() => window.setInterval(() => dispatch(appLogic.saveRequested.action()), 5000)),
}

type Events = {
    saveRequested: void
    saveSucceeded: void
    saveFailed: void
    loadRequested: void
    loadSucceeded: { state: SavableState }
    loadFailed: void
}

export const logic: Logic<Events> = {
    saveRequested: {
        action: createAction("saveRequested"),
        handler: () => state => {
            if (state.isDirty) {
                const stateToSave = copySavableState(state)
                schedule(effects.save(stateToSave))
            }
        },
    },
    saveSucceeded: {
        action: createAction("saveSucceeded"),
        handler: () => state => {
            state.isDirty = false
            state.latestLoadOrSaveTimestamp = Date.now()
        },
    },
    saveFailed: {
        action: createAction("saveFailed"),
        handler: () => state => state,
    },
    loadRequested: {
        action: createAction("loadRequested"),
        handler: () => () => {
            schedule(effects.load())
        },
    },
    loadSucceeded: {
        action: createAction("loadSucceeded", state => ({ state })),
        handler: payload => state => {
            const isFirstLoadToday = !isSameDay(payload.state.latestLoadOrSaveTimestamp, Date.now())
            if (!isFirstLoadToday) {
                for (const key of Object.keys(payload.state)) {
                    state[key] = payload.state[key]
                }
            }
            state.latestLoadOrSaveTimestamp = Date.now()
        },
    },
    loadFailed: {
        action: createAction("loadFailed"),
        handler: () => () => logger.error("Shit happened:"),
    },
}

function isSameDay(timestamp1: number, timestamp2: number) {
    return new Date(timestamp1).toLocaleDateString() === new Date(timestamp2).toLocaleDateString()
}

export type Persistence = { Events: Events; State: State; Effects: typeof effects }
export const persistence: Module<Persistence> = { logic, defaultState, effects }
