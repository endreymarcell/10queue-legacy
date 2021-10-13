import type { AppState } from "$lib/logic"
import { logger } from "$lib/logger"
import { createEffect, schedule } from "$lib/logicHelpers"
import type { Logic } from "$lib/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import clone from "just-clone"

const KEY = "10queue-state"

export function store(state: AppState) {
    try {
        const serializedState = JSON.stringify(state)
        window.localStorage.setItem(KEY, serializedState)
    } catch (e) {
        logger.error(e)
    }
}

export function load(): AppState {
    try {
        const serializedState = window.localStorage.getItem(KEY)
        const state = JSON.parse(serializedState)
        return state
    } catch (e) {
        logger.error(e)
    }
}

const effects = {
    save: (state: AppState) =>
        createEffect(
            state =>
                new Promise<void>(resolve => {
                    store(state)
                    resolve()
                }),
            [state],
        ),
    load: () =>
        createEffect(
            () =>
                new Promise(resolve => {
                    const state = load()
                    resolve(state)
                }),
            [],
            [logic.loadSucceeded.action, logic.loadFailed.action],
        ),
}

type Events = {
    saveRequested: void
    loadRequested: void
    loadSucceeded: { state: AppState }
    loadFailed: void
}

export const logic: Logic<Events> = {
    saveRequested: {
        action: createAction("saveRequested"),
        updater: () => state => {
            const stateToSave = clone(state)
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
        updater: payload => () => payload.state,
    },
    loadFailed: {
        action: createAction("loadFailed"),
        updater: () => () => logger.error("Shit happened:"),
    },
}

export type Persistence = { Events: Events }
export const persistence = { logic }
