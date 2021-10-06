import produce from "immer"
import type { WritableDraft } from "immer/dist/internal"
import type { ActionCreator, ActionCreatorWithPayload, ActionTypeFromActionCreators } from "redux-dry-ts-actions"
import { logic } from "./events"
import { state } from "./state"
import type { Events } from "./events"
import type { State } from "./state"

// TODO should convert interface to tuple for the ActionCreatorWithPayload interface, no luck so far
type TODO = any

export type Logic = {
    [eventName in keyof Events]: {
        action: Events[eventName] extends Object
            ? ActionCreatorWithPayload<eventName, Events[eventName], TODO>
            : ActionCreator<eventName>
        updater: (payload: Events[eventName]) => (draft: WritableDraft<State>) => void
    }
}

export const actions = Object.fromEntries(Object.keys(logic).map(eventName => [eventName, logic[eventName].action]))
type Action = ActionTypeFromActionCreators<typeof actions>

export function dispatch(action: Action) {
    // this is rather redundant, but it feels weird to update state in a function called `dispatch`
    handleAction(action)
}

function handleAction(action: Action) {
    state.update(oldState => reducer(oldState, action))
}

function reducer(state: State, action: Action): State {
    // this is a testable, pure function
    const event = logic[action.type]
    const updater = event.updater(action.payload)
    const newState = produce(state, updater)
    return newState
}
