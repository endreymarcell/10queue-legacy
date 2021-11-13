import type { Logic } from "$lib/logical/logicHelpers"
import { createAction } from "redux-dry-ts-actions"
import type { Module } from "$lib/logical/Modules"

type State = {
    isHelpModalOpen: boolean
}

const defaultState: State = {
    isHelpModalOpen: false,
}

type Events = {
    openHelpModalRequested: void
    closeHelpModalRequested: void
}

const logic: Logic<Events> = {
    openHelpModalRequested: {
        action: createAction("openHelpModalRequested"),
        handler: () => state => {
            state.isHelpModalOpen = true
        },
    },
    closeHelpModalRequested: {
        action: createAction("closeHelpModalRequested"),
        handler: () => state => {
            state.isHelpModalOpen = false
        },
    },
}

export type HelpModal = { State: State; Events: Events }
export const helpModal: Module<HelpModal> = { logic, defaultState }
