import produce from "immer"
import type { WritableDraft } from "immer/dist/internal"
import type { ActionCreator, ActionCreatorWithPayload, ActionTypeFromActionCreators } from "redux-dry-ts-actions"
import { appLogic } from "./logic"
import { appState } from "./state"
import type { AppState } from "./state"
import type { ObjValueTuple } from "$lib/utils"

type EventPayloadType = { [key: string]: unknown }
export type EventListType = { [eventName: string]: EventPayloadType | void }
// helper type because the built-in keyof returns string | number even though I only use strings
type KeyOf<T extends Record<string, unknown>> = Extract<keyof T, string>

export type Logic<EventList extends EventListType> = {
    [eventName in KeyOf<EventList>]: {
        action: EventList[eventName] extends Record<string, unknown>
            ? ActionCreatorWithPayload<eventName, EventList[eventName], ObjValueTuple<EventList[eventName]>>
            : ActionCreator<eventName>
        updater: (payload: EventList[eventName]) => (draft: WritableDraft<AppState>) => void
    }
}

export const appActions = Object.fromEntries(
    Object.keys(appLogic).map(eventName => [eventName, appLogic[eventName].action]),
)
type AppActions = ActionTypeFromActionCreators<typeof appActions>

export function dispatch(action: AppActions) {
    // this is rather redundant, but it feels weird to update state in a function called `dispatch`
    console.log("ACTION", action.type)
    handleAction(action)
}

function handleAction(action: AppActions) {
    appState.update(oldState => {
        // console.log("STATE before:", JSON.stringify({ stack: oldState.undoStack, pointer: oldState.undoPointer }))
        const newState = reducer(oldState, action)
        // console.log("STATE after:", JSON.stringify({ stack: newState.undoStack, pointer: newState.undoPointer }))
        return newState
    })
}

function reducer(state: AppState, action: AppActions): AppState {
    // this is a testable, pure function
    const event = appLogic[action.type]
    const updater = event.updater(action.payload)
    const newState = produce(state, updater)
    return newState
}
