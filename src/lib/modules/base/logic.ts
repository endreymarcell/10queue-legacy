import type { SavableState } from "$lib/modules/taskList/logic/state"
import type { Logic } from "$lib/logical/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import clone from "just-clone"
import { schedule } from "$lib/logical/logicHelpers"
import { effects } from "$lib/effects"
import type { Module } from "$lib/logical/Modules"

type State = {
    hasMounted: boolean
}

const defaultState: State = {
    hasMounted: false,
}

type Events = {
    onMount: { state: SavableState }
}

const logic: Logic<Events> = {
    onMount: {
        action: createAction("onMount", state => ({ state })),
        handler: payload => state => {
            state.hasMounted = true
            state.tasks = clone(payload.state.tasks)
            state.hasDatabaseAccess = true // TODO detect logged-in status
            schedule(effects.setupListenersAndStuff())
        },
    },
}

export type Base = { State: State; Events: Events }
export const base: Module<Base> = { defaultState, logic }
