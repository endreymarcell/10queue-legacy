import produce from "immer"
import type { WritableDraft } from "immer/dist/internal"
import type { ActionCreator, ActionCreatorWithPayload, ActionTypeFromActionCreators } from "redux-dry-ts-actions"
import { appState, appLogic } from "./logic"
import type { AppState } from "./logic"
import type { ObjValueTuple } from "$lib/utils"
import { logger } from "./logger"

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
export type AppAction = ActionTypeFromActionCreators<typeof appActions>

export function dispatch(action: AppAction) {
    logger.silly("got ACTION", action.type)
    // Another piece of bad engineering: work around Cmd.action()s cutting in front of the originating action
    // by breaking up synchronous execution. This won't get me out of having to implement effects soon.
    setTimeout(() => handleAction(action))
}

function handleAction(action: AppAction) {
    logger.debug("handling ACTION", action.type)
    appState.update(oldState => {
        logger.silly("STATE before handling", action.type, "is:", oldState)
        const newState = reducer(oldState, action)
        logger.silly("STATE after handling", action.type, "is", newState)
        return newState
    })
    logger.silly("finished handling action", action.type)
}

function reducer(state: AppState, action: AppAction): AppState {
    // this is a testable, pure function
    const event = appLogic[action.type]
    const updater = event.updater(action.payload)
    const newState = produce(state, updater)
    return newState
}
