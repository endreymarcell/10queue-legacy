import type { Logic } from "$lib/logicHelpers"
import { createAction } from "redux-dry-ts-actions"

type State = {
    isHelpModalOpen: boolean
}

const defaultState: State = {
    isHelpModalOpen: false,
}

type Events = {
    helpIconClicked: void
    clickedOutside: void
}

const logic: Logic<Events> = {
    helpIconClicked: {
        action: createAction("helpIconClicked"),
        updater: () => state => {
            state.isHelpModalOpen = true
        },
    },
    clickedOutside: {
        action: createAction("clickedOutside"),
        updater: () => state => {
            state.isHelpModalOpen = false
        },
    },
}

export type HelpModal = { State: State; Events: Events }
export const helpModal = { logic, defaultState }
