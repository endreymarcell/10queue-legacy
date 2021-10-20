import { logger } from "$lib/helpers/logger"
import { createEffect, dispatch, schedule } from "$lib/helpers/logicHelpers"
import type { Logic } from "$lib/helpers/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import { appLogic } from "$lib/logic"
import { copySaveableState } from "$lib/modules/taskList/logic/state"
import type { SaveableState } from "$lib/modules/taskList/logic/state"
import type { Module } from "$lib/modules/Modules"

const KEY = "10queue-state"

export function store(state: SaveableState) {
    const serializedState = JSON.stringify(state)
    window.localStorage.setItem(KEY, serializedState)
}

export function load(): SaveableState {
    const serializedState = window.localStorage.getItem(KEY)
    const state = JSON.parse(serializedState)
    if (state === null) {
        throw new Error("No saved state found")
    } else {
        return state
    }
}

const effects = {
    save: (state: SaveableState) => createEffect(state => store(state), [state]),
    load: () => createEffect(() => load(), [], [logic.loadSucceeded.action, logic.loadFailed.action]),
}

type Events = {
    saveRequested: void
    loadRequested: void
    loadSucceeded: { state: SaveableState }
    loadFailed: void
}

export const logic: Logic<Events> = {
    saveRequested: {
        action: createAction("saveRequested"),
        updater: () => state => {
            const stateToSave = copySaveableState(state)
            schedule(effects.save(stateToSave))
        },
    },
    loadRequested: {
        action: createAction("loadRequested"),
        updater: () => () => {
            schedule(effects.load())
        },
    },
    loadSucceeded: {
        action: createAction("loadSucceeded", state => ({ state })),
        updater: payload => state => {
            for (const key of Object.keys(payload.state)) {
                state[key] = payload.state[key]
            }
        },
    },
    loadFailed: {
        action: createAction("loadFailed"),
        updater: () => () => logger.error("Shit happened:"),
    },
}

export function setupAutoSave() {
    window.setInterval(() => dispatch(appLogic.saveRequested.action()), 5000)
}

export type Persistence = { Events: Events }
export const persistence: Module<Persistence> = { logic }
