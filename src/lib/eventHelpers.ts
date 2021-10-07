import produce from "immer"
import type { WritableDraft } from "immer/dist/internal"
import type { ActionCreator, ActionCreatorWithPayload, ActionTypeFromActionCreators } from "redux-dry-ts-actions"
import { appLogic } from "./logic"
import { appState } from "./state"
import type { AppEvents } from "./logic"
import type { AppState } from "./state"
import type { ObjValueTuple } from "$lib/utils"

export type Logic = {
    [eventName in keyof AppEvents]: {
        action: AppEvents[eventName] extends Record<string, unknown>
            ? ActionCreatorWithPayload<eventName, AppEvents[eventName], ObjValueTuple<AppEvents[eventName]>>
            : ActionCreator<eventName>
        updater: (payload: AppEvents[eventName]) => (draft: WritableDraft<AppState>) => void
    }
}

export const appActions = Object.fromEntries(
    Object.keys(appLogic).map(eventName => [eventName, appLogic[eventName].action]),
)
type AppActions = ActionTypeFromActionCreators<typeof appActions>

export function dispatch(action: AppActions) {
    // this is rather redundant, but it feels weird to update state in a function called `dispatch`
    handleAction(action)
}

function handleAction(action: AppActions) {
    appState.update(oldState => reducer(oldState, action))
}

function reducer(state: AppState, action: AppActions): AppState {
    // this is a testable, pure function
    const event = appLogic[action.type]
    const updater = event.updater(action.payload)
    const newState = produce(state, updater)
    return newState
}
